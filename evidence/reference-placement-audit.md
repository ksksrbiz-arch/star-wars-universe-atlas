# Reference placement audit — November 7, 2026

The user-supplied 4000×4000 JPEG is the visual reference. The existing official appendix remains the authority for each system grid. The companion swgalaxymap.com URL is a separate reference, not asserted to be the source of this JPEG. The image has a cartography/design credit footer and visible DK branding. Edition/date and continuity are not independently established by the filename.

## Scope and result

The current registry has 62 unique mapped destinations. Twenty-seven legible symbols were approximately traced, including all eight main destinations; the remaining 35 retain their published cell-center positions and were not individually image-verified. No new worlds or official grid changes are introduced. Image placements do not verify story appearances.

Hoth and Bespin remain K-18 but now have distinct traced symbol centers, Hoth slightly south of Bespin. Tatooine and Geonosis similarly remain R-16 with separate symbol centers. Yavin 4 still uses the Yavin system symbol, not an independently measured moon position. Endor remains its existing parent-system cell center, not a new trace.

Coruscant's symbol center is approximately 2px west of the L-9 boundary, and Mina-Rau approximately 1px north of O-6. These tiny symbol/grid-edge ambiguities are explicitly annotated and constrained inside their existing official cells. Maridun is also close enough to its cell edge to receive the same annotation. No larger trace-versus-grid conflict occurred among the 27 selected symbols. This is not an assertion that all source editions agree.

## Calibration

Image dimensions were read as 4000×4000. Grid lines were checked directly from pixel intensity in uncluttered image margins: vertical lines include 1782,1928,2073,2219,2364px; horizontal lines include 2070,2215,2361px. Approximate average pitch is145.6px, and K-11 center is(1855,2288). World-render coordinates: X=(pixelX−1855)/145.6, Y=(2288−pixelY)/145.6. The application's normalized x/y divide these by10. Symbol centers were manually read from magnified crops, so the integer pixels below are digitization inputs, not accuracy claims. Typical visual selection uncertainty is several pixels.

The exported helper preserves grid, ID, source URL, descriptions, and other records. Existing non-coordinate caveats remain, and an explicit trace note is added. Traces farther than about6px beyond their published cells are rejected. Near-edge traces are constrained within0.49cell of the center. All consumers should receive the same transformed World records, including minimap and camera.

## Traced anchors

| ID | Published grid | Source pixel center | Normalized image point (u,v) |
|---|---|---|---|
| tatooine | R-16 | 2863, 3054 | 0.71575, 0.76350 |
| alderaan | M-10 | 2119, 2077 | 0.52975, 0.51925 |
| yavin | P-6 | 2597, 1489 | 0.64925, 0.37225 |
| hoth | K-18 | 1786, 3325 | 0.44650, 0.83125 |
| bespin | K-18 | 1786, 3314 | 0.44650, 0.82850 |
| dagobah | M-19 | 2166, 3458 | 0.54150, 0.86450 |
| coruscant | L-9 | 1926, 2064 | 0.48150, 0.51600 |
| mandalore | O-7 | 2457, 1670 | 0.61425, 0.41750 |
| chandrila | L-9 | 2010, 2011 | 0.50250, 0.50275 |
| tython | K-10 | 1918, 2181 | 0.47950, 0.54525 |
| onderon | O-9 | 2472, 2044 | 0.61800, 0.51100 |
| umbara | P-10 | 2526, 2103 | 0.63150, 0.52575 |
| cato-neimoidia | N-11 | 2245, 2267 | 0.56125, 0.56675 |
| malastare | N-16 | 2229, 3065 | 0.55725, 0.76625 |
| naboo | O-17 | 2415, 3100 | 0.60375, 0.77500 |
| mustafar | L-19 | 1953, 3508 | 0.48825, 0.87700 |
| nevarro | K-20 | 1874, 3575 | 0.46850, 0.89375 |
| sorgan | Q-17 | 2733, 3173 | 0.68325, 0.79325 |
| ryloth | R-17 | 2907, 3181 | 0.72675, 0.79525 |
| geonosis | R-16 | 2851, 3064 | 0.71275, 0.76600 |
| rodia | R-16 | 2812, 3038 | 0.70300, 0.75950 |
| christophsis | Q-16 | 2773, 3060 | 0.69325, 0.76500 |
| pantora | P-19 | 2557, 3433 | 0.63925, 0.85825 |
| dathomir | O-6 | 2386, 1539 | 0.59650, 0.38475 |
| aldhani | M-6 | 2123, 1522 | 0.53075, 0.38050 |
| mina-rau | O-6 | 2409, 1486 | 0.60225, 0.37150 |
| maridun | Q-6 | 2657, 1554 | 0.66425, 0.38850 |

## Validation

Validated all 62 IDs are unique, all 27 trace IDs exist with matching published grids, output coordinates are finite and remain within their original cells, and the 35 non-traced records are unchanged by identity. The eight main destinations are all traced. Renderer integration and browser checks belong to the parent implementation pass.
