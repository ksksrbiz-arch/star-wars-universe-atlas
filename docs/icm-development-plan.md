# ICM development plan — Star Wars Universe Atlas

Planning blueprint, November 7, 2026. Uses Jake Van Clief's Interpretable Context Methodology, adapted through Keith's existing kit. This document specifies a future repository layout; it does not claim that a runnable scaffold or checker has been installed.

ICM structures development context and reviewable handoffs. The browser application uses ordinary render/state/data modules. Filesystem workflows do not run its animation loop.

## Proposed structure

```text
AGENTS.md                         entry pointer + non-negotiable project rules
CLAUDE.md                         canonical compact workflow router
context/
  CONTEXT.md                      index of workflows and shared references
  references/
    product-scope.md              movies/shows, experience goals, exclusions
    design-system.md              tokens, layout, visual hierarchy
    map-and-motion.md             coordinates, camera, gestures, warp rules
    canon-and-sources.md          claims, certainty, editions, spoilers
    media-policy.md               delivery, provenance, placeholders
    performance-and-tests.md     budgets, fixtures, device matrix
  workflows/
    data/CONTEXT.md
    map-warp/CONTEXT.md
    ui-media/CONTEXT.md
    qa-release/CONTEXT.md
work/runs/<run-id>/
  manifest.json
  01-evidence.md
  02-spec.md
  03-implementation.md
  04-verification.md
  evidence/
docs/decisions/                   accepted architecture decisions + reasons
data/                            reviewed source records + schemas
scripts/icm-check.mjs             copied from existing kit
src/                             application modules
```

Use one canonical home per rule. Routers link to references, not copies of their prose. Run artifacts describe the current work; they do not become the design system automatically. No credentials or provider secrets in context or evidence.

The numbered handoffs describe order within a run. Small repairs can reuse valid upstream artifacts and record why stages are skipped; do not manufacture a five-step ceremony for a trivial correction.

## Scoped workflows

| Workflow | Input/load | Process | Output | Completion |
|---|---|---|---|---|
| Data | Relevant source claims, schema, coverage gaps, canon/spoiler reference | Resolve IDs; separate observed/inferred facts; validate reverse links, intervals and editions | Reviewed data diff, unresolved-claim list, validation evidence | Published claims have sources/certainty; no broken IDs; unresolved facts remain explicit |
| Map/warp | Map-and-motion contract, selected renderer/camera files, fixture, performance budget | Define interaction change; implement frame/state ownership; profile affected gestures | Change plus capture, state-transition evidence, frame-time results | Framing, cancel/back/skip, pinch, fallback and applicable budgets pass |
| UI/media | Design tokens, selected view, media manifest, spoiler rules | Compose view; select permitted assets; optimize and check layout/contrast | UI change, asset provenance updates, responsive captures | Chosen assets deliver with fallback; no spoiler leakage; keyboard/text-size/mobile checks pass |
| QA/release | Changed-file summary, relevant prior evidence, exact build/data versions | Run relevant checks; inspect regressions; generate reproducible release evidence | Verification report, remaining risks and release artifact | Required checks pass and limitations are stated; deployment only within existing authorization |

Each CONTEXT.md must contain Input, Process, Output, Completion, a Load / Do not load table, and specific stop conditions. Distinguish script work from agent judgment. The table above is the plan; actual source paths and command names are filled in when those files/scripts exist.

Examples of exclusions: map work skips full episode prose and provider ingestion code unless data geometry changes; catalog work skips shaders and build output; UI work loads only affected media records; QA reads evidence and affected contracts rather than all historical runs.

## Durable handoffs

Every manifest identifies run ID, task, active workflow/stage, status, source/base revision, input hashes, produced artifacts, validation results, unresolved items and next action. Human or agent edits to an upstream artifact invalidate dependent handoffs; rerun affected checks. Preserve source snapshots where permitted and checksums where practical.

Parallel agents may research independent topics or implement separate owned modules. Give each a scoped contract and isolated run output; a coordinating stage resolves conflicts and merges evidence. Shared schemas and integration files have one owner at a time. This is a project adaptation for the user's requested batch work, not a claim that ICM itself provides concurrent orchestration.

## Review and stop behavior

Outputs remain editable and reviewable. User steering can redirect art direction and scope; reversible authorized work proceeds without repeated approval questions. Stop dependent publication when essential evidence is missing, a requested action exceeds authorization, or a material unresolved choice would change the product. Record a precise question/blocker and continue independent work where possible. Do not turn generic approval placeholders into new mandatory gates.

## Structural checks and walk test

Reuse Keith's kit checker rather than writing a new framework. The kit currently requires a root router ≤80 lines, references ≤200 lines, routed contracts with their required sections, and valid referenced paths/commands. Confirm the actual checker at scaffold time. Do not cite nonexistent scripts as passed checks.

Fresh-agent walk test: from only repository files, can an agent identify the accepted scope, route a map gesture change, load the right contract, find the latest valid handoff, identify missing evidence, and report a concrete next action? Record the result and repairs. No chat history should be needed to infer what has or has not been verified.

## Sources

- [Jake Van Clief's upstream ICM](https://github.com/RinDig/Interpretable-Context-Methodology)
- [Keith's ICM kit](https://github.com/ksksrbiz-arch/icm-methodology/blob/main/README.md)
- [Kit workflow contract](https://github.com/ksksrbiz-arch/icm-methodology/blob/main/templates/workflow-CONTEXT.md)
- [Existing Walking Dead router](https://github.com/ksksrbiz-arch/walking-dead-universe-atlas/blob/main/CLAUDE.md)
- [Application architecture proposal](star-wars-architecture-plan.md)
