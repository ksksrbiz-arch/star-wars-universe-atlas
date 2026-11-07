# Four world dossiers — source review

Reviewed November 7, 2026. `src/worldDossiers.ts` contains concise original setting text for Tatooine, Coruscant, Hoth and Naboo. Every overview, terrain description and highlight carries an official source URL. These references establish broad settings and landmark identities; they do not establish episode-specific appearances, character itineraries, surface coordinates, distances or a fixed political era. Existing map positions are unchanged.

## Tatooine

- [Tatooine](https://www.starwars.com/databank/tatooine): “A harsh desert world orbiting twin suns”; the page identifies moisture farms, spaceports and sandstorms. The dossier omits character outcomes and crime-history plot details.
- [Mos Eisley Spaceport](https://www.starwars.com/databank/mos-eisley-spaceport): “The famously lawless port on the surface of Tatooine”; supports a port description, not a city map.
- [Mos Espa](https://www.starwars.com/databank/mos-espa): “Domed buildings protect the citizens against the glare of the twin suns”; the same entry describes the large arena.
- [Jundland Wastes](https://www.starwars.com/databank/jundland-wastes): “a rocky region of the desert planet Tatooine”; the entry associates it with Tusken clans. No boundaries or route are supplied.

## Coruscant

- [Coruscant](https://www.starwars.com/databank/coruscant): “cultures and citizens spread over hundreds of levels”; its terrain field is Urban and climate fields are Artificial and Temperate. This supports a layered city-world description, not a generic geological surface. Government references are era-sensitive.
- [Jedi Temple](https://www.starwars.com/databank/jedi-temple): “distinctive crown of five spires” and “Part school and part monastery”; the dossier explicitly marks function and occupancy as era-dependent rather than depicting it as eternally available to visitors.
- [Coruscant Underworld Police](https://www.starwars.com/databank/coruscant-underworld-police): “the deeper levels of Coruscant” and “the surface-dwelling Coruscant citizens”; supports the distinction between lower and surface districts. “The underlevels” is a broad locale, not a named district with a map anchor.

## Hoth

- [Hoth](https://www.starwars.com/databank/hoth): “a world of snow and ice”; its terrain fields identify Glaciers and Plains. Native-creature references name tauntauns and wampas.
- [Echo Base](https://www.starwars.com/databank/echo-base): the Rebels “enlarged caverns to form Echo Base” on Hoth. The dossier preserves the wartime qualification and avoids a summary of the battle’s outcome.
- [Wampa](https://www.starwars.com/databank/wampa): “lairs in caverns beneath the surface of Hoth”; this supports a habitat highlight. It does not establish one named or geolocated cave, and the dossier says so explicitly.

## Naboo

- [Naboo](https://www.starwars.com/databank/naboo): “swampy lakes, rolling plains and green hills”; the page separately describes river cities and underwater Gungan settlements.
- [Theed Royal Palace](https://www.starwars.com/databank/theed-royal-palace): “Overlooking the beautiful cliffs and waterfalls of Naboo’s capital”; it identifies the palace as the seat of the elected monarchy. No immutable political timeline is implied.
- [Otoh Gunga](https://www.starwars.com/databank/otoh-gunga): “Beneath the surface of Lake Paonga on Naboo”; the page explains the hydrostatic force-fields and breathable interiors. The dossier distinguishes this city from Theed.

## Validation

All 13 source pages were fetched over HTTPS and their article descriptions reviewed. Candidate `/mos-eisley`, `/theed`, `/naboo-lake-country` and `/coruscant-underworld` URLs returned 404 and were not used; actual cited sources are the working URLs above. `node scripts/test-world-dossiers.mjs` passed the four mapped identities, per-fact official source fields, unique local highlights, coordinate/episode-join exclusions and key era/habitat caveats. The test checks structure and explicit boundaries; it is not an automated substitute for the source review.

## Second field-guide batch: Bespin, Dagobah, Yavin 4 and Endor

The dossier collection now contains eight worlds and 24 distinct official source pages. The 11 additional pages below were fetched and their article descriptions reviewed on November 7, 2026. Eight new highlights use the same per-fact source schema. They do not add surface coordinates or episode relationships.

### Bespin

- [Bespin](https://www.starwars.com/databank/bespin): “an immense gas giant” with “a band of habitable atmosphere”; supports an atmospheric environment and floating mining complexes, not a rocky surface.
- [Cloud City](https://www.starwars.com/databank/cloud-city): “Suspended high among the pastel clouds of Bespin”; the article identifies a mining colony extracting Tibanna gas. Cloud City is one settlement, not a synonym for the whole planet.
- [Carbon-freezing](https://www.starwars.com/databank/carbon-freezing): “an industrial process that encases highly pressurized gases inside solidified carbonite”; the entry explicitly places its use in Cloud City. The dossier describes the industrial function without recounting character outcomes.

### Dagobah

- [Dagobah](https://www.starwars.com/databank/dagobah): “a swamp-covered planet” with “dense, jungle undergrowth”; supports humid wetlands and abundant wildlife.
- [Yoda’s Hut](https://www.starwars.com/databank/yodas-hut): “a simple hut he built among the roots of a massive gnarltree”; the dossier retains the exile-era context without claiming permanent occupancy.
- [Cave of Evil](https://www.starwars.com/databank/cave-of-evil): “One cave in the planet’s swamps roiled with the dark side.” The article describes visions experienced there. The dossier does not turn those visions into physical travel or identify an entrance on the map.

### Yavin 4

- [Yavin 4](https://www.starwars.com/databank/yavin-4): “One of a number of moons orbiting the gas giant Yavin” and “covered in jungle and forest”; the entry describes Rebel stopovers and a later larger base. The display name remains Yavin 4 while the stable atlas ID is `yavin`.
- [Yavinian doodar](https://www.starwars.com/databank/yavinian-doodar): “Indigenous to the fourth moon of Yavin”; the entry describes a territorial reptilian animal and its rumbling call. This is a habitat highlight rather than a precise wildlife-viewing location.

A named-temple highlight was not invented from failed candidate URLs. The working Yavin 4 article supports the general Rebel-base association; it does not supply the detailed temple geography that a richer surface map would require.

### Endor’s forest moon

- [Endor](https://www.starwars.com/databank/endor): explicitly identifies the “forest moon of Endor”; the page also lists grasslands and mountains. This is not the parent planet or Kef Bir.
- [Bright Tree Village](https://www.starwars.com/databank/bright-tree-village): “Built into the majestic trees high above the lush surface of Endor”; rope bridges and ladders connect huts, buildings and watchtowers. No tree or village coordinates are added.
- [Ewok](https://www.starwars.com/databank/ewok): the article identifies the “Imperial shield generator built in their forests”. The dossier marks this installation as belonging to a wartime occupation instead of a permanent natural landmark.

## Reviewed terrain categories

`WORLD_TERRAIN` provides a coarse directory-discovery category for these eight dossier worlds only: Tatooine desert, Coruscant urban, Hoth ice, Naboo lakes/wetlands, Bespin gas giant, Dagobah swamp, and Yavin 4/Endor forest. Each entry links to the corresponding official world page. A category summarizes one dominant environment; it does not exclude other environments on that world. Naboo’s plains and hills and Endor’s grasslands and mountains remain in the full dossier text.

Worlds absent from this metadata are **not reviewed for this filter**, not scientifically unknown or assigned an inferred “other” terrain. Region and map placement remain separate attributes. The static dossier suite verifies all eight mapped IDs, exact coverage of the reviewed terrain keys, source URLs, no inferred coordinates or episode joins, gas-giant/solid-surface distinction, and the Yavin/Endor moon identities.
