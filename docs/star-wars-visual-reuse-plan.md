# Reusable visuals and animation shortlist

Researched November 7, 2026 for Keith’s personal Star Wars Universe Atlas. Existing stack: React19.3.1, R3F9.8.2, Drei10.7.9, Three0.187, Vite. This is a researched adoption plan; these candidates have not been installed or benchmarked in the app.

## Recommended first additions

| Candidate | Concrete atlas improvement | Adoption decision |
|---|---|---|
| Motion for React | Dossier entrances/exits, chapter changes, card-to-detail transitions, progress feedback | Adopt for HTML interface animation; do not give it ownership of the Three camera. https://motion.dev/docs/react-animate-presence |
| Drei Stars, Sparkles, CameraControls | Better star layers, destination particles, smoother camera framing | Already installed. Reuse its helpers before adding another renderer. CameraControls would replace the existing OrbitControls owner, not run beside it. https://drei.docs.pmnd.rs/staging/stars ; https://drei.docs.pmnd.rs/staging/sparkles ; https://drei.docs.pmnd.rs/controls/camera-controls |
| React Postprocessing Bloom | Controlled glow on navigation markers and warp streaks | Add as a selectable quality tier. Use HDR material thresholds; preserve sharp readable map labels. Current published peer ranges fit our React19/R3F9 versions; runtime validation remains necessary. https://react-postprocessing.docs.pmnd.rs/effects/bloom |
| React Bits Galaxy | Twinkling stars and radial warp styling | Strong personal-project candidate. Current inspected TypeScript source owns a raw WebGL2 renderer and exposes clickWarp; it is not an R3F component. Adapt selected shader techniques into our existing canvas, or isolate it to a brief transition; avoid two permanent full-screen render loops. https://reactbits.dev/backgrounds/galaxy |
| React Bits Light Tunnel / Lightfall | More cinematic hyperspace streaks and tunnel depth | Strong visual candidates for the travel transition. Wire them to our explicit jump progress, cancellation and arrival state instead of leaving them as endlessly running backgrounds. https://reactbits.dev/backgrounds/light-tunnel ; https://reactbits.dev/backgrounds/lightfall |
| GSAP timeline | Coordinated charge-up, acceleration, tunnel travel and arrival | Optional cinematic sequencer if the current frame-driven animation becomes difficult to tune. Assign one owner to each camera/uniform property. https://gsap.com/docs/v3/GSAP/Timeline/ |

React Bits Hyperspeed is also available, but its default design is a glowing highway. Lightfall and Galaxy are closer to this project's space-flight direction. https://reactbits.dev/backgrounds/hyperspeed

## Additional reusable code and software

- **Vercel Labs Galaxy Shader:** substantial reusable galaxy code with instanced stars, clustering, twinkle and bloom. Useful as a high-quality art/reference branch. It owns a standalone WebGPU renderer and explicitly has no WebGL fallback; it is not a drop-in replacement for our sourced galaxy map. Retain the current working WebGL map while evaluating it. https://github.com/vercel-labs/nextjs-nights-shader
- **Official Three.js spline/tube example:** a clean foundation for camera flythrough and tunnel geometry, adaptable to our warp scene. It needs our own streak material and transition choreography. https://threejs.org/examples/webgl_geometry_extrude_splines.html
- **shadcn Sheet:** reusable mobile dossier/dialog behavior. Our project uses custom CSS, so use one coherent Base UI or Radix variant and account for styling integration. https://ui.shadcn.com/docs/components/base/sheet
- **glTF Transform:** offline model inspection, pruning, deduplication, simplification and texture processing. Put it in the asset build pipeline, not the browser bundle. https://gltf-transform.dev/cli
- **gltfjsx:** editable React wrappers for ships/stations whose individual parts need interaction. Plain loaded GLB is enough for static models. https://github.com/pmndrs/gltfjsx
- **KTX-Software / Three KTX2Loader:** prepare and load GPU-compressed textures. Generate appropriate mobile/desktop variants and self-host required decoder assets. https://github.com/KhronosGroup/KTX-Software ; https://threejs.org/docs/pages/KTX2Loader.html
- **Leva:** development-only controls for star density, bloom, warp speed and camera easing. Save selected values as versioned presets; omit the tuner from the normal public UI. https://github.com/pmndrs/leva
- **Rive:** optional authoring tool for genuinely interactive HUD instruments or animated insignia. Its runtime and editor/export plans are separate; check the current export behavior before choosing it for a production asset. https://rive.app/
- **Theatre.js:** optional visual keyframe authoring, exporting scene JSON. Its older release cadence and separately licensed Studio make it an experiment rather than a required app dependency. https://www.theatrejs.com/docs/latest/getting-started/with-react-three-fiber

## How I would apply these

1. Add Motion to the DOM interface with a shared duration/easing vocabulary and explicit reduced-motion behavior.
2. Add Drei star layers and restrained bloom inside the existing R3F canvas. Keep source-grid world positions separate from decorative stars and dust.
3. Prototype two short warp treatments: React Bits-inspired radial star stretch and a spline/tube flythrough. Compare on desktop and a physical phone before choosing.
4. Keep the minimap and Cancel/Skip controls readable throughout. Travel remains a user-interface transition, not a claimed canonical hyperspace route.
5. Add a mobile dossier sheet without making canvas gestures or keyboard focus compete with it.
6. Add glTF Transform/KTX2/gltfjsx to the asset pipeline before importing large quantities of ships, stations and environment models.

The key rule is one coherent scene and controlled animation ownership. Do not install every effects library or mount multiple permanent canvases because demos look impressive individually. New effects must retain cancel/skip/back, reduced motion, keyboard controls, cleanup under ReactStrictMode, and a usable non-WebGL route through the content.

## Personal-project reuse and maintenance notes

Personal-project use is the selection criterion; no commercial reuse license purchase is assumed. Motion, Drei, React Postprocessing, Three.js, the Vercel Labs example, glTF Transform, gltfjsx and Leva provide permissively licensed code. React Bits explicitly permits personal application/website use under its MIT-plus-Commons-Clause terms; preserve notices and do not redistribute it as a standalone component/tool pack. GSAP is free under its current standard license. Paid templates, tool subscriptions and separately supplied media are optional and are not prerequisites for the recommended stack.

Primary license references: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md ; https://gsap.com/community/standard-license/ ; https://github.com/motiondivision/motion/blob/main/LICENSE.md ; https://github.com/pmndrs/drei/blob/master/LICENSE ; https://github.com/pmndrs/react-postprocessing/blob/master/LICENSE . Pin selected dependency versions or source commits at integration time and preserve relevant notices.

Compatibility was checked at documentation/manifest level, not by installing all candidates. Drei10.7.9 explicitly targets React19/R3F9. Current React Postprocessing3.2.2 declares R3F>=9.7, React19 and compatible Three peer ranges. Theatre core’s latest registry release reviewed was0.7.2 from2024; avoid making its authoring editor a critical production dependency without a compatibility trial.
