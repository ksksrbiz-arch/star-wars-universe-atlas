# The Bad Batch season-two release

302 catalog records (294 episode watch records and eight films), 462 sourced connections, 294 covered records, 156 location identities,ten sequences, 76 mapped destinations and 35 guides. Season two adds 16 records and 26 connections. Each new record has a reviewed connection; scene coverage remains partial. Source ambiguities and unnamed settings remain explicit.

All 286 old catalog payloads, 436 old links and nine other sequences remain unchanged. Bad Batch retains its exact 16-ID season-one prefix and extends to 32 records. Deterministic rebuild passes.

Frontend/Worker production builds,ICM,catalog,chronology,connections,S 2 data tests,S 1 UI regression and S 2 UI pass. S 2 UI at 1440/390/320 covers season boundary/filter,search,reveal/progress,finale and library lookup. Initial new test expected a spelled-out title; corrected it to retained provider punctuation Truth & Consequences. Focused dossier test now selects the World/Location result because Pabu is also an episode title.

Leader geometry tests pass axes/diagonal/negative offsets/covered-source cases. Integrated source-focus production browser checks pass six viewport/font cases, dense packing,fixed anchors and idle 0/600ms. Agent preview/hidden-leader and warp Cancel/Skip regressions pass. Original guide artwork is source-informed and illustrative.

Publication artifact checks and embedded PostgreSQL fixture/complete-live-baseline transition pass. The separate standalone PostgreSQL integration suite was not run; concurrency and physical-device FPS are not established. Large-chunk build warnings remain. No coordinates are added.

Neon publication succeeded as one transaction; all four public API counts and digests match the reviewed manifest (public-data.json). Final rebuild is identical to the integrated tested build.

## Live deployment verified

Cloudflare build 6e65e595-456a-4e16-b501-30ad30ad81c5 succeeded for application commit 460bcde1cee82be644410c0d26fa7252ca660b42. Live HTML and all five JavaScript/CSS hashes match the integrated tested build (live/assets.json). Live S2 UI and focused guide tests pass at 1440/390/320. Live source-focus/dense-label checks pass all six viewport/font cases (live/source-focus-results.json). All four API digests were rechecked after deployment. Stored sequence readback has 302 items and zero order mismatches. Full 35-guide browser suite passes all three widths.
