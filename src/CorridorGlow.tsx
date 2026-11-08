import { useMemo } from 'react'
import * as THREE from 'three'

const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`
const fragment = `varying vec2 vUv; uniform vec3 tint;
void main(){float edge=abs(vUv.y-.5)*2.;float glow=exp(-edge*edge*6.)*(1.-smoothstep(.65,1.,edge));float core=exp(-edge*edge*65.);gl_FragColor=vec4(tint,glow*.22+core*.12);}`

/** Soft static stroke around the existing reference trace. No new waypoints or motion. */
export default function CorridorGlow({points, color}: {points: readonly (readonly [number,number])[]; color: string}) {
  const geometry = useMemo(() => {
    const positions: number[] = [], uv: number[] = []
    for (let i=1; i<points.length; i++) {
      const [ax,ay]=points[i-1], [bx,by]=points[i]
      const length=Math.hypot(bx-ax,by-ay)
      if (!length) continue
      const nx=-(by-ay)/length*.095, ny=(bx-ax)/length*.095
      positions.push(ax+nx,ay+ny,-.225, ax-nx,ay-ny,-.225, bx+nx,by+ny,-.225,
        bx+nx,by+ny,-.225, ax-nx,ay-ny,-.225, bx-nx,by-ny,-.225)
      uv.push(0,0,0,1,1,0,1,0,0,1,1,1)
    }
    return {positions:new Float32Array(positions),uv:new Float32Array(uv)}
  },[points])
  const uniforms=useMemo(()=>({tint:{value:new THREE.Color(color)}}),[color])
  return <mesh raycast={()=>undefined} renderOrder={7}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[geometry.positions,3]}/>
      <bufferAttribute attach="attributes-uv" args={[geometry.uv,2]}/>
    </bufferGeometry>
    <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms}
      transparent depthWrite={false} depthTest={false} side={THREE.DoubleSide} toneMapped={false}/>
  </mesh>
}
