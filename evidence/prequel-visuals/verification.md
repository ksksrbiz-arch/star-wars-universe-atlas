# Prequel-batch galaxy visual refinement

This change is decorative and presentational. Region polygons, corridor points, world coordinates and the camera/warp timing model are unchanged.

- Fine static dust filaments and fragmented knots add structure to the spiral arms; the warmer core distinguishes inner light from the cool outer disc.
- Existing hyperspace traces receive a wider feathered halo and concentrated central glow, without new waypoints or route animation.
- A fixed-screen acquisition reticle marks the committed destination. Current/preview labels show their source-grid cell; this badge is not a distance estimate.
- On narrow maps, secondary region labels and route names wait until zoom 24. Core Worlds and Outer Rim remain labeled at overview scale; all boundaries and corridors remain visible. Detailed names return on zoom, reducing mobile label crowding.

No dependency, remote texture, time-based shader uniform, animation loop or continuous invalidation was added. Optional desktop bloom remains gated by quality, viewport and reduced motion. The reticle updates only when an existing demanded frame renders.

## Verification

`npx tsc --noEmit` and `scripts/test-prequel-visuals.mjs` passed against development port 4174. Playwright Chromium/software WebGL captured cinematic and balanced desktop plus balanced 390/320px maps. All four scenarios recorded zero WebGL draws during a settled 600ms window; this is not physical-device FPS evidence. Source-grid badges, priority-label viewport bounds, single-canvas lifecycle, no horizontal overflow, mobile name availability on zoom, Cancel retaining the prior destination, and Skip completing arrival passed. `test-map-command-idle.mjs` separately passed desktop/mobile zero-draw windows.

Screenshots and structured results are adjacent. Desktop and mobile screenshots were visually inspected. An initial test used the wrong accessible Cancel button name; it was corrected to the actual UI label and the complete suite passed. No production deployment is claimed by this agent.
