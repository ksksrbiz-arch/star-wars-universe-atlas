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
};
