import { useEffect, useState } from 'react';
import { ArrowUpRight, UserRound } from 'lucide-react';
import { localMedia, type SourceImage } from './SourceMedia';
import './character-card.css';

export type CharacterCardEntry = {
  id: string;
  providerId: string;
  name: string;
  description?: string;
  sourceUrl: string;
  image?: SourceImage;
  cutout?: SourceImage;
};
type Props = { entry: CharacterCardEntry; onOpen?: () => void; featured?: boolean };
const artworkPath = (value?: string) => localMedia(value) ?? (value && /^\/visuals\/characters\/[a-zA-Z0-9_-]+\.(?:png|webp|avif|svg)$/.test(value) ? value : undefined);
const safeSet = (value?: string) => value && value.split(',').every(part => /^\/media\/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp|avif)\s+\d+w$/.test(part.trim())) ? value : undefined;

/** Artwork leads the presentation; source photographs are distinguished from actual cutouts. */
export default function CharacterCard({ entry, onOpen, featured = false }: Props) {
  const [failedCutout, setFailedCutout] = useState(false);
  const [failedPortrait, setFailedPortrait] = useState(false);
  const cutout = !failedCutout ? artworkPath(entry.cutout?.src) : undefined;
  const portrait = !failedPortrait ? artworkPath(entry.image?.src) : undefined;
  const src = cutout ?? portrait;
  const mode = cutout ? 'cutout' : portrait ? 'portrait' : 'fallback';
  const artwork = cutout ? entry.cutout : entry.image;
  const Tag = onOpen ? 'button' : 'article';
  useEffect(() => { setFailedCutout(false); setFailedPortrait(false); }, [entry.id, entry.cutout?.src, entry.image?.src]);

  return <Tag className={`character-card${featured ? ' character-card-featured' : ''}`} data-art-mode={mode} data-character-id={entry.id}
    {...(onOpen ? { type: 'button' as const, onClick: onOpen, 'aria-label': `View ${entry.name} character card` } : { 'aria-label': `${entry.name} character card` })}>
    <span className="character-card-art" aria-hidden="true">
      {src ? <img src={src} srcSet={safeSet(artwork?.srcSet)} sizes={featured ? '(max-width: 700px) 85vw, 540px' : '(max-width: 600px) 85vw, (max-width: 1000px) 40vw, 350px'} alt="" loading={featured ? 'eager' : 'lazy'} decoding="async" onError={() => cutout ? setFailedCutout(true) : setFailedPortrait(true)}/>
        : <span className="character-card-missing"><UserRound size={80} strokeWidth={.8}/><span>Reference image unavailable</span></span>}
    </span>
    <span className="character-card-caption"><span className="character-card-category">CHARACTER</span><h2 className="character-card-name">{entry.name}</h2>{onOpen && <span className="character-card-open">Explore character <ArrowUpRight size={14}/></span>}</span>
  </Tag>;
}
