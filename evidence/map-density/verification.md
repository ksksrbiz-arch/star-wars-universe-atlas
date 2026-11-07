# Dense map labels and priority markers

November 7, 2026; integrated with the expanded 76-world registry.

## Changes

- Optional zoom-level world labels are culled in screen space when they overlap a higher-priority label, an already accepted optional label, or the viewport edge. Current, preview, episode and eight featured labels are never culled by density. The searchable destination finder remains available for every world.
- Minor-label zoom thresholds now scale to the viewport: the previous fixed threshold exceeded the narrow map's maximum zoom. Optional names can now appear during mobile zoom.
- On-screen priority labels are clamped within the canvas at its edges, including Lothal in column U. Source dots and published coordinates are unchanged.
- Current, preview and episode markers have distinct dot/diamond symbols and static radial halos. No pulse timer, continuous rendering, imagery import, or new dependency was introduced.

## Verification

`npm run build` passed, with the existing large-chunk warnings. `node scripts/test-map-density.mjs` passed at 1440px and 390px with all 76 labels registered. At the tested dense zoom, visible optional labels had zero bounding-box overlaps; selected destinations remained available, keyboard focus was visible, Lothal's edge label stayed inside the canvas, and no browser errors occurred. Culling counts include offscreen/clipped labels, not only overlaps. Mobile screenshot `390.png` was visually inspected.

`node scripts/test-map-lettering.mjs` passed source-grid titles, keyboard outline and high-DPI balanced/cinematic/reduced-motion caps. `node scripts/test-visual-graphics.mjs` passed desktop/mobile/reduced-motion views, single canvas, warp skip/cancel, readable controls and no browser errors. Balanced and cinematic each recorded zero idle draw calls in the measured 600ms settled windows.

This is browser/software-WebGL evidence, not physical-device FPS measurement. Featured labels and episode-cluster offsets retain their existing layout behavior; this change does not promise collision-free layout for every priority-label combination.
