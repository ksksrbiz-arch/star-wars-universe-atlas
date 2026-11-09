import {useState} from 'react';
import {Film} from 'lucide-react';
import {SERIES, type CatalogItem} from './catalog';
import {episodeRange} from './catalogPresentation';
import {localMedia, localSrcSet, sourceLink, type MediaEntry} from './SourceMedia';

/** A show poster is an explicitly labeled fallback, never an episode-specific still. */
export default function CatalogArtwork({item, media, protectStory}: {item: CatalogItem; media: ReadonlyMap<string, MediaEntry>; protectStory: boolean}) {
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set());
  const direct = media.get(`${item.kind}:${item.id}`);
  const poster = item.kind === 'episode' ? media.get(`series:${item.seriesId}`) : undefined;
  const image = [!protectStory || item.kind === 'film' ? direct : undefined, poster].find(entry => entry && localMedia(entry.src) && !failed.has(entry.src));
  if (!image) return <div className={`catalog-art catalog-art-${item.kind}`} aria-hidden="true"><span className="catalog-art-orbit"/><span className="catalog-art-small">{item.kind === 'film' ? 'FEATURE' : 'CHAPTER'}</span><strong>{item.kind === 'film' ? <Film size={26} strokeWidth={1.2}/> : episodeRange(item, true)}</strong><span className="catalog-art-bottom">{item.kind === 'film' ? item.releaseDate.slice(0, 4) : `SEASON ${String(item.season || 0).padStart(2, '0')}`}</span></div>;
  const isStill = image.entityType === 'episode';
  const label = isStill ? 'Episode image' : image.entityType === 'series' ? 'Series poster' : 'Film poster';
  const link = sourceLink(image.sourceUrl);
  return <figure className={`catalog-cover ${isStill ? 'catalog-cover-still' : 'catalog-cover-poster'}`}>
    <img src={localMedia(image.src)} srcSet={localSrcSet(image.srcSet)} sizes={isStill ? '(max-width: 720px) 88px, 160px' : '(max-width: 720px) 64px, 104px'} alt={`${label}: ${image.entityType === 'series' ? SERIES.find(series => series.id === item.seriesId)?.title || item.seriesId : item.title}`} width={isStill ? 160 : 104} height={isStill ? 90 : 156} loading="lazy" decoding="async" onError={() => setFailed(previous => new Set([...previous, image.src]))}/>
    <figcaption>{link ? <a href={link} target="_blank" rel="noreferrer" title={image.credit} aria-label={`${label} source: ${image.credit}`}>{label} ↗</a> : <span>{label}</span>}</figcaption>
  </figure>;
}
