const BASE = 'https://starwars-databank-server.onrender.com/api/v1';
const COLLECTIONS = [['locations', 'location'], ['characters', 'character']];

/** Community Databank seed inventory. References are candidates, never published media. */
export async function collectDatabank({ requestJson, maxRecords = 2000 } = {}) {
  if (typeof requestJson !== 'function') throw new TypeError('requestJson(url) is required');
  if (!Number.isFinite(maxRecords) || maxRecords < 0) throw new TypeError('maxRecords must be a finite nonnegative number');
  const cap = Math.floor(maxRecords);
  const records = [], errors = [], collections = {};
  for (const [collection, entityType] of COLLECTIONS) {
    const seen = new Set();
    const state = { advertisedTotal: null, records: 0, requests: 0, truncated: false };
    collections[collection] = state;
    const pageSize = Math.min(100, cap);
    if (!pageSize) { state.truncated = true; continue; }
    for (let page = 1; state.records < cap; page++) {
      // Fixed page size keeps offsets correct when the configured cap is not a multiple of100.
      const sourceUrl = `${BASE}/${collection}?page=${page}&limit=${pageSize}`;
      let payload;
      try { state.requests++; payload = await requestJson(sourceUrl); }
      catch (error) {
        errors.push({ collection, sourceUrl, message: error.message ?? String(error) });
        break;
      }
      if (!Array.isArray(payload?.data)) {
        errors.push({ collection, sourceUrl, message: 'Expected a data array' });
        break;
      }
      if (Number.isFinite(payload.info?.total)) state.advertisedTotal = payload.info.total;
      let added = 0;
      for (const raw of payload.data) {
        if (state.records >= cap) break;
        if (typeof raw?._id !== 'string' || typeof raw?.name !== 'string') {
          errors.push({ collection, sourceUrl, message: 'Skipped row without a stable provider id and name' });
          continue;
        }
        if (seen.has(raw._id)) continue;
        seen.add(raw._id);
        const media = typeof raw.image === 'string' && /^https:\/\//.test(raw.image)
          ? [{ sourceUrl: raw.image, kind: 'entity-image', credit: 'Lucasfilm or original image creator; referenced by the community Star Wars Databank API, rights not verified' }]
          : [];
        records.push({
          providerId: raw._id, entityType, name: raw.name,
          ...(typeof raw.description === 'string' ? { description: raw.description } : {}),
          sourceUrl: `${BASE}/${collection}/${encodeURIComponent(raw._id)}`,
          media, raw,
        });
        state.records++; added++;
      }
      const ended = payload.data.length === 0 || payload.info?.next === null
        || (state.advertisedTotal !== null && state.records >= state.advertisedTotal);
      if (ended) break;
      if (!added) {
        errors.push({ collection, sourceUrl, message: 'Pagination made no progress; stopped rather than repeat pages' });
        break;
      }
      // Do not follow provider-supplied arbitrary URLs; the next page stays on this API.
    }
    state.truncated = state.advertisedTotal !== null && state.records < state.advertisedTotal && state.records >= cap;
  }
  return {
    provider: 'databank', records,
    stats: { collections, records: records.length, mediaCandidates: records.reduce((n, row) => n + row.media.length, 0) },
    errors,
  };
}
