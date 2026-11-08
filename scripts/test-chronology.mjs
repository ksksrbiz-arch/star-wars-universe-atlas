import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { STORY_SEQUENCES, STORY_CONNECTIONS } from '../src/chronology.ts';

const { items } = JSON.parse(await readFile(new URL('../src/catalog.generated.json', import.meta.url), 'utf8'));
const catalog = new Map(items.map(item => [item.id, item]));
const expected = { solo: 1, 'obi-wan': 6, 'bad-batch': 47, rebels: 66, pt: 3, 'boba-fett': 7, 'clone-wars': 134, andor: 24, ot: 3, mandalorian: 24, ahsoka: 8, 'rogue-one': 1 };
const covered = [];
for (const sequence of STORY_SEQUENCES) {
  assert.equal(sequence.itemIds.length, expected[sequence.id], `${sequence.id} count`);
  assert.equal(new Set(sequence.itemIds).size, sequence.itemIds.length, `${sequence.id} duplicate IDs`);
  assert.deepEqual([...sequence.itemIds].sort(), items.filter(item => item.seriesId === sequence.id).map(item => item.id).sort(), `${sequence.id} exact catalog coverage`);
  assert.ok(sequence.sourceUrl.startsWith('https://www.starwars.com/'));
  assert.ok(sequence.caveats.length >= 2);
  for (const id of sequence.itemIds) assert.ok(catalog.has(id), `Unresolved story ID ${id}`);
  covered.push(...sequence.itemIds);
}
assert.equal(covered.length, 324);
assert.equal(new Set(covered).size, 324);
assert.equal(Object.keys(expected).length, STORY_SEQUENCES.length);

const cw = STORY_SEQUENCES.find(sequence => sequence.id === 'clone-wars').itemIds;
assert.deepEqual(cw.slice(0, 5), ['clone-wars-s02e16', 'clone-wars-s01e16', 'clone-wars-film', 'clone-wars-s03e01', 'clone-wars-s03e03']);
const before = (first, second) => assert.ok(cw.indexOf(first) < cw.indexOf(second), `${first} precedes ${second}`);
before('clone-wars-s03e08', 'clone-wars-s01e22');
before('clone-wars-s01e22', 'clone-wars-s03e09');
before('clone-wars-s03e11', 'clone-wars-s02e15');
before('clone-wars-s05e13', 'clone-wars-s05e01');
before('clone-wars-s05e01', 'clone-wars-s05e14');
assert.deepEqual(cw.slice(-12), [5,6,7,8,1,2,3,4,9,10,11,12].map(number => `clone-wars-s07e${String(number).padStart(2, '0')}`));
assert.equal(cw.filter(id => catalog.get(id).kind === 'film').length, 1);

for (const sequenceId of ['andor', 'mandalorian', 'ahsoka']) {
  const list = STORY_SEQUENCES.find(sequence => sequence.id === sequenceId).itemIds.map(id => catalog.get(id));
  for (let i = 1; i < list.length; i++) {
    const previous = list[i - 1], current = list[i];
    assert.ok(current.season > previous.season || (current.season === previous.season && current.episode === previous.episode + 1));
  }
}
assert.deepEqual(STORY_SEQUENCES.find(sequence => sequence.id === 'ot').itemIds, ['ot-a-new-hope', 'ot-empire-strikes-back', 'ot-return-of-the-jedi']);
for (const connection of STORY_CONNECTIONS) {
  assert.ok(STORY_SEQUENCES.some(sequence => sequence.id === connection.sequenceId));
  for (const id of [connection.afterItemId, connection.beforeItemId, ...(connection.itemIds || []), ...(connection.includedItemIds || [])].filter(Boolean)) assert.ok(catalog.has(id));
  assert.ok(connection.externalTitles.length > 0 || connection.includedItemIds?.length > 0);
  assert.ok(connection.sourceUrl.startsWith('https://www.starwars.com/'));
}
const boba = STORY_CONNECTIONS.find(connection => connection.id === 'mandalorian-boba-fett');
assert.equal(boba.externalTitles.length, 0);
assert.deepEqual(boba.includedItemIds, ['boba-fett-s01e05', 'boba-fett-s01e06', 'boba-fett-s01e07']);
assert.equal(boba.afterItemId, 'mandalorian-s02e08');
assert.equal(boba.beforeItemId, 'mandalorian-s03e01');
const overlap = STORY_CONNECTIONS.find(connection => connection.id === 'clone-wars-revenge-of-the-sith');
assert.equal(overlap.kind, 'overlap');
assert.equal(overlap.itemIds.length, 4);
assert.ok(!Object.hasOwn(overlap, 'afterItemId'), 'Overlap is not falsely serialized as watch-next');
console.log('Chronology passed: 324 unique catalog items, official Clone Wars reorder anchors, narrative sequences, sourced external bridges and overlap.');
