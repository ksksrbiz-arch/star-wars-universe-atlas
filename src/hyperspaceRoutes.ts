/** Major corridors traced schematically from the user's supplied DK galaxy map.
 * Control points are display geometry, NOT navigable waypoints or complete topology.
 * Pixel coordinates refer to a 1600px square review of the original 4000px image.
 */
export const HYPERSPACE_REFERENCE = {
  title: 'User-supplied Star Wars Galaxy Map (DK credit visible in image)',
  filename: 'star_wars_galaxy_map_4000x4000_20251009_3c4d0e08.jpeg',
  referenceUrl: 'https://www.swgalaxymap.com/',
  supportingMapUrl: 'https://www.swgalaxymap.com/wp-content/uploads/2018/12/Star_Wars_Galaxy_Map.pdf',
  geometryStatus: 'Approximate visual trace of the supplied image; not an extraction from the website or an exact route graph.',
  continuity: 'Reference-map geography; no era-specific route availability is inferred.',
} as const

const rogueOne = 'https://www.starwars.com/news/where-in-the-galaxy-are-the-worlds-of-rogue-one'
const forceAwakens = 'https://www.starwars.com/news/where-in-the-galaxy-are-the-worlds-of-star-wars-the-force-awakens'

export type HyperspaceRoute = {
  id: string
  name: string
  number: number
  color: string
  /** Scene units: grid cell centers x=columnIndex(A=0)-10, y=11-row. */
  points: readonly (readonly [number, number])[]
  label: readonly [number, number]
  referencePixels: readonly (readonly [number, number])[]
  sourceUrls: readonly string[]
  evidence: string
  uncertainty: string
}

// Original 4000px calibration: K / row 11 center (1855,2288), 145.6px cells.
// Divide by 2.5 for these 1600px review control points.
// This calibration aligns the reference with the existing published-grid projection.
function project([x, y]: readonly [number, number]): [number, number] {
  return [(x - 742) / 58.24, (915.2 - y) / 58.24]
}

function route(data: Omit<HyperspaceRoute, 'points' | 'label' | 'uncertainty'> & { labelPixel: readonly [number, number] }): HyperspaceRoute {
  const { labelPixel, ...record } = data
  return {
    ...record,
    points: data.referencePixels.map(project),
    label: project(labelPixel),
    uncertainty: 'Simplified visual corridor from the supplied reference. Bends and junctions are approximate; intermediate systems, branches, travel times, and era availability are not asserted.',
  }
}

export const HYPERSPACE_ROUTES: readonly HyperspaceRoute[] = [
  route({
    id: 'perlemian', name: 'Perlemian Trade Route', number: 1, color: '#f2d391',
    referencePixels: [[770,825],[817,822],[859,788],[887,770],[933,757],[1004,757],[1058,744],[1111,710],[1141,672],[1160,629],[1174,596],[1195,551]],
    labelPixel: [1084,719], sourceUrls: [rogueOne],
    evidence: 'The supplied map marks corridor 1. The official Rogue One travel guide identifies the Perlemian at Lantillies and the Rimward direction toward Abhean. The drawn extent follows the visible northeastern corridor, not every branch.',
  }),
  route({
    id: 'corellian-run', name: 'Corellian Run', number: 2, color: '#91e4ed',
    referencePixels: [[770,825],[802,839],[832,860],[850,901],[864,942],[899,990],[934,1030],[971,1078],[1011,1123],[1045,1155],[1084,1192],[1121,1230],[1167,1284],[1223,1311]],
    labelPixel: [1000,1094], sourceUrls: [rogueOne, forceAwakens],
    evidence: 'The supplied map marks corridor 2. Official travel guides connect Coruscant and Corellia by the Corellian Run and describe its continuation toward the southern galaxy.',
  }),
  route({
    id: 'corellian-trade-spine', name: 'Corellian Trade Spine', number: 3, color: '#d5b4f1',
    referencePixels: [[864,942],[857,978],[850,1003],[817,1021],[783,1028],[765,1060],[773,1099],[785,1140],[776,1174],[759,1210],[740,1254],[725,1304],[716,1360],[718,1410],[726,1464]],
    labelPixel: [754,1278], sourceUrls: [rogueOne, forceAwakens],
    evidence: 'The supplied map marks corridor 3. Official travel guides describe the Corellia branch toward Kinyen, the Foless connection, and the Hosnian system near the Spine. The southwest display trace is schematic.',
  }),
  route({
    id: 'rimma', name: 'Rimma Trade Route', number: 4, color: '#a9d9a2',
    referencePixels: [[769,1009],[776,1043],[791,1080],[808,1111],[828,1156],[850,1203],[859,1246],[856,1291],[851,1336],[848,1384],[851,1438],[859,1482]],
    labelPixel: [855,1264], sourceUrls: [forceAwakens],
    evidence: 'The supplied map marks corridor 4. The official Force Awakens travel guide identifies Abregado-Rae as the beginning of the Rimma Trade Route. The southward geometry is a simplified reference-image trace.',
  }),
  route({
    id: 'hydian', name: 'Hydian Way', number: 5, color: '#f0b18f',
    referencePixels: [[1178,454],[1124,466],[1081,487],[1054,511],[1035,527],[1013,566],[987,610],[956,654],[922,688],[885,723],[846,771],[818,821],[845,864],[875,916],[899,964],[909,1015],[910,1068],[903,1127],[893,1180],[877,1237],[854,1294],[824,1343],[790,1383],[754,1424],[719,1469]],
    labelPixel: [1034,550], sourceUrls: [rogueOne, forceAwakens, 'https://www.starwars.com/series/clone-wars/r2-come-home-trivia-gallery'],
    evidence: 'The supplied map marks corridor 5. Official sources identify the Hydian Way, its Bandomeer and Brentaal passage, and its continuation through the southern regions. Intermediate traced bends do not establish named junctions.',
  }),
]

export const HYPERSPACE_ROUTE_LABELS = HYPERSPACE_ROUTES.map(route => ({
  id: route.id, name: route.name, number: route.number, color: route.color,
  position: [route.label[0], route.label[1], -.18] as [number, number, number],
}))
