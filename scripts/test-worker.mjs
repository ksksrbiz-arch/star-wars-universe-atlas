import assert from 'node:assert/strict';
import { Client } from 'pg';
import worker from '../cloudflare/worker.mjs';

const metadata = {
  size: 10, httpEtag: '"version-2"', uploaded: new Date('2026-11-07T12:00:00Z'),
  writeHttpMetadata(headers) { headers.set('Content-Type', 'text/plain'); },
};
let object, lastRead;
const pending = [];
const env = {
  HYPERDRIVE: { connectionString: 'postgresql://unused' },
  PUBLISHED_ASSETS: { async get(key, options) { lastRead = { key, options }; if(object instanceof Error) throw object; return object; }, async head() { return metadata; } },
  ASSETS: { async fetch() { return new Response('app'); } },
};
const request = (path, options) => worker.fetch(new Request(`https://atlas.example${path}`, options), env, {waitUntil(promise) { pending.push(promise); }});

object = metadata;
assert.equal((await request('/media/test', {headers:{'If-Match':'"old"'}})).status, 412);
assert.equal((await request('/media/test', {headers:{'If-Unmodified-Since':'Fri, 06 Nov 2026 12:00:00 GMT'}})).status, 412);
assert.equal((await request('/media/test', {headers:{'If-None-Match':'"version-2"'}})).status, 304);
assert.equal((await request('/media/test', {headers:{'If-Match':'"version-2"','If-None-Match':'"version-2"'}})).status, 304);

for (const [range, body, contentRange] of [
  [{offset:2,length:3}, '234', 'bytes 2-4/10'],
  [{suffix:3}, '789', 'bytes 7-9/10'],
  [{length:3}, '012', 'bytes 0-2/10'],
]) {
  object = {...metadata, range, body};
  const response = await request('/media/test', {headers:{Range:'bytes=-3'}});
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), contentRange);
  assert.equal(response.headers.get('Content-Length'), '3');
  assert.equal(await response.text(), body);
}
object = {...metadata, body:'0123456789'};
await request('/media/test', {headers:{Range:'bytes=2-4','If-Range':'"old"'}});
assert.equal(lastRead.options.range, undefined, 'If-Range must not serve an unchecked partial representation');
const head = await request('/media/test', {method:'HEAD',headers:{Range:'bytes=2-4'}});
assert.equal(lastRead.options.range, undefined);
assert.equal(head.status, 200);
assert.equal(head.headers.get('Content-Length'), '10');
assert.equal(await head.text(), '');
await request('/media/world%20art.svg');
assert.equal(lastRead.key, 'world art.svg');
assert.equal((await request('/media/%ZZ')).status, 404);
assert.equal((await request('/media/%2e%2e%2fprivate')).status, 404);
object = new Error('get: The requested range is not satisfiable. (10039)');
const invalidRange = await request('/media/test', {headers:{Range:'bytes=100-200'}});
assert.equal(invalidRange.status, 416);
assert.equal(invalidRange.headers.get('Content-Range'), 'bytes */10');
object = null;
assert.equal((await request('/media/missing')).status, 404);
assert.equal(await (await request('/media/missing', {method:'HEAD'})).text(), '');
assert.equal((await request('/api/unknown')).status, 404);
assert.equal((await request('/api/catalog', {method:'POST'})).status, 405);

const originals = {connect:Client.prototype.connect,query:Client.prototype.query,end:Client.prototype.end};
try {
  Client.prototype.connect = async () => {};
  Client.prototype.query = async () => ({rows:[{payload:{id:'test'}}]});
  Client.prototype.end = async () => {};
  assert.deepEqual(await (await request('/api/catalog')).json(), {items:[{id:'test'}]});
  const response = await request('/api/catalog', {method:'HEAD'});
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=60, s-maxage=300');
} finally {
  await Promise.all(pending);
  Object.assign(Client.prototype, originals);
}
console.log('Worker regressions passed: conditional media, ranges, encoded keys, read-only routes, and HEAD responses (mocked R2/Postgres).');
