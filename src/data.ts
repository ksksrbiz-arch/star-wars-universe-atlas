/** Geographic labels are sourced; display positions are schematic grid centers. */
export type World = {
  id: string;
  name: string;
  region: string;
  grid: string;
  x: number;
  y: number;
  color: string;
  description: string;
  film: string;
  sourceUrl: string;
  uncertainty: string;
};

export const GEOGRAPHY_SOURCE =
  'https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf';

/**
 * Prototype display window: columns A–U, rows 1–21.
 * x grows right/east; y grows up/north (renderer plane convention).
 * Cell centers: x=(columnIndex-10)/10, y=(11-row)/10.
 * This window is a presentation choice, not the extent or scale of the galaxy.
 * For SVG coordinates, invert y. These values are not physical coordinates.
 */
export function gridToDisplay(grid: string): { x: number; y: number } {
  const match = /^([A-U])-(\d{1,2})$/.exec(grid);
  if (!match) throw new Error(`Unsupported display grid: ${grid}`);
  const row = Number(match[2]);
  if (row < 1 || row > 21) throw new Error(`Grid row outside prototype window: ${grid}`);
  return { x: (match[1].charCodeAt(0) - 65 - 10) / 10, y: (11 - row) / 10 };
}

export const WORLDS: World[] = [
  {
    id: 'tatooine',
    name: 'Tatooine',
    region: 'Outer Rim Territories',
    grid: 'R-16',
    ...gridToDisplay('R-16'),
    color: '#E8AD69',
    description:
      'A desert world beneath twin suns, where moisture farms and busy spaceports sit far from the centers of galactic power. Luke Skywalker’s journey begins here.',
    film: 'A New Hope',
    sourceUrl: 'https://www.starwars.com/databank/tatooine',
    uncertainty: 'Schematic placement within the published Tatooine system grid; planet rendering is illustrative.',
  },
  {
    id: 'alderaan',
    name: 'Alderaan',
    region: 'Core Worlds',
    grid: 'M-10',
    ...gridToDisplay('M-10'),
    color: '#82CBDD',
    description:
      'Leia Organa’s homeworld, a place of mountains and lakes whose people valued learning and the arts. Its place in the story connects the heart of the Core to the growing rebellion.',
    film: 'A New Hope',
    sourceUrl: 'https://www.starwars.com/databank/alderaan',
    uncertainty: 'Schematic placement within the published Alderaan system grid; planet rendering is illustrative.',
  },
  {
    id: 'yavin',
    name: 'Yavin 4',
    region: 'Outer Rim Territories',
    grid: 'P-6',
    ...gridToDisplay('P-6'),
    color: '#9FCB85',
    description:
      'A jungle-covered moon of the gas giant Yavin. Ancient temples shelter a Rebel base, making this remote world a gathering point for pilots, leaders, and a desperate mission.',
    film: 'A New Hope',
    sourceUrl: 'https://www.starwars.com/databank/yavin-4',
    uncertainty: 'Uses the parent Yavin system grid, not an independently measured moon position; rendering is illustrative.',
  },
  {
    id: 'hoth',
    name: 'Hoth',
    region: 'Outer Rim Territories',
    grid: 'K-18',
    ...gridToDisplay('K-18'),
    color: '#BCDCEC',
    description:
      'A remote world of glaciers and frozen plains. The Rebel Alliance established Echo Base here, among the snowfields inhabited by tauntauns and wampas.',
    film: 'The Empire Strikes Back',
    sourceUrl: 'https://www.starwars.com/databank/hoth',
    uncertainty: 'System grid K-18 also contains Bespin. Their shared display anchor does not imply physical proximity; planet rendering is illustrative.',
  },
  {
    id: 'dagobah',
    name: 'Dagobah',
    region: 'Outer Rim Territories',
    grid: 'M-19',
    ...gridToDisplay('M-19'),
    color: '#87A58A',
    description:
      'Dense vegetation, mist and wetlands cover this secluded world. Its abundant life and strong connection to the Force make it a refuge for Yoda and a place of discovery for Luke.',
    film: 'The Empire Strikes Back',
    sourceUrl: 'https://www.starwars.com/databank/dagobah',
    uncertainty: 'Schematic placement within the published Dagobah system grid; planet rendering is illustrative.',
  },
  {
    id: 'bespin',
    name: 'Bespin',
    region: 'Outer Rim Territories',
    grid: 'K-18',
    ...gridToDisplay('K-18'),
    color: '#E5B49A',
    description:
      'An immense gas giant with a habitable layer in its atmosphere. Cloud City floats among its pastel clouds, supporting a community built around gas mining.',
    film: 'The Empire Strikes Back',
    sourceUrl: 'https://www.starwars.com/databank/bespin',
    uncertainty: 'System grid K-18 also contains Hoth. Their shared display anchor does not imply physical proximity; planet rendering is illustrative.',
  },
  {
    id: 'coruscant',
    name: 'Coruscant',
    region: 'Core Worlds',
    grid: 'L-9',
    ...gridToDisplay('L-9'),
    color: '#B8B3EC',
    description:
      'A city that covers a planet, with traffic and communities layered above and below its skyline. Coruscant is a center of government and a crossroads for people from across the galaxy.',
    film: 'Andor · The Clone Wars',
    sourceUrl: 'https://www.starwars.com/databank/coruscant',
    uncertainty: 'Schematic placement within the published Coruscant system grid. Its Return of the Jedi appearance is edition-dependent; rendering is illustrative.',
  },
  {
    id: 'mandalore',
    name: 'Mandalore',
    region: 'Outer Rim Territories',
    grid: 'O-7',
    ...gridToDisplay('O-7'),
    color: '#87BFC0',
    description:
      'A world of inhospitable deserts, cities and a long warrior tradition. The lives of its clans connect stories in The Clone Wars with the journeys of The Mandalorian.',
    film: 'The Clone Wars · The Mandalorian',
    sourceUrl: 'https://www.starwars.com/databank/mandalore',
    uncertainty: 'Schematic placement within the published Mandalore system grid. Landscape and political conditions vary by era; rendering is illustrative.',
  },
];
