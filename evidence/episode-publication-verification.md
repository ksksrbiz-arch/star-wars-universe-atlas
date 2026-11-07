# Episode research, highlighting and publication preparation

November 7, 2026. Reviewed all 25 previously unlinked titles; added 23 sourced associations across 19 titles. Final bundled coverage: 231 associations across 179 of 185 titles and 86 world identities. Six reviewed gaps remain documented in remaining-title-review.md. Map placements remain62.

Added static highlights for revealed/watched episode locations, with no inferred travel order, and a legend that distinguishes unmapped locations. Checks cover exact highlight sets, hidden titles, stale-state cleanup, watched removal, reset and reduced-motion mobile behavior.

Prepared deterministic additive SQL and a SHA-256 publication manifest in db/publications. The runner verifies generated artifact integrity, TLS, database identity and an independently confirmed endpoint before applying. Real PostgreSQL17 tests passed additive publication, full payload verification, idempotent replay without timestamp changes, and atomic rejection of conflicts, unexpected rows, missing baseline publication, and wrong catalog/map counts. The171 live records were compared with the final registry and form an exact subset without conflicts.

Combined type/Vite/Worker builds, ICM, catalog, connections, chronology, journey-data, reference-data, Worker and publication artifact checks passed. Highlight, Journey progress and full UI browser suites passed. Live deployment validation against the current database baseline passed full payload-digest verification as well as API and desktop/mobile navigation checks.

Live database publication is pending secure ATLAS_DATABASE_URL and independently verified ATLAS_DATABASE_HOST. No write to the live database is claimed. Build retains its large-chunk warning; software-WebGL/mobile-emulation checks do not establish physical-device performance.

## Frontend deployment

Commit13fc4f0 is live. Deployed JavaScript/CSS/Galaxy assets exactly match the tested build. Production episode-highlighting and desktop/mobile navigation checks passed without browser errors. The live API still matches the separately recorded171-row baseline digest; it has not received the prepared231-row publication.

## Database publication completed

The user verified endpoint `ep-sparkling-darkness-akvy5haf-pooler.c-3.us-west-2.aws.neon.tech` and supplied the writer connection securely. Read-only identity verification confirmed database `atlas`, role `atlas_owner`, and171 existing appearances. Direct TCP was refused in this environment; Neon’s official serverless client connected over TLS WebSocket through the inherited HTTPS proxy with certificate verification enabled.

The exact regenerated SQL/manifest and endpoint were checked before applying the transaction. Publication `appearances-sha256-e235fe4241739f53cbd0b7b85e32cd810e8d50ba4916274b0add6dcf62e730b5` committed successfully. Both the stored publication marker and all231 database payloads matched the reviewed manifest. The public health endpoint reported231 appearances and the complete `/api/appearances` payload digest matched. The default deployment-test baseline now tracks this verified publication (179 covered titles).

The live deployment regression suite passed using the new manifest: six APIs, full appearance digest,404/405 protections, desktop/mobile map/warp/skip/Journey navigation and no overflow or browser errors.
