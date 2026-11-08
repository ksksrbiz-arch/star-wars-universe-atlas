# Context index

Status: deployed platform preview, November 7, 2026. There are 76 schematic map destinations: eight general worlds, 67 direct journey placements, and Endor's parent-system placement. The catalog exposes 302 watchable items: 294 episode watch records and eight films across the original trilogy, Andor, The Clone Wars (2008), The Mandalorian, Ahsoka season one, Rogue One, The Book of Boba Fett season one, the prequel trilogy, Rebels seasons 1–4, and The Bad Batch seasons one and two. The original nine specials, four Rebels introductory shorts The Ultimate Guide and Season 2 Recap are excluded. Ten sourced collection viewing sequences cover all 302 items. Story/location relationships are a partial evidence pass; see [review](../evidence/journey-data-review.md).

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

Integrated relationships: 462 links, 294 covered titles, 156 distinct locations, and 8 titles without current links. Coverage is partial even for covered titles. The 76 mapped destinations and 156 relationship-location names measure different things; unsupported placements remain textual.

Geographic source and schematic projection are documented in the data module. Eight world names/grids were checked against the earlier official-appendix audit; all current entries match. Official Databank pages support the broad setting descriptions, with era/edition limits retained. Hoth and Bespin share cell K-18; Yavin 4 uses the parent-system cell.

The original 181 episode titles, dates, and season/episode numbers match the audit CSV; both catalog input hashes match. Source metadata retains attribution and release-type caveats. All Clone Wars episode runtimes and all eight film runtimes are withheld. The chronology module adds the complete official Clone Wars viewing order and numbered narrative orders for the other collections. Flashbacks remain within their episodes; no exact global BBY/ABY chronology is asserted.

Library/release-timeline/watch views and browser-local progress are implemented independently of the world map. Complete event/character links, comprehensive spoiler controls, authenticated media ingestion, and cloud sync remain future work. Cloudflare hosts the public preview with a read-only Neon/Postgres API through Hyperdrive and separate R2 buckets. Release evidence is in `evidence/deployment/`. Browser-local watch progress now supports merge-only backup import and cross-tab synchronization; destination search/share and first-unwatched journey controls are documented in `evidence/explorer-upgrade/verification.md`. No physical-device performance claim is made.


Ahsoka season one adds eight separately sourced metadata records and 14 episode/world associations. The original 185-item audit remains distinct. Provider dates are preserved; unknown runtimes remain withheld. See `evidence/ahsoka-source-review.md`.

The visual world directory combines 76 mapped destinations with unplaced textual locations, original thumbnails and reviewed terrain filters. Field guides include Rogue One destination studies and Rebels season-one and season-two locations. Linked-world exploration has a separate disclosure from title reveal. The earlier geography and appearance reconciliation preserved its existing live publication; see `evidence/reconciled-world-geography.md` and `evidence/live-associations-reconciliation.md`.

The Book of Boba Fett adds seven chapters and eleven partial associations, including historical Mandalore/Coruscant scenes, the unmapped Glavis station, and an unnamed-parent Jedi-school site. See [Boba evidence review](../evidence/boba-fett-source-review.md). No new galaxy coordinates are asserted.

The prequel trilogy adds three films and twenty partial associations, including Order 66 montage contexts. Polis Massa is an asteroid outpost, and Dagobah is excluded because its Episode III arrival is a deleted scene. No map coordinates are added. See [prequel source review](../evidence/prequel-source-review.md).

Rebels season one adds 14 watch records covering all 15 official parts: the two-part Spark of Rebellion premiere is one progress record (S01E01–02), followed by S01E03–15. Four Rebels promotional shorts are excluded separately from the original nine excluded specials. Twenty sourced associations cover all 14 records, without claiming exhaustive scene coverage. Fort Anaxes remains an asteroid outpost; Merchant One and Sovereign remain ships; the finale’s Mustafar setting is orbital. See [Rebels source review](../evidence/rebels-source-review.md).

Rebels season two adds 20 watch records covering 22 official parts, extending the existing Rebels sequence to 34 records across seasons 1–2. The Siege of Lothal (S02E01–02) and Twilight of the Apprentice (S02E21–22) retain combined progress records. Twenty-four associations cover 18 of the 20 new records; The Call and The Forgotten Droid retain explicit identity-evidence gaps. The Ultimate Guide promotional special is excluded separately. No mapped coordinates are added.

See [Rebels season-two source review](../evidence/rebels-season-2-source-review.md) for normalized numbering, exact gallery evidence, exclusions and the reviewed sequence extension.

Rebels season three adds 19 watch records covering 22 official parts: Steps Into Shadow (1–2), Ghosts of Geonosis (12–13) and Zero Hour (21–22) share combined progress records. Its 24 reviewed associations cover all 19 records at least once, with partial scene coverage and documented source conflicts. The existing Rebels sequence preserves its 34-ID prefix and extends to 53 records. No map coordinates are added; Season 2 Recap is excluded.

Rebels season four adds 13 watch records covering its 15 Disney+ numbered slots. Heroes of Mandalore (1–2) and In the Name of the Rebellion (3–4) share progress records; the extended finale remains E15 with no invented E16. Twenty-one sourced associations cover all 13 records at least once, with partial scene coverage and an explicitly later Lira San epilogue. World Between Worlds is a non-geographic realm, not a planet. The Rebels sequence preserves its 53-ID prefix and now contains 66 records across all four seasons. No map coordinates are added.

The Bad Batch season one adds 16 consecutive episode records, a separate tenth collection sequence and 25 sourced associations covering all 16 episodes at least once. Pantora and Ordo Moon retain moon identities. Bora Vio and the finale’s Wayland destination have explicit retrospective official confirmation; Wayland is Nala Se’s parallel storyline, not a squad journey. Tipoca City is destroyed, not all of Kamino. Season three remains outside the current catalog; no coordinates or exact Order 66 scene interleaving are added.


The Bad Batch season two adds 16 individually numbered records and 26 reviewed associations covering every new episode at least once. Its existing collection extends to 32 records, preserving the season-one prefix; the other nine sequence payloads remain unchanged. Safa Toma Raceway and Skara Nal are surface sites without inferred parent planets; Balmorra is an orbital association. Wayland/Weyland spelling is normalized without adopting the conflicting ice-planet descriptor. Season three remains outside scope. No map coordinates are added. See [source review](../evidence/bad-batch-season-2-source-review.md).
