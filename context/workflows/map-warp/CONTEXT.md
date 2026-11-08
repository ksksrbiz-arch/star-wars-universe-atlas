# Map/warp workflow

Status: current contract for the deployed preview. `npm run check:icm` verifies the named `context/` paths, npm scripts and relative links.

## Input

Read [map and motion](../../references/map-and-motion.md), [performance and tests](../../references/performance-and-tests.md), and [data.ts](../../../src/data.ts). Load only the affected renderer/state files, for example [Galaxy.tsx](../../../src/Galaxy.tsx), [PlanetaryBody.tsx](../../../src/PlanetaryBody.tsx), [GalaxyAtmosphere.tsx](../../../src/GalaxyAtmosphere.tsx), [WarpEffect.tsx](../../../src/WarpEffect.tsx), [HyperspaceLayer.tsx](../../../src/HyperspaceLayer.tsx), [hyperspaceRoutes.ts](../../../src/hyperspaceRoutes.ts), [labelLeaderGeometry.ts](../../../src/labelLeaderGeometry.ts) and [MapBoundary.tsx](../../../src/MapBoundary.tsx). `npm run test:galaxy-immersion` checks presentation switching and inspection without arrival. Map tests live in `scripts/test-map-*.mjs`, `test-expanded-map.mjs`, `test-touch.mjs` and `test-visual-lifecycle.mjs`; browser tests need `ATLAS_URL` (see [QA/release](../qa-release/CONTEXT.md)).

| Load | Do not load |
|---|---|
| Affected camera, interaction, and state implementation | Full lore catalogs or unrelated media ingestion |

## Process

Agent judgment defines intended interaction and ownership. Implement frame interpolation independently of factual data. Validate pointer coordinates, cancellation, latest-request behavior, and fallback. Measure affected behavior in a browser.

## Output

Implementation diff, interaction evidence, actual measurements when taken, and remaining limitations.

## Completion

Projection is consistent, destinations remain reachable, travel can be skipped/canceled, reduced motion is respected, and controls stay readable.

## Stop conditions

Do not ship an unbounded animation, inaccessible canvas-only navigation, or unsupported performance claim. Isolate failures and retain a usable fallback.
