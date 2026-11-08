# Sequel trilogy setting dossiers

Reviewed November 8, 2026. Three new broad setting guides use official primary references and original SVG studies, separately from film-specific appearance evidence and map coordinates.

- [Jakku](https://www.starwars.com/databank/jakku): sandy wastes and old warship wrecks. [Niima Outpost](https://www.starwars.com/databank/niima-outpost) supports the settlement and salvage economy. Original dune/hull motifs identify no particular wreck, market layout or battle route.
- [Ahch-To](https://www.starwars.com/databank/ahch-to): oceans, caverns, island habitat and early Jedi history. [Ahch-To Jedi Temple](https://www.starwars.com/databank/ahch-to-jedi-temple) supports the temple locality. The original island/cliff study does not substitute the island for the whole world or reconstruct archaeology.
- [Exegol](https://www.starwars.com/databank/exegol): ancient Sith world. [Sith Citadel](https://www.starwars.com/databank/sith-citadel) supports barren plains, fissures and lightning around the sanctuary district. Original geometric forms and static lightning strokes introduce no flashes, wayfinder route, military diagram or measured terrain.

No external imagery, new dependencies, coordinates or travel geometry are added. Existing motion preferences, source links, illustrative captions and keyboard disclosures are preserved. Later character and battle outcomes are omitted from the broad guides.

Structural validation passes: 46 guides and 97 source pages. TypeScript passes. After registry integration, the focused three-guide browser suite passes at 1440, 390 and 320 pixels on port 4174. Checks cover source links, original-art labels, keyboard disclosure, reduced motion, unmapped-placement notices, no horizontal overflow and unchanged arrival/watch progress. Jakku at 320, Ahch-To at 390 and Exegol at 1440 were visually inspected; motifs and captions render correctly with the current styles. Nine screenshots are generated locally under `work/sequel-dossiers/`.

The full 46-guide browser suite also passes at all three widths: source links, keyboard disclosures, era/caveat text, original portraits, unfeatured fallback, unchanged watch progress, no film/episode-link leakage from broad guides and responsive layout. Its directory test uses the display-name prefix “Ahch” instead of replacing the meaningful hyphen with a space. Diff whitespace validation passes.
