# The Book of Boba Fett source review

Reviewed 2026-11-07 against the official series index, exact chapter commentary/story galleries, and a separate TVmaze API snapshot. This extends the 194-item release; it does not change the original 185-item audit cohort.

## Catalog and chronology

- Seven regular season-one chapters, IDs boba-fett-s01e01 through boba-fett-s01e07; separate series identity and watch progress.
- [Official series index](https://www.starwars.com/series/the-book-of-boba-fett) confirms seven numbered chapter titles. Provider dates and URLs are retained in docs/boba-fett-source.json; runtimes withheld. Article publication dates are not episode release dates.
- Numbered narrative order retains flashbacks inside chapters. Chapters 5–7 now provide included catalog links in the existing [Mandalorian bridge](https://www.starwars.com/news/this-is-the-way-the-mandalorian-season-3).
- Existing catalog, appearance, and sequence payloads remain unchanged for additive publication. The Mandalorian sequence’s “outside this collection” caveat refers to its collection-local membership; the separate bridge now exposes imported Boba Fett chapters.

## Eleven partial associations

| Chapter | Location | Evidence and qualification |
|---|---|---|
| 1 | Tatooine | [Chapter commentary](https://www.starwars.com/news/the-book-of-boba-fett-chapter-1-highlights) explicitly locates the Sarlacc escape and desert memories. |
| 2 | Tatooine | [Exact synopsis](https://www.starwars.com/series/the-book-of-boba-fett/chapter-2-tribes-of-tatooine-episode-guide) names Tatooine. |
| 3 | Tatooine | [Chapter commentary](https://www.starwars.com/news/the-book-of-boba-fett-chapter-3-highlights) distinguishes current Mos Espa events and Tusken memories. |
| 4 | Tatooine | [Chapter commentary](https://www.starwars.com/news/the-book-of-boba-fett-chapter-4-highlights) identifies the desert and rescue in the past. |
| 5 | Tatooine; Glavis Ringworld | [Story gallery](https://www.starwars.com/the-book-of-boba-fett-chapter-5-story-gallery), captions 6/9 and 2 respectively; captions inspected in rendered browser DOM. Glavis is a station, confirmed separately by its [Databank](https://www.starwars.com/databank/glavis-ringworld). |
| 5 | Mandalore | [Chapter commentary](https://www.starwars.com/news/the-book-of-boba-fett-chapter-5-highlights), highlight 2: historical bombardment, explicitly labeled flashback. |
| 6 | Tatooine | [Story gallery](https://www.starwars.com/the-book-of-boba-fett-chapter-6-story-gallery), captions 1 and 6. |
| 6 | Coruscant; Luke’s Jedi school | [Chapter commentary](https://www.starwars.com/news/the-book-of-boba-fett-chapter-6-highlights), highlights 2/1. Coruscant is Grogu’s memory; school is a surface site with no named parent in the reviewed source. |
| 7 | Tatooine | [Finale commentary](https://www.starwars.com/news/the-book-of-boba-fett-chapter-7-highlights) names the setting. |

The guide’s shared Databank carousel repeats entries across chapters, so it was not used as episode-specific appearance proof. Glavis and the school remain textual destinations without coordinates or automatic map travel. Ossus is not inferred from secondary identifications. Naboo fighter provenance, Concordia history, and Oba Diah mentions do not establish visits. Kamino/Geonosis childhood recollections remain outside this evidence batch pending stronger chapter-specific source review. Array order is not within-episode travel order. One title/location association may contain multiple temporal contexts; notes retain that limitation.

## Checks

Passed node scripts/test-boba-fett.mjs, test-catalog.mjs, test-chronology.mjs, test-connections.mjs and npx tsc --noEmit. New totals: 201 titles, 196 episodes, five films, seven collection sequences, 302 relationships across 195 titles and 104 location identities; six prior evidence gaps remain. No mapped coordinates added. Browser and publication checks are integration responsibilities and are not claimed here.
