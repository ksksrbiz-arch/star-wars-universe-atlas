import type { PlanetConnection } from './connections.ts';
const gallery = (film: number) => `https://www.starwars.com/films/star-wars-episode-${film}-${['','the-phantom-manace','attack-of-the-clones','revenge-of-the-sith'][film]}-story-gallery`;
const link = (itemId: string, worldId: string, worldName: string, sourceUrl: string, note: string, context?: PlanetConnection['context']): PlanetConnection => ({ itemId, worldId, worldName, locationKind: worldId === 'polis-massa' ? 'asteroid-outpost' : 'planet', sourceUrl, note, ...(context ? { context } : {}) });
/** Partial film/location associations. Montage order is not a character route or travel sequence. */
export const PREQUEL_CONNECTIONS: PlanetConnection[] = [
  link('pt-phantom-menace', 'naboo', 'Naboo', gallery(1), 'Gallery captions 1/3/26 establish the blockade, surface setting and orbital battle. One film-level association includes both surface and space scenes.'),
  link('pt-phantom-menace', 'tatooine', 'Tatooine', gallery(1), 'Gallery caption 7 places the repair stop and Mos Espa visit on Tatooine.', 'surface'),
  link('pt-phantom-menace', 'coruscant', 'Coruscant', gallery(1), 'Gallery caption 17 identifies the capital arrival and Senate appeal.', 'surface'),
  link('pt-attack-of-the-clones', 'coruscant', 'Coruscant', gallery(2), 'Gallery captions 1/34 identify Amidala’s arrival and the departing clone army.', 'surface'),
  link('pt-attack-of-the-clones', 'naboo', 'Naboo', gallery(2), 'Gallery captions 15/35 establish the retreat and wedding setting.', 'surface'),
  link('pt-attack-of-the-clones', 'kamino', 'Kamino', gallery(2), 'Gallery caption 13 explicitly places Obi-Wan in Tipoca City on Kamino; the earlier archive discussion alone is not appearance proof.', 'surface'),
  link('pt-attack-of-the-clones', 'tatooine', 'Tatooine', gallery(2), 'Gallery caption 18 places Anakin and Padmé at Watto’s shop and the Lars homestead on Tatooine.', 'surface'),
  link('pt-attack-of-the-clones', 'geonosis', 'Geonosis', gallery(2), 'Gallery captions 21/22/31 establish the asteroid-field pursuit, surface investigation and battle. Surface and orbital scenes share this film-level association.'),
  link('pt-revenge-of-the-sith', 'coruscant', 'Coruscant', gallery(3), 'Gallery captions 1/7/49 establish orbital combat, surface arrival and Vader’s reconstruction; contexts are combined.'),
  link('pt-revenge-of-the-sith', 'kashyyyk', 'Kashyyyk', gallery(3), 'Gallery caption 18 locates Yoda’s battlefront on Kashyyyk.', 'surface'),
  link('pt-revenge-of-the-sith', 'utapau', 'Utapau', gallery(3), 'Gallery captions 20/34 establish the landing and Order 66 attack.', 'surface'),
  link('pt-revenge-of-the-sith', 'felucia', 'Felucia', gallery(3), 'Gallery caption 34 identifies the Order 66 montage setting, not a continuous journey.', 'surface'),
  link('pt-revenge-of-the-sith', 'mygeeto', 'Mygeeto', gallery(3), 'Gallery caption 34 identifies the Order 66 montage setting, not a continuous journey.', 'surface'),
  link('pt-revenge-of-the-sith', 'cato-neimoidia', 'Cato Neimoidia', gallery(3), 'Gallery caption 34 identifies Plo Koon’s aerial Order 66 scene; this is atmospheric, not orbital.'),
  link('pt-revenge-of-the-sith', 'saleucami', 'Saleucami', 'https://www.starwars.com/databank/stass-allie', 'The Databank names Saleucami for Stass Allie’s Order 66 speeder patrol and lists this film. Montage setting, not a character itinerary.', 'surface'),
  link('pt-revenge-of-the-sith', 'mustafar', 'Mustafar', gallery(3), 'Gallery captions 37/43 locate the Separatist headquarters and duel.', 'surface'),
  link('pt-revenge-of-the-sith', 'polis-massa', 'Polis Massa', gallery(3), 'Gallery caption 48 identifies the medical facility; separate Databank evidence establishes its remnant-planetoid outpost identity.', 'surface'),
  link('pt-revenge-of-the-sith', 'naboo', 'Naboo', gallery(3), 'Gallery caption 50 locates the funeral on Naboo.', 'surface'),
  link('pt-revenge-of-the-sith', 'alderaan', 'Alderaan', gallery(3), 'Gallery caption 52 identifies Leia’s arrival at the Royal House of Alderaan.', 'surface'),
  link('pt-revenge-of-the-sith', 'tatooine', 'Tatooine', 'https://www.starwars.com/databank/polis-massa', 'The film-linked history explicitly identifies Obi-Wan taking Luke to Tatooine; Tatooine’s Databank also lists Episode III.', 'surface'),
];
