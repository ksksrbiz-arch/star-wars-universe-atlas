# Workflow router

Status: local platform prototype, November 7, 2026: 62 schematic worlds, 193 catalog items, five collection viewing sequences, and partial story/location links. This router scopes development; it does not certify current-batch browser validation.

| Task | Load | Do not load |
|---|---|---|
| World facts, chronology, story joins, sources or projection | [Data](context/workflows/data/CONTEXT.md) | Unrelated rendering implementation |
| Galaxy camera, picking, pan/zoom, warp | [Map/warp](context/workflows/map-warp/CONTEXT.md) | Full lore catalogs |
| Journey, library, dossiers, layout, typography, imagery | [UI/media](context/workflows/ui-media/CONTEXT.md) | Unrelated ingestion code |
| Validation, evidence, release | [QA/release](context/workflows/qa-release/CONTEXT.md) | All historical research |

Exclusion rule: do not load every workflow or reference by default. Read only the contract and evidence relevant to the requested change.

Start at [context/CONTEXT.md](context/CONTEXT.md). Keep workflow inputs scoped. Record a concise change/evidence/limitations handoff; use the same checked source revision for dependent work. Never claim a checker, deployment, or device test ran unless evidence exists.


