import { GALACTIC_REGIONS } from './galacticRegions'
import { HYPERSPACE_ROUTES } from './hyperspaceRoutes'
export default function ReferenceOverview({regions,routes}:{regions:boolean;routes:boolean}) {
  const points=(list:readonly (readonly [number,number])[])=>list.map(([x,y])=>`${60+x*4.3},${40-y*2.8}`).join(' ')
  return <>{regions && GALACTIC_REGIONS.map(region=><polygon key={region.id} points={points(region.points)} fill={region.color} fillOpacity={.13} stroke={region.color} strokeOpacity={.4} strokeWidth={.35}/>)}{routes && HYPERSPACE_ROUTES.map(route=><polyline key={route.id} points={points(route.points)} fill="none" stroke={route.color} strokeOpacity={.65} strokeWidth={.5}/>)}</>
}
