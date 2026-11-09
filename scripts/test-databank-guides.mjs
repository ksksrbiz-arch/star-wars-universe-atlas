import assert from 'node:assert/strict';
import { DATABANK_GUIDES } from '../src/databankGuides.ts';
import { WORLD_DOSSIERS } from '../src/worldDossiers.ts';
import { getLocation } from '../src/locations.ts';
import { ALL_WORLDS } from '../src/journeyWorlds.ts';

const official = (url, path) => {
  const parsed = new URL(url);
  assert.equal(parsed.origin, 'https://www.starwars.com');
  assert(parsed.pathname.startsWith(path));
};
let connections = 0, videos = 0, galleries = 0;
for (const [id, guide] of Object.entries(DATABANK_GUIDES)) {
  assert.equal(guide.worldId, id);
  assert(WORLD_DOSSIERS[id] && (getLocation(id) || ALL_WORLDS.some(world => world.id === id)), 'Guide must resolve to an existing destination identity');
  official(guide.sourceUrl, '/databank/');
  assert.match(guide.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert(guide.environment.length >= 2);
  for (const fact of guide.environment) {
    official(fact.sourceUrl, '/databank/');
    assert(fact.label && fact.text.length > 20);
  }
  assert.equal(new Set(guide.connections.map(item => item.id)).size, guide.connections.length);
  for (const item of guide.connections) {
    official(item.sourceUrl, '/databank/');
    assert(item.summary.length > 30);
    for (const key of ['itemId', 'episodeId', 'x', 'y', 'sequence', 'latitude', 'longitude']) assert(!(key in item));
    connections++;
  }
  assert.equal(new Set(guide.media.map(item => item.id)).size, guide.media.length);
  for (const item of guide.media) {
    official(item.url, item.kind === 'video' ? '/video/' : '/databank/');
    official(item.sourceUrl, '/databank/');
    assert.equal(item.fallbackUrl, guide.sourceUrl);
    assert(item.credit && item.useBasis.includes('Link'));
    assert(!('imageUrl' in item) && !('embedUrl' in item));
    if (item.kind === 'video') videos++; else { galleries++; assert(item.imageCount > 0); }
  }
}
assert.equal(DATABANK_GUIDES.serenno.media.find(item => item.kind === 'gallery').imageCount, 15);
assert.equal(videos, 6);
console.log(`PASS ${Object.keys(DATABANK_GUIDES).length} reviewed destination identities, ${connections} source-linked connections, ${videos} videos and ${galleries} gallery; no inferred catalog joins or reusable asset URLs`);
