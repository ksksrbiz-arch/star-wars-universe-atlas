# Mapped worlds, episode evidence and label-density release

November 7, 2026. Integrated on upstream3bb193a, preserving cinematic media/audio, field guides and guided journeys.

## Scope

Three agents handled geographic research, episode evidence, and map rendering. Added14 independently verified system-grid placements and13 episode/world relationships. Totals:76 mapped worlds (27 reference-traced,49 cell centers),283 relationships across187 of193 titles,96 associated world identities and five viewing sequences. Six reviewed named-world gaps remain; covered titles are not complete scene inventories.

[Geography audit](../mapped-worlds-expansion.md) records the official appendix grids/pages for Abafar, Adelphi, Arcana, Bothawui, Carlac, Corellia, Lothal, Lotho Minor, Oba Diah, Quarzite, Seatos, Segra-Milo, Quell and Ringo Vinda. System-grid cells remain schematic, not exact planet coordinates. [Episode audit](../next-connection-expansion.md) records13 official gallery-backed associations across12 already-covered Clone Wars episodes. Quell atmospheric combat and Ringo Vinda ring-station action retain explicit qualifications. Raxus remains textual; the appendix's Raxus Prime entry was not substituted. Peridea remains outside this galaxy map.

## Visuals

Screen-space decluttering suppresses overlapping optional labels, while current, selected, highlighted chapter and featured labels remain available. The mobile zoom threshold now makes minor labels reachable. Priority edge labels are clamped inside the canvas without moving source markers; Lothal U-7 is covered. Static halos and distinct symbols differentiate current, preview and episode markers. Keyboard controls, single-canvas demand rendering, reduced motion, cinematic media and warp mechanics are preserved.

## Executed checks

Build/types, ICM, catalog, chronology, connection identity/context, reference geography, prepared publication identity, Worker regressions and media provenance passed. Desktop1440/mobile390 new-world navigation passed for all14 additions, including Lothal arrival and new Ahsoka mapped stops; Peridea stays disabled. Source-context UI checks and reference-map desktop/mobile/reduced-motion layer/warp/cancel/skip checks passed. Density tests recorded zero optional-label overlap at both viewports, visible selection/focus and in-canvas Lothal labeling. Final visual graphics and lettering regressions passed; idle draw calls remained zero during measured600ms settled windows. A separate local disposable-Postgres integration suite was not run.

## Database publication

Publication now includes mapped-world payload digests and guarded additive world insertion, in addition to existing catalog/sequence/appearance guards. Existing mapped IDs, grids and full payloads must be exact subsets; a conflict aborts the whole transaction. A deliberate mismatched TEMP-table map fixture was rejected by the actual Neon guard, then persisted counts were confirmed unchanged at62 worlds/270 links with no new publication row. No persistent write was included in that rejected probe.

The complete reviewed additive transaction then succeeded on Neon project young-hall-18334569, branch br-bitter-violet-ak7la0ve, database atlas. Public API full-payload digests verified76 worlds,283 appearances,193 works and5 sequences. Runtime credentials/permissions were unchanged. Explicit database expectations were updated only after verification.

These browser checks use Chromium/software WebGL and emulated viewports, not physical-device performance measurements. Large-chunk warnings remain. No complete spoiler safety, exhaustive geography, continuous character itinerary or cloud progress synchronization is claimed. Live application deployment is recorded below after verification.


## Live release

Application commit `b01fc31aec9567a2d92fb411fcb409abbe4c6d99` deployed successfully through Cloudflare build `066646ac-7774-480e-b692-a965983f34c4`.

Public URL: https://star-wars-universe-atlas.skdev-371.workers.dev

Production checks passed: test-deployment (all six API endpoints, mapped-world/catalog/sequence/appearance payload digests, read-only API behavior, desktop/mobile map and warp/skip), test-mapped-expansion (all14 new choices, grids, Lothal jump, Ahsoka mapped stops, Peridea exclusion), test-map-density (76 labels, no visible optional-label overlap, selected-edge bounds and keyboard focus), and test-guided-journey (desktop/mobile/narrow layouts and spoiler/progress boundaries). No browser errors were reported. Publication-row identity and world digest were also read back directly from Neon. Updated production screenshots and JSON results are committed with this record.
