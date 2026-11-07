# Live deployment verification — November 7, 2026

Live app: https://star-wars-universe-atlas.skdev-371.workers.dev

Repository: https://github.com/ksksrbiz-arch/star-wars-universe-atlas

Application release commit: `a230aff26a0febdcb5ef374cfe64a65caa90024e`.
Successful automatic Cloudflare build: `2cb2cbb9-2c3f-4774-95a7-b2a4a83e7bc0`.
Trigger: `b6b0e600-fa22-4aec-93b2-c8dfd38b6467`, main branch, Node 24.

## Provisioned resources

- Worker `star-wars-universe-atlas` with Static Assets, SPA routing, selective API/media routing, sampled logs, and immutable hashed-asset caching.
- R2 buckets `star-wars-atlas-originals` and `star-wars-atlas-published`. Only published storage is bound to the public read-only media handler; there is no upload/write endpoint. The procedural frontend does not yet require media objects.
- Dedicated Neon project `young-hall-18334569`, branch `br-bitter-violet-ak7la0ve`, database `atlas`, using the existing free plan. No plan upgrade, SLA, or recovery drill is claimed.
- Hyperdrive `deaad056eda2484fb6a15537a923676e`, read-only scoped database role, query caching disabled. Verified SELECT allowed and INSERT/UPDATE/DELETE denied for that role.
- Initial database contents: 185 works, 62 mapped worlds, 171 appearances, four sequences with 185 sequence items, eight region polygons, five routes, and one publication record. Source/provenance payloads retained.

## Actual checks

Cloudflare Builds successfully ran the frontend/server builds, ICM check, catalog, connections, chronology, journey-data, and reference-data tests before deploying. The current live browser/API result JSON and screenshots are in this directory.

Live API health and all six read endpoints returned expected counts. Unknown API/media paths returned 404; public write attempts returned 405. HTML/JavaScript returned 200, nosniff was present, and hashed JavaScript carried `public, max-age=31536000, immutable`.

Desktop1440px and emulated390px browser checks exercised 62-world selection, one WebGL canvas, visible warp/skip, Journey navigation, no horizontal overflow, and no console/page errors. Screenshots were inspected. These are software-WebGL/emulated-device observations, not hardware frame-rate measurements.

The first deployment exposed two Worker bundling issues: import.meta.url was unavailable for createRequire, and pg-cloudflare's default empty export was selected instead of its workerd export. Both were corrected in the committed build script and verified live.

GitHub Actions could not start because GitHub reported an account billing lock. Its workflow is manual-only pending account resolution. Automatic validation and deployment run successfully in Cloudflare Builds, which reports a GitHub commit check.

## Remaining platform scope

The UI uses its checked-in catalog snapshot and browser-local watch progress. Authenticated accounts/sync, editor uploads, processing queues, custom domain, staging isolation, and recovery drills are not implemented by this release. The provisioned database/API and R2 buckets are foundations for those additions. Dataset and map-reference coverage limitations remain unchanged.
