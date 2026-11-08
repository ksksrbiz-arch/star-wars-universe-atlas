import { lazy, Suspense, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
// Balanced, narrow and reduced-motion maps do not download the optional effect stack.
// A failed enhancement request must leave the base map usable.
const CinematicBloom = lazy(() => import('./CinematicBloom').catch(() => ({ default: () => <></> })))
import * as THREE from 'three'

export type GalaxyQuality = 'balanced' | 'cinematic'

// Decorative, seeded geometry. Neither the arms nor these stars encode map positions.
const vertex = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`
const cloudNoise = `
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float n=0.,w=.52;for(int i=0;i<5;i++){n+=noise(p)*w;p=mat2(.8,-.6,.6,.8)*p*2.13+vec2(8.7,3.2);w*=.48;}return n;}
vec2 discPoint(vec2 uv){vec2 p=(uv-.5)*2.;p=mat2(.94,-.342,.342,.94)*p;p.y*=1.22;return p;}
`
const fragment = `
varying vec2 vUv;
uniform float detail;
${cloudNoise}
void main(){
 vec2 p=discPoint(vUv);float r=length(p),a=atan(p.y,p.x);
 float envelope=exp(-r*1.55)*(1.-smoothstep(.65,1.04,r));
 float broad=fbm(p*7.+vec2(1.,19.));
 float cloud=fbm(p*36.+broad*2.7);
 float fine=fbm(p*115.);
 float phase=a*3.+r*17.-broad*2.2;
 float arm=pow(.5+.5*sin(phase),3.2);
 float feather=pow(.5+.5*sin(phase-.65),8.);
 float ridge=smoothstep(.29,.74,cloud);
 float filaments=pow(1.-abs(cloud*2.-1.),7.);
 float split=pow(.5+.5*sin(phase+.32+cloud*2.1),10.);
 float stars=pow(noise(p*420.),26.);
 vec3 cool=mix(vec3(.025,.07,.21),vec3(.10,.24,.46),ridge);
 cool=mix(cool,vec3(.25,.065,.33),smoothstep(.36,.68,broad)*.72);
 vec3 c=vec3(.002,.004,.009);
 // Broad light is carved into distinct cloud banks and granular filaments.
 c+=cool*arm*envelope*(.3+ridge*1.9+fine*.45)*(1.-exp(-r*r*35.)*.6);
 c+=vec3(.08,.19,.39)*feather*envelope*filaments*.65;
 c+=vec3(.10,.14,.29)*broad*envelope*.25;
 c*=1.-split*envelope*.87;
 // Rust-colored gas threads the inner blue-white stellar disc.
 float inner=exp(-r*r*9.);
 c+=vec3(.48,.21,.10)*ridge*arm*inner*.48;
 c+=vec3(.72,.34,.10)*exp(-r*r*38.)*(.22+cloud*.38);
 c+=vec3(.95,.55,.21)*exp(-r*r*210.)*(.18+ridge*.24);
 c+=vec3(1.,.68,.30)*exp(-r*r*1300.)*.2;
 c+=vec3(.48,.63,.86)*stars*arm*envelope*(.32+detail*.2);
 gl_FragColor=vec4(c,1.);
}`

// A separate absorbing sheet sits in front of the stellar field. Its broken
// silhouettes create depth without moving geography, the camera, or the sky.
const foregroundDust = `
varying vec2 vUv;
${cloudNoise}
void main(){
 vec2 p=discPoint(vUv);float r=length(p),a=atan(p.y,p.x);
 float broad=fbm(p*7.+vec2(1.,19.));
 float cloud=fbm(p*36.+broad*2.7);
 float phase=a*3.+r*17.-broad*2.2;
 float lane=pow(.5+.5*sin(phase+.22+cloud*1.5),13.);
 float torn=smoothstep(.28,.68,fbm(p*68.));
 float disc=exp(-r*1.5)*(1.-smoothstep(.64,1.02,r));
 float alpha=lane*disc*(.35+torn*.65)*.88*smoothstep(.035,.16,r);
 gl_FragColor=vec4(vec3(.004,.006,.012),alpha);
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
  const count = cinematic ? 44000 : size.width < 600 ? 14000 : 24000
  const particles = useMemo(() => {
    let seed = 87421
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const gold = new THREE.Color('#ffe0ad'), blue = new THREE.Color('#bbd3ff'), tint = new THREE.Color()
    for (let i = 0; i < count; i++) {
      // Sparse inter-arm stars add depth without another draw call or frame loop.
      const ambient = i % 8 === 0
      const nuclear = i % 5 === 0
      const radius = nuclear ? Math.pow(random(), .7) * .18 : Math.pow(random(), ambient ? .5 : .67) * (ambient ? 1.04 : .9)
      const arm = i % 3
      const spread = (random() + random() + random() - 1.5) * (.12 + radius * .32)
      const drift = Math.sin(radius * 37 + arm * 2.1) * .14 + Math.sin(radius * 83) * .07
      // Same broad arm orientation as the shader, with independent soft scatter.
      const angle = ambient || nuclear ? random() * Math.PI * 2 : (Math.PI / 2 + arm * Math.PI * 2 - radius * 17 + 1.1) / 3 + spread + drift
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius / 1.22
      positions[i * 3] = (x * .94 + y * .342) * 18.5
      positions[i * 3 + 1] = (-x * .342 + y * .94) * 15.5
      positions[i * 3 + 2] = -1.7 + random() * .42
      tint.copy(gold).lerp(blue, Math.min(1, radius * 1.35 + random() * .25)).multiplyScalar((ambient ? .22 : .45) + random() * .75)
      if (nuclear) tint.multiplyScalar(.32)
      colors.set([tint.r, tint.g, tint.b], i * 3)
      const prominence = random()
      sizes[i] = nuclear ? .45 + random() * .65 : prominence > .998 ? 5.5 : prominence > .98 ? 2.4 : .7 + random() * 1.15
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
    <mesh position={[0,0,-1.1]} raycast={() => {}}>
      <planeGeometry args={[37,31]}/>
      <shaderMaterial vertexShader={vertex} fragmentShader={foregroundDust} transparent depthWrite={false} toneMapped={false}/>
    </mesh>
    {cinematic && <Suspense fallback={null}><CinematicBloom /></Suspense>}
  </>
}
