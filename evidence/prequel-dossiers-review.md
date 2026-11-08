# Prequel destination dossiers

Reviewed November 7, 2026. Four broad environmental dossiers extend the existing fourteen guides. These sources support habitat and local-setting descriptions, independently of film appearances or galaxy placement.

| Dossier | Primary sources | Original art treatment |
|---|---|---|
| Kamino | [Kamino](https://www.starwars.com/databank/kamino), [Tipoca City](https://www.starwars.com/databank/tipoca-city) | Blue ocean and broad storm-cloud bands; no city coordinates or measured weather. |
| Geonosis | [Geonosis](https://www.starwars.com/databank/geonosis), [droid factory](https://www.starwars.com/databank/geonosis-droid-factory) | Warm rocky motifs and an illustrative orbital ring, not an orbital model. |
| Utapau | [Utapau](https://www.starwars.com/databank/utapau) | Dry terrain and stylized sinkhole depressions; no counted or located cities. |
| Kashyyyk | [Kashyyyk](https://www.starwars.com/databank/kashyyyk), [Kachirho](https://www.starwars.com/databank/kachirho) | Dense canopy motifs and water accents; no mapped coastline or forest boundary. |

Kamino, Utapau and Kashyyyk remain unmapped textual destinations in this release. Geonosis retains its pre-existing mapped placement. Republic-era facilities and political conditions are qualified rather than presented as timeless. Original SVG artwork imports no third-party images, textures or audiovisual assets. Portraits retain visible illustration labels and accessible names; reduced-motion behavior is preserved.

## Checks

- `node scripts/test-world-dossiers.mjs`: passed for 18 dossiers and 40 distinct source pages, no invented coordinates or title associations.
- `npx tsc --noEmit`: passed after dossier/art changes.
- `scripts/test-prequel-dossiers.mjs`: focused browser coverage for four dossiers via search and Kamino via Episode II, at 1440/390/320 widths. Passed against the local development server on port 4174. Source links, keyboard disclosures, visible uncertainty, no arrival/watch mutations and one portrait/guide per destination were checked.

All four original portrait treatments were visually inspected, including phone-width renders. Screenshots are under `work/prequel-dossiers/`.

No physical-device performance claim; browser evidence uses Playwright Chromium/software WebGL.
- Full existing `test-dossier-experience.mjs` regression passed across all 18 dossiers at 1440/390/320 widths, including keyboard source disclosures, fallback, no overflow and unchanged watch state.
- `test-prequel-overlap.mjs` independently found missing reverse Clone Wars links on the film. After the root agent repaired Journey, the production preview at port 4175 passes forward/back navigation for the four overlapping chapters at 1440/390/320, preserving reveal gates, watch state and current map position. Labels retain parallel-story and non-interleaving caveats.
