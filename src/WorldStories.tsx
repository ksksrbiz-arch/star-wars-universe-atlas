import { useState } from 'react';
import { ArrowUpRight, BookOpen, Eye } from 'lucide-react';
import { CONNECTIONS } from './connections';
import { CATALOG } from './catalog';

export default function WorldStories({ worldId, worldName, watchedIds }: { worldId: string; worldName: string; watchedIds: ReadonlySet<string> }) {
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const ids = [...new Set(CONNECTIONS.filter(link => link.worldId === worldId).map(link => link.itemId))];
  const visible = ids.filter(id => watchedIds.has(id) || revealed.has(worldId));

  return <section className="world-stories" aria-label="Linked stories">
    <div className="world-stories-kicker"><BookOpen size={13} aria-hidden="true"/> THE STORY CONTINUES</div>
    <h3>Stories at {worldName} <span>{ids.length}</span></h3>
    {!ids.length ? <p>No title-level location evidence linked yet.</p> : <>
      <div className="world-story-grid">{visible.slice(0, 6).map(id => {
        const item = CATALOG.find(entry => entry.id === id);
        return <a href={`#journey/${id}`} key={id}>
          <span className="world-story-meta">{item?.kind === 'film' ? 'Feature film' : `Season ${item?.season} · Episode ${item?.episode}`}</span>
          <strong>{item?.title}</strong><span className="world-story-action">Follow story <ArrowUpRight size={13} aria-hidden="true"/></span>
        </a>;
      })}</div>
      {visible.length > 6 && <p>{visible.length - 6} more sourced appearances are available through Journey search.</p>}
      {visible.length < ids.length && <button onClick={() => setRevealed(old => new Set([...old, worldId]))}><Eye size={14} aria-hidden="true"/> Reveal linked unwatched titles</button>}
      <p>Partial appearance coverage. A title link does not imply a character’s continuous route.</p>
    </>}
  </section>;
}
