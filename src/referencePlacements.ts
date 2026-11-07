import type { World } from './data';

/** User-supplied map, approximate hand-traced symbol centers, not physical coordinates. */
export const REFERENCE_MAP = {
  filename: 'star_wars_galaxy_map_4000x4000_20251009_3c4d0e08.jpeg',
  width: 4000, height: 4000,
  gridPitchPixels: 145.6,
  originPixels: [1855, 2288] as const, // K-11 center
  method: 'Approximate manual symbol trace; published system grid takes precedence.',
  companionUrl: 'http://www.swgalaxymap.com/',
};

type Anchor = { pixel: readonly [number, number]; grid: string };
export const REFERENCE_PLACEMENTS: Readonly<Record<string, Anchor>> = {
  'tatooine': { pixel: [2863, 3054], grid: 'R-16' },
  'alderaan': { pixel: [2119, 2077], grid: 'M-10' },
  'yavin': { pixel: [2597, 1489], grid: 'P-6' },
  'hoth': { pixel: [1786, 3325], grid: 'K-18' },
  'bespin': { pixel: [1786, 3314], grid: 'K-18' },
  'dagobah': { pixel: [2166, 3458], grid: 'M-19' },
  'coruscant': { pixel: [1926, 2064], grid: 'L-9' },
  'mandalore': { pixel: [2457, 1670], grid: 'O-7' },
  'chandrila': { pixel: [2010, 2011], grid: 'L-9' },
  'tython': { pixel: [1918, 2181], grid: 'K-10' },
  'onderon': { pixel: [2472, 2044], grid: 'O-9' },
  'umbara': { pixel: [2526, 2103], grid: 'P-10' },
  'cato-neimoidia': { pixel: [2245, 2267], grid: 'N-11' },
  'malastare': { pixel: [2229, 3065], grid: 'N-16' },
  'naboo': { pixel: [2415, 3100], grid: 'O-17' },
  'mustafar': { pixel: [1953, 3508], grid: 'L-19' },
  'nevarro': { pixel: [1874, 3575], grid: 'K-20' },
  'sorgan': { pixel: [2733, 3173], grid: 'Q-17' },
  'ryloth': { pixel: [2907, 3181], grid: 'R-17' },
  'geonosis': { pixel: [2851, 3064], grid: 'R-16' },
  'rodia': { pixel: [2812, 3038], grid: 'R-16' },
  'christophsis': { pixel: [2773, 3060], grid: 'Q-16' },
  'pantora': { pixel: [2557, 3433], grid: 'P-19' },
  'dathomir': { pixel: [2386, 1539], grid: 'O-6' },
  'aldhani': { pixel: [2123, 1522], grid: 'M-6' },
  'mina-rau': { pixel: [2409, 1486], grid: 'O-6' },
  'maridun': { pixel: [2657, 1554], grid: 'Q-6' },
};

/** Pixel coordinates normalized against the full attached 4000px reference. */
export function referencePixelToDisplay(pixel: readonly [number, number]) {
  return {
    x: (pixel[0] - REFERENCE_MAP.originPixels[0]) / REFERENCE_MAP.gridPitchPixels / 10,
    y: (REFERENCE_MAP.originPixels[1] - pixel[1]) / REFERENCE_MAP.gridPitchPixels / 10,
  };
}

export function applyReferencePlacement(world: World): World {
  const anchor = REFERENCE_PLACEMENTS[world.id];
  if (!anchor) return world;
  if (world.grid !== anchor.grid) return { ...world, uncertainty: `${world.uncertainty} Reference trace grid differs from the published cell; published placement retained.` };
  const match = /^([A-U])-(\d{1,2})$/.exec(world.grid);
  if (!match) return world;
  const center = { x: (match[1].charCodeAt(0) - 65 - 10) / 10, y: (11 - Number(match[2])) / 10 };
  const traced = referencePixelToDisplay(anchor.pixel);
  // More than ~6px beyond the official cell is a conflict, never a silent relocation.
  if (Math.abs(traced.x - center.x) > .054 || Math.abs(traced.y - center.y) > .054) return { ...world, uncertainty: `${world.uncertainty} Reference trace falls outside the published cell; published placement retained.` };
  const edge = Math.abs(traced.x - center.x) > .049 || Math.abs(traced.y - center.y) > .049;
  const limit = (value: number, midpoint: number) => Math.max(midpoint - .049, Math.min(midpoint + .049, value));
  const preservedNotes = world.uncertainty
    .replace(/Their shared display anchor does not imply physical proximity; /g, '')
    .replace(/Displayed at the cell center, not an exact planet position\./g, '')
    .replace(/Schematic cell center, not an exact planet or moon position\./g, '')
    .replace(/The displayed cell center is not the moon’s precise position\./g, 'The map anchor is not the moon’s precise position.');
  return {
    ...world,
    x: limit(traced.x, center.x), y: limit(traced.y, center.y),
    uncertainty: `${preservedNotes} Display symbol approximately traced from the supplied galaxy map within published cell ${world.grid}; not a measured planet coordinate.${edge ? ' Symbol touches a grid edge; display anchor constrained inside the published cell.' : ''}`,
  };
}
