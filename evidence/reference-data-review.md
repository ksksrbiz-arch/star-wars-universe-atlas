# Reference geography data review — November 7, 2026

Reviewed the supplied 4000px image and the integrated `reference-map-desktop.png`. The main geographic footprint, northeast major corridors, southward routes, nested regions, and western Unknown Regions follow the supplied reference at schematic atlas scale. The rendered routes remain distinguishable from the existing preview/story connection.

`node scripts/test-reference-data.mjs` passes four groups:

- Eight finite region polygons without strict segment crossings. The six nested hole polygons have all vertices inside their outer silhouettes and smaller areas.
- Five distinct route records with finite geometry and evidence notes. Every route control point uses the same calibrated projection as the region layer and planet traces.
- Perlemian and Corellian Run origins coincide within 0.06 grid cell of the constrained Coruscant symbol; the Run and Trade Spine share the same traced Corellia display junction.
- All 27 traced symbols stay within their published cells. The other 35 destinations retain their previous grid-center placements.

`npm run test:journey-data` also passes after updating its former exact-cell-center assertion to the new, intentional within-published-cell contract. Catalog and relationship coverage remains unchanged.

## Accuracy limits

The boundaries and five major corridors are simplified manual visual traces, not a vector dataset extracted from the reference or a complete graph of hyperspace connectivity. The routes omit minor branches and do not establish exact intermediate junctions or travel durations. The northeast extent of the Perlemian overlay follows the visible major corridor and does not claim complete coverage. Route names and selected junction relationships have separate official StarWars.com support recorded in `hyperspaceRoutes.ts`.

The 27 planet symbols have greater display specificity than the remaining 35 cell-center placements. Image trace precision does not establish physical or astronomical accuracy. Minor subregions and political sectors in the image, including the Corporate Sector and Bothan Space, are not fully traced in this increment. Era-specific route availability or political control is not inferred.

The swgalaxymap.com homepage timed out during research. Its indexed PDF was available as corroborating reference metadata; the submitted image remains the actual geometry source.
