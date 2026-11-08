# Hyperspace flight overhaul

November 8, 2026. Replaces the short straight chart pan and faint radial overlay with a shared4.2-second cinematic sequence. No catalog, geography, route, association or database changes.

## Behavior

- Charge0–18%: acquire the origin, briefly push in, then pull back to half overview scale.
- Hyperspace18–76%: advance through an original raymarched3D cloud cylinder, with independently perspective-projected stars growing and passing the camera. The map follows an illustrative broad arc beneath the tunnel.
- Arrival76–100%: the tunnel opens from its vanishing point while the camera approaches the destination, ending at4x overview scale rather than the prior1.48x scale.
- A geographic inset remains visible with committed origin and outlined target. Its dashed connector is a preview, not a canonical hyperspace lane.
- The transit HUD names the origin/destination and stage, focuses Skip on launch and keeps44px Skip/Cancel buttons available. Current location commits only on natural completion or Skip. Cancel restores the original viewport and current location. Reduced motion and missing WebGL preserve instant arrival.
- Camera and effect use one progress source. Camera sampling runs before label/effect projection. Effect has no independent clock; the HUD's RAF is bounded and canceled on unmount. The existing Canvas is reused, with a1x pixel ratio during flight. No hardware frame-rate result is claimed.
- The old transit panel's full-stage blur is explicitly removed. A production-browser assertion protects against it returning; only the compact control console blurs its own background.

## Checks

Build/types, Worker build and ICM structure pass. `test:hyperspace-flight` passes1440/390/320px: all three stages, geographic inset, clear shader rendering with no page/console errors, unblurred flight stage, pointer-owning44px controls, natural arrival at4x framing, midflight cancellation restoring origin/view, Skip, keyboard cancellation at320px and reduced-motion instant arrival. The measured projected scale is approximately0.5 during transit and3.3 near arrival before ending at4.

The renderer agent's standalone960/390 harness checks found zero extra draws at fixed progress and identical off/reduced-motion images to the no-effect baseline. This is finite software-WebGL evidence, not a physical-device benchmark. The integrated frame-stepped preview is recorded separately at24fps for visual review and does not measure real-time rendering speed.

Final local regressions also pass: `test:map-commands` (direction, bounds, reset, keyboard, warp locking and mobile overflow), `test:map-command-idle` (zero settled draws at1440/390px) and `test:map-context-loss` (loss disables controls, restoration re-enables them without errors). Final Worker build and ICM checks pass. The independent integration review found no blocking state/cleanup issues.

`warp-preview.mp4` is a5.5-second H.264,944x780 preview assembled from132 frame-stepped browser captures at24fps. It shows the atlas departure, tunnel and destination approach; it is a rendered visual preview, not a real-time device performance recording. Production deployment identity will be appended after live checks.
