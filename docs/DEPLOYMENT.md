# Deployment

The application uses Cloudflare Workers Static Assets. `cloudflare/deployment.json` contains non-secret resource identifiers; `scripts/deploy-cloudflare.mjs` implements Cloudflare's documented direct-upload API. No CLI-specific configuration or local credentials are needed for connector-driven deployment.

Build with Node 24 or newer:

```sh
npm ci
npm run build
npm run build:worker
```

Deploy with a Cloudflare Workers-edit API token injected into `CLOUDFLARE_API_TOKEN` by the deployment environment, then `npm run deploy`. Tokens are never committed. Cloudflare Workers Builds connects the repository's main branch to this build/deploy sequence; consult the deployment evidence for the verified trigger and release.

The dedicated Neon project is `young-hall-18334569`, database `atlas`, production branch `br-bitter-violet-ak7la0ve`. The initial additive schema is in `db/001_atlas.sql`; `npm run db:prepare` produces an ordered seed transaction from the checked-in domain data. Initial seeding is not run on each deployment. Future schema/content publication changes require reviewed migrations and a new publication version. The initial setup uses the existing free Neon plan and its default recovery settings; no paid SLA or restore drill is established.

Hyperdrive connects using the scoped `atlas_reader` role and query caching is disabled. The Worker exposes only GET/HEAD catalog endpoints; there are no public database writes. The current UI continues using its bundled catalog snapshot, so exploration does not depend on database availability. Browser watch progress remains local; user authentication/sync is not implemented.

Endpoints: `/api/health`, `/api/catalog`, `/api/worlds`, `/api/appearances`, `/api/sequences`, `/api/regions`, `/api/routes`. Unknown API paths return 404; write methods return 405. Worker logs omit raw database error details and sample requests.

R2 buckets:

- `star-wars-atlas-originals`: private originals, not bound to the public Worker.
- `star-wars-atlas-published`: published derivatives, served by the Worker under `/media/`; no write endpoint exists.

Both buckets have no r2.dev public-access requirement. The current procedural graphics need no external media upload. An asset domain, media transformation jobs, ingestion queues, authenticated editor, staging database, and recovery drills remain later platform work. Deployments use the workers.dev address until a project domain is selected.

Git stores source, documentation, data, migrations, test scripts, and verification evidence. Installed dependencies, build output, secrets, and scratch downloads are excluded. The original user-supplied reference JPEG is not redistributed; its trace metadata and source filename remain documented.
