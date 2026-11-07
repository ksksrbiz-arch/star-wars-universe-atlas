# Star Wars Universe Atlas

Live preview: https://star-wars-universe-atlas.skdev-371.workers.dev

Cloudflare Workers hosts the app and read-only API, with dedicated Neon Postgres through Hyperdrive and separate R2 media buckets. Main-branch application changes build, validate, and deploy through Cloudflare Builds. See [deployment setup](docs/DEPLOYMENT.md). User watch progress remains browser-local.

Deployed interactive atlas with 62 schematic map destinations (eight general, 53 direct journey placements, and the Endor parent-system placement), a 193-item film/episode catalog, five sourced collection viewing sequences, and partial story/location relationships. The implementation includes galaxy navigation, cinematic jumps, reduced motion, library/release-timeline views, and browser-local watch progress. Release checks are recorded in [deployment verification](evidence/deployment/verification.md).

Latest visual upgrade details and validation: [visual verification](evidence/visual-upgrades-verification.md). Graphics settings, layered galaxy rendering, two-second warp effects, and reduced-motion-aware interface transitions are implemented locally.

Reference-map geography update: [verification and scope](evidence/reference-map-verification.md). Includes region boundaries, five major corridor traces, 27 refined positions, and layer controls.

## Run

Integrated relationship coverage is 270 links across 187 of 193 titles and 91 world names. Six titles have no current link. Only 62 worlds have supported map placements; title coverage does not establish complete scene coverage.

Requires a current Node version supported by Vite (Node 26 used during development).

```sh
npm ci
npm run dev -- --port 4173
```

Open http://localhost:4173. Keep the terminal running. Production build: `npm run build`. ICM validation: `npm run check:icm`. Catalog validation: `node scripts/test-catalog.mjs`. Browser checks: install Chromium with `npx playwright install chromium`, start the dev server, then `npm run test:ui`. Listing a command here does not mean that it passed for the latest source revision.

## Scope

Eight general destinations in [data.ts](src/data.ts) combine with 54 additional destinations in [journeyWorlds.ts](src/journeyWorlds.ts). Background and planet artwork are illustrative. Region silhouettes and five major route corridors are approximate reference-image traces. Twenty-seven world symbols have in-cell traced offsets; 35 retain cell centers. Grid-cell centers do not imply precise coordinates, routes, travel times, or physical scale. Shared cells are valid; rendering separation is a presentation choice. Yavin 4 uses its parent-system grid, not an independently measured moon position.

| Catalog group | Included |
|---|---:|
| Original trilogy | 3 films |
| Andor | 24 episodes, seasons 1–2 |
| The Clone Wars (2008) | 133 episodes, seasons 1–7, plus the theatrical film |
| The Mandalorian | 24 episodes, seasons 1–3 |
| Ahsoka | 8 episodes, season 1 |

The original 181 regular episodes and four films remain a distinct 185-item audit cohort. Eight Ahsoka season-one episodes are added from a separate TVmaze source snapshot, bringing the current catalog to 193 items. This is a bounded collection, not all Star Wars movies/shows. Nine promotional/Legacy specials, the 2003 Clone Wars series, and The Mandalorian and Grogu film are excluded. The 62 worlds do not constitute complete geographic coverage. Story/location coverage is partial and independently counted in [journey data review](evidence/journey-data-review.md). An unjoined story has no verified relationship in this pass; it may be unaudited or reviewed without a named planet link.

## Source fidelity and limits

- Episode titles, numbering, air dates, and selected runtime fields derive from [TVmaze](https://www.tvmaze.com/api), with CC BY-SA attribution retained. All 181 imported episode titles/dates/numbers match the audit CSV; both input-file SHA-256 values match the recorded metadata as checked November 7, 2026.
- Film dates retain source caveats in [catalog.generated.json](src/catalog.generated.json). Empire's provider date is May 17, 1980, with premiere/theatrical/territory meaning unresolved. Return of the Jedi retains May 25, 1983, supported by an official anniversary article despite a conflicting film landing-page date. These are not a definitive worldwide release calendar.
- Ahsoka season one uses a separate [metadata snapshot](docs/ahsoka-season-1-source.json); its eight runtimes are withheld, and future-season stubs are excluded. Its 14 episode/world associations retain vision and orbital-arrival caveats; see [source review](evidence/ahsoka-source-review.md).
- Release chronology remains separate from [collection viewing sequences](src/chronology.ts), which cover all 193 catalog IDs. Clone Wars uses its complete official chronological order including the film; the other collections use film/episode narrative order. Embedded flashbacks are retained, not globally reordered. No exact BBY/ABY calendar is asserted.
- External bridge references cover Rogue One, Book of Boba Fett chapters 5–7, and Revenge of the Sith overlap. They are not phantom catalog/progress items. The base catalog metadata's chronology flag describes its release-only import; the separately sourced chronology module now owns collection sequences.
- All 133 Clone Wars episode runtimes are null because the audit found the same suspect 30-minute provider value throughout. Four film runtimes remain null pending edition-specific verification. Other episode runtimes are provider values, not independently checked streaming durations; no exact full-marathon total is supported.
- No provider summaries or image assets are imported into the catalog. World descriptions are short original reference text. Planet illustrations are original procedural artwork, not screen stills.
- Geography and political conditions can vary by era. Coruscant's Return of the Jedi appearance is edition-dependent. Story links distinguish present scenes, flashbacks and destruction where supported. Complete spoiler filtering, exhaustive scene/event links, character journeys, and a full canon/continuity model remain unimplemented.

Normal application builds use the checked-in catalog and need no live API. To regenerate it from the local audit files, run `python scripts/build-catalog.py`; its default input folder is `docs/`, or use `--audit-dir` to specify another folder containing the two CSVs. The generator records the inputs' hashes and does not make network requests.

The prototype uses React, Vite, Three.js/R3F and Drei. Navigation currently uses local React state and CSS interface transitions; the larger plan proposes XState and Motion when navigation grows. Watch progress is browser-local, synchronizes across open tabs, and supports JSON export and merge-only import. No accounts or cloud progress sync are implemented. The UI uses its bundled catalog snapshot; a read-only live API is available separately. No remote images or audio are loaded. Google Fonts supplies optional Barlow Condensed and DM Sans typography; system sans-serif fallbacks apply without it. Cloudflare hosts the live preview linked above; deployment configuration and limits are in `docs/DEPLOYMENT.md`.

Development follows the scoped ICM contracts under [context/](context/CONTEXT.md). The checker comes from Keith's ICM kit with a Windows file-URL entry-point fix. Current-batch browser checks, device performance, and deployment must be reported separately with their actual evidence.

Prior local checks are recorded in [verification](evidence/verification.md) for their source stage. They do not certify the newly expanded journey batch. Current integrated browser results must be reported separately; Chromium/software-WebGL and emulated-mobile checks are not physical-device performance measurements.



Latest completed checks and limitations: [Story journeys verification](evidence/journey-verification.md). Machine-readable coverage inventory: [journey-coverage.json](evidence/journey-coverage.json).



## Exploration and progress update

Search mapped destinations by name, grid, or region; filter by region and share a destination link. Journey controls resume the first unwatched chapter in collection story order and can mark watched while advancing. The watchlist accepts version-1 JSON backups, merges valid catalog IDs without erasing existing progress, and reports unsupported entries. See [verification](evidence/explorer-upgrade/verification.md).

## Bug-sweep regression checks

After `npm ci`, start `npm run dev`, then run `npm run test:worker`, `npm run test:ui-repairs`, and `npm run test:map-resilience`. Browser scripts accept `ATLAS_URL` to target a specific running checkout (default `http://localhost:4173`); this avoids accidentally checking another server. The Worker regression uses mocked database and R2 bindings and does not require credentials.

## Cinematic experience and reusable media

The atlas includes resolution-independent original world portraits, high-density cinematic map rendering, clearer world lettering and finite hyperspace effects. Sound is muted by default; the header switch enables original synthesized interface cues. Reduced motion remains independent of audio.

The hero imports NASA SVS’s public-domain randomized starfield as decorative atmosphere, with visible source credit and responsive local derivatives. Phones use the 38 KB preview, desktops the 144 KB 2K image, and the 1.6 MB 4K derivative is explicit opt-in. This is not fictional geography or a Star Wars screenshot. See [media provenance and representative label audit](evidence/media-provenance.md) and [experience verification](evidence/cinematic-experience-verification.md).

## First journeys and world field guides

The optional guided start in the hero introduces all five collections, with the Original Trilogy selected initially. Choose the first chapter or explicitly resume at the first unwatched chapter in that collection’s sourced viewing order. Opening the guide changes neither watched progress nor location visibility.

Tatooine, Coruscant, Hoth and Naboo include expanded field guides beneath the map, with sourced terrain descriptions and nine expandable local settings. Original portraits remain illustrative. These setting details do not establish episode appearances or surface coordinates; linked stories retain their own evidence and reveal controls. See [source review](evidence/world-dossiers-source-review.md).
