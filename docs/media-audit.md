# Star Wars atlas media coverage audit

Checked November 7, 2026. Scope: original trilogy; Andor; the 2008 Clone Wars series plus theatrical film; The Mandalorian television series. This is a source and sample-coverage audit, not a complete licensed asset inventory. The separate episode CSV records the exhaustive TVmaze delivery checks.

## Findings

| Group | Observed media evidence | Remaining gap |
|---|---|---|
| Original trilogy | All three official film pages expose hero imagery, logos, videos and film-specific Databank links. TMDB Return of the Jedi page resolves and lists poster/backdrop galleries. | Select one suitable poster and backdrop per film through an authorized delivery path; authenticated TMDB responses, image dimensions, English-language selection and delivery have not been tested. |
| Andor | Official S2E12 guide has a thumbnail, logo, a linked Databank group, videos and source links for named entities. Ferrix Databank page has a dedicated image. | Exhaustive official guide and entity-image coverage is not established. Curate character/place images independently from episode stills; keep spoilers scoped. |
| Clone Wars | Official theatrical-film page exposes movie art, logo and a nine-image stills gallery. Official S7E12 guide advertises 20 episode images, 4 trivia images, 7 commentary images and 12 concept-art images. | Do not treat concept art, behind-the-scenes material or commentary illustrations as equivalent to final on-screen stills. Film must be a separate media item; do not merge it into episode numbering. |
| Mandalorian | Official Din Djarin Databank page exposes character imagery and history illustrations, with appearances linking the series, Book of Boba Fett and the later film. | The current character page contains material beyond the three TV seasons. Media provenance and spoiler boundaries must identify the source title/episode. An episode-guide URL guessed for chapter 24 did not resolve through the research tool; that is not evidence that no guide exists. |

## TMDB status: promising, but not authenticated or fully verified

TMDB's public Return of the Jedi record was accessible at movie ID **1892**, with title and year confirmed. Its retrieved page lists 359 posters and 112 backdrops, but the search provider labels that capture as roughly 1.3 years old. These counts demonstrate an indexed gallery, not a current API count or a guarantee of usable images.

Attempts to open the public candidate pages for A New Hope (11), Empire Strikes Back (1891), Clone Wars film (12180), Andor (83867), Clone Wars series (4194) and Mandalorian (82856) failed through this research tool. Treat those IDs as **unverified candidates in this audit**, not confirmed mappings and not proof of absent TMDB coverage. No authenticated API requests were made and no account or paid subscription was created.

TMDB documents film poster/backdrop/logo retrieval and episode-image retrieval. It requires an API key; noncommercial API use requires attribution, and commercial use requires discussing a license. Its FAQ says TMDB does not own all images/data. Therefore API availability does not by itself settle every underlying asset right.

## Prioritized work to fill gaps

1. Verify the seven film/series TMDB identities with authenticated search/details and cross-check release year, type and external IDs. Retrieve film and series media lists, then episode image lists where needed. Record actual missing counts instead of assuming coverage from popularity.
2. Choose four film posters (three OT plus the Clone Wars film) and three series posters. Check image dimensions, language, cropping, image delivery, and source terms. Preserve original title/edition context where variants differ.
3. For each episode image in the main audit CSV, add a visual relevance check. HTTP success establishes delivery only; it cannot show that an image depicts the right episode, is not a generic poster, or is spoiler-safe.
4. Create a named character/place asset inventory after the entity roster is fixed. Store asset URL, source page, credited owner/creator, permitted use or review status, media type (screen still/concept/promotional/portrait), source film/episode, and spoiler boundary.
5. Avoid silently displaying actor profile photography as a fictional-character portrait. Voice-actor photos are especially unsuitable as the default Clone Wars character art.
6. Keep a neutral original placeholder for missing or uncleared character/place assets. A missing media asset should not block a sourced timeline/location record.

## Rights and spoiler handling

Official Disney/Lucasfilm pages are useful evidence that artwork exists and for reference links; this audit does not authorize bulk extraction or republication. Wookieepedia text licensing is separate from its image files, which have individual copyright information. Public URLs and an unofficial-fan label are not reuse permissions.

Current Databank pages can span several series and later films. Copying their current thumbnail or biography into an early timeline view may expose later designs, affiliations or story outcomes. Each chosen asset needs a title/episode-based spoiler boundary, even when the associated character is already known.

## Sources

- [A New Hope official film page](https://www.starwars.com/films/star-wars-episode-iv-a-new-hope)
- [Empire Strikes Back official film page](https://www.starwars.com/films/star-wars-episode-v-the-empire-strikes-back)
- [Return of the Jedi official film page](https://www.starwars.com/films/star-wars-episode-vi-return-of-the-jedi)
- [Clone Wars official film page](https://www.starwars.com/films/star-wars-the-clone-wars)
- [Andor S2E12 official guide](https://www.starwars.com/series/andor/season-2-episode-12-episode-guide)
- [Clone Wars Victory and Death official guide](https://www.starwars.com/series/clone-wars/victory-and-death-episode-guide)
- [Ferrix Databank](https://www.starwars.com/databank/ferrix)
- [Tatooine Databank](https://www.starwars.com/databank/tatooine)
- [Din Djarin Databank](https://www.starwars.com/databank/the-mandalorian)
- [TMDB Return of the Jedi](https://www.themoviedb.org/movie/1892-return-of-the-jedi)
- [TMDB movie-image endpoint](https://developer.themoviedb.org/reference/movie-images)
- [TMDB episode-image endpoint](https://developer.themoviedb.org/reference/tv-episode-images)
- [TMDB API FAQ](https://developer.themoviedb.org/docs/faq)
- [Wookieepedia copyright policy](https://starwars.fandom.com/wiki/Wookieepedia:Copyrights)
- [Disney terms](https://disneytermsofuse.com/english/)
