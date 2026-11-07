/** Broad setting references only. Dossiers do not establish episode appearances or surface coordinates. */
export type DossierFact = { text: string; sourceUrl: string };
export type DossierHighlight = { id: string; name: string; description: string; sourceUrl: string };
export type WorldDossier = {
  worldId: string;
  eyebrow: string;
  overview: DossierFact;
  terrain: DossierFact & { label: string };
  highlights: DossierHighlight[];
  caveat: string;
};

const databank = 'https://www.starwars.com/databank/';
export const WORLD_DOSSIERS: Readonly<Record<string, WorldDossier>> = {
  tatooine: {
    worldId: 'tatooine',
    eyebrow: 'DESERT WORLD · TWIN SUNS',
    overview: { text: 'Beneath twin suns, moisture farms and spaceports share a harsh desert world. Its settlements include the port cities of Mos Eisley and Mos Espa.', sourceUrl: databank + 'tatooine' },
    terrain: { label: 'Desert and rocky wastes', text: 'Sandstorms are among the hazards of this harsh desert world, where settlers depend on moisture farms and spaceport trade.', sourceUrl: databank + 'tatooine' },
    highlights: [
      { id: 'mos-eisley', name: 'Mos Eisley Spaceport', description: 'A busy, lawless port where travelers, traders and smugglers cross paths.', sourceUrl: databank + 'mos-eisley-spaceport' },
      { id: 'mos-espa', name: 'Mos Espa', description: 'Domed buildings shelter a port city from the glare and heat of the twin suns; its arena is built on a much larger scale.', sourceUrl: databank + 'mos-espa' },
      { id: 'jundland-wastes', name: 'Jundland Wastes', description: 'A rocky desert region associated with Tusken clans, distinct from the planet’s spaceport settlements.', sourceUrl: databank + 'jundland-wastes' },
    ],
    caveat: 'These are broad setting references, not a surface map or a suggested route between settlements. Political control varies by era.',
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
};

/** Reviewed broad categories for directory discovery; absence means not reviewed, not unknown geology. */
export type WorldTerrainCategory = 'desert' | 'urban' | 'ice' | 'wetlands' | 'gas-giant' | 'swamp' | 'forest';
export const WORLD_TERRAIN: Readonly<Record<string, { category: WorldTerrainCategory; label: string; sourceUrl: string }>> = {
  tatooine: { category: 'desert', label: 'Desert', sourceUrl: databank + 'tatooine' },
  coruscant: { category: 'urban', label: 'Urban', sourceUrl: databank + 'coruscant' },
  hoth: { category: 'ice', label: 'Ice', sourceUrl: databank + 'hoth' },
  naboo: { category: 'wetlands', label: 'Lakes and wetlands', sourceUrl: databank + 'naboo' },
  bespin: { category: 'gas-giant', label: 'Gas giant', sourceUrl: databank + 'bespin' },
  dagobah: { category: 'swamp', label: 'Swamp', sourceUrl: databank + 'dagobah' },
  yavin: { category: 'forest', label: 'Forest and jungle', sourceUrl: databank + 'yavin-4' },
  endor: { category: 'forest', label: 'Forest', sourceUrl: databank + 'endor' },
};
