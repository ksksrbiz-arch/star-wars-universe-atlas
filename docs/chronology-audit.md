# Chronology and story-connection coverage audit

Checked 2026-11-07. Scope: original trilogy films; Andor seasons 1–2; The Clone Wars (2008 series) and its theatrical film; The Mandalorian seasons 1–3. This audits source availability and chronology-model requirements, not every scene or character appearance. Story details below contain spoilers.

## Findings

| Group | Source coverage verified | What still needs editorial work |
|---|---|---|
| Original trilogy | Official viewing guide establishes film ordering; the three films form a straightforward title-level sequence. | Attach authoritative year citations to each film; separate within-film events, simultaneous storylines, and movements. This pass did not independently verify exact 0/3/4 ABY anchors from an official dated reference, so those values should not be promoted as audited facts. |
| Andor | Official season-two explanation gives four three-episode arcs, separated by years; official episode-one guide confirms childhood material is in the past. | Attach the relevant time range to events, not every scene in an episode. Audit childhood scenes and later flashbacks separately. Link the ending to Rogue One rather than jumping directly to A New Hope. |
| The Clone Wars | Official chronological table contains all 133 unique episode codes plus the theatrical film. | Maintain separate release and story order; add event-level dates and overlap relationships. Resolve the catalogue’s Legacy story reels separately from completed episodes. |
| The Mandalorian | Official sources establish an approximate opening-era anchor, a Book of Boba Fett bridge between seasons 2 and 3, and Grogu’s Order 66 flashback. | Do not assign one precise year to all seasons or all scenes. Add cross-series bridge records and independently source later-season dates. |

## Verified Clone Wars completeness

I read the official table and programmatically checked its episode codes. There are 133 episode rows with 133 unique codes, covering season sizes 22, 22, 22, 22, 20, 13, and 12. No missing or extra codes were found against those ranges. A separate theatrical-film row makes **134 viewing units**.

Examples that demonstrate why release order cannot substitute for story order:

- The sequence begins S2E16, S1E16, then the theatrical film.
- Season 7 places episodes 5–8 before episodes 1–4, then episodes 9–12.

The table supplies relative order, not an exact BBY date for every episode. Its linked guides were not all opened or link-checked in this pass. [Official chronological order](https://www.starwars.com/news/star-wars-the-clone-wars-chronological-episodeorder)

The final arc needs overlap support: the official Shattered discussion explicitly aligns scenes with Revenge of the Sith. Store “overlaps” separately from “watch next”; do not invent an official scene-interleaving watch order. [Shattered analysis](https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-shattered)

## Andor time and connection requirements

The official season-two cast interview says each three-episode arc is separated by a year. The first arc’s official explanation places it four years before Rogue One; the second arc’s explanation places it three years before Rogue One. This supports arc-based chronology, rather than spreading each episode evenly across time. Exact day-level dates remain unverified. [Cast interview](https://www.starwars.com/news/andor-cast-interview), [episodes 1–3](https://www.starwars.com/news/andor-explained-season-2-highlights-episodes-1-2-3), [episodes 4–6](https://www.starwars.com/news/andor-explained-season-2-highlights-episodes-4-5-6)

The Kassa guide identifies childhood Kenari events as many years earlier. The season-two production trivia also identifies a flashback sequence. These must become separate event records with their own confidence, not inherit the present-day episode year. [Kassa](https://www.starwars.com/series/andor/andor-season-1-episode-1-episode-guide), [season-two finale trivia](https://www.starwars.com/news/andor-trivia-guide-week-4)

The final episode guide connects Cassian’s departure to the Rings of Kafrene mission where Rogue One meets him. Add a sourced bridge record for Rogue One even if it remains outside the initial audit cohort. [Andor finale guide](https://www.starwars.com/series/andor/season-2-episode-12-episode-guide)

## Mandalorian time and connection requirements

An official launch-era overview places the series roughly five years after the Empire’s fall. That establishes an approximate opening context, not dates for all later seasons. [Official overview](https://www.starwars.com/news/everything-we-know-about-the-mandalorian)

The official season-three preparation guide confirms Din and Grogu reunite in The Book of Boba Fett. The latter’s chapters 5–7 should therefore appear as connected viewing recommendations between Mandalorian seasons 2 and 3, while retaining their own series identity. [Season-three preparation](https://www.starwars.com/news/this-is-the-way-the-mandalorian-season-3), [chapter 5](https://www.starwars.com/series/the-book-of-boba-fett/chapter-5-return-of-the-mandalorian-episode-guide), [chapter 6](https://www.starwars.com/news/the-book-of-boba-fett-chapter-6-highlights), [chapter 7](https://www.starwars.com/series/the-book-of-boba-fett/chapter-7-in-the-name-of-honor-episode-guide)

Chapter 20 shows Grogu recalling Order 66. A journey system that assigns every location in that episode to the present would incorrectly place him on Coruscant then. [Official chapter-20 coverage](https://www.starwars.com/news/mando-download-chapter-20-the-foundling)

## Recommended fill order

1. Create distinct release-order and story-order fields. Store whole films/episodes as watchable units, with separately dated events.
2. Add the Clone Wars film; keep Legacy story reels and documentaries outside the default completed-story watch sequence.
3. Add bridge references for Rogue One, Revenge of the Sith, and Book of Boba Fett chapters 5–7. These are dependencies, not a request to expand the audit into their full catalogues.
4. Build a small event/appearance registry for each pilot story, distinguishing on-screen presence, mention, flashback, vision, and archival material.
5. Source exact years where available; retain ranges or unknown values otherwise. No interpolation into invented dates or travel durations.
6. Gate spoiler-bearing events and relationships by watched title. Chronological year alone cannot protect release-order viewers.

Official title-order reference: [Star Wars movies and series viewing guide](https://www.starwars.com/news/star-wars-movies-and-series-guide). No API examined in this audit supplied a complete, source-backed episode→event→character→location chronology graph.
