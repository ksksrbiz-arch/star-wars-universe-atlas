import { useMemo } from 'react'
import CorridorGlow from './CorridorGlow'
import { HYPERSPACE_ROUTES, type HyperspaceRoute } from './hyperspaceRoutes'

function Corridor({ route }: { route: HyperspaceRoute }) {
  const positions = useMemo(() => {
    const vertices: number[] = []
    for (let i = 1; i < route.points.length; i++) {
      vertices.push(...route.points[i - 1], -.22, ...route.points[i], -.22)
    }
    return new Float32Array(vertices)
  }, [route])
  return <><CorridorGlow points={route.points} color={route.color}/><lineSegments raycast={() => undefined} renderOrder={8}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <lineBasicMaterial color={route.color} transparent opacity={.83} depthWrite={false} depthTest={false} toneMapped={false} />
  </lineSegments></>
}

/** Static geography overlay: independent of camera travel and episode connections. */
export default function HyperspaceRoutes({ visible = true }: { visible?: boolean }) {
  if (!visible) return null
  return <group name="reference-hyperspace-corridors">
    {HYPERSPACE_ROUTES.map(route => <Corridor key={route.id} route={route} />)}
  </group>
}
