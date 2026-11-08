# Rebels season-one release

218 catalog records (210 episode watch records, eight films), 342 associations, 212 covered records, 113 location identities, nine collection sequences and 76 mapped destinations. Four new dossiers bring guides to 22.

Passed production frontend/Worker build, ICM, catalog, connections, chronology, Rebels normalization/preservation, publication artifact checks and combined-premiere UI at 1440/390/320. Agent browser checks passed story beacons, HUD-aware labels, idle rendering, map commands and warp Cancel/Skip. Existing 204 catalog records, 322 joins and eight sequences are unchanged.

Neon additive publication succeeded and all four live API dataset hashes match the reviewed manifest; see public-data.json. No map coordinates added. Dedicated disposable PostgreSQL integration suite was not run. Chromium/software-WebGL emulation does not establish physical-device performance. Build retains large-chunk warnings. Appearance coverage remains partial.

## Live deployment verified

Cloudflare build 4c1fb0ca-6a01-40cc-b6f8-9a0ed0bbcb42 succeeded for application commit eb6d13530d78bdcd22455b973e5aef4496ff38c4. Live HTML and all five JavaScript/CSS asset hashes match the production build (live/assets.json). Live Rebels UI, all four new dossiers, and galaxy story-marker/HUD tests passed at 1440, 390 and 320 pixels, including single premiere progress, part-two search alias, reveal/reset, preview versus arrival, and zero idle draw calls during a 600 ms sample. Full 22-dossier and global-search regressions passed locally. Warp Cancel/Skip and camera regressions passed locally. Worker mocked bindings, media provenance and reference geometry checks also passed.
