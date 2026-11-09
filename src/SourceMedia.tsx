import { useEffect, useState } from 'react';
import { ExternalLink, Eye, ImageOff } from 'lucide-react';
import './source-media.css';
import {useSpoilerPreference} from './spoilerPreference';
import filmCovers from './filmCovers.generated.json';

export type SourceImage = { src: string; srcSet?: string; credit: string; sourceUrl: string };
export type MediaEntry = SourceImage & { entityId: string; entityType: 'film' | 'episode' | 'world' | 'series'; provider: string };
let mediaRequest: Promise<MediaEntry[]> | undefined;

export function sourceLink(url: string): string | undefined {
  try { const parsed = new URL(url); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : undefined; } catch { return undefined; }
}
export function localMedia(url?: string): string | undefined {
  return url?.startsWith('/media/') && !/[\\\s]/.test(url) ? url : undefined;
}
export function localSrcSet(value?: string): string | undefined {
  return value && value.split(',').every(part => /^\/media\/[^\s,\\]+(?:\s+\d+w)?$/.test(part.trim())) ? value : undefined;
}
function loadMedia(): Promise<MediaEntry[]> {
  if (!mediaRequest) mediaRequest = fetch('/api/media-index').then(async response => {
    if (!response.ok) throw new Error('Media unavailable');
    const data = await response.json();
    return [...filmCovers.items as MediaEntry[], ...(Array.isArray(data.items) ? data.items : [])];
  }).catch(() => { mediaRequest = undefined; return filmCovers.items as MediaEntry[]; });
  return mediaRequest;
}

export function useSourceMediaIndex() {
  const [entries, setEntries] = useState<MediaEntry[]>(filmCovers.items as MediaEntry[]);
  useEffect(() => { let active = true; void loadMedia().then(items => { if (active) setEntries(items); }); return () => { active = false; }; }, []);
  return entries;
}

export function CreditedImage({ image, alt, className = '' }: { image: SourceImage; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image.src]);
  const src = localMedia(image.src);
  if (!src) return null;
  const link = sourceLink(image.sourceUrl);
  return <figure className={`source-image ${className}`}>
    {failed ? <div className="source-image-fallback"><ImageOff size={22} aria-hidden="true"/><span>Reference image unavailable</span></div> : <img src={src} srcSet={localSrcSet(image.srcSet)} sizes="(max-width: 720px) 90vw, 520px" alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)}/>}
    <figcaption>{link ? <a href={link} target="_blank" rel="noreferrer">{image.credit || 'Image source'} <ExternalLink size={11} aria-hidden="true"/></a> : <span>{image.credit || 'Reference image'}</span>}</figcaption>
  </figure>;
}

/** Reference imagery never changes map placement or establishes an appearance link. */
export default function SourceMedia({ entityId, entityType, title, revealed = false }: { entityId: string; entityType: MediaEntry['entityType']; title: string; revealed?: boolean }) {
  const {hideSpoilers}=useSpoilerPreference();
  const entries = useSourceMediaIndex();
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const entry = entries.find(item => item.entityId === entityId && (item.entityType === entityType || item.entityType === 'film' && entityType === 'episode') && localMedia(item.src));
  if (!entry) return null;
  const visible = !hideSpoilers || revealed || revealedId === entityId;
  return <section className={`source-media source-media-${entityType}`} aria-label={`${title} source imagery`}>
    {visible ? <><span className="source-media-kicker">{entry.entityType === 'film' ? 'FILM POSTER' : entityType === 'episode' ? 'FROM THIS CHAPTER' : 'REFERENCE IMAGE'}</span><CreditedImage image={entry} className={entry.entityType === 'film' ? 'source-image-poster' : ''} alt={entry.entityType === 'film' ? `Film poster: ${title}` : entityType === 'episode' ? `A scene from ${title}` : `${title} source reference`}/></> : <div className="source-media-gate"><Eye size={17} aria-hidden="true"/><div><strong>{entityType === 'episode' ? 'A frame from this chapter' : 'Explore a source image'}</strong><p>Source imagery may reveal story details.</p><button onClick={() => setRevealedId(entityId)}>{entityType === 'episode' ? 'Reveal image for this title' : 'Reveal reference image'}</button></div></div>}
  </section>;
}
