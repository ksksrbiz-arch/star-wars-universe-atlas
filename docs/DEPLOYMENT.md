# Deployment

The application uses Cloudflare Workers Static Assets. `cloudflare/deployment.json` contains non-secret resource identifiers; `scripts/deploy-cloudflare.mjs` implements Cloudflare's documented direct-upload API. No CLI-specific configuration or local credentials are needed for connector-driven deployment.

Live URL: https://star-wars-universe-atlas.skdev-371.workers.dev

Automatic Cloudflare build trigger: `b6b0e600-fa22-4aec-93b2-c8dfd38b6467`, connected to main. It runs the production builds, ICM checks, catalog, connection, chronology, journey-data, and reference-data validations before deploying. GitHub Actions (`.github/workflows/ci.yml`) is manual-only (`workflow_dispatch`) because the GitHub account is locked by a billing issue; Cloudflare Builds runs the automatic checks until push/pull_request triggers are restored. Documentation/evidence-only changes do not redeploy the app.

The server bundle explicitly selects the `workerd` package condition, so pg-cloudflare's real socket implementation is included. It uses a Worker-compatible createRequire fallback for Node built-ins. `node scripts/test-deployment.mjs` verifies the deployed database endpoints and desktop/mobile map transitions.

Build with Node 24 or newer:

```sh
npm ci
npm run build
npm run build:worker
```

Deploy with a Cloudflare Workers-edit API token injected into `CLOUDFLARE_API_TOKEN` by the deployment environment, then `npm run deploy`. Tokens are never committed. Cloudflare Workers Builds connects the repository's main branch to this build/deploy sequence; consult the deployment evidence for the verified trigger and release.

The dedicated Neon project is `young-hall-18334569`, database `atlas`, production branch `br-bitter-violet-ak7la0ve`. The initial additive schema is in `db/001_atlas.sql`; `npm run db:prepare` writes an ordered JSON array of SQL statements (schema DDL followed by inserts) to `work/deploy/seed-statements.json` from the checked-in domain data. The file is not a transaction: it contains no `BEGIN`/`COMMIT`, so whoever applies it must supply transactional wrapping. Initial seeding is not run on each deployment. Future schema/content publication changes require reviewed migrations and a new publication version. The initial setup uses the existing free Neon plan and its default recovery settings; no paid SLA or restore drill is established.

Hyperdrive connects using the scoped `atlas_reader` role and query caching is disabled. The Worker exposes only GET/HEAD catalog endpoints; there are no public database writes. The current UI continues using its bundled catalog snapshot, so exploration does not depend on database availability. Browser watch progress remains local; user authentication/sync is not implemented.

Endpoints: `/api/health`, `/api/catalog`, `/api/worlds`, `/api/appearances`, `/api/sequences`, `/api/regions`, `/api/routes`. Unknown API paths return 404; write methods return 405. Worker logs omit raw database error details and sample requests.

R2 buckets:

- `star-wars-atlas-originals`: private originals, not bound to the public Worker.
- `star-wars-atlas-published`: published derivatives, served by the Worker under `/media/`; no write endpoint exists.

Both buckets have no r2.dev public-access requirement. The current procedural graphics need no external media upload. An asset domain, media transformation jobs, ingestion queues, authenticated editor, staging database, and recovery drills remain later platform work. Deployments use the workers.dev address until a project domain is selected.

Git stores source, documentation, data, migrations, test scripts, and verification evidence. Installed dependencies, build output, secrets, and scratch downloads are excluded. The original user-supplied reference JPEG is not redistributed; its trace metadata and source filename remain documented.


## Reviewed content and sequence extensions

Generate a versioned transaction with `npm run db:prepare-publication`, then run `npm run test:publication` and `npm run test:sequence-publication -- --live-baseline`. The latter executes the full transaction in embedded PostgreSQL populated from the read-only live API; it does not write to production. It also tests prefix preservation, idempotent replay and rollback on unexpected sequence payloads or positions. It does not measure concurrent locking or network behavior.

Existing catalog, map and appearance payloads remain immutable in this publication path. To extend an existing collection, record its exact previously verified payload in `db/sequence-extension-baselines.json`. The generator requires all previous work IDs to remain an unchanged prefix; the SQL additionally requires unchanged stored positions. Metadata may be revised only alongside an actual extension. Only an exact baseline or the already-published desired payload is accepted. Keep the baseline for idempotent replay; replace it with the newly verified live payload when preparing a later extension. Never substitute a broader upsert or silently rebuild stored order.

Apply the reviewed SQL as one transaction to the dedicated atlas database, verify all four public API hashes with `npm run verify:live-publication`, then update `cloudflare/database-expectation.json`. The existing CLI writer additionally checks its dedicated database/host, TLS and regenerated artifact identity; credentials remain environment-injected. Publish the frontend and verify its exact built assets and browser behavior separately.
