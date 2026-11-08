# Rogue One source review — 2026-11-07

This extension adds one complete film, one collection-local sequence, and eight title/location associations. The original 185-item CSV audit cohort and its source files remain unchanged. Current catalog: 194 items (189 episodes, five films), six sequences. Associations: 291 across 188 titles and 102 location identities; six titles remain reviewed without joins. These counts are bounded coverage, not complete scene logs.

## Sources inspected

- [Official film landing page](https://www.starwars.com/films/rogue-one): film identity and December 16, 2016 release date. Territory/release type not specified. Page reports 2h 14min but duration remains null pending edition-specific verification.
- [Official geography guide](https://www.starwars.com/news/where-in-the-galaxy-are-the-worlds-of-rogue-one), Mark Newbold, January 31, 2017: article explicitly tours Rogue One settings. Its sections establish Lah’mu, Ring of Kafrene, Wobani, Yavin 4, Jedha, Eadu and Scarif as film settings. Ring is an asteroid settlement, Yavin 4 is a moon, and Jedha is the moon of NaJedha. Article travel directions are an editorial tour, not the characters’ flight itinerary or film scene order.
- [Vader’s Castle Databank](https://www.starwars.com/databank/vader-s-castle): description locates the castle on Mustafar; Appearances explicitly lists Rogue One. Mustafar is not a section of the geography article and uses this separate evidence.
- [Official viewing guide](https://www.starwars.com/news/star-wars-movies-and-series-guide): whole-work order places Andor before Rogue One and A New Hope after it. Existing Andor finale guide supports its bridge. No exact event dates or interleaving are inferred.

## Boundaries

Geography article route waypoints including Coruscant, Dantooine, Corellia and Kashyyyk are not promoted into film appearances. NaJedha is not a Jedha surface appearance. No grids, x/y coordinates, flight times, or sequence indices added. Ring of Kafrene remains an asteroid outpost and cannot be rendered as a claimed planet. Unknown location kinds remain unknown; this review does not classify every atlas world. The plausible Databank slug `/databank/ring-of-kafrene` returned 404 and is not used as evidence.

The catalog source is a separate reviewed JSON record. Existing catalog IDs remain unchanged. `PlanetConnection.locationKind` is optional for backward compatibility; only the eight new records carry it. `locations.ts` supplies independently sourced identity metadata. The existing `andor-rogue-one` story connection keeps its ID and endpoints but now uses `includedItemIds: ['rogue-one']` instead of an outside-collection title. This bridge is frontend reference data, separate from persisted collection sequence payloads; the existing five sequence payloads remain unchanged.

Validation: catalog generation, catalog checks, chronology checks, connection checks, and Rogue One identity/bridge exclusion checks. Source inspection supports these specific assertions; deterministic tests verify consistency rather than independently proving canon.
