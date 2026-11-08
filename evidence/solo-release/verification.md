# Solo release

324 catalog records (315 episode watch records,nine films), 502 connections, 316 covered records, 169 location identities,twelve sequences, 76 map placements and 43 guides. Solo adds one film and seven sourced connections:six planet settings and First Light ship. Release date is explicitly U.S. theatrical May 25 2018; source discrepancy retained and runtime withheld. Scene coverage is partial.

All 323 existing catalog payloads, 495 connections andeleven sequences remain exact. Data checks,ICM,catalog,chronology,connections and deterministic regeneration pass. Publication artifacts and embedded PostgreSQL fixtures/full-live-baseline transition pass. The separate standalone PostgreSQL integration suite was not run.

Frontend/Worker builds and Solo UI pass at 1440/390/320: distinct film/collection search,single-film journey,both navigation buttons disabled,explicit reveal,one watched ID,completion and library. Three new guides pass production browser checks; art inspected by dossier agent.

The source-cell highlight reuses gridToDisplay calibration, outlining one published cell on hover/focus. It changes no source points or placement accuracy. Agent production tests pass six viewport/font cases,grid toggle,anchors,focus/hit targets,dense packing,idle,warp Cancel/Skip and emulated touch/pan. Root integrated source-cell check passes all six viewport/font cases.

Chromium/software-WebGL tests do not establish physical-device FPS or multi-client database locking. Large-chunk build warnings remain. No new coordinates are asserted. Original art is illustrative.

Neon publication succeeded as one transaction. All four public API counts and digests match the reviewed manifest (public-data.json). Final rebuild matches the integrated tested build.

## Concurrent main integration

Merged origin/main 3ee9f06 before deployment, retaining the incoming worker/deploy security headers and asset MIME support, progress-storage preservation, UI/accessibility fixes, slim ICM contracts and LF-normalized catalog source hashes. Merge resolution keeps all Solo additions and existing item payloads. Solo and Obi-Wan source-hash assertions now use the shared normalized helper. Regenerated publication identity and all four dataset hashes are unchanged.

Merged production frontend/Worker builds, full test:data aggregate (including Solo), ICM, worker/deploy checks, Solo/Obi-Wan UI, audio/search accessibility, corrupt/unknown watch-storage preservation, directory filters and six-case source-cell browser tests pass. Historical directory fixture now includes the already-reviewed Krownest ice guide. Full43-guide suite passed before the merge; the new guide checks and final live checks are recorded separately.
