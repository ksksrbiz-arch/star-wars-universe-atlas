# QA/release workflow

Status: current contract for the deployed preview. `npm run check:icm` verifies the named `context/` paths, npm scripts and relative links.

## Input

Read [performance and tests](../../references/performance-and-tests.md), [product scope](../../references/product-scope.md), and the changed-file summary. Commands come from `package.json` scripts and `.github/workflows/ci.yml`; run `npm ci` first in a fresh checkout.

| Load | Do not load |
|---|---|
| Affected contracts, `package.json` scripts, current evidence for the touched batch, [deployment notes](../../../docs/DEPLOYMENT.md) when releasing | All historical research or unrelated workflows |

## Commands

Build and structure (no browser needed):

- `npm run build` (TypeScript check plus Vite build), then `npm run build:worker`.
- `npm run check:icm` (router/AGENTS byte and line caps, workflow contracts, named paths and scripts).

Non-browser tests (a snapshot of the steps in `.github/workflows/ci.yml`; if they differ, the workflow file and `package.json` win): `npm run test:catalog`, `test:connections`, `test:chronology`, `test:journey-data`, `test:reference-data`, `test:worker`, `test:media`, `test:dossiers`, `test:rogue-one`, `test:reconciled-worlds`, `test:boba-fett`, `test:prequels`, and `node scripts/test-appearance-publication.mjs`. Per-batch scripts such as `npm run test:bad-batch-season-3` are listed in the [data workflow](../data/CONTEXT.md). CI is manual-dispatch only; Cloudflare Builds runs the automatic checks (see [deployment notes](../../../docs/DEPLOYMENT.md)).

Browser tests (Playwright/Chromium): start a build preview with `npm run build && npm run preview -- --port 4173`, then run for example `ATLAS_URL=http://localhost:4173 npm run test:ui`. Most `test-*.mjs` browser scripts read `ATLAS_URL`; a few default to port 4174 or 4175 when it is unset, so always set it explicitly. Against the live preview, set `ATLAS_URL` to the deployed origin and see `npm run verify:live-publication`.

Content is visible by default. `npm run test:content-visibility` checks fresh-browser images/details/locations, optional spoiler protection, reload and cross-tab persistence, storage failure, and unchanged watch progress. Legacy reveal-flow tests explicitly opt into protection through [the testing helper](../../../scripts/lib-spoiler-testing.mjs); they exercise the optional mode rather than the default experience.

## Process

Run the applicable commands above, inspect browser behavior, and record viewport/device/build identity (source revision, `ATLAS_URL`, viewport). Separate observed results from untested scenarios. Agent judgment evaluates whether evidence supports release claims.

## Output

Verification handoff with changes, commands/results, browser observations, unresolved limitations, and next action.

## Completion

Required applicable checks pass; any remaining risk is stated; deliverable is reachable. Deployment occurs only within existing authorization.

## Stop conditions

Do not label a failing build or unverified deployment complete. Do not claim physical-device tests from desktop emulation. Continue independent fixes when a dependent check is blocked.
