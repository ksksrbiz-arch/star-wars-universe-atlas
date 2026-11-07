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
