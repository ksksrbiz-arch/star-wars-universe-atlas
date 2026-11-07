import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ArrowLeft, ArrowRight, Check, ChevronRight, Compass, ExternalLink, Eye, LockKeyhole, MapPin, Search } from 'lucide-react';

import { CATALOG, SERIES } from './catalog';

import { CONNECTIONS } from './connections';

import { STORY_SEQUENCES, STORY_CONNECTIONS } from './chronology';

import { ALL_WORLDS } from './journeyWorlds';

import './journey.css';



type Props = {

  watchedIds: ReadonlySet<string>;

  onSelectStop: (itemId: string, worldId: string) => void;

  activeItemId: string | null;

  onActiveItemChange: (id: string) => void;

};



export default function Journey({ watchedIds, onSelectStop, activeItemId, onActiveItemChange }: Props) {

  const reduceMotion = useReducedMotion();
  const [sequenceId, setSequenceId] = useState(STORY_SEQUENCES[0]?.id ?? '');

  const [query, setQuery] = useState('');

  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => new Set());

  const collectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const container = collectionRef.current;

    const selected = container?.querySelector<HTMLElement>('.is-active');

    if (container && selected) container.scrollLeft = selected.offsetLeft - container.offsetLeft;

  }, [activeItemId, sequenceId]);

  const catalogById = useMemo(() => new Map(CATALOG.map(item => [item.id, item])), []);

  const sequence = STORY_SEQUENCES.find(s => activeItemId && s.itemIds.includes(activeItemId)) ?? STORY_SEQUENCES.find(s => s.id === sequenceId) ?? STORY_SEQUENCES[0];

  if (!sequence) return <section className="journey-panel"><p>Story journeys are being prepared.</p></section>;

  const items = sequence.itemIds.map(id => catalogById.get(id)).filter((item): item is (typeof CATALOG)[number] => Boolean(item));

  const index = Math.max(0, items.findIndex(item => item.id === activeItemId));

  const item = items[index];

  if (!item) return <section className="journey-panel"><p>This journey has no available titles yet.</p></section>;

  const watchedCount = items.filter(entry => watchedIds.has(entry.id)).length;

  const isWatched = watchedIds.has(item.id);

  const showLocations = isWatched || revealedIds.has(item.id);

  const storyLinks = STORY_CONNECTIONS.filter(link => link.afterItemId === item.id || link.beforeItemId === item.id || link.itemIds?.includes(item.id));

  const connections = CONNECTIONS.filter(connection => connection.itemId === item.id);

  const visibleStart = Math.max(0, Math.min(index - 2, items.length - 5));

  const nearby = items.slice(visibleStart, visibleStart + 5);

  const normalizedQuery = query.trim().toLowerCase();

  const matches = normalizedQuery ? items.filter(entry => `${entry.title} ${entry.season ? `s${entry.season}e${entry.episode} season ${entry.season} episode ${entry.episode}` : ''}`.toLowerCase().includes(normalizedQuery)) : [];

  const selectItem = (id: string) => { onActiveItemChange(id); setQuery(''); };

  const reveal = () => setRevealedIds(previous => new Set([...previous, item.id]));



  return <section className="journey-panel" aria-label="Story journeys">

    <div className="journey-intro"><div><span className="journey-kicker"><Compass size={13}/> FOLLOW THE STORY</span><h1>A galaxy, one chapter at a time.</h1><p>Choose a story. Discover its worlds. Keep your place.</p><p className="journey-coverage">{new Set(CONNECTIONS.map(connection => connection.itemId)).size} / {CATALOG.length} titles with sourced location links · Partial appearance coverage</p></div><span className="journey-mode-badge">CURATED STORY ORDER</span></div>



    <div ref={collectionRef} className="journey-collections" role="group" aria-label="Choose a story collection">

      {STORY_SEQUENCES.map((entry, entryIndex) => {

        const color = SERIES.find(series => series.id === entry.id)?.color ?? ['#F2B96B', '#E38167', '#65DBFF', '#9FCB85'][entryIndex % 4];

        return <button key={entry.id} className={`journey-collection ${entry.id === sequence.id ? 'is-active' : ''}`} aria-pressed={entry.id === sequence.id}

          style={{ '--journey-accent': color } as React.CSSProperties}

          onClick={() => { setSequenceId(entry.id); setQuery(''); if (entry.itemIds[0]) onActiveItemChange(entry.itemIds[0]); }}>

          <span className="journey-collection-number">0{entryIndex + 1}<span/></span><strong>{SERIES.find(series => series.id === entry.id)?.title ?? entry.title}</strong><span className="journey-collection-meta">{entry.itemIds.length} chapters <ChevronRight size={14}/></span>

        </button>;

      })}

    </div>



    <div className="journey-workspace">

      <div className="journey-reader">

        <div className="journey-reader-heading"><span className="journey-kicker">{sequence.title}</span><span className="journey-chapter-count">CHAPTER {String(index + 1).padStart(2, '0')} / {items.length}</span></div>

        <div className="journey-current"><motion.div key={item.id} initial={reduceMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .22, ease: "easeOut" }}><span className="journey-item-meta">{item.kind === 'film' ? 'FEATURE FILM' : `SEASON ${item.season} · EPISODE ${item.episode}`}</span><h2>{item.title}</h2><span className={`journey-watch-status ${isWatched ? 'is-watched' : ''}`}>{isWatched ? <Check size={12}/> : <span className="journey-empty-dot"/>}{isWatched ? 'Watched' : 'Not marked watched'}</span></motion.div><div className="journey-step-controls"><button disabled={index === 0} aria-label="Previous story chapter" onClick={() => selectItem(items[index - 1].id)}><ArrowLeft size={19}/></button><button disabled={index === items.length - 1} aria-label="Next story chapter" onClick={() => selectItem(items[index + 1].id)}><ArrowRight size={19}/></button></div></div>



        <div className="journey-search"><label htmlFor="journey-title-search"><Search size={15}/><span>Find a chapter</span></label><input id="journey-title-search" type="search" placeholder="Search titles or S1E2…" value={query} onChange={event => setQuery(event.target.value)} aria-controls="journey-search-results" autoComplete="off"/>

          {normalizedQuery && <div className="journey-search-results" id="journey-search-results" role="region" aria-label="Chapter search results"><span className="journey-search-count" role="status">{matches.length ? `${matches.length} matching ${matches.length === 1 ? 'chapter' : 'chapters'}` : 'No matching chapters in this collection.'}{matches.length > 6 && ' · Showing the first 6. Refine your search.'}</span>{matches.slice(0, 6).map(result => <button key={result.id} onClick={() => selectItem(result.id)}><span>{result.title}<small>{result.kind === 'film' ? 'Film' : `S${result.season} · E${result.episode}`}</small></span><ArrowRight size={15}/></button>)}</div>}

        </div>



        <div className="journey-progress-heading"><span>YOUR PLACE IN THE STORY</span><span>{watchedCount} of {items.length} watched</span></div><div className="journey-progress-track" role="progressbar" aria-label={`${sequence.title} watched progress`} aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={watchedCount}><span style={{ width: `${watchedCount / items.length * 100}%` }}/></div>

        <ol className="journey-chapter-strip" start={visibleStart + 1}>{nearby.map((entry, nearbyIndex) => <li key={entry.id}><button className={entry.id === item.id ? 'is-current' : ''} aria-current={entry.id === item.id ? 'step' : undefined} onClick={() => selectItem(entry.id)}><span className="journey-step-number">{watchedIds.has(entry.id) ? <Check size={12}/> : String(visibleStart + nearbyIndex + 1).padStart(2, '0')}</span><span>{entry.title}</span></button></li>)}</ol>

      </div>



      <motion.div layout={reduceMotion ? false : "position"} transition={{ duration: .2 }} className="journey-worlds" aria-label={`Locations for ${item.title}`}>

        <div className="journey-worlds-heading"><span className="journey-kicker"><MapPin size={13}/> WORLDS IN THIS CHAPTER</span>{showLocations && connections.length > 0 && <span>{connections.length} linked</span>}</div>

        {connections.length === 0 ? <div className="journey-gap"><Compass size={28} strokeWidth={1}/><h3>A part of the map still to chart.</h3><p>Location evidence is not yet linked for this title. You can continue through the story while this gap is researched.</p><span>RESEARCH GAP · NO STOPS INFERRED</span></div> : !showLocations ? <div className="journey-spoiler"><LockKeyhole size={27} strokeWidth={1.2}/><h3>Let the story surprise you.</h3><p>You haven’t marked this title watched. Its location connections are hidden until you choose to reveal them.</p><button onClick={reveal}><Eye size={15}/> Reveal locations for this title</button><small>This won’t change your watch progress.</small></div> : <>

          <div className="journey-stop-list">{connections.map((connection, connectionIndex) => {

            const world = ALL_WORLDS.find(w => w.id === connection.worldId);

            return <article className="journey-stop" key={`${connection.itemId}-${connection.worldId}-${connectionIndex}`}><span className="journey-stop-dot" style={{ background: world?.color ?? '#5e7288' }}/><div><h3>{connection.worldName}</h3><p>{world ? world.region : 'Position not mapped in this atlas'}</p><p className="journey-stop-note">{connection.note}</p><a className="journey-stop-source" href={connection.sourceUrl} target="_blank" rel="noreferrer">Appearance source <ExternalLink size={10}/></a></div><button disabled={!world} onClick={() => world && onSelectStop(item.id, world.id)} aria-label={world ? `Show ${connection.worldName} on map` : `${connection.worldName}: map unavailable`}>{world ? <><span>Show on map</span><ArrowRight size={15}/></> : <span>Map unavailable</span>}</button></article>;

          })}</div><p className="journey-route-note">These are title-level appearances, not a single character’s travel itinerary. No within-title stop order or continuous travel route is implied.</p>

        </>}

      </motion.div>

    </div>



    {storyLinks.length > 0 && <div className="journey-bridges" aria-label="Related story connections">{storyLinks.map(link => <article key={link.id}><span className="journey-kicker">{link.kind === 'overlap' ? 'PARALLEL STORY' : 'BETWEEN CHAPTERS'} · OUTSIDE THIS COLLECTION</span><h3>{link.externalTitles.join(' / ')}</h3><p>{link.description}</p><a href={link.sourceUrl} target="_blank" rel="noreferrer">Connection reference <ExternalLink size={11}/></a></article>)}</div>}

    <details className="journey-sources"><summary>About this story order & sources <ExternalLink size={12}/></summary><div><p>{sequence.description}</p>{sequence.caveats.length > 0 && <ul>{sequence.caveats.map((caveat, i) => <li key={i}>{caveat}</li>)}</ul>}<a href={sequence.sourceUrl} target="_blank" rel="noreferrer">Story order reference <ExternalLink size={11}/></a><a href={item.sourceUrl} target="_blank" rel="noreferrer">Current title reference <ExternalLink size={11}/></a>{showLocations && connections.map((connection, i) => <p className="journey-evidence" key={i}><a href={connection.sourceUrl} target="_blank" rel="noreferrer">{connection.worldName} appearance source <ExternalLink size={11}/></a><span>{connection.note}</span></p>)}</div></details>

  </section>;

}

