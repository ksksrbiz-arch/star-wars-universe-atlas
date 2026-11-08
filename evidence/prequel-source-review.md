# Prequel trilogy source and coverage review

Reviewed November 7, 2026. This adds three complete film records and twenty partial film/location associations to the prior 201-title catalog. It does not claim an exhaustive scene log, travel itinerary or globally exact event chronology.

## Catalog and chronology

The official landing pages report May 19, 1999 for [Episode I](https://www.starwars.com/films/star-wars-episode-i-the-phantom-menace), May 16, 2002 for [Episode II](https://www.starwars.com/films/star-wars-episode-ii-attack-of-the-clones), and May 19, 2005 for [Episode III](https://www.starwars.com/films/star-wars-episode-iii-revenge-of-the-sith). Records retain source links; territory/release-type meaning is not inferred. All three runtimes remain withheld pending edition-specific verification. Source snapshot: `docs/prequel-trilogy-source.json`.

The [official viewing guide](https://www.starwars.com/news/star-wars-movies-and-series-guide) supports the I–II–III collection order. The existing Clone Wars finale annotation now links the included Revenge of the Sith record. It remains an overlap, never a serialized scene-by-scene watch order. Existing 201 catalog rows and seven sequence payloads are preserved, allowing additive publication.

## Film-by-film appearance audit

Official story-gallery captions were inspected in the rendered page DOM after repeatedly activating Show More: 34 captions for Episode I, 35 for Episode II and 53 for Episode III. The typo in the published Episode I URL is intentional. No gallery artwork or caption prose is copied into the app; locator-based notes are original summaries.

| Film | Locations added | Primary evidence locators |
|---|---|---|
| The Phantom Menace | Naboo, Tatooine, Coruscant | [Story gallery](https://www.starwars.com/films/star-wars-episode-1-the-phantom-manace-story-gallery), captions1/3/26;7;17 respectively. Naboo association includes surface and orbital contexts. |
| Attack of the Clones | Coruscant, Naboo, Kamino, Tatooine, Geonosis | [Story gallery](https://www.starwars.com/films/star-wars-episode-2-attack-of-the-clones-story-gallery), captions1/34;15/35;13;18;21/22/31. Geonosis includes both surface and nearby space action. The archive discussion alone was not used to establish Kamino appearance. |
| Revenge of the Sith | Coruscant, Kashyyyk, Utapau, Felucia, Mygeeto, Cato Neimoidia, Mustafar, Polis Massa, Naboo, Alderaan | [Story gallery](https://www.starwars.com/films/star-wars-episode-3-revenge-of-the-sith-story-gallery), captions1/7/49;18;20/34;34;34;34;37/43;48;50;52. Order 66 montage settings are not a sequential character route. Cato Neimoidia’s aerial scene is not labeled orbital. |
| Revenge of the Sith | Saleucami | [Stass Allie Databank](https://www.starwars.com/databank/stass-allie) names the speeder-patrol setting and lists the film; [Saleucami Databank](https://www.starwars.com/databank/saleucami) independently lists Episode III. |
| Revenge of the Sith | Tatooine | [Polis Massa history](https://www.starwars.com/databank/polis-massa) identifies Luke’s destination; [Tatooine Databank](https://www.starwars.com/databank/tatooine) explicitly lists Episode III. |

## Identity and coverage boundaries

- Kamino, Kashyyyk, Utapau and Mygeeto have separately sourced planet identities from their official Databank pages. No coordinates are added. Kamino already had episode associations; the other three become new textual location files.
- Polis Massa is modeled as an asteroid outpost on a remnant planetoid, not an intact planet. Its [Databank](https://www.starwars.com/databank/polis-massa) distinguishes the original destroyed world from the later research/medical outpost. It remains unmapped.
- Episode I: the three named planetary settings in this reviewed gallery are linked. Ship interiors and individual surface localities are not separate appearance records in this batch.
- Episode II: five named planetary settings are linked. The Geonosis asteroid-field action is qualified within that world association, not assigned a guessed separate coordinate. Scenes within ships and hologram participants are not expanded into a complete event graph.
- Episode III: twelve named locations are linked, including four short Order 66 montage worlds. No Geonosis association is inferred from the final Death Star construction scene because the reviewed gallery does not establish its geographic placement. Ship interiors and unidentified space remain unexpanded.
- Dagobah is deliberately excluded. The official [deleted-scenes article](https://www.starwars.com/news/revenge-of-the-sith-deleted-scenes) identifies Yoda’s arrival as an extra, separate from the finished film. This is an edition boundary, not a denial of the scene’s existence.
- These sources do not establish exhaustiveness or continuous journeys. Array order and whole-film viewing order do not encode within-film travel or exact dates.

## Validation

`test-prequels.mjs`, catalog, chronology, connections, journey-data, ICM and TypeScript checks pass. Totals: 204 titles, 196 episodes, eight films, eight sequences, 322 associations across 198 titles and 108 associated location identities; 76 mapped worlds unchanged. Six existing title-evidence gaps remain. Catalog generation is deterministic and retains the original 185-item audit cohort.

Browser, database publication and deployment checks are integration responsibilities and are not claimed by this data review.
