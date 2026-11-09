const SERIES = new Map([
  ['tcw', 'clone-wars'], ['rebels', 'rebels'],
  ['mando', 'mandalorian'], ['mandalorian', 'mandalorian'], ['themandalorian', 'mandalorian'],
  ['andor', 'andor'], ['badbatch', 'bad-batch'], ['thebadbatch', 'bad-batch'], ['tbb', 'bad-batch'],
  ['ahsoka', 'ahsoka'], ['obiwan', 'obi-wan'], ['obiwankenobi', 'obi-wan'], ['owk', 'obi-wan'],
  ['bobf', 'boba-fett'], ['tbobf', 'boba-fett'], ['bookofbobafett', 'boba-fett'], ['thebookofbobafett', 'boba-fett'],
]);
const NON_TV = new Set(['film', 'filmcite', 'storycite', 'insidercite', 'ffg', 'encyclopediacite', 'comiccite', 'lswcite', 'idwadventurescite', 'idwadventurescite-2020', 'adventurescite', 'buildfalconcite', 'helmetcollectioncite']);
const MARKERS = new Map([['1st', 'first'], ['mo', 'mention'], ['flash', 'flashback'], ['del', 'del']]);
const key = name => name.replace(/^Template:/i, '').replace(/[_\s]+/g, '').toLowerCase();

function normalizeTitle(raw) {
  let title = String(raw).trim();
  const link = /^\[\[([^\]|]+)(?:\|[^\]]+)?\]\]$/.exec(title);
  if (link) title = link[1];
  return title.normalize('NFKC').replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
    .replace(/\s*\(episode\)\s*$/i, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function section(wikitext) {
  const match = /^==[ \t]*Appearances[ \t]*==[ \t]*\r?$/im.exec(wikitext);
  if (!match) return null;
  const rest = wikitext.slice(match.index + match[0].length);
  // Stop at subheadings too: Non-canon appearances must not inherit a Canon page's scope.
  const end = rest.search(/^={2,6}[^=\n][^\n]*={2,6}[ \t]*\r?$/m);
  return end < 0 ? rest : rest.slice(0, end);
}

function splitArguments(text) {
  const result = []; let start = 0, templates = 0, links = 0;
  for (let i = 0; i < text.length; i++) {
    const pair = text.slice(i, i + 2);
    if (pair === '{{') { templates++; i++; }
    else if (pair === '}}') { templates--; i++; }
    else if (pair === '[[') { links++; i++; }
    else if (pair === ']]') { links--; i++; }
    else if (text[i] === '|' && templates === 0 && links === 0) { result.push(text.slice(start, i)); start = i + 1; }
  }
  result.push(text.slice(start));
  return result;
}

function readTemplate(text) {
  if (!text.startsWith('{{')) return null;
  let depth = 1;
  for (let i = 2; i < text.length - 1; i++) {
    const pair = text.slice(i, i + 2);
    if (pair === '{{') { depth++; i++; }
    else if (pair === '}}') {
      depth--;
      if (depth === 0) {
        const [name, ...args] = splitArguments(text.slice(2, i));
        return { name: name.trim(), args: args.map(arg => arg.trim()), end: i + 2 };
      }
      i++;
    }
  }
  return null;
}

function parameters(template) {
  const positional = [], named = [];
  for (const arg of template.args) {
    const match = /^([A-Za-z0-9 _-]+)\s*=([\s\S]*)$/.exec(arg);
    if (!match) positional.push(arg);
    else if (match[1].trim() === '1' && !positional.length) positional.push(match[2].trim());
    else named.push({ name: match[1].trim(), value: match[2].trim() });
  }
  return { positional, named };
}

function entry(rawLine) {
  const bullet = /^\s*\*+\s*(.*)$/.exec(rawLine);
  if (!bullet) return null;
  const comments = [...bullet[1].matchAll(/<!--([\s\S]*?)-->/g)].map(match => match[1].trim());
  let text = bullet[1].replace(/<!--[\s\S]*?-->/g, '').trim().replace(/^'{2,}/, '');
  const citation = readTemplate(text);
  if (!citation || NON_TV.has(key(citation.name))) return null;
  const seriesId = SERIES.get(key(citation.name)) ?? null;
  const { positional, named } = parameters(citation);
  const markers = [];
  const reported = positional[0] ?? '';
  if (!reported) markers.push('unknown:missing-title');
  if (reported.includes('{{') || reported.includes('}}')) markers.push('unknown:dynamic-title');
  if (positional.length > 1 && seriesId) markers.push('unknown:template-parameters');
  for (const param of named) markers.push(key(param.name) === 'del' && param.value !== '0' ? 'del' : `unknown:parameter:${param.name}`);
  if (comments.some(comment => !/^\d{4}-[\dX]{2}-[\dX]{2}$/i.test(comment))) markers.push('unknown:comment');
  text = text.slice(citation.end).replace(/^'{2,}/, '').trim();
  while (text.startsWith('{{')) {
    const modifier = readTemplate(text);
    if (!modifier) { markers.push('unknown:malformed-modifier'); break; }
    markers.push(MARKERS.get(key(modifier.name)) ?? `unknown:${modifier.name}`);
    if (modifier.args.some(Boolean)) markers.push(`unknown:${modifier.name}-parameters`);
    text = text.slice(modifier.end).trim();
  }
  // Explanatory prose and unsupported formatting must not become an unqualified visit.
  text = text.replace(/<ref\b[^>]*>[\s\S]*?<\/ref\s*>|<ref\b[^>]*\/\s*>/gi, '').trim();
  if (text) markers.push('unknown:trailing-annotation');
  return { citation, seriesId, sourceReportedTitle: reported, markers: [...new Set(markers)] };
}

function contextFor(seriesId, markers) {
  if (markers.includes('del') || markers.some(marker => marker.startsWith('unknown:'))) return 'unknown';
  if (markers.includes('mention') && markers.includes('flashback')) return 'unknown';
  if (markers.includes('mention')) return 'mention';
  if (markers.includes('flashback')) return 'flashback';
  return seriesId ? 'appearance' : 'unknown';
}

/** Extract source-reported candidates only; no publication, character itinerary or visit order. */
export function extractWikiAppearanceCandidates(records, catalog) {
  if (!Array.isArray(records)) throw new TypeError('records must be an array');
  const items = Array.isArray(catalog) ? catalog : catalog?.items;
  if (!Array.isArray(items)) throw new TypeError('catalog must be an item array or an object containing items');
  const index = new Map();
  for (const item of items) {
    if (item?.kind !== 'episode' || !item.id || !item.seriesId || !item.title) continue;
    const lookup = `${item.seriesId}\0${normalizeTitle(item.title)}`;
    const values = index.get(lookup) ?? [];
    values.push(item); index.set(lookup, values);
  }
  const candidates = [], seen = new Set(); let pagesConsidered = 0, pagesWithAppearances = 0;
  for (const row of records) {
    if (typeof row?.raw?.wikitext !== 'string') continue;
    pagesConsidered++;
    const text = section(row.raw.wikitext);
    if (text === null) continue;
    pagesWithAppearances++;
    const continuity = ['canon', 'legends'].includes(row.continuity) ? row.continuity : 'unknown';
    for (const line of text.split(/\r?\n/)) {
      const parsed = entry(line);
      if (!parsed) continue;
      const { citation, seriesId, sourceReportedTitle } = parsed;
      const matches = seriesId ? (index.get(`${seriesId}\0${normalizeTitle(sourceReportedTitle)}`) ?? []) : [];
      // Current catalog rows are Canon-scoped. Non-Canon sources require an explicit
      // matching catalog continuity instead of borrowing the same title's Canon id.
      const canonicalItemIds = [...new Set(matches.filter(item => (item.continuity ?? 'canon') === continuity).map(item => item.id))];
      const markers = [...parsed.markers];
      if (canonicalItemIds.length > 1) markers.push('unknown:ambiguous-catalog-match');
      const record = {
        pageId: row.providerId, pageRevisionId: row.revisionId ?? null, continuity, sourceUrl: row.sourceUrl,
        sourceReportedTitle, templateName: citation.name, seriesId, canonicalItemIds, markers,
        context: contextFor(seriesId, markers), status: 'source-reported-candidate-not-published', rawEntry: line.trim(),
      };
      const identity = JSON.stringify([record.pageId, record.pageRevisionId, continuity, record.rawEntry]);
      if (!seen.has(identity)) { seen.add(identity); candidates.push(record); }
    }
  }
  const countBy = field => Object.fromEntries([...new Set(candidates.map(row => row[field] ?? 'unknown'))].map(value => [value, candidates.filter(row => (row[field] ?? 'unknown') === value).length]));
  return { candidates, stats: {
    pagesConsidered, pagesWithAppearances, candidates: candidates.length,
    matchedCandidates: candidates.filter(row => row.canonicalItemIds.length > 0).length,
    unmatchedCandidates: candidates.filter(row => row.canonicalItemIds.length === 0).length,
    ambiguousCatalogMatches: candidates.filter(row => row.canonicalItemIds.length > 1).length,
    byContinuity: countBy('continuity'), byContext: countBy('context'), bySeries: countBy('seriesId'),
  } };
}
