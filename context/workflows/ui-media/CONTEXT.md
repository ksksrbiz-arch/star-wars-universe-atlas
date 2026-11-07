# UI/media workflow

Status: initial.

## Input

Read [design system](../../references/design-system.md), [media policy](../../references/media-policy.md), [canon and sources](../../references/canon-and-sources.md), and the selected view implementation.

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
