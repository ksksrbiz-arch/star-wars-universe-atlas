# Media provenance and label audit — November 7, 2026

## NASA starfield

The single external asset family is NASA SVS 4856, [An Elsewhere Starfield](https://svs.gsfc.nasa.gov/4856/), a randomized astronomical visualization offered as a backdrop for views far from Earth. The item credits NASA’s Scientific Visualization Studio. Its background uses Gaia DR2 and randomized Tycho 2 stars; the metadata retains those dataset credits too. It is not a Star Wars screenshot, fictional surface map, or source for atlas geography.

The [SVS reuse guidance](https://svs.gsfc.nasa.gov/help/) states: “All of our content is in the public domain (unless otherwise noted), meaning that it is free to download, use, and redistribute for whatever purposes you see fit.” No item-specific restriction is shown for the selected still image. NASA media guidance does not imply endorsement; no logos, music, or promotional Star Wars imagery is imported.

Downloaded the official 4096×2048 EXR over verified HTTPS; SHA-256 `e388901e81b7fc730baed87b07bfbf3f8cf30548e238e482f232b853348d13a4`. The source stays in ignored `work/media`, not the shipped bundle. The provider 1024×512 JPEG preview is unchanged. FFmpeg converts linear RGB to sRGB for 2048×1024 and 4096×2048 WebP derivatives. This is color-space/format conversion and resampling, without new scene elements. `scripts/prepare-nasa-starfield.sh` reproduces the process with pinned source checksums. `src/mediaAssets.ts` records individual dimensions, bytes, hashes, source, credit, rights basis, interpretation and fallback. Assets live under `/visuals/`, because `/media/` belongs to the Worker’s R2 route.

The compact preview is 38,031 bytes; the 2k derivative 143,878 bytes; the 4k derivative 1,617,056 bytes. The UI should use the preview on narrow screens and 2k on ordinary desktops; 4k is for very large displays or explicit viewing. Both derivative files and provider preview were decoded and visually inspected. Missing media falls back to the existing gradient/procedural galaxy; images do not carry map controls or essential text.

## Representative world-label audit

This is a ten-label check, not a claim that all 62 mapped destinations were independently re-audited. Reviewed official Databank page titles and, for moon distinctions, their article descriptions:

- [Tatooine](https://www.starwars.com/databank/tatooine), [Alderaan](https://www.starwars.com/databank/alderaan), [Hoth](https://www.starwars.com/databank/hoth), [Dagobah](https://www.starwars.com/databank/dagobah), [Bespin](https://www.starwars.com/databank/bespin), and [Coruscant](https://www.starwars.com/databank/coruscant): existing display spellings agree.
- [Yavin 4](https://www.starwars.com/databank/yavin-4): official title is “Yavin 4” with a space between name and numeral; existing display is `Yavin 4` although internal ID is `yavin`. The article identifies a moon of gas giant Yavin. No identity rename or coordinate change.
- [Endor](https://www.starwars.com/databank/endor): article explicitly says “forest moon of Endor”; existing `Endor (forest moon)` disambiguates the inhabited moon from its parent system placement.
- [Mon Cala](https://www.starwars.com/databank/mon-cala): page title matches; article lists Mon Calamari and Dac as alternative names. No speculative alias replacement.
- [D’Qar](https://www.starwars.com/databank/d-qar): page title uses straight apostrophe and body uses typographic apostrophe; existing `D’Qar` is consistent. Its internal ID `dqar` is not rendered as a display name.

No factual spelling changes were needed. Label typography and collision handling are presentation work, not changes to geography, identity, or appearance evidence.
