# Rebels season-two release

## Scope

238 catalog records (230 episode watch records and eight films), 366 associations, 230 covered records, 127 location identities, nine collection sequences, 76 map placements and 25 dossiers. Season two adds 20 records covering 22 official parts and 24 verified joins across 18 records. The Call and The Forgotten Droid retain explicit identity gaps. All previous 218 catalog and 342 connection payloads remain unchanged. The existing Rebels sequence retains its exact 14-ID prefix; eight other sequences are unchanged.

## Checked before deployment

Production frontend/Worker builds, ICM, catalog, connections, chronology, season-one regression, season-two data tests and deterministic rebuild passed. New UI tests at 1440/390/320 verify season-one to season-two continuity, combined premiere/finale aliases, season filtering, scoped film filtering, stable watch progress and unrevealed locations. Global-search and chapter-browsing regressions pass. Search tests now account for multiple titles containing Lothal, and chapter tests explicitly open the existing browse disclosure.

All 25 dossiers passed the agent browser suite; the three new guides passed production browser checks at 1440/390/320. Illustrations are original and source-informed, not screen stills. Map coordinates remain unchanged. Dense-map production validation initially found an overlap at 320px. Nearest-first placement left an unusable gap under production metrics; compact corner packing for dense narrow maps resolves the tested case. Final production checks pass at 1440/390/320, plus 320 with external fonts blocked: zero tested label overlaps, retained keyboard focus and zero idle draws over 600ms. Font-ready/loadingdone events request a finite layout refresh. Normal-motion warp Cancel/Skip regressions also pass. The 320px result was visually inspected.

## Database

The reviewed sequence extension is permitted only from the exact checked-in baseline payload, with an unchanged existing ID prefix and stored positions. Embedded PostgreSQL tests pass for extension, idempotent replay, conflicting payload/order rollback and rejection without the baseline. The full publication passed against an embedded copy of all four live datasets before publication. PGlite is development-only; documentation: https://pglite.dev/docs/api. This does not test multi-client locks or Neon networking. The separate standalone PostgreSQL integration suite was not run.

Neon publication succeeded as one transaction. All four public API counts and digests match the reviewed manifest (public-data.json).

## Limitations

Appearance coverage remains partial. Chromium/software-WebGL emulation is not a physical-device FPS measurement. Production retains large-chunk build warnings. Dense-label placement is bounded best-effort; it cannot guarantee unlimited label density.

Database sequence-item readback after publication: 238 rows and zero sequences whose stored position order differs from their published itemIds. An independent agent reviewed the publication changes and found no blocking issues.
