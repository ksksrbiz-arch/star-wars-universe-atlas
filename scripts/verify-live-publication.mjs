// Read-only release verification: compare public data with the reviewed publication.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { appearanceDigest, datasetDigest } from './appearance-publication.mjs';

const base = process.env.ATLAS_URL || 'https://star-wars-universe-atlas.skdev-371.workers.dev';
const manifest = JSON.parse(await readFile('db/publications/appearances.json', 'utf8'));
const datasets = [
  ['catalog', 'works', 'catalogSha256', datasetDigest],
  ['worlds', 'worlds', 'worldsSha256', datasetDigest],
  ['appearances', 'appearances', 'sha256', appearanceDigest],
  ['sequences', 'sequences', 'sequencesSha256', datasetDigest],
];
const results = await Promise.all(datasets.map(async ([route, countKey, hashKey, digest]) => {
  const response = await fetch(`${base}/api/${route}?publication=${encodeURIComponent(manifest.id)}`, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, route);
  const { items } = await response.json();
  assert(Array.isArray(items), `${route}: expected items`);
  assert.equal(items.length, manifest[countKey], `${route}: count differs`);
  const sha256 = digest(items);
  assert.equal(sha256, manifest[hashKey], `${route}: content differs`);
  return { route, count: items.length, sha256 };
}));
const report = { checkedAt: new Date().toISOString(), base, publication: manifest.id, results };
if (process.env.ATLAS_EVIDENCE_DIR) {
  await mkdir(process.env.ATLAS_EVIDENCE_DIR, { recursive: true });
  await writeFile(`${process.env.ATLAS_EVIDENCE_DIR}/public-data.json`, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
