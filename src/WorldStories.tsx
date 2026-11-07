import { useState } from 'react';
import { ArrowUpRight, BookOpen, Eye } from 'lucide-react';
import { CONNECTIONS } from './connections';
import { CATALOG, SERIES } from './catalog';
import './world-stories.css';
import RelatedWorlds from './RelatedWorlds';

export default function WorldStories({ worldId, worldName, watchedIds }: { worldId: string; worldName: string; watchedIds: ReadonlySet<string> }) {
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [expandedWorlds, setExpandedWorlds] = useState<Set<string>>(() => new Set());
  const [filters, setFilters] = useState({ worldId, query: '', series: 'all' });
  const current = filters.worldId === worldId ? filters : { worldId, query: '', series: 'all' };
  const update = (patch: Partial<typeof filters>) => setFilters({ ...current, ...patch, worldId });
  const ids = [...new Set(CONNECTIONS.filter(link => link.worldId === worldId).map(link => link.itemId))];
  const visible = ids.filter(id => watchedIds.has(id) || revealed.has(worldId));

  const items = CATALOG.filter(item => visible.includes(item.id));
  const matching = items.filter(item => (current.series === 'all' || item.seriesId === current.series) && `${item.title} ${SERIES.find(series => series.id === item.seriesId)?.title} ${item.season ? `s${String(item.season).padStart(2, '0')}e${String(item.episode).padStart(2, '0')}` : ''}`.toLowerCase().includes(current.query.trim().toLowerCase()));

  return <section className="world-stories" aria-label="Linked stories">
    <div className="world-stories-kicker"><BookOpen size={13} aria-hidden="true"/> THE STORY CONTINUES</div>
    <h3>Stories at {worldName} <span>{ids.length}</span></h3>
    {!ids.length ? <p>No title-level location evidence linked yet.</p> : <>
      {items.length > 0 && <div className="world-story-filters">
        <label>Find a linked title<input type="search" value={current.query} placeholder="Title or S01E01" onChange={event => update({ query: event.target.value })}/></label>
        <label>Collection<select value={current.series} onChange={event => update({ series: event.target.value })}><option value="all">All collections</option>{SERIES.filter(series => items.some(item => item.seriesId === series.id)).map(series => <option key={series.id} value={series.id}>{series.title}</option>)}</select></label>
      </div>}
      {items.length > 0 && <p role="status">{matching.length} matching {matching.length === 1 ? 'title' : 'titles'}{visible.length < ids.length ? ' · Unwatched titles remain hidden' : ''}</p>}
      {items.length > 0 && matching.length === 0 && <p>No revealed titles match these filters. <button onClick={() => update({ query: '', series: 'all' })}>Clear filters</button></p>}
      <div className="world-story-grid">{matching.slice(0, expandedWorlds.has(worldId) ? undefined : 6).map(item => {
        const id = item.id;
        return <article className="world-story-card" key={`${worldId}:${id}`}><a href={`#journey/${id}`}>
          <span className="world-story-meta">{SERIES.find(series => series.id === item.seriesId)?.title} · {item.kind === 'film' ? 'Feature film' : `Season ${item.season} · Episode ${item.episode}`}</span>
          <strong>{item.title}</strong><span className="world-story-action">Follow story <ArrowUpRight size={13} aria-hidden="true"/></span>
        </a><RelatedWorlds itemId={id} title={item.title} currentWorldId={worldId}/></article>;
      })}</div>
      {matching.length > 6 && !expandedWorlds.has(worldId) && <button onClick={() => setExpandedWorlds(old => new Set([...old, worldId]))}>Show {matching.length - 6} more linked stories</button>}
      {visible.length < ids.length && <button onClick={() => setRevealed(old => new Set([...old, worldId]))}><Eye size={14} aria-hidden="true"/> Reveal linked unwatched titles</button>}
      {matching.length > 0 && <details className="world-story-evidence">
        <summary>Sources for {matching.length} matching {matching.length === 1 ? 'title' : 'titles'}</summary>
        <ul>{matching.map(item => {
          const evidence = CONNECTIONS.filter(link => link.worldId === worldId && link.itemId === item.id);
          return <li key={item.id}><strong>{item.title}</strong>{evidence.map(link => <div key={link.sourceUrl}><p>{link.note}</p><a href={link.sourceUrl} target="_blank" rel="noopener noreferrer">Read official source for {item.title} ↗</a></div>)}</li>;
        })}</ul>
      </details>}
      <p>Partial appearance coverage. A title link does not imply a character’s continuous route.</p>
    </>}
  </section>;
}
