# Live visual and animation audit — November 7, 2026

Three agents audited the public app in Chromium at 320px, 390px and 1440px; integration also checked 768px and 1024px. Scope included Galaxy controls/dossier/travel, Journey reveal/progress, Library, release timeline, watchlist, World Directory and linked story/source disclosures.

## Observed issues and fixes

- Phone navigation clipped Release timeline and My watchlist beyond the visible horizontal strip. The five links now occupy two visible rows.
- Map buttons measured 38–40px. Map/Jump/Skip/Cancel targets now meet a 44px minimum; transit labels wrap safely.
- Phone form text was 10–12px, and Library clear/select controls were undersized. Phone search/select text is now 16px, Library fields are 48px tall, clear buttons are 44px, and narrow filters stack. World search uses full-width fields at small phone widths.
- Directory-wide section/summary CSS affected nested story components, narrowing cards and enlarging source disclosures. Selectors now target the outer elements. Nested cards gained 28px usable width at 320/390px; source links/disclosures have 44px targets and the selected heading has visible keyboard focus.
- An older UI regression counted both source links and story links after evidence disclosures were added. It now counts the story-card grid explicitly.

## Validation

Production build/types, ICM and whitespace checks passed. New reusable browser suites: `test-shell-visual-audit`, `test-library-visual-audit`, `test-journey-worlds-visual-audit`, and `test-world-search-visual-audit` (all `.mjs` under `scripts/`, supporting `ATLAS_URL`). They cover visible navigation, measured control sizes, readable fields, filtering and empty states, keyboard disclosure, source visibility, card layout, real warp animation, and manual/system reduced motion. Existing travel lifecycle, map-resilience, world-directory and UI-repairs checks also passed locally. Screenshots were inspected.

The checks use desktop Chromium/software WebGL and emulated viewport widths, not physical iPhone/Android devices or a frame-rate benchmark. No native iOS focus-zoom claim is made. The production build retains its existing large-chunk warning. This pass changes presentation only, preserving catalog/geography/evidence boundaries.

Live release verification is recorded separately after deployment.
