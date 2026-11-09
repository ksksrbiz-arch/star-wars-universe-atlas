# Library artwork fix verification — 2026-11-09

Released application commit: `82d9e1076d0a5e9bd7172d2ae22f14fdedad1972`.
Cloudflare build `1c25de50-7a6e-40a9-af6c-f136e286fab6` succeeded; active Worker version `3f2c51d5-0fc7-46f9-8234-7ea100045a2c`.

## Finding and change

Library/watch/timeline rows only rendered the original decorative artwork. They did not consume the existing media index. The fix connects accepted episode imagery and show posters, adds twelve sourced individual film posters in R2, labels stills versus poster fallbacks, and preserves source links, optional protection, watch progress and typography when delivery fails. Film posters also render in the corresponding Journey image panel.

Current coverage: twelve film posters, 260 accepted episode stills, and 55 episode records using a labeled show-poster fallback. This is artwork coverage for all 327 catalog items, not 327 distinct episode images. All eight television series have posters. No appearance, chronology, geography or canonical catalog publication changed.

## Passed checks

- Frontend TypeScript/Vite build and Worker bundle.
- ICM structure, catalog, NASA media provenance and Worker read-only/media routing regressions.
- Default visibility suite at 1440/390/320px: optional protection persistence, session storage failure behavior and unchanged watch progress.
- Library accessibility suite: keyboard search/filter/details/reset, mobile targets and library/watch/timeline width checks.
- After integrating concurrent main updates: frontend/Worker build, ICM, reviewed Databank guide checks, catalog and Worker regressions.
- `test:library-covers` against the local preview with real production API/media, then against the live release. All 24 poster variants matched exact stored SHA-256 hashes and MIME/size metadata. Browser decoded every film poster and an image for each of eight series. Desktop/phone layouts fit, labels and source links rendered, and viewing art did not write watch progress.
- Controlled missing-image responses exercised episode-still → series-poster → typography fallbacks. Optional protection substituted show posters for unwatched stills.
- Live HTML references the exact locally built entry CSS/JS and both files match byte-for-byte SHA-256. Verification waited for the new assets to propagate after Cloudflare reported build success; the earlier live placeholder response was not accepted as a completed release.
- Visual inspection of real-artwork desktop and phone captures. See `live/` and `live-deployment.json`.

## Limits

Chromium desktop and mobile viewport emulation; no physical-device performance claim. Full artwork coverage uses show posters where no accepted episode-specific image exists. Posters are copyrighted promotional assets used under the existing personal fan-project direction; source availability is not asserted as a blanket redistribution license. A network/storage failure can still produce the explicit typographic fallback.

The four untracked reusable-asset research documents from the preceding research turn were preserved and excluded from this focused application release.
