# Reviewed reconciliation of 13 existing live associations

Reviewed November 7, 2026. These records were already public; every official exact-episode gallery was fetched and reviewed before source inclusion. No database write was performed. Original 270 records retain their exact digest.

| Association | Exact official excerpt | Source |
|---|---|---|
| clone-wars-s01e13:quell | “High in the atmosphere of the planet Quell” | [Gallery](https://www.starwars.com/series/clone-wars/jedi-crash-episode-gallery) |
| clone-wars-s01e18:naboo | “On Naboo, Anakin and Obi-Wan take a gunship into the eastern swamps” | [Gallery](https://www.starwars.com/series/clone-wars/mystery-of-a-thousand-moons-episode-gallery) |
| clone-wars-s02e04:coruscant | “at her apartment on Coruscant” | [Gallery](https://www.starwars.com/series/clone-wars/senate-spy-episode-gallery) |
| clone-wars-s03e07:coruscant | “return to Coruscant with Aurra Sing in custody” | [Gallery](https://www.starwars.com/series/clone-wars/assassin-episode-gallery) |
| clone-wars-s03e10:raxus | “arrive on Raxus and meet Senator Mina Bonteri” | [Gallery](https://www.starwars.com/series/clone-wars/heroes-on-both-sides-episode-gallery) |
| clone-wars-s04e13:zygerria | “Count Dooku arrives at Zygerria” | [Gallery](https://www.starwars.com/series/clone-wars/escape-from-kadavo-episode-gallery) |
| clone-wars-s04e19:serenno | “In his lair on Serenno” | [Gallery](https://www.starwars.com/series/clone-wars/massacre-episode-gallery) |
| clone-wars-s05e02:coruscant | “The Jedi Council on Coruscant convenes” | [Gallery](https://www.starwars.com/series/clone-wars/a-war-on-two-fronts-episode-gallery) |
| clone-wars-s05e05:coruscant | “On Coruscant, Anakin disagrees strongly” | [Gallery](https://www.starwars.com/series/clone-wars/tipping-points-episode-gallery) |
| clone-wars-s05e05:florrum | “Anakin pilots his Jedi starfighter to Florrum” | [Gallery](https://www.starwars.com/series/clone-wars/tipping-points-episode-gallery) |
| clone-wars-s06e01:ringo-vinda | “Battle for Ringo Vinda!” | [Gallery](https://www.starwars.com/series/clone-wars/the-unknown-episode-gallery) |
| clone-wars-s06e02:coruscant | “assembled Jedi Council on Coruscant” | [Gallery](https://www.starwars.com/series/clone-wars/conspiracy-episode-gallery) |
| clone-wars-s06e13:coruscant | “In a burned out, industrial sector of Coruscant” | [Gallery](https://www.starwars.com/series/clone-wars/sacrifice-episode-gallery) |

Quell is atmospheric combat and has no forced surface/orbit context. Ringo Vinda is orbital station action. Coruscant council/hologram scenes refer to the physically present council, not remote speakers. Sacrifice uses the actual Sith ritual, not Yoda’s induced vision. Raxus is not Raxus Prime. No coordinates or travel order are inferred.

## Publication reconciliation

Read-only Neon publication marker: `catalog-sha256-830d2d213e3009a8e609cc57c6b2a8dda9bddba31bdd4d721751d86ff690171c`.

After independently reviewing the 13 association records and 14 world placements (see `reconciled-world-geography.md`), regenerating from the authored registry reproduces the exact existing marker: 193 catalog items, 76 mapped worlds, 283 associations, 187 covered titles and five viewing sequences. All 270 previous association payloads and 62 previous world payloads remain unchanged. API content and the database marker agree; publisher identity is not recorded by this marker.

- Appearances SHA-256: `bac8db5d587ffe0a7b09b68486d271c6018013694db3fd4b0c175b0b38e126f6`
- Worlds SHA-256: `ee7e18f1b2794b5ca8839f6070bdd0645d4bf5d9363a98df0da972fcce35eb0e`
- Catalog SHA-256: `dab929295d55904835c936cb192ef6c032ebb4bfbd9651983c345136563e9b77`
- Sequences SHA-256: `9959824685ddf9a2b6142c1ec04e34e90e32c7c6212fcaa02ca10f8ee4b1b6bf`

Publication generation now validates complete world payloads, supports additive reviewed worlds and rejects conflicting existing worlds before recording a marker. Disposable local PostgreSQL verification passed additive insertion, all four payload digests, idempotent replay preserving publication timestamps, and transaction rollback for conflicting worlds, catalog, sequence order or appearances. No live database transaction was applied during reconciliation.
