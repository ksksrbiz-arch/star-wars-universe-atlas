# Context index

Status: deployed platform preview, November 7, 2026. There are 62 schematic map destinations: eight general worlds, 53 direct journey placements, and Endor's parent-system placement. The catalog exposes 185 watchable items: 181 regular episodes and four films across the original trilogy, Andor, The Clone Wars (2008), and The Mandalorian. Nine specials are excluded. Four sourced collection viewing sequences cover all 185 items. Story/location relationships are a partial evidence pass; see [review](../evidence/journey-data-review.md).

## Workflows

- [Data](workflows/data/CONTEXT.md)
- [Map/warp](workflows/map-warp/CONTEXT.md)
- [UI/media](workflows/ui-media/CONTEXT.md)
- [QA/release](workflows/qa-release/CONTEXT.md)

## Shared references

- [Product scope](references/product-scope.md)
- [Design system](references/design-system.md)
- [Map and motion](references/map-and-motion.md)
- [Canon and sources](references/canon-and-sources.md)
- [Media policy](references/media-policy.md)
- [Performance and tests](references/performance-and-tests.md)

## Current evidence

Integrated relationships: 208 links, 160 covered titles, 80 distinct worlds, and 25 titles without current links. Coverage is partial even for covered titles. The 62 mapped destinations and 80 relationship-world names measure different things; unsupported placements remain textual.

Geographic source and schematic projection are documented in the data module. Eight world names/grids were checked against the earlier official-appendix audit; all current entries match. Official Databank pages support the broad setting descriptions, with era/edition limits retained. Hoth and Bespin share cell K-18; Yavin 4 uses the parent-system cell.

All 181 episode titles, dates, and season/episode numbers match the audit CSV; both catalog input hashes match. Source metadata retains attribution and release-type caveats. All Clone Wars episode runtimes and all four film runtimes are withheld. The chronology module adds the complete official Clone Wars viewing order and numbered narrative orders for the other collections. Flashbacks remain within their episodes; no exact global BBY/ABY chronology is asserted.

Library/release-timeline/watch views and browser-local progress are implemented independently of the world map. Complete event/character links, comprehensive spoiler controls, authenticated media ingestion, and cloud sync remain future work. Cloudflare hosts the public preview with a read-only Neon/Postgres API through Hyperdrive and separate R2 buckets. Release evidence is in `evidence/deployment/`. Browser-local watch progress now supports merge-only backup import and cross-tab synchronization; destination search/share and first-unwatched journey controls are documented in `evidence/explorer-upgrade/verification.md`. No physical-device performance claim is made.

