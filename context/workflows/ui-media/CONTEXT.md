# UI/media workflow

Status: current contract for the deployed preview. `npm run check:icm` verifies the named `context/` paths, npm scripts and relative links.

## Input

Read [design system](../../references/design-system.md), [media policy](../../references/media-policy.md), [canon and sources](../../references/canon-and-sources.md), and only the selected view implementation, for example [Journey.tsx](../../../src/Journey.tsx), [Library.tsx](../../../src/Library.tsx), [LocationDossier.tsx](../../../src/LocationDossier.tsx), [WorldDirectory.tsx](../../../src/WorldDirectory.tsx) or [mediaAssets.ts](../../../src/mediaAssets.ts). Non-browser checks: `npm run test:media`, `npm run test:dossiers`. Browser checks (`npm run test:ui`, `npm run test:a11y`) need `ATLAS_URL` per [QA/release](../qa-release/CONTEXT.md).

| Load | Do not load |
|---|---|
| Affected layout, selected records, relevant media provenance | Unrelated renderer internals or complete provider catalogs |

## Process

Agent judgment checks hierarchy and asset meaning. Implement responsive layout, keyboard focus, source disclosure, and loading fallback. Verify phone/desktop behavior and text readability.

## Output

UI diff, any provenance changes, responsive evidence, and accessibility limitations.

## Completion

Controls and destination information are readable; illustrative assets are labeled; approved media has fallback; keyboard flow works.

## Stop conditions

Do not publish assets with an unresolved use basis or conceal important uncertainty. Continue layout work with original placeholders when imagery is unresolved.
