# Context index

Status: deployed platform preview, November 7, 2026. There are 76 schematic map destinations: eight general worlds, 67 direct journey placements, and Endor's parent-system placement. The catalog exposes 323 watchable items: 315 episode watch records and eight films across the original trilogy, Andor, The Clone Wars (2008), The Mandalorian, Ahsoka season one, Rogue One, The Book of Boba Fett season one, the prequel trilogy, Rebels seasons 1–4, and The Bad Batch seasons one through three, and Obi-Wan Kenobi. The original nine specials, four Rebels introductory shorts, The Ultimate Guide and Season 2 Recap are excluded. Eleven sourced collection viewing sequences cover all 323 items. Story/location relationships are a partial evidence pass; see the [journey data review](../evidence/journey-data-review.md) and the generated [coverage JSON](../evidence/journey-coverage.json) (refresh with `node scripts/test-journey-data.mjs --write`).

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

Per-batch scope, counts and caveats (Ahsoka, Boba Fett, prequels, Rebels seasons 1–4, Bad Batch seasons 1–3) are in [release history](../evidence/release-history.md); sourcing detail is in each batch's review under `evidence/`.

Integrated relationships: 495 links, 315 covered titles, 164 distinct locations, and 8 titles without current links. Coverage is partial even for covered titles. The 76 mapped destinations and 164 relationship-location names measure different things; unsupported placements remain textual.

Geographic source and schematic projection are documented in the data module. Eight world names/grids were checked against the earlier official-appendix audit; all current entries match. Official Databank pages support the broad setting descriptions, with era/edition limits retained. Hoth and Bespin share cell K-18; Yavin 4 uses the parent-system cell.

The original 181 episode titles, dates, and season/episode numbers match the audit CSV; both catalog input hashes match. Source metadata retains attribution and release-type caveats. All Clone Wars episode runtimes and all eight film runtimes are withheld. The chronology module adds the complete official Clone Wars viewing order and numbered narrative orders for the other collections. Flashbacks remain within their episodes; no exact global BBY/ABY chronology is asserted.

Library/release-timeline/watch views and browser-local progress are implemented independently of the world map. Complete event/character links, comprehensive spoiler controls, authenticated media ingestion, and cloud sync remain future work. Cloudflare hosts the public preview with a read-only Neon/Postgres API through Hyperdrive and separate R2 buckets. Release evidence is in `evidence/deployment/`. Browser-local watch progress now supports merge-only backup import and cross-tab synchronization; destination search/share and first-unwatched journey controls are documented in `evidence/explorer-upgrade/verification.md`. No physical-device performance claim is made.

The visual world directory combines 76 mapped destinations with unplaced textual locations, original thumbnails and reviewed terrain filters. Field guides include Rogue One destination studies and Rebels season-one and season-two locations. Linked-world exploration has a separate disclosure from title reveal. The earlier geography and appearance reconciliation preserved its existing live publication; see `evidence/reconciled-world-geography.md` and `evidence/live-associations-reconciliation.md`.
