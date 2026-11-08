# Workflow router

Status: deployed platform preview, November 8, 2026 (counts and current evidence: [context/CONTEXT.md](context/CONTEXT.md)). This router scopes development; it does not certify current-batch browser validation.

| Task | Load | Do not load |
|---|---|---|
| World facts, chronology, story joins, sources or projection | [Data](context/workflows/data/CONTEXT.md) | Unrelated rendering implementation |
| Galaxy camera, picking, pan/zoom, warp | [Map/warp](context/workflows/map-warp/CONTEXT.md) | Full lore catalogs |
| Journey, library, dossiers, layout, typography, imagery | [UI/media](context/workflows/ui-media/CONTEXT.md) | Unrelated ingestion code |
| Validation, evidence, release | [QA/release](context/workflows/qa-release/CONTEXT.md) | All historical research |

Exclusion rule: do not load every workflow or reference by default. Read only the contract and evidence relevant to the requested change. Per-batch release notes live in [release history](evidence/release-history.md); read it before extending a series or sequence (ID prefixes are preserved, no invented episodes or coordinates).

Start at [context/CONTEXT.md](context/CONTEXT.md). Keep workflow inputs scoped. Record a concise change/evidence/limitations handoff; use the same checked source revision for dependent work. Never claim a checker, deployment, or device test ran unless evidence exists.
