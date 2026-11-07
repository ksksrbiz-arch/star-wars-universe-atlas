# Batch bug sweep — November 7, 2026

Baseline: `d0921ac`. Three parallel repair agents covered UI/progress, map/navigation, and backend/data; integration validation used the resulting combined changes on `fix/batch-bug-sweep`.

## Repairs

- Catch unavailable WebGL/lazy-renderer failures so world selection, instant travel, Back, and other sections remain usable.
- Cancel pending travel on direct hash/history/home navigation to prevent stale arrivals.
- Support exact episode queries (`S1E2`, `S01E02`, `season 1 episode 2`).
- Expand world dossiers beyond six linked titles while preserving explicit spoiler reveal.
- Synchronize watch progress across tabs, read latest storage before toggles, and preserve session edits when storage is denied or full.
- Correct Worker media precondition statuses, range metadata and unsatisfiable ranges, URL-encoded keys, and HEAD responses. Unsupported R2 If-Range takes the safe full-response path.
- Browser scripts accept `ATLAS_URL`. Replace the obsolete eight-world map test with all 62 destinations at desktop/phone widths; use controlled clocks for short-lived travel controls.
- Register three new regressions and include Worker regression in the existing manual CI workflow. Clarify README runtime/deployment wording.

## Validation

Environment: Windows, Node 26.7.0, Playwright Chromium 158.0.8127.18, software WebGL. The checked-out app ran at `http://127.0.0.1:4187`; the default port was occupied by another server. Browser coverage includes 1440px desktop, 390px and 320px phone emulation, portrait/landscape changes, and disabled WebGL.

Passed: `npm ci` (0 reported vulnerabilities), `npm run build`, `npm run build:worker`, `npm run check:icm`, and `git diff --check`.

Passed data/backend scripts: test-catalog, test-connections, test-chronology, test-journey-data, test-reference-data, test-worker.

Passed browser scripts: test-ui, test-platform, test-expanded-map, test-library-a11y, test-touch, test-journey, test-journey-accessibility, test-world-stories, test-shared-grid, test-visual-ui, test-visual-graphics, test-visual-lifecycle, test-reference-map, test-ui-repairs, test-map-resilience.

Initial failures were investigated: the map test still expected eight markers, and two tests raced a live two-second transit before clicking Cancel. Updated tests passed without weakening the arrival/cancel assertions. The platform test was rerun after its remaining hardcoded navigation URLs were made configurable.

## Limits

No deployment or production-database changes were performed. Worker tests mock Postgres/R2 bindings. Browser emulation does not establish physical-device performance or hardware-context-loss recovery. Vite still warns about chunks over 500 kB; software WebGL emitted ReadPixels stall warnings but no lifecycle errors. LocalStorage is not transactional for truly simultaneous cross-tab writes. Crowded overview markers can overlap; the finder exposes every supported destination. Existing partial story coverage and unsupported geography remain explicit, with no invented lore links.

Generated historical screenshots/results were not replaced wholesale; this document records this sweep separately.
