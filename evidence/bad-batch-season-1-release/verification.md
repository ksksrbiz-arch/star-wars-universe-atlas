# The Bad Batch season-one release

286 catalog records (278 episode watch records and eight films), 436 associations, 278 covered records, 147 location identities, ten viewing sequences, 76 map placements and 32 guides. This batch adds 16 episodes and 25 sourced connections. Each new episode has at least one reviewed connection; scene coverage remains partial. All 270 prior catalog payloads, 411 connections and nine sequence payloads remain unchanged. No sequence baseline exceptions are permitted for this publication.

Frontend/Worker builds, ICM, catalog, chronology, connections, focused Bad Batch data checks and deterministic rebuild pass. New UI tests at 1440/390/320 verify episode search, tenth collection numbering, progression/finale, explicit reveal, single progress ID and library lookup. Focused guide production tests pass at all three widths. Source-informed original artwork was inspected by the dossier agent; Pantora retains its moon identity.

Embedded PostgreSQL fixture checks and the full publication against an embedded copy of the live baseline pass; publication artifact checks pass. The separate standalone PostgreSQL integration suite was not run. This does not establish multi-client locking behavior.

The preview diamond is fixed-screen sized and distinct from the current-location reticle. Agent production tests pass normal/fallback fonts, preview/arrival behavior, dense packing, source focus, idle rendering and warp Cancel/Skip. Root integrated preview check passes all six viewport/font cases.

Chromium/software-WebGL viewport emulation does not establish physical-device FPS. Build retains large-chunk warnings. No new map coordinates are asserted; original illustrations do not establish surface maps.

Neon publication succeeded as one transaction. All four public API counts and digests match the reviewed manifest (public-data.json). Final rebuild is identical to the integrated tested build.

## Live deployment verified

Cloudflare build 2f499ea3-87c7-4fe4-a578-56c9c6422bf4 succeeded for application commit 5e8c0ab626b3495d0cf6b76c8ad67a648efc0935. Live HTML and all five JavaScript/CSS hashes match the integrated tested production build (live/assets.json). Live Bad Batch journey and three-guide tests pass at 1440/390/320. Live preview tests pass all six viewport/font cases (live/preview-results.json). All four public API hashes were rechecked after deployment. Stored sequence readback has 286 items and zero order mismatches. Agent full 32-guide suite passes all three widths.
