const API = 'https://starwars.fandom.com/api.php';
const chunks = (values, size = 50) => Array.from({ length: Math.ceil(values.length / size) }, (_, i) => values.slice(i * size, (i + 1) * size));
const url = params => `${API}?${new URLSearchParams({ action: 'query', format: 'json', ...params })}`;
const uniqueBy = (rows, key) => [...new Map(rows.map(row => [row[key], row])).values()];
const wikiText = page => page.revisions?.[0]?.slots?.main?.['*'] ?? page.revisions?.[0]?.slots?.main?.content ?? '';

function continuity(page) {
  const categories = new Set((page.categories ?? []).map(row => row.title));
  if (categories.has('Category:Canon articles') && !categories.has('Category:Legends articles')) return 'canon';
  if (categories.has('Category:Legends articles') && !categories.has('Category:Canon articles')) return 'legends';
  return 'unknown';
}

// Select explicit infobox image fields, not every logo/icon pulled in by templates.
// No claim, appearance, date, or coordinate is parsed from the article text here.
function featuredFiles(page) {
  const found = [];
  for (const match of wikiText(page).matchAll(/^\|\s*image\d*\s*=\s*(?:\[\[(?:File|Image):)?([^|\]\n}]+)/gim)) {
    const name = match[1].trim().replace(/^(?:File|Image):/i, '').replaceAll('_', ' ');
    if (name && !name.includes('{{') && /\.(?:png|jpe?g|webp|gif|svg)$/i.test(name)) found.push(`File:${name}`);
  }
  return [...new Set(found)];
}

function mediaCredit(info) {
  const metadata = info.extmetadata ?? {};
  const values = ['Artist', 'Credit', 'LicenseShortName'].map(key => metadata[key]?.value).filter(Boolean);
  return values.length
    ? values.join(' · ').replace(/<[^>]*>/g, '').trim()
    : 'Wookieepedia file-page reference; original creator and rights not stated in API metadata';
}

/** Revision-pinned wiki inventory. Wikitext/templates remain raw for later claim review. */
export async function collectWookieepedia({ requestJson, titles = ['Ilum', 'Mandalore', 'Bespin'] } = {}) {
  if (typeof requestJson !== 'function') throw new TypeError('requestJson(url) is required');
  if (!Array.isArray(titles) || titles.some(title => typeof title !== 'string' || !title.trim())) throw new TypeError('titles must contain nonempty strings');
  const requested = [...new Set(titles.map(title => title.trim()))];
  const pages = new Map(), files = new Map(), errors = [];
  let requests = 0;
  for (const batch of chunks(requested)) {
    let continuation = {};
    const seenContinuations = new Set();
    for (let turn = 0; turn < 100; turn++) {
      const sourceUrl = url({ titles: batch.join('|'), redirects: '1', prop: 'info|revisions|categories|images', inprop: 'url',
        rvprop: 'ids|timestamp|content', rvslots: 'main', cllimit: 'max', imlimit: 'max', ...continuation });
      let payload;
      try { requests++; payload = await requestJson(sourceUrl); }
      catch (error) { errors.push({ sourceUrl, message: error.message ?? String(error) }); break; }
      if (payload?.error) { errors.push({ sourceUrl, message: payload.error.info ?? payload.error.code ?? 'MediaWiki API error' }); break; }
      const returned = Object.values(payload?.query?.pages ?? {});
      if (!returned.length) { errors.push({ sourceUrl, message: 'MediaWiki returned no pages' }); break; }
      for (const page of returned) {
        if (Object.hasOwn(page, 'missing') || Number(page.pageid) < 0) {
          if (!errors.some(error => error.title === page.title)) errors.push({ title: page.title, sourceUrl, message: 'Page missing' });
          continue;
        }
        const previous = pages.get(page.pageid);
        const merged = { ...previous, ...page };
        for (const [field, key] of [['categories', 'title'], ['images', 'title'], ['revisions', 'revid']]) {
          const values = [...(previous?.[field] ?? []), ...(page[field] ?? [])];
          if (values.length) merged[field] = uniqueBy(values, key);
        }
        pages.set(page.pageid, merged);
      }
      if (!payload.continue) break;
      const key = JSON.stringify(payload.continue);
      if (seenContinuations.has(key) || turn === 99) { errors.push({ sourceUrl, message: 'Wiki pagination repeated or reached its safety bound' }); break; }
      seenContinuations.add(key); continuation = payload.continue;
    }
  }

  const requestedFiles = [...new Set([...pages.values()].flatMap(featuredFiles))];
  for (const batch of chunks(requestedFiles)) {
    const sourceUrl = url({ titles: batch.join('|'), prop: 'imageinfo', iiprop: 'url|size|mime|sha1|timestamp|extmetadata', iiurlwidth: '1600' });
    try {
      requests++;
      const payload = await requestJson(sourceUrl);
      if (payload?.error) { errors.push({ sourceUrl, message: payload.error.info ?? payload.error.code }); continue; }
      for (const page of Object.values(payload?.query?.pages ?? {})) {
        const info = page.imageinfo?.[0];
        if (info?.url && info.mime?.startsWith('image/')) files.set(page.title.replaceAll('_', ' '), { page, info });
      }
      for (const alias of payload?.query?.normalized ?? []) {
        const matched = files.get(alias.to.replaceAll('_', ' '));
        if (matched) files.set(alias.from.replaceAll('_', ' '), matched);
      }
    } catch (error) { errors.push({ sourceUrl, message: error.message ?? String(error) }); }
  }

  const records = [...pages.values()].map(page => {
    const revision = page.revisions?.[0];
    const selected = featuredFiles(page).map(title => files.get(title)).filter(Boolean);
    const media = selected.map(({ info }) => ({ sourceUrl: info.url, kind: 'entity-image',
      ...(Number.isFinite(info.width) ? { width: info.width } : {}),
      ...(Number.isFinite(info.height) ? { height: info.height } : {}),
      ...(info.sha1 ? { sha1: info.sha1 } : {}), credit: mediaCredit(info) }));
    return {
      providerId: String(page.pageid), entityType: 'wiki-page', name: page.title,
      sourceUrl: page.fullurl ?? `${API}?action=query&format=json&pageids=${page.pageid}`,
      media, raw: { ...page, wikitext: wikiText(page), featuredImageMetadata: selected.map(row => row.page) },
      ...(revision?.revid !== undefined ? { revisionId: revision.revid } : {}),
      ...(revision?.timestamp ? { modifiedAt: revision.timestamp } : {}), continuity: continuity(page),
    };
  });
  return { provider: 'wookieepedia', records, stats: {
    requestedTitles: requested.length, records: records.length, requests, featuredImagesQueried: requestedFiles.length,
    mediaCandidates: records.reduce((n, row) => n + row.media.length, 0),
    continuity: { canon: records.filter(row => row.continuity === 'canon').length, legends: records.filter(row => row.continuity === 'legends').length, unknown: records.filter(row => row.continuity === 'unknown').length },
  }, errors };
}
