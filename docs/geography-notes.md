# Geography coverage audit

Checked November 7, 2026. This is a deliberately selected **44-row location sample**, not an exhaustive screen-location inventory or an episode-by-episode appearance audit. Overlapping worlds count separately for each group. The CSV records source page numbers and distinguishes direct name matches from proposed parent-system joins.

## Results

| Group | Sample | Direct system-name match | Parent-system candidates | Supported parent relation | Other gaps |
|---|---:|---:|---:|---:|---|
| Original trilogy | 8 | 6 | 2 | 0 | Film-edition differences |
| Andor | 12 | 9 | 2 | 0 | Morlana One not found as a system entry |
| The Clone Wars (2008 series + film) | 12 | 10 | 0 | 0 | Kamino not found; Mortis needs a special spatial model |
| The Mandalorian | 12 | 8 | 3 | 1 | Resolve planet/moon/system joins |

These counts are not percentages of total geography coverage. A direct name match is evidence of an appendix entry, not proof of a particular on-screen appearance or continuity classification.

## What the source establishes

The currently linked [official appendix](https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf) has **61 pages**. Its introductory note explains that it lists star systems using familiar names and may list only one prominent planet in a system. Its grid cells therefore do not establish exact planetary positions. The [official map page](https://www.starwars.com/star-wars-galaxy-map) supplies the source context. This audit is reference research, not a license to redistribute the map artwork or bulk source dataset.

## Gaps to fill

1. **Parent-child modeling.** Yavin 4, Endor's forest moon, Narkina 5, Arvala-7, Plazir-15, and Kalevala cannot simply be treated as independently positioned system entries. The CSV conservatively labels these joins candidates. [Trask's official Databank entry](https://www.starwars.com/databank/trask) explicitly identifies its parent as Kol Iben, so that relationship is supported. Kalevala's Mandalore-system relationship has a [secondary research lead](https://starwars.fandom.com/wiki/Kalevala) but was not primary-source-verified here.
2. **Morlana One.** An official [Databank entry](https://www.starwars.com/databank/morlana-one) exists, but its system name was not found in the checked appendix. Morlana occurs as a subsector label alongside Ferrix; that is not permission to place Morlana One at Ferrix's grid.
3. **Kamino.** An official [Databank entry](https://www.starwars.com/databank/kamino) exists, but no Kamino text match was found in this appendix. This is an appendix coverage gap, not a claim that no geographic information exists elsewhere.
4. **Mortis.** The official [Databank description](https://www.starwars.com/databank/mortis) treats it as an ethereal realm and describes an encounter with a monolith in Chrelythiumn. Keep encounter location and realm separate; do not render a made-up ordinary planetary coordinate.
5. **Edition-aware original trilogy locations.** Coruscant in this sample refers to the revised Return of the Jedi celebration sequence, not the original theatrical cut. A complete audit must distinguish editions and check other added epilogue worlds such as Naboo. Film IDs alone will not encode the applicable cut.
6. **Mobile installations.** Death Stars are not planets or fixed galaxy markers. A story-event position should represent where a station is at that point; location relationships and journeys must not silently treat its home system as permanent. The official [Death Star entry](https://www.starwars.com/databank/death-star) discusses its construction above Geonosis and its destruction of Alderaan; the [Death Star II entry](https://www.starwars.com/databank/death-star-ii) places construction near Endor. Moving ships, orbital scenes, and unnamed space locations need the same distinction.
7. **Episode appearances remain unbuilt.** Every place must still be joined to the exact film/episode and, where needed, scene/event that supports its presence. The sample does not demonstrate complete journeys, routes, distances, travel times, or exact dates.

## Recommended implementation

Use separate `system`, `planet`, `moon`, `surface_place`, `station`, and `realm` entity types. Store `grid_reference`, `coordinate_precision`, `parent_location_id`, and source provenance separately from display `x/y`. Unplaced entities remain available in search and detail pages. Any grid-center or within-cell display offset is a presentation choice and should be labeled approximate. Do not inherit coordinates solely from a similar name.

The source appendix makes a strong starting reference for the sampled major worlds. The remaining work is mostly evidence-backed identity resolution, edition-specific appearance links, and handling places that do not belong on a conventional galaxy map.
