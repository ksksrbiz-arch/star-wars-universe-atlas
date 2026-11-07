# Story journeys verification — November 7, 2026

## Delivered

Journey connects collection-local viewing order, title-specific world evidence and cinematic map travel. Users select a collection, step/search chapters, reveal unwatched location links and preview/jump to supported map stops. Catalog records deep-link to the exact Journey title. Galaxy world panels reveal reverse title links. Viewing does not mark anything watched.

Final data:185 catalog items with viewing sequences;171 sourced title/world associations across127 titles and72 distinct world/realm names;62 supported schematic map placements. Location coverage: original trilogy3/3, Andor24/24, Clone Wars78/134 including its film, Mandalorian22/24. At least one association per covered title does not establish exhaustive appearances.58 titles have no link.11 associated names are unplaced; no origin coordinates are substituted. Detailed IDs and missing-world inventory: journey-coverage.json.

Clone Wars follows its official133-episode-plus-film order. Other collections use film/episode narrative order, not scene-level chronological rearrangement. Rogue One and Book of Boba Fett5–7 bridges and Revenge of the Sith overlap are explicit outside-collection references. No exact BBY/ABY calendar is asserted. Flashbacks, destroyed worlds, orbital action and weaker guide-location-index associations retain their qualifications.

## Checks actually completed

- Production TypeScript/Vite build, ICM structure check, chronology, relationship and map-data validation pass.
- Original nine UI regression groups and seven platform groups pass. Library keyboard checks pass with supported Clone Wars story-order sorting.
- Expanded eight-world general-map regression passes at1440,390,320px: hit targets, preview, cancel, skip, same-cell travel, Back, section return, resize, no overflow/errors. Camera comparison is relative to map stage so mobile page scrolling is not mistaken for camera movement.
- Six Journey groups pass: exact-title deep links, reveal boundary, Hoth and Ferrix travel, next chapter, official CW order, Library→Journey links,390/320px fit and no browser errors.
- Four targeted Journey accessibility groups pass: keyboard reveal, visible Kenari flashback qualification, disabled unplaced stop, spoiler state, three bridge/overlap contexts and no errors.
- Reverse-world-link tests pass, plus normal mobile animated arrivals at Ferrix, Mandalore and Endor. No automatic watch-state mutation.
- New shared-cell Tatooine/Geonosis test passes at390px: both44px labels reachable,10px gap, normal animated arrival and no browser errors.
- Final desktop/mobile screenshots captured after animated arrival at Ferrix. Desktop and mobile Journey screenshots visually reviewed during development.

## Implementation and limits

ICM uses the existing compact router, scoped contracts and recorded handoffs; it is a development methodology, not a runtime framework. Work ran in batches across three parallel workers plus root integration. Local React/Vite/R3F implementation retains demand-driven graphics and browser-local watch progress. Canvas is lazy-mounted and retained across section changes to avoid a reproduced portal-removal error.

Final gzip assets: shell105.07KB, graphics252.97KB, CSS10.65KB. Vite reports a generic500KB graphics-chunk warning. These are transfer sizes, not runtime benchmarks. Tests use Chromium/software WebGL and emulated/resized mobile viewports, not physical devices or Safari. No60fps claim, cloud sync, production deployment, full event graph, exact astronomical coordinates, canon hyperspace routes or complete spoiler filtering is claimed.

The additional map rows were matched by exact system-name column in the official appendix, avoiding sector-name coincidences. Existing parent-system joins remain labeled. Background arms, region rings and planet surfaces are illustrations. Related character biographies, recap mentions and planned-but-unreached destinations were not promoted into episode appearances. The source appendix is a reference placement, not a claim that every historical source shares one continuity.

Open http://localhost:4173/#journey . Source links are available in the interface; README contains startup instructions. Prior evidence/verification.md describes earlier builds; this report supersedes its scope and sizes.
