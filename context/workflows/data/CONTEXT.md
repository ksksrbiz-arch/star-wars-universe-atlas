# Data workflow

Status: initial.

## Input

Read [canon and sources](../../references/canon-and-sources.md), [map and motion](../../references/map-and-motion.md), and [data.ts](../../../src/data.ts).

| Load | Do not load |
|---|---|
| Changed records, supporting sources, projection contract | Entire episode prose collections or renderer assets unrelated to the claim |

## Process

Agent judgment resolves identity and evidence. Deterministic checks verify IDs, required fields, finite coordinates, and projection bounds. Keep published grid distinct from schematic x/y and explain parent-system joins.

## Output

Reviewable data diff, source links, unresolved claims, and relevant validation results.

## Completion

Changed claims have evidence or explicit uncertainty; IDs are unique; existing consumers still compile; no unplaced world silently renders at origin.

## Stop conditions

Do not publish an unsupported identity join or precise position. Record the missing source and continue independent records. Do not request approval for routine reversible validation.
