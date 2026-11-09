import test from 'node:test';
import assert from 'node:assert/strict';
import { collectDatabank } from './databank.mjs';
import { collectWookieepedia } from './wookieepedia.mjs';
import { collectTvmaze } from './tvmaze.mjs';

test('Databank pagination retains fixed offsets and stable IDs at a partial-page cap', async () => {
  const calls = [];
  const result = await collectDatabank({ maxRecords: 150, requestJson: async address => {
    const url = new URL(address), page = Number(url.searchParams.get('page')), limit = Number(url.searchParams.get('limit'));
    calls.push({ page, limit });
    return { info: { total: 220, next: page < 3 ? 'next' : null }, data: Array.from({ length: Math.min(limit, 220 - (page - 1) * limit) }, (_, i) => ({ _id: `${url.pathname}-${(page - 1) * limit + i}`, name: `Entity ${(page - 1) * limit + i}`, description: 'Source description', image: 'https://lumiere-a.akamaihd.net/example.jpg' })) };
  } });
  assert.equal(result.records.length, 300); assert.equal(new Set(result.records.map(row => row.providerId)).size, 300);
  assert.deepEqual(calls.map(row => row.limit), [100, 100, 100, 100]);
  assert.deepEqual(result.errors, []);
});

test('Wiki keeps revisions, continuity and image metadata without inventing coordinates', async () => {
  const result = await collectWookieepedia({ titles: ['Ilum', 'Ilum/Legends'], requestJson: async address => {
    const url = new URL(address);
    if (url.searchParams.get('prop') === 'imageinfo') return { query: { pages: { 9: { pageid: 9, title: 'File:Ilum.png', imageinfo: [{ url: 'https://static.wikia.nocookie.net/starwars/images/ilum.png', width: 735, height: 755, mime: 'image/png', sha1: 'fixture-hash', timestamp: '2026-01-01T00:00:00Z' }] } } } };
    const page = (id, title, category) => ({ pageid: id, title, fullurl: `https://starwars.fandom.com/wiki/${title}`, categories: [{ title: category }], revisions: [{ revid: id + 100, timestamp: '2026-01-01T00:00:00Z', slots: { main: { '*': '|image=Ilum.png\n==Appearances==\n*{{TCW|The Gathering (episode)}}{{Flash}}' } } }] });
    return { query: { pages: { 1: page(1, 'Ilum', 'Category:Canon articles'), 2: page(2, 'Ilum/Legends', 'Category:Legends articles') } } };
  } });
  assert.deepEqual(result.records.map(row => row.continuity), ['canon', 'legends']);
  assert.equal(result.records[0].revisionId, 101); assert.equal(result.records[0].media[0].width, 735);
  assert.match(result.records[0].raw.wikitext, /\{\{Flash\}\}/);
  assert(result.records.every(row => !Object.hasOwn(row, 'x') && !Object.hasOwn(row, 'y')));
});

test('TVmaze preserves specials/future placeholders and does not call actor portraits character art', async () => {
  const image = { original: 'https://static.tvmaze.com/example.jpg', medium: 'https://static.tvmaze.com/example-small.jpg' };
  const result = await collectTvmaze({ showIds: [38963], requestJson: async address => {
    if (new URL(address).pathname.endsWith('/images')) return [];
    return { id: 38963, name: 'The Mandalorian', url: 'https://www.tvmaze.com/shows/38963/the-mandalorian', image,
      _embedded: { episodeswithspecials: [{ id: 1, name: 'Chapter 1', season: 1, number: 1, type: 'regular', airdate: '2019-11-12', image }, { id: 2, name: 'Special', season: 1, number: null, type: 'significant_special' }, { id: 3, name: 'TBA', season: 9, number: 1, airdate: null }], cast: [{ person: { id: 7, name: 'An Actor', image }, character: { id: 8, name: 'A Character', image: { original: 'https://static.tvmaze.com/character.jpg' } } }] } };
  } });
  const episodes = result.records.filter(row => row.entityType === 'episode');
  assert.equal(episodes.length, 3); assert.equal(episodes[1].episode, undefined);
  const person = result.records.find(row => row.entityType === 'person');
  assert.equal(person.name, 'An Actor'); assert.equal(person.media[0].kind, 'person-image');
  assert.equal(result.records.some(row => row.name === 'A Character'), false);
  assert.deepEqual(result.errors, []);
});
