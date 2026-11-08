# Unified atlas search verification

Checked 2026-11-07 against the integrated local production build at http://localhost:4175. This evidence describes Playwright Chromium with software WebGL, not a physical-device performance test.

- `npm run build` passed, including TypeScript. Existing large-chunk warning remains.
- `ATLAS_URL=http://localhost:4175 node scripts/test-atlas-search.mjs` passed at1440,390 and320px widths.
- Kassa opens its chapter without revealing location links; choosing the alreadycurrent chapter preserves that reveal gate.
- Lothal opens a map preview without changing the committed destination.
- Rogue One yields separately typed Movie and Collection results. Boba Fett yields its seven chapters and collection. Andor S01E02 resolves correctly.
- Result list is capped at12 with totalcount announced; arrow navigation scrolls the active result into view, Enter selects, Escape closes, Tab is contained, and focus returns to the search trigger. Native modal semantics are retained.
- Backdrop dismissal restores focus and background scrolling.320px dialog/header have no horizontal overflow.
- Peridea stays textual with no inferred coordinate/type. Ring of Kafrene reuses its sourced location dossier, without invented map placement or travel.
- Search does not write watched progress or expose episode/location associations. Identity names can reveal settings; that limit is stated beside the input.
- Opening search cancels an active warp. The cancellation regression uses Playwright's controlled clock to hold the transition before cancellation, then advances2200ms to check for a stale arrival.
- Destination changes reset the existing desktop/mobile reading panel scroll position, avoiding opening a new dossier midway through the previous one.

Screenshots: `search-1440.png`, `search-390.png`, `search-320.png`, and corresponding `header-*.png`. Structured viewport results: `results.json`.

No new dependency, service, database table, external media or coordinate was introduced by search. No screen-reader session or physical-device frame-rate measurement was performed.
