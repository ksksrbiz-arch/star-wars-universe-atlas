# Context index

Status: deployed platform preview, November 7, 2026. There are 76 schematic map destinations: eight general worlds, 67 direct journey placements, and Endor's parent-system placement. The catalog exposes 218 watchable items: 210 episode watch records and eight films across the original trilogy, Andor, The Clone Wars (2008), The Mandalorian, Ahsoka season one, Rogue One, The Book of Boba Fett season one, and the prequel trilogy. Nine specials are excluded. Nine sourced collection viewing sequences cover all 218 items. Story/location relationships are a partial evidence pass; see [review](../evidence/journey-data-review.md).

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

Integrated relationships: 342 links, 212 covered titles, 113 distinct locations, and 6 titles without current links. Coverage is partial even for covered titles. The 76 mapped destinations and 113 relationship-location names measure different things; unsupported placements remain textual.

Geographic source and schematic projection are documented in the data module. Eight world names/grids were checked against the earlier official-appendix audit; all current entries match. Official Databank pages support the broad setting descriptions, with era/edition limits retained. Hoth and Bespin share cell K-18; Yavin 4 uses the parent-system cell.

The original 181 episode titles, dates, and season/episode numbers match the audit CSV; both catalog input hashes match. Source metadata retains attribution and release-type caveats. All Clone Wars episode runtimes and all four film runtimes are withheld. The chronology module adds the complete official Clone Wars viewing order and numbered narrative orders for the other collections. Flashbacks remain within their episodes; no exact global BBY/ABY chronology is asserted.

Library/release-timeline/watch views and browser-local progress are implemented independently of the world map. Complete event/character links, comprehensive spoiler controls, authenticated media ingestion, and cloud sync remain future work. Cloudflare hosts the public preview with a read-only Neon/Postgres API through Hyperdrive and separate R2 buckets. Release evidence is in `evidence/deployment/`. Browser-local watch progress now supports merge-only backup import and cross-tab synchronization; destination search/share and first-unwatched journey controls are documented in `evidence/explorer-upgrade/verification.md`. No physical-device performance claim is made.


Ahsoka season one adds eight separately sourced metadata records and 14 episode/world associations. The original 185-item audit remains distinct. Provider dates are preserved; unknown runtimes remain withheld. See `evidence/ahsoka-source-review.md`.

The visual world directory contains 103 unique locations (76 mapped), with original thumbnails and reviewed terrain filters. Thirteen field guides include five Rogue One destination studies. Linked-world exploration has a separate disclosure from title reveal. The earlier geography and appearance reconciliation preserved its existing live publication; see `evidence/reconciled-world-geography.md` and `evidence/live-associations-reconciliation.md`.

The Book of Boba Fett adds seven chapters and eleven partial associations, including historical Mandalore/Coruscant scenes, the unmapped Glavis station, and an unnamed-parent Jedi-school site. See [Boba evidence review](../evidence/boba-fett-source-review.md). No new galaxy coordinates are asserted.

The prequel trilogy adds three films and twenty partial associations, including Order 66 montage contexts. Polis Massa is an asteroid outpost, and Dagobah is excluded because its Episode III arrival is a deleted scene. No map coordinates are added. See [prequel source review](../evidence/prequel-source-review.md).

Rebels season one adds 14 watch records covering all 15 official parts: the two-part Spark of Rebellion premiere is one progress record (S01E01–02), followed by S01E03–15. Four Rebels promotional shorts are excluded separately from the original nine excluded specials. Twenty sourced associations cover all 14 records, without claiming exhaustive scene coverage. Fort Anaxes remains an asteroid outpost; Merchant One and Sovereign remain ships; the finale’s Mustafar setting is orbital. See [Rebels source review](../evidence/rebels-source-review.md).
