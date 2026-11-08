import { PREQUEL_CONNECTIONS } from './connectionsPrequels.ts';
import { BOBA_FETT_CONNECTIONS } from './connectionsBobaFett.ts';
import type { LocationKind } from './locations.ts';
import { ROGUE_ONE_CONNECTIONS } from './connectionsRogueOne.ts';
import { NEXT_CONNECTIONS } from './connectionsNextExpansion.ts';
import { CLONE_WARS_EXPANSION } from './connectionsCloneWarsExpansion.ts';
import { LIVE_ACTION_EXPANSION } from './connectionsLiveActionExpansion.ts';
import { AHSOKA_CONNECTIONS } from './connectionsAhsoka.ts';
import { CLONE_WARS_CONNECTIONS } from './connectionsCloneWars.ts';

export type PlanetConnection = {
  itemId: string;
  worldId: string;
  worldName: string;
  locationKind?: LocationKind;
  sourceUrl: string;
  note: string;
  /** Explicit episode evidence only; omitted when the setting context is not established. */
  context?: 'surface' | 'orbit' | 'flashback' | 'vision' | 'destruction';
  /** Only supplied when source evidence establishes within-title progression. */
  sequence?: number;
};

const film = 'https://www.starwars.com/films/';
const cw = 'https://www.starwars.com/series/clone-wars/';
const andor = 'https://www.starwars.com/series/andor/';
const news = 'https://www.starwars.com/news/';
const connection = (itemId: string, worldId: string, worldName: string, sourceUrl: string, note: string): PlanetConnection => ({ itemId, worldId, worldName, sourceUrl, note });

/** Curated title/world associations, not character journeys or exhaustive scene logs. */
export const CONNECTIONS: PlanetConnection[] = [
  connection('ot-a-new-hope', 'tatooine', 'Tatooine', film + 'star-wars-episode-iv-a-new-hope', 'The official film synopsis locates Luke and Obi-Wan on Tatooine.'),
  connection('ot-a-new-hope', 'alderaan', 'Alderaan', 'https://www.starwars.com/databank/alderaan', 'Seen being destroyed, not a completed surface visit by Luke. Databank explicitly lists A New Hope and describes the destruction.'),
  connection('ot-a-new-hope', 'yavin', 'Yavin 4', 'https://www.starwars.com/databank/yavin-4', 'Databank lists A New Hope and identifies the moon as the Rebel base for the first Death Star attack.'),
  connection('ot-empire-strikes-back', 'hoth', 'Hoth', film + 'star-wars-episode-v-the-empire-strikes-back', 'The film synopsis identifies the Rebel defeat on Hoth.'),
  connection('ot-empire-strikes-back', 'dagobah', 'Dagobah', film + 'star-wars-episode-v-the-empire-strikes-back', 'The film synopsis locates Luke’s training with Yoda on Dagobah.'),
  connection('ot-empire-strikes-back', 'bespin', 'Bespin', film + 'star-wars-episode-v-the-empire-strikes-back', 'The film synopsis places Vader’s trap at Cloud City on Bespin.'),
  connection('ot-return-of-the-jedi', 'tatooine', 'Tatooine', film + 'star-wars-episode-vi-return-of-the-jedi', 'The film synopsis places the rescue of Han on Tatooine.'),
  connection('ot-return-of-the-jedi', 'endor', 'Endor (forest moon)', film + 'star-wars-episode-vi-return-of-the-jedi', 'The film synopsis identifies the forest moon battle. This means the inhabited moon, not its parent planet or the Death Star.'),

  connection('andor-s01e01', 'morlana-one', 'Morlana One', andor + 'andor-season-1-episode-1-episode-guide', 'The episode guide identifies Morlana One as the site of the security officers’ deaths.'),
  connection('andor-s01e01', 'ferrix', 'Ferrix', andor + 'andor-season-1-episode-1-episode-guide', 'The episode guide describes Cassian’s return to Ferrix.'),
  connection('andor-s01e01', 'kenari', 'Kenari', andor + 'andor-season-1-episode-1-episode-guide', 'Flashback: the guide identifies young Kassa’s home as Kenari, many years before the present-day Ferrix story.'),
  connection('andor-s01e04', 'aldhani', 'Aldhani', andor + 'andor-episode-4-aldhani', 'The episode guide places Cassian with the heist team on Aldhani.'),
  connection('andor-s01e04', 'coruscant', 'Coruscant', andor + 'andor-episode-4-aldhani', 'The guide places the parallel Imperial Security Bureau storyline on Coruscant.'),
  connection('andor-s01e08', 'narkina-5', 'Narkina 5', andor + 'andor-episode-8-narkina-5', 'The episode guide identifies Cassian’s prison destination as Narkina 5.'),
  connection('andor-s01e08', 'ferrix', 'Ferrix', andor + 'andor-episode-8-narkina-5', 'The guide describes the arrests of Bix and Salman Paak on Ferrix.'),
  connection('andor-s01e11', 'coruscant', 'Coruscant', andor + 'andor-episode-11-daughter-of-ferrix', 'The guide places Vel’s meeting with Kleya on Coruscant.'),
  connection('andor-s01e11', 'narkina-5', 'Narkina 5', andor + 'andor-episode-11-daughter-of-ferrix', 'The guide describes Cassian and Melshi reaching land on Narkina 5 after their escape.'),
  connection('andor-s02e01', 'mina-rau', 'Mina-Rau', andor + 'season-2-episode-1-episode-guide', 'The episode guide places Bix, Brasso, and Wilmon on agricultural Mina-Rau.'),
  connection('andor-s02e01', 'chandrila', 'Chandrila', andor + 'season-2-episode-1-episode-guide', 'The guide locates Mon Mothma’s family wedding preparations on Chandrila.'),
  connection('andor-s02e06', 'coruscant', 'Coruscant', andor + 'season-2-episode-6-episode-guide', 'The episode guide places Cassian and Bix’s reunion on Coruscant.'),
  connection('andor-s02e06', 'ghorman', 'Ghorman', andor + 'season-2-episode-6-episode-guide', 'The guide places Vel and Cinta with the rebels on Ghorman.'),
  connection('andor-s02e12', 'yavin', 'Yavin 4', andor + 'season-2-episode-12-episode-guide', 'The guide describes Cassian delivering intelligence to the Rebel base on Yavin 4. Future mission mentions are excluded.'),

  connection('clone-wars-s02e16', 'christophsis', 'Christophsis', cw + 'cat-and-mouse-episode-guide', 'The guide identifies Christophsis as the world under blockade; this includes action in surrounding space.'),
  connection('clone-wars-s01e16', 'christophsis', 'Christophsis', cw + 'the-hidden-enemy-episode-guide', 'The episode synopsis places the Republic campaign and ambush on Christophsis.'),
  connection('clone-wars-s01e17', 'naboo', 'Naboo', cw + 'blue-shadow-virus-episode-guide', 'The episode synopsis locates the hidden biological weapons laboratory on Naboo.'),
  connection('clone-wars-s01e18', 'iego', 'Iego', cw + 'mystery-of-a-thousand-moons-episode-guide', 'The episode synopsis explicitly describes Anakin and Obi-Wan arriving on Iego to find an antidote.'),
  connection('clone-wars-s01e19', 'ryloth', 'Ryloth', cw + 'storm-over-ryloth-episode-guide', 'The episode synopsis describes the battle against the blockade surrounding Ryloth; orbital action does not imply a surface visit.'),
  connection('clone-wars-s01e20', 'ryloth', 'Ryloth', cw + 'innocents-of-ryloth-episode-guide', 'The guide places Obi-Wan’s operation in an occupied town on Ryloth.'),
  connection('clone-wars-s01e21', 'ryloth', 'Ryloth', cw + 'liberty-on-ryloth-episode-guide', 'The guide describes Mace Windu’s campaign to liberate Ryloth. Provider title uses “of”; official guide uses “on”.'),
  connection('clone-wars-s02e12', 'mandalore', 'Mandalore', cw + 'the-mandalore-plot-episode-guide', 'The episode synopsis sends Obi-Wan to investigate Mandalore.'),
  connection('clone-wars-s02e14', 'coruscant', 'Coruscant', cw + 'duchess-of-mandalore-episode-guide', 'The episode synopsis explicitly locates Satine’s investigation on Coruscant; the title alone is not evidence of a Mandalore visit.'),
  connection('clone-wars-s02e06', 'geonosis', 'Geonosis', cw + 'weapons-factory-episode-guide', 'The episode synopsis identifies the droid factory mission as taking place on Geonosis.'),
  connection('clone-wars-s02e07', 'geonosis', 'Geonosis', cw + 'legacy-of-terror-episode-guide', 'The guide places the battle and underground search on Geonosis.'),
  connection('clone-wars-s02e19', 'coruscant', 'Coruscant', cw + 'the-zillo-beast-strikes-back-episode-guide', 'The episode synopsis describes the Zillo Beast being brought to Coruscant and escaping there.'),
  connection('clone-wars-s07e05', 'coruscant', 'Coruscant', cw + 'gone-with-a-trace-episode-guide', 'The episode guide places Ahsoka in the lower levels of Coruscant.'),
  connection('clone-wars-s07e10', 'mandalore', 'Mandalore', cw + 'the-phantom-apprentice-episode-guide', 'The guide identifies Mandalore as the battle setting for Ahsoka and Maul.'),

  connection('mandalorian-s02e01', 'tatooine', 'Tatooine', news + 'the-mandalorian-chapter-9-the-marshal-highlights', 'The episode highlights explicitly locate Cobb Vanth and Mos Pelgo on Tatooine. The recap’s prior Nevarro events are excluded.'),
  connection('mandalorian-s02e05', 'corvus', 'Corvus', news + 'the-mandalorian-chapter-13-the-jedi-highlights', 'The episode article spells this “Corvis”. Normalized to Corvus using the official Calodan/Morgan Elsbeth world entry: https://www.starwars.com/databank/corvus'),
  connection('mandalorian-s03e02', 'mandalore', 'Mandalore', news + 'mando-download-chapter-18-the-mines-of-mandalore', 'The episode article identifies Din’s expedition into Mandalore and its Living Waters.'),
  connection('mandalorian-s03e03', 'coruscant', 'Coruscant', news + 'the-mandalorian-chapter-19-the-convert-highlights', 'The episode highlights locate Pershing’s rehabilitation storyline on Coruscant; this is not a Din Djarin visit.'),
  connection('mandalorian-s03e03', 'kalevala', 'Kalevala', news + 'the-mandalorian-chapter-19-the-convert-highlights', 'The episode highlights explicitly locate Din and Bo-Katan’s aerial battle over Kalevala.'),
  connection('mandalorian-s03e05', 'nevarro', 'Nevarro', news + 'mando-download-chapter-21-the-pirate', 'The episode article identifies Nevarro as the target of Gorian Shard’s attack.'),
];

// Second evidence batch: exact episode synopses and episode-specific official commentary.
const additional: [string, string, string, string, string][] = [
  ['clone-wars-film', 'christophsis', 'Christophsis', news + 'the-clone-wars-rewatch-theatrical-1-of-3', 'The official theatrical-film rewatch explicitly sets the opening battle and Ahsoka’s arrival on Christophsis.'],
  ['clone-wars-film', 'teth', 'Teth', news + 'the-clone-wars-rewatch-theatrical-release-2-of-3', 'The official film rewatch identifies Teth as the planet where Anakin and Ahsoka rescue Rotta.'],
  ['clone-wars-film', 'tatooine', 'Tatooine', news + 'the-clone-wars-rewatch-theatrical-release-3-of-3', 'The official film rewatch explicitly describes Anakin’s return, duel, and delivery of Rotta on Tatooine.'],
  ['clone-wars-film', 'coruscant', 'Coruscant', news + 'the-clone-wars-rewatch-theatrical-release-3-of-3', 'The official film rewatch places Padmé’s parallel investigation of Ziro in downtown Coruscant.'],
  ['mandalorian-s01e01', 'arvala-7', 'Arvala-7', 'https://www.starwars.com/series/the-mandalorian/chapter-1-guide', 'The official Chapter 1 guide explicitly indexes Arvala-7 and Kuiil’s ranch as episode locations; no scene order is supplied.'],
  ['mandalorian-s01e01', 'nevarro', 'Nevarro', 'https://www.starwars.com/series/the-mandalorian/chapter-1-guide', 'The official Chapter 1 guide explicitly indexes the Nevarro bazaar as an episode location; this is a location-index association.'],
  ['mandalorian-s01e02', 'arvala-7', 'Arvala-7', news + 'bounty-hunting-highlights-the-mandalorian-chapter-2-the-child', 'The episode highlights explicitly identify Arvala-7 as the world where Din and the Child are stranded.'],
  ['mandalorian-s01e03', 'nevarro', 'Nevarro', news + 'bounty-hunting-highlights-the-mandalorian-chapter-3-the-sin', 'The episode highlights explicitly place the bounty hunters’ pursuit and street battle on Nevarro.'],
  ['mandalorian-s01e04', 'sorgan', 'Sorgan', news + 'bounty-hunting-highlights-the-mandalorian-chapter-4-sanctuary', 'The episode highlights identify Sorgan as the village refuge where Din considers leaving the Child.'],
  ['mandalorian-s01e05', 'tatooine', 'Tatooine', news + 'bounty-hunting-highlights-the-mandalorian-chapter-5-the-gunslinger', 'The episode highlights explicitly describe the landing at Mos Eisley on Tatooine.'],
  ['mandalorian-s01e07', 'nevarro', 'Nevarro', news + 'bounty-hunting-highlights-the-mandalorian-chapter-7-the-reckoning', 'The episode highlights connect the reunion with Greef to the Nevarro-based Guild; the episode guide also indexes the Nevarro reptavian encounter.'],
  ['mandalorian-s01e08', 'nevarro', 'Nevarro', 'https://www.starwars.com/series/the-mandalorian/chapter-8-guide', 'The official Chapter 8 guide explicitly indexes Nevarro alongside the lava escape elements. This is an episode location-index association.'],
  ['mandalorian-s02e02', 'tatooine', 'Tatooine', news + 'the-mandalorian-chapter-10-the-passenger-highlights', 'The episode highlights explicitly locate the opening speeder ambush in the Tatooine desert.'],
  ['mandalorian-s02e02', 'maldo-kreis', 'Maldo Kreis', 'https://www.starwars.com/series/the-mandalorian/chapter-10-guide', 'The exact episode guide indexes Maldo Kreis with the ice spiders; the linked world entry identifies its frozen caverns. Location-index evidence, no sequence inferred.'],
  ['mandalorian-s02e07', 'morak', 'Morak', 'https://www.starwars.com/series/the-mandalorian/chapter-15-guide', 'The exact episode guide indexes Morak. Its linked world entry identifies the Imperial rhydonium refinery matching this episode’s mission: https://www.starwars.com/databank/morak'],
  ['mandalorian-s02e07', 'karthon', 'Karthon', 'https://www.starwars.com/series/the-mandalorian/chapter-15-guide', 'The exact episode guide indexes Karthon. Its story gallery opens with Mayfeld being collected from the prison scrap yard; location-index evidence.'],
  ['mandalorian-s03e01', 'nevarro', 'Nevarro', news + 'the-mandalorian-chapter-17-the-apostate-highlights', 'The episode highlights name Nevarro as Din and Grogu’s destination and describe their IG-11 and Anzellan encounters there.'],
  ['andor-s01e02', 'ferrix', 'Ferrix', andor + 'andor-season-1-episode-2-episode-guide', 'The synopsis places Cassian hiding from Pre-Mor officers on Ferrix. Kenari is mentioned as his origin, not added from that mention.'],
  ['andor-s01e03', 'ferrix', 'Ferrix', andor + 'andor-season-1-episode-3-episode-guide', 'The synopsis explicitly places Luthen, Cassian, and the security search on Ferrix.'],
  ['andor-s01e05', 'aldhani', 'Aldhani', andor + 'andor-episode-5-the-axe-forgets', 'The synopsis follows Cassian with the Aldhani heist team preparing their mission.'],
  ['andor-s01e06', 'aldhani', 'Aldhani', andor + 'andor-episode-6-the-eye', 'The synopsis explicitly sets the payroll heist on Aldhani.'],
  ['andor-s01e07', 'coruscant', 'Coruscant', andor + 'andor-episode-7-announcement', 'The synopsis locates the Imperial response and Mon Mothma’s concerns on Coruscant.'],
  ['andor-s01e07', 'ferrix', 'Ferrix', andor + 'andor-episode-7-announcement', 'The synopsis describes Cassian returning to Ferrix to see Bix and Maarva.'],
  ['andor-s01e07', 'niamos', 'Niamos', andor + 'andor-episode-7-announcement', 'The synopsis explicitly places Cassian’s arrest on Niamos.'],
  ['andor-s01e09', 'narkina-5', 'Narkina 5', andor + 'andor-season-1-episode-9-episode-guide', 'The synopsis locates Cassian, Kino, and Ulaf in the Narkina 5 prison.'],
  ['andor-s01e09', 'coruscant', 'Coruscant', andor + 'andor-season-1-episode-9-episode-guide', 'The synopsis locates Mon Mothma’s meetings on Coruscant.'],
  ['andor-s01e09', 'ferrix', 'Ferrix', andor + 'andor-season-1-episode-9-episode-guide', 'The synopsis explicitly locates Bix’s interrogation on Ferrix.'],
  ['andor-s01e10', 'narkina-5', 'Narkina 5', andor + 'andor-season-1-episode-10-episode-guide', 'The synopsis describes the prison uprising and escape on Narkina 5.'],
  ['andor-s01e10', 'coruscant', 'Coruscant', andor + 'andor-season-1-episode-10-episode-guide', 'The synopsis places Luthen’s meeting with Lonni and the parallel ISB storyline on Coruscant.'],
  ['andor-s01e12', 'ferrix', 'Ferrix', andor + 'andor-season-1-episode-12-episode-guide', 'The synopsis sets Maarva’s funeral and the uprising on Ferrix.'],
  ['andor-s02e02', 'mina-rau', 'Mina-Rau', andor + 'season-2-episode-2-episode-guide', 'The synopsis places the Imperial inspection and fugitives on Mina-Rau.'],
  ['andor-s02e02', 'coruscant', 'Coruscant', andor + 'season-2-episode-2-episode-guide', 'The synopsis locates Dedra and Syril’s current storyline on Coruscant; Ghorman is a prospective assignment.'],
  ['andor-s02e02', 'chandrila', 'Chandrila', andor + 'season-2-episode-2-episode-guide', 'The synopsis places Mon Mothma and Tay Kolma on Chandrila.'],
  ['andor-s02e03', 'mina-rau', 'Mina-Rau', andor + 'season-2-episode-3-episode-guide', 'The synopsis identifies Mina-Rau as the setting of the failed inspection evasion.'],
  ['andor-s02e03', 'chandrila', 'Chandrila', andor + 'season-2-episode-3-episode-guide', 'The synopsis places the wedding reception on Chandrila.'],
  ['andor-s02e03', 'coruscant', 'Coruscant', andor + 'season-2-episode-3-episode-guide', 'The synopsis places Syril, Dedra, and Eedy’s dinner on Coruscant; this is independent of Cassian’s radio call.'],
  ['andor-s02e04', 'coruscant', 'Coruscant', andor + 'season-2-episode-4-episode-guide', 'The synopsis locates Cassian and Bix’s safehouse on Coruscant.'],
  ['andor-s02e04', 'ghorman', 'Ghorman', andor + 'season-2-episode-4-episode-guide', 'The synopsis places Syril in Palmo, the capital of Ghorman.'],
  ['andor-s02e04', 'dqar', 'D’Qar', andor + 'season-2-episode-4-episode-guide', 'The synopsis explicitly locates Saw’s hideout and Wilmon’s work on D’Qar.'],
  ['andor-s02e05', 'ghorman', 'Ghorman', andor + 'season-2-episode-5-episode-guide', 'The synopsis describes Cassian arriving in Palmo on Ghorman.'],
  ['andor-s02e05', 'coruscant', 'Coruscant', andor + 'season-2-episode-5-episode-guide', 'The synopsis describes Syril returning to Coruscant to meet Imperial officers.'],
  ['andor-s02e07', 'ghorman', 'Ghorman', andor + 'season-2-episode-7-episode-guide', 'The synopsis explicitly places Dedra on the ground on Ghorman.'],
  ['andor-s02e07', 'yavin', 'Yavin 4', andor + 'season-2-episode-7-episode-guide', 'The synopsis locates Cassian and Bix at the developing Rebel base on Yavin 4.'],
  ['andor-s02e08', 'ghorman', 'Ghorman', andor + 'season-2-episode-8-episode-guide', 'The synopsis places the massacre and Cassian’s confrontation with Syril on Ghorman.'],
  ['andor-s02e08', 'coruscant', 'Coruscant', andor + 'season-2-episode-8-episode-guide', 'The synopsis locates Mon Mothma and Bail Organa planning her speech on Coruscant.'],
  ['andor-s02e09', 'yavin', 'Yavin 4', andor + 'season-2-episode-9-episode-guide', 'The synopsis explicitly places the KX droid repairs and Bix’s decision on Yavin 4.'],
  ['andor-s02e10', 'coruscant', 'Coruscant', news + 'andor-season-2-finale-episodes-10-11-12', 'Official finale commentary identifies Luthen’s gallery and the hospital sequence on Coruscant; the episode 10 guide identifies this operation.'],
  ['andor-s02e11', 'coruscant', 'Coruscant', andor + 'season-2-episode-11-episode-guide', 'The episode synopsis explicitly identifies Cassian’s return and Kleya’s safehouse on Coruscant.'],
  ['andor-s02e11', 'yavin', 'Yavin 4', news + 'andor-season-2-finale-episodes-10-11-12', 'Official finale commentary places Cassian, Melshi, and K-2SO on Yavin 4 before the extraction mission; more than a radio destination mention.'],
  ['mandalorian-s02e03', 'trask', 'Trask', news + 'from-a-certain-point-of-view-whats-your-favorite-episode-of-the-mandalorian-season-2', 'The official episode discussion explicitly identifies Chapter 11’s crash landing and reunion on the moon Trask.'],
  ['mandalorian-s02e04', 'nevarro', 'Nevarro', news + 'mando-download-chapter-12-the-siege', 'The episode article explicitly describes Din returning to Nevarro to reconnect with allies.'],
  ['mandalorian-s02e06', 'tython', 'Tython', news + 'the-mandalorian-chapter-14-the-tragedy-highlights', 'The episode highlights explicitly describe Din and Grogu arriving at Tython’s ancient Jedi temple.'],
  ['mandalorian-s03e04', 'coruscant', 'Coruscant', news + 'mando-download-chapter-20-the-foundling', 'Flashback: the episode article identifies Grogu remembering his rescue with Kelleran Beq on Coruscant, not a present-day visit.'],
  ['mandalorian-s03e06', 'plazir-15', 'Plazir-15', news + 'the-mandalorian-chapter-22-guns-for-hire-highlights', 'The episode highlights explicitly describe Din and Bo-Katan arriving on Plazir-15. Trask is only recalled as earlier history.'],
  ['mandalorian-s03e07', 'mandalore', 'Mandalore', news + 'the-mandalorian-chapter-23-the-spies-highlights', 'The episode highlights locate the encounter with Gideon’s commandos beneath Mandalore.'],
  ['mandalorian-s03e08', 'mandalore', 'Mandalore', news + 'the-mandalorian-chapter-24-the-return-highlights', 'The episode highlights explicitly identify the final battle as the fight for Mandalore.'],
  ['mandalorian-s03e08', 'nevarro', 'Nevarro', news + 'the-mandalorian-chapter-24-the-return-highlights', 'The episode highlights explicitly place Din and Grogu’s concluding respite on Nevarro.'],
];
CONNECTIONS.push(...additional.map(record => connection(...record)));
CONNECTIONS.push(...CLONE_WARS_CONNECTIONS);
CONNECTIONS.push(...LIVE_ACTION_EXPANSION, ...CLONE_WARS_EXPANSION, ...NEXT_CONNECTIONS);
CONNECTIONS.push(...AHSOKA_CONNECTIONS, ...ROGUE_ONE_CONNECTIONS, ...BOBA_FETT_CONNECTIONS, ...PREQUEL_CONNECTIONS);

export const CONNECTION_COVERAGE = {
  checkedOn: '2026-11-07',
  status: 'Curated, incomplete evidence batches',
  scope: 'Original-trilogy films, the 2008 Clone Wars film, and selected episode/world relationships from Andor, The Clone Wars (2008), The Mandalorian, Ahsoka season one, and The Book of Boba Fett. Having a relationship does not mean every location in that title is covered.',
  relationshipCount: CONNECTIONS.length,
  coveredItemIds: [...new Set(CONNECTIONS.map(connection => connection.itemId))],
  semantics: 'Title/world associations include planets, moons, surrounding orbital action, and explicitly labeled flashbacks or destruction scenes. They are not a single character’s itinerary.',
  evidenceBasis: 'Most links use named settings in official synopses or episode commentary. Notes explicitly identify a smaller set based on the exact episode guide’s named location index; these establish an association, not a particular scene or character visit. Generic character biographies and broad world-to-series appearances are not episode evidence.',
  ordering: 'No within-title sequence has been assigned. Array order is editorial grouping, not story order or travel order.',
  omissions: 'Missing relationships do not establish absence of a world; reviewed title gaps are recorded separately. Edition-specific Return of the Jedi celebration locations are not included.',
  reviewedWithoutPlanetLink: [
    {
      "itemId": "clone-wars-s01e02",
      "reason": "The exact episode gallery names the Abregado and Bith systems and a debris-field rescue. It does not identify a particular planet or moon appearance; system names are not silently converted into planet IDs.",
      "sourceUrl": "https://www.starwars.com/series/clone-wars/rising-malevolence-episode-gallery"
    },
    {
      "itemId": "clone-wars-s01e03",
      "reason": "The exact episode gallery names the Ryndellia system, Kaliida Shoals medical station, Kaliida nebula, and Balmorra Run. No named planet/moon was established; a route name is not a planetary visit.",
      "sourceUrl": "https://www.starwars.com/series/clone-wars/shadow-of-malevolence-episode-gallery"
    },
    {
      "itemId": "clone-wars-s01e04",
      "reason": "The exact episode gallery describes the Malevolence striking a dead moon but supplies no moon name. A Naboo yacht denotes vessel provenance, not a Naboo visit.",
      "sourceUrl": "https://www.starwars.com/series/clone-wars/destroy-malevolence-episode-gallery"
    },
    {
      "itemId": "mandalorian-s01e06",
      "reason": "The official episode highlights describe a New Republic prison-ship mission. No named planet appearance was verified; this is not a claim of zero locations.",
      "sourceUrl": "https://www.starwars.com/news/bounty-hunting-highlights-the-mandalorian-chapter-6-the-prisoner"
    },
    {
      "itemId": "clone-wars-s07e12",
      "reason": "The exact episode story gallery describes a cruiser crash, burials, and an Imperial-era epilogue on an unnamed moon. It does not supply a stable named-world identity; neither a guessed name nor coordinates are assigned.",
      "sourceUrl": "https://www.starwars.com/series/clone-wars/victory-and-death-episode-guide"
    },
    {
      "itemId": "mandalorian-s02e08",
      "reason": "The official Chapter 16 guide and Mando Download article were reviewed. The ship-based rescue is explicit, but this review did not verify an episode-specific Tatooine anchor for the end-credit scene. The gap is an evidence limitation, not a denial of that scene.",
      "sourceUrl": "https://www.starwars.com/news/mando-download-chapter-16-the-rescue"
    }
  ],
  coordinates: 'Connections supply no coordinates. Render only worlds with separately sourced map placement; retain unmapped worlds in textual evidence.',
} as const;

