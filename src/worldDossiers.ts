/** Broad setting references only. Dossiers do not establish episode appearances or surface coordinates. */
export type DossierFact = { text: string; sourceUrl: string };
export type DossierHighlight = { id: string; name: string; description: string; sourceUrl: string };
export type WorldDossier = {
  worldId: string;
  eyebrow: string;
  overview: DossierFact;
  terrain: DossierFact & { label: string };
  environmentLabel?: string;
  highlights: DossierHighlight[];
  caveat: string;
};

const databank = 'https://www.starwars.com/databank/';
export const WORLD_DOSSIERS: Readonly<Record<string, WorldDossier>> = {
  kamino: {
    worldId: 'kamino', eyebrow: 'OCEAN WORLD · STORMS AND STILTS',
    overview: { text: 'Kamino is an ocean-covered world where storm clouds surround isolated cities raised above the water on enormous supports.', sourceUrl: databank + 'kamino' },
    terrain: { label: 'Open ocean and storm systems', text: 'Oceans dominate the surface. The portrait uses sweeping cloud bands and dark water to suggest the environment; cloud shapes are not measured geography.', sourceUrl: databank + 'kamino' },
    highlights: [
      { id: 'tipoca-city', name: 'Tipoca City', description: 'During the Republic era, Tipoca City combines the planetary government with major cloning facilities. Its status changes after the Republic falls.', sourceUrl: databank + 'tipoca-city' },
      { id: 'stilt-cities', name: 'Cities above the ocean', description: 'Kaminoan settlements stand on massive supports above the sea. No city locations, ocean depths or structural dimensions are inferred here.', sourceUrl: databank + 'kamino' },
    ],
    caveat: 'This is a broad environmental file, not a map of the oceans or facilities. The state of the cities changes by era; no galaxy coordinate is inferred from their existence.',
  },
  geonosis: {
    worldId: 'geonosis', eyebrow: 'RINGED WORLD · ROCK AND HIVES',
    overview: { text: 'Geonosis is a ringed, rocky desert world. Its native Geonosians construct tall hive spires and major industrial facilities.', sourceUrl: databank + 'geonosis' },
    terrain: { label: 'Rocky desert and hive spires', text: 'Harsh rock and desert surround the Geonosian hives. The ring and eroded surface motifs are original illustrations, not measured orbital or geological features.', sourceUrl: databank + 'geonosis' },
    highlights: [
      { id: 'spire-hives', name: 'Spire hives', description: 'The Geonosians inhabit towering hive structures adapted to this severe environment. The portrait does not plot individual hives.', sourceUrl: databank + 'geonosis' },
      { id: 'droid-factories', name: 'Underground droid factories', description: 'Some caverns beneath the hives were converted into automated factories producing droids, vehicles and weapons for the Separatists.', sourceUrl: databank + 'geonosis-droid-factory' },
    ],
    caveat: 'Industrial activity and habitation are era-specific. The illustrated ring is not an orbital model, and this file does not establish a route to another world.',
  },
  utapau: {
    worldId: 'utapau', eyebrow: 'SINKHOLE WORLD · CITIES BELOW',
    overview: { text: 'Utapau has a dry, windswept surface punctuated by immense sinkholes. Water gathers deep beneath the exposed ground.', sourceUrl: databank + 'utapau' },
    terrain: { label: 'Dry plains and deep sinkholes', text: 'The porous crust contains caves and crevices, while pools at the bottoms of sinkholes sustain life. Their depths and positions are not mapped here.', sourceUrl: databank + 'utapau' },
    highlights: [
      { id: 'sinkhole-cities', name: 'Sinkhole cities', description: 'Intricate settlements line sinkholes and extend into the surrounding rock. The circular portrait motifs suggest this habitat without locating any specific city.', sourceUrl: databank + 'utapau' },
      { id: 'mineral-workings', name: 'Mineral workings', description: 'Mining operations reach into the planetary crust to obtain valuable minerals, sharing the subterranean environment with settlements.', sourceUrl: databank + 'utapau' },
    ],
    caveat: 'This illustration is not a topographic survey: sinkhole counts, city positions, depths, distances and the relative placement of settlements remain unspecified.',
  },
  kashyyyk: {
    worldId: 'kashyyyk', eyebrow: 'FOREST WORLD · CANOPY AND COAST',
    overview: { text: 'Kashyyyk is the forested Wookiee homeworld. Tree-built settlements incorporate sophisticated technology within the wooded landscape.', sourceUrl: databank + 'kashyyyk' },
    terrain: { label: 'Forests, oceans and swamps', text: 'Dense forests coexist with ocean and swamp environments. The original canopy patterns are atmospheric motifs rather than mapped forest boundaries.', sourceUrl: databank + 'kashyyyk' },
    highlights: [
      { id: 'kachirho', name: 'Kachirho', description: 'Kachirho is a coastal Wookiee city. Its shoreline setting distinguishes it from many other settlements on the planet.', sourceUrl: databank + 'kachirho' },
      { id: 'arboreal-settlements', name: 'Tree-built settlements', description: 'Wookiee homes occupy the trees, combining their forest setting with advanced construction and technology. No individual settlement is positioned here.', sourceUrl: databank + 'kashyyyk' },
    ],
    caveat: 'This dossier describes broad habitats and settlement forms. Wartime and later political conditions vary; neither coastline nor canopy artwork establishes surface coordinates.',
  },
  tatooine: {
    worldId: 'tatooine',
    eyebrow: 'DESERT WORLD · TWIN SUNS',
    overview: { text: 'Beneath twin suns, moisture farms and spaceports share a harsh desert world. Its settlements include the port cities of Mos Eisley and Mos Espa.', sourceUrl: databank + 'tatooine' },
    terrain: { label: 'Desert and rocky wastes', text: 'Sandstorms are among the hazards of this harsh desert world, where settlers depend on moisture farms and spaceport trade.', sourceUrl: databank + 'tatooine' },
    highlights: [
      { id: 'mos-eisley', name: 'Mos Eisley Spaceport', description: 'A busy, lawless port where travelers, traders and smugglers cross paths.', sourceUrl: databank + 'mos-eisley-spaceport' },
      { id: 'mos-espa', name: 'Mos Espa', description: 'Domed buildings shelter a port city from the glare and heat of the twin suns; its arena is built on a much larger scale.', sourceUrl: databank + 'mos-espa' },
      { id: 'jundland-wastes', name: 'Jundland Wastes', description: 'A rocky desert region associated with Tusken clans, distinct from the planet’s spaceport settlements.', sourceUrl: databank + 'jundland-wastes' },
      { id: 'garsas-sanctuary', name: 'Garsa’s Sanctuary', description: 'A Mos Espa establishment combining live entertainment, gambling and hospitality under Garsa Fwip. This describes its setting during The Book of Boba Fett, not its condition in every era.', sourceUrl: databank + 'garsa-s-sanctuary' },
      { id: 'boba-fetts-palace', name: 'Boba Fett’s Palace', description: 'After the Empire’s fall, Boba Fett uses the former fortress of Jabba the Hutt as his Tatooine headquarters. Its throne room is a place for receiving guests and tribute.', sourceUrl: databank + 'boba-fett-s-palace' },
    ],
    caveat: 'These are broad setting references, not a surface map or a suggested route between settlements. Political control varies by era.',
  },
  'glavis-ringworld': {
    worldId: 'glavis-ringworld',
    eyebrow: 'ARTIFICIAL RING · SPACE STATION',
    environmentLabel: 'STRUCTURE & LIGHT',
    overview: { text: 'Glavis is an inhabited artificial ring surrounding a small star. Its ribbon-like structure is a space station, rather than the surface of a natural planet.', sourceUrl: databank + 'glavis-ringworld' },
    terrain: { label: 'Urban habitat around a star', text: 'Sunlight provides a continuous power source for the station. Moving eclipse plates create an artificial night cycle over its sunward face.', sourceUrl: databank + 'glavis-ringworld' },
    highlights: [
      { id: 'ring-habitat', name: 'The ring habitat', description: 'The official description identifies an urban artificial structure encircling a small star. The illustration suggests that form without establishing its dimensions or engineering.', sourceUrl: databank + 'glavis-ringworld' },
      { id: 'eclipse-plates', name: 'Eclipse plates', description: 'Sliding plates on the sunward face interrupt the light to provide an artificial night. Their number, layout and timing are not measured by this atlas.', sourceUrl: databank + 'glavis-ringworld' },
    ],
    caveat: 'An artificial station, not a planet. The original ring study is an illustration, not an engineering diagram or a galaxy-map placement. No dimensions, orbital parameters or travel route are inferred.',
  },
  coruscant: {
    worldId: 'coruscant',
    eyebrow: 'CITY WORLD · MANY LEVELS',
    overview: { text: 'Coruscant is a densely layered city world, with cultures and everyday life spread across hundreds of levels. Its civic and religious landmarks reflect changing eras.', sourceUrl: databank + 'coruscant' },
    terrain: { label: 'Urban layers', text: 'An artificially maintained temperate climate accompanies a city extending through many levels. The landscape is urban, from its surface districts to the streets far below.', sourceUrl: databank + 'coruscant' },
    highlights: [
      { id: 'jedi-temple', name: 'Jedi Temple', description: 'A five-spired complex associated with the Jedi Order’s schooling, contemplation and central activities. Its occupants and function are era-dependent.', sourceUrl: databank + 'jedi-temple' },
      { id: 'underlevels', name: 'The underlevels', description: 'Far beneath the surface districts, the underlevels form another side of the city. Law enforcement and criminal activity connect these deeper streets with the city above.', sourceUrl: databank + 'coruscant-underworld-police' },
    ],
    caveat: 'Government, access and the Temple’s role change across eras. The dossier does not place any particular episode or character at these landmarks.',
  },
  hoth: {
    worldId: 'hoth',
    eyebrow: 'ICE WORLD · FROZEN PLAINS',
    overview: { text: 'Hoth is a remote world of snow and ice, with glaciers and open plains. Its frozen landscape supports life despite the severe conditions.', sourceUrl: databank + 'hoth' },
    terrain: { label: 'Snow, glaciers and ice caverns', text: 'Snow and ice dominate glaciers and open plains. Tauntauns and wampas are among the native creatures adapted to this cold world.', sourceUrl: databank + 'hoth' },
    highlights: [
      { id: 'echo-base', name: 'Echo Base', description: 'The Rebels enlarged existing caverns to create a concealed installation on Hoth. Its name refers to a particular wartime base, not the whole planet.', sourceUrl: databank + 'echo-base' },
      { id: 'wampa-caverns', name: 'Caverns beneath the ice', description: 'Wampas use below-surface caverns as lairs. These are a habitat described by the source, not a single named cave or a plotted destination.', sourceUrl: databank + 'wampa' },
    ],
    caveat: 'Echo Base belongs to a specific period of the rebellion. Cave locations and distances are not mapped here, and a shared schematic grid with Bespin does not imply physical proximity.',
  },
  naboo: {
    worldId: 'naboo',
    eyebrow: 'LAKES, PLAINS & RIVER CITIES',
    overview: { text: 'Naboo combines swampy lakes, rolling plains and green hills with river cities and underwater Gungan settlements. The built environments are as varied as the surface.', sourceUrl: databank + 'naboo' },
    terrain: { label: 'Lakes, wetlands and green hills', text: 'The planet’s wetlands and open plains coexist with human river cities and Gungan bubble settlements below the water.', sourceUrl: databank + 'naboo' },
    highlights: [
      { id: 'theed-royal-palace', name: 'Theed Royal Palace', description: 'The palace overlooks cliffs and waterfalls in Naboo’s capital. It is the seat of the Naboo’s elected monarchy.', sourceUrl: databank + 'theed-royal-palace' },
      { id: 'otoh-gunga', name: 'Otoh Gunga', description: 'Beneath Lake Paonga, connected hydrostatic bubbles form a Gungan city with breathable interiors and sweeping organic forms.', sourceUrl: databank + 'otoh-gunga' },
    ],
    caveat: 'The palace and underwater city are distinct settlements. Their relative positions, travel paths and distances are not established by this schematic galaxy map.',
  },
  bespin: {
    worldId: 'bespin',
    eyebrow: 'GAS GIANT · CITIES IN THE CLOUDS',
    overview: { text: 'Bespin is an immense gas giant with a habitable band in its atmosphere. Floating mining settlements occupy this layer among the clouds.', sourceUrl: databank + 'bespin' },
    terrain: { label: 'Cloud layers and habitable atmosphere', text: 'Life and industry occupy a band of atmosphere rather than a conventional solid surface. Mining complexes draw valuable gases from deeper within the planet.', sourceUrl: databank + 'bespin' },
    highlights: [
      { id: 'cloud-city', name: 'Cloud City', description: 'A floating metropolis suspended among Bespin’s pastel clouds, combining living space with a Tibanna-gas mining colony.', sourceUrl: databank + 'cloud-city' },
      { id: 'carbon-freezing', name: 'Industrial carbon-freezing', description: 'Cloud City uses an industrial process that encases highly pressurized gases in solid carbonite. Its machinery belongs to the settlement, not a natural planetary surface.', sourceUrl: databank + 'carbon-freezing' },
    ],
    caveat: 'Cloud City is one settlement in the atmosphere, not the whole planet. Its administration changes by era; the shared schematic grid with Hoth does not establish physical proximity.',
  },
  dagobah: {
    worldId: 'dagobah',
    eyebrow: 'SWAMP WORLD · DENSE UNDERGROWTH',
    overview: { text: 'Dagobah is a humid swamp world crowded with jungle undergrowth and animal life. Bogs and wetlands shape a landscape far removed from an urban settlement.', sourceUrl: databank + 'dagobah' },
    terrain: { label: 'Swamps and jungle undergrowth', text: 'Murky wetlands support reptilian and amphibious creatures as well as larger lifeforms. Dense growth and bog-like conditions dominate the landscape.', sourceUrl: databank + 'dagobah' },
    highlights: [
      { id: 'yodas-hut', name: 'Yoda’s Hut', description: 'A simple dwelling built among the roots of a massive gnarltree, where Yoda lived during his exile on Dagobah.', sourceUrl: databank + 'yodas-hut' },
      { id: 'cave-of-evil', name: 'Cave of Evil', description: 'A cave in the swamps associated with the dark side of the Force. Its visions are experiences of those who enter, not evidence of travel to the places they depict.', sourceUrl: databank + 'cave-of-evil' },
    ],
    caveat: 'The hut and cave are broad setting references without surface coordinates. Vision imagery does not establish a physical route, and the hut’s occupancy belongs to a particular era.',
  },
  yavin: {
    worldId: 'yavin',
    eyebrow: 'FOREST MOON · JUNGLE CANOPY',
    overview: { text: 'Yavin 4 is a jungle-covered moon orbiting the gas giant Yavin. Its forests and local wildlife surround a setting used by Rebel cells and, later, a larger base.', sourceUrl: databank + 'yavin-4' },
    terrain: { label: 'Jungle and forest', text: 'Steamy jungle and forest cover this moon. Its flora and fauna shape a landscape with relatively little settlement.', sourceUrl: databank + 'yavin-4' },
    highlights: [
      { id: 'rebel-base', name: 'The Rebel base', description: 'Rebel cells used the moon as a stopover before a larger base developed there. The base is a wartime installation rather than a permanent description of every era.', sourceUrl: databank + 'yavin-4' },
      { id: 'doodar-habitat', name: 'Native wildlife', description: 'The tusked, reptilian doodar is indigenous to Yavin 4. Its territorial behavior and low rumbling call are part of the moon’s living environment.', sourceUrl: databank + 'yavinian-doodar' },
    ],
    caveat: 'Yavin 4 is the moon, not the gas giant Yavin. Its galaxy-map marker uses the parent system’s published grid; this dossier supplies no independent moon or surface coordinates.',
  },
  endor: {
    worldId: 'endor',
    eyebrow: 'FOREST MOON · TREETOP SETTLEMENTS',
    overview: { text: 'Endor’s forest moon is a lush home of the Ewoks. Forests, grasslands and mountains form its varied landscape.', sourceUrl: databank + 'endor' },
    terrain: { label: 'Forests, grasslands and mountains', text: 'Wooded environments, open grasslands and mountains form varied terrain on this inhabited moon. Forest life is central to the setting.', sourceUrl: databank + 'endor' },
    highlights: [
      { id: 'bright-tree-village', name: 'Bright Tree Village', description: 'Huts, buildings and watchtowers sit high in Endor’s trees, linked by rope bridges and ladders above the forest floor.', sourceUrl: databank + 'bright-tree-village' },
      { id: 'shield-generator', name: 'Imperial shield-generator site', description: 'The Empire built a shield generator in the Ewoks’ forests. It belongs to a specific wartime occupation, not a lasting natural feature of the moon.', sourceUrl: databank + 'ewok' },
    ],
    caveat: 'This dossier describes the forest moon, not the parent planet or the separate ocean moon Kef Bir. Village and installation locations are not plotted as surface coordinates.',
  },
  scarif: {
    worldId: 'scarif', eyebrow: 'TROPICAL WORLD · IMPERIAL OCCUPATION',
    overview: { text: 'Scarif’s tropical landscape surrounds a major Imperial military installation. Its natural beauty contrasts with its heavily defended role in the Imperial war machine.', sourceUrl: databank + 'scarif' },
    terrain: { label: 'Tropical landscape', text: 'The official description presents Scarif as a tropical paradise transformed by military infrastructure. The portrait uses invented shoreline motifs, not a traced surface map.', sourceUrl: databank + 'scarif' },
    highlights: [
      { id: 'tropical-landscape', name: 'Tropical landscape', description: 'Scarif’s tropical environment forms the natural setting around the Imperial installation; no island arrangement or surface scale is established here.', sourceUrl: databank + 'scarif' },
      { id: 'imperial-installation', name: 'Imperial military installation', description: 'The planet supports a major Imperial military and construction facility, protected by heavy defenses and a planetary shield during the Imperial era.', sourceUrl: databank + 'scarif' },
    ],
    caveat: 'The shield and military installation describe an Imperial-era setting. Original tropical artwork is illustrative and does not establish island positions, routes, or present-day conditions.',
  },
  jedha: {
    worldId: 'jedha', eyebrow: 'DESERT MOON · PILGRIMAGE WORLD',
    overview: { text: 'Jedha is a small desert moon with a permanent winter. Its long connection to study of the Force makes it a destination for pilgrims seeking spiritual guidance.', sourceUrl: databank + 'jedha' },
    terrain: { label: 'Cold desert moon', text: 'Desert terrain and persistent cold coexist on Jedha. A warm-colored illustration should not be read as evidence of a hot climate.', sourceUrl: databank + 'jedha' },
    highlights: [
      { id: 'pilgrimage-sites', name: 'Pilgrimage setting', description: 'Jedha’s holy sites draw pilgrims from across the galaxy and connect the moon with early exploration of the Force.', sourceUrl: databank + 'jedha' },
      { id: 'timeworn-streets', name: 'Timeworn city streets', description: 'The official account describes an occupied city whose old streets are contested by Imperial forces and scattered rebels during this era.', sourceUrl: databank + 'jedha' },
    ],
    caveat: 'Jedha is a moon, not a parent planet. These descriptions preserve the film-era setting without charting a surface itinerary or treating conditions as timeless.',
  },
  eadu: {
    worldId: 'eadu', eyebrow: 'RUGGED WORLD · RAIN AND SECRECY',
    overview: { text: 'Eadu is a rugged planet in the Outer Rim’s Bheriz sector. Rain and native nerf herders are among the few details widely associated with this remote world.', sourceUrl: databank + 'eadu' },
    terrain: { label: 'Rain-soaked rugged terrain', text: 'Rugged country and frequent rain define the official description of Eadu. The rocky and cloud motifs in its portrait are original illustrations.', sourceUrl: databank + 'eadu' },
    highlights: [
      { id: 'herding-country', name: 'Nerf-herding country', description: 'The planet’s native nerf herders are part of its publicly known character, distinct from the secret Imperial work conducted there.', sourceUrl: databank + 'eadu' },
      { id: 'research-laboratory', name: 'Imperial research laboratory', description: 'A secret laboratory houses scientists working for the Tarkin Initiative on kyber-crystal research during the Imperial era.', sourceUrl: databank + 'eadu' },
    ],
    caveat: 'The laboratory is an era-specific installation. Its placement within the planet is not plotted here; the atmospheric portrait does not imply measured weather or a surface map.',
  },
  lahmu: {
    worldId: 'lahmu', eyebrow: 'REMOTE WORLD · MINERAL-RICH GROUND',
    overview: { text: 'Lah’mu is a sparsely inhabited backwater in the Outer Rim’s Raioballo sector. The Erso family sought refuge there away from Coruscant.', sourceUrl: databank + 'lah-mu' },
    terrain: { label: 'Mineral-rich ground and groundwater', text: 'The world’s rich soil and groundwater are contaminated by minerals and other elements. A green illustrative surface does not imply that all land is fertile or safe.', sourceUrl: databank + 'lah-mu' },
    highlights: [
      { id: 'remote-backwater', name: 'Sparsely settled landscape', description: 'Lah’mu is described as a remote, sparsely inhabited backwater rather than a densely built world or major trade hub.', sourceUrl: databank + 'lah-mu' },
      { id: 'erso-refuge', name: 'Erso family refuge', description: 'The Erso family moved to Lah’mu from Coruscant in search of refuge from the Empire. Their homestead is not positioned on a surface map here.', sourceUrl: databank + 'lah-mu' },
    ],
    caveat: 'Lah’mu’s apostrophe is retained in source descriptions; the registry uses a stable plain-text ID. No homestead coordinates, geological measurements, or travel route are inferred.',
  },
  mustafar: {
    worldId: 'mustafar', eyebrow: 'VOLCANIC WORLD · LAVA FIELDS',
    overview: { text: 'Mustafar is a small, fiery Outer Rim world, rich in valuable minerals. Lava pits and rivers make its surface dangerous, even as mining exploits its resources.', sourceUrl: databank + 'mustafar' },
    terrain: { label: 'Lava rivers and volcanic ground', text: 'The official description emphasizes lava pits, flowing rivers and extreme heat. Original fissure patterns suggest this environment without tracing real surface geography.', sourceUrl: databank + 'mustafar' },
    highlights: [
      { id: 'lava-fields', name: 'Lava fields and rivers', description: 'Mustafar’s lava pits and rivers shape a hostile habitat whose native inhabitants are adapted to extreme heat.', sourceUrl: databank + 'mustafar' },
      { id: 'vaders-castle', name: 'Vader’s castle', description: 'An obsidian tower rises from Mustafar’s lava fields above an ancient Sith cave. The structure belongs to a particular historical era, not the planet’s natural geology.', sourceUrl: databank + 'vader-s-castle' },
    ],
    caveat: 'This portrait emphasizes the volcanic landscape described by the source, not a permanent climate claim for every era. Castle and mining sites have no invented surface coordinates.',
  },
};

/** Reviewed broad categories for directory discovery; absence means not reviewed, not unknown geology. */
export type WorldTerrainCategory = 'desert' | 'urban' | 'ice' | 'wetlands' | 'gas-giant' | 'swamp' | 'forest' | 'tropical' | 'cold-desert' | 'rugged' | 'mineral-rich' | 'volcanic' | 'ocean' | 'sinkholes';
export const WORLD_TERRAIN: Readonly<Record<string, { category: WorldTerrainCategory; label: string; sourceUrl: string }>> = {
  kamino: { category: 'ocean', label: 'Ocean and storms', sourceUrl: databank + 'kamino' },
  geonosis: { category: 'desert', label: 'Rocky desert', sourceUrl: databank + 'geonosis' },
  utapau: { category: 'sinkholes', label: 'Sinkholes and dry plains', sourceUrl: databank + 'utapau' },
  kashyyyk: { category: 'forest', label: 'Forest', sourceUrl: databank + 'kashyyyk' },
  'glavis-ringworld': { category: 'urban', label: 'Artificial urban habitat', sourceUrl: databank + 'glavis-ringworld' },
  tatooine: { category: 'desert', label: 'Desert', sourceUrl: databank + 'tatooine' },
  coruscant: { category: 'urban', label: 'Urban', sourceUrl: databank + 'coruscant' },
  hoth: { category: 'ice', label: 'Ice', sourceUrl: databank + 'hoth' },
  naboo: { category: 'wetlands', label: 'Lakes and wetlands', sourceUrl: databank + 'naboo' },
  bespin: { category: 'gas-giant', label: 'Gas giant', sourceUrl: databank + 'bespin' },
  dagobah: { category: 'swamp', label: 'Swamp', sourceUrl: databank + 'dagobah' },
  yavin: { category: 'forest', label: 'Forest and jungle', sourceUrl: databank + 'yavin-4' },
  endor: { category: 'forest', label: 'Forest', sourceUrl: databank + 'endor' },
  scarif: { category: 'tropical', label: 'Tropical', sourceUrl: databank + 'scarif' },
  jedha: { category: 'cold-desert', label: 'Cold desert', sourceUrl: databank + 'jedha' },
  eadu: { category: 'rugged', label: 'Rain and rugged terrain', sourceUrl: databank + 'eadu' },
  lahmu: { category: 'mineral-rich', label: 'Mineral-rich ground', sourceUrl: databank + 'lah-mu' },
  mustafar: { category: 'volcanic', label: 'Volcanic', sourceUrl: databank + 'mustafar' },
};
