# Galaxy immersion visual overhaul

November 8, 2026. Visual and interaction work on the existing 76-world atlas; no catalog, connection, coordinate, route or database publication changes.

## Changes

- Original blue/violet stellar clouds, textured amber nucleus, dense seeded stars and a separate absorbing dust layer replace the sparse haze. Geographic regions remain visible through lighter immersive fills.
- All 76 mapped destinations have real shaded sphere geometry with original procedural surfaces, directional light, atmosphere and eight visual families. Sizes are exaggerated; these are illustrations, not official imagery or physical planet models.
- Immersive / Reference chart switch preserves coordinates, layer settings, current location and preview. Reference restores stronger geographic fills.
- Inspect centers and enlarges the preview without arriving there. Jump, warp, Skip and Cancel preserve the existing travel state machine.
- Overview names increase from 8 to 21 at the checked 1440px viewport. Smaller screens progressively pack/cull names; all destination markers remain in the scene.
- Mobile pan arrows move behind a keyboard-accessible disclosure; 44px controls remain available. The mobile map stays in normal flow to prevent the reading sheet covering its bottom. Dense story layouts may cull unrelated landmark names.
- The DOM label bridge requests one layout frame after its independent React root commits, preventing newly previewed names from keeping an old hidden state.

## Verification

Local production preview: http://localhost:4175. Chromium with software WebGL; browser emulation is not physical-device or frame-rate validation.

Build/types, Worker build and ICM structure pass. Immersive/reference switching, all76 globe nodes, a single Canvas, preview inspection without arrival and no horizontal overflow pass at1440/390/320px. Browser console and shader compilation checks report no errors.

Dense episode label hit targets and map-key readability pass at1440/390/320px with normal and unavailable fonts: no label overlaps, stable source anchors, keyboard focus, source-cell layer toggles, reachable44px pan arrows and zero settled redraws in the checked600ms window. The map-key regression explicitly exercises the new mobile disclosure.

Warp, Skip, Cancel, route-label detail thresholds and static rendering pass the prequel visual regression at1440 cinematic,1440 balanced/reduced,390 and320px. Navigation commands pass direction, repeated bounds/reset, keyboard, reduced-motion and warp-disabled control checks. The command-idle regression passes1440/390px with zero draws during its settled600ms observation. WebGL context loss disables controls and restoration re-enables them without page errors. The synthetic context test yields one browser animation frame between loss and the restore request; its original5-second recovery assertion remains. Browser suites were run sequentially after concurrent software rendering produced timing failures; these results are not hardware benchmarks.

Local checks: `npm run build`, `build:worker`, `check:icm`, `test:reference-data`, `test:worker`, `test:galaxy-immersion`, `test:prequel-visuals`, `test:label-hit-targets`, `test:map-key-legibility`, `test:map-commands`, `test:map-command-idle`, and `test:map-context-loss` passed. Database publication is unchanged. Deployment identity and live checks will be appended after release. Original screenshots are in this folder; before-galaxy.png captures the prior live map. Assets remain procedural; no third-party image collection or real planetary surface models were added.
