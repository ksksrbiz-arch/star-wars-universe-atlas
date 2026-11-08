import type { PlanetConnection } from './connections.ts';

/** Partial official episode evidence; mentions and broad series labels are not appearances. */
export const BAD_BATCH_CONNECTIONS: PlanetConnection[] = [
  {
    "itemId": "bad-batch-s01e01",
    "worldId": "kaller",
    "worldName": "Kaller",
    "sourceUrl": "https://www.starwars.com/aftermath-episode-gallery",
    "note": "Gallery caption 1 identifies the opening battle on Kaller during Order 66; the episode retains this overlap in its own narrative record.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e01",
    "worldId": "kamino",
    "worldName": "Kamino",
    "sourceUrl": "https://www.starwars.com/aftermath-episode-gallery",
    "note": "Gallery captions 9, 14 and 31–32 explicitly place the return, Imperial inspection and detention on Kamino.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e01",
    "worldId": "onderon",
    "worldName": "Onderon",
    "sourceUrl": "https://www.starwars.com/aftermath-episode-gallery",
    "note": "Gallery caption 26 establishes the actual arrival on Onderon, beyond the earlier mission order.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e02",
    "worldId": "saleucami",
    "worldName": "Saleucami",
    "sourceUrl": "https://www.starwars.com/cut-and-run-episode-gallery",
    "note": "Gallery caption 1 explicitly establishes arrival at Saleucami; Omega’s recollection of Kamino is not an extra visit.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e03",
    "worldId": "kamino",
    "worldName": "Kamino",
    "sourceUrl": "https://www.starwars.com/replacements-episode-gallery",
    "note": "Gallery captions 3 and 15 identify Crosshair’s treatment and return to Kamino.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e03",
    "worldId": "onderon",
    "worldName": "Onderon",
    "sourceUrl": "https://www.starwars.com/replacements-episode-gallery",
    "note": "Gallery captions 9 and 12 establish the Imperial squad landing and operation on Onderon.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e03",
    "worldId": "ordo-moon",
    "worldName": "Ordo Moon",
    "sourceUrl": "https://www.starwars.com/news/bad-batch-declassified-replacements",
    "note": "The exact official Replacements highlights explicitly identify the Marauder’s crash and capacitor-recovery mission on the Ordo Moon. No parent-planet location is inferred.",
    "locationKind": "moon",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e04",
    "worldId": "pantora",
    "worldName": "Pantora",
    "sourceUrl": "https://www.starwars.com/cornered-episode-gallery",
    "note": "Gallery captions 1–19 establish the supply stop and pursuit on Pantora. The official Pantora Databank identifies it as a moon; it is not an Orto Plutonia surface visit.",
    "locationKind": "moon",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e05",
    "worldId": "ord-mantell",
    "worldName": "Ord Mantell",
    "sourceUrl": "https://www.starwars.com/rampage-episode-gallery",
    "note": "Gallery captions 1–4 follow the decision to land at Ord Mantell through the actual meeting with Cid; mission planning alone is not the evidence.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e06",
    "worldId": "corellia",
    "worldName": "Corellia",
    "sourceUrl": "https://www.starwars.com/decommissioned-episode-gallery",
    "note": "Gallery caption 3 explicitly identifies arrival at Corellia’s industrial dockyard and the decommissioning-facility infiltration.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e07",
    "worldId": "ord-mantell",
    "worldName": "Ord Mantell",
    "sourceUrl": "https://www.starwars.com/battle-scars-episode-gallery",
    "note": "Gallery caption 2 explicitly establishes the team’s return to Ord Mantell and delivery to Cid.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e07",
    "worldId": "bracca",
    "worldName": "Bracca",
    "sourceUrl": "https://www.starwars.com/battle-scars-episode-gallery",
    "note": "Gallery captions 8–9 establish arrival at Bracca and passage through its starship graveyard to the Venator.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e08",
    "worldId": "bracca",
    "worldName": "Bracca",
    "sourceUrl": "https://www.starwars.com/reunion-episode-gallery",
    "note": "Gallery caption 2 explicitly places the clones on Bracca before their pursuit and confrontation.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e09",
    "worldId": "bora-vio",
    "worldName": "Bora Vio",
    "sourceUrl": "https://www.starwars.com/news/bad-batch-empire",
    "note": "The official retrospective explicitly identifies the murky cloning tanks on Bora Vio in season-one Bounty Lost; the exact gallery captions 7–23 document the facility landing and escape. This identity is retrospective confirmation, not inferred from a later adjacent episode.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e10",
    "worldId": "raxus",
    "worldName": "Raxus",
    "sourceUrl": "https://www.starwars.com/common-ground-episode-gallery",
    "note": "Gallery captions 1 and 4 explicitly establish the occupation and rescue arrival at Raxus; the existing atlas identity is retained.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e10",
    "worldId": "ord-mantell",
    "worldName": "Ord Mantell",
    "sourceUrl": "https://www.starwars.com/common-ground-episode-gallery",
    "note": "Gallery caption 3 explicitly places Cid’s briefing and Omega’s stay on Ord Mantell.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e11",
    "worldId": "ryloth",
    "worldName": "Ryloth",
    "sourceUrl": "https://www.starwars.com/devil-s-deal-episode-gallery",
    "note": "Gallery captions 1 and 14 explicitly place the Syndulla story and return descent on Ryloth. The weapons rendezvous remains separately unresolved.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e12",
    "worldId": "ryloth",
    "worldName": "Ryloth",
    "sourceUrl": "https://www.starwars.com/rescue-on-ryloth-episode-gallery",
    "note": "Gallery captions 1 and 4–6 place the detention and the Bad Batch’s return on Ryloth.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e13",
    "worldId": "ord-mantell",
    "worldName": "Ord Mantell",
    "sourceUrl": "https://www.starwars.com/infested-episode-gallery",
    "note": "Gallery captions 1–5 explicitly place the return, parlor takeover and mining-tunnel mission on Ord Mantell.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e14",
    "worldId": "daro",
    "worldName": "Daro",
    "sourceUrl": "https://www.starwars.com/war-mantle-episode-gallery",
    "note": "Gallery captions 3 and 6 establish the decoded distress signal followed by an actual arrival on Daro.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e14",
    "worldId": "kamino",
    "worldName": "Kamino",
    "sourceUrl": "https://www.starwars.com/war-mantle-episode-gallery",
    "note": "Gallery captions 4 and 25 explicitly establish the parallel Kamino evacuation and Rampart’s confrontation with Lama Su.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e15",
    "worldId": "ord-mantell",
    "worldName": "Ord Mantell",
    "sourceUrl": "https://www.starwars.com/return-to-kamino-episode-gallery",
    "note": "Gallery caption 2 explicitly places the team repairing the Marauder on Ord Mantell before tracking Hunter.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e15",
    "worldId": "kamino",
    "worldName": "Kamino",
    "sourceUrl": "https://www.starwars.com/return-to-kamino-episode-gallery",
    "note": "Gallery caption 3 identifies Crosshair and Hunter arriving at Kamino; captions 9–10 establish the other clones in its lab and the later barrage destroys Tipoca City, not the whole planet.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e16",
    "worldId": "kamino",
    "worldName": "Kamino",
    "sourceUrl": "https://www.starwars.com/kamino-lost-episode-gallery",
    "note": "Gallery caption 1 explicitly identifies Tipoca City on Kamino. The episode follows the clones surviving the city’s destruction; Kamino itself is not destroyed.",
    "locationKind": "planet",
    "context": "surface"
  },
  {
    "itemId": "bad-batch-s01e16",
    "worldId": "wayland",
    "worldName": "Wayland",
    "sourceUrl": "https://www.starwars.com/news/bad-batch-empire",
    "note": "Closing parallel storyline: the official retrospective explicitly identifies Nala Se’s destination in the final moments of season one as an Imperial base on Wayland. This is not a Bad Batch squad arrival or a guessed next journey stop.",
    "locationKind": "planet",
    "context": "surface"
  }
];
