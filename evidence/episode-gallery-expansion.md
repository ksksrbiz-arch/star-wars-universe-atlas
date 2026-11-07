# Episode story-gallery expansion — November 7, 2026

Added 23 associations across 20 previously unlinked Clone Wars episodes. Bundled coverage rises from 185 to 208 associations, from 140 to 160 covered titles, and from 76 to 80 world names. Twenty-five of the 185 catalog titles remain unlinked; this means no verified relationship in this pass, not no appearances. Clone Wars now has links for 111 of its 134 catalog items. The 62 independently placed map destinations are unchanged.

Exact-episode official story galleries were fetched over HTTPS and their image captions reviewed on November 7, 2026. These are descriptions of episode events, not gallery location labels or generic related-character biographies. Short verbatim excerpts follow; each linked gallery supports the corresponding registry note.

| Episode | World | Source excerpt |
|---|---|---|
| s01e05 | Rishi moon | [rookies](https://www.starwars.com/series/clone-wars/rookies-episode-gallery): “The setting is the tracking station on the Rishi moon” |
| s04e08 | Umbara | [the-general](https://www.starwars.com/series/clone-wars/the-general-episode-gallery): “Republic forces invade a key planet -- the darkened world of Umbara” |
| s04e09 | Umbara | [plan-of-dissent](https://www.starwars.com/series/clone-wars/plan-of-dissent-episode-gallery): “Republic forces struggle to take Umbara” |
| s04e10 | Umbara | [carnage-of-krell](https://www.starwars.com/series/clone-wars/carnage-of-krell-episode-gallery): “While fighting to control the darkened world of Umbara” |
| s03e14 | Coruscant | [witches-of-the-mist](https://www.starwars.com/series/clone-wars/witches-of-the-mist-episode-gallery): “arrives at the Jedi Temple on Coruscant” |
| s03e14 | Serenno | [witches-of-the-mist](https://www.starwars.com/series/clone-wars/witches-of-the-mist-episode-gallery): “On Serenno, Dooku trains Savage Opress with a lightsaber.” |
| s04e04 | Naboo | [shadow-warrior](https://www.starwars.com/series/clone-wars/shadow-warrior-episode-gallery): “Arriving on Naboo, Anakin and Padmé meet Jar Jar Binks” |
| s05e08 | Florrum | [bound-for-rescue](https://www.starwars.com/series/clone-wars/bound-for-rescue-episode-gallery): “Back on Florrum, the younglings have landed” |
| s04e15 | Coruscant | [deception](https://www.starwars.com/series/clone-wars/deception-episode-gallery): “On the streets of Coruscant” |
| s04e20 | Quarzite | [bounty](https://www.starwars.com/series/clone-wars/bounty-episode-gallery): “The subtram whips through the crystal-lined caverns of Quarzite.” |
| s05e01 | Florrum | [revival](https://www.starwars.com/series/clone-wars/revival-episode-gallery): “At his junk-strewn base on Florrum, Hondo listens to Maul's ultimatum” |
| s01e22 | Coruscant | [hostage-crisis](https://www.starwars.com/series/clone-wars/hostage-crisis-episode-gallery): “flies towards the domed Senate building on Coruscant” |
| s02e15 | Coruscant | [senate-murders](https://www.starwars.com/series/clone-wars/senate-murders-episode-gallery): “On Coruscant, Senator Onaconda Farr is leading a movement to end the war.” |
| s03e11 | Coruscant | [pursuit-of-peace](https://www.starwars.com/series/clone-wars/pursuit-of-peace-episode-gallery): “In the streets of Coruscant, a mandatory blackout is in effect.” |
| s02e08 | Geonosis | [brain-invaders](https://www.starwars.com/series/clone-wars/brain-invaders-episode-gallery): “At a landing area on Geonosis” |
| s01e06 | Bothawui | [downfall-of-a-droid](https://www.starwars.com/series/clone-wars/downfall-of-a-droid-episode-gallery): “Grievous' warships arrive, and enter Bothawui's dense asteroid field.” |
| s01e12 | Florrum | [the-gungan-general](https://www.starwars.com/series/clone-wars/the-gungan-general-episode-gallery): “awaken in a prison cell at the Weequay pirate compound on Florrum” |
| s01e12 | Coruscant | [the-gungan-general](https://www.starwars.com/series/clone-wars/the-gungan-general-episode-gallery): “On Coruscant, the holographic form of Senator Kharrus checks in with Chancellor Palpatine, Yoda and Mace Windu.” |
| s05e17 | Coruscant | [sabotage](https://www.starwars.com/series/clone-wars/sabotage-episode-gallery): “a street-level apartment in a rundown section of Coruscant” |
| s05e20 | Coruscant | [the-wrong-jedi](https://www.starwars.com/series/clone-wars/the-wrong-jedi-episode-gallery): “In the darkened underlevels of Coruscant, a hooded Anakin stalks Asajj Ventress.” |
| s06e01 | Serenno | [the-unknown](https://www.starwars.com/series/clone-wars/the-unknown-episode-gallery): “Meanwhile, at his palace on Serenno, Lord Tyranus makes contact” |
| s06e10 | Serenno | [the-lost-one](https://www.starwars.com/series/clone-wars/the-lost-one-episode-gallery): “At Count Dooku's estate on Serenno” |
| s06e10 | Oba Diah | [the-lost-one](https://www.starwars.com/series/clone-wars/the-lost-one-episode-gallery): “the man the Jedi are looking for is here on Oba Diah” |

## Boundaries and checks

Rishi moon is distinct from Rishi; the unnamed Oba Diah moon is not merged into the planet. Bothawui is an orbital battle association, without a claimed surface landing. New unmapped names Rishi moon, Quarzite, Bothawui, and Oba Diah stay textual. Proposed destinations, recorded footage, recalled history, and species names alone do not create joins. No within-episode sequence or character itinerary is assigned.

`npm run test:connections` and `npm run test:journey-data` passed with 208 associations/160 covered titles. Regression checks cover all new pairs, the moon distinction, orbital semantics, and exclusions of planned Naboo/Dantooine visits.

The deployed read-only database is a separate publication from this bundled frontend dataset. Application deployment alone does not update its seeded appearance rows; this batch performs no database migration.
