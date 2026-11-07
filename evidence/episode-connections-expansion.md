# Episode connections expansion — November 7, 2026

Added 14 title/world associations across 13 previously uncovered Clone Wars episodes, using fetched and reviewed official episode-specific rewatch articles. Bundled coverage is now 185 associations across 140 of 185 titles and 76 distinct world names. Forty-five titles remain without a verified link; this is not evidence of no locations. Map coverage stays at 62 destinations.

| Episode | World | Reviewed source and claim |
|---|---|---|
| Clone Wars s02e05 | Geonosis | [landing-at-point-rain](https://www.starwars.com/news/the-clone-wars-rewatch-landing-at-point-rain) — The episode rewatch explicitly identifies the invasion and droid-factory campaign as the battle for Geonosis. |
| Clone Wars s05e16 | Mandalore | [the-lawless](https://www.starwars.com/news/the-clone-wars-rewatch-the-lawless) — The episode rewatch places Obi-Wan’s rescue attempt and the confrontation with Sidious on Mandalore. |
| Clone Wars s02e01 | Coruscant | [holocron-heist](https://www.starwars.com/news/the-clone-wars-rewatch-holocron-heist) — The episode-specific rewatch identifies the Coruscant underworld signage in this episode; this supports a setting association, not a character itinerary. |
| Clone Wars s04e21 | Lotho Minor | [brothers](https://www.starwars.com/news/the-clone-wars-rewatch-brothers) — The episode rewatch explicitly places Savage’s search for Maul on Lotho Minor. No map placement is asserted. |
| Clone Wars s04e22 | Raydonia | [revenge](https://www.starwars.com/news/the-clone-wars-rewatch-revenge) — The episode rewatch explicitly identifies Maul’s slaughter and Obi-Wan’s ensuing arrival on Raydonia. Naboo and Lotho Minor are recalled history in the article, not added as present scenes. |
| Clone Wars s01e14 | Maridun | [defenders-of-peace](https://www.starwars.com/news/the-clone-wars-rewatch-defenders-of-peace) — The episode rewatch identifies the threatened colonists as the Maridun colonists during Lok Durd’s weapon test. |
| Clone Wars s03e18 | Lola Sayu | [the-citadel](https://www.starwars.com/news/the-clone-wars-rewatch-the-citadel) — The episode rewatch names Lola Sayu as the inhospitable planet of the prison infiltrated by the rescue team. |
| Clone Wars s03e21 | Wasskah | [padawan-lost](https://www.starwars.com/news/the-clone-wars-rewatch-padawan-lost) — The episode rewatch explicitly names the moon of Wasskah as the place where Ahsoka and the captured younglings survive the hunt. This is the moon, not a surface visit to Trandosha. |
| Clone Wars s03e21 | Felucia | [padawan-lost](https://www.starwars.com/news/the-clone-wars-rewatch-padawan-lost) — The episode rewatch explicitly describes Ahsoka’s abduction during the Battle of Felucia and Anakin’s unsuccessful search. |
| Clone Wars s03e22 | Wasskah | [wookiee-hunt](https://www.starwars.com/news/the-clone-wars-rewatch-wookiee-hunt) — The episode rewatch places the surviving younglings and their rescue on the Trandoshan moon of Wasskah; the recap of the prior episode is distinguished from the continuing hunt. |
| Clone Wars s04e02 | Mon Cala | [gungan-attack](https://www.starwars.com/news/the-clone-wars-rewatch-gungan-attack) — The episode rewatch explicitly identifies the ongoing underwater battle as the fight for Mon Cala. |
| Clone Wars s05e11 | Abafar | [a-sunny-day-in-the-void](https://www.starwars.com/news/the-clone-wars-rewatch-a-sunny-day-in-the-void) — The episode rewatch explicitly names Abafar as the desert where Gascon and the droids crash and cross the void. |
| Clone Wars s05e12 | Abafar | [missing-in-action](https://www.starwars.com/news/the-clone-wars-rewatch-missing-in-action) — The episode rewatch explicitly places Gascon’s escape, aided by Gregor, on Abafar. |
| Clone Wars s06e11 | Dagobah | [voices](https://www.starwars.com/news/the-clone-wars-rewatch-voices) — The episode rewatch explicitly places Yoda in the dark-side cave on Dagobah. Visions of future events are not treated as visits to their depicted worlds. |

Lotho Minor, Raydonia, Wasskah, and Abafar remain textual associations without invented coordinates. Wasskah is a moon; no Trandosha surface join is inferred. The Revenge article’s historical Naboo duel and Lotho Minor exile are excluded. Yoda’s visions in Voices do not generate extra world visits. No within-episode itinerary is assigned.

Validation: `npm run test:connections` and `npm run test:journey-data` passed. Regression checks cover every new join and exclusions for moon/parent confusion and recalled history. These checks establish registry integrity, not independent historical corroboration.

Publication boundary: this batch changes the bundled frontend registry. The separately seeded read-only database snapshot is not updated by an application deploy and retains its earlier 171 associations until a separately verified data publication. No database migration or live-data synchronization was performed in this batch.

## Retrieval record

Retrieved from the linked StarWars.com HTTPS pages on November 7, 2026. Short source excerpts supporting the joins (article prose, not related-character cards):

- [landing-at-point-rain](https://www.starwars.com/news/the-clone-wars-rewatch-landing-at-point-rain): “a massive energy shield stand between the Republic army and victory over Geonosis”
- [the-lawless](https://www.starwars.com/news/the-clone-wars-rewatch-the-lawless): “Darth Sidious takes an interest in events on Mandalore and you just know that won't end well.”
- [holocron-heist](https://www.starwars.com/news/the-clone-wars-rewatch-holocron-heist): “Translate the signs in the Coruscant underworld and you'll find an establishment simply called, "The Hole."”
- [brothers](https://www.starwars.com/news/the-clone-wars-rewatch-brothers): “Savage voyages into the depths of the twisted planet Lotho Minor to find whatever became of the fallen Sith Lord.”
- [revenge](https://www.starwars.com/news/the-clone-wars-rewatch-revenge): “After his show of heartless slaughter on Raydonia, Kenobi appears like clockwork.”
- [defenders-of-peace](https://www.starwars.com/news/the-clone-wars-rewatch-defenders-of-peace): “he sees the peaceful Maridun colonists as test subjects for a new weapon capable of wiping out organic life”
- [the-citadel](https://www.starwars.com/news/the-clone-wars-rewatch-the-citadel): “the inhospitable planet of Lola Sayu, and the stark prison that was built to restrain Jedi should their allegiance stray”
- [padawan-lost](https://www.starwars.com/news/the-clone-wars-rewatch-padawan-lost): “Ahsoka could forge some kind of life on the moon of Wasskah, but it would be an existence of desperation.” Also: “With Ahsoka abducted during the Battle of Felucia, Anakin Skywalker is helpless to aid his lost Padawan.”
- [wookiee-hunt](https://www.starwars.com/news/the-clone-wars-rewatch-wookiee-hunt): “Last week, Ahsoka brought hope to the hopeless younglings surviving in hiding on the Trandoshan moon of Wasskah. But the loss of their leader, killed by a hunter, deals an emotional blow to those left behind.”
- [gungan-attack](https://www.starwars.com/news/the-clone-wars-rewatch-gungan-attack): “The war rages on but the battle for Mon Cala is just beginning.”
- [a-sunny-day-in-the-void](https://www.starwars.com/news/the-clone-wars-rewatch-a-sunny-day-in-the-void): “The desolate desert of Abafar feels like a vast wasteland, and Colonel Gascon is slowly losing his mind over it.”
- [missing-in-action](https://www.starwars.com/news/the-clone-wars-rewatch-missing-in-action): “Gregor provides the protection Gascon needs to finally escape the void that is Abafar”
- [voices](https://www.starwars.com/news/the-clone-wars-rewatch-voices): “his guide leads him to danger inside the well of the dark side, the cave on Dagobah”
