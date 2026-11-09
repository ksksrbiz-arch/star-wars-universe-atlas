#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { createSourceClient, digest } from './ingestion/http.mjs';
import { extractWikiAppearanceCandidates } from './ingestion/wiki-appearances.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const options = process.argv.slice(2);
const value = (flag, fallback) => options.includes(flag) ? options[options.indexOf(flag) + 1] : fallback;
const providers = value('--providers', 'databank,tvmaze,wookieepedia').split(',');
const maxRecords = Number(value('--max-records', '2000'));
if (!Number.isInteger(maxRecords) || maxRecords < 1 || maxRecords > 5000) throw new Error('--max-records must be 1..5000 per Databank collection');
if (providers.some(id => !['databank', 'tvmaze', 'wookieepedia'].includes(id))) throw new Error('Unknown source provider');
const workRoot = join(ROOT, 'work', 'ingestion');
const out = resolve(ROOT, value('--out', 'work/ingestion/latest'));
if (out !== workRoot && !out.startsWith(workRoot + sep)) throw new Error('Staging output must stay inside work/ingestion');
const client = createSourceClient({ cacheDir: join(workRoot, 'cache'), refresh: options.includes('--refresh') });
const startedAt = new Date().toISOString(), started = performance.now();
const jobs = {
  databank: async () => (await import('./ingestion/databank.mjs')).collectDatabank({ requestJson: client.requestJson, maxRecords }),
  tvmaze: async () => (await import('./ingestion/tvmaze.mjs')).collectTvmaze({ requestJson: client.requestJson }),
  wookieepedia: async () => (await import('./ingestion/wookieepedia.mjs')).collectWookieepedia({ requestJson: client.requestJson, titles: value('--wiki-titles', 'Ilum|Ilum/Legends|Mandalore|Bespin').split('|') }),
};
const outputs = await Promise.all(providers.map(async id => {
  try { const result = await jobs[id](); console.log(`${id}: staged ${result.records.length} source records`); return { id, ...result }; }
  catch (error) { console.error(`${id}: ${error.message}`); return { id, provider: id, records: [], stats: {}, errors: [{ message: error.message }] }; }
}));

// Load the actual curated registry; no parallel hand-maintained list of worlds.
const bundled = await build({ stdin: { contents: "export { ALL_WORLDS } from './src/journeyWorlds.ts'; export { CATALOG } from './src/catalog.ts';", resolveDir: ROOT, loader: 'ts' }, bundle: true, write: false, format: 'esm', platform: 'node' });
const { ALL_WORLDS, CATALOG } = await import('data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const normalize = value => String(value ?? '').normalize('NFKC').toLowerCase().replaceAll('’', "'").replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const unique = values => [...new Set(values)];
const byName = new Map();
for (const world of ALL_WORLDS) {
  const key = normalize(world.name);
  byName.set(key, [...(byName.get(key) ?? []), world.id]);
}
const episodes = new Map(CATALOG.filter(item => item.kind === 'episode').map(item => [`${item.seriesId}:${item.season}:${item.episode}`, item]));
const records = outputs.flatMap(output => output.records.map(row => {
  let match = { status: 'unmatched', canonicalIds: [], method: 'none' };
  if (row.entityType === 'location') {
    const ids = byName.get(normalize(row.name)) ?? [];
    if (ids.length) match = { status: 'review', canonicalIds: ids, method: 'normalized-name-only' };
  } else if (row.entityType === 'episode') {
    const item = episodes.get(`${row.seriesId}:${row.season}:${row.episode}`);
    if (item) match = { status: normalize(item.title) === normalize(row.name) && !item.episodeEnd ? 'candidate-exact' : 'review', canonicalIds: [item.id], method: 'series-season-episode-and-title', combinedRecord: Boolean(item.episodeEnd) };
  }
  return { ...row, provider: output.id, providerId: String(row.providerId), continuity: row.continuity ?? 'unknown', collectedAt: startedAt, payloadSha256: digest(JSON.stringify(row.raw ?? row)), match, coordinates: null, publicationStatus: 'staged-not-published' };
}));
const manifest = new Map();
for (const record of records) for (const media of record.media ?? []) {
  if (!media.sourceUrl) continue;
  try { if (new URL(media.sourceUrl).protocol !== 'https:') continue; } catch { continue; }
  const id = digest(media.sourceUrl);
  const existing = manifest.get(id) ?? { id, ...media, sourceRecords: [], usageBasis: 'source-reference-only', fallback: 'Retain original atlas illustration if unavailable', publicationStatus: 'candidate-not-delivered', deliveryStatus: 'not-probed' };
  existing.sourceRecords.push({ provider: record.provider, providerId: record.providerId, name: record.name, sourceUrl: record.sourceUrl });
  manifest.set(id, existing);
}
const media = [...manifest.values()];
const appearances = extractWikiAppearanceCandidates(records.filter(row => row.provider === 'wookieepedia'), CATALOG);
const counts = (list, key) => Object.fromEntries(unique(list.map(row => row[key])).map(value => [value, list.filter(row => row[key] === value).length]));
const errors = outputs.flatMap(output => (output.errors ?? []).map(error => ({ provider: output.id, ...(typeof error === 'object' ? error : { message: String(error) }) })));
const summary = {
  startedAt, completedAt: new Date().toISOString(), elapsedSeconds: Number(((performance.now() - started) / 1000).toFixed(2)),
  mode: 'local-staging-only', canonicalWrites: 0, mediaDownloads: 0,
  records: records.length, recordsByProvider: counts(records, 'provider'), recordsByType: counts(records, 'entityType'),
  uniqueMediaReferences: media.length, reconciliation: counts(records.map(row => row.match), 'status'),
  appearanceCandidates: appearances.stats,
  canonicalBaseline: { mappedWorlds: ALL_WORLDS.length, catalogItems: CATALOG.length },
  http: client.stats, providers: outputs.map(({ id, provider, stats, errors }) => ({ id, provider, stats, errors })), errors,
  limitations: [
    'No source record overwrites curated facts. Name-only matches require reconciliation.',
    'TV numbering, combined releases and specials are staged separately from canonical watch records.',
    'Wookieepedia is a bounded page/revision/media pilot, not a full-wiki crawl.',
    'Media references are not downloaded, resized, delivered, or licensed merely by collection.',
    'Unknown galactic coordinates remain null; no additional map points are created.',
  ],
};
await mkdir(out, { recursive: true });
for (const [name, data] of [['records', records], ['media-manifest', media], ['appearance-candidates', appearances.candidates], ['summary', summary]]) await writeFile(join(out, name + '.json'), JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({ ...summary, http: { requests: client.stats.requests, cacheHits: client.stats.cacheHits, retries: client.stats.retries, snapshots: client.stats.snapshots.length }, providers: undefined, stagingPath: relative(ROOT, out) }, null, 2));
if (errors.length) process.exitCode = 2;
