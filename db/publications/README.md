# Catalog and appearance publication

`appearances.sql` is a reviewed, generated additive transaction for the dedicated Neon `atlas` database. `appearances.json` identifies the exact desired catalog, sequence and appearance payloads with canonical SHA-256 digests. Generating these files does not publish them.

Regenerate after a reviewed registry change with `npm run db:prepare-publication`, then run `npm run test:publication` and inspect the SQL/JSON diff. The node-only test verifies committed artifact identity; it explicitly reports PostgreSQL integration as unrun unless `ATLAS_TEST_DATABASE_URL` points to a disposable local PostgreSQL administrator database. Integration creates and removes its own uniquely named test database, and validates actual transactions, replay, and rejected conflicts.

The migration requires the existing `initial-2026-11-07` publication and 62 mapped worlds. Existing works, sequences, sequence positions and appearance rows must be exact subsets of the reviewed dataset. The transaction adds missing works and sequence entries before appearances, reaching 193 works and five sequences. Unknown or changed catalog/sequence/evidence rows, mismatched publication metadata or baseline counts abort the entire transaction. Concurrent writes are blocked during validation/insertion. Replaying the same publication preserves its original timestamp. It adds catalog, sequence, sequence-position and appearance rows plus one content-addressed publication record; it does not delete evidence, alter application schemas or grant Worker permissions.

## Publish

Use a writer connection for the dedicated Neon project `young-hall-18334569`, production branch `br-bitter-violet-ak7la0ve`, database `atlas`. The runtime Worker `atlas_reader` role must remain read-only. Configure `ATLAS_DATABASE_URL` securely; never paste it into a command, document or chat. The operator must independently verify the endpoint belongs to that project/branch using Neon settings.

1. Run `npm run db:check-publication`. This checks the target read-only and reports only hostname, database, role and current count. Confirm the endpoint against Neon settings.
2. Set the non-secret `ATLAS_DATABASE_HOST` to that verified hostname. This exact endpoint pin is required for writes; a `neon.tech` suffix alone does not establish project identity.
3. Run `npm run db:publish`. The runner requires the committed SQL and manifest to exactly match the generator/current registry, enforces verified TLS, executes the single transaction, and compares all stored catalog, sequence and appearance payloads with their expected digests.
4. Verify the public API with `ATLAS_DB_EXPECTATION_FILE=db/publications/appearances.json node scripts/test-deployment.mjs`. Allow the existing API cache (up to five minutes) to expire before diagnosing a stale result. Update `cloudflare/database-expectation.json` only after successful live publication and API verification.

Alternatively, run the complete SQL file as one script in the intended branch's Neon SQL editor, then verify the stored publication row and API payload digest. Do not run selected INSERT statements independently or weaken a failed precondition. SQL-editor execution does not perform the runner's endpoint-pin and artifact-integrity checks, so review those separately.

The committed migration is prepared for publication. Its existence is not evidence that the live database has been updated.
