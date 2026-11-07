# Star Wars Universe Atlas — architecture and experience plan

Draft recommendation, November 7, 2026. Planning only: no application prototype, benchmark, deployment, or dependency installation was performed. User direction: movies/shows first, cinematic galaxy travel, readable reference map, fast operation, high visual quality, and Jake Van Clief's ICM for development.

## Recommended foundation

Use React + TypeScript, React Router framework mode on Vite, Three.js through React Three Fiber (R3F), Motion for HTML transitions, and XState for navigation/journey orchestration. Use static prerendering for published dossiers and a persistent client atlas shell. Start with versioned data files and local watch progress. Vercel is a sensible initial deployment target matching the existing atlas; no new service is provisioned by this plan.

Use compatible stable releases pinned in a lockfile. Current R3F docs pair v9 with React 19 and label v10/WebGPU as alpha. Choose the stable WebGL path initially; confirm the exact compatible versions when scaffolding. Do not copy dependency versions from the old repository without checking them.

| Option | Fit | Decision |
|---|---|---|
| React/Vite + R3F/Three | One scene engine for readable map planes, particles, atmospheric planet arrivals and camera choreography | Preferred, conditional on phone prototype measurements |
| React + PixiJS | Excellent candidate for predominantly 2D sprites, labels, parallax and warp streaks | Fallback architectural option if 3D arrival adds insufficient value for its cost |
| React + SVG | Strong semantic integration and crisp compact maps | Use for minimap and a lightweight fallback; avoid making thousands of animated DOM nodes |
| Full game engine export | Could deliver deep simulation | Unnecessary for the proposed reference/exploration product; adds another UI/content integration layer |

This is a fitness judgment, not a measured claim that one engine is faster. Next.js is not required by the current static catalog and interactive-map scope; revisit server features if accounts, collaboration or dynamic publishing change the requirements.

## Experience and art direction

The reference galaxy remains the user's navigational anchor. The experience has three levels: galaxy overview, system focus, and world dossier. Systems and moons retain sourced relationships, but orbital arrangements and planetary appearance are illustrative unless independently sourced.

- Galaxy: face-on orthographic map, stable orientation, subtle original galactic-disk artwork, sparse decorative stars, region names and recognizable systems. Optional restrained tilt is presentation only. No freely tumbling camera in the default map.
- System: map focus expands into a schematic system card/inset; the surrounding galaxy and minimap remain visible. Avoid pretending to simulate real orbital distances or periods.
- World: an illustrative lit sphere or approved world image accompanies the dossier; switch to richer perspective only within this arrival presentation. The persistent minimap continues using the source-backed galaxy plane.
- Desktop: approximately 70–75% map with a 320–400px contextual panel, adjusted to viewport. Compact timeline dock across the map bottom.
- Phone: map plus bottom sheet with peek, half and full states; controls sized for touch, safe-area spacing, and framing that accounts for overlays. The minimap can collapse after arrival but remains available.
- Palette: near-black blue #050914, warm light text #E8EEF5, navigation cyan #65DBFF, selected destination amber #F2B96B. These are starting tokens, subject to contrast checks.
- Use a readable sans serif for content and restrained monospaced numerals for coordinates/time. Aurebesh can be decorative, never the only label.
- Atmosphere comes from composition, typography, restrained lighting, high-quality selected images and precise transitions. Limit bloom to selected accents; avoid a glow/filter on every label.

## Warp mechanics

Normal navigation targets 0.9–1.3 seconds once minimum destination data is available. Proposed default: acquire 150ms, accelerate 250ms, transit 400ms, settle 250ms. Cinematic mode may extend to 1.8–2.4 seconds; quick mode uses a short focus transition. These timings are design proposals to test, not final values.

1. Select a destination: show title, region, relevant story, source certainty and a visible Jump control. A simple tap may preview; it must not accidentally warp after a drag.
2. Prepare: load minimal destination metadata; opportunistically fetch a thumbnail and prewarm required shader/material. Never wait for a large texture before allowing navigation.
3. Depart: retain origin/destination in the minimap. Slight camera movement and local star streaks signal acceleration without blanking the interface.
4. Transit: move the atlas camera between display positions; increase streak length and brightness. A navigation guide is labeled as a visual connection, not a verified hyperspace lane.
5. Arrive: settle the camera, reduce effects, reveal the world title and dossier; upgrade artwork asynchronously. Avoid a full-screen white flash.

The minimap, Back, Skip, destination name and basic timeline context remain readable during travel. The larger map may be partially obscured by streaks, but never replaced by a long opaque loading tunnel. Animation time is independent of canonical distance or elapsed story time.

### Navigation contract

Logical states: idle → preparing → departing → transit → settling → focused. A single XState navigation actor owns the active request and transition phase; the graphics frame loop owns interpolation. Motion owns DOM panels, not camera movement.

- Store selected destination separately from current camera position. Validate destination/visibility before committing the route; add one history entry per navigation, never per frame.
- Back or Cancel aborts the active request and restores the previous stable route/view. Skip commits the destination immediately.
- A new destination replaces the pending request; do not queue long chains of unwanted jumps. Generation/request IDs prevent stale loads from triggering old arrivals.
- During travel, deliberate pan input cancels the cinematic motion and enters manual map control. The selected story can remain selected without forcing the camera back to it.
- A failed image load uses a placeholder. A missing essential record leaves the previous valid view and offers retry. WebGL context loss cancels effects and opens the lightweight map/list view without losing filters or watch state.
- Reduced motion uses immediate camera placement with a brief optional fade; disable streaks, parallax and automatic orbit. Provide keyboard destination search and ordinary links independent of canvas picking.
- Refresh/share links restore selected entity, era, filter and stable view. Persist camera framing at gesture end, not every frame. Do not put private watch history in shared URLs.

## Map, picking and labels

Use an orthographic plane for the geographic renderer. Source grid coordinates remain separate from normalized display x/y. Decorative stars never receive factual place IDs. All main-map, minimap and fallback renderers consume the same location projection and filter results.

- One WebGL canvas and context; use a small SVG minimap instead of a second 3D renderer.
- Batch or instance markers and particle fields; share geometries and materials. Render only relevant connections.
- Cull labels to the visible viewport and prioritize selected, story-relevant and major systems. Apply collision rules; expand detail as zoom increases. Keep the selected label visible.
- Limit DOM overlays to a bounded set of visible labels/controls; do not create one HTML component for every galaxy star.
- Convert pointer position through the current camera transform, use screen-space hit tolerances, and suppress clicks after movement beyond a tested drag threshold.
- One-finger pan, two-finger zoom around the pinch center, wheel/trackpad zoom around the pointer. No gesture should move the fixed viewport element itself.
- Camera framing considers the sheet/panel's occupied area. Reset restores the defined galaxy home view, not arbitrary clamps.
- Unknown locations remain searchable and usable in story views. Do not put them at coordinate zero. Distinguish system, planet, moon, surface place, mobile station and realm.

## Story mode

Users can follow a character, title or curated arc. Each stop identifies the evidence story and whether it is a present-day appearance, flashback or other event. Pausing allows free exploration; Resume returns to the selected stop. Character-specific location evidence is required: an episode's full location list cannot be assigned to every cast member.

Time changes are explicit. A journey can move backward for a flashback, but should announce that shift and offer a chronological-event view separately from viewing order. Connections and images obey watched-title spoiler rules before rendering, including tooltips and search previews.

Use the audit's 185 core watchable items as the initial catalog, with explicit relationship coverage. Preserve the Clone Wars film, official relative story order, Andor arc boundaries and cross-series bridge links. The currently measured catalog is not a complete character/location graph.

## Application and data boundaries

Suggested modules: app shell/routes; domain records and selectors; navigation/journey state machines; renderers and camera/picking; UI panels and timeline; local progress/settings; ingestion and validation scripts. Keep these boundaries out of the visitor-facing UI.

- Published data: versioned immutable manifest, compact catalog/map index, detail shards by stable ID, provenance and media manifest. Build search indexes ahead of time. No live third-party API needed for normal browsing.
- Canon model: work, event, appearance, relationship, location, claim/source, asset and edition. An event carries date interval/precision and a source; a work carries release metadata and watch identity.
- Editorial pipeline: permitted sources → staged raw responses → identity resolution → reviewed claims → deterministic validation → published snapshot. Ambiguous records remain in a review queue.
- Secrets: provider credentials stay in build jobs or narrowly scoped server functions. Browser receives only published public data and permitted media URLs.
- Storage: small versioned local preferences/progress store, export/import backup, graceful storage-denied behavior. IndexedDB can cache larger permitted data later. Accounts and a hosted database are not required for first release.
- URLs: stable entity routes with share metadata. Prerender dossier HTML from the same snapshot; mount the atlas canvas only on the client. Keep its root mounted across panel/selection changes.
- Source changes produce a reviewable diff. Do not let upstream AI-generated text or unverified scraped relationships silently overwrite approved claims.

## Performance and quality budgets

Provisional acceptance budgets, to validate on a named midrange Android phone, iPhone Safari and desktop. Record hardware, browser, build, network profile, fixture, sample count and thermal state. No performance results exist yet.

| Measure | Initial target |
|---|---|
| Core Web Vitals | Field p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; lab tests approximate until field data exists |
| Shell JS | ≤200KB gzip initial JS excluding lazy graphics chunk; investigate before raising |
| Graphics JS | ≤350KB gzip incremental budget; measure tree-shaken production build |
| Initial transfer | ≤1.5MB compressed through first usable map; no high-resolution planet textures up front |
| Pan/zoom/warp | Target 60fps on agreed baseline; frame-time p95 ≤20ms during measured interactions, degrade effects if unable to sustain |
| Reduced graphics mode | Preserve responsive input; target stable 30fps or use flat fallback on constrained devices |
| Input feedback | Selection highlight within 100ms; transition never locks Back or Skip |
| Resource stability | Repeated 50-destination cycle should plateau after cache warmup; track retained assets and context-loss events |

Implementation: render on demand at rest; start frames only for active interaction/transition, stop when settled, and pause when hidden. Disable endless ambient planet rotation by default; optional cinematic idle mode can trade battery for motion. Cap device-pixel ratio (starting 1–1.5 on phones, ≤2 desktop), reduce particles/effects with measured sustained frame time and hysteresis, and downsize textures. Do not downgrade label contrast or factual detail.

Preload only a likely next destination within a bounded cache; dispose GPU resources on eviction. Reserve image dimensions. Use responsive compressed media. Avoid React state updates per frame, large scene remounts, dynamic shadows, volumetric clouds and full-screen postprocessing stacks in the initial slice.

## Build sequence and decision gates

1. ICM setup and data contracts: adopt the existing kit, place audit findings into scoped references, define source and coordinate rules. Pass the structural checker and fresh-agent walk test.
2. Navigation proof: three reviewed worlds, fixed viewport, pan/pinch, selection, minimap, focus and Back. Demonstrate correct framing on phones before adding warp effects.
3. Cinematic slice: one polished warp, one world arrival, quick/reduced modes, cancellation and loading fallback. Measure the budgets. If R3F misses them after bounded optimization, compare a Pixi version of the same fixture before expanding.
4. Story integration: one evidence-backed journey, spoiler handling, timeline, deep links and watch progress. Test flashbacks and Boba Fett/Rogue One dependency links without inventing travel.
5. Catalog expansion and release: all 185 items searchable; publish reviewed relationship coverage, complete chosen asset provenance, prerender share pages, validate mobile and desktop.

Validation includes unit checks for coordinates/identity/date intervals/spoilers, state-machine cancellation and stale load tests, browser touch tests, direct-link/back/refresh tests, and visual captures for each view. Test reduced motion, keyboard navigation, 200% text, narrow phones, landscape, missing images, blocked storage and WebGL loss. A browser emulator does not replace physical-device evidence.

## Research supporting the recommendation

- [R3F stable compatibility](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [R3F demand rendering and scaling](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [R3F frame-loop pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)
- [Three orthographic camera](https://threejs.org/docs/pages/OrthographicCamera.html)
- [Pixi performance guidance](https://pixijs.com/8.x/guides/concepts/performance-tips)
- [React Router modes](https://reactrouter.com/start/modes) and [prerendering](https://reactrouter.com/how-to/pre-rendering)
- [Vite](https://vite.dev/guide/), [XState](https://stately.ai/docs/xstate), [Motion accessibility](https://motion.dev/docs/react-accessibility)
- [Web Vitals definitions](https://web.dev/articles/vitals)
- [Coverage audit](coverage-audit.md), [ICM development plan](icm-development-plan.md)
