# Live-action appearance expansion

Reviewed November 7, 2026 against upstream `133b635`. This pass adds 12 relationships across 8 already-covered episodes: 9 Andor links and 3 Mandalorian links. It deepens appearance coverage; it does not increase the number of covered titles. The new module is `src/connectionsLiveActionExpansion.ts`; root owns registry integration.

## Sources actually browsed

| Episode and added world | Supporting evidence |
|---|---|
| Andor 1x02 — Kenari | [Episode highlights](https://www.starwars.com/news/andor-episode-2-that-would-be-me-highlights) identify young Kassa and the devastated mining landscape. Flashback. |
| Andor 1x03 — Kenari | [Episode highlights](https://www.starwars.com/news/andor-episode-3-reckoning-highlights) explicitly name the opening flashback setting. |
| Andor 1x08 — Segra-Milo | [Episode highlights](https://www.starwars.com/news/andor-episode-8-narkina-5-highlights) name Saw and Luthen's meeting location. Source spelling “Segra Milo” normalized to Segra-Milo. |
| Andor 1x11 — Ferrix and Segra-Milo | [Season-one arc-four rewatch](https://www.starwars.com/news/andor-revisited-rewatch-season-1-arc-4) ties Bee's grieving scene and Luthen's orbital encounter explicitly to episode 11. |
| Andor 1x11 — Niamos | [Exact episode guide](https://www.starwars.com/series/andor/andor-episode-11-daughter-of-ferrix) names the return destination and indexes Niamos. Kept as a location-index association without a specific scene type or travel sequence. |
| Andor 2x10 — Naboo | [Finale commentary](https://www.starwars.com/news/andor-season-2-finale-episodes-10-11-12) names the flashback operation's setting; [episode 10 guide](https://www.starwars.com/series/andor/season-2-episode-10-episode-guide) identifies Kleya's recollections within her hospital mission. [Week-four trivia](https://www.starwars.com/news/andor-trivia-guide-week-4) independently confirms Naboo flashback filming. |
| Andor 2x12 — Coruscant and Mina-Rau | [Finale commentary](https://www.starwars.com/news/andor-season-2-finale-episodes-10-11-12) names the safehouse and closing field settings. [Episode 12 guide](https://www.starwars.com/series/andor/season-2-episode-12-episode-guide) anchors the safehouse rescue to this episode. |
| Mandalorian 3x02 — Tatooine and Kalevala | [Chapter 18 highlights](https://www.starwars.com/news/the-mandalorian-chapter-18-the-mines-of-mandalore-highlights) explicitly name the R5-D4 stop and Bo-Katan's starting location. |
| Mandalorian 3x05 — Adelphi | [Official Adelphi set visit](https://www.starwars.com/news/star-wars-the-mandalorian-and-grogu-set-visit) explicitly identifies Zeb's bar introduction as Season 3, Chapter 21. The later film remains outside this relationship pass. |

## Boundaries and omissions

- Three flashbacks and one orbital association have explicit context fields. Remaining supported surface scenes are labeled surface; Niamos remains unspecified.
- Segra-Milo and Adelphi remain textual if the map registry lacks separately sourced placements. No coordinates or destinations were invented.
- Existing relationships are unchanged. No array order means travel order.
- Andor 2x12 references to Jedha, Scarif, and the Rings of Kafrene were not converted into visits. The prison description resembling Narkina 2 was not treated as a confirmed planet identity.
- Andor guide Databank carousels can include series-wide characters and worlds; this pass does not infer appearances merely from their presence. The Niamos exception is explicitly backed by the episode-specific return synopsis and marked as association evidence.
- Complete appearance coverage, character itineraries, and global BBY/ABY chronology are not asserted.

## Validation

Validated catalog IDs, duplicate pairs against the live registry, matching established world names, official-source hosts, supported context values, and absence of coordinates or sequence fields. Root performs final integrated build and release checks.
