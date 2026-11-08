// Offline checks for deploy-cloudflare.mjs helpers. No network, no credentials.
import assert from 'node:assert/strict';
import { contentTypeFor, headersFile, contentSecurityPolicy, buildAssetManifest } from './deploy-cloudflare.mjs';
for (const [f,t] of Object.entries({'a.ico':'image/x-icon','a.txt':'text/plain; charset=utf-8','a.xml':'application/xml; charset=utf-8','a.js.map':'application/json; charset=utf-8','a.mp3':'audio/mpeg','a.gif':'image/gif','a.avif':'image/avif','a.json':'application/json; charset=utf-8','a.woff2':'font/woff2','a.svg':'image/svg+xml','A.PNG':'image/png','a.bin':'application/octet-stream'})) assert.equal(contentTypeFor(f),t,f);
const h=headersFile();
for (const s of ['X-Content-Type-Options: nosniff','Referrer-Policy:','Content-Security-Policy-Report-Only:',"frame-ancestors 'none'",'/assets/*','immutable']) assert.ok(h.includes(s),s);
for (const d of ["default-src 'self'","object-src 'none'","base-uri 'self'",'https://fonts.googleapis.com','https://fonts.gstatic.com']) assert.ok(contentSecurityPolicy.includes(d),d);
assert.ok(!/unsafe-eval|script-src[^;]*unsafe-inline/.test(contentSecurityPolicy));
assert.ok(h.split('\n').every(l=>l.length<2000));
// Requires a prior `npm run build` (reads dist/).
const { files, manifest, contents } = await buildAssetManifest('dist');
assert.ok(files.length>0 && Object.keys(manifest).length===files.length);
assert.ok(manifest['/index.html']);
for (const m of Object.values(manifest)) assert.ok(contents[m.hash].type!=='application/octet-stream');
console.log(JSON.stringify({ok:true,assets:files.length,types:[...new Set(Object.values(contents).map(c=>c.type))]}));
console.log(h);
