import { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_WORLDS } from './journeyWorlds';
import { CONNECTIONS } from './connections';
import { CATALOG, SERIES } from './catalog';
import WorldStories from './WorldStories';
import './world-directory.css';

const worlds = new Map(ALL_WORLDS.map(world => [world.id, { id: world.id, name: world.name, mapped: true }]));
for (const link of CONNECTIONS) if (!worlds.has(link.worldId)) worlds.set(link.worldId, { id: link.worldId, name: link.worldName, mapped: false });
const directory = [...worlds.values()].sort((a, b) => a.name.localeCompare(b.name));
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function WorldDirectory({ watchedIds }: { watchedIds: ReadonlySet<string> }) {
  const [query, setQuery] = useState('');
  const [placement, setPlacement] = useState('all');
  const [series, setSeries] = useState('all');
  const [revealCollections, setRevealCollections] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [limit, setLimit] = useState(12);
  const storyHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (selected) storyHeading.current?.focus(); }, [selected]);
  const accessible = useMemo(() => CONNECTIONS.filter(link => revealCollections || watchedIds.has(link.itemId)), [revealCollections, watchedIds]);
  const results = directory.filter(world => normalize(world.name).includes(normalize(query.trim())) && (placement === 'all' || world.mapped === (placement === 'mapped')) && (series === 'all' || accessible.some(link => link.worldId === world.id && CATALOG.find(item => item.id === link.itemId)?.seriesId === series)));
  const selection = directory.find(world => world.id === selected);
  const reset = () => { setQuery(''); setPlacement('all'); setSeries('all'); setLimit(12); };
  return <details className="world-directory">
    <summary>World directory <span>{directory.length} worlds · {directory.filter(world => !world.mapped).length} without map placements</span></summary>
    <section aria-label="World directory">
      <p>Explore mapped destinations and worlds with sourced story links. World names may reveal settings. A missing placement means geography is unverified here; no position is inferred.</p>
      <div className="directory-filters">
        <label>Find a world<input type="search" placeholder="World name" value={query} onChange={event => {setQuery(event.target.value);setLimit(12);}}/></label>
        <label>Map placement<select value={placement} onChange={event => {setPlacement(event.target.value);setLimit(12);}}><option value="all">All worlds</option><option value="mapped">Mapped</option><option value="unmapped">Without map placement</option></select></label>
        <label>Linked collection<select value={series} onChange={event => {setSeries(event.target.value);setLimit(12);}}><option value="all">All collections</option>{SERIES.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      </div>
      <p>{revealCollections ? 'Collection filters include unwatched titles. Individual title lists remain hidden until revealed.' : 'Collection filters use watched titles only. All collections shows every world without exposing title links.'}</p>
      {!revealCollections && <button onClick={() => setRevealCollections(true)}>Include unwatched collection links</button>}
      <p role="status">{results.length} matching worlds · {Math.min(limit, results.length)} shown</p>
      {!results.length && <p>No worlds match. Try another name, clear filters, or include unwatched collection links.</p>}
      <button onClick={reset}>Clear directory filters</button>
      <div className="directory-grid">{results.slice(0, limit).map(world => <article key={world.id}>
        <h3>{world.name}</h3><p>{world.mapped ? 'Schematic map placement' : 'Position not mapped'}</p>
        <button aria-pressed={selected === world.id} onClick={() => setSelected(world.id)}>Stories at {world.name}</button>
        {world.mapped && <a href={`#galaxy/${world.id}`}>Preview {world.name} on map</a>}
      </article>)}</div>
      {results.length > limit && <button onClick={() => setLimit(limit + 12)}>Show more worlds ({results.length - limit} remaining)</button>}
      {selection && <div className="directory-stories" aria-live="polite"><h2 ref={storyHeading} tabIndex={-1}>{selection.name}</h2>{!selection.mapped && <p>No supported map position is available. Explore title links below; map travel is unavailable.</p>}<WorldStories key={selection.id} worldId={selection.id} worldName={selection.name} watchedIds={watchedIds}/></div>}
      <p>Partial appearance coverage. Collection links do not establish complete scene coverage or a character’s route.</p>
    </section>
  </details>;
}
