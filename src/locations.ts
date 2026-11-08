/** Reviewed identities only. Unknown means unreviewed, not a default planet. */
export type LocationKind = 'planet' | 'moon' | 'asteroid-outpost' | 'space-station' | 'ship' | 'region' | 'system' | 'nebula' | 'surface-site' | 'unknown';
export type LocationIdentity = { kind: LocationKind; sourceUrl: string; note: string };
const guide = 'https://www.starwars.com/news/where-in-the-galaxy-are-the-worlds-of-rogue-one';
export const LOCATION_KINDS: Record<string, LocationIdentity> = {
  mygeeto: { kind: 'planet', sourceUrl: 'https://www.starwars.com/databank/mygeeto', note: 'Cold Outer Rim world with crystalline terrain. No atlas map position is inferred from its film appearance.' },
  kamino: { kind: 'planet', sourceUrl: 'https://www.starwars.com/databank/kamino', note: 'Ocean world with storm-battered cities on stilts. No supported atlas grid is supplied here.' },
  kashyyyk: { kind: 'planet', sourceUrl: 'https://www.starwars.com/databank/kashyyyk', note: 'Forested Wookiee homeworld. Setting identity does not establish a map coordinate.' },
  utapau: { kind: 'planet', sourceUrl: 'https://www.starwars.com/databank/utapau', note: 'World of deep sinkholes and settlements built into their walls. Map position remains unverified in this atlas.' },
  'polis-massa': { kind: 'asteroid-outpost', sourceUrl: 'https://www.starwars.com/databank/polis-massa', note: 'Medical and research outpost on a remnant planetoid in the debris of a destroyed world; not an intact planet.' },

  'glavis-ringworld': { kind: 'space-station', sourceUrl: 'https://www.starwars.com/databank/glavis-ringworld', note: 'Artificial ribbon-shaped station surrounding a small star. No supported galaxy coordinate is supplied.' },
  'luke-jedi-school': { kind: 'surface-site', sourceUrl: 'https://www.starwars.com/news/the-book-of-boba-fett-chapter-6-highlights', note: 'Luke’s school under construction in Chapter 6. The reviewed source leaves the planet unnamed; no parent or coordinate is inferred.' },
  'ring-of-kafrene': { kind: 'asteroid-outpost', sourceUrl: guide, note: 'Trading settlement built between two asteroids in the Ring of Kafrene; not a planet.' },
  jedha: { kind: 'moon', sourceUrl: guide, note: 'Holy moon of NaJedha; the parent world is a separate identity.' },
  yavin: { kind: 'moon', sourceUrl: guide, note: 'Yavin 4, the fourth moon of Yavin; existing atlas ID retained.' },
  lahmu: { kind: 'planet', sourceUrl: guide, note: 'Lah’mu, the world where the Erso family hid.' },
  wobani: { kind: 'planet', sourceUrl: guide, note: 'World containing Imperial labor camps.' },
  eadu: { kind: 'planet', sourceUrl: guide, note: 'Storm-stricken rocky world with a kyber refining facility.' },
  scarif: { kind: 'planet', sourceUrl: guide, note: 'World of volcanic islands and shallow seas.' },
  mustafar: { kind: 'planet', sourceUrl: 'https://www.starwars.com/databank/mustafar', note: 'Volcanic world; Vader’s castle is a locality on it.' },
};
export const getLocationKind = (id: string): LocationKind => LOCATION_KINDS[id]?.kind ?? 'unknown';

/** Textual destinations remain available without asserting map placement. */
const names: Record<string, string> = { mygeeto: 'Mygeeto', kamino: 'Kamino', kashyyyk: 'Kashyyyk', utapau: 'Utapau', 'polis-massa': 'Polis Massa', 'glavis-ringworld': 'Glavis Ringworld', 'luke-jedi-school': 'Luke’s Jedi school', 'ring-of-kafrene': 'Ring of Kafrene', jedha: 'Jedha', yavin: 'Yavin 4', lahmu: 'Lah’mu', wobani: 'Wobani', eadu: 'Eadu', scarif: 'Scarif', mustafar: 'Mustafar' };
export type AtlasLocation = LocationIdentity & { id: string; name: string; overview: string };
export const LOCATIONS: Record<string, AtlasLocation> = Object.fromEntries(Object.entries(LOCATION_KINDS).map(([id, identity]) => [id, { ...identity, id, name: names[id], overview: identity.note }]));
export const getLocation = (id: string): AtlasLocation | undefined => LOCATIONS[id];
