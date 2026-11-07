# Ahsoka, map controls, and loading release

The catalog now includes all eight Ahsoka season-one episodes: 193 titles and five collection sequences. The original 185-title audit remains distinct from the new TVmaze snapshot. Fourteen episode-specific official location joins bring totals to 245 connections across 187 titles and 91 world identities. Six older gaps were reviewed again and retained without unsupported joins. Map positions remain 62.

Fit episode locations frames revealed mapped stops; keyboard Left/Right/Home/End navigates location buttons, with Enter preview. Nearby labels use connected clusters without changing source coordinates or implying travel order. Desktop, 390px and 320px fit, resize, reset, keyboard and spoiler tests passed; screenshots inspected.

Optional cinematic Bloom now loads only when eligible. Final measured mobile/reduced-motion requested JS fell 4.44%, computed gzip 4.48%, relative to the preserved baseline. Total cinematic/library loading grew with catalog/UI additions. No latency, FPS, or physical-device claim. Optional-module quality switches and download-failure fallback passed.

Combined TypeScript/Vite/Worker builds, ICM, catalog, chronology, connection, journey-data, reference-data, Worker and publication checks passed. Real PostgreSQL 17 tests covered additive catalog/sequence/appearance publication, replay, exact payload digests and atomic rollback on conflicts. Browser platform, 320px library accessibility, progress import/export/cross-tab, Ahsoka filter/episode Journey/spoiler/unmapped behavior passed without errors.

The database transaction was applied to the verified Neon atlas database using TLS WebSocket. Publication catalog-sha256-5eb5bc657541683188e259dfea2998b6485a49320ac77c5519111d6ab18b7d82 was verified against the stored marker and full payloads. Public APIs subsequently matched all three manifest digests: 193 catalog records, 5 sequences and 245 appearances.

Agent drafts were transferred from an obsolete shell executor; all final build, browser, publication and integration checks were rerun in the current workspace. The existing large-chunk build warning remains.

## Live release verification

Commit `133b635` is deployed. All four production assets (entry JavaScript, CSS, Galaxy and optional Bloom) byte-match the fresh build of that exact commit. Live API checks verified all three content digests and six endpoints at 193 titles, five sequences and 245 connections. Desktop/mobile navigation, fit controls at desktop/390/320px, resize/reset, keyboard navigation, and Ahsoka collection/Journey/spoiler/unmapped-world checks passed without browser errors. The initial older bundle was observed during rollout; the completed release was subsequently verified.
