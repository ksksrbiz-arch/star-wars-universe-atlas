# Visual world exploration

November 7, 2026. This batch adds a hero entry point to the visual world directory, original static world symbols, region/terrain/watch filters, explicit linked-world exploration, and four additional field guides. The directory contains 97 unique worlds, including 76 mapped destinations and 21 without placements. Terrain is sourced for eight reviewed worlds only; other terrain remains unreviewed. Counts expose watched title links only. Revealing a title does not automatically reveal its other worlds.

Eight field guides contain 17 local settings and habitat references, backed by 24 official Databank pages. New guides cover Bespin, Dagobah, Yavin 4 and Endor's forest moon. Illustrations are original, not official surface maps; gas-giant and moon distinctions remain explicit.

## Integration and data

Main advanced during the batch to `d4cbde9`, containing the concurrent 14-world/13-association release and screen-space map-label improvements. Merge `b999f8f` retains those changes. Independently reviewed duplicate data modules were compared canonically against the published modules and matched exactly before removal. Review evidence remains in [geography reconciliation](../reconciled-world-geography.md) and [association reconciliation](../live-associations-reconciliation.md).

No live database mutation was needed or performed by this batch. The frontend and prepared manifest match existing live publication `catalog-sha256-830d2d213e3009a8e609cc57c6b2a8dda9bddba31bdd4d721751d86ff690171c`: 193 catalog titles, 76 worlds, 283 associations and five sequences. All four public API full-payload digests were checked read-only. Six titles still have no reviewed location relationship; title coverage is not exhaustive scene coverage.

## Validation scope

Pre-merge production browser checks passed for hero directory opening/focus/hash, region/terrain/watch filters, watched-count and collection-reveal boundaries, keyboard flow and unmapped restrictions at 1440, 390 and 320 pixels. Eight field guides passed at the same widths. All 76 finder destinations were navigated at 1440 and 320 pixels. Screenshots were visually inspected; source-link arrows were switched to SVG icons after the screenshots exposed missing Unicode glyphs.

Final post-merge validation and live verification are recorded below when complete. Chromium uses software WebGL and emulated viewport sizes; these are not physical-device performance measurements.

## Final post-merge checks

Production build passes. Map-density browser checks pass at 1440 and 390 pixels: 76 markers, zero optional-label overlaps, selected labels remain available, edge-world labels fit, and no page errors. Directory discovery/filter tests and all eight dossier source/disclosure/layout checks pass at 1440/390/320 pixels. Seeded-watch directory tests pass; related-world disclosure passes hidden-title boundaries, explicit opening/closing, destination reset, mapped/unmapped behavior, separate Journey reveal and unchanged watch progress. The related-world test awaits the native asynchronous `toggle` event before asserting content removal.

Disposable PostgreSQL tests pass for the merged publication generator: additive catalog/world/appearance/sequence publication, full-payload verification, idempotent replay preserving timestamps, and rollback on conflicting data or baseline identity. Deterministic artifact identity, world validation and map digest checks pass. Reconciled source tests pass for all 14 new world placements; coverage remains 283 associations across 187 titles, with 76 mapped destinations.

Final build assets: `index-BpYNZ6yk.js`, `index-Dl9MN9eY.css`, `Galaxy-BwCCa0xs.js`, `Galaxy-DAA9VngG.css`, `CinematicBloom-BcBoadKL.js`. Screenshot captures, including the corrected SVG source icons, are retained outside the repository at `/workspace/directory-qa/final-directory-320.png` and `/workspace/directory-qa/final-related-320.png`. Map-density output is under `/workspace/directory-qa/evidence/map-density/`.

## Live rollout verification

Commit `d5873cb` deployed to https://star-wars-universe-atlas.skdev-371.workers.dev on November 7, 2026. Live HTML references the final entry assets, and all five JavaScript/CSS assets listed above match the local production build byte for byte.

Live production browser checks pass for directory entry/focus/hash and filtering at 1440/390/320 pixels; seeded-watch counts, collection boundaries, unmapped restrictions and keyboard behavior; explicit related-world disclosure/close/reset and independent Journey reveal; and all eight dossier source links, keyboard disclosures, caveats, portraits and responsive layouts at 1440/390/320 pixels. Watch progress remains unchanged throughout these checks.

All four live API payload digests match the reconciled manifest: 193 catalog items, 76 mapped worlds, 283 associations and five sequences. Verification used read-only requests; no database write occurred. Raw asset/API results are retained at `/workspace/directory-qa/live-assets-api.json`.
