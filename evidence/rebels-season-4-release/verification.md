# Rebels season-four release

270 catalog records (262 episode watch records, eight films), 411 sourced connections, 262 covered records, 140 location identities, nine sequences, 76 map placements and 29 guides. Rebels has 66 watch records across all four seasons. Season four adds 13 records and 21 connections. Official numbered slots run 1–15; extended finale format is distinct from numbering. Appearance coverage remains partial.

Production frontend/Worker builds, ICM, catalog, chronology, connections and S4 data tests pass. S4 browser checks pass at 1440/390/320: season boundary, second-part aliases, 13-record filter, final chapter, single combined progress ID, reveal gates and library search. S3 UI regression passes with the finale now advancing into S4. Full29-guide and focused3-guide suites pass; focused tests also pass against production. Artwork was inspected by the dossier agent.

The visual change synchronizes leader visibility with label visibility. Agent production checks pass six viewport/font cases, actual WebGL leader draw counts, reset, idle0/600ms, source focus and warp Cancel/Skip. Root final production leader check passes all six viewport/font cases.

Publication artifact tests and embedded PostgreSQL prefix extension/conflict/idempotency tests pass. Full publication also passed against an embedded copy of all four live baseline datasets. The separate standalone PostgreSQL integration suite was not run; concurrent locking and physical-device FPS are not established. Build retains large-chunk warnings. Original portraits remain illustrative. No new coordinates are asserted.

All257 prior catalog payloads,390 prior connections and eight other sequences are unchanged. Rebels retains its exact53-ID prefix. Catalog rebuild is byte-identical. Neon publication succeeded as one transaction; all four public API counts and digests match the reviewed manifest (public-data.json).
