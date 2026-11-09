# Reviewed Databank expansion — 2026-11-09

## Bounded audit and coverage

This first reviewed expansion covers two worlds: Serenno and Naboo. The current context index documents 76 mapped worlds, 327 catalog items, 521 partial title/location relationships and an outdated 43-field-guide count; the actual module and dossier check contain 46 field guides. These are existing bounded counts, not a full universe census. No catalog, chronology, appearance relationship, coordinate, artwork or travel changes are introduced by this data module.

`worldDossiers.ts` already provides source-linked setting summaries, terrain and place highlights. `ImmersiveDossier.tsx` renders them inside existing destination panels; `WorldDirectory.tsx` reuses that component for selected worlds, and `LocationDossier.tsx` for unmapped locations. `WorldStories.tsx` separately protects unwatched title links. The new `databankGuides.ts` is a reviewed enrichment layer, separate from those episode relationships and the bulk ingestion inventory.

`docs/INGESTION.md` documents a community-operated Databank inventory (326 locations and 964 characters), plus other providers. Those inventory totals do not establish official-page verification or Atlas fact coverage. Historical research files were not accepted as source evidence for this expansion.

## Source review

Both official world entries were rechecked through web retrieval on November 9, 2026. Serenno lists mountains/plains and Separatist affiliation, describes forests and Dooku’s palace, and exposes four videos and a 15-image history gallery. No climate classification is specified. Naboo lists temperate climate, hills/plains/swamps/urban terrain, human and Gungan inhabitants, local affiliations and vehicles. Its fetched entry exposes two videos; no world gallery was observed.

Each record retains its own source URL. Connections supported by an individual entity entry: Count Dooku → Serenno; the Box → Dooku’s Serenno palace; Padmé → Naboo Queen/Senator; Gungans → native Naboo inhabitants; kaadu → native Naboo/Gungan mounts; fambaas → Gungan cargo/shield transport (also Onderon); N-1 → Naboo defense; Royal Starship → royal transport; Gian → security vehicle; bongo → Naboo underwater travel; Theed Royal Palace → Naboo government; Otoh Gunga → Lake Paonga. World-level affiliation and palace summaries cite the world entry directly. A related-card association is never promoted to a physical visit.

Official pages: [Serenno](https://www.starwars.com/databank/serenno), [Naboo](https://www.starwars.com/databank/naboo). Individual evidence URLs are stored alongside every connection in the module. No broad film/series tags become episode joins, visits, chronology or character routes.

## Media and limitations

Six video links and one gallery link are provided. The gallery remains within the official Serenno entry; no independent gallery URL was verified. All media records retain source, credit, link-only use basis and fallback URL. Official images/video are not downloaded, copied, embedded or used as procedural globe textures. Public access and responding asset URLs do not establish reuse permission. No supported embed authorization was established during this pass. The reviewed [Disney terms, section 2](https://disneytermsofuse.com/english/) reserve reproduction/distribution rights and restrict mirroring/framing; this batch uses ordinary links only and does not assert an image redistribution license.

The Serenno entry links Savage’s Training, The Box, Eliminate Her and Dooku Attacked by Nightsisters. The Savage’s Training target timed out during retrieval; its exact URL is verified from the official world page, with that page as fallback. Several other video targets returned official landing pages; retrieval timeouts occurred during the parallel reviews, so landing-page availability is not certified for every clip. Playback itself was not tested; several pages report a JavaScript requirement. Counts describe links visible during this review, not a complete official media inventory.

Relationships and media need explicit broad-spoiler reveal in the UI, independent of watched-title reveal, since their source pages contain wider plot material and no reliable per-episode visibility mapping was established. Mild climate and terrain facts can display as setting information. Inhabitants remain behind the relationship reveal. Source-informed globe artwork remains original illustrative art, not official planetary cartography.

Validation and release results are recorded separately by the release agent; this review does not claim browser playback, device testing, build success or deployment.
