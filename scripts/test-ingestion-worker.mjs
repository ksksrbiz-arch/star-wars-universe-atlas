import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import worker, { scheduledTask, isAuthorized, readBounded, variantUrl, approvedImageUrl, imageDetails, deliverMediaItem, digest, storeDelivered, storeDeliveryFailure, pendingMedia, mediaBatch, runMetadata } from '../cloudflare/ingestion-worker.mjs';
import { publishRecords } from './ingestion/publication-plan.mjs';

test('one cron phases daily refreshes and resumes media between refreshes', () => {
  assert.equal(scheduledTask(Date.parse('2026-11-09T04:00:00Z')), 'databank');
  assert.equal(scheduledTask(Date.parse('2026-11-09T04:15:00Z')), 'tvmaze');
  assert.equal(scheduledTask(Date.parse('2026-11-09T04:30:00Z')), 'wookieepedia');
  assert.equal(scheduledTask(Date.parse('2026-11-09T04:45:00Z')), 'media');
  assert.equal(scheduledTask(Date.parse('2026-11-09T14:00:00Z')), 'media');
});

test('execution metadata distinguishes real scheduled timestamps from manual operation', () => {
  assert.deepEqual(runMetadata(), { trigger: 'manual' });
  assert.deepEqual(runMetadata({ scheduledTime: Date.now() }), { trigger: 'manual' });
  assert.deepEqual(runMetadata({ trigger: 'scheduled', scheduledTime: Date.parse('2026-11-09T22:15:00Z') }), { trigger: 'scheduled', scheduledTime: '2026-11-09T22:15:00.000Z' });
  assert.throws(() => runMetadata({ trigger: 'scheduled', scheduledTime: 'invalid' }), /valid timestamp/);
});

test('media batch bounds concurrent deliveries to three, serializes transactions, and awaits failures and results', async () => {
  const items = Array.from({ length: 8 }, (_, index) => ({ id: String(index), provider: 'databank', providerId: `record-${index}` }));
  let active = 0, peak = 0, dbActive = 0, dbPeak = 0;
  const saved = [], failures = [];
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const output = await mediaBatch({}, {}, items, {
    async deliver(item) {
      active++; peak = Math.max(peak, active);
      await delay(8 + Number(item.id) % 3);
      active--;
      if (item.id === '2') throw new Error('Unavailable source');
      return { ...item, src: `/media/${item.id}.jpg` };
    },
    async persist(client, item) { dbActive++; dbPeak = Math.max(dbPeak, dbActive); await delay(3); saved.push(item.id); dbActive--; },
    async fail(client, item) { dbActive++; dbPeak = Math.max(dbPeak, dbActive); await delay(3); failures.push(item.id); dbActive--; throw new Error('Backoff write unavailable'); },
  });
  assert.equal(peak, 3);
  assert.equal(dbPeak, 1, 'transactions sharing a connection never overlap');
  assert.equal(active, 0); assert.equal(dbActive, 0);
  assert.equal(saved.length, 7); assert.deepEqual(failures, ['2']);
  assert.deepEqual(output.items.map(row => row.id), ['0', '1', '3', '4', '5', '6', '7']);
  assert.deepEqual(output.errors.map(row => row.id), ['2']);
  assert.equal(output.errors[0].backoffStored, false, 'a backoff-write failure does not abandon the other in-flight deliveries');
});

test('private endpoints reject missing, short and incorrect tokens without touching bindings', async () => {
  const secret = 'a'.repeat(48);
  assert.equal(await isAuthorized(new Request('https://private/health', { headers: { Authorization: `Bearer ${secret}` } }), secret), true);
  for (const authorization of ['', `Bearer ${secret.slice(1)}`, `Bearer ${secret}x`]) {
    const result = await worker.fetch(new Request('https://private/health', { headers: { Authorization: authorization } }), { INGESTION_TOKEN: secret });
    assert.equal(result.status, 404);
  }
  assert.equal(await isAuthorized(new Request('https://private/health', { headers: { Authorization: 'Bearer short' } }), 'short'), false);
  const health = await worker.fetch(new Request('https://private/health', { headers: { Authorization: `Bearer ${secret}` } }), { INGESTION_TOKEN: secret });
  assert.equal(health.status, 200);
  assert.equal(health.headers.get('cache-control'), 'no-store');
});

test('image URL allowlist rejects credential, port, local and arbitrary origins', () => {
  for (const url of ['http://static.tvmaze.com/a.jpg', 'https://example.com/a.jpg', 'https://127.0.0.1/a.png', 'https://x:secret@static.tvmaze.com/a.jpg', 'https://static.tvmaze.com:8443/a.jpg']) assert.throws(() => approvedImageUrl(url));
  assert.equal(variantUrl('https://static.tvmaze.com/uploads/images/original_untouched/1/2.jpg', 320), 'https://static.tvmaze.com/uploads/images/medium_landscape/1/2.jpg');
  assert.equal(new URL(variantUrl('https://lumiere-a.akamaihd.net/a.jpg?width=2000', 320)).searchParams.get('width'), '320');
});

test('stream byte limit applies even without content-length', async () => {
  const response = new Response(new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(5)); controller.enqueue(new Uint8Array(8)); controller.close(); } }));
  await assert.rejects(() => readBounded(response, 10), /byte limit/);
  await assert.rejects(() => readBounded(new Response('not downloaded', { headers: { 'Content-Length': '100' } }), 10), /byte limit/);
});

test('HTML, SVG and incomplete PNG signatures cannot become published raster media', () => {
  assert.throws(() => imageDetails(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>')));
  assert.throws(() => imageDetails(new Uint8Array([137, 80, 78, 71, ...new Array(40).fill(0)])));
});

test('lossless WebP artwork dimensions are preserved for original-resolution delivery', () => {
  const bytes = new Uint8Array(30), view = new DataView(bytes.buffer);
  bytes.set(new TextEncoder().encode('RIFF'),0);bytes.set(new TextEncoder().encode('WEBP'),8);bytes.set(new TextEncoder().encode('VP8L'),12);bytes[20]=0x2f;
  view.setUint32(21,(3999<<14)|2619,true);
  assert.deepEqual(imageDetails(bytes),{mime:'image/webp',extension:'webp',width:2620,height:4000});
});

test('delivery publishes content-addressed assets with measured responsive widths and credits', async () => {
  const puts = [], fetches = [];
  // Minimal JPEG SOF header sufficient to inspect declared dimensions without a browser decoder.
  const jpeg = width => new Uint8Array([255,216,255,192,0,17,8,0,100,(width >> 8) & 255,width & 255,3,1,17,0,2,17,0,3,17,0,255,217]);
  const item = { id: 'f'.repeat(64), provider: 'databank', providerId: 'world', sourceUrl: 'https://lumiere-a.akamaihd.net/world.jpg', sourcePageUrl: 'https://example.com/source', credit: 'Lucasfilm', canonicalId: 'world', canonicalType: 'world', reviewEvidence: 'https://example.com/review' };
  const output = await deliverMediaItem(item, { PUBLISHED_ASSETS: { async put(key, bytes, metadata) { puts.push({ key, bytes, metadata }); } } }, async (url, options) => {
    fetches.push({ url, options }); return new Response(jpeg(Number(new URL(url).searchParams.get('width'))), { headers: { 'Content-Type': 'image/jpeg' } });
  });
  assert.equal(puts.length, 2);
  assert.equal(output.width, 1280);
  assert.match(output.srcSet, /320w, .*1280w/);
  assert.equal(output.sourceUrl, item.sourcePageUrl);
  assert.equal(output.reviewEvidence, item.reviewEvidence);
  assert.equal(output.sha256, await digest(puts[0].bytes));
  assert.equal(output.src, `/media/${puts[0].key}`);
  assert.equal(puts[0].metadata.httpMetadata.cacheControl, 'public, max-age=31536000, immutable');
  assert.equal(fetches[0].options.redirect, 'manual');
});

test('media endpoint validates item count before opening database connection', async () => {
  const secret = 'z'.repeat(48);
  const response = await worker.fetch(new Request('https://private/media', { method: 'POST', headers: { Authorization: `Bearer ${secret}` }, body: JSON.stringify({ items: new Array(17).fill({}) }) }), { INGESTION_TOKEN: secret });
  assert.equal(response.status, 400);
});

test('character cutout delivery retains actual source provenance and rejects JPEG substitution', async () => {
  const item = { provider: 'databank', providerId: 'character-1', kind: 'character-cutout', originProvider: 'Disney Wiki', provenance: { filePage: 'https://disney.fandom.com/wiki/File:Character.png', revision: 'reviewed-revision' }, sourceUrl: 'https://static.wikia.nocookie.net/disney/images/a/a1/Character.png/revision/latest', sourcePageUrl: 'https://disney.fandom.com/wiki/Han_Solo/Gallery', credit: 'Lucasfilm / Disney Wiki' };
  const png = width => {
    const bytes = new Uint8Array(33), view = new DataView(bytes.buffer);
    bytes.set([137,80,78,71,13,10,26,10]);view.setUint32(8,13);bytes.set([73,72,68,82],12);view.setUint32(16,width);view.setUint32(20,1800);bytes[24]=8;bytes[25]=6;
    return bytes;
  };
  const env = { PUBLISHED_ASSETS: { async put() {} } };
  const fetched = [];
  const output = await deliverMediaItem(item, env, async (url, options) => {
    fetched.push(url);
    assert.equal(options.headers.Accept, 'image/png,image/webp');
    return new Response(png(url.endsWith('/640') ? 640 : 2620), { headers: { 'Content-Type': 'image/png' } });
  });
  assert.equal(output.kind, item.kind);
  assert.equal(output.provider, 'databank', 'Association identity remains the existing Databank character');
  assert.equal(output.originProvider, 'Disney Wiki', 'Artwork source is retained independently from association provider');
  assert.deepEqual(output.provenance,item.provenance);
  assert.equal(output.sourceUrl,item.sourcePageUrl);
  assert.equal(output.credit,item.credit);
  assert.equal(fetched[0],item.sourceUrl,'Primary cutout uses the original asset URL without resizing');
  assert.equal(output.width,2620);
  assert.match(output.srcSet,/640w, .*2620w/);
  await assert.rejects(() => deliverMediaItem(item,env,async()=>new Response(new Uint8Array([255,216,255,217]),{headers:{'Content-Type':'image/jpeg'}})),/alpha-capable raster format/);
});

test('default media fetch retains the native global receiver used by Workers', async () => {
  const originalFetch = globalThis.fetch;
  const jpeg = new Uint8Array([255,216,255,192,0,17,8,0,100,1,64,3,1,17,0,2,17,0,3,17,0,255,217]);
  globalThis.fetch = function () {
    assert.equal(this, globalThis, 'Workers native fetch must retain its receiver');
    return Promise.resolve(new Response(jpeg, { headers: { 'Content-Type': 'image/jpeg' } }));
  };
  try {
    const output = await deliverMediaItem({ provider: 'databank', providerId: 'receiver-test', sourceUrl: 'https://lumiere-a.akamaihd.net/test.jpeg' }, { PUBLISHED_ASSETS: { async put() {} } });
    assert.equal(output.mime, 'image/jpeg');
  } finally { globalThis.fetch = originalFetch; }
});

test('real SQL refresh moves accepted image links, holds invalidated identities, and retries stale assets without losing good images', async () => {
  const db = new PGlite();
  try {
    await db.exec('CREATE ROLE atlas_reader');
    await db.exec(await readFile('db/002_enrichment.sql', 'utf8'));
    const now = Date.parse('2026-12-20T00:00:00Z');
    const oldUrl = 'https://lumiere-a.akamaihd.net/old.jpg', nextUrl = 'https://lumiere-a.akamaihd.net/new.jpg';
    const source = { provider: 'databank', providerId: 'planet-1', entityType: 'location', name: 'World', sourceUrl: 'https://example.com/world', payloadSha256: 'a'.repeat(64), collectedAt: '2026-11-01T00:00:00Z', media: [{ sourceUrl: oldUrl, credit: 'Creator' }] };
    const oldMedia = { id: await digest(oldUrl), provider: source.provider, providerId: source.providerId, src: '/media/sources/old.jpg', credit: 'Creator', sourceUrl: source.sourceUrl, sha256: 'b'.repeat(64), bytes: 1200, mime: 'image/jpeg', deliveredAt: '2026-11-01T00:00:00Z' };
    await publishRecords(db, [source], [oldMedia]);
    await db.query("INSERT INTO atlas_source_links(provider,provider_id,canonical_id,canonical_type,media_id,accepted) VALUES($1,$2,'world-1','world',$3,true),($1,$2,'held-world','world',$3,false)", [source.provider, source.providerId, oldMedia.id]);
    const stale = await pendingMedia(db, 16, now);
    assert.equal(stale.length, 1, 'delivered image older than 30 days re-enters queue');
    await storeDeliveryFailure(db, stale[0], now);
    const retained = (await db.query('SELECT payload,delivered FROM atlas_source_media WHERE id=$1', [oldMedia.id])).rows[0];
    assert.equal(retained.delivered, true);
    assert.equal(retained.payload.src, oldMedia.src);
    assert.equal(retained.payload.sourceUrl, source.sourceUrl, 'failure does not replace attribution page with image URL');
    assert.equal((await pendingMedia(db, 16, now + 1000)).length, 0, 'failed refresh cools down');
    assert.equal((await pendingMedia(db, 16, now + 86400001)).length, 1, 'cooldown eventually allows another attempt');
    const replacement = { ...oldMedia, id: await digest(nextUrl), src: '/media/sources/new.jpg', deliveredAt: new Date(now).toISOString() };
    await storeDelivered(db, replacement);
    const links = (await db.query('SELECT canonical_id,media_id,accepted FROM atlas_source_links ORDER BY canonical_id')).rows;
    assert.equal(links.find(row => row.accepted).media_id, replacement.id, 'accepted link follows successfully delivered replacement');
    assert.equal(links.find(row => !row.accepted).media_id, oldMedia.id, 'identity-invalidated link stays held');
    assert.equal((await db.query('SELECT payload FROM atlas_media_public')).rows[0].payload.src, replacement.src);
    await publishRecords(db, [{ ...source, media: [{ sourceUrl: nextUrl, credit: 'Creator' }], payloadSha256: 'c'.repeat(64), collectedAt: new Date(now).toISOString() }], []);
    assert.equal((await pendingMedia(db, 16, now + 1000)).length, 0, 'fresh replacement is not fetched repeatedly');
  } finally { await db.close(); }
});
