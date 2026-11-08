# Obi-Wan Kenobi release

323 catalog records (315 episode watch records and eight films), 495 connections, 315 covered records, 164 location identities,eleven sequences, 76 map placements and 40 guides. Six new episodes have 12 sourced connections. All 317 old catalog payloads, 483 connections andten existing sequence payloads remain exact. Appearance coverage is partial; flashback,Nur moon and unresolved-setting caveats are explicit.

Production frontend/Worker builds,ICM,catalog,chronology,connections,focused Kenobi data checks and deterministic rebuild pass. Kenobi UI and global atlas-search regressions pass at 1440/390/320, including punctuation-tolerant name lookup,eleventh collection,explicit reveal,progress,finale and library. All 40 guides passed the agent browser suite; the three new guides passed production checks and art inspection.

The shipped map change fixes invisible displaced-label wrappers intercepting visible label input. An attempted additional source reservation was abandoned after it caused a crowded-layout overlap; existing source-ring layout stays intact. Agent tests pass six mouse/keyboard/font/viewport cases, emulated touch tap and canvas drag, dense packing,idle and warp Cancel/Skip. Root integrated hit-target and emulated touch/pan checks pass.

Publication artifact tests and embedded PostgreSQL fixture/full-live-baseline transition pass. The separate standalone PostgreSQL integration suite was not run; concurrency and physical-device FPS are not established. Build retains large-chunk warnings. No new coordinates or external image imports are added.

Neon publication succeeded as one transaction; all four public API digests match the reviewed manifest (public-data.json). Final rebuild is identical to the integrated tested build.

## Live deployment verified

Cloudflare build c32384e0-d4ec-4e0f-ab68-5f2d8505196a succeeded for application commit 6880fee31bce42f1fbe681ac6220b9f12980cb52. Live HTML and all five JavaScript/CSS hashes match the integrated tested build (live/assets.json). Live Kenobi UI and three-guide tests pass at 1440/390/320. Live label-hit tests pass six viewport/font cases; emulated touch taps and canvas panning pass at 390/320 (live/hit-target-results.json and live/touch-results.json). All four public API digests were rechecked after deployment. Stored sequence readback has 323 items and zero order mismatches. Full 40-guide browser suite passes all three widths.
