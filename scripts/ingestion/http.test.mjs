import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { createSourceClient, digest } from './http.mjs';

const url = 'https://api.tvmaze.com/shows/38963';
async function cleanup(cacheDir) {
  const target = resolve(cacheDir);
  if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith('atlas-source-')) throw new Error('Unexpected temporary cleanup target');
  await rm(target, { recursive: true, force: true });
}
test('source cache deduplicates requests and archives both revisions across refreshes', async () => {
  const cacheDir = await mkdtemp(join(tmpdir(), 'atlas-source-'));
  try {
    let calls = 0;
    const source = createSourceClient({ cacheDir, fetchImpl: async () => { calls++; return new Response('{"revision":1}'); } });
    assert.deepEqual(await Promise.all([source.requestJson(url), source.requestJson(url)]), [{ revision: 1 }, { revision: 1 }]);
    assert.equal(calls, 1);
    const cached = createSourceClient({ cacheDir, fetchImpl: () => { throw new Error('Cache should avoid network'); } });
    assert.deepEqual(await cached.requestJson(url), { revision: 1 });
    assert.equal(cached.stats.cacheHits, 1);
    const refreshed = createSourceClient({ cacheDir, refresh: true, fetchImpl: async () => new Response('{"revision":2}') });
    assert.deepEqual(await refreshed.requestJson(url), { revision: 2 });
    for (const body of ['{"revision":1}', '{"revision":2}']) assert.equal(await readFile(join(cacheDir, 'snapshots', digest(body) + '.json'), 'utf8'), body);
    const path = join(cacheDir, digest(url) + '.json');
    const corrupt = JSON.parse(await readFile(path, 'utf8')); corrupt.body = '{"tampered":true}';
    await writeFile(path, JSON.stringify(corrupt));
    const repaired = createSourceClient({ cacheDir, fetchImpl: async () => new Response('{"revision":3}') });
    assert.deepEqual(await repaired.requestJson(url), { revision: 3 });
    assert.equal(repaired.stats.cacheHits, 0);
  } finally { await cleanup(cacheDir); }
});

test('upstream denial is not retried, throttling is retried, foreign origins never fetch', async () => {
  const cacheDir = await mkdtemp(join(tmpdir(), 'atlas-source-'));
  try {
    let calls = 0;
    const denied = createSourceClient({ cacheDir, fetchImpl: async () => { calls++; return new Response('', { status: 403 }); } });
    await assert.rejects(denied.requestJson(url), /HTTP 403/); assert.equal(calls, 1);
    await assert.rejects(denied.requestJson('https://example.com/secret'), /Unapproved/); assert.equal(calls, 1);
    calls = 0;
    const throttled = createSourceClient({ cacheDir, fetchImpl: async () => ++calls === 1 ? new Response('', { status: 429, headers: { 'retry-after': '.001' } }) : new Response('{"ok":true}') });
    assert.deepEqual(await throttled.requestJson(url), { ok: true }); assert.equal(calls, 2); assert.equal(throttled.stats.retries, 1);
    calls = 0;
    const deferred = createSourceClient({ cacheDir, refresh: true, fetchImpl: async () => { calls++; return new Response('', { status: 429, headers: { 'retry-after': new Date(Date.now() + 120000).toUTCString() } }); } });
    await assert.rejects(deferred.requestJson(url), /later retry/); assert.equal(calls, 1);
  } finally { await cleanup(cacheDir); }
});
