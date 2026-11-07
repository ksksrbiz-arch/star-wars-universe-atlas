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
