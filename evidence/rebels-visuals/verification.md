# Rebels-batch story focus and map-label clarity

This bounded visual update leaves all world coordinates, region silhouettes, hyperspace traces and warp timing unchanged.

- Disclosed chapter locations now use a fixed-screen violet ring and diamond beacon. Unlike the previous world-scaled ring, the symbol remains readable in a mobile galaxy overview and does not grow excessively when zoomed.
- A compact, noninteractive map key distinguishes the committed location, preview-only selection and disclosed story markers. Its count includes mapped highlights only, not unplaced associated settings. The key expressly says that appearances are not a route. It reveals no chapter-location information before the existing disclosure gate.
- Priority labels can move to a bounded clear position around camera controls, the symbol key, jump bar, current-location panel and overview. Source dots remain fixed, and leader endpoints follow the label displacement. Optional labels underneath those interface elements are culled. If no clear candidate exists, essential labels are retained rather than silently removed; this is not a universal packing guarantee.
- Leader geometry updates skip unchanged endpoints. No extra frame loop, time uniform, dependency or geographic inference is introduced. Story locations are not joined by new lines.

## Verification

TypeScript and `scripts/test-rebels-visuals.mjs` pass against the local development server at port4174. Playwright Chromium/software WebGL checked1440/390/320 widths for disclosure/reset, preview versus arrival, zero settled draws over600ms, symbol-key clearance from camera buttons, Ferrix/Tatooine priority-label clearance, Lothal edge containment/preview/arrival, one canvas, no horizontal overflow and no watched-state mutation. Screenshots were visually reviewed; the mobile screenshot exposed the prior Ferrix/control overlap, which the bounded label placement now resolves.

`test-map-command-idle.mjs` separately passes desktop/mobile zero-draw windows. `test-map-commands.mjs` passes zoom/pan directions/limits, repeated commands, keyboard activation and travel-state disabling/re-enabling. `test-prequel-visuals.mjs` passes cinematic/balanced desktop, balanced390/320, zoom-revealed geography labels, source-grid badges and warp Cancel/Skip.

These are emulated desktop-browser checks, not physical-device FPS or complete accessibility conformance evidence. Production build and rollout verification belong to the integrating release agent.
