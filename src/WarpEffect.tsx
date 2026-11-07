import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type WarpEffectProps = {
  /** Normalized travel progress. The camera controller owns time and cancellation. */
  progressRef: { readonly current: number }
  active: boolean
  reducedMotion: boolean
  quality?: 'balanced' | 'cinematic'
}

// Original procedural effect. No image assets, sampled film frames, or copied shaders.
// Clip-space placement deliberately decouples the effect from the schematic's world scale.
const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uProgress;
uniform float uAspect;
uniform float uCinematic;

float randomValue(float n) { return fract(sin(n * 127.173 + 19.71) * 43758.5453); }

// Each angular lane carries one moving, stretched star. Different lane lengths
// and speeds prevent a solid pinwheel or strobing concentric bands.
float starLayer(vec2 p, float travel, float stretch, float lanes, float seed) {
  float radius = length(p);
  float angle = atan(p.y, p.x) / 6.2831853 + 0.5;
  float lane = floor(angle * lanes);
  float jitter = randomValue(lane + seed);
  float across = abs(fract(angle * lanes) - (0.2 + jitter * 0.6));
  float width = mix(0.018, 0.065, randomValue(lane + seed + 51.0));
  float line = 1.0 - smoothstep(width, width + 0.045, across);
  float head = fract(jitter + travel * (0.37 + randomValue(lane + seed + 12.0) * 0.63)) * 2.1;
  float tailLength = mix(0.012, 0.44, stretch) * (0.4 + jitter);
  float tail = smoothstep(head - tailLength, head, radius)
             * (1.0 - smoothstep(head, head + 0.018, radius));
  return line * tail * smoothstep(0.12, 0.35, radius);
}

void main() {
  float t = clamp(uProgress, 0.0, 1.0);
  float arrival = 1.0 - smoothstep(0.72, 1.0, t);
  float envelope = smoothstep(0.0, 0.16, t) * arrival;
  vec2 p = (vUv - 0.5) * 2.0;
  p.x *= uAspect;
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float acceleration = smoothstep(0.04, 0.46, t);
  float travel = t * 0.25 + t * t * 2.1;
  float stars = starLayer(p, travel, acceleration, 173.0, 7.0);
  stars += starLayer(p, travel * 0.74, acceleration * 0.85, 113.0, 91.0) * 0.65;
  if (uCinematic > 0.5) {
    stars += starLayer(p, travel * 1.2, acceleration, 241.0, 183.0) * 0.42;
  }

  float tunnelPhase = smoothstep(0.17, 0.43, t) * arrival;
  float hollow = smoothstep(0.10, 0.48, radius);
  float outerFade = 1.0 - smoothstep(1.0, 2.3, radius);
  float filaments = pow(0.5 + 0.5 * sin(angle * 37.0 + sin(angle * 11.0) * 2.0 + radius * 2.4 - travel * 1.3), 10.0);
  float secondFilaments = pow(0.5 + 0.5 * sin(angle * 61.0 - radius * 3.2 + travel), 18.0);
  float mist = hollow * outerFade * (0.10 + filaments * 0.32 + secondFilaments * 0.12) * tunnelPhase;
  // Broad, restrained arrival halo: fades away instead of flashing white.
  float haloRadius = mix(0.28, 1.45, smoothstep(0.62, 1.0, t));
  float halo = exp(-pow((radius - haloRadius) * 5.0, 2.0))
             * smoothstep(0.58, 0.76, t) * arrival * 0.13;
  vec3 cyan = vec3(0.12, 0.62, 0.82);
  vec3 ice = vec3(0.70, 0.90, 1.0);
  vec3 energy = cyan * mist + ice * stars * envelope * 0.65 + cyan * halo;
  float alpha = min(0.68, max(energy.r, max(energy.g, energy.b)));
  if (alpha < 0.001) discard;
  gl_FragColor = vec4(energy / max(alpha, 0.001), alpha);
}
`

/** One draw call in the existing Canvas; DOM labels/HUD remain above it. */
export default function WarpEffect({ progressRef, active, reducedMotion, quality = 'balanced' }: WarpEffectProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uAspect: { value: 1 },
    uCinematic: { value: 0 },
  }), [])

  useFrame(({ size }) => {
    const raw = progressRef.current
    const progress = Number.isFinite(raw) ? THREE.MathUtils.clamp(raw, 0, 1) : 0
    if (mesh.current) mesh.current.visible = active && !reducedMotion && progress > 0 && progress < 1
    // R3F may copy the uniforms supplied as props. Mutate the live material,
    // not the initialization object, so the GPU sees each progress update.
    if (material.current) {
      material.current.uniforms.uProgress.value = progress
      material.current.uniforms.uAspect.value = size.width / Math.max(1, size.height)
      material.current.uniforms.uCinematic.value = quality === 'cinematic' ? 1 : 0
    }
  })

  // Declarative geometry/material are owned and disposed by R3F on unmount.
  // No independent clock, RAF, render target, or invalidation loop to leak on cancel.
  return <mesh ref={mesh} visible={false} frustumCulled={false} renderOrder={1000} raycast={() => undefined}>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms}
      transparent depthTest={false} depthWrite={false} toneMapped={false} />
  </mesh>
}
