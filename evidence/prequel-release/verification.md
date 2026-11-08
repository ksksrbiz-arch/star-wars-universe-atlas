# Prequel trilogy and galaxy visual release

November 7, 2026, based on main `189424b`. Three parallel agents handled sourced film data, galaxy rendering, and world dossiers; integration added film-flow and overlap navigation checks.

## Included changes

Three prequel film records, one whole-film viewing sequence and twenty partial location associations: three for The Phantom Menace, five for Attack of the Clones and twelve for Revenge of the Sith. Appearance coverage does not establish an exhaustive scene log. Order 66 montage, surface/space combinations, atmospheric action, Polis Massa’s outpost identity and deleted-scene exclusions retain qualifications. The final Clone Wars arc links to the film and the film links back to all four overlapping chapters without prescribing scene interleaving.

Four original illustrated dossiers cover Kamino, Geonosis, Utapau and Kashyyyk. The total is eighteen dossiers. Known setting identity is separate from verified placement: map destinations remain 76, with no coordinate or route-geometry changes.

The galaxy adds finer static dust filaments, warmer central depth, feathered corridor light, a committed-location reticle and source-cell badges. On narrow maps, secondary region/route names become available with zoom rather than crowding the overview. The route lines and region boundaries remain visible.

## Verification

- TypeScript, production frontend and Worker builds pass. ICM, catalog, chronology, connections, prequel source boundaries, coverage generation, reference geometry, media provenance, mocked Worker regressions, dossier structure and publication artifact checks pass. The catalog generator is reproducible and all 201 previous catalog payloads and seven previous sequences remain unchanged.
- Production-preview Chromium/software-WebGL checks pass at 1440, 390 and 320 pixels: all three films, fresh reveal gates, separate watch progress, Mustafar preview/arrival, four dossiers and source disclosures, global search, overlap backlinks, and no horizontal overflow.
- Visual tests cover cinematic desktop, balanced desktop, balanced mobile 390/320, source-grid badges, zoom-revealed labels, Cancel/Skip and zero settled draw calls over 600ms in each scenario. Camera tests cover zoom/pan bounds, reset, keyboard activation and travel-state disabling. WebGL-disabled fallback passes at 390px. Optional bloom tests pass mobile/reduced-motion exclusion, module reuse and failed-download fallback.
- All eighteen dossiers pass source checks and browser regression at desktop and emulated phone widths. Screenshots were visually reviewed; original illustrations are not official surface maps.
- The reverse Clone Wars overlap links were missing in the first integration; the UI now provides them and a dedicated regression passes.

These are desktop-emulated browser checks, not physical-device FPS measurements. Large JavaScript chunk warnings remain. Disposable-local-PostgreSQL integration was not run in this environment; the guarded production transaction and post-publication contents were independently verified.

## Publication

Read-only preflight found zero conflicting existing payloads across catalog, worlds, sequences and appearances. The reviewed additive SQL was applied as 23 statements in one transaction to the verified dedicated Neon atlas database; locks and conflict guards were retained. No schema, permissions or existing payloads changed.

Publication `catalog-sha256-5911680f3fb32e627a0d88758b38b738c96d635ed0ca8e6c7043926d32a002de` is present. All four public API content digests match it: 204 titles, 322 associations, eight sequences and 76 mapped worlds. There are 198 titles with at least one reviewed connection and six remaining evidence gaps. Database expectations were updated only after verification. See [public API results](public-data.json), [source review](../prequel-source-review.md), [dossiers](../prequel-dossiers-review.md), and [visual evidence](../prequel-visuals/verification.md).

## Live rollout

Cloudflare build `40027b5a-f873-4e99-b4f7-541076a79777` successfully deployed application commit `c899fde29bb7ceb4480fd492c4e4038eabaa2dcd`. Live verification completed November 8, 2026 around 02:18 UTC (November 7 local time).

Live HTML matches the tested production build after Windows/Linux line-ending normalization, and all five JavaScript/CSS assets match byte for byte. Live prequel film progression, film/Clone Wars overlap links and four-dossier browser suites pass at 1440/390/320 widths. The live galaxy suite passes cinematic/balanced desktop and balanced mobile, zoom-revealed geography labels, source-grid badges, Cancel/Skip, no overflow and zero settled draws over 600ms. All four API content digests were reverified after rollout.

Exact asset results and live screenshots remain in `work/prequel-release/live/`. No further database writes occurred during rollout verification.
