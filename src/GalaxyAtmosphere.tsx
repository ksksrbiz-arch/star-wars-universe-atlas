import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

export type GalaxyQuality = 'balanced' | 'cinematic'

// Decorative, seeded geometry. Neither the arms nor these stars encode map positions.
const vertex = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`
const fragment = `
varying vec2 vUv;
uniform float detail;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float n=noise(p)*.55; p=mat2(.8,-.6,.6,.8)*p*2.1; n+=noise(p)*.28; p*=2.13; n+=noise(p)*.12; return n;}
void main(){
 vec2 p=(vUv-.5)*2.; p=mat2(.94,-.342,.342,.94)*p; p.y*=1.22;
 float r=length(p), a=atan(p.y,p.x);
 float grain=fbm(p*25.);
 // Broken, feathered arms keep the decorative disc from reading as solid rings.
 float turbulence=fbm(p*12.+vec2(3.,17.));
 float spiral=a*3.+r*17.-grain*2.8-turbulence*.85;
 float arms=pow(.5+.5*sin(spiral),5.);
 float rim=pow(.5+.5*sin(spiral-.65),9.);
 float disc=exp(-r*2.7)*(1.-smoothstep(.5,1.,r));
 float lanes=pow(.5+.5*sin(spiral+.42+noise(p*63.)*.6),12.);
 float wisps=fbm(p*48.+vec2(8.,2.));
 float veil=fbm(p*9.+vec2(15.,7.))*exp(-r*r*2.8);
 vec3 c=vec3(.009,.019,.031);
 c+=vec3(.105,.23,.29)*veil*.24;
 c+=vec3(.12,.30,.66)*arms*disc*(.18+grain*.83)*.9;
 c+=vec3(.17,.46,.59)*rim*disc*(.15+wisps)*.58;
 c*=1.-lanes*disc*.66;
 // Cool hydrogen clouds and warm star-forming knots: illustrative, not locations.
 float knots=pow(max(0.,wisps-.32)*2.2,3.);
 float clouds=grain*grain;
 c+=vec3(.24,.38,.52)*clouds*arms*disc*.32;
 c+=vec3(.48,.22,.13)*knots*rim*disc*.6;
 float halo=exp(-r*r*5.)*(1.-exp(-r*r*22.));
 c+=vec3(.18,.22,.31)*halo*.08;
 c+=vec3(.18,.26,.32)*exp(-r*r*8.)*.16;
 c+=vec3(.84,.64,.39)*exp(-r*r*95.)*.7;
 c+=vec3(1.45,1.22,.88)*exp(-r*r*650.)*.63;
 if(detail>.5) c+=vec3(.32,.43,.47)*pow(noise(p*190.),16.)*disc*.24;
 gl_FragColor=vec4(c,1.);
}`

const pointVertex = `
attribute float pointSize;
attribute vec3 tint;
varying vec3 vTint;
varying float vSize;
uniform float pixelRatio;
void main(){vTint=tint; vSize=pointSize; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); gl_PointSize=pointSize*pixelRatio;}
`
const pointFragment = `
varying vec3 vTint;
varying float vSize;
void main(){float r=length(gl_PointCoord-.5)*2.; if(r>1.) discard;
float halo=exp(-r*r*5.5)*.38; float core=exp(-r*r*39.);
vec2 q=abs(gl_PointCoord-.5)*2.;
float rays=(exp(-q.x*55.)*exp(-q.y*4.)+exp(-q.y*55.)*exp(-q.x*4.))*.12;
gl_FragColor=vec4(vTint,halo+core*.62+rays*step(3.,vSize));}
`

export default function GalaxyAtmosphere({ quality = 'balanced', reducedMotion }: { quality?: GalaxyQuality; reducedMotion: boolean }) {
  const { size, gl } = useThree()
  const cinematic = quality === 'cinematic' && size.width >= 900 && !reducedMotion
  const count = cinematic ? 6500 : 2600
  const particles = useMemo(() => {
    let seed = 87421
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const gold = new THREE.Color('#bda076'), blue = new THREE.Color('#7ba6bc'), tint = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const radius = Math.pow(random(), .67) * .9
      const arm = i % 3
      const spread = (random() + random() - 1) * (.07 + radius * .19)
      // Same broad arm orientation as the shader, with independent soft scatter.
      const angle = (Math.PI / 2 + arm * Math.PI * 2 - radius * 17) / 3 + spread
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius / 1.22
      positions[i * 3] = (x * .94 + y * .342) * 18.5
      positions[i * 3 + 1] = (-x * .342 + y * .94) * 15.5
      positions[i * 3 + 2] = -1.35 + random() * .16
      tint.copy(gold).lerp(blue, random() > .72 ? .86 : random() * .35).multiplyScalar(.48 + random() * .6)
      colors.set([tint.r, tint.g, tint.b], i * 3)
      sizes[i] = random() > .985 ? 3.5 : .7 + random() * 1.25
    }
    return { positions, colors, sizes }
  }, [count])
  const dustUniforms = useMemo(() => ({ detail: { value: cinematic ? 1 : 0 } }), [cinematic])
  const starUniforms = useMemo(() => ({ pixelRatio: { value: gl.getPixelRatio() } }), [gl, size.width, size.height, quality])
  return <>
    <mesh position={[0, 0, -2]} raycast={() => {}}>
      <planeGeometry args={[37, 31]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={dustUniforms} toneMapped={false} />
    </mesh>
    <points raycast={() => {}}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-tint" args={[particles.colors, 3]} />
        <bufferAttribute attach="attributes-pointSize" args={[particles.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={pointVertex} fragmentShader={pointFragment} uniforms={starUniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
    {cinematic && <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom intensity={.3} luminanceThreshold={1} luminanceSmoothing={.15} mipmapBlur levels={4} />
    </EffectComposer>}
  </>
}
