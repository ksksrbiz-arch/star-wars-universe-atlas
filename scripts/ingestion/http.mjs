import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const digest = value => createHash('sha256').update(value).digest('hex');
const allowed = new Set(['api.tvmaze.com', 'starwars.fandom.com', 'starwars-databank-server.onrender.com']);
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Shared, bounded collector; never used by the public browser or production build. */
export function createSourceClient({ cacheDir, refresh = false, fetchImpl = fetch, maxAgeMs = 86400000 }) {
  const pending = new Map(), hostQueues = new Map();
  const stats = { requests: 0, cacheHits: 0, retries: 0, snapshots: [] };
  async function archive(snapshot) {
    await mkdir(join(cacheDir, 'snapshots'), { recursive: true });
    try { await writeFile(join(cacheDir, 'snapshots', snapshot.sha256 + '.json'), snapshot.body, { flag: 'wx' }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  async function collect(url) {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !allowed.has(parsed.hostname)) throw new Error('Unapproved JSON source origin');
    const key = digest(url), path = join(cacheDir, key + '.json');
    if (!refresh) {
      try {
        const cached = JSON.parse(await readFile(path, 'utf8'));
        if (cached.url === url && Date.now() - Date.parse(cached.retrievedAt) < maxAgeMs && digest(cached.body) === cached.sha256) {
          const data = JSON.parse(cached.body);
          await archive(cached);
          stats.cacheHits++;
          stats.snapshots.push({ id: key, url, retrievedAt: cached.retrievedAt, sha256: cached.sha256, cached: true });
          return data;
        }
      } catch { /* A missing, expired or corrupt cache is fetched again. */ }
    }
    // Serialize each host. Independent providers still run concurrently.
    const previous = hostQueues.get(parsed.hostname) ?? Promise.resolve();
    let release;
    const next = new Promise(resolve => { release = resolve; });
    hostQueues.set(parsed.hostname, next);
    await previous;
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        stats.requests++;
        const response = await fetchImpl(url, { headers: { accept: 'application/json', 'user-agent': 'StarWarsUniverseAtlas-Ingest/1.0 (+https://github.com/ksksrbiz-arch/star-wars-universe-atlas)' }, signal: AbortSignal.timeout(45000) });
        if (!response.ok) {
          if ((response.status === 429 || response.status >= 500) && attempt < 2) {
            stats.retries++;
            const header = response.headers.get('retry-after');
            const seconds = header === null ? NaN : Number(header);
            const until = header === null ? NaN : Date.parse(header);
            const requestedWait = Number.isFinite(seconds) ? seconds * 1000 : until - Date.now();
            const wait = Number.isFinite(requestedWait) && requestedWait > 0 ? requestedWait : 1000 * 2 ** attempt;
            if (wait > 60000) { await response.body?.cancel(); throw new Error(`Source ${parsed.hostname} requests a later retry; rerun after its Retry-After deadline`); }
            await response.body?.cancel();
            await pause(wait);
            continue;
          }
          await response.body?.cancel();
          throw new Error(`Source ${parsed.hostname} returned HTTP ${response.status}`);
        }
        const body = await response.text();
        if (Buffer.byteLength(body) > 20 * 1024 * 1024) throw new Error('Source JSON exceeds the 20MiB batch limit');
        const data = JSON.parse(body);
        if (data?.error) throw new Error(`Source API error: ${String(data.error.code ?? 'unknown')}`);
        const snapshot = { url, retrievedAt: new Date().toISOString(), sha256: digest(body), body };
        await mkdir(cacheDir, { recursive: true });
        await archive(snapshot);
        await writeFile(path, JSON.stringify(snapshot) + '\n');
        stats.snapshots.push({ id: key, url, retrievedAt: snapshot.retrievedAt, sha256: snapshot.sha256, cached: false });
        return data;
      }
      throw new Error('Source retry budget exhausted');
    } finally {
      await pause(300);
      release();
    }
  }
  return { stats, requestJson(url) {
    if (!pending.has(url)) pending.set(url, collect(url));
    return pending.get(url);
  } };
}
