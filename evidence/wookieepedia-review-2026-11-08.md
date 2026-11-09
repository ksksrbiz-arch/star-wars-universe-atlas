# Star Wars Atlas — Canon reference review

Reviewed November 8, 2026. All **76 mapped worlds** were checked against the [Wookieepedia Canon index](https://starwars.fandom.com/wiki/List_of_planets) and individual articles through Chrome on the user's PC. Moons were checked separately. This review covers identity and broad environmental cues, not every lore fact, episode appearance or rendered pixel. Wookieepedia is a secondary source; its cited books were not independently inspected.

## Corrections and distinctions

- **Bothawui:** its [Canon article](https://starwars.fandom.com/wiki/Bothawui) classifies it as a gas giant, citing *Star Wars: Galactic Atlas*. The recovered draft now uses a gas treatment for Bothawui.
- **Quarzite:** the [article](https://starwars.fandom.com/wiki/Quarzite) supplies a grey-cloud orbital appearance with violet flashes, citing *Build the Millennium Falcon 66*. Its purple crystals belong underground. A clouded original illustration is now supportable, with static accents rather than flashing effects.
- **Pantora:** a marshy moon, not icy Orto Plutonia. The recovered draft now uses a terrestrial marsh treatment with no ice coverage.
- **Karthon and Rugosa:** moons. Endor here is the forest moon, distinct from the gas giant in the planet index.
- **Quell:** classified as terrestrial; terrain below its cloud cover remains unresolved in this review. Physical class and rendering treatment are separate fields.
- **Tython:** keep **K-10**. Its individual article explains that newer maps and the 2025 appendix supersede the list's L-10 placement.
- **Anaxes:** retain the atlas's Outer Rim placement pending any broader geography update. The individual article agrees; the index's Core Worlds label is inconsistent. Intact Anaxes and later Fort Anaxes debris are separate identities.
- **Teth:** individual article places the planet in **Wild Space**, while the current atlas uses an Outer Rim system-region label. The sector straddles both. Flag this for an explicitly sourced planet/system-region change; do not silently move its U-12 grid.
- **Nal Hutta and Toydaria:** Hutt Space can overlap radial regions. Different region labels alone do not prove a coordinate error.
- **Mandalore, Mustafar, Ilum and Kenari:** require era qualifications. Local environments and later changes must not become timeless planet-wide facts.

## What changed locally

Based on repository commit `ef36665`, the local patch adds explicit identity/source notes for Karthon, Rugosa, Endor, Bothawui and Quarzite. Existing IDs, map coordinates, catalog items and story associations are preserved. The review JSON contains one entry per mapped world.

## Completed local integration

The original cloud draft was recovered and checksum-verified, then integrated with newer sequel content. Bothawui, Quarzite, Pantora, Quell and Teth treatments were corrected. Profile, renderer, desktop/phone-layout, fallback, keyboard, cancellation and 2K/4K orbital checks passed locally. These are software Chromium emulations, not physical-device measurements. Original procedural geography remains illustrative. Publication is separate from merging.

## World-by-world review

| World | Identity | Supported appearance cues | Qualifications |
|---|---|---|---|
| [Tatooine](https://starwars.fandom.com/wiki/Tatooine) | planet | Sand, rocky bluffs, canyons and mountains | Hot arid world; no broad oceans in the orbital treatment. |
| [Alderaan](https://starwars.fandom.com/wiki/Alderaan) | planet | Forests, plains and mountains | Terrestrial world; remove gas bands. Coastlines and mountain placement remain illustrative. |
| [Yavin 4](https://starwars.fandom.com/wiki/Yavin_4) | moon | Jungle canopy and humid cloud | Yavin 4, not the red parent gas giant Yavin Prime. |
| [Hoth](https://starwars.fandom.com/wiki/Hoth) | planet | Ice plains, glaciers, mountains and frozen seas | Frigid; avoid exposed temperate land. |
| [Dagobah](https://starwars.fandom.com/wiki/Dagobah) | planet | Swamps, bogs, jungle and heavy fog | Hot humid atmosphere; surface visibility limited by cloud and mist. |
| [Bespin](https://starwars.fandom.com/wiki/Bespin) | planet | Gas giant with extensive cloud layers | No conventional solid surface; breathable life stratum does not describe the whole atmosphere. |
| [Coruscant](https://starwars.fandom.com/wiki/Coruscant) | planet | Planet-spanning city structures | Historical mountains/oceans must not become modern exposed continents. |
| [Mandalore](https://starwars.fandom.com/wiki/Mandalore) | planet | Desert and domed cities; later glass, crystals and storms | Era-dependent. Do not blend historical forests, pre-Purge deserts and post-Purge devastation without a label. |
| [Endor (forest moon)](https://starwars.fandom.com/wiki/Endor) | moon | Forests, savannas, mountains and plains | Forest moon; the index's Endor planet is a separate gas giant. |
| [Ferrix](https://starwars.fandom.com/wiki/Ferrix) | planet | Salvage areas, cities, mountains, mesas and oceans | Industrial sites are local; do not infer an entirely industrial globe. |
| [Aldhani](https://starwars.fandom.com/wiki/Aldhani) | planet | Grassy highlands, mountains and valleys | Temperate; the atmospheric Eye is a distinct event, not permanent global lighting. |
| [Niamos](https://starwars.fandom.com/wiki/Niamos) | planet | Beaches and oceans | Terrestrial coastal world, not a gas giant. |
| [Kenari](https://starwars.fandom.com/wiki/Kenari) | planet | Forests, meadows and mining wastelands | Breathable appearance-era atmosphere and later reported toxicity require an era/source qualifier. |
| [Ghorman](https://starwars.fandom.com/wiki/Ghorman) | planet | Forests, mountains, valleys and plains | Local settlement imagery is not planet-wide urban coverage. |
| [Mina-Rau](https://starwars.fandom.com/wiki/Mina-Rau) | planet | Fields, grasslands, hills and lakes | Farmland motif; no measured global land-water fraction established by this review. |
| [Chandrila](https://starwars.fandom.com/wiki/Chandrila) | planet | Rolling hills and calm seas | Temperate; preserve distinction from city-covered Coruscant. |
| [Dantooine](https://starwars.fandom.com/wiki/Dantooine) | planet | Grasslands, forests, mountains, rivers and oceans | Mixed terrestrial terrain rather than a single jungle texture. |
| [Christophsis](https://starwars.fandom.com/wiki/Christophsis) | planet | Crystalline formations | Crystalline geography; city layouts and crystal placement remain illustrative. |
| [Teth](https://starwars.fandom.com/wiki/Teth) | planet | Jungle lowlands, towering mesas and mist | Purple/mauve atmospheric appearance; planet described as Wild Space, unlike atlas system-region label. |
| [Ryloth](https://starwars.fandom.com/wiki/Ryloth) | planet | Deserts, jungles, mesas, valleys and volcanoes | Mixed terrain; do not import Legends-only global climate assumptions. |
| [Geonosis](https://starwars.fandom.com/wiki/Geonosis) | planet | Arid deserts, mesas and mountains | Rocky desert world; orbital rings are separate from surface bands. |
| [Nevarro](https://starwars.fandom.com/wiki/Nevarro) | planet | Ashen volcanic and rocky ground | Settlements change across eras; no uniformly molten globe implied. |
| [Sorgan](https://starwars.fandom.com/wiki/Sorgan) | planet | Conifer forests, grasslands, wetlands and lakes | Wet agricultural habitat; do not turn the whole globe into an ocean. |
| [Corvus](https://starwars.fandom.com/wiki/Corvus) | planet | Forest, foothills and damaged cracked ground | Calodan-area damage is local; avoid a globally dead-forest claim. |
| [Tython](https://starwars.fandom.com/wiki/Tython) | planet | Forests, grasslands, mountains and a polar ice cap | Keep K-10: individual article explains the newer placement versus the list's older L-10. |
| [Morak](https://starwars.fandom.com/wiki/Morak) | planet | Rainforests, mountains, rivers and freshwater archipelagos | Warm terrestrial world. |
| [Maldo Kreis](https://starwars.fandom.com/wiki/Maldo_Kreis) | planet | Ice and frozen canyons | Frigid terrestrial world. |
| [Aleen](https://starwars.fandom.com/wiki/Aleen) | planet | Desert plains, rocky mesas, isolated forests and underground caverns | Separate breathable surface air from the non-oxygen underworld; underground light is not orbital surface color. |
| [Anaxes](https://starwars.fandom.com/wiki/Anaxes) | planet | Forests, jungles, canyons and valleys | Intact Clone Wars world is distinct from later Fort Anaxes debris. Individual article agrees with Outer Rim; index says Core. |
| [Bardotta](https://starwars.fandom.com/wiki/Bardotta) | planet | Cold mountains, highlands, plains and ice caps | Use varied cold terrain; an interior hall is not evidence of global appearance. |
| [Balnab](https://starwars.fandom.com/wiki/Balnab) | planet | Rocky canyons and swamps | Temperate; local unusual growth does not establish global coverage. |
| [Cato Neimoidia](https://starwars.fandom.com/wiki/Cato_Neimoidia) | planet | Acidic oceans, cliffs, canyons, forests and rock arches | Bridge cities are local structures; avoid an entirely dry-rock globe. |
| [Dathomir](https://starwars.fandom.com/wiki/Dathomir) | planet | Rocky forests, swamps, rivers and waterfalls | Red atmospheric styling must remain distinguished from mapped vegetation coverage. |
| [Devaron](https://starwars.fandom.com/wiki/Devaron) | planet | Jungles, deep valleys, low mountains and rivers | Temperate-to-tropical terrestrial world. |
| [Felucia](https://starwars.fandom.com/wiki/Felucia) | planet | Hot humid jungle swamps | Distinctive vegetation does not establish measured orbital colors or global patterns. |
| [Florrum](https://starwars.fandom.com/wiki/Florrum) | planet | Dry sulfurous deserts and geysers | Hot dry terrestrial world. |
| [Ilum](https://starwars.fandom.com/wiki/Ilum) | planet | Glaciers, ice plains, mountains and shallow seas | Era-dependent excavation and Starkiller conversion must not be silently mixed into pristine Ilum. |
| [Iego](https://starwars.fandom.com/wiki/Iego) | planet | Basalt spires, canyons and desert | Rocky terrestrial environment; avoid treating nearby moons as surface detail. |
| [Kadavo](https://starwars.fandom.com/wiki/Kadavo) | planet | Cold volcanic terrain | Volcanic does not automatically mean a globally glowing lava surface. |
| [Karthon](https://starwars.fandom.com/wiki/Karthon) | moon | Scrap fields beneath cloud | Prison moon; correctional yards are a local setting, not a global junk coating. |
| [Kessel](https://starwars.fandom.com/wiki/Kessel) | planet | Barren northern mines and lush southern areas | Preserve hemispheric environmental contrast; exact boundaries are not established here. |
| [Kiros](https://starwars.fandom.com/wiki/Kiros) | planet | Rivers, valleys and waterfalls | Temperate green terrain; no measured ocean fraction. |
| [Lola Sayu](https://starwars.fandom.com/wiki/Lola_Sayu) | planet | Volcanic terrain, hills, mountains and caves | Keep distinctive purple orbital treatment; northern breathable atmosphere is not a global guarantee. |
| [Malastare](https://starwars.fandom.com/wiki/Malastare) | planet | Rocky terrain and forests | Temperate; local mauve ground is not a verified global palette. |
| [Maridun](https://starwars.fandom.com/wiki/Maridun) | planet | Plains and savannas | Do not assign Maridun's grasslands to Quell after the evacuation sequence. |
| [Mon Cala](https://starwars.fandom.com/wiki/Mon_Cala) | planet | Oceans | Ocean world; keep separate from generic forest-world treatment. |
| [Mustafar](https://starwars.fandom.com/wiki/Mustafar) | planet | Lava, obsidian mountains and ash; later regrowth | Era-dependent; volcanic Imperial-era depiction is not every historical state. |
| [Moraband](https://starwars.fandom.com/wiki/Moraband) | planet | Hot desolate mountains | Arid barren treatment; no invented lush continents. |
| [Naboo](https://starwars.fandom.com/wiki/Naboo) | planet | Wetlands, hills, plains, mountains and cities | Terrestrial mixed environment; invented coastlines are not canonical maps. |
| [Nal Hutta](https://starwars.fandom.com/wiki/Nal_Hutta) | planet | Hot humid swamps | Hutt Space is an overlapping political/geographic designation, not a contradictory planet identity. |
| [Onderon](https://starwars.fandom.com/wiki/Onderon) | planet | Jungle and urban settlements | Temperate; preserve jungle surrounding settlement areas. |
| [Pantora](https://starwars.fandom.com/wiki/Pantora) | moon | Marshes and urban outposts | Replace the draft's ice-world treatment; Pantora is not icy parent Orto Plutonia. |
| [Rodia](https://starwars.fandom.com/wiki/Rodia) | planet | Jungles, swamps and oceans | Hot humid terrestrial environment. |
| [Rugosa](https://starwars.fandom.com/wiki/Rugosa) | moon | Dry coral forests and rocky caverns | Former oceans have dried; coral is not evidence of present global tropical seas. |
| [Saleucami](https://starwars.fandom.com/wiki/Saleucami) | planet | Arid/temperate terrain, deserts, swamps, mountains and oases | Mixed environments; do not force a uniformly dry texture. |
| [Serenno](https://starwars.fandom.com/wiki/Serenno) | planet | Forests, mountains, plains, savannah and sea | Mixed terrestrial terrain. |
| [Scipio](https://starwars.fandom.com/wiki/Scipio) | planet | Frigid hills and mountains | Cold terrain; banking architecture is local. |
| [Toydaria](https://starwars.fandom.com/wiki/Toydaria) | planet | Foggy forests, mountains and swamps | Temperate wetlands; Hutt Space and Mid Rim labels can overlap. |
| [Umbara](https://starwars.fandom.com/wiki/Umbara) | planet | Dense vegetation, jungle and plains in dim atmospheric conditions | Distinct dark-world atmosphere; do not interpret darkness as absent vegetation. |
| [Vanqor](https://starwars.fandom.com/wiki/Vanqor) | planet | Rock, caves and crystalline formations | Temperate; underground crystals do not establish a crystal-covered globe. |
| [Yerbana](https://starwars.fandom.com/wiki/Yerbana) | planet | Mountains, canyons and oceans | Green-topped cliffs and cloud are local visual cues; no measured coverage. |
| [Zygerria](https://starwars.fandom.com/wiki/Zygerria) | planet | Rocky highlands, plains and mesas | Temperate terrain; city architecture is local. |
| [Abafar](https://starwars.fandom.com/wiki/Abafar) | planet | Hot dry desert | Pale desert treatment; avoid repetitive gas bands. |
| [Adelphi](https://starwars.fandom.com/wiki/Adelphi) | planet | Tropical beaches, jungles and mountains | Coastal base appearance is not an exact globe map. |
| [Arcana](https://starwars.fandom.com/wiki/Arcana) | planet | Barren terrain and ruins | Local pale ruins do not establish planet-wide city coverage. |
| [Bothawui](https://starwars.fandom.com/wiki/Bothawui) | planet | Gas giant; surrounding asteroid field | Canon article explicitly calls it a gas giant, citing Galactic Atlas; the draft's unknown-composition restriction needs updating. |
| [Carlac](https://starwars.fandom.com/wiki/Carlac) | planet | Snowy plains, mountains, forests and blue-sand deserts | Cold mixed environment; not exclusively ice. |
| [Corellia](https://starwars.fandom.com/wiki/Corellia) | planet | Forests, jungles, oceans and industrial cities | Do not render industry across the entire globe. |
| [Lothal](https://starwars.fandom.com/wiki/Lothal) | planet | Prairies, savannah, rock formations, mountains and inland seas | Era-sensitive industrial damage and recovery; preserve open plains. |
| [Lotho Minor](https://starwars.fandom.com/wiki/Lotho_Minor) | planet | Junk mountains, caverns and polluted terrain | Hot with acid rain; salvage identity is distinct from a natural rock world. |
| [Oba Diah](https://starwars.fandom.com/wiki/Oba_Diah) | planet | Jutting obsidian mountains | Dark rocky world; moon and planet remain separate identities. |
| [Quarzite](https://starwars.fandom.com/wiki/Quarzite) | planet | Dense grey cloud layer with violet flashes | Canon article supplies orbital description. Keep underground crystals separate; static violet accents avoid flashing effects. |
| [Seatos](https://starwars.fandom.com/wiki/Seatos) | planet | Forests and oceans | Red forest styling is distinct from lava; no invented surface map claims. |
| [Segra-Milo](https://starwars.fandom.com/wiki/Segra_Milo) | planet | Rocky expanses, cliffs, mountains and caverns | Segra Milo / Segra-Milo are spelling variants; green-brown overhead appearance does not establish dense forest. |
| [Quell](https://starwars.fandom.com/wiki/Quell) | planet | Terrestrial world with blue atmosphere and extensive white cloud | Physical class is terrestrial; surface terrain remains unresolved. Keep clouded visual treatment rather than inventing continents. |
| [Ringo Vinda](https://starwars.fandom.com/wiki/Ringo_Vinda) | planet | Orbital globe; specific surface terrain not established in reviewed article | The encircling structure is an artificial graving dock, not natural planetary bands. |

## Validation performed on the PC

- `npm run build` and `npm run build:worker`: passed. The frontend build retains the existing large-chunk warning.
- `npm run test:dossiers`: passed (46 dossiers, 97 source pages).
- `npm run test:connections`: passed; 521 relationships and 182 associated location names remain unchanged.
- `npm run test:reference-data`: passed; 27 traced placements and 49 grid centers preserved.
- `npm run check:icm` and `git diff --check`: passed.
- Direct identity checks: all 76 review IDs match the mapped registry exactly; added moon/planet identities have names; Tython remains K-10.

No new renderer, responsive-layout, physical-device, or 4K output verification was performed in this local accuracy pass. The original cloud draft's earlier test results have not been adopted as verification of this patch.
