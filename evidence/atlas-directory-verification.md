# World directory and episode research batch — November 7, 2026

Added a searchable, expandable directory of mapped destinations and textual worlds; spoiler-aware collection filtering; Journey research-status filtering and episode-code search; and expandable official source notes for revealed planet-linked stories. Added 23 reviewed title/world associations across 20 previously unlinked episodes. Coverage is 208 associations across 160 of 185 titles and 80 associated world names; map placements remain 62. Source evidence: episode-gallery-expansion.md.

Verified on Node 24 and Playwright Chromium/software WebGL:
- Combined TypeScript/Vite and Worker builds passed.
- ICM, catalog, connections, chronology, journey-data, reference-data, and mocked Worker checks passed.
- Directory checks passed textual-world discovery, no invented map action, watched-only collection filtering, independent title reveal, keyboard focus, mapped navigation, and 390px layout.
- Journey browsing passed padded/spaced episode-code searches, research filters, result expansion, spoiler protection, watch-state preservation, and 390/320px layouts.
- Story-search/source checks passed hidden-evidence protection and filtered source correctness.
- Existing Journey progress and full navigation UI regressions passed.
- Directory and Journey screenshots at 1440px and 390px were inspected without clipping or overlap.

The build retains the existing large-chunk warning. Mobile checks are emulated, not physical-device performance claims. The separately published database API remains at its 171-association snapshot; this release changes the bundled frontend dataset.

## Live verification

Application commit `bad6d1c` deployed successfully through the main-branch Cloudflare build. Live JavaScript, CSS, and Galaxy bundle bytes matched the final local build. Live deployment checks passed database health, six read-only APIs, 404/405 behavior, desktop/mobile map transitions and Journey navigation with no browser errors. Directory and Journey browsing suites also passed against production, including independent reveals, focus, unmapped-world restrictions, episode-code variants, research filters, watch-state preservation, and 390/320px layouts.

URL: https://star-wars-universe-atlas.skdev-371.workers.dev
