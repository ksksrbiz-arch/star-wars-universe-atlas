import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256Lf } from './lib-hash.mjs';

const { metadata, items } = JSON.parse(readFileSync(new URL('../src/catalog.generated.json', import.meta.url), 'utf8'));
assert.equal(items.length, 324);
assert.equal(new Set(items.map(item => item.id)).size, 324, 'Catalog IDs must be unique');
assert.equal(items.filter(item => item.kind === 'episode').length, 315);
assert.equal(items.filter(item => item.kind === 'film').length, 9);
assert.equal(metadata.excludedSpecials.length, 9);
assert.equal(metadata.chronologySupported, false);
const allowed = new Set(['id', 'title', 'seriesId', 'kind', 'season', 'episode', 'releaseDate', 'runtimeMinutes', 'runtimeNote', 'sourceUrl', 'storyOrder', 'episodeEnd']);
const expectedSeasons = { 'obi-wan': [6], 'bad-batch': [16,16,15], 'boba-fett': [7], andor: [12, 12], 'clone-wars': [22, 22, 22, 22, 20, 13, 12], mandalorian: [8, 8, 8], ahsoka: [8] };
const episodeKeys = new Set();
for (const item of items) {
  for (const key of Object.keys(item)) assert.ok(allowed.has(key), `Unexpected field ${item.id}.${key}`);
  for (const key of ['id', 'title', 'seriesId', 'releaseDate', 'sourceUrl']) assert.ok(typeof item[key] === 'string' && item[key].trim(), `${item.id}: missing ${key}`);
  assert.ok(['solo', 'obi-wan', 'bad-batch', 'rebels', 'pt', 'ot', 'andor', 'clone-wars', 'mandalorian', 'ahsoka', 'rogue-one', 'boba-fett'].includes(item.seriesId));
  assert.match(item.releaseDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(item.releaseDate).toISOString().slice(0, 10), item.releaseDate, `Invalid date ${item.id}`);
  assert.equal(new URL(item.sourceUrl).protocol, 'https:');
  assert.ok(item.runtimeMinutes === null || (Number.isInteger(item.runtimeMinutes) && item.runtimeMinutes > 0));
  assert.ok(!('storyOrder' in item), 'No unsupported chronology values');
  if (item.kind === 'episode') {
    assert.ok(Number.isInteger(item.season) && item.season > 0);
    assert.ok(Number.isInteger(item.episode) && item.episode > 0);
    const key = `${item.seriesId}:${item.season}:${item.episode}`;
    assert.ok(!episodeKeys.has(key), `Duplicate episode ${key}`);
    episodeKeys.add(key);
    assert.ok(['www.tvmaze.com', ...(item.id === 'rebels-s01e01' ? ['www.starwars.com'] : [])].includes(new URL(item.sourceUrl).hostname));
    if (item.seriesId === 'clone-wars') {
      assert.equal(item.runtimeMinutes, null, 'Unverified uniform TV runtime must not be published');
      assert.match(item.runtimeNote, /30-minute/);
    }
  } else {
    assert.equal(item.kind, 'film');
    assert.ok(!('season' in item) && !('episode' in item), 'Films are not episode zero');
    assert.ok(metadata.filmReleaseDateNotes[item.id]);
  }
}
for (const [series, seasons] of Object.entries(expectedSeasons)) {
  seasons.forEach((count, index) => {
    const episodes = items.filter(item => item.seriesId === series && item.kind === 'episode' && item.season === index + 1);
    assert.equal(episodes.length, count, `${series} season ${index + 1} count`);
    assert.deepEqual(episodes.map(item => item.episode).sort((a,b) => a-b), Array.from({ length: count }, (_, i) => i + 1), `${series} season ${index + 1} numbering`);
  });
}
assert.equal(items.filter(item => item.seriesId === 'ot').length, 3);
assert.equal(items.filter(item => item.seriesId === 'clone-wars').length, 134);
assert.ok(items.some(item => item.id === 'clone-wars-film' && item.kind === 'film' && item.runtimeMinutes === null));
console.log('Catalog checks passed: 324 items, 315 episode watch records, nine separate films, nine specials excluded, sources and uncertainty retained.');

assert.equal(metadata.originalAuditCohortCount, 185);
assert.equal(items.filter(item => !['solo', 'obi-wan', 'bad-batch', 'rebels', 'ahsoka', 'rogue-one', 'boba-fett', 'pt'].includes(item.seriesId)).length, 185);
const ahsokaSource = JSON.parse(readFileSync(new URL('../docs/ahsoka-season-1-source.json', import.meta.url), 'utf8'));
for (const source of ahsokaSource.episodes) {
  const item = items.find(item => item.id === `ahsoka-s01e${String(source.number).padStart(2, '0')}`);
  assert.equal(item.title, source.name); assert.equal(item.releaseDate, source.airdate); assert.equal(item.sourceUrl, source.url); assert.equal(item.runtimeMinutes, null);
}

// Source-file hashes are computed over LF-normalised bytes (see scripts/lib-hash.mjs).
for (const { name, sha256 } of metadata.sourceFiles) {
  assert.equal(sha256Lf(readFileSync(new URL(`../docs/${name}`, import.meta.url))), sha256, `Stale source hash for ${name}; rerun python3 scripts/build-catalog.py`);
}
