# Boba Fett and unified atlas search

Built November 7, 2026, on main baseline `3bc86c9`. That baseline already contained the map-first workspace and Rogue One release, so this batch extends it rather than duplicating those changes.

## Changes

- Seven Book of Boba Fett chapters, eleven independently sourced partial location associations, and a separate narrative viewing sequence. Mandalorian chapters now link to included Boba chapters 5–7 without merging their progress identities.
- Search across mapped worlds, unmapped locations, films, episodes, episode codes and collections. Results are capped at twelve, with keyboard selection, explicit focus containment, Escape/backdrop dismissal and focus return. Search exposes names but not episode/location joins; it does not mark titles watched. Opening search cancels active travel, preventing hidden arrival behind the modal.
- Glavis station dossier with original static ring illustration; Luke’s Jedi school remains a surface site with unknown parent and no map position. Tatooine adds era-qualified Sanctuary and palace settings. Fourteen dossiers total.
- Destination panels reset scroll when selecting another file. Mobile story-to-story bridge navigation preserves the expanded chapter panel.

## Data publication

The read-only preflight compared every existing catalog, mapped-world, sequence and appearance payload to the desired release: zero conflicts. The exact generated additive publication was executed as 23 statements within one Neon transaction, preserving its locks, validation guards and temporary tables. No existing record was overwritten and no schema or permission was changed.

Publication: `catalog-sha256-5030e615755a3fda053547a45c2c01f9a3b8a87c59c374219bf2e4dd43e1a601`.

The publication marker and all four public API content digests were verified after commit, before updating `cloudflare/database-expectation.json`. Totals are 201 titles, 302 associations across 195 titles, seven sequences, and 76 mapped worlds. See [public API evidence](public-data.json). Six titles still lack reviewed links; coverage is partial even for linked titles.

## Validation

TypeScript and production build, Worker build, ICM, catalog, chronology, connections, Boba source boundaries, Rogue One regression, reference geography, reconciled placements, media provenance, Worker mocked R2/Postgres regressions, fourteen dossiers, catalog reproducibility and publication artifact validation passed.

Production browser checks use Playwright Chromium with software WebGL at 1440, 390 and 320 pixel widths. They cover map-first placement, mobile expansion, search keyboard/focus/overflow, location reveals, preview versus arrival, station artwork/source disclosures, separate watch progress, internal Boba bridges and unmapped school behavior. Zoom/pan bounds, keyboard controls, warp-disabled controls and arrival re-enabling passed. WebGL-disabled fallback passed at 390 pixels.

Two test failures led to fixes: focus could leave the search dialog, and mobile cross-series bridge navigation collapsed the chapter panel. Both have dedicated regression coverage. Destination scroll retention was also corrected.

No physical-device FPS claim is made. Large JavaScript chunk warnings remain; physical-device profiling and further code splitting are future work. The disposable-local-PostgreSQL integration suite was not run in this environment; artifact checks and actual guarded production publication/digest verification were performed.

Frontend rollout verification is recorded below after deployment.
