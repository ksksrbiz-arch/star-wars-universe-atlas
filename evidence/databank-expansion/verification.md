# Reviewed Databank guide verification

Base: current remote main 1073b1b8a8cbf4739c8965ec765a21a964100798, fetched again before release. November 9, 2026. The user explicitly authorized merge and publication.

## Changes and evidence

Two reviewed guides reuse ImmersiveDossier in existing mapped destination panels and directory/location dossiers. Four terrain/climate facts, 16 typed relationships (including inhabitants), six official video links and one official 15-image gallery link. Each claim has a direct official source; media records retain source, credit, link-only use basis and parent-entry fallback. See docs/databank-expansion-review.md. No episode joins, chronology, coordinates, map renderer, artwork or travel implementation changed.

## Completed checks

- npm ci (fresh checkout; npm 11.19.0 / Node 26.7.0).
- npm run build, npm run build:worker, npm run check:icm, git diff --check. Existing Vite large-chunk warning remains.
- npm run test:data: catalog/connection/chronology/journey/reference/worker/publication/sequence/media/dossier/all existing series validations and new Databank integrity check. Counts remain 327 catalog items, 521 partial title/location links and 76 map worlds. The existing dossier check reports 46 guides; corrected stale context count 43.
- test:planet-appearance: 76 mapped profiles, 104 total; test:planet-renderer: 102 deterministic renders.
- test:databank-guide-ui: 1440/390/320px layouts, real keyboard activation and visible focus, reveal/hide, per-world consent isolation, official links, 44px source targets, directory access, no episode reveal/watch mutations or horizontal overflow. Bundled facts and fallback links require no official-site request.
- test:galaxy-immersion: all 76 original globes, default immersive view, reference switch, pan controls, inspection without arrival at 1440/390/320.
- test:hyperspace-flight: natural completion, Skip, midflight Cancel, geographic inset, controls and instant reduced-motion arrival at 1440/390/320.
- test:planet-artwork: shared profiles in destination/curated/directory views at 1440/390/320; static reduced motion, unknown/nonplanet symbols, gas/terrestrial distinction, rapid replacement, unavailable canvas fallback and blocked-worker fallback.
- test:world-stories and test:destination-links: existing watched/reveal behavior, Journey navigation, desktop/phone destination deep links/reload/jump/share fallback/invalid route/section navigation.

Local browser screenshots/results are in local/, galaxy/, hyperspace/, planet-artwork/ and destination-links/. Desktop Chromium/software rendering with emulated phone widths, not physical-device or hardware performance measurements.

## Limits

No full Databank import, complete world/episode coverage, direct media reuse right or supported embed is claimed. Official media remains on StarWars.com; some landing-page retrievals timed out and external video playback was not tested. Parent Databank entries are the fallback. Existing external PostgreSQL publication integration is skipped without ATLAS_TEST_DATABASE_URL; embedded PostgreSQL sequence tests pass. No database writes or migrations are part of this batch.

Production deployment and live checks will be recorded after merge, separately from these local results.
