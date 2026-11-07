import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CONNECTIONS, CONNECTION_COVERAGE } from '../src/connections.ts';

const catalog = JSON.parse(await readFile(new URL('../src/catalog.generated.json', import.meta.url), 'utf8')).items;
const ids = new Set(catalog.map(item => item.id));
const pairs = new Set();
const names = new Map();
for (const connection of CONNECTIONS) {
  assert(ids.has(connection.itemId), `Unknown title: ${connection.itemId}`);
  for (const field of ['itemId', 'worldId', 'worldName', 'sourceUrl', 'note']) assert(connection[field]?.trim(), `Missing ${field}`);
  const pair = `${connection.itemId}:${connection.worldId}`;
  assert(!pairs.has(pair), `Duplicate relationship: ${pair}`);
  pairs.add(pair);
  assert.equal(new URL(connection.sourceUrl).hostname, 'www.starwars.com');
  if (names.has(connection.worldId)) assert.equal(names.get(connection.worldId), connection.worldName);
  names.set(connection.worldId, connection.worldName);
  assert(!('x' in connection) && !('y' in connection), 'Evidence must not invent map coordinates');
  assert.equal(connection.sequence, undefined, 'This evidence pass supports no travel sequence');
}
assert.match(CONNECTIONS.find(c => c.itemId === 'andor-s01e01' && c.worldId === 'kenari').note, /flashback/i);
assert.match(CONNECTIONS.find(c => c.worldId === 'alderaan').note, /destroyed.*not a completed surface visit/i);
assert(!pairs.has('andor-s02e01:ghorman'), 'A meeting about Ghorman is not a visit');
assert(!pairs.has('andor-s02e12:jedha'), 'A future mission mention is not an appearance');
assert(!pairs.has('clone-wars-s02e14:mandalore'), 'Title text alone is not location evidence');
assert.equal(CONNECTION_COVERAGE.relationshipCount, CONNECTIONS.length);
const covered = new Set(CONNECTIONS.map(c => c.itemId));
assert.equal(CONNECTION_COVERAGE.coveredItemIds.length, covered.size);
console.log(JSON.stringify({ relationships: CONNECTIONS.length, coveredTitles: covered.size, unverifiedTitles: catalog.length - covered.size, associatedWorlds: names.size, series: [...new Set(catalog.filter(c => covered.has(c.id)).map(c => c.seriesId))] }, null, 2));

// Rewatch expansion preserves moon identity and excludes recalled history/visions.
for (const pair of ["clone-wars-s02e05:geonosis", "clone-wars-s05e16:mandalore", "clone-wars-s02e01:coruscant", "clone-wars-s04e21:lotho-minor", "clone-wars-s04e22:raydonia", "clone-wars-s01e14:maridun", "clone-wars-s03e18:lola-sayu", "clone-wars-s03e21:wasskah", "clone-wars-s03e21:felucia", "clone-wars-s03e22:wasskah", "clone-wars-s04e02:mon-cala", "clone-wars-s05e11:abafar", "clone-wars-s05e12:abafar", "clone-wars-s06e11:dagobah"]) assert(pairs.has(pair), `Missing reviewed rewatch association: ${pair}`);
assert(!pairs.has("clone-wars-s03e21:trandosha"), "Wasskah is a moon, not a Trandosha surface visit");
assert(!pairs.has("clone-wars-s04e22:naboo"), "Recalled duel on Naboo is not a present episode location");
assert(!pairs.has("clone-wars-s04e22:lotho-minor"), "Recalled Maul exile is not a present episode location");

// Exact-episode gallery expansion: preserve evidence identity and mention exclusions.
for (const pair of ["clone-wars-s01e05:rishi-moon", "clone-wars-s04e08:umbara", "clone-wars-s04e09:umbara", "clone-wars-s04e10:umbara", "clone-wars-s03e14:coruscant", "clone-wars-s03e14:serenno", "clone-wars-s04e04:naboo", "clone-wars-s05e08:florrum", "clone-wars-s04e15:coruscant", "clone-wars-s04e20:quarzite", "clone-wars-s05e01:florrum", "clone-wars-s01e22:coruscant", "clone-wars-s02e15:coruscant", "clone-wars-s03e11:coruscant", "clone-wars-s02e08:geonosis", "clone-wars-s01e06:bothawui", "clone-wars-s01e12:florrum", "clone-wars-s01e12:coruscant", "clone-wars-s05e17:coruscant", "clone-wars-s05e20:coruscant", "clone-wars-s06e01:serenno", "clone-wars-s06e10:serenno", "clone-wars-s06e10:oba-diah"]) assert(pairs.has(pair), `Missing reviewed story-gallery association: ${pair}`);
assert(!pairs.has('clone-wars-s01e05:rishi'), 'Rishi moon must not become a parent-planet appearance');
assert(!pairs.has('clone-wars-s04e15:naboo'), 'A future festival kidnapping plan is not a Naboo visit');
assert(!pairs.has('clone-wars-s02e08:dantooine'), 'A requested medical-supply destination is not an arrival');
assert.match(CONNECTIONS.find(c => c.itemId === 'clone-wars-s01e06' && c.worldId === 'bothawui').note, /orbital setting/i);
assert.match(CONNECTIONS.find(c => c.itemId === 'clone-wars-s06e10' && c.worldId === 'oba-diah').note, /separate unnamed moon/i);

// Remaining-title audit: reviewed evidence and explicit boundaries.
for (const pair of ["clone-wars-s01e07:ruusan-moon", "clone-wars-s01e09:rodia", "clone-wars-s01e10:vassek-third-moon", "clone-wars-s02e13:mandalore", "clone-wars-s02e20:vanqor", "clone-wars-s03e15:mortis", "clone-wars-s03e19:lola-sayu", "clone-wars-s04e16:nal-hutta", "clone-wars-s05e07:ilum", "clone-wars-s05e10:coruscant", "clone-wars-s05e13:abafar", "clone-wars-s05e14:zanbar", "clone-wars-s05e14:mustafar", "clone-wars-s05e14:nal-hutta", "clone-wars-s05e14:tatooine", "clone-wars-s05e18:coruscant", "clone-wars-s06e03:kamino", "clone-wars-s06e09:zardossa-stix", "clone-wars-s06e12:force-planet", "clone-wars-s07e07:oba-diah", "clone-wars-s07e08:oba-diah", "clone-wars-s07e08:coruscant", "clone-wars-s04e14:carlac"]) assert(pairs.has(pair), `Missing reviewed remaining-title association: ${pair}`);
assert(!pairs.has('clone-wars-s01e07:ruusan'), 'Ruusan moon must remain separate from the parent planet');
assert(!pairs.has('clone-wars-s01e10:vassek'), 'Vassek third moon is not the parent planet');
assert(!pairs.has('clone-wars-s06e12:moraband'), 'Setting course for Moraband is not an arrival in Destiny');
assert(!pairs.has('clone-wars-s07e08:mandalore'), 'A traced holographic signal is not Ahsoka visiting Mandalore');
assert(!pairs.has('clone-wars-s04e16:serenno'), 'Proposed rendezvous is not a verified landing');
for (const entry of CONNECTION_COVERAGE.reviewedWithoutPlanetLink) {
  assert(ids.has(entry.itemId));
  assert(!covered.has(entry.itemId), `Reviewed gap already has a connection: ${entry.itemId}`);
  assert.equal(new URL(entry.sourceUrl).hostname, 'www.starwars.com');
}

// Ahsoka episode evidence distinguishes visions, orbital arrivals and future destinations.
const ahsoka = CONNECTIONS.filter(link => link.itemId.startsWith('ahsoka-'));
assert.equal(ahsoka.length, 14);
assert.equal(new Set(ahsoka.map(link=>link.itemId)).size, 8);
assert.match(ahsoka.find(link=>link.itemId==='ahsoka-s01e05'&&link.worldId==='mandalore').note,/Vision.*not present-day/i);
assert.match(ahsoka.find(link=>link.itemId==='ahsoka-s01e08'&&link.worldId==='dathomir').note,/orbital.*not a claimed surface/i);
assert(!pairs.has('ahsoka-s01e04:peridea'),'Calculating a route is not arriving at Peridea');
assert(!pairs.has('ahsoka-s01e05:lothal'),'Related World Between Worlds biography is not episode-specific Lothal evidence');
assert.match(ahsoka.find(link=>link.worldId==='peridea').note,/another galaxy/);
