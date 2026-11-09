import { useId, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { DATABANK_GUIDES } from './databankGuides';
import './databank-guide.css';

/** Reviewed world context is separate from title-level appearance evidence. */
export default function DatabankGuide({ worldId, worldName }: { worldId: string; worldName: string }) {
  const guide = DATABANK_GUIDES[worldId as keyof typeof DATABANK_GUIDES];
  const [revealedWorlds, setRevealedWorlds] = useState<ReadonlySet<string>>(() => new Set());
  const sectionId = useId();
  if (!guide) return null;
  const revealed = revealedWorlds.has(worldId);
  const kinds = [...new Set(guide.connections.map(connection => connection.kind))];
  return <section className="databank-guide" aria-label={`${worldName} official Databank guide`}>
    <header><span className="databank-kicker">OFFICIAL SOURCE GUIDE</span><h4>Inside the Databank</h4><p>Original summaries from reviewed StarWars.com entries. Checked {guide.checkedAt}.</p></header>
    <dl className="databank-environment">{guide.environment.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.text}<a href={fact.sourceUrl} target="_blank" rel="noopener noreferrer">{fact.label} source <ExternalLink size={12} aria-hidden="true"/></a></dd></div>)}</dl>
    <div className="databank-disclosure"><p>Connections and official media may reveal story details across the saga. External pages have their own spoilers.</p><button type="button" aria-expanded={revealed} aria-controls={sectionId} onClick={() => setRevealedWorlds(previous => { const next = new Set(previous); if (revealed) next.delete(worldId); else next.add(worldId); return next; })}>{revealed ? `Hide Databank connections and media for ${worldName}` : `Reveal Databank connections and media for ${worldName}`}</button></div>
    <div id={sectionId} hidden={!revealed}>{revealed && <>
      <div className="databank-connections">{kinds.map(kind => <section key={kind} aria-label={`${worldName} ${kind} connections`}><h5>{kind.replaceAll('-', ' ')}</h5><ul>{guide.connections.filter(connection => connection.kind === kind).map(connection => <li key={connection.id}><a href={connection.sourceUrl} target="_blank" rel="noopener noreferrer">{connection.name}<ExternalLink size={12} aria-hidden="true"/></a><p>{connection.summary}</p></li>)}</ul></section>)}</div>
      <section className="databank-media" aria-label={`${worldName} official galleries and videos`}><h5>Official galleries & videos</h5><p>Open media on StarWars.com. Official media stays on the source site; the Atlas planet artwork is original illustration.</p><ul>{guide.media.map(media => <li key={media.id}><span>{media.kind === 'gallery' ? 'Gallery' : 'Video'}{'imageCount' in media && media.imageCount ? ` · ${media.imageCount} images` : ''}</span><a href={media.url} target="_blank" rel="noopener noreferrer">{media.title}<ExternalLink size={12} aria-hidden="true"/></a><small>{media.credit}</small></li>)}</ul><a className="databank-fallback" href={guide.sourceUrl} target="_blank" rel="noopener noreferrer">Media link unavailable? Open the {worldName} Databank entry <ExternalLink size={12} aria-hidden="true"/></a></section>
      <p className="databank-evidence-note">These are sourced world connections, not verified episode appearances, physical visits or a chronological route. Broad film and series tags remain separate from the Atlas’s reviewed title links.</p>
    </>}</div>
  </section>;
}
