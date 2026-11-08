import type { PlanetConnection } from './connections.ts';

/** Film-specific official narrative evidence; no inferred travel ordering. */
export const SOLO_CONNECTIONS: PlanetConnection[] = [
  {
    "itemId": "solo",
    "worldId": "corellia",
    "worldName": "Corellia",
    "note": "The film-specific early-life narrative establishes Han and Qi’ra fleeing Corellia before their separation.",
    "sourceUrl": "https://www.starwars.com/databank/han-solo",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "solo",
    "worldId": "mimban",
    "worldName": "Mimban",
    "note": "The film narrative places Han’s infantry service and meeting with Beckett and Chewbacca on Mimban.",
    "sourceUrl": "https://www.starwars.com/databank/han-solo",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "solo",
    "worldId": "vandor",
    "worldName": "Vandor",
    "note": "The film narrative explicitly places the failed conveyex coaxium heist on Vandor.",
    "sourceUrl": "https://www.starwars.com/databank/han-solo",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "solo",
    "worldId": "kessel",
    "worldName": "Kessel",
    "note": "The film narrative establishes actual mine infiltration and escape on Kessel, followed by a blockade in space; this join represents the surface operation, not a plotted Kessel Run.",
    "sourceUrl": "https://www.starwars.com/databank/han-solo",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "solo",
    "worldId": "savareen",
    "worldName": "Savareen",
    "note": "The film narrative explicitly establishes the Falcon’s landing at the Savareen refinery after the Kessel Run.",
    "sourceUrl": "https://www.starwars.com/databank/han-solo",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "solo",
    "worldId": "numidian-prime",
    "worldName": "Numidian Prime",
    "note": "The film-specific account identifies the final sabacc game and Falcon departure on Numidian Prime. Tatooine is only an intended next destination.",
    "sourceUrl": "https://www.starwars.com/databank/numidian-prime",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "solo",
    "worldId": "first-light",
    "worldName": "First Light",
    "note": "The official ship entry identifies Dryden Vos’s yacht and the meetings aboard it while moored on Vandor. This is a ship identity, not a planet or fixed map position.",
    "sourceUrl": "https://www.starwars.com/databank/first-light",
    "locationKind": "ship"
  }
];
