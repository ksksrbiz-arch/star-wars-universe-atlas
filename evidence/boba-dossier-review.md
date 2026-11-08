# Book of Boba Fett setting dossiers

Reviewed November 7, 2026. Broad setting claims are separate from the title-specific appearances maintained by the data module.

## Source review

- [Glavis Ringworld](https://www.starwars.com/databank/glavis-ringworld): artificial ribbon encircling a small star, urban habitat, sunlight as power source, moving eclipse plates producing artificial night. Supports station identity and structural description, not map coordinates, proportions, plate count or engineering dimensions.
- [Garsa’s Sanctuary](https://www.starwars.com/databank/garsa-s-sanctuary): Mos Espa establishment with music, gambling and hospitality operated by Garsa Fwip. Added as an era-qualified Tatooine setting; no later plot outcome disclosed.
- [Boba Fett’s Palace](https://www.starwars.com/databank/boba-fett-s-palace): former Jabba fortress used as Fett’s headquarters after the Empire’s fall, with guests and tribute received in its throne room. Does not imply its ownership is timeless.

## Presentation

Glavis has an original, static SVG station study, not a planetary globe. The ring, central star and stylized plates communicate the sourced structural idea; their proportions and layout are illustrative. No external artwork, film stills, fonts or textures were imported. Accessible SVG labeling, visible illustration caveats, structural source links and native keyboard disclosures are included. The depiction does not animate, including under reduced motion.

Registered unmapped locations can display the same dossier from Journey, search inspection and the directory. The directory suppresses the duplicate location heading and does not insert a second field guide. Inspecting a file does not create a map placement or move the current world.

## Verification

- `node scripts/test-world-dossiers.mjs`: passed for 14 dossiers and 33 distinct source pages; validates source hosts, stable IDs, uncertainty text and no invented coordinate fields.
- `scripts/test-station-dossier.mjs`: browser acceptance covers Glavis in Journey and Directory at 1440/390/320 widths, keyboard disclosure, accessible artwork, structure source, no globe, no watch mutation, no map movement or horizontal overflow. Passed against the local development server at port 4174 using software Chromium; no physical-device performance claim.
- `scripts/test-dossier-experience.mjs`: passed across all 14 dossiers at 1440/390/320 widths; updated for station structure labeling and Glavis search name.

This review does not claim physical-device performance or comprehensive spoiler protection. Broad setting names and the palace’s era-qualified ownership are visible setting information.

- `npx tsc --noEmit`: passed after the data agent supplied the station identity.
- Original station artwork visually inspected at mobile width. Journey-to-Destination initially retained old panel scroll; the App owner repaired it. The bridge browser check now asserts the new destination begins at scroll position zero.

## Internal bridge and unplaced school verification

`ATLAS_URL=http://localhost:4174 node scripts/test-boba-bridge-ui.mjs` passed in software Chromium at 1440, 390 and 320 px widths after integration repairs. The test follows the Mandalorian season 2 finale link into Boba Fett Chapter 5, marks only Chapter 5 watched and advances to Chapter 6, then uses the bridge to Chapter 7 and the Mandalorian season 3 premiere. All newly entered titles keep their locations hidden until explicit reveal; only `boba-fett-s01e05` is stored as watched. No cross-collection watch status is copied.

Luke’s Jedi school is shown as a surface site with no verified parent planet or coordinate. Its map button is disabled, its location file has no planet globe or warp action, and inspecting it leaves the current location at Tatooine. Glavis destination inspection begins at the top after the scroll-reset fix. Internal story-to-story bridges now preserve the expanded mobile sheet; the test checks that it stays open without reopening it.

The Mandalorian season 2 finale itself remains an existing title without a sourced location join; this test does not invent one to enable the bridge. This is browser interaction evidence, not physical-device performance evidence.
