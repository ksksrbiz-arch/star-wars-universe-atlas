# Journey data review

Authoritative counts are generated, not hand-written: see [journey-coverage.json](journey-coverage.json), produced by `node scripts/test-journey-data.mjs --write` (or `WRITE_EVIDENCE=1`). A plain `npm run test:journey-data` asserts the committed file against the live modules and fails if it is stale; it never rewrites the file.

Snapshot checked November 7, 2026 (`checkedOn` in the JSON): 495 title/world relationships across 315 of 323 catalog titles and 164 distinct location identities. Eight titles have no current link; this does not mean those works have no settings. Only 76 worlds have supported schematic map placements (27 approximately traced, 49 cell-centered); the other associated locations remain textual evidence. Per-series counts and the unlinked title IDs are in the JSON.

This review is a targeted source/semantics review, not certification of every relationship or a browser test. The additional Clone Wars pass contributes 72 relationships across 63 episodes, after inspecting all 133 official guide synopses. It uses explicit settings plus episode-specific clip and story-gallery descriptions; generic related biographies and inferred arc inheritance are excluded.

The map placements are 76 schematic destinations: eight general placements, 67 direct journey placements, and Endor joined through its parent system. An appearance relationship does not provide coordinates. Collection viewing orders cover all 323 catalog items; they do not all have audited location appearances.

## Source samples and findings

- [Andor episode 1 guide](https://www.starwars.com/series/andor/andor-season-1-episode-1-episode-guide) explicitly supports Morlana One, Ferrix, and Kenari. Kenari is correctly labeled a flashback rather than a contemporary route stop.
- [Andor finale guide](https://www.starwars.com/series/andor/season-2-episode-12-episode-guide) supports Yavin 4. Future Rings of Kafrene travel is not promoted to a present appearance.
- [Chapter 13 highlights](https://www.starwars.com/news/the-mandalorian-chapter-13-the-jedi-highlights) spells Corvus as Corvis. The [official Corvus Databank](https://www.starwars.com/databank/corvus) supports normalization through the same Calodan/Morgan Elsbeth setting; retain that second source in the note.
- [Andor finale explainer](https://www.starwars.com/news/andor-season-2-finale-episodes-10-11-12) supports a Naboo flashback across the finale arc but does not independently identify its episode. Requested removal of the E10-specific link until an episode-specific source anchors it.

Array order is editorial, not within-episode travel. Associations may concern different characters, orbital action, destruction, or flashbacks. Related Databank cards alone must not create episode appearances. Missing relationships mean unreviewed coverage, never proof of absence. Edition-specific Return of the Jedi celebration locations remain excluded. More structured appearance-type fields would improve future filtering; current notes retain these distinctions.

Episode location indexes are a weaker association tier than explicit synopsis scenes. When used, their notes must identify that source tier; they cannot establish which character visited, surface landings, or scene order. The Clone Wars additions exclude Coruscant where only future transport is stated, Vanqor where only the preceding episode is recalled, and Kamino where an attempted journey is interrupted. Mortis is identified as a mysterious Force realm and receives no invented physical coordinates.

Second-pass Clone Wars risk check: Mon Cala is explicitly named in the S4E1 and S4E3 synopses; no Mon Calamari-character-to-world inference is used. Scipio is named in the S6E5 and S6E7 synopses. S7E9's Yerbana and S7E3's Skako Minor come from their own opening story-gallery captions; they are not imported from other episode galleries. S7E11's Mandalore is supported by its opening city-street gallery caption as well as the synopsis. S7E12's reused duel featurette references Mandalore, but no Mandalore link was added for that finale. S2E22's Vanqor recap was excluded while its explicit Coruscant investigation and Florrum showdown were retained. No removals were warranted by this focused second pass.

Remaining work: expand exact episode evidence, retain the distinction between complete catalog order and partial appearance coverage, and test integrated Journey behavior separately. Per-batch additions are recorded in [release history](release-history.md), not repeated here. No current-batch browser or deployment claim is made here.
