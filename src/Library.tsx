import { episodeRange, episodeAliases, matchesEpisode } from './catalogPresentation';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ArrowDownWideNarrow, ArrowRight, BookmarkCheck, CalendarDays, Check, ChevronDown, Circle, Clock3, ExternalLink, Film, ListFilter, Search, Sparkles, X } from 'lucide-react';
import { CATALOG, CATALOG_METADATA, SERIES, type CatalogItem } from './catalog';
import './library.css';
import { STORY_SEQUENCES } from './chronology';

type Props = {
  watchedIds: ReadonlySet<string>;
  onToggleWatched: (id: string) => void;
  initialQuery?: string;
  mode?: 'library' | 'watch' | 'timeline';
};
const PAGE_SIZE = 24;
const FILM_DATE_NOTES: Readonly<Record<string, string | undefined>> = CATALOG_METADATA.filmReleaseDateNotes;
const dateLabel = (value: string) => value ? new Date(`${value.slice(0,10)}T12:00:00`).toLocaleDateString('en-US', { month:'short',day:'numeric',year:'numeric' }) : 'Release date unknown';
const releaseSort = (a: CatalogItem,b:CatalogItem) => a.releaseDate.localeCompare(b.releaseDate) || (a.season||0)-(b.season||0) || (a.episode||0)-(b.episode||0) || a.title.localeCompare(b.title);

export default function Library({watchedIds,onToggleWatched,initialQuery='',mode='library'}:Props) {
  const reduceMotion = useReducedMotion();
  const [query,setQuery] = useState(initialQuery);
  const [seriesId,setSeriesId] = useState('all');
  const [status,setStatus] = useState<'all'|'watched'|'unwatched'>('all');
  const [order,setOrder] = useState<'release'|'story'>('release');
  const [limit,setLimit] = useState(PAGE_SIZE);
  useEffect(() => {setQuery(initialQuery);},[initialQuery]);
  useEffect(() => {setLimit(PAGE_SIZE);},[query,seriesId,status,order,mode]);
  const seriesItems = useMemo(() => CATALOG.filter(item => seriesId==='all'||item.seriesId===seriesId),[seriesId]);
  const storySequence = STORY_SEQUENCES.find(sequence => sequence.id === seriesId);
  const storyRanks = useMemo(() => new Map(storySequence?.itemIds.map((id, index) => [id,index+1]) || []), [storySequence]);
  const supportsStoryOrder = !!storySequence && seriesItems.every(item => storyRanks.has(item.id));
  const actualOrder = supportsStoryOrder ? order : 'release';
  const queried = useMemo(() => seriesItems.filter(item => {
    const series = SERIES.find(s=>s.id===item.seriesId);
    const normalized = query.trim().toLowerCase();
    const episodeQuery = normalized.match(/^s(\d+)e(\d+)$/) ?? normalized.match(/^season\s+(\d+)\s+episode\s+(\d+)$/);
    if (episodeQuery) return matchesEpisode(item, Number(episodeQuery[1]), Number(episodeQuery[2]));
    return `${item.title} ${series?.title||''} ${item.kind} ${item.season !== undefined ? episodeAliases(item) : ''}`.toLowerCase().includes(normalized);
  }),[seriesItems,query]);
  const sorted = useMemo(() => [...queried].sort(actualOrder==='story'?(a,b)=>((storyRanks.get(a.id)||0)-(storyRanks.get(b.id)||0)):releaseSort),[queried,actualOrder,storyRanks]);
  const filtered = sorted.filter(item => status==='all' || (status==='watched'?watchedIds.has(item.id):!watchedIds.has(item.id)));
  const visible = filtered.slice(0,limit);
  const watchedCount = CATALOG.filter(item=>watchedIds.has(item.id)).length;
  const percent = Math.round(watchedCount/CATALOG.length*100);
  // Up next follows the selected collection in release order, independent of search text.
  const nextItem = useMemo(() => [...seriesItems].sort(releaseSort).find(item=>!watchedIds.has(item.id)),[seriesItems,watchedIds]);
  const titles = {library:'Every story starts somewhere.',watch:'Make your way through the galaxy.',timeline:'Across the years. Into the galaxy.'};
  const intros = {library:'Find a film. Follow a series. Keep your place.',watch:'Your viewing progress, one story at a time.',timeline:'Explore when these stories reached our screens.'};
  const nextSeries = nextItem && SERIES.find(s=>s.id===nextItem.seriesId);
  const HeaderIcon = mode === 'watch' ? BookmarkCheck : mode === 'timeline' ? CalendarDays : Film;
  const selectionTitle = SERIES.find(series => series.id === seriesId)?.title || 'All collections';

  return <section className={`library-view library-mode-${mode}`} aria-label={mode==='watch'?'Watch progress':mode==='timeline'?'Release timeline':'Story library'}>
    <div className="library-intro"><div className="library-intro-copy"><div className="eyebrow"><span className="small-line"/>{mode==='timeline'?'RELEASE TIMELINE':mode==='watch'?'YOUR WATCHLIST':'THE STORY LIBRARY'}</div><h1>{titles[mode]}</h1><p>{intros[mode]}</p></div><div className="library-total"><HeaderIcon size={22} strokeWidth={1.3} aria-hidden="true"/><strong>{CATALOG.length}</strong><span>FILMS & EPISODES<br/>IN THIS COLLECTION</span></div><span className="library-intro-orbit" aria-hidden="true"/></div>
    {mode==='watch' && <div className="watch-overview"><div className="watch-progress-card"><div className="progress-ring" style={{'--progress':`${percent*3.6}deg`} as CSSProperties}><div><strong>{percent}<small>%</small></strong><span>EXPLORED</span></div></div><div><span className="eyebrow">YOUR JOURNEY</span><h2>{watchedCount} <span>of {CATALOG.length} watched</span></h2><p>Progress stays in this browser.</p></div></div><div className="watch-next-card" style={{'--series-color':nextSeries?.color||'#e4c797'} as CSSProperties}><div className="next-card-icon"><Film size={26}/></div><div className="next-card-copy"><span className="eyebrow">{nextItem?'UP NEXT · RELEASE ORDER':'ALL CAUGHT UP'}</span><h2>{nextItem?.title||'You’ve explored this selection.'}</h2><p>{nextItem?`${nextSeries?.title} · ${nextItem.kind==='film'?'Film':`S${nextItem.season} · E${episodeRange(nextItem)}`}`:'Choose another collection or revisit a favorite.'}</p></div>{nextItem && <button className="next-watch-button" onClick={()=>onToggleWatched(nextItem.id)} aria-label={`Mark ${nextItem.title} watched`}><Check size={16}/><span>Mark watched</span></button>}</div></div>}

    <div className="collection-tabs" aria-label="Filter by collection"><button className={seriesId==='all'?'active':''} onClick={()=>{setSeriesId('all');setOrder('release');}} aria-pressed={seriesId==='all'}><span className="collection-dot all-dot"/>All stories<span className="collection-count">{CATALOG.length}</span></button>{SERIES.map(series=><button key={series.id} className={seriesId===series.id?'active':''} onClick={()=>{setSeriesId(series.id);setOrder('release');}} style={{'--series-color':series.color} as CSSProperties} aria-pressed={seriesId===series.id}><span className="collection-dot"/>{series.title}<span className="collection-count">{CATALOG.filter(item=>item.seriesId===series.id).length}</span></button>)}</div>

    <div className="library-toolbar"><div className="library-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a title, episode, or series…" aria-label="Search films and episodes"/>{query && <button onClick={()=>setQuery('')} aria-label="Clear search"><X size={15}/></button>}</div><div className="library-select-controls"><label><ListFilter size={15}/><span className="sr-only">Viewing status</span><select value={status} onChange={e=>setStatus(e.target.value as typeof status)}><option value="all">All progress</option><option value="unwatched">Unwatched</option><option value="watched">Watched</option></select><ChevronDown size={12}/></label><label><ArrowDownWideNarrow size={15}/><span className="sr-only">Sort order</span><select value={actualOrder} onChange={e=>setOrder(e.target.value as typeof order)}><option value="release">Release order</option><option value="story" disabled={!supportsStoryOrder}>Story order{supportsStoryOrder?'':' · select a collection'}</option></select><ChevronDown size={12}/></label></div></div>

    <div className="library-results-heading" role="status" aria-live="polite" aria-atomic="true"><span className="sr-only">Showing {visible.length} of {filtered.length} matching records. </span><span className="library-result-count"><strong>{filtered.length}</strong> {filtered.length===1?'story':'stories'}{query?' matching your search':''}<span className="library-selection-label">{selectionTitle}</span></span><span>{actualOrder==='story'?<><Sparkles size={12}/> Documented story sequence</>:<><CalendarDays size={12}/> Release dates · not in-universe years</>}</span></div>
    {mode==='timeline' && <p className="timeline-note">{actualOrder==='story'?'This selected collection has a documented viewing sequence. Its ordinal positions are not BBY/ABY dates.':'This timeline follows real-world releases. In-universe dates and cross-series story chronology are not yet assigned.'}</p>}

    {actualOrder === 'story' && storySequence && <div className="story-order-note"><strong>{storySequence.title}</strong><p>{storySequence.description}</p><p>{storySequence.caveats.join(' ')}</p><a href={storySequence.sourceUrl} target="_blank" rel="noreferrer">Viewing-order source</a><a href="#journey">Follow a story on the map →</a></div>}
    <div className={`catalog-list ${mode==='timeline'?'catalog-timeline':''}`}>{visible.map((item,index)=>{
      const series = SERIES.find(s=>s.id===item.seriesId);
      const watched = watchedIds.has(item.id);
      const year = item.releaseDate.slice(0,4);
      const showYear = mode==='timeline' && actualOrder==='release' && (index===0 || visible[index-1].releaseDate.slice(0,4)!==year);
      return <div key={item.id} className="catalog-entry-group">{showYear && <div className="timeline-year"><span/>{year||'UNDATED'}</div>}<motion.article initial={reduceMotion || index >= 8 ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index, 7) * .018 }} className={`catalog-item ${watched?'is-watched':''}`} style={{'--series-color':series?.color||'#8bd6e4'} as CSSProperties}>
        <div className={`catalog-art catalog-art-${item.kind}`} aria-hidden="true"><span className="catalog-art-orbit"/><span className="catalog-art-small">{item.kind==='film'?'FEATURE':'CHAPTER'}</span><strong>{item.kind==='film'?<Film size={26} strokeWidth={1.2}/>:episodeRange(item, true)}</strong><span className="catalog-art-bottom">{item.kind==='film'?item.releaseDate.slice(0,4):`SEASON ${String(item.season||0).padStart(2,'0')}`}</span></div>
        <div className="catalog-item-body"><div className="catalog-kicker"><span>{series?.title||item.seriesId}</span><i/>{item.kind==='film'?'Film':`S${String(item.season).padStart(2,'0')} · E${episodeRange(item, true)}`}</div><h2>{item.title}</h2><div className="catalog-meta"><span><CalendarDays size={11}/>{dateLabel(item.releaseDate)}</span><span><Clock3 size={11}/>{item.runtimeMinutes===null?'Runtime unverified':`${item.runtimeMinutes} min`}</span>{actualOrder==='story' && <span>Story #{storyRanks.get(item.id)}</span>}</div><details className="catalog-details"><summary>Record details <ChevronDown size={11}/></summary><div><p>{item.runtimeNote || (item.runtimeMinutes===null?'A reliable runtime has not been assigned to this record.':'Runtime is provider metadata; editions and platform presentations may vary.')}</p>{(item.kind==='film' ? FILM_DATE_NOTES[item.id] : CATALOG_METADATA.episodeReleaseDateNote) && <p>{item.kind==='film' ? FILM_DATE_NOTES[item.id] : CATALOG_METADATA.episodeReleaseDateNote}</p>}<p>{storySequence ? storySequence.caveats.join(' ') : 'Release dates are not scene chronology. Select a collection for its sourced viewing sequence.'}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer">View source record <ExternalLink size={11}/></a><a className="follow-story-link" href={`#journey/${item.id}`}>Follow this story on the map →</a></div></details></div>
        <button className={`watched-button ${watched?'checked':''}`} onClick={()=>onToggleWatched(item.id)} aria-label={`${watched?'Mark unwatched':'Mark watched'}: ${item.title}`}>{watched?<Check size={17}/>:<Circle size={17}/>}<span>{watched?'Watched':'Mark watched'}</span></button>
      </motion.article></div>;
    })}</div>
    {filtered.length===0 && <div className="catalog-empty"><div className="catalog-empty-icon"><Search size={28} strokeWidth={1.2}/></div><span className="eyebrow">SEARCH THE ARCHIVE</span><h2>No stories in this selection.</h2><p>{query ? <>No matches for <strong>“{query}”</strong> in {selectionTitle.toLowerCase()}. Try a different title or reset your filters.</> : 'Try another collection or change your progress filter.'}</p><button onClick={()=>{setQuery('');setStatus('all');setSeriesId('all');}}>Reset filters <ArrowRight size={14}/></button></div>}
    {filtered.length>limit && <div className="catalog-load-more"><span>Showing {visible.length} of {filtered.length} stories</span><button onClick={()=>setLimit(value=>value+PAGE_SIZE)}>Load {Math.min(PAGE_SIZE,filtered.length-limit)} more <ChevronDown size={15}/></button></div>}
    <footer className="library-footer"><BookmarkCheck size={14}/><span>{watchedCount} watched · {CATALOG.length-watchedCount} still to explore</span><span>Original typographic artwork · no film stills</span></footer>
  </section>;
}
