# The Bad Batch season-three release

317 catalog records (309 episode watch records and eight films), 483 connections, 309 covered records, 160 location identities, ten sequences, 76 map placements and 37 guides. Season three adds 15 episodes and 21 reviewed connections; all new episodes have at least one connection, with partial scene coverage. Bad Batch has 47 records across all three seasons.

Production frontend/Worker builds and S 3/S 2 UI tests pass. At 1440/390/320, S 3 tests cover season boundary/filter, exact episode lookup, explicit reveal, progress, finale and library search. Two new guide production checks pass all three widths. Original source-informed artwork preserves planet/facility/spaceport distinctions.

The visual change culls clipped offscreen background names and their leaders. Current,preview,story and keyboard-focused labels retain their priority. Agent six-case production visual checks,source-focus,dense-packing,idle and warp Cancel/Skip regressions pass. Root integrated map-edge check passes all six viewport/font cases.

Publication artifact checks, embedded PostgreSQL fixture/full-live-baseline transition, ICM, catalog, chronology, connections and focused S 3 data checks pass. Existing 302 catalog payloads, 462 connections,nine other sequences and the 32-ID Bad Batch prefix are exact; generation is byte-stable. Neon publication succeeded as one transaction and all four public API digests match (public-data.json). The separate standalone PostgreSQL integration suite was not run; concurrent locking is untested. Large-chunk build warnings remain. Chromium/software-WebGL emulation does not establish physical-device FPS. No new coordinates are asserted. Original artwork is illustrative.

## Live deployment verified

Cloudflare build a0bc07cd-34e0-4774-9d69-5533ee8a307c succeeded for application commit 117924a8db12b8f8950e5bcfdc74a6ebd62ea29d. Live HTML and all five JavaScript/CSS asset hashes match the integrated tested build (live/assets.json). Live S3 journey and two new guide checks pass at 1440/390/320. Live map-edge checks pass all six viewport/font cases (live/map-edge-results.json). All four public API digests were rechecked after deployment. Stored sequence readback has 317 items and zero order mismatches. Full 37-guide browser suite passes all three widths.
