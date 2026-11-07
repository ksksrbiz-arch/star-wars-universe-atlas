import type { PlanetConnection } from './connections';

/** Additional episode-specific appearances reviewed November 7, 2026. No travel order or coordinates inferred. */
export const LIVE_ACTION_EXPANSION: PlanetConnection[] = [
  {
    itemId: 'andor-s01e02', worldId: 'kenari', context: 'flashback', worldName: 'Kenari',
    sourceUrl: 'https://www.starwars.com/news/andor-episode-2-that-would-be-me-highlights',
    note: 'Flashback: the episode highlights place young Kassa and the mining devastation on Kenari. This is not an adult Cassian visit.'
  },
  {
    itemId: 'andor-s01e03', worldId: 'kenari', context: 'flashback', worldName: 'Kenari',
    sourceUrl: 'https://www.starwars.com/news/andor-episode-3-reckoning-highlights',
    note: 'Flashback: the episode highlights explicitly identify Kenari as the setting where young Cassian enters the crashed transport and is later rescued.'
  },
  {
    itemId: 'andor-s01e08', worldId: 'segra-milo', context: 'surface', worldName: 'Segra-Milo',
    sourceUrl: 'https://www.starwars.com/news/andor-episode-8-narkina-5-highlights',
    note: 'The episode highlights place Saw Gerrera and his tense meeting with Luthen on Segra Milo, normalized here as Segra-Milo. No map position is supplied.'
  },
  {
    itemId: 'andor-s01e11', worldId: 'ferrix', context: 'surface', worldName: 'Ferrix',
    sourceUrl: 'https://www.starwars.com/news/andor-revisited-rewatch-season-1-arc-4',
    note: 'The rewatch explicitly identifies the episode 11 scene on Ferrix in which B2EMO grieves Maarva and Brasso comforts him; this is not inferred from Cassian calling the planet.'
  },
  {
    itemId: 'andor-s01e11', worldId: 'niamos', worldName: 'Niamos',
    sourceUrl: 'https://www.starwars.com/series/andor/andor-episode-11-daughter-of-ferrix',
    note: 'The exact episode guide indexes Niamos and describes the fugitives obtaining a ride back there. This is an episode/location association; no arrival time or travel sequence is assigned.'
  },
  {
    itemId: 'andor-s01e11', worldId: 'segra-milo', context: 'orbit', worldName: 'Segra-Milo',
    sourceUrl: 'https://www.starwars.com/news/andor-revisited-rewatch-season-1-arc-4',
    note: 'The episode 11 rewatch places Luthen\'s encounter with the Imperial arrestor cruiser in orbit above Segra-Milo after visiting Saw. Orbital action is included; no Cassian surface visit is implied.'
  },
  {
    itemId: 'andor-s02e10', worldId: 'naboo', context: 'flashback', worldName: 'Naboo',
    sourceUrl: 'https://www.starwars.com/news/andor-season-2-finale-episodes-10-11-12',
    note: 'Flashback: the finale commentary identifies Naboo as the setting of young Kleya and Luthen\'s explosive operation. The episode 10 guide places Kleya\'s recollections alongside her hospital mission: https://www.starwars.com/series/andor/season-2-episode-10-episode-guide'
  },
  {
    itemId: 'andor-s02e12', worldId: 'coruscant', context: 'surface', worldName: 'Coruscant',
    sourceUrl: 'https://www.starwars.com/news/andor-season-2-finale-episodes-10-11-12',
    note: 'The finale commentary locates the safehouse confrontation on Coruscant. The exact episode 12 synopsis identifies Cassian, Melshi, and Kleya escaping that assault with K-2SO: https://www.starwars.com/series/andor/season-2-episode-12-episode-guide'
  },
  {
    itemId: 'andor-s02e12', worldId: 'mina-rau', context: 'surface', worldName: 'Mina-Rau',
    sourceUrl: 'https://www.starwars.com/news/andor-season-2-finale-episodes-10-11-12',
    note: 'The official finale commentary explicitly identifies the concluding field scene as Mina-Rau. This is a separate closing scene, not Cassian\'s next mission destination.'
  },
  {
    itemId: 'mandalorian-s03e02', worldId: 'tatooine', context: 'surface', worldName: 'Tatooine',
    sourceUrl: 'https://www.starwars.com/news/the-mandalorian-chapter-18-the-mines-of-mandalore-highlights',
    note: 'The Chapter 18 highlights explicitly describe Din and Grogu stopping on Tatooine during Boonta Eve to obtain R5-D4 before their Mandalore expedition.'
  },
  {
    itemId: 'mandalorian-s03e02', worldId: 'kalevala', context: 'surface', worldName: 'Kalevala',
    sourceUrl: 'https://www.starwars.com/news/the-mandalorian-chapter-18-the-mines-of-mandalore-highlights',
    note: 'The Chapter 18 highlights locate Bo-Katan on her throne on Kalevala before she is summoned to rescue Din. This supports her parallel setting, not a continuous Din itinerary.'
  },
  {
    itemId: 'mandalorian-s03e05', worldId: 'adelphi', context: 'surface', worldName: 'Adelphi',
    sourceUrl: 'https://www.starwars.com/news/star-wars-the-mandalorian-and-grogu-set-visit',
    note: 'The official Adelphi Base set visit explicitly identifies the bar scene introducing live-action Garazeb Orrelios as Season 3, Chapter 21: The Pirate. No coordinates are supplied, and the later film is not added to the catalog.'
  },
];
