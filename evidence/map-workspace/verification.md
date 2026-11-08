# Map-first workspace and Rogue One

November 7, 2026. This bounded batch keeps the existing React/Three.js stack and single camera owner. The galaxy precedes discovery content, with a compact story/destination panel alongside it on desktop. Mobile uses a collapsible panel beneath the map. Search, layer choices and quality settings move into a labeled disclosure; zoom/pan/reset/return controls remain on the map. Travel completion opens the destination file, and preview, arrival and watch progress remain separate states.

## Content and source boundaries

Rogue One adds one separately sourced film, one whole-work collection sequence and eight location associations. Totals: 194 titles, six sequences, 291 associations across 188 titles and 102 associated location identities; six titles still lack reviewed links. The directory contains 103 locations, including 76 mapped destinations. Existing map coordinates and all prior catalog/sequence/appearance payloads remain unchanged.

The location model supports planets, moons, asteroid outposts, stations, ships, systems, nebulas, regions and unknown identities. Only reviewed identities receive a type. The Ring of Kafrene is an asteroid outpost; Jedha is a moon. Unmapped locations open sourced textual files without changing the galaxy position or enabling warp. No new map coordinates are inferred from film appearances.

Five new original illustrated field guides cover Scarif, Jedha, Eadu, Lah’mu and Mustafar, bringing the guide count to 13. Yavin 4 receives a more distinctive original portrait. Illustrations are not official stills or factual surface maps. See [film/location research](../rogue-one-source-review.md) and [dossier source/artwork review](../rogue-one-dossier-review.md).

The included Andor → Rogue One → A New Hope links describe whole-work viewing order. Existing collection sequence payloads are preserved. No global event timeline, scene interleaving or continuous travel itinerary is asserted.

## Checks

Initial workspace browser checks measured the map at 207px from the document top on desktop and about 189px on mobile, including the Andor journey. Final browser and publication results follow below. Desktop Chromium/software WebGL and emulated phone widths are not physical-device performance measurements. No label renderer replacement or additional animation loop was introduced.

## Final QA and publication

Production workspace checks pass at 1440, 390 and 320 pixels for both Galaxy and Andor: map top is respectively 207, 189 and 190.03 pixels. Mobile keyboard expansion/collapse, explicit reveal, preview versus arrival, Story/Destination tab preservation, next-chapter spoiler gates, settings/finder access, unchanged watch progress and no horizontal overflow pass.

Rogue One browser checks pass at all three widths: eight locations appear only after explicit disclosure, the Ring of Kafrene is an asteroid outpost with a symbol and no planet globe, Jedha retains its moon identity and sourced dossier, inspecting unmapped locations preserves current map location, and a fresh Andor-finale bridge opens the film without revealing locations. All 13 dossier source links, keyboard disclosures, caveats and responsive layouts pass. Directory watched-count/filter boundaries pass. A WebGL-disabled 390px browser can still find Hoth and arrive instantly through the destination panel without changing watch progress.

Camera command tests passed bounded zoom/pan/reset, repeated commands, keyboard activation and disabled controls during transit. Settled rendering after zoom/pan recorded zero draws over 600ms at desktop and mobile widths, as measured by the camera QA agent. Software WebGL and emulated widths do not establish physical-device performance.

Catalog, chronology, connections, Rogue One source boundaries, dossiers, media provenance, worker regressions and publication artifacts pass. Disposable local PostgreSQL tests pass additive insertion, all four data digests, idempotent replay preserving timestamps and transaction rollback on conflicting existing data.

After zero-conflict comparisons of all four existing public datasets, the exact reviewed additive transaction was applied to the verified `atlas` database as `atlas_owner`. Publication `catalog-sha256-5932b0b0c57fb2f6510af138f432e7b8a492f06f0ad66cdf825ec30524c1d554` adds one catalog film, one viewing sequence and eight associations. Existing payloads remain unchanged. Database verification confirms all four digests and the exact publication marker. Independent public API verification confirms 194 titles, 76 mapped worlds, 291 associations and six sequences; only then was the database expectation updated. No schema or permission changes were made.

Final frontend assets: `index-Dh8hoO2k.js`, `index-BnzF1qBl.css`, `Galaxy-BNjsCdw2.js`, `Galaxy-DAA9VngG.css`, `CinematicBloom-C5ASbg9m.js`. Additional expanded Rogue One/Jedha/Ring screenshots at all three widths and publication results are retained under `/workspace/map-workspace-qa/`.

Final finder usability check: choosing a world closes the settings popover and moves keyboard focus to the map. The final production workspace and camera command suites pass after this change.
