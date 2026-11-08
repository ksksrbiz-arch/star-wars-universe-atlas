import type { PlanetConnection } from './connections.ts';

/** Partial film-specific official evidence; no inferred routes or coordinates. */
export const SEQUEL_CONNECTIONS: PlanetConnection[] = [
  {
    "itemId": "st-force-awakens",
    "worldId": "jakku",
    "worldName": "Jakku",
    "note": "Film-specific Finn biography describes the village raid, crash landing and escape from Jakku.",
    "sourceUrl": "https://www.starwars.com/databank/finn",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-force-awakens",
    "worldId": "takodana",
    "worldName": "Takodana",
    "note": "Film-specific Finn biography identifies arrival and confrontation on Takodana.",
    "sourceUrl": "https://www.starwars.com/databank/finn",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-force-awakens",
    "worldId": "starkiller-base",
    "worldName": "Starkiller Base",
    "note": "Finn’s rescue and shield-sabotage mission occurs on the planetary superweapon. Identity is the transformed planet, not a free-floating station; no Ilum placement is inferred.",
    "sourceUrl": "https://www.starwars.com/databank/finn",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-force-awakens",
    "worldId": "dqar",
    "worldName": "D’Qar",
    "note": "The base entry identifies the launch of the Starkiller attack from D’Qar, distinct from the following film’s evacuation.",
    "sourceUrl": "https://www.starwars.com/databank/d-qar",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-force-awakens",
    "worldId": "ahch-to",
    "worldName": "Ahch-To",
    "note": "The Falcon biography explicitly identifies the concluding arrival and landing on Luke’s island after the recovered star map is assembled.",
    "sourceUrl": "https://www.starwars.com/databank/millennium-falcon",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-force-awakens",
    "worldId": "hosnian-prime",
    "worldName": "Hosnian Prime",
    "note": "Starkiller Base’s first firing destroys the Republic capital. This is destruction evidence, not a protagonist surface visit.",
    "sourceUrl": "https://www.starwars.com/databank/starkiller-base",
    "locationKind": "planet",
    "context": "destruction"
  },
  {
    "itemId": "st-last-jedi",
    "worldId": "dqar",
    "worldName": "D’Qar",
    "note": "The official base entry distinguishes the evacuation and destruction of the ground base from the preceding Starkiller launch. The surrounding fleet battle does not imply every character lands.",
    "sourceUrl": "https://www.starwars.com/databank/d-qar",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-last-jedi",
    "worldId": "ahch-to",
    "worldName": "Ahch-To",
    "note": "The film synopsis explicitly places Rey seeking Luke on Ahch-To. Visions and Force connections do not establish remote characters physically arriving.",
    "sourceUrl": "https://www.starwars.com/films/star-wars-episode-viii-the-last-jedi",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-last-jedi",
    "worldId": "crait",
    "worldName": "Crait",
    "note": "Finn’s film-specific biography establishes the ski-speeder defense on Crait. Luke’s appearance is a Force projection from Ahch-To, not his physical arrival.",
    "sourceUrl": "https://www.starwars.com/databank/finn",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-last-jedi",
    "worldId": "cantonica",
    "worldName": "Cantonica",
    "note": "Rose’s biography establishes the Canto Bight casino mission and escape. The Canto Bight Databank (https://www.starwars.com/databank/canto-bight) separately identifies its parent planet Cantonica.",
    "sourceUrl": "https://www.starwars.com/databank/rose-tico",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-last-jedi",
    "worldId": "supremacy",
    "worldName": "Supremacy",
    "note": "Finn’s film-specific biography explicitly establishes infiltration, capture and escape aboard the flagship; no fixed planetary position is inferred.",
    "sourceUrl": "https://www.starwars.com/databank/finn",
    "locationKind": "ship"
  },
  {
    "itemId": "st-rise-of-skywalker",
    "worldId": "mustafar",
    "worldName": "Mustafar",
    "note": "Film story-gallery opening explicitly places Kylo’s wayfinder retrieval among Mustafar’s irontrees; no deleted novelization scene is imported.",
    "sourceUrl": "https://www.starwars.com/films/star-wars-episode-ix-the-rise-of-skywalker",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-rise-of-skywalker",
    "worldId": "exegol",
    "worldName": "Exegol",
    "note": "Film story-gallery opening identifies Kylo’s arrival and Palpatine’s hidden world. Rey’s biography separately establishes her final confrontation; surface scenes are distinct from the fleet battle.",
    "sourceUrl": "https://www.starwars.com/databank/rey",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-rise-of-skywalker",
    "worldId": "ajan-kloss-base",
    "worldName": "Ajan Kloss Resistance base",
    "note": "Film story-gallery caption describes Rey’s training in Ajan Kloss’s jungle. This record identifies the surface base/training locality, without assigning an unreviewed parent-body classification.",
    "sourceUrl": "https://www.starwars.com/films/star-wars-episode-ix-the-rise-of-skywalker",
    "locationKind": "surface-site",
    "context": "surface"
  },
  {
    "itemId": "st-rise-of-skywalker",
    "worldId": "pasaana",
    "worldName": "Pasaana",
    "note": "Film story gallery explicitly establishes arrival during the Festival of the Ancestors.",
    "sourceUrl": "https://www.starwars.com/films/star-wars-episode-ix-the-rise-of-skywalker",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-rise-of-skywalker",
    "worldId": "kijimi",
    "worldName": "Kijimi",
    "note": "The exact-film official article describes arrival at Babu Frik’s workshop. This join records the surface visit; subsequent destruction is a separate event.",
    "sourceUrl": "https://www.starwars.com/news/from-a-certain-point-of-view-star-wars-the-rise-of-skywalker-best-scene",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-rise-of-skywalker",
    "worldId": "kef-bir",
    "worldName": "Kef Bir",
    "note": "Rey’s film-specific biography identifies the Death Star wreckage search and duel on Kef Bir. Official Kef Bir Databank confirms a moon in the Endor system, distinct from the Forest Moon.",
    "sourceUrl": "https://www.starwars.com/databank/rey",
    "locationKind": "moon",
    "context": "surface"
  },
  {
    "itemId": "st-rise-of-skywalker",
    "worldId": "ahch-to",
    "worldName": "Ahch-To",
    "note": "Rey’s film-specific biography explicitly describes her return, burning Kylo’s TIE and conversation with Luke’s spirit; this is an actual return, not only a vision.",
    "sourceUrl": "https://www.starwars.com/databank/rey",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "st-rise-of-skywalker",
    "worldId": "tatooine",
    "worldName": "Tatooine",
    "note": "Rey’s film-specific biography establishes her concluding arrival to bury the Skywalker lightsabers.",
    "sourceUrl": "https://www.starwars.com/databank/rey",
    "locationKind": "planet",
    "context": "surface"
  }
];
