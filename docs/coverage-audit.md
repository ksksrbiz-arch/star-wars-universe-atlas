# Star Wars atlas coverage audit

Checked November 7, 2026. Scope: original trilogy, Andor seasons 1–2, The Clone Wars (2008) seasons 1–7 plus its theatrical film, and The Mandalorian seasons 1–3. The 2003 Clone Wars series and The Mandalorian and Grogu film are outside this cohort.

## Decision

Proceed with this cohort: the catalog and episode-image delivery foundations are strong. The main work is a reviewed story-to-location/character dataset, chronology handling, and asset selection. A successful source response is not proof of factual accuracy, visual relevance, or reuse permission.

## Measured catalog coverage

| Group | Regular catalog coverage | Episode-image delivery | Main gap |
|---|---:|---:|---|
| Original trilogy | 3/3 films in SWAPI; 3 official film pages | Not measured through authenticated TMDB | Poster selection, runtimes/editions, release-date reconciliation, event-level relationships |
| Andor | 24 episodes, 12 per season | 24/24 HTTP 200 image/jpeg | Arc dates, flashbacks, episode-specific places and character appearances |
| The Clone Wars | 133 episodes: 22/22/22/22/20/13/12 per season | 133/133 HTTP 200 image/jpeg | Separate theatrical film; story ordering; suspect uniform runtime values; special classification |
| The Mandalorian | 24 episodes, 8 per season | 24/24 HTTP 200 image/jpeg | Boba Fett bridge, later-season date evidence, flashbacks |

Total core scope: **185 watchable items: 181 regular episodes plus four films**. The TVmaze episode CSV contains 190 rows because it also preserves nine specials for review. The film is not included in the 133 Clone Wars episode count.

All 181 regular TV episodes have titles, air dates, runtimes and summaries populated. No duplicate season/episode number pairs were found. All three series poster URLs also returned HTTP 200 image/jpeg. Runtime and summary presence were checked; their accuracy was not exhaustively verified. Every episode image received an HTTP HEAD check; no exhaustive visual/content/rights review was performed.

Sources and raw findings: [TVmaze API](https://www.tvmaze.com/api), [Andor](https://www.tvmaze.com/shows/52341/andor), [Clone Wars](https://www.tvmaze.com/shows/563/star-wars-the-clone-wars), [Mandalorian](https://www.tvmaze.com/shows/38963/the-mandalorian), [episode CSV](episode-coverage.csv), [summary JSON](coverage-summary.json), [original-trilogy CSV](original-trilogy-coverage.csv).

## Concrete gaps to fill

Geography spot-check: **44 representative location/group rows**, including repeated worlds across groups. The appendix supplied 33 direct system-name matches; seven proposed parent-system joins still need confirmation, one parent relation (Trask → Kol Iben) was supported, and three rows need other handling (Morlana One, Kamino, Mortis). This is not an exhaustive location-coverage percentage. Morlana One and Kamino were not found in the checked appendix text; that does not establish absence from other maps or references. Mortis requires realm/encounter modeling.

### P0: Before publishing the pilot

1. **Build the story relationship layer.** For each included story, record sourced locations, character appearances, event time ranges and evidence. Distinguish on-screen appearance, mention, flashback and vision. The examined catalog APIs do not provide this complete graph. A character credit does not establish presence at every location in an episode.
2. **Import the Clone Wars film separately.** The official page verifies the 2008 film, which the episode inventory does not include. Default scope should exclude Andor’s Disney+ Day promotional special and separately classify eight Clone Wars Legacy entries; four Legacy titles overlap the completed season-seven Bad Batch arc. Do not double-count these as completed episodes.
3. **Preserve release order and story order independently.** The official Clone Wars table was checked against 133 unique episode codes, with no range gaps, plus the film. It begins S2E16 → S1E16 → film; season-seven E5–8 precede E1–4. Relative order does not establish exact dates for every scene.
4. **Add cross-title connection records.** Andor → Rogue One; Clone Wars finale ↔ Revenge of the Sith; Mandalorian S2 → Book of Boba Fett chapters 5–7 → Mandalorian S3. These can initially be linked dependencies rather than full new catalog projects.
5. **Publish honest geography.** Join reviewed system-grid data to planet/moon/local-site records. Keep source grid separate from schematic x/y placement; do not infer exact routes or distances. See the separate geography audit for measured representative coverage and unresolved locations.
6. **Select and validate assets.** Choose four film posters and three series posters, visually review episode stills, then curate a bounded character/place roster. Store source page, provider ID, creator/owner where known, usage status, asset type and spoiler scope. Use original placeholders for missing or uncleared assets.

### P1: Before presenting watch-duration totals or precise dates

7. **Correct or qualify runtime data.** All 133 Clone Wars regular episodes return exactly 30 minutes in TVmaze. These populated values need independent streaming-duration verification; do not display a precise marathon total from them. Check film edition/runtime differences too.
8. **Reconcile conflicting release dates.** SWAPI reports Return of the Jedi as May 25, 1983; the official film landing page currently displays May 1, 1983. A separate official anniversary article supports May 25. Store territory, release type, source and reviewed override instead of blindly overwriting by provider priority. Empire’s SWAPI date likewise requires release-type/territory reconciliation before a definitive calendar is published.
9. **Source exact timeline anchors.** Broad order is available; exact original-trilogy year citations and later Mandalorian season dates were not independently established in this audit. Andor’s annual arcs still contain earlier flashbacks. Preserve ranges and uncertainty.
10. **Complete authenticated TMDB validation.** No TMDB API credential was used. Actual poster/backdrop counts, episode-image coverage, image dimensions and language selection remain unmeasured; inaccessible public pages are not evidence of absent catalog coverage.

## Suggested implementation sequence

Start with the original trilogy and a small reviewed entity roster to prove film → location → character → event navigation. Add Andor’s arc-aware chronology next. Add Clone Wars with the verified official story-order mapping, then Mandalorian with its Boba Fett bridge. Use the complete 181-episode catalog immediately for search/watch tracking, but publish relationship coverage explicitly as it is reviewed.

Release gate: stable local IDs and external-ID mappings; no duplicate core items; source and certainty on every published date/location claim; no missing locations silently placed at zero; spoiler-safe asset/event selection; image fallbacks; correct attribution and usage review.

## Sources and supporting detail

- [Chronology audit](chronology-audit.md)
- [Media audit](media-audit.md)
- [Geography notes](geography-notes.md) and [location sample CSV](geography-coverage.csv)
- [Official Clone Wars order](https://www.starwars.com/news/star-wars-the-clone-wars-chronological-episodeorder)
- [Clone Wars film](https://www.starwars.com/films/star-wars-the-clone-wars)
- [Return of the Jedi landing page](https://www.starwars.com/films/star-wars-episode-vi-return-of-the-jedi) and [anniversary article](https://www.starwars.com/news/jedi-at-40-deleted-scenes)
- [TMDB API FAQ](https://developer.themoviedb.org/docs/faq)

TVmaze-derived catalog metadata in the CSV/summary is attributed to TVmaze and supplied under its [CC BY-SA API terms](https://www.tvmaze.com/api#licensing); source links are retained per record. HTTP checks and editorial classifications were added by this audit. Image URLs identify candidate media, not blanket image reuse rights. No media files were republished in these deliverables.
