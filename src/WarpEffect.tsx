import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type WarpEffectProps = {
  /** The camera controller owns time, cancellation, and this normalized progress. */
  progressRef: { readonly current: number }
  active: boolean
  reducedMotion: boolean
  quality?: 'balanced' | 'cinematic'
}

const screenVertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`
// Original perspective volume: rays travel through a hollow, irregular 3D cloud
// cylinder. Depth changes both apparent texture scale and front-to-back absorption.
const tunnelFragment = `
precision highp float;
varying vec2 vUv;
uniform float uProgress,uAspect,uCinematic;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float cloud(vec3 p){return noise(p)*.58+noise(p*2.07+7.1)*.28+noise(p*4.19+13.7)*.14;}
void main(){
 float t=clamp(uProgress,0.,1.);
 float charge=smoothstep(.015,.18,t);
 float flight=smoothstep(.13,.23,t);
 float exit=smoothstep(.76,1.,t);
 vec2 uv=(vUv-.5)*2.;uv.x*=uAspect;
 float travel=t*18.+t*t*140.;
 // A small curved course reveals real depth without a spinning pinwheel.
 vec3 ray=normalize(vec3(uv,1.4));
 vec3 origin=vec3(sin(travel*.035)*.14,cos(travel*.028)*.10,travel);
 vec3 radiance=vec3(0.);float transmittance=1.;
 float stepSize=mix(.95,.68,uCinematic);
 for(int i=0;i<36;i++){
  if(uCinematic<.5&&i>=26)break;
  float distance=.8+float(i)*stepSize;
  vec3 p=origin+ray*distance;
  float angle=atan(p.y,p.x);
  float radius=length(p.xy);
  float shape=noise(vec3(p.xy*.48,p.z*.075));
  float wall=2.15+shape*.85+sin(p.z*.13+angle*3.)*.18;
  float shell=exp(-pow((radius-wall)*1.75,2.));
  float clouds=cloud(vec3(p.xy*1.5,p.z*.27));
  float striation=pow(.5+.5*sin(angle*19.+clouds*7.+p.z*.19),9.);
  float knots=smoothstep(.38,.78,clouds);
  float density=shell*(.10+knots*.7+striation*.19);
  vec3 blue=vec3(.025,.24,.72),violet=vec3(.34,.035,.65);
  vec3 tint=mix(blue,violet,.5+.5*sin(angle*2.3+p.z*.075));
  vec3 light=tint*(.24+knots*1.8)+vec3(.15,.65,.9)*striation*.65;
  float absorb=1.-exp(-density*stepSize*.88);
  radiance+=transmittance*light*absorb;
  transmittance*=1.-absorb;
 }
 // The central vanishing point stays dark; the walls are luminous, never white.
 vec3 color=vec3(.002,.005,.018)+radiance*1.8;
 color=vec3(1.)-exp(-color);
 float radius=length(uv);
 float rim=exp(-abs(radius-(.24+charge*.55))*9.);
 color+=vec3(.025,.16,.36)*rim*charge*(1.-flight)*.45;
 float opening=exit*exit*3.5;
 float reveal=1.-smoothstep(opening-.16,opening+.16,radius);
 float opacity=mix(.12,.94,flight)*charge*(1.-reveal*exit)*(1.-smoothstep(.94,1.,t));
 gl_FragColor=vec4(color,opacity);
}`

// Each quad is a seeded star in 3D. Head and tail are projected independently,
// so nearby flypasts grow, lengthen and leave the frame instead of sliding in 2D.
const streakVertex = `
attribute vec3 star;
attribute vec2 corner;
attribute float variation;
uniform float uProgress,uAspect;
varying vec2 vCorner;
varying float vAlpha,vTint;
void main(){
 float t=uProgress,accel=smoothstep(.025,.23,t);
 float travel=t*18.+t*t*140.;
 float z=mod(star.z-travel*(.78+variation*.46),38.)+.45;
 float tail=mix(.025,5.8,accel)*(.55+variation);
 vec2 head=star.xy/z*1.4,back=star.xy/(z+tail)*1.4;
 head.x/=uAspect;back.x/=uAspect;
 vec2 direction=normalize(head-back+vec2(.000001));
 vec2 normal=vec2(-direction.y,direction.x);
 float width=(.00055+.006*pow(1.-z/39.,4.))*(.6+variation);
 vec2 projected=mix(back,head,corner.x)+normal*corner.y*width;
 gl_Position=vec4(projected,0.,1.);
 vCorner=corner;vTint=variation;
 vAlpha=smoothstep(.45,1.1,z)*(1.-smoothstep(34.,38.,z))*smoothstep(.005,.15,t)*(1.-smoothstep(.78,1.,t));
}`
const streakFragment = `
varying vec2 vCorner;varying float vAlpha,vTint;
void main(){float edge=1.-smoothstep(.25,1.,abs(vCorner.y));float tip=smoothstep(0.,.25,vCorner.x);vec3 tint=mix(vec3(.20,.48,1.),vec3(.68,.86,1.),vTint);gl_FragColor=vec4(tint,edge*tip*vAlpha*.88);}`

export default function WarpEffect({ progressRef, active, reducedMotion, quality = 'balanced' }: WarpEffectProps) {
  const group = useRef<THREE.Group>(null)
  const tunnel = useRef<THREE.ShaderMaterial>(null)
  const streaks = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({uProgress:{value:0},uAspect:{value:1},uCinematic:{value:0}}), [])
  const count=quality==='cinematic'?650:380
  const stars=useMemo(()=>{
    let seed=58129;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
    const positions=new Float32Array(count*18),star=new Float32Array(count*18),corners=new Float32Array(count*12),variation=new Float32Array(count*6)
    const quad=[0,-1,1,-1,1,1,0,-1,1,1,0,1]
    for(let i=0;i<count;i++){
      const a=random()*Math.PI*2,r=2.7+Math.pow(random(),.6)*19,z=random()*38,v=random()
      for(let j=0;j<6;j++){star.set([Math.cos(a)*r,Math.sin(a)*r,z],i*18+j*3);corners.set(quad.slice(j*2,j*2+2),i*12+j*2);variation[i*6+j]=v}
    }
    return{positions,star,corners,variation}
  },[count])
  useFrame(({size})=>{
    const raw=progressRef.current,progress=Number.isFinite(raw)?THREE.MathUtils.clamp(raw,0,1):0
    if(group.current)group.current.visible=active&&!reducedMotion&&progress>0&&progress<1
    for(const material of[tunnel.current,streaks.current])if(material){material.uniforms.uProgress.value=progress;material.uniforms.uAspect.value=size.width/Math.max(1,size.height);material.uniforms.uCinematic.value=quality==='cinematic'&&size.width>=900?1:0}
  })
  // Time belongs entirely to the host; no RAF, clock, or invalidation survives cancellation.
  return <group ref={group} visible={false}>
    <mesh frustumCulled={false} renderOrder={1000} raycast={()=>undefined}>
      <planeGeometry args={[2,2]}/>
      <shaderMaterial ref={tunnel} vertexShader={screenVertex} fragmentShader={tunnelFragment} uniforms={uniforms} transparent depthTest={false} depthWrite={false} toneMapped={false}/>
    </mesh>
    <mesh frustumCulled={false} renderOrder={1001} raycast={()=>undefined}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stars.positions,3]}/>
        <bufferAttribute attach="attributes-star" args={[stars.star,3]}/>
        <bufferAttribute attach="attributes-corner" args={[stars.corners,2]}/>
        <bufferAttribute attach="attributes-variation" args={[stars.variation,1]}/>
      </bufferGeometry>
      <shaderMaterial ref={streaks} vertexShader={streakVertex} fragmentShader={streakFragment} uniforms={uniforms} transparent blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} toneMapped={false}/>
    </mesh>
  </group>
}
