# Star Wars Universe Atlas

Live preview: https://star-wars-universe-atlas.skdev-371.workers.dev

Cloudflare Workers hosts the app and read-only API, with dedicated Neon Postgres through Hyperdrive and separate R2 media buckets. Main-branch application changes build, validate, and deploy through Cloudflare Builds. See [deployment setup](docs/DEPLOYMENT.md). User watch progress remains browser-local.

Deployed interactive atlas with 76 schematic map destinations (eight general, 67 direct journey placements, and the Endor parent-system placement), a 327-item film/episode catalog, thirteen sourced collection viewing sequences, and partial story/location relationships. The implementation includes galaxy navigation, cinematic jumps, reduced motion, library/release-timeline views, and browser-local watch progress. Release checks are recorded in [deployment verification](evidence/deployment/verification.md).

Latest visual upgrade details and validation: [visual verification](evidence/visual-upgrades-verification.md). Graphics settings, layered galaxy rendering, two-second warp effects, and reduced-motion-aware interface transitions are implemented locally.

Reference-map geography update: [verification and scope](evidence/reference-map-verification.md). Includes region boundaries, five major corridor traces, 27 refined positions, and layer controls.

## Run

Requires Node 24 or newer (CI uses Node 24).

```sh
npm ci
npm run dev -- --port 4173
```

Open http://localhost:4173 (the default port, also used by `npm run preview`). Keep the terminal running. Production build: `npm run build`. ICM validation: `npm run check:icm`. Catalog validation: `npm run test:catalog`. Browser checks: install Chromium with `npx playwright install chromium`, start the dev server, then `npm run test:ui`. Listing a command here does not mean that it passed for the latest source revision.

## Scope

Integrated relationship coverage is 521 links across 319 of 327 titles and 182 location identities. Eight titles have no current link. Only 76 worlds have supported map placements; title coverage does not establish complete scene coverage. Generated figures live in [journey-coverage.json](evidence/journey-coverage.json) (refresh with `node scripts/test-journey-data.mjs --write`; the default run only asserts against the committed file) and are discussed in the [journey data review](evidence/journey-data-review.md).

Eight general destinations in [data.ts](src/data.ts) combine with 68 additional destinations in [journeyWorlds.ts](src/journeyWorlds.ts). Background and planet artwork are illustrative. Region silhouettes and five major route corridors are approximate reference-image traces. Twenty-seven world symbols have in-cell traced offsets; 49 retain cell centers. Grid-cell centers do not imply precise coordinates, routes, travel times, or physical scale. Shared cells are valid; rendering separation is a presentation choice. Yavin 4 uses its parent-system grid, not an independently measured moon position.

| Catalog group | Included |
|---|---:|
| Original trilogy | 3 films |
| Prequel trilogy | 3 films |
| Sequel trilogy | 3 films |
| Rogue One | 1 film |
| Solo: A Star Wars Story | 1 film |
| Andor | 24 episodes, seasons 1–2 |
| The Clone Wars (2008) | 133 episodes, seasons 1–7, plus the theatrical film |
| The Mandalorian | 24 episodes, seasons 1–3 |
| Ahsoka | 8 episodes, season 1 |
| The Book of Boba Fett | 7 episodes, season 1 |
| Rebels | 66 watch records, seasons 1–4 |
| The Bad Batch | 47 episodes, seasons 1–3 |
| Obi-Wan Kenobi | 6 episodes |

The original 181 regular episodes and four films remain a distinct 185-item audit cohort. Eight Ahsoka season-one episodes from a separate TVmaze source snapshot one independently sourced Rogue One film, seven separately sourced Book of Boba Fett chapters, and the three prequel films bring the current catalog to 327 items, including 66 Rebels watch records across seasons 1–4 and 47 Bad Batch episodes across seasons 1–3 and six Obi-Wan Kenobi episodes, plus Solo: A Star Wars Story and the three sequel films. This is a bounded collection, not all Star Wars movies/shows. Nine promotional/Legacy specials, the 2003 Clone Wars series, and The Mandalorian and Grogu film are excluded. The 76 worlds do not constitute complete geographic coverage. Story/location coverage is partial and independently counted in [journey data review](evidence/journey-data-review.md). An unjoined story has no verified relationship in this pass; it may be unaudited or reviewed without a named planet link.

## Source fidelity and limits

- Episode titles, numbering, air dates, and selected runtime fields derive from [TVmaze](https://www.tvmaze.com/api), with CC BY-SA attribution retained. All 181 imported episode titles/dates/numbers match the audit CSV; all 13 recorded source-file SHA-256 values are computed over LF-normalised bytes (CRLF folded to LF), so line-ending differences do not change them; `npm run test:catalog` verifies them.
- Film dates retain source caveats in [catalog.generated.json](src/catalog.generated.json). Empire's provider date is May 17, 1980, with premiere/theatrical/territory meaning unresolved. Return of the Jedi retains May 25, 1983, supported by an official anniversary article despite a conflicting film landing-page date. These are not a definitive worldwide release calendar.
- Ahsoka season one uses a separate [metadata snapshot](docs/ahsoka-season-1-source.json); its eight runtimes are withheld, and future-season stubs are excluded. Its 14 episode/world associations retain vision and orbital-arrival caveats; see [source review](evidence/ahsoka-source-review.md).
- Release chronology remains separate from [collection viewing sequences](src/chronology.ts), which cover all 327 catalog IDs. Clone Wars uses its complete official chronological order including the film; the other collections use film/episode narrative order. Embedded flashbacks are retained, not globally reordered. No exact BBY/ABY calendar is asserted.
- Rogue One and Book of Boba Fett chapters 5–7 have included bridge links while retaining separate collection identities. Revenge of the Sith is now an included film linked from the final Clone Wars arc as an overlap, not a prescribed scene-interleaving order. The base catalog metadata's chronology flag describes its release-only import; the separately sourced chronology module now owns collection sequences.
- All 133 Clone Wars episode runtimes are null because the audit found the same suspect 30-minute provider value throughout. Twelve film runtimes remain null pending edition-specific verification. Other episode runtimes are provider values, not independently checked streaming durations; no exact full-marathon total is supported.
- No provider summaries or image assets are imported into the catalog. World descriptions are short original reference text. Planet illustrations are original procedural artwork, not screen stills.
- Geography and political conditions can vary by era. Coruscant's Return of the Jedi appearance is edition-dependent. Story links distinguish present scenes, flashbacks and destruction where supported. Complete spoiler filtering, exhaustive scene/event links, character journeys, and a full canon/continuity model remain unimplemented.

Normal application builds use the checked-in catalog and need no live API. To regenerate it from the local audit files, run `python3 scripts/build-catalog.py`; its default input folder is `docs/`, or use `--audit-dir` to specify another folder containing the two CSVs. The generator records the inputs' hashes and does not make network requests.

The prototype uses React, Vite, Three.js/R3F and Drei. Navigation currently uses local React state and CSS interface transitions; Motion handles interface animation; XState remains a future option if navigation complexity warrants it. Watch progress is browser-local, synchronizes across open tabs, and supports JSON export and merge-only import. No accounts or cloud progress sync are implemented. The UI uses its bundled catalog snapshot; a read-only live API is available separately. No remote images or audio are loaded. Google Fonts supplies optional Barlow Condensed and DM Sans typography; system sans-serif fallbacks apply without it. Cloudflare hosts the live preview linked above; deployment configuration and limits are in `docs/DEPLOYMENT.md`.

Development follows the scoped ICM contracts under [context/](context/CONTEXT.md). The checker comes from Keith's ICM kit with a Windows file-URL entry-point fix. Current-batch browser checks, device performance, and deployment must be reported separately with their actual evidence.

Prior local checks are recorded in [verification](evidence/verification.md) for their source stage. They do not certify the newly expanded journey batch. Current integrated browser results must be reported separately; Chromium/software-WebGL and emulated-mobile checks are not physical-device performance measurements.



Latest completed checks and limitations: [Story journeys verification](evidence/journey-verification.md). Machine-readable coverage inventory: [journey-coverage.json](evidence/journey-coverage.json) (regenerate with `node scripts/test-journey-data.mjs --write`).



## Exploration and progress update

Search mapped destinations by name, grid, or region; filter by region and share a destination link. Journey controls resume the first unwatched chapter in collection story order and can mark watched while advancing. The watchlist accepts version-1 JSON backups, merges valid catalog IDs without erasing existing progress, and reports unsupported entries. See [verification](evidence/explorer-upgrade/verification.md).

## Bug-sweep regression checks

After `npm ci`, start `npm run dev`, then run `npm run test:worker`, `npm run test:ui-repairs`, and `npm run test:map-resilience`. Browser scripts accept `ATLAS_URL` to target a specific running checkout (default `http://localhost:4173`); this avoids accidentally checking another server. The Worker regression uses mocked database and R2 bindings and does not require credentials.

## Cinematic experience and reusable media

The atlas includes resolution-independent original world portraits, high-density cinematic map rendering, clearer world lettering and finite hyperspace effects. Sound is muted by default; the header switch enables original synthesized interface cues. Reduced motion remains independent of audio.

The hero imports NASA SVS’s public-domain randomized starfield as decorative atmosphere, with visible source credit and responsive local derivatives. Phones use the 38 KB preview, desktops the 144 KB 2K image, and the 1.6 MB 4K derivative is explicit opt-in. This is not fictional geography or a Star Wars screenshot. See [media provenance and representative label audit](evidence/media-provenance.md) and [experience verification](evidence/cinematic-experience-verification.md).

## First journeys and world field guides

The optional guided start in the hero introduces the included collections, with the Original Trilogy selected initially. Choose the first chapter or explicitly resume at the first unwatched chapter in that collection’s sourced viewing order. Opening the guide changes neither watched progress nor location visibility.

Tatooine, Coruscant, Hoth, Naboo, Bespin, Dagobah, Yavin 4 and Endor’s forest moon include expanded field guides beneath the map, with sourced terrain descriptions and expandable local settings and habitat references. `src/worldDossiers.ts` now defines dossiers for 43 worlds. Original portraits remain illustrative. These setting details do not establish episode appearances or surface coordinates; linked stories retain their own evidence and reveal controls. See [source review](evidence/world-dossiers-source-review.md).

## Visual world exploration

Browse worlds from the hero to open the location directory with original illustrations, sourced regions, reviewed terrain categories, and watch-progress filters. Unmapped worlds retain neutral symbols and no map action. Counts use watched titles; including unwatched collection links requires an explicit reveal.

Revealed story cards offer a separate “Explore linked worlds” disclosure with per-location evidence and map previews where supported. Revealing a title does not automatically reveal its other settings. The current frontend reconciles 14 sourced placements and 13 associations already present in the live database; see [geography review](evidence/reconciled-world-geography.md) and [association review](evidence/live-associations-reconciliation.md).

Visual-directory release checks: [verification](evidence/visual-directory/verification.md).

Latest dense-map label and placement work: [mapped-world release](evidence/mapped-batch/release.md).

## Map-first workspace and Rogue One

The galaxy opens above the fold with a compact story/destination panel beside it on desktop and a collapsible panel beneath it on phones. Search and layers live in map settings. Explicit zoom, pan, reset and return controls share the existing camera; selecting a chapter or revealing locations never marks it watched.

Rogue One adds one independently sourced film and eight typed location relationships, linking Andor to A New Hope through whole-work viewing references. Ring of Kafrene is an asteroid outpost, Jedha and Yavin 4 are moons, and unsupported map positions remain unavailable. Unmapped locations open readable files without moving the galaxy marker. Five Rogue One destination studies were added to the field guides; original illustrations are separate from map geography. See [Rogue One source review](evidence/rogue-one-source-review.md) and [dossier review](evidence/rogue-one-dossier-review.md).

Map-first layout, location files, camera controls and release checks: [workspace verification](evidence/map-workspace/verification.md).

## Boba Fett and unified search

Seven separately sourced chapters add twelve partial location associations; Glavis is an unmapped station and Luke’s Jedi school is an unmapped surface site without an inferred parent planet. Global atlas search finds locations, titles, episode codes and collections without changing watch progress or automatically revealing episode-location links. Glavis has an original static station illustration, and Tatooine has additional sourced local settings. See [source review](evidence/boba-fett-source-review.md) and [release verification](evidence/boba-search/verification.md).

## Prequel trilogy and galaxy clarity

All three prequel films have a separately sourced catalog snapshot, whole-film viewing sequence and twenty partial location associations. Brief Order 66 settings, mixed surface/orbital scenes and the Polis Massa outpost retain explicit caveats; deleted Dagobah material is excluded. Four source-informed illustrated dossiers cover Kamino, Geonosis, Utapau and Kashyyyk. The galaxy gains static dust detail, feathered corridor light, a current-location reticle and source-cell badges; narrow-screen geography labels appear with zoom. No coordinates or route geometry change. See [prequel evidence](evidence/prequel-source-review.md) and [release verification](evidence/prequel-release/verification.md).

## Film and series batches (Rebels, The Bad Batch, Obi-Wan Kenobi, Solo)

Per-batch counts, ID-prefix preservation rules and source caveats for these films and series are kept once, in [release history](evidence/release-history.md), rather than repeated here. Source reviews and release verification: [Rebels S1](evidence/rebels-source-review.md), [Rebels S2](evidence/rebels-season-2-release/verification.md), [Rebels S3](evidence/rebels-season-3-source-review.md), [Rebels S4](evidence/rebels-season-4-source-review.md), [Bad Batch S1](evidence/bad-batch-season-1-source-review.md), [S2](evidence/bad-batch-season-2-source-review.md), [S3](evidence/bad-batch-season-3-source-review.md), [Obi-Wan Kenobi](evidence/obi-wan-source-review.md), [Solo](evidence/solo-source-review.md). Map-label and preview-marker behavior introduced alongside them is documented in each release verification file. Appearance coverage remains partial.

Solo adds one standalone film and a twelfth collection, with seven reviewed associations (six planet settings and First Light as a ship). Original illustrated guides cover Corellia, Vandor and Savareen. Its U.S. theatrical date, landing-page discrepancy and withheld edition-specific runtime are documented in the [source review](evidence/solo-source-review.md); see [release verification](evidence/solo-release/verification.md).

## The sequel trilogy

The Force Awakens, The Last Jedi and The Rise of Skywalker add three film records, a thirteenth viewing sequence and 19 sourced location connections. Existing records and all twelve sequences are preserved. Scene coverage remains partial; moon, ship, base, destruction and flashback distinctions stay explicit. Release territory/source differences are retained in the [source review](evidence/sequel-source-review.md).

New original illustrated guides cover Jakku, Ahch-To and Exegol. Exegol lightning is static artwork. The galaxy map key now uses an 11px text minimum, with a wider phone layout tested against controls and dense labels. See [release verification](evidence/sequel-release/verification.md).
