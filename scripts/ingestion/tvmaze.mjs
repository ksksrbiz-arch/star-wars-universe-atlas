/** TVmaze is a bulk metadata/media source, never authority for a planet appearance.
 * This collector stages provider records (including specials and future stubs).
 * The caller owns HTTP retry/cache/rate limits and any reviewed publication step.
 * Source/credit metadata does not assert ownership of promotional images.
 */
export const TVMAZE_SHOWS = Object.freeze([
  { showId: 563, seriesId: 'clone-wars', name: 'Star Wars: The Clone Wars' },
  { showId: 117, seriesId: 'rebels', name: 'Star Wars: Rebels' },
  { showId: 49190, seriesId: 'bad-batch', name: 'Star Wars: The Bad Batch' },
  { showId: 52343, seriesId: 'ahsoka', name: 'Ahsoka' },
  { showId: 52260, seriesId: 'obi-wan', name: 'Obi-Wan Kenobi' },
  { showId: 52523, seriesId: 'boba-fett', name: 'The Book of Boba Fett' },
  { showId: 38963, seriesId: 'mandalorian', name: 'The Mandalorian' },
  { showId: 52341, seriesId: 'andor', name: 'Andor' },
].map(Object.freeze));

export const TVMAZE_SHOW_MAP = Object.freeze(Object.fromEntries(TVMAZE_SHOWS.map(show => [show.showId, show.seriesId])));
const API = 'https://api.tvmaze.com';
const CREDIT = 'TVmaze — https://www.tvmaze.com';
const CAVEATS = Object.freeze([
  'Staging only: provider records do not alter the reviewed catalog or appearance graph.',
  'Specials, future placeholders and split/combined episodes require explicit reconciliation; do not join by season/episode alone.',
  'Show cast is not proof of a person or character appearing in every episode.',
  'Character portraits remain in raw cast data and are not mislabeled as actor photographs.',
  'Banner/typography gallery items remain in raw imageGallery; they are not mislabeled as posters or backdrops.',
  'TVmaze API metadata requires attribution/ShareAlike compliance; image attribution is not a claim of underlying copyright ownership.',
]);

function plainText(value) {
  if (typeof value !== 'string') return undefined;
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…' };
  return value.replace(/<[^>]*>/g, ' ').replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, key) => {
    if (key.startsWith('#')) {
      const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
      return Number.isInteger(code) && code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : match;
    }
    return entities[key.toLowerCase()] ?? match;
  }).replace(/\s+/g, ' ').trim() || undefined;
}

function imageMedia(image, kind) {
  if (!image || typeof image !== 'object') return null;
  const resolution = image.resolutions?.original ?? image.resolutions?.medium;
  const sourceUrl = resolution?.url ?? image.original ?? image.medium;
  try {
    const url = new URL(sourceUrl);
    // Collection records must not seed arbitrary hosts for a later media fetcher.
    if (url.protocol !== 'https:' || url.hostname !== 'static.tvmaze.com') return null;
    return {
      sourceUrl: url.href, kind, credit: CREDIT,
      ...(Number.isFinite(resolution?.width) && resolution.width > 0 ? { width: resolution.width } : {}),
      ...(Number.isFinite(resolution?.height) && resolution.height > 0 ? { height: resolution.height } : {}),
    };
  } catch { return null; }
}

function uniqueMedia(items) {
  return [...new Map(items.filter(Boolean).map(item => [`${item.kind}:${item.sourceUrl}`, item])).values()];
}

function safePageUrl(value, fallback) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['www.tvmaze.com', 'tvmaze.com'].includes(url.hostname) ? url.href : fallback;
  } catch { return fallback; }
}

/** requestJson(url) must resolve to the parsed provider JSON, not a Response. */
export async function collectTvmaze({ requestJson, showIds = TVMAZE_SHOWS.map(show => show.showId), includeImages = true } = {}) {
  if (typeof requestJson !== 'function') throw new TypeError('collectTvmaze requires requestJson(url)');
  if (!Array.isArray(showIds)) throw new TypeError('showIds must be an array of numeric TVmaze show IDs');
  const ids = [...new Set(showIds.map(Number))];
  if (ids.some(id => !Number.isSafeInteger(id) || id <= 0)) throw new TypeError('Invalid TVmaze show ID');
  const records = [], errors = [], perShow = [], people = new Map();
  let requestsAttempted = 0;
  const get = async url => { requestsAttempted++; return requestJson(url); };
  for (const showId of ids) {
    const sourceUrl = `${API}/shows/${showId}?embed[]=episodeswithspecials&embed[]=cast`;
    const imageUrl = `${API}/shows/${showId}/images`;
    const [showResult, galleryResult] = await Promise.allSettled([
      get(sourceUrl), includeImages ? get(imageUrl) : Promise.resolve([]),
    ]);
    if (showResult.status === 'rejected') {
      errors.push({ providerId: `show:${showId}`, url: sourceUrl, phase: 'show', message: String(showResult.reason?.message ?? showResult.reason) });
      if (galleryResult.status === 'rejected') errors.push({ providerId: `show:${showId}`, url: imageUrl, phase: 'images', message: String(galleryResult.reason?.message ?? galleryResult.reason) });
      continue;
    }
    const show = showResult.value;
    if (!show || Number(show.id) !== showId || typeof show.name !== 'string') {
      errors.push({ providerId: `show:${showId}`, url: sourceUrl, phase: 'normalization', message: 'Provider did not return the requested show identity.' });
      continue;
    }
    const seriesId = TVMAZE_SHOW_MAP[showId];
    const gallery = galleryResult.status === 'fulfilled' && Array.isArray(galleryResult.value) ? galleryResult.value : [];
    if (galleryResult.status === 'rejected') errors.push({ providerId: `show:${showId}`, url: imageUrl, phase: 'images', message: String(galleryResult.reason?.message ?? galleryResult.reason) });
    else if (!Array.isArray(galleryResult.value)) errors.push({ providerId: `show:${showId}`, url: imageUrl, phase: 'normalization', message: 'Image gallery is not an array.' });
    const embedded = show._embedded ?? {};
    const episodes = Array.isArray(embedded.episodeswithspecials) ? embedded.episodeswithspecials : Array.isArray(embedded.episodes) ? embedded.episodes : [];
    const cast = Array.isArray(embedded.cast) ? embedded.cast : [];
    if (!Array.isArray(embedded.episodeswithspecials) && !Array.isArray(embedded.episodes)) errors.push({ providerId: `show:${showId}`, url: sourceUrl, phase: 'normalization', message: 'Embedded episode list is missing; no completeness claim is made.' });
    const seriesMedia = uniqueMedia([
      imageMedia(show.image, 'poster'),
      ...gallery.map(image => imageMedia(image, image.type === 'poster' ? 'poster' : image.type === 'background' ? 'backdrop' : null)).filter(item => item?.kind),
    ]);
    records.push({
      providerId: `show:${showId}`, entityType: 'series', name: show.name,
      sourceUrl: safePageUrl(show.url, `https://www.tvmaze.com/shows/${showId}`),
      ...(seriesId ? { seriesId } : {}), ...(plainText(show.summary) ? { description: plainText(show.summary) } : {}),
      media: seriesMedia, raw: { ...show, imageGallery: gallery },
    });
    let episodeImageCount = 0, stagedEpisodes = 0;
    for (const episode of episodes) {
      if (!episode || !Number.isSafeInteger(episode.id) || typeof episode.name !== 'string') {
        errors.push({ providerId: `show:${showId}`, url: sourceUrl, phase: 'normalization', message: 'Skipped an episode without a stable provider ID/name.' });
        continue;
      }
      const media = uniqueMedia([imageMedia(episode.image, 'episode-still')]);
      episodeImageCount += media.length; stagedEpisodes++;
      records.push({
        providerId: `episode:${episode.id}`, entityType: 'episode', name: episode.name,
        sourceUrl: safePageUrl(episode.url, `https://www.tvmaze.com/episodes/${episode.id}`),
        ...(seriesId ? { seriesId } : {}),
        ...(Number.isInteger(episode.season) && episode.season >= 0 ? { season: episode.season } : {}),
        ...(Number.isInteger(episode.number) && episode.number >= 0 ? { episode: episode.number } : {}),
        ...(plainText(episode.summary) ? { description: plainText(episode.summary) } : {}),
        media, raw: episode,
      });
    }
    for (const row of cast) {
      const person = row?.person;
      if (!person || !Number.isSafeInteger(person.id) || typeof person.name !== 'string') continue;
      const record = {
        providerId: `person:${person.id}`, entityType: 'person', name: person.name,
        sourceUrl: safePageUrl(person.url, `https://www.tvmaze.com/people/${person.id}`),
        media: uniqueMedia([imageMedia(person.image, 'person-image')]), raw: person,
      };
      const previous = people.get(person.id);
      if (previous) previous.media = uniqueMedia([...previous.media, ...record.media]);
      else people.set(person.id, record);
    }
    perShow.push({
      showId, seriesId: seriesId ?? null, name: show.name,
      rawEpisodeCount: episodes.length, stagedEpisodeCount: stagedEpisodes, episodeImageCount,
      regularEpisodeCount: episodes.filter(episode => episode?.type === 'regular').length,
      specialEpisodeCount: episodes.filter(episode => episode?.type !== 'regular').length,
      futureOrUndatedEpisodeCount: episodes.filter(episode => !episode?.airdate || episode.airdate > new Date().toISOString().slice(0, 10)).length,
      castCount: cast.length, rawGalleryImageCount: gallery.length, stagedSeriesImageCount: seriesMedia.length,
      unclassifiedGalleryImageCount: gallery.filter(image => !['poster', 'background'].includes(image?.type)).length,
    });
  }
  records.push(...people.values());
  return {
    provider: 'tvmaze', records,
    stats: {
      requestsAttempted, requestedShows: ids.length, collectedShows: perShow.length,
      seriesRecords: records.filter(record => record.entityType === 'series').length,
      episodeRecords: records.filter(record => record.entityType === 'episode').length,
      personRecords: people.size,
      mediaReferences: records.reduce((sum, record) => sum + record.media.length, 0),
      partial: errors.length > 0, perShow, normalizationCaveats: [...CAVEATS],
    },
    errors,
  };
}
