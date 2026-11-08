# The Bad Batch season two setting dossiers

Reviewed November 7, 2026. Three broad setting guides use original SVG studies and primary sources, separately from episode appearance joins and map placement.

- [Pabu](https://www.starwars.com/databank/pabu): an island village and blue sea on a small planet. [Pabu Archium](https://www.starwars.com/databank/pabu-archium) supports the cultural collection and Upper Pabu setting. The original island/terraces motif does not turn the whole planet into an ocean world or reconstruct village routes. Later plot outcomes are omitted.
- [Serenno](https://www.starwars.com/databank/serenno): forests, mountains, plains and a cliffside estate. The source primarily describes the Clone Wars; the guide prominently qualifies that era and does not imply intact postwar architecture or present ownership. The original green-ridge/estate motif is not a damage assessment.
- [Ipsidon](https://www.starwars.com/databank/ipsidon): dusty red rock and scorched terrain. [Ipsium](https://www.starwars.com/databank/ipsium) supports the mineral/resource distinction; [Ipsidon spaceport](https://www.starwars.com/databank/ipsidon-spaceport) supports the abandoned surface hub rather than an orbital station. Red/charcoal rock and golden mineral accents are illustrative, not resource mapping.

No external imagery, dependencies, new map coordinates or travel geometry are added. Existing motion preferences, keyboard disclosure, illustrative labels and source links are retained.

Structural validation passes: 35 guides and 76 source pages. TypeScript passes. After identity/connection integration, the focused three-guide browser suite passes at 1440, 390 and 320 pixels on both development port 4174 and production preview 4175. The test explicitly selects World/Location results because “Pabu” also names an episode. It checks source links, illustrative labels, reduced motion, keyboard disclosure, placement notices, no overflow and unchanged arrival/watch progress. Pabu at 320, Serenno at 390 and Ipsidon at 1440 were visually inspected. Nine screenshots per run are generated locally under `work/bad-batch-season-two-dossiers/` and `work/bad-batch-season-two-dossiers-production/`.

The full 35-guide browser suite also passes at all three widths on port 4174: source links, keyboard disclosures, era/caveat text, original portraits, unfeatured fallback, unchanged watch progress, no episode-link leakage from broad guides and responsive layout.
