import { GEOGRAPHY_SOURCE, gridToDisplay, type World } from './data.ts';

/** Direct appendix system-name matches, reviewed November 7, 2026.
 * Segra Milo's space/hyphen spelling is normalized to the existing relationship identity.
 * These are schematic cell centers, not measured planet positions or route waypoints.
 */
const records = [
  {
    "id": "abafar",
    "name": "Abafar",
    "region": "Outer Rim Territories",
    "grid": "O-6",
    "page": 1
  },
  {
    "id": "adelphi",
    "name": "Adelphi",
    "region": "Outer Rim Territories",
    "grid": "P-17",
    "page": 1
  },
  {
    "id": "arcana",
    "name": "Arcana",
    "region": "Outer Rim Territories",
    "grid": "M-5",
    "page": 3
  },
  {
    "id": "bothawui",
    "name": "Bothawui",
    "region": "Mid Rim",
    "grid": "R-14",
    "page": 7
  },
  {
    "id": "carlac",
    "name": "Carlac",
    "region": "Outer Rim Territories",
    "grid": "K-5",
    "page": 9
  },
  {
    "id": "corellia",
    "name": "Corellia",
    "region": "Core Worlds",
    "grid": "M-11",
    "page": 11
  },
  {
    "id": "lothal",
    "name": "Lothal",
    "region": "Outer Rim Territories",
    "grid": "U-7",
    "page": 32
  },
  {
    "id": "lotho-minor",
    "name": "Lotho Minor",
    "region": "Outer Rim Territories",
    "grid": "I-17",
    "page": 32
  },
  {
    "id": "oba-diah",
    "name": "Oba Diah",
    "region": "Outer Rim Territories",
    "grid": "T-10",
    "page": 38
  },
  {
    "id": "quarzite",
    "name": "Quarzite",
    "region": "Inner Rim",
    "grid": "M-13",
    "page": 43
  },
  {
    "id": "seatos",
    "name": "Seatos",
    "region": "Outer Rim Territories",
    "grid": "M-19",
    "page": 47
  },
  {
    "id": "segra-milo",
    "name": "Segra-Milo",
    "region": "Outer Rim Territories",
    "grid": "R-7",
    "page": 47
  },
  {
    "id": "quell",
    "name": "Quell",
    "region": "Outer Rim Territories",
    "grid": "Q-6",
    "page": 43
  },
  {
    "id": "ringo-vinda",
    "name": "Ringo Vinda",
    "region": "Mid Rim",
    "grid": "R-7",
    "page": 45
  }
];

export const MAPPED_WORLDS_EXPANSION: World[] = records.map(({id, name, region, grid, page}) => ({
  id, name, region, grid,
  ...gridToDisplay(grid),
  color: '#8BB8C4',
  description: `${name} has a published system-grid entry in the official galaxy appendix. This atlas uses that cell as a schematic destination; the surface illustration is decorative.`,
  film: 'See the selected story’s sourced connection',
  sourceUrl: GEOGRAPHY_SOURCE,
  uncertainty: `Published system grid ${grid}, appendix page ${page}. Displayed at the cell center, not an exact planet position.${id === 'segra-milo' ? ' The appendix spells this system Segra Milo; the existing atlas identity uses Segra-Milo.' : ''}`,
}));
