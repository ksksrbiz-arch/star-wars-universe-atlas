# Private source refresh and media delivery

The separate `star-wars-atlas-ingestion` Worker refreshes provider inventory and delivers source images. The public atlas Worker retains GET/HEAD only; it has no database writer or originals-bucket binding. Provider inventory never changes published planets, coordinates, story appearances, catalog IDs or viewing order.

## Build and bindings

Run `node scripts/build-ingestion-worker.mjs` to build `dist-worker/ingestion-worker.mjs` and `node --test scripts/test-ingestion-worker.mjs` for its bounded-fetch/authentication checks. Deploy that module with `nodejs_compat` and the existing compatibility date. Bind:

| Name | Binding |
| --- | --- |
| `INGESTION_DB` | A separate Hyperdrive connection using a scoped ingestion writer role |
| `ORIGINALS` | Private `star-wars-atlas-originals` R2 bucket |
| `PUBLISHED_ASSETS` | `star-wars-atlas-published` R2 bucket |
| `INGESTION_TOKEN` | Secret of at least 32 characters; never a browser variable |

The writer needs SELECT/INSERT/UPDATE on the five `atlas_source_*` / `atlas_ingestion_runs` tables, and no write permission on the canonical atlas tables. R2 originals stay private. Provider JSON responses are content-addressed under `ingestion/snapshots/<sha256>.json`; normalized record revisions are also retained in `atlas_source_snapshots`.

## Schedule

Configure one Cron Trigger, `*/15 * * * *` (UTC). The Worker selects its task from the scheduled timestamp:

| Time UTC | Task |
| --- | --- |
| 04:00 daily | Databank locations and characters |
| 04:15 daily | Eight TVmaze series, episodes, cast inventory and media references |
| 04:30 daily | Up to 50 existing Wookieepedia source titles, revision pinned |
| All other quarter hours | Resume at most 16 undelivered source images |

An advisory lock prevents simultaneous source refreshes and scheduled queue discovery from competing. Explicit operator media batches may run concurrently because their stable-ID database upserts and content-addressed R2 writes are idempotent. Delivered assets are refreshed after 30 days. Failed assets cool down for one day so one unavailable image cannot block the remaining queue; a failed refresh preserves the last delivered image and its attribution. Source errors retain existing inventory and produce a partial run. Changed identity tuples invalidate accepted media joins until reconciled; ordinary summary/retrieval changes preserve them. Successful delivery moves existing accepted links to the new asset, without reaccepting held identities. New or ambiguous episode matches remain held for review. TVmaze cast portraits cannot enter the character-image queue.

## Private operator endpoints

Every endpoint requires `Authorization: Bearer <INGESTION_TOKEN>`. Missing/wrong credentials return 404. Do not put the secret in URLs, logs or documentation.

| Method/path | Body or result |
| --- | --- |
| `GET /health` | Binding-independent private service check |
| `GET /status` | Inventory/media/link counts and the latest 12 private run summaries |
| `POST /run` | `{"task":"databank"}`; task may also be `tvmaze`, `wookieepedia` or `media` |
| `POST /media` | `{"items":[...]}`; explicit batch of 1–16 source references |

The explicit media input uses `{id,provider,providerId,sourceUrl,sourcePageUrl?,credit,canonicalId?,canonicalType?,reviewEvidence?}`. `sourceUrl` is the image URL; `sourcePageUrl` is the attribution page. Delivery returns source IDs, same-origin `/media/` paths, content hashes, byte counts, MIME type, measured image dimensions and a responsive `srcSet` when distinct source derivatives are available. Canonical IDs/evidence are carried through for the separately validated publication process; delivering a file does not accept a new canonical join.

Only HTTPS images from Lumiere, TVmaze and Wikia's image CDN are fetched. Redirects are rejected using `redirect: 'manual'` and the non-2xx check; Workers does not implement Fetch's `error` redirect mode. Both declared and streamed lengths are limited to 8 MiB per image; content must match a supported JPEG/PNG/WebP signature and MIME type. The Worker requests a 1280-wide/main derivative and a 320-wide/medium derivative where the provider supports them, and stores delivered bytes at immutable content-hash keys. It does not claim those are newly generated renders or that CDN availability grants ownership of underlying imagery. Existing atlas artwork remains the UI fallback.

Private POST responses remain open until the bounded work completes. The scheduled handler uses its scheduled execution lifetime; it does not depend on the short post-response HTTP `waitUntil` window. Run records distinguish complete, partial, failed and running work. A configured schedule and a manual smoke run do not prove a scheduled invocation has already fired; verify the next Cron event in `/status` or Cloudflare logs.

## Initial publication

The local publisher applies `db/002_enrichment.sql`, stores the complete staged source inventory, and publishes only validated delivered image metadata. Use the same `publication-plan.mjs` validation for initial and recurring records. Keep accepted episode/series/world crosswalks separate from the source inventory; mismatched numbering, combined releases, Legends pages and name-only location matches do not become published story relationships. See [ingestion operations](INGESTION.md) for collector behavior and source limitations.

References: [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/), [Worker limits](https://developers.cloudflare.com/workers/platform/limits/), [R2 bindings](https://developers.cloudflare.com/r2/api/workers/workers-api-usage/).
