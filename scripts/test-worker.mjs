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
// R2 can attach full-range metadata to reads that did not request partial content.
object = {...metadata, range:{offset:0,length:10}, body:'0123456789'};
for (const [method,headers] of [['GET',{}],['HEAD',{}],['HEAD',{Range:'bytes=2-4'}],['GET',{Range:'bytes=2-4','If-Range':'"old"'}]]) {
  const unrestricted = await request('/media/test',{method,headers});
  assert.equal(lastRead.options.range,undefined,'Unrestricted and HEAD reads must not pass Range to R2');
  assert.equal(unrestricted.status,200,`${method} must not inherit unsolicited R2 range metadata`);
  assert.equal(unrestricted.headers.get('Content-Range'),null);
  assert.equal(unrestricted.headers.get('Content-Length'),'10');
  assert.equal(await unrestricted.text(),method==='HEAD'?'':'0123456789');
}
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

// Hardening: headers on error responses, CSP on media, traversal, generic R2 failures.
const nosniff = response => assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
const sandboxed = response => assert.match(response.headers.get('Content-Security-Policy'), /sandbox/);
{
  const post = await request('/api/catalog', {method:'POST'});
  nosniff(post);
  assert.equal(post.headers.get('Allow'), 'GET, HEAD');
  object = null;
  const missing = await request('/media/missing');
  nosniff(missing); sandboxed(missing);
  object = new Error('get: The requested range is not satisfiable. (10039)');
  const range416 = await request('/media/test', {headers:{Range:'bytes=100-200'}});
  assert.equal(range416.status, 416); nosniff(range416); sandboxed(range416);
  const full = {...metadata, body:'0123456789'}; object = full;
  const ok = await request('/media/test');
  nosniff(ok); sandboxed(ok);
  object = metadata;
  const notModified = await request('/media/test', {headers:{'If-None-Match':'"version-2"'}});
  assert.equal(notModified.status, 304); nosniff(notModified); sandboxed(notModified);
  assert.equal(notModified.headers.get('ETag'), '"version-2"');
  object = full;
  const mediaHead = await request('/media/test', {method:'HEAD'});
  assert.equal(mediaHead.status, 200); nosniff(mediaHead); sandboxed(mediaHead);
  assert.equal(mediaHead.headers.get('Content-Length'), '10');
  assert.equal((await request('/media/test', {method:'POST'})).status, 405);

  // Traversal (raw dot segments are normalized by URL parsing before the worker runs): whole '..' segments are rejected (raw, encoded, backslash); '..' inside a name is allowed.
  for (const path of ['/media/%2e%2e%2fprivate', '/media/a%5C..%5Cb', '/media/a%2f%2E%2E%2fb', '/media/..%2f..%2fx', '/media/a%2f..']) {
    lastRead = undefined; object = metadata;
    const blocked = await request(path);
    assert.equal(blocked.status, 404, path); nosniff(blocked);
    assert.equal(lastRead, undefined, `${path} must not reach R2`);
  }
  for (const [path, key] of [['/media/a..b.png', 'a..b.png'], ['/media/dir/..hidden', 'dir/..hidden'], ['/media/x%2E%2Ey/z', 'x..y/z']]) {
    object = full;
    assert.equal((await request(path)).status, 200, path);
    assert.equal(lastRead.key, key);
  }

  // Generic R2 failure -> clean 503 without details; the logged string is constant.
  const logged = []; const realError = console.error; console.error = (...args) => logged.push(args);
  try {
    object = new Error('secret-token R2 exploded');
    for (const headers of [{}, {Range:'bytes=1-2'}]) {
      const failed = await request('/media/test', {headers});
      assert.equal(failed.status, 503); nosniff(failed); sandboxed(failed);
      assert.doesNotMatch(await failed.text(), /secret|exploded/);
    }
    assert.ok(logged.length === 2 && logged.every(args => args.length === 1 && !/secret/.test(String(args[0]))));
    // InvalidRange for an object that vanished (head() null) is a 404, not a bare 416.
    object = new Error('InvalidRange (10039)');
    { const h = env.PUBLISHED_ASSETS.head; env.PUBLISHED_ASSETS.head = async () => null;
      try { assert.equal((await request('/media/test', {headers:{Range:'bytes=9-99'}})).status, 404); } finally { env.PUBLISHED_ASSETS.head = h; } }
    // InvalidRange followed by a failing head() is also a 503, not an unhandled throw.
    object = new Error('InvalidRange (10039)');
    const headFail = env.PUBLISHED_ASSETS.head; env.PUBLISHED_ASSETS.head = async () => { throw new Error('head failed'); };
    try { assert.equal((await request('/media/test', {headers:{Range:'bytes=9-99'}})).status, 503); }
    finally { env.PUBLISHED_ASSETS.head = headFail; }
  } finally { console.error = realError; }
}

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
console.log('Worker regressions passed: conditional media, ranges, encoded keys, traversal, security headers, R2 failures, read-only routes, and HEAD responses (mocked R2/Postgres).');
