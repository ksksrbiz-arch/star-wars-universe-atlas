# Atlas work recovery — 2026-11-09

Scope: Star Wars Universe Atlas only. Publication and pushing main were authorized by the user.

## Source and chat audit

Four matching Git repositories were found under D:/Codex, plus one additional registered worktree. C:/Users/keith/Documents/Codex is a junction to D:/Codex, not another independent set of repositories. C:/Users/keith/.codex/worktrees was absent. No unpushed branch commits were found after fetching the target repository in the older checkouts.

| Chat / workspace | Finding |
| --- | --- |
| Scope Star Wars universe atlas — `01a1b763-9fa6-7022-8760-addc9773fd29`; `2026-11-07/ksksrbiz-arch-walking-dead-universe-atlas/outputs/star-wars-prototype` | Source clean and already published. Three ignored research reviews from an interrupted video-research turn recovered under `docs/research/video-EsUrROJanSo`. Unverified leads only; raw transcripts excluded. |
| Repair Star Wars Atlas gaps — `01a1b7e5-f3fc-7d03-a391-1c421e939ec7`; `2026-11-07/https-github-com-ksksrbiz-arch-star/work/star-wars-universe-atlas` | Clean. Branch `fix/batch-bug-sweep` source already merged through PR #2. Local environment files left untouched. |
| Improve Star Wars Atlas UI — `01a1b7e6-c6fb-7ae3-b703-85c041bbf911`; `2026-11-07/https-github-com-ksksrbiz-arch-star-2/work/star-wars-universe-atlas` and `work/atlas-live-audit` | Source previously merged through PRs #1 and #3. Eleven modified historical screenshot/result files copied to dated evidence folders without replacing current release evidence. Original checkouts left intact. |
| Current artwork workspace — `2026-11-08/please-continue-this-conversation-frome-here/work/atlas` | Artwork source and correction work already pushed through `ee9c1c5`. Fast-forwarded to `4e47478`, retaining merged phone navigation PR #28 and browser-script repair PR #29. |
| Set up star-wars-universe-atlas — `01a1b7f9-9804-764c-be65-0bf1c3d49004`, durable host | Previously exported draft recovered and integrated. Fresh chat access failed during this audit, so current cloud-only state is not certified. Verified recovered archive: 95,059 bytes, SHA-256 `7e4841dd00dd1c7aca6defe22d7f46104eca5a243ec3e67a76d23bb9a6683e40`. |

Recent Atlas chats and local archived-chat listings were checked. No open GitHub pull requests remained at the final query. Squash-merged historical branches were not replayed merely because their original commit IDs differ from main.

## Verification of combined source at 4e47478

- TypeScript/Vite production build, Worker build and ICM structure check passed. Existing large-bundle warnings remain.
- Guided-journey browser script passed, including 1440/390/320 widths, keyboard focus, dismiss/restart, ordered collection, first-unwatched and no unwanted reveal/watch changes.
- World-story-search browser script passed spoiler-safe search, collection intersection, reset, mobile overflow, deep link and independent reveal.
- Live Serenno card check passed at 1440/390 widths: 1024-pixel texture, orbital-view action, no legacy SVG portrait and sourced landscape text.
- All eight deployed asset hashes matched the local production build. Results copied into `evidence/recovered-2026-11-09/current-release`.

Earlier artwork-release evidence covers corrected profiles, 2K/4K orbital viewing, fallback behavior, galaxy/flight integration and public catalog consistency. These are desktop Chromium and emulated-phone checks, not physical-phone or measured device-FPS certification. Planet surfaces remain reference-informed illustrative geography.

This recovery adds documentation and historical evidence only. It does not promote unfinished research into product data or modify unrelated projects.
