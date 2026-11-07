# Mapped-world expansion — November 7, 2026

Fourteen sourced destinations receive direct published-system grid placements. These additions change map availability, not episode-appearance evidence. The base registry had 62 worlds; integrating this module produces 76, including 27 reference-traced positions and 49 cell centers.

## Source checked

The [official Star Systems of the Galaxy appendix](https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf) was opened and its indexed rows read during this pass. Pages below use the document’s one-based printed page numbers. System, region and grid fields were matched directly; no sector name was mistaken for a system entry.

| Destination | Region | Grid | Page |
|---|---|---|---:|
| Abafar | Outer Rim Territories | O-6 | 1 |
| Adelphi | Outer Rim Territories | P-17 | 1 |
| Arcana | Outer Rim Territories | M-5 | 3 |
| Bothawui | Mid Rim | R-14 | 7 |
| Carlac | Outer Rim Territories | K-5 | 9 |
| Corellia | Core Worlds | M-11 | 11 |
| Lothal | Outer Rim Territories | U-7 | 32 |
| Lotho Minor | Outer Rim Territories | I-17 | 32 |
| Oba Diah | Outer Rim Territories | T-10 | 38 |
| Quarzite | Inner Rim | M-13 | 43 |
| Seatos | Outer Rim Territories | M-19 | 47 |
| Segra-Milo | Outer Rim Territories | R-7 | 47 |
| Quell | Outer Rim Territories | Q-6 | 43 |
| Ringo Vinda | Mid Rim | R-7 | 45 |

The appendix explicitly says systems are listed under commonly used names and does not enumerate every planet in each system. Consequently, these placements carry system-level cell-center qualifications. No offset is invented from the reference image, and no boundary, hyperspace trace, travel duration, physical distance or era-specific political condition is inferred.

## Identity checks and exclusions

- [Arcana](https://www.starwars.com/databank/arcana), [Seatos](https://www.starwars.com/databank/seatos), and [Lothal](https://www.starwars.com/databank/lothal) official Databank pages were also opened to corroborate the Ahsoka world identities. Episode links continue to rely on their own episode-specific sources.
- The appendix’s **Segra Milo** entry is normalized to the existing **Segra-Milo** ID/name. The [official Andor episode-eight highlights](https://www.starwars.com/news/andor-episode-8-narkina-5-highlights) were checked as a corroborating spelling/setting source. This is punctuation normalization, not a parent-system guess.
- Exact appendix searches did not find Kamino, Kalevala, or Skako Minor. They remain unplaced in this pass; no near-name match was substituted.
- A follow-up exact-name check found Quell and Ringo Vinda. The appendix lists Raxus Prime, not a direct Raxus match; its grid is not assigned to the Separatist capital.
- Peridea stays outside this galaxy map. Mystical/unnamed settings and moon/parent joins without separate support remain textual.
- All 14 additions have sourced relationships (Quell and Ringo Vinda are added by the concurrent episode-evidence pass). The color and globe rendering remain illustrative.

## Validation

Standalone checks verify 14 unique new IDs, no overlap with the 62-world baseline, exact existing relationship names, finite projection within [-1,1], and positions equal to `gridToDisplay(grid)`. The module contains no reference-image offsets. Root owns integration, expanded-count regressions, database publication, browser testing and deployment.
