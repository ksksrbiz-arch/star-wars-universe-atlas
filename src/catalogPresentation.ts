import type { CatalogItem } from './catalog';

/** A combined watch record can cover multiple official episode parts. */
export function episodeRange(item: CatalogItem, padded = false): string {
  const format = (value: number | undefined) => padded ? String(value).padStart(2, '0') : String(value);
  return format(item.episode) + (item.episodeEnd && item.episodeEnd !== item.episode ? `–${format(item.episodeEnd)}` : '');
}

export function matchesEpisode(item: CatalogItem, season: number, episode: number): boolean {
  return item.kind === 'episode' && item.season === season && item.episode !== undefined && episode >= item.episode && episode <= (item.episodeEnd ?? item.episode);
}

export function episodeAliases(item: CatalogItem): string {
  if (item.kind !== 'episode' || item.episode === undefined) return '';
  return Array.from({ length: (item.episodeEnd ?? item.episode) - item.episode + 1 }, (_, index) => {
    const episode = item.episode! + index;
    return `S${item.season}E${episode} S${String(item.season).padStart(2, '0')}E${String(episode).padStart(2, '0')} season ${item.season} episode ${episode}`;
  }).join(' ');
}
