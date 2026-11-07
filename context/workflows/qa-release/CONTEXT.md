# QA/release workflow

Status: initial.

## Input

Read [performance and tests](../../references/performance-and-tests.md), [product scope](../../references/product-scope.md), and the changed-file summary. Discover actual build/check commands from the current project configuration.

| Load | Do not load |
|---|---|
| Affected contracts, build configuration, current evidence | All historical research or unrelated workflows |

## Process

Run applicable checks, inspect browser behavior, and record viewport/device/build identity. Separate observed results from untested scenarios. Agent judgment evaluates whether evidence supports release claims.

## Output

Verification handoff with changes, commands/results, browser observations, unresolved limitations, and next action.

## Completion

Required applicable checks pass; any remaining risk is stated; deliverable is reachable. Deployment occurs only within existing authorization.

## Stop conditions

Do not label a failing build or unverified deployment complete. Do not claim physical-device tests from desktop emulation. Continue independent fixes when a dependent check is blocked.
