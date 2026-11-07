import { RECONCILED_WORLDS } from './reconciledWorlds.ts';
import { WORLDS, gridToDisplay, type World } from './data.ts';
import { applyReferencePlacement } from './referencePlacements.ts';
// Direct system-name matches from the audited appendix; no parent-system guesses.
const records = [
  {
    "id": "ferrix",
    "name": "Ferrix",
    "region": "Outer Rim Territories",
    "grid": "Q-3",
    "color": "#8BB8C4",
    "description": "Ferrix is listed in the official galaxy appendix in grid Q-3. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 18. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "aldhani",
    "name": "Aldhani",
    "region": "Outer Rim Territories",
    "grid": "M-6",
    "color": "#8BB8C4",
    "description": "Aldhani is listed in the official galaxy appendix in grid M-6. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 2. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "niamos",
    "name": "Niamos",
    "region": "Outer Rim Territories",
    "grid": "R-6",
    "color": "#8BB8C4",
    "description": "Niamos is listed in the official galaxy appendix in grid R-6. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 37. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "kenari",
    "name": "Kenari",
    "region": "Mid Rim",
    "grid": "Q-7",
    "color": "#8BB8C4",
    "description": "Kenari is listed in the official galaxy appendix in grid Q-7. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 27. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "ghorman",
    "name": "Ghorman",
    "region": "Colonies",
    "grid": "L-13",
    "color": "#8BB8C4",
    "description": "Ghorman is listed in the official galaxy appendix in grid L-13. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 21. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "mina-rau",
    "name": "Mina-Rau",
    "region": "Outer Rim Territories",
    "grid": "O-6",
    "color": "#8BB8C4",
    "description": "Mina-Rau is listed in the official galaxy appendix in grid O-6. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 34. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "chandrila",
    "name": "Chandrila",
    "region": "Core Worlds",
    "grid": "L-9",
    "color": "#8BB8C4",
    "description": "Chandrila is listed in the official galaxy appendix in grid L-9. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 10. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "dantooine",
    "name": "Dantooine",
    "region": "Outer Rim Territories",
    "grid": "L-4",
    "color": "#8BB8C4",
    "description": "Dantooine is listed in the official galaxy appendix in grid L-4. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 13. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "christophsis",
    "name": "Christophsis",
    "region": "Outer Rim Territories",
    "grid": "Q-16",
    "color": "#8BB8C4",
    "description": "Christophsis is listed in the official galaxy appendix in grid Q-16. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 10. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "teth",
    "name": "Teth",
    "region": "Outer Rim Territories",
    "grid": "U-12",
    "color": "#8BB8C4",
    "description": "Teth is listed in the official galaxy appendix in grid U-12. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 52. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "ryloth",
    "name": "Ryloth",
    "region": "Outer Rim Territories",
    "grid": "R-17",
    "color": "#8BB8C4",
    "description": "Ryloth is listed in the official galaxy appendix in grid R-17. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 46. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "geonosis",
    "name": "Geonosis",
    "region": "Outer Rim Territories",
    "grid": "R-16",
    "color": "#8BB8C4",
    "description": "Geonosis is listed in the official galaxy appendix in grid R-16. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 20. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "nevarro",
    "name": "Nevarro",
    "region": "Outer Rim Territories",
    "grid": "K-20",
    "color": "#8BB8C4",
    "description": "Nevarro is listed in the official galaxy appendix in grid K-20. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 37. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "sorgan",
    "name": "Sorgan",
    "region": "Outer Rim Territories",
    "grid": "Q-17",
    "color": "#8BB8C4",
    "description": "Sorgan is listed in the official galaxy appendix in grid Q-17. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 49. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "corvus",
    "name": "Corvus",
    "region": "Outer Rim Territories",
    "grid": "S-6",
    "color": "#8BB8C4",
    "description": "Corvus is listed in the official galaxy appendix in grid S-6. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 11. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "tython",
    "name": "Tython",
    "region": "Deep Core",
    "grid": "K-10",
    "color": "#8BB8C4",
    "description": "Tython is listed in the official galaxy appendix in grid K-10. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 55. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "morak",
    "name": "Morak",
    "region": "Wild Space",
    "grid": "H-18",
    "color": "#8BB8C4",
    "description": "Morak is listed in the official galaxy appendix in grid H-18. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 35. Displayed at the cell center, not an exact planet position."
  },
  {
    "id": "maldo-kreis",
    "name": "Maldo Kreis",
    "region": "Outer Rim Territories",
    "grid": "R-16",
    "color": "#8BB8C4",
    "description": "Maldo Kreis is listed in the official galaxy appendix in grid R-16. This view uses that system-level cell; its planet surface is illustrative.",
    "film": "See the selected story\u2019s sourced connection",
    "sourceUrl": "https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf",
    "uncertainty": "Published system grid, appendix page 32. Displayed at the cell center, not an exact planet position."
  }
];
// Additional direct-name system rows, verified in the official appendix on 2026-11-07.
// Tuple fields: stable ID, screen-world name, appendix region, grid cell, PDF page.
// These reference placements do not resolve continuity, moon/orbit offsets, or precise coordinates.
const additionalGridRecords: [string, string, string, string, number][] = [
  [
    "aleen",
    "Aleen",
    "Mid Rim",
    "L-7",
    2
  ],
  [
    "anaxes",
    "Anaxes",
    "Outer Rim Territories",
    "R-7",
    2
  ],
  [
    "bardotta",
    "Bardotta",
    "Colonies",
    "K-13",
    5
  ],
  [
    "balnab",
    "Balnab",
    "Mid Rim",
    "L-7",
    5
  ],
  [
    "cato-neimoidia",
    "Cato Neimoidia",
    "Colonies",
    "N-11",
    9
  ],
  [
    "dathomir",
    "Dathomir",
    "Outer Rim Territories",
    "O-6",
    13
  ],
  [
    "devaron",
    "Devaron",
    "Colonies",
    "M-13",
    14
  ],
  [
    "felucia",
    "Felucia",
    "Outer Rim Territories",
    "R-6",
    18
  ],
  [
    "florrum",
    "Florrum",
    "Outer Rim Territories",
    "R-5",
    18
  ],
  [
    "ilum",
    "Ilum",
    "Unknown Regions",
    "G-7",
    24
  ],
  [
    "iego",
    "Iego",
    "Outer Rim Territories",
    "T-7",
    24
  ],
  [
    "kadavo",
    "Kadavo",
    "Wild Space",
    "S-4",
    26
  ],
  [
    "karthon",
    "Karthon",
    "Outer Rim Territories",
    "H-16",
    27
  ],
  [
    "kessel",
    "Kessel",
    "Outer Rim Territories",
    "T-10",
    28
  ],
  [
    "kiros",
    "Kiros",
    "Expansion Region",
    "L-8",
    28
  ],
  [
    "lola-sayu",
    "Lola Sayu",
    "Outer Rim Territories",
    "R-6",
    31
  ],
  [
    "malastare",
    "Malastare",
    "Mid Rim",
    "N-16",
    32
  ],
  [
    "maridun",
    "Maridun",
    "Outer Rim Territories",
    "Q-6",
    33
  ],
  [
    "mon-cala",
    "Mon Cala",
    "Outer Rim Territories",
    "U-6",
    35
  ],
  [
    "mustafar",
    "Mustafar",
    "Outer Rim Territories",
    "L-19",
    35
  ],
  [
    "moraband",
    "Moraband",
    "Outer Rim Territories",
    "R-5",
    35
  ],
  [
    "naboo",
    "Naboo",
    "Mid Rim",
    "O-17",
    36
  ],
  [
    "nal-hutta",
    "Nal Hutta",
    "Hutt Space",
    "S-12",
    36
  ],
  [
    "onderon",
    "Onderon",
    "Inner Rim",
    "O-9",
    38
  ],
  [
    "pantora",
    "Pantora",
    "Outer Rim Territories",
    "P-19",
    40
  ],
  [
    "rodia",
    "Rodia",
    "Outer Rim Territories",
    "R-16",
    45
  ],
  [
    "rugosa",
    "Rugosa",
    "Outer Rim Territories",
    "O-17",
    46
  ],
  [
    "saleucami",
    "Saleucami",
    "Outer Rim Territories",
    "S-8",
    46
  ],
  [
    "serenno",
    "Serenno",
    "Outer Rim Territories",
    "P-5",
    47
  ],
  [
    "scipio",
    "Scipio",
    "Outer Rim Territories",
    "K-5",
    47
  ],
  [
    "toydaria",
    "Toydaria",
    "Hutt Space",
    "R-11",
    54
  ],
  [
    "umbara",
    "Umbara",
    "Expansion Region",
    "P-10",
    55
  ],
  [
    "vanqor",
    "Vanqor",
    "Outer Rim Territories",
    "R-5",
    57
  ],
  [
    "yerbana",
    "Yerbana",
    "Outer Rim Territories",
    "Q-17",
    60
  ],
  [
    "zygerria",
    "Zygerria",
    "Outer Rim Territories",
    "S-4",
    61
  ]
];
records.push(...additionalGridRecords.map(([id, name, region, grid, page]) => ({
  id, name, region, grid, color: '#8BB8C4',
  description: `${name} has a direct system-name match in the official galaxy appendix at ${grid}. The displayed surface is illustrative.`,
  film: 'See the selected story’s sourced connection',
  sourceUrl: 'https://cdnvideo.dolimg.com/cdn_assets/02834527f17e4165d39a069a88161e5e330cd883.pdf',
  uncertainty: `Published system grid, appendix page ${page}. Schematic cell center, not an exact planet or moon position. This reference placement does not establish era-specific continuity or orbital offsets.`
})));
const endor: World = {
  id: 'endor', name: 'Endor (forest moon)', region: 'Outer Rim Territories', grid: 'H-16', ...gridToDisplay('H-16'), color: '#87AB7A',
  description: 'The forest moon is home to the Ewoks. Its map anchor represents the Endor system, not an exact moon coordinate.',
  film: 'Return of the Jedi', sourceUrl: 'https://www.starwars.com/databank/endor',
  uncertainty: 'Parent-system placement: the official Databank identifies the forest moon and Endor system context; the appendix lists Endor at H-16 (page 16). The displayed cell center is not the moon’s precise position.'
};
export const ALL_WORLDS: World[] = [...WORLDS, endor, ...records.map(w => ({...w, ...gridToDisplay(w.grid)}))].map(applyReferencePlacement).concat(RECONCILED_WORLDS);
