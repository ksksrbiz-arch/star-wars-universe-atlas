import { useMemo } from 'react'
import * as THREE from 'three'
import { GALACTIC_REGIONS, type GalacticRegion } from './galacticRegions'

function Region({ region, immersive }: { region: GalacticRegion; immersive: boolean }) {
  const { shape, border } = useMemo(() => {
    const outer = region.points.map(([x,y]) => new THREE.Vector2(x,y))
    const shape = new THREE.Shape(outer)
    const inner = GALACTIC_REGIONS.find(candidate => candidate.id === region.inner)
    if (inner) shape.holes.push(new THREE.Path(inner.points.map(([x,y]) => new THREE.Vector2(x,y)).reverse()))
    const border = new Float32Array([...region.points,region.points[0]].flatMap(([x,y]) => [x,y,0]))
    return { shape, border }
  }, [region])
  return <group position={[0,0,region.overlay ? -.29 : -.35]}>
    <mesh raycast={() => undefined} renderOrder={2}>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color={region.color} transparent opacity={immersive ? (region.overlay ? .045 : .025) : (region.overlay ? .17 : .115)} depthWrite={false} side={THREE.DoubleSide} toneMapped={false}/>
    </mesh>
    <lineLoop raycast={() => undefined} renderOrder={3} position={[0,0,.01]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[border,3]}/></bufferGeometry>
      <lineBasicMaterial color={region.color} transparent opacity={immersive ? (region.overlay ? .6 : .36) : (region.overlay ? .76 : .53)} depthWrite={false} toneMapped={false}/>
    </lineLoop>
  </group>
}

/** Static geographic layers; labels are projected by the host's accessible label bridge.
 * All traces use the same map-space projection as world markers. No frame loop. */
export default function GalacticGeography({ visible = true, immersive = false }: { visible?: boolean; immersive?: boolean }) {
  return <group visible={visible}>{GALACTIC_REGIONS.map(region => <Region key={region.id} region={region} immersive={immersive}/>)}</group>
}
