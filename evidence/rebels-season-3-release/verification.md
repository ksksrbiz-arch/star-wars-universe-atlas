# Rebels season-three release

## Scope and preservation

257 catalog records (249 episode watch records and eight films), 390 sourced associations, 249 covered records, 136 location identities, nine collection sequences, 76 map placements and 28 illustrated guides. Season three adds 19 watch records covering 22 official parts and 24 connections. Every new record has at least one reviewed connection; this is partial scene coverage. Combined pairs match the shared evidence granularity. Official-source conflicts are retained in the source review.

All previous 238 catalog and 366 connection payloads are unchanged. The existing Rebels sequence retains its exact 34-ID prefix; the other eight sequence payloads and mapped-world data are unchanged. Existing watch IDs remain valid.

## Validation before deployment

Frontend and Worker production builds, ICM, catalog, chronology, connections, reference geometry, season-three data checks, season-two data regression and deterministic catalog rebuild passed. Season-three browser tests at 1440/390/320 verify the season-two boundary, all three combined-story second-part searches, season filter, single combined watch record, reveal controls and library lookup. Season-two UI regression passes with its finale now continuing into season three. The new browser test explicitly waits for rendered chapter metadata after URL changes.

The full 28-dossier suite passed on the development server. The three new dossiers passed production checks at 1440/390/320; original artwork was visually inspected. The source-focus production suite passed six viewport/font cases (1440/390/320 with normal and blocked external fonts): hover/focus, fixed source anchors, no arrival/progress mutation, no tested dense-label overlaps and zero idle draws over 600ms. Hover does not reposition labels; keyboard-focused labels clear their source point. Agent production warp Cancel/Skip regression passed. The 320px source-focus screenshot was reviewed.

## Publication

Publication artifact tests and embedded PostgreSQL sequence extension/conflict/idempotency checks passed. The full reviewed transaction also passed against an embedded copy of the live baseline. The separate standalone PostgreSQL integration suite was not run; embedded checks do not establish multi-client locking behavior.

Neon publication succeeded as one transaction. All four public API digests/counts match the manifest (public-data.json). Stored sequence readback has 257 items and zero mismatches between position order and published itemIds. No schema or coordinate migration was needed.

## Limits

Chromium/software-WebGL and viewport emulation are not physical-device FPS measurements. Dense-label placement remains bounded best-effort. Production builds retain large-chunk warnings. Source-informed portraits are original illustrations, not official stills or measured surface maps.
