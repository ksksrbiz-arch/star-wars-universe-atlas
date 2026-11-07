# Episode research, highlighting and publication preparation

November 7, 2026. Reviewed all 25 previously unlinked titles; added 23 sourced associations across 19 titles. Final bundled coverage: 231 associations across 179 of 185 titles and 86 world identities. Six reviewed gaps remain documented in remaining-title-review.md. Map placements remain62.

Added static highlights for revealed/watched episode locations, with no inferred travel order, and a legend that distinguishes unmapped locations. Checks cover exact highlight sets, hidden titles, stale-state cleanup, watched removal, reset and reduced-motion mobile behavior.

Prepared deterministic additive SQL and a SHA-256 publication manifest in db/publications. The runner verifies generated artifact integrity, TLS, database identity and an independently confirmed endpoint before applying. Real PostgreSQL17 tests passed additive publication, full payload verification, idempotent replay without timestamp changes, and atomic rejection of conflicts, unexpected rows, missing baseline publication, and wrong catalog/map counts. The171 live records were compared with the final registry and form an exact subset without conflicts.

Combined type/Vite/Worker builds, ICM, catalog, connections, chronology, journey-data, reference-data, Worker and publication artifact checks passed. Highlight, Journey progress and full UI browser suites passed. Live deployment validation against the current database baseline passed full payload-digest verification as well as API and desktop/mobile navigation checks.

Live database publication is pending secure ATLAS_DATABASE_URL and independently verified ATLAS_DATABASE_HOST. No write to the live database is claimed. Build retains its large-chunk warning; software-WebGL/mobile-emulation checks do not establish physical-device performance.
