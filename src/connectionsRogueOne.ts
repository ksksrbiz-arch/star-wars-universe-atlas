import type { PlanetConnection } from './connections.ts';
const guide = 'https://www.starwars.com/news/where-in-the-galaxy-are-the-worlds-of-rogue-one';
/** Film-level evidence; article tour directions are not character travel or scene order. */
export const ROGUE_ONE_CONNECTIONS: PlanetConnection[] = [
  { itemId: 'rogue-one', worldId: 'lahmu', worldName: 'Lah’mu', locationKind: 'planet', sourceUrl: guide, note: 'The film-specific guide identifies Lah’mu as the Erso family’s hiding place. Earlier scenes remain part of the complete film.' },
  { itemId: 'rogue-one', worldId: 'ring-of-kafrene', worldName: 'Ring of Kafrene', locationKind: 'asteroid-outpost', sourceUrl: guide, note: 'The film-specific guide describes the trading outpost built between two asteroids. This is not a planet or a sourced map coordinate.' },
  { itemId: 'rogue-one', worldId: 'wobani', worldName: 'Wobani', locationKind: 'planet', sourceUrl: guide, note: 'The guide explicitly includes Wobani’s Imperial labor camps among the film’s settings.' },
  { itemId: 'rogue-one', worldId: 'jedha', worldName: 'Jedha', locationKind: 'moon', sourceUrl: guide, note: 'The film-specific guide identifies the holy moon Jedha, distinct from its parent NaJedha.' },
  { itemId: 'rogue-one', worldId: 'eadu', worldName: 'Eadu', locationKind: 'planet', sourceUrl: guide, note: 'The film-specific guide identifies Eadu and its Imperial kyber refining facility.' },
  { itemId: 'rogue-one', worldId: 'yavin', worldName: 'Yavin 4', locationKind: 'moon', sourceUrl: guide, note: 'The guide explicitly includes the fourth moon of Yavin among the film’s settings; this is not the parent gas giant.' },
  { itemId: 'rogue-one', worldId: 'mustafar', worldName: 'Mustafar', locationKind: 'planet', sourceUrl: 'https://www.starwars.com/databank/vader-s-castle', note: 'Vader’s Castle Databank locates the castle on Mustafar and explicitly lists Rogue One under appearances.' },
  { itemId: 'rogue-one', worldId: 'scarif', worldName: 'Scarif', locationKind: 'planet', sourceUrl: guide, note: 'The film-specific guide identifies Scarif and the Imperial Citadel Tower storing the Death Star plans.' },
];
