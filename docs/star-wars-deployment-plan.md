# Proposed production architecture — Star Wars Universe Atlas

Decision status: proposed, November 7, 2026. Target repository: https://github.com/ksksrbiz-arch/star-wars-universe-atlas . Repository identity/access was inspected; this research did not push code, deploy services, or provision paid resources.

## Recommended stack

Keep React, TypeScript, Vite, Three.js and React Three Fiber for the interactive explorer. Deploy application code with Cloudflare Workers Static Assets. Serve API/admin operations through a Worker. Keep media in R2 on a custom asset domain and relational data in a dedicated Neon Postgres project. Use Hyperdrive for pooled Postgres access. Use Queues to coordinate ingestion and separate container/batch jobs for heavy media processing.

Use a Neon plan with the production recovery/SLA requirements: Scale currently provides an uptime SLA and up to30-day restore history; Launch is appropriate for development or an early preview with lower requirements. Neither an edge API nor pooling makes Postgres a multi-region writable database. Managed compute can still reconnect after failures. Sources: https://neon.com/docs/introduction/plans and https://neon.com/docs/introduction/high-availability .

Dedicated means this application's isolated database/project, roles and environments, not a promise of exclusive physical hardware. Production should not share the database of an unrelated Keith project.

## Request paths

1. Browser receives HTML/JS/CSS from Workers Static Assets.
2. Explorer loads small versioned catalog/geometry manifests, then only the requested scene's asset variants from R2/CDN.
3. API requests requiring dynamic data go through a Worker to Postgres through Hyperdrive.
4. User progress writes are authenticated, retry-safe and uncached. Public catalog responses and published catalog snapshots can be cached.
5. Editor uploads go directly to object storage using short-lived authorized upload URLs. A durable job record and queue coordinate validation, transformation and publishing.
6. Heavy conversion runs in container jobs: FFmpeg, Blender renders, texture compression and model optimization. Workers coordinate; they do not perform large media jobs inside request handlers.

Hyperdrive uses Neon's direct unpooled database endpoint and a supported PostgreSQL driver. Do not layer another HTTP/WebSocket driver or transaction pool beneath it without an explicit design reason. Disable query caching for freshness-sensitive user/admin paths. Source: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/neon/ .

## Asset architecture

Use private originals and separate published derivatives. Store immutable hash/version filenames and an atomic published manifest pointer. Browsers cache immutable assets for long periods; the manifest pointer has short freshness and explicit invalidation. Configure custom-domain cache behavior for GLB, KTX2 and JSON; do not assume every file extension is automatically cached. Avoid r2.dev as the production asset URL. Source: https://developers.cloudflare.com/r2/buckets/public-buckets/ .

Publish responsive AVIF/WebP/poster variants, GLB geometry, KTX2/Basis textures and low/medium/high detail levels. Select quality based on device capability, and prefetch only likely next destinations. Keep originals and Blender project files out of application deployment bundles. Git stores source, migrations, tests and manifests, not the media library.

Use Cloudflare Images transformations for image derivatives when economical. Use Stream for adaptive video when real video becomes a product requirement. Neither is needed for every procedural warp. Sources: https://developers.cloudflare.com/images/ and https://developers.cloudflare.com/stream/ .

A CDN solves transfer and origin-load problems; it cannot fix GPU memory, shader cost or excessive draw calls. Keep demand rendering, instancing, adaptive resolution, LOD and explicit disposal of unused resources. Measure cold load, frame-time percentiles and context loss on physical phones. Targets must be recorded as targets until measured. Sources: https://r3f.docs.pmnd.rs/advanced/scaling-performance and https://threejs.org/docs/pages/KTX2Loader.html .

## Dedicated database model

Use PostgreSQL as the authoritative store, with migrations and typed server-side data access.

- works / editions: film, series, season, episode and edition identity; separate release dates from story chronology.
- worlds / placements: location identity, parent system and independently sourced grid/projection/version evidence.
- sources / claims / appearances: source URLs, evidence excerpts or precise references, review status, confidence, flashback/mention/orbit/destruction distinctions and continuity.
- viewing_sequences / sequence_items / chronology_edges / external_bridges: whole-work ordering, overlap and uncertainty. No invented exact year from a list position.
- assets / asset_variants: object keys, content hashes, dimensions, codec, quality tier, attribution, rights and provenance. Media bytes remain outside Postgres.
- users / watch_progress / saved_journeys: authenticated private state with per-user authorization and separate production permissions.
- ingest_jobs / publication_versions: idempotency keys, retries, errors, review state and published snapshot manifests.

PostgreSQL relational edges are sufficient initially; a separate graph database is not necessary merely because the interface draws a galaxy. Start with indexed joins and PostgreSQL full-text search. Add a separate search service only when measured search needs justify it.

## Publishing and reliability

Maintain draft/review/published content states. Validate foreign keys, provenance, chronology cycles, coverage metadata and asset availability before a version becomes public. Publish versioned catalog chunks to object storage so basic read-only exploration can remain available during database interruptions. Show honest stale/read-only status; do not present failed user writes as saved.

Use production protection, isolated staging, schema-only or sanitized preview branches, backward-compatible migrations and release manifests that pair app/data/assets. Test migrations on previews; rollback code/manifests without assuming destructive schema changes are reversible. Never give preview deployments production write credentials.

Enable managed restore history and perform independent encrypted exports plus restoration drills. Back up original asset objects separately; a database backup containing object keys is not a media backup. Use monitored queue depth, dead-letter queues, retry-safe jobs, error tracking, synthetic checks and spend alerts. Set explicit RPO/RTO targets after traffic/value requirements are known; no current recovery time is measured.

## Repository layout

apps/web — public catalog and interactive explorer
apps/api — Worker API, authentication boundaries and admin operations
workers/ingestion — queue consumers and publication coordination
packages/domain — shared types and validation
packages/db — schema and migrations
packages/rendering — reusable scene components
context/ — ICM router, scoped contracts and decision records
scripts/ — catalog, provenance, asset and release validation

GitHub checks should build/typecheck, validate datasets/migrations and exercise desktop/mobile journey flows. PR previews use isolated data. The production release pins an app version, schema compatibility range and published asset/catalog version.

## Alternatives

Supabase is a credible alternative if its integrated Auth/database APIs are the deciding benefit. Its pricing/recovery model differs: Pro starts at$25/month; point-in-time recovery is an additional paid feature (roughly$100/month for7-day retention). New Multigres HA is private alpha, not a basis for a production availability promise. Sources: https://supabase.com/pricing , https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery and https://supabase.com/docs/guides/database/multigres .

Vercel is attractive if Next.js server rendering becomes central. The current client-rendered galaxy does not require a framework migration. Public /worlds/... and /stories/... HTML pages can be added separately or pre-rendered. AWS CloudFront/S3 with managed Postgres/container processing is appropriate if custom networking, compliance or an AWS operating model justifies greater operational scope. It is not categorically more expensive: CloudFront now offers flat-rate plans. Sources: https://vercel.com/docs/functions/limitations and https://aws.amazon.com/cloudfront/pricing/ .

## Cost model checked November 7, 2026

Workers Paid starts at$5/month; ordinary static asset requests are free, API execution is metered. R2 Standard storage is$0.015/GB-month plus operations; internet egress is free.100GB raw storage therefore has a$1.50/month list-price storage component before allowances, but this is not the total application cost. Neon is usage-based; Launch lists$0.106/CU-hour and Scale uses a different rate. Storage/history, media processing, transforms, video delivery, monitoring and recovery add cost. Do not present a fixed production total before sizing these workloads.

Sources: https://developers.cloudflare.com/workers/platform/pricing/ , https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ , https://developers.cloudflare.com/r2/pricing/ and https://neon.com/pricing .

Important boundaries: Workers static assets have a25MiB per-file limit; standard Workers have128MB memory. Queue messages contain job IDs/object keys, not asset binaries. The separate Workers Caching feature can introduce billable requests even for cached assets; do not enable it globally under the assumption all static paths remain free. Sources: https://developers.cloudflare.com/workers/platform/limits/ and https://developers.cloudflare.com/queues/platform/limits/ .

## Implementation sequence

1. Move the current tested prototype into the repository with ICM context, data sources and CI; exclude node_modules, build products and scratch downloads.
2. Define and migrate the dedicated Postgres schema; import the current185 catalog items, viewing sequences,171 relationships and62 map placements with their provenance.
3. Introduce the Worker API and published versioned catalog snapshots while preserving existing explorer behavior.
4. Add R2 asset manifests and the derivative pipeline before expanding the visual library.
5. Add managed authentication and synchronized user progress with tested authorization.
6. Establish staging, preview and production environments; validate recovery and performance before public launch.
