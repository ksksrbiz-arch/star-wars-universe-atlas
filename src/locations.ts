/** Reviewed identities only. Unknown means unreviewed, not a default planet. */
export type LocationKind = 'planet' | 'moon' | 'asteroid-outpost' | 'space-station' | 'ship' | 'region' | 'system' | 'nebula' | 'unknown';
export type LocationIdentity = { kind: LocationKind; sourceUrl: string; note: string };
const guide = 'https://www.starwars.com/news/where-in-the-galaxy-are-the-worlds-of-rogue-one';
export const LOCATION_KINDS: Record<string, LocationIdentity> = {
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
const names: Record<string, string> = { 'ring-of-kafrene': 'Ring of Kafrene', jedha: 'Jedha', yavin: 'Yavin 4', lahmu: 'Lah’mu', wobani: 'Wobani', eadu: 'Eadu', scarif: 'Scarif', mustafar: 'Mustafar' };
export type AtlasLocation = LocationIdentity & { id: string; name: string; overview: string };
export const LOCATIONS: Record<string, AtlasLocation> = Object.fromEntries(Object.entries(LOCATION_KINDS).map(([id, identity]) => [id, { ...identity, id, name: names[id], overview: identity.note }]));
export const getLocation = (id: string): AtlasLocation | undefined => LOCATIONS[id];
