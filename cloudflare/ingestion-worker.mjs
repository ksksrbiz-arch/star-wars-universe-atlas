import { Client } from 'pg';
import { collectDatabank } from '../scripts/ingestion/databank.mjs';
import { collectTvmaze } from '../scripts/ingestion/tvmaze.mjs';
import { collectWookieepedia } from '../scripts/ingestion/wookieepedia.mjs';
import { publishRecords } from '../scripts/ingestion/publication-plan.mjs';

const JSON_HOSTS = new Set(['api.tvmaze.com', 'starwars.fandom.com', 'starwars-databank-server.onrender.com']);
const IMAGE_HOSTS = new Set(['static.tvmaze.com', 'lumiere-a.akamaihd.net', 'static.wikia.nocookie.net']);
const encoder = new TextEncoder();
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
export const digest = async value => [...new Uint8Array(await crypto.subtle.digest('SHA-256', typeof value === 'string' ? encoder.encode(value) : value))].map(n => n.toString(16).padStart(2, '0')).join('');
const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });

export function scheduledTask(time) {
  const date = new Date(time);
  if (date.getUTCHours() === 4) return ['databank', 'tvmaze', 'wookieepedia'][date.getUTCMinutes() / 15] ?? 'media';
  return 'media';
}

export function runMetadata(options = {}) {
  if (options.trigger !== 'scheduled') return { trigger: 'manual' };
  const scheduledTime = new Date(options.scheduledTime);
  if (!Number.isFinite(scheduledTime.getTime())) throw new Error('Scheduled execution requires a valid timestamp');
  return { trigger: 'scheduled', scheduledTime: scheduledTime.toISOString() };
}

export async function isAuthorized(request, secret) {
  const supplied = request.headers.get('Authorization') ?? '';
  // Fixed-size digest comparison avoids returning token material or comparing a prefix.
  if (typeof secret !== 'string' || secret.length < 32 || supplied.length > 1024) return false;
  const a = await digest(supplied), b = await digest(`Bearer ${secret}`);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

export async function readBounded(response, maximum) {
  const advertised = Number(response.headers.get('content-length'));
  if (Number.isFinite(advertised) && advertised > maximum) { await response.body?.cancel(); throw new Error('Source response exceeds byte limit'); }
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Empty source response');
  const chunks = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maximum) { await reader.cancel(); throw new Error('Source response exceeds byte limit'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

export function approvedImageUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !IMAGE_HOSTS.has(url.hostname) || url.username || url.password || url.port) throw new Error('Unapproved image source');
  return url;
}

export function variantUrl(value, width) {
  const url = approvedImageUrl(value);
  if (url.hostname === 'lumiere-a.akamaihd.net') url.searchParams.set('width', String(width));
  if (url.hostname === 'static.wikia.nocookie.net') {
    url.pathname = url.pathname.replace(/\/revision\/latest(?:\/scale-to-width(?:-down)?\/\d+)?/, `/revision/latest/scale-to-width-down/${width}`);
  }
  // TVmaze's named medium variant is documented by the provider's image URLs.
  if (url.hostname === 'static.tvmaze.com' && width <= 480) url.pathname = url.pathname.replace(/\/(?:original|original_untouched)\//, '/medium_landscape/');
  return url.href;
}

export function imageDetails(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length >= 33 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes[i] === value) && view.getUint32(8) === 13 && String.fromCharCode(...bytes.slice(12, 16)) === 'IHDR' && view.getUint32(16) > 0 && view.getUint32(20) > 0) return { mime: 'image/png', extension: 'png', width: view.getUint32(16), height: view.getUint32(20) };
  if (bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216) {
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 255) break;
      const marker = bytes[offset + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      const length = view.getUint16(offset + 2);
      if (length < 2) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) return { mime: 'image/jpeg', extension: 'jpg', height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      offset += length + 2;
    }
    return { mime: 'image/jpeg', extension: 'jpg' };
  }
  if (bytes.length >= 30 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') {
    const type = String.fromCharCode(...bytes.slice(12, 16));
    if (type === 'VP8X') return { mime: 'image/webp', extension: 'webp', width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) };
    if (type === 'VP8L' && bytes[20] === 0x2f) {
      const dimensions = view.getUint32(21, true);
      return { mime: 'image/webp', extension: 'webp', width: (dimensions & 0x3fff) + 1, height: ((dimensions >>> 14) & 0x3fff) + 1 };
    }
    if (type === 'VP8 ' && bytes.length >= 30) return { mime: 'image/webp', extension: 'webp', width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
    return { mime: 'image/webp', extension: 'webp' };
  }
  throw new Error('Source is not a supported raster image');
}

export async function deliverMediaItem(item, env, fetchImpl = (url, options) => globalThis.fetch(url, options)) {
  if (!item || !['databank', 'tvmaze', 'wookieepedia'].includes(item.provider) || typeof item.providerId !== 'string') throw new Error('Invalid media identity');
  const cutout = item.kind === 'character-cutout';
  const original = approvedImageUrl(item.sourceUrl).href;
  if (item.sourcePageUrl && new URL(item.sourcePageUrl).protocol !== 'https:') throw new Error('Invalid source page');
  const variants = [];
  let phase = 'fetch';
  const targets = cutout ? [0, 640] : [1280, 320];
  for (const target of targets) {
    // Full-resolution cutouts are the primary artwork, not a capped derivative.
    const imageUrl = target === 0 ? original : variantUrl(original, target);
    if (variants.some(variant => variant.fetchUrl === imageUrl)) continue;
    try {
      phase = 'fetch';
      const response = await fetchImpl(imageUrl, { redirect: 'manual', headers: { Accept: cutout ? 'image/png,image/webp' : 'image/jpeg,image/webp,image/png' }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) { await response.body?.cancel(); throw new Error(`Image returned HTTP ${response.status}`); }
      const mime = response.headers.get('content-type')?.split(';')[0].trim();
      if (!['image/jpeg', 'image/webp', 'image/png'].includes(mime)) { await response.body?.cancel(); throw new Error('Image MIME rejected'); }
      if (cutout && mime === 'image/jpeg') { await response.body?.cancel(); throw new Error('Character cutout requires an alpha-capable raster format'); }
      phase = 'read';
      const bytes = await readBounded(response, 8 * 1024 * 1024);
      phase = 'signature';
      const details = imageDetails(bytes);
      if (details.mime !== mime) throw new Error('Image signature does not match MIME');
      phase = 'hash';
      const sha256 = await digest(bytes), key = `sources/${sha256}.${details.extension}`;
      phase = 'r2';
      await env.PUBLISHED_ASSETS.put(key, bytes, { httpMetadata: { contentType: mime, cacheControl: 'public, max-age=31536000, immutable' }, customMetadata: { source: original, usage: 'personal-fan-atlas', provider: item.provider } });
      variants.push({ src: `/media/${key}`, fetchUrl: imageUrl, sha256, bytes: bytes.byteLength, ...details });
    } catch (error) {
      if (target === targets[0]) { error.deliveryPhase = phase; throw error; }
      // A provider may lack a thumbnail derivative; the successfully delivered image remains usable.
    }
  }
  const primary = variants[0];
  const sizes = [...new Map(variants.filter(row => row.width).map(row => [row.width, row])).values()].sort((a, b) => a.width - b.width);
  return { id: typeof item.id === 'string' ? item.id : await digest(original), provider: item.provider, providerId: item.providerId,
    ...(cutout ? { kind: 'character-cutout', ...(typeof item.originProvider === 'string' && item.originProvider.trim() ? { originProvider: item.originProvider.trim().slice(0, 100) } : {}), ...(item.provenance && typeof item.provenance === 'object' && !Array.isArray(item.provenance) ? { provenance: item.provenance } : {}) } : {}),
    ...(item.canonicalId ? { canonicalId: item.canonicalId, canonicalType: item.canonicalType } : {}),
    ...(item.reviewEvidence ? { reviewEvidence: item.reviewEvidence } : {}),
    src: primary.src, ...(sizes.length > 1 ? { srcSet: sizes.map(row => `${row.src} ${row.width}w`).join(', ') } : {}),
    credit: String(item.credit ?? `${item.provider}; underlying image copyright retained by its owner`), sourceUrl: item.sourcePageUrl ?? original,
    originalSourceUrl: original, sha256: primary.sha256, bytes: primary.bytes, mime: primary.mime,
    ...(primary.width ? { width: primary.width, height: primary.height } : {}), deliveredAt: new Date().toISOString() };
}

async function requestClient(env) {
  let requests = 0;
  return async value => {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !JSON_HOSTS.has(url.hostname) || url.username || url.password) throw new Error('Unapproved JSON source');
    if (++requests > 40) throw new Error('Source request budget exhausted');
    const response = await globalThis.fetch(url, { redirect: 'manual', headers: { Accept: 'application/json', 'User-Agent': 'StarWarsUniverseAtlas-Ingest/1.0' }, signal: AbortSignal.timeout(45000) });
    if (!response.ok) { await response.body?.cancel(); throw new Error(`Source returned HTTP ${response.status}; retry on next scheduled pass`); }
    const body = new TextDecoder().decode(await readBounded(response, 20 * 1024 * 1024));
    const payload = JSON.parse(body), sha256 = await digest(body);
    if (payload?.error) throw new Error('Source API reported an error');
    await env.ORIGINALS.put(`ingestion/snapshots/${sha256}.json`, body, { httpMetadata: { contentType: 'application/json' }, customMetadata: { source: url.href, retrievedAt: new Date().toISOString() } });
    await pause(300);
    return payload;
  };
}

async function saveRecords(client, provider, rows) {
  const collectedAt = new Date().toISOString();
  const records = await Promise.all(rows.map(async row => ({ ...row, provider, providerId: String(row.providerId), continuity: row.continuity ?? 'unknown', coordinates: null, collectedAt,
    payloadSha256: await digest(JSON.stringify(row.raw ?? row)), publicationStatus: 'staged-not-published' })));
  await client.query('BEGIN');
  try { await publishRecords(client, records, []); await client.query('COMMIT'); }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  return records;
}

export async function storeDelivered(client, item) {
  await client.query('BEGIN');
  try {
    if (item.kind === 'character-cutout') {
      const source = await client.query('SELECT entity_type FROM atlas_source_records WHERE provider=$1 AND provider_id=$2', [item.provider, item.providerId]);
      if (source.rows[0]?.entity_type !== 'character') throw new Error('Character cutout requires a character source identity');
    }
    await client.query(`INSERT INTO atlas_source_media(id,provider,provider_id,payload,delivered) VALUES($1,$2,$3,$4::jsonb,true)
      ON CONFLICT(id,provider,provider_id) DO UPDATE SET payload=excluded.payload,delivered=true`, [item.id, item.provider, item.providerId, JSON.stringify(item)]);
    // A provider may change its image URL while the reviewed entity identity
    // stays the same. Move existing accepted links only after delivery succeeds.
    if (item.kind !== 'character-cutout') await client.query('UPDATE atlas_source_links SET media_id=$1 WHERE provider=$2 AND provider_id=$3 AND accepted', [item.id, item.provider, item.providerId]);
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
}

export async function storeDeliveryFailure(client, item, now = Date.now()) {
  await client.query(`INSERT INTO atlas_source_media(id,provider,provider_id,payload,delivered) VALUES($1,$2,$3,$4::jsonb,false)
    ON CONFLICT(id,provider,provider_id) DO UPDATE SET payload=atlas_source_media.payload ||
      jsonb_build_object('failedAt',excluded.payload->'failedAt','retryAfter',excluded.payload->'retryAfter')`,
  [item.id, item.provider, item.providerId, JSON.stringify({ sourceUrl: item.sourceUrl, failedAt: new Date(now).toISOString(), retryAfter: new Date(now + 86400000).toISOString() })]);
}

export async function mediaBatch(client, env, items, { deliver = deliverMediaItem, persist = storeDelivered, fail = storeDeliveryFailure } = {}) {
  const delivered = new Array(items.length), errors = new Array(items.length);
  let cursor = 0, databaseQueue = Promise.resolve();
  // Fetch/R2 work may overlap, but transactions on the one PostgreSQL session
  // must not interleave BEGIN/COMMIT boundaries across image tasks.
  const database = operation => {
    const result = databaseQueue.then(operation);
    databaseQueue = result.catch(() => {});
    return result;
  };
  await Promise.all(Array.from({ length: Math.min(3, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++, item = items[index];
      try {
        const result = await deliver(item, env);
        await database(() => persist(client, result));
        delivered[index] = result;
      } catch (error) {
        // Persist backoff without exposing upstream response bodies or credentials.
        let backoffStored = true;
        if (item.id && item.provider && item.providerId) {
          try { await database(() => fail(client, item)); }
          catch { backoffStored = false; }
        }
        const upstreamStatus = String(error?.message).match(/Image returned HTTP (\d{3})/)?.[1];
        errors[index] = { id: item.id, provider: item.provider, providerId: item.providerId, error: 'Media delivery failed; retry after source cooldown', phase: error?.deliveryPhase ?? 'database', ...(!backoffStored ? { backoffStored: false } : {}), ...(error?.deliveryPhase === 'fetch' ? { fetchDetail: String(error?.message).replace(/[\r\n]/g, ' ').slice(0, 180) } : {}), ...(upstreamStatus ? { upstreamStatus: Number(upstreamStatus) } : {}), ...(typeof error?.code === 'string' && /^[A-Z0-9_]{1,30}$/.test(error.code) ? { code: error.code } : {}), category: error?.name === 'TypeError' ? 'type-error' : error?.name === 'TimeoutError' ? 'timeout' : 'source-or-storage' };
      }
    }
  }));
  return { items: delivered.filter(Boolean), errors: errors.filter(Boolean) };
}

export async function pendingMedia(client, limit, now = Date.now()) {
  // Only accepted joins or standalone Databank entities can enter the delivery queue.
  // Actor headshots and unreviewed episode joins never enter public media automatically.
  const result = await client.query(`SELECT r.provider,r.provider_id,r.source_url,r.payload,
    COALESCE((SELECT true FROM atlas_source_links l WHERE l.provider=r.provider AND l.provider_id=r.provider_id AND l.accepted LIMIT 1),false) AS linked
    FROM atlas_source_records r WHERE (r.provider='databank' AND r.entity_type IN('location','character'))
    OR EXISTS(SELECT 1 FROM atlas_source_links l WHERE l.provider=r.provider AND l.provider_id=r.provider_id AND l.accepted)
    ORDER BY CASE WHEN r.entity_type='episode' THEN 0 WHEN r.entity_type='series' THEN 1 WHEN r.entity_type='location' THEN 2 ELSE 3 END,r.name`);
  const existing = await client.query('SELECT id,provider,provider_id,delivered,payload FROM atlas_source_media');
  const known = new Map(existing.rows.map(row => [`${row.provider}:${row.provider_id}:${row.id}`, row]));
  const pending = [];
  for (const record of result.rows) {
    const source = (record.payload.media ?? [])[0];
    if (!source?.sourceUrl) continue;
    let id;
    try { approvedImageUrl(source.sourceUrl); id = await digest(source.sourceUrl); } catch { continue; }
    const previous = known.get(`${record.provider}:${record.provider_id}:${id}`);
    const fresh = previous?.delivered && Date.parse(previous.payload.deliveredAt ?? '') > now - 30 * 86400000;
    if (fresh || Date.parse(previous?.payload?.retryAfter ?? '') > now) continue;
    pending.push({ id, provider: record.provider, providerId: record.provider_id, sourceUrl: source.sourceUrl, sourcePageUrl: record.source_url, credit: source.credit });
    if (pending.length >= limit) break;
  }
  return pending;
}

export async function runTask(task, env, options = {}) {
  const client = new Client({ connectionString: env.INGESTION_DB.connectionString, connectionTimeoutMillis: 10000, query_timeout: 30000 });
  const id = crypto.randomUUID(), startedAt = new Date().toISOString(), metadata = runMetadata(options);
  await client.connect();
  let locked = false;
  try {
    // Explicit operator batches have disjoint stable provider IDs and idempotent
    // content-addressed R2 writes, so they can run concurrently. Scheduled queue
    // discovery and source refreshes share a lock to prevent competing cursors.
    if (!options.items) {
      locked = (await client.query('SELECT pg_try_advisory_lock(735923110) AS locked')).rows[0].locked;
      if (!locked) return { status: 'busy', task, ...metadata };
    }
    await client.query('INSERT INTO atlas_ingestion_runs(id,started_at,status,payload) VALUES($1,$2,$3,$4::jsonb)', [id, startedAt, 'running', JSON.stringify({ task, ...metadata })]);
    let output;
    if (task === 'media') output = await mediaBatch(client, env, options.items ?? await pendingMedia(client, 16));
    else {
      const requestJson = await requestClient(env);
      const collector = task === 'databank' ? () => collectDatabank({ requestJson })
        : task === 'tvmaze' ? () => collectTvmaze({ requestJson })
        : task === 'wookieepedia' ? async () => {
          const titles = await client.query("SELECT name FROM atlas_source_records WHERE provider='wookieepedia' ORDER BY name LIMIT 50");
          return collectWookieepedia({ requestJson, titles: titles.rows.length ? titles.rows.map(row => row.name) : ['Ilum', 'Ilum/Legends', 'Mandalore', 'Bespin'] });
        } : null;
      if (!collector) throw new Error('Unknown task');
      const result = await collector();
      const records = await saveRecords(client, task, result.records);
      output = { records: records.length, errors: result.errors.map(() => ({ error: 'Source batch incomplete; retained prior records and retry next pass' })) };
    }
    const status = output.errors?.length ? 'partial' : 'complete';
    await client.query('UPDATE atlas_ingestion_runs SET completed_at=now(),status=$2,payload=$3::jsonb WHERE id=$1', [id, status, JSON.stringify({ task, ...metadata, ...output, items: output.items?.map(({ id, provider, providerId, bytes }) => ({ id, provider, providerId, bytes })) })]);
    return { id, task, status, ...metadata, ...output };
  } catch {
    try { await client.query('UPDATE atlas_ingestion_runs SET completed_at=now(),status=$2,payload=$3::jsonb WHERE id=$1', [id, 'failed', JSON.stringify({ task, ...metadata, error: 'Ingestion failed; no canonical data was changed' })]); } catch {}
    throw new Error('Ingestion task failed');
  } finally {
    if (locked) { try { await client.query('SELECT pg_advisory_unlock(735923110)'); } catch {} }
    await client.end();
  }
}

export default {
  async fetch(request, env) {
    if (!await isAuthorized(request, env.INGESTION_TOKEN)) return json({ error: 'Not found' }, 404);
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') return json({ status: 'ok', service: 'private-atlas-ingestion' });
    if (request.method === 'GET' && url.pathname === '/status') {
      const client = new Client({ connectionString: env.INGESTION_DB.connectionString, connectionTimeoutMillis: 10000, query_timeout: 10000 });
      try {
        await client.connect();
        const counts = await client.query('SELECT (SELECT count(*)::int FROM atlas_source_records) AS records,(SELECT count(*)::int FROM atlas_source_media WHERE delivered) AS delivered,(SELECT count(*)::int FROM atlas_source_links WHERE accepted) AS accepted_links');
        const runs = await client.query('SELECT id,started_at,completed_at,status,payload FROM atlas_ingestion_runs ORDER BY started_at DESC LIMIT 12');
        return json({ ...counts.rows[0], runs: runs.rows });
      } catch { return json({ error: 'Private status unavailable' }, 503); }
      finally { await client.end().catch(() => {}); }
    }
    if (request.method !== 'POST' || !['/run', '/media'].includes(url.pathname)) return json({ error: 'Not found' }, 404);
    let input;
    try { input = JSON.parse(new TextDecoder().decode(await readBounded(request, 256 * 1024))); }
    catch { return json({ error: 'Invalid or oversized JSON body' }, 400); }
    const task = url.pathname === '/media' ? 'media' : input.task;
    if (!['databank', 'tvmaze', 'wookieepedia', 'media'].includes(task)) return json({ error: 'Unknown task' }, 400);
    if (url.pathname === '/media' && (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 16)) return json({ error: 'Provide 1..16 media items' }, 400);
    try { const output = await runTask(task, env, url.pathname === '/media' ? { items: input.items } : {}); return json(output, output.status === 'busy' ? 409 : 200); }
    catch { return json({ error: 'Ingestion task failed; inspect private run status' }, 503); }
  },
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runTask(scheduledTask(controller.scheduledTime), env, { trigger: 'scheduled', scheduledTime: controller.scheduledTime }).catch(() => console.error('Scheduled atlas ingestion failed')));
  },
};
