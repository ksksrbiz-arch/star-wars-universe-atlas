# Map/warp workflow

Status: initial.

## Input

Read [map and motion](../../references/map-and-motion.md), [performance and tests](../../references/performance-and-tests.md), and [data.ts](../../../src/data.ts). Identify the affected renderer/state files in the current checkout before editing them.

| Load | Do not load |
|---|---|
| Affected camera, interaction, and state implementation | Full lore catalogs or unrelated media ingestion |

## Process

Agent judgment defines intended interaction and ownership. Implement frame interpolation independently of factual data. Validate pointer coordinates, cancellation, latest-request behavior, and fallback. Measure affected behavior in a browser.

## Output

Implementation diff, interaction evidence, actual measurements when taken, and remaining limitations.

## Completion

Projection is consistent, destinations remain reachable, travel can be skipped/canceled, reduced motion is respected, and controls stay readable.

## Stop conditions

Do not ship an unbounded animation, inaccessible canvas-only navigation, or unsupported performance claim. Isolate failures and retain a usable fallback.
