import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';

import { ArrowLeft, ArrowRight, Check, ChevronRight, Compass, ExternalLink, Focus, Globe2, Info, Orbit, Radar, Rocket, Sparkles, X, BookOpen, Route, Clock3, BookmarkCheck } from 'lucide-react';

const Galaxy = lazy(() => import('./Galaxy'));

import { WORLDS, GEOGRAPHY_SOURCE, type World } from './data';

import './styles.css';

import './platform.css';
import './visual-upgrades.css';
import './reference-map.css';

import Library from './Library';
import Journey from './Journey';
import WorldStories from './WorldStories';
import ReferenceOverview from './ReferenceOverview';
import WorldExplorer from './WorldExplorer';
import ProgressTools from './ProgressTools';
import ShareDestination from './ShareDestination';
import { HYPERSPACE_ROUTES } from './hyperspaceRoutes';
import { ALL_WORLDS } from './journeyWorlds';

import { CATALOG } from './catalog';

import { useWatchProgress } from './useWatchProgress';



type View = 'journey' | 'galaxy' | 'library' | 'timeline' | 'watch';

const readWorld = () => { const id = location.hash.split('/')[1]; return location.hash.startsWith('#galaxy/') && ALL_WORLDS.some(world => world.id === id) ? id : WORLDS[0].id; };

const readView = (): View => ['journey','library','timeline','watch'].includes(location.hash.slice(1).split('/')[0]) ? location.hash.slice(1).split('/')[0] as View : 'galaxy';



const DETAILS: Record<string, { subtitle: string; terrain: string; kind: string; quote: string }> = {

  endor: { subtitle: 'The forest moon', terrain: 'Forest', kind: 'Moon / system grid', quote: '' },
  hoth: { subtitle: 'Rebellion on the frozen frontier', terrain: 'Ice', kind: 'Planet', quote: '' },

  dagobah: { subtitle: 'Wisdom beyond the familiar', terrain: 'Swamp', kind: 'Planet', quote: '' },

  bespin: { subtitle: 'A city among the clouds', terrain: 'Gas giant', kind: 'Planet', quote: '' },

  coruscant: { subtitle: 'At the heart of galactic power', terrain: 'City-covered', kind: 'Planet', quote: '' },

  mandalore: { subtitle: 'A world shaped by its history', terrain: 'Rock & desert', kind: 'Planet', quote: '' },

  tatooine: { subtitle: 'Where the journey begins', terrain: 'Desert', kind: 'Planet', quote: 'Beyond the familiar. Into the galaxy.' },

  alderaan: { subtitle: 'A world worth remembering', terrain: 'Mountains & oceans', kind: 'Planet', quote: 'Every world has a story. Find the connections.' },

  yavin: { subtitle: 'A spark of rebellion', terrain: 'Jungle moon', kind: 'System / moon', quote: 'The next chapter is a jump away.' },

};



export default function App() {

  const [view, setView] = useState<View>(readView);
  const [galaxyMounted, setGalaxyMounted] = useState(() => ['galaxy','journey'].includes(readView()));
  useEffect(() => { if (view === 'galaxy' || view === 'journey') setGalaxyMounted(true); }, [view]);

  const { watchedIds, toggleWatched, storageWarning, exportProgress, importProgress } = useWatchProgress();

  useEffect(() => { const change = () => { setView(readView()); setTargetId(null); setPhase('idle'); const id = location.hash.split('/')[1]; setActiveItemId(CATALOG.some(item => item.id === id) ? id : null); if (readView() === 'galaxy') setPreviewId(readWorld()); }; window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change); }, []);

  const [activeItemId, setActiveItemId] = useState<string | null>(() => { const id = location.hash.split('/')[1]; return CATALOG.some(item => item.id === id) ? id : null; });
  const [journeyStatus, setJourneyStatus] = useState('Choose a story, reveal its locations, then select a mapped stop.');
  const [currentId, setCurrentId] = useState(WORLDS[0].id);

  const [previewId, setPreviewId] = useState(readWorld);

  const [targetId, setTargetId] = useState<string | null>(null);

  const [phase, setPhase] = useState<'idle' | 'warping'>('idle');

  const [history, setHistory] = useState<string[]>([]);

  const [resetKey, setResetKey] = useState(0);

  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const [quality, setQuality] = useState<'balanced' | 'cinematic'>(() => window.matchMedia('(min-width: 1024px)').matches ? 'cinematic' : 'balanced');
  const [regionsVisible, setRegionsVisible] = useState(true);
  const [routesVisible, setRoutesVisible] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const [announcement, setAnnouncement] = useState('Galaxy ready. Choose a world to explore.');

  const preview = ALL_WORLDS.find(w => w.id === previewId) || WORLDS[0];

  const current = ALL_WORLDS.find(w => w.id === currentId) || WORLDS[0];

  const destination = ALL_WORLDS.find(w => w.id === targetId);

  const detail = DETAILS[preview.id] || {subtitle: 'A stop on your story journey',terrain: 'Not cataloged',kind: 'System grid',quote: ''};
  const mapWorlds = useMemo(() => view === 'journey' ? ALL_WORLDS.filter(w => [currentId, previewId, targetId].includes(w.id)) : ALL_WORLDS, [view, currentId, previewId, targetId]);
  function selectJourneyStop(itemId: string, worldId: string) {
    if (phase === 'warping') cancel();
    setActiveItemId(itemId); window.history.replaceState(null, '', `#journey/${itemId}`); setPreviewId(worldId);
    setJourneyStatus(`${CATALOG.find(item => item.id === itemId)?.title}: ${ALL_WORLDS.find(w => w.id === worldId)?.name} selected. Use Jump to travel.`);
    document.querySelector('.map-stage')?.scrollIntoView({behavior: reducedMotion ? 'instant' : 'smooth', block: 'start'});
  }



  function revealMap(smooth = false) {

    if (window.matchMedia('(max-width: 720px)').matches) {

      document.querySelector('.map-stage')?.scrollIntoView({ behavior: smooth && !reducedMotion ? 'smooth' : 'instant', block: 'start' });

    }

  }



  function selectWorld(id: string) {

    if (phase === 'warping') return;

    setPreviewId(id);
    if (view === 'galaxy') window.history.replaceState(null, '', `#galaxy/${id}`);

    const world = ALL_WORLDS.find(w => w.id === id);

    setAnnouncement(`${world?.name || 'World'} selected. ${id === currentId ? 'You are here.' : 'Ready to jump.'}`);

    revealMap(true);

  }

  function arrive() {

    if (!targetId) return;

    setHistory(h => [...h, currentId]);

    setCurrentId(targetId);

    setPreviewId(targetId);

    setAnnouncement(`Arrived at ${destination?.name || 'your destination'}.`);
    if (view === 'journey') setJourneyStatus(`Arrived at ${destination?.name || 'your destination'}. Choose another location or continue to the next chapter.`);

    setTargetId(null);

    setPhase('idle');

  }

  function jump() {

    if (previewId === currentId || phase === 'warping') return;

    revealMap();

    if (reducedMotion) {

      setHistory(h => [...h, currentId]);

      setCurrentId(previewId);

      setAnnouncement(`Arrived at ${preview.name}. Motion reduced.`);
      if (view === 'journey') setJourneyStatus(`Arrived at ${preview.name}. Choose another location or continue to the next chapter.`);

    } else {

      setTargetId(previewId);

      setPhase('warping');

      setAnnouncement(`Jumping to ${preview.name}. You can skip or cancel the transition.`);

    }

  }

  function cancel() {

    setTargetId(null);

    setPhase('idle');

    setPreviewId(currentId);

    setAnnouncement(`Jump cancelled. Returned to ${current.name}.`);
    if (view === 'journey') setJourneyStatus(`Jump cancelled. You remain at ${current.name}.`);

  }

  function back() {

    const previous = history.at(-1);

    if (!previous || phase === 'warping') return;

    setHistory(h => h.slice(0, -1));

    setCurrentId(previous);

    setPreviewId(previous);

    setResetKey(k => k + 1);

    setAnnouncement(`Returned to ${ALL_WORLDS.find(w => w.id === previous)?.name}.`);

  }

  useEffect(() => {

    const onKey = (event: KeyboardEvent) => {

      if (event.key === 'Escape') {

        if (phase === 'warping') cancel();

        else setShowInfo(false);

      }

    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);

  }, [phase, currentId]);



  return <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'} transition={{duration:.28,ease:[.22,1,.36,1]}}><div className="atlas-app" data-reduced-motion={reducedMotion}>

    <motion.header initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="app-header">

      <a className="brand" href="#atlas" aria-label="Galactic Atlas home"><span className="brand-symbol"><Orbit size={25} strokeWidth={1.3}/></span><span>GALACTIC <b>ATLAS</b><small>STAR WARS · AN UNOFFICIAL EXPLORER</small></span></a>

      <div className="header-right"><span className="prototype-label"><span/> EXPLORER PREVIEW</span><button className="icon-button info-button" aria-label="About this prototype" aria-expanded={showInfo} onClick={() => setShowInfo(!showInfo)}><Info size={19}/></button></div>

    </motion.header>



    <nav className="platform-nav" aria-label="Atlas sections">{(['galaxy','journey','library','timeline','watch'] as View[]).map(item => <a key={item} href={`#${item}`} aria-current={view === item ? 'page' : undefined} onClick={() => { if (phase === 'warping') cancel(); }}>{(() => { const Icon = {galaxy:Orbit,journey:Route,library:BookOpen,timeline:Clock3,watch:BookmarkCheck}[item]; return <Icon size={16} aria-hidden="true"/>; })()}{item === 'watch' ? 'My watchlist' : item === 'timeline' ? 'Release timeline' : item[0].toUpperCase()+item.slice(1)}{item === 'watch' && <span>{watchedIds.size}</span>}</a>)}<span className="catalog-count">{ALL_WORLDS.length} MAPPED WORLDS · {CATALOG.length} STORIES</span></nav>

      {showInfo && <section className="about-panel" aria-label="About this prototype"><div><strong>A small window into a much larger galaxy.</strong><p>This explorer connects 62 mapped worlds with a curated 185-title catalog and sourced story journeys. Positions represent published grid cells on a schematic map; transitions are cinematic, not measured routes. It is not a complete Star Wars catalog.</p><p>Original interface and planet illustrations. Star Wars belongs to Lucasfilm. This is an unofficial fan project.</p></div><button className="icon-button" onClick={() => setShowInfo(false)} aria-label="Close prototype information"><X size={18}/></button></section>}

    {storageWarning && <p className="storage-warning" role="status">{storageWarning}</p>}

    {view !== 'galaxy' && view !== 'journey' && <main className="platform-main"><Library mode={view} watchedIds={watchedIds} onToggleWatched={toggleWatched}/>{view === 'watch' && <ProgressTools exportProgress={exportProgress} importProgress={importProgress}/>}<p className="catalog-attribution">Episode metadata: <a href="https://www.tvmaze.com" target="_blank" rel="noreferrer">TVmaze</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA</a>. Curated catalog; title-level location links are still being researched. Progress stays in this browser.</p></main>}

    <main id="atlas" hidden={view !== 'galaxy' && view !== 'journey'}>
      {view === 'journey' && <><Journey onToggleWatched={toggleWatched} watchedIds={watchedIds} onSelectStop={selectJourneyStop} activeItemId={activeItemId} onActiveItemChange={id => {if(phase === 'warping') cancel();setActiveItemId(id);setPreviewId(currentId);window.history.replaceState(null, '', `#journey/${id}`);setJourneyStatus('Choose a revealed mapped location to preview your next stop.');}}/><p className="journey-map-status" role="status">{journeyStatus}</p></>}

      <div className="page-intro" hidden={view === 'journey'}><div><div className="eyebrow"><span className="small-line"/> EXPLORE THE GALAXY</div><h1>Your next story is out there<span>.</span></h1></div><p>62 worlds. A galaxy of stories.<br/>Choose a destination and make the jump.</p></div>







      <div className="flight-toolbar"><div><span className="flight-mark"/><span>GALACTIC NAVIGATION</span><small>{phase === 'warping' ? 'TRANSIT ACTIVE' : 'SYSTEM READY'}</small></div><label>Graphics <select aria-label="Graphics quality" value={quality} disabled={phase === 'warping'} onChange={event=>setQuality(event.target.value as 'balanced'|'cinematic')}><option value="balanced">Balanced</option><option value="cinematic">Cinematic</option></select></label></div>
      <div className="reference-controls" aria-label="Map layers">
        <div className="layer-switches"><label><input type="checkbox" checked={regionsVisible} onChange={e=>setRegionsVisible(e.target.checked)}/> Regions</label><label><input type="checkbox" checked={routesVisible} onChange={e=>setRoutesVisible(e.target.checked)}/> Hyperspace routes</label><label><input type="checkbox" checked={gridVisible} onChange={e=>setGridVisible(e.target.checked)}/> Grid</label></div>
        <WorldExplorer selectedId={previewId} disabled={phase === 'warping'} onSelect={selectWorld}/>
      </div>
      <details className="reference-key"><summary>Map key &amp; reference</summary><p>Colored boundaries and five major hyperspace lanes follow the supplied galaxy-map reference as approximate visual traces. Published system grids remain the placement source; traced positions are identified in each destination’s position note. Story connections are separate from these routes.</p><ul className='route-legend-list'>{HYPERSPACE_ROUTES.map(route=><li key={route.id}><i style={{background:route.color}}/>{route.number}. {route.name}</li>)}</ul><p>Zoom for smaller world labels. <a href="http://www.swgalaxymap.com/" target="_blank" rel="noreferrer">SW Galaxy Map reference ↗</a></p></details>
      <section className="explorer" aria-label="Galaxy explorer">

        <div className={`map-stage ${phase === 'warping' ? 'is-warping' : 'is-navigating'}`} data-quality={quality}>

          <div className="galaxy-canvas">{galaxyMounted && <Suspense fallback={<div className="galaxy-loading" role="status"><Orbit size={32} aria-hidden="true"/><strong>Charting the galaxy…</strong><span>Preparing your navigation view</span></div>}><Galaxy worlds={mapWorlds} selectedId={currentId} previewId={previewId} targetId={targetId} phase={phase} reducedMotion={reducedMotion} quality={quality} regionsVisible={regionsVisible} routesVisible={routesVisible} gridVisible={gridVisible} onSelect={selectWorld} onArrive={arrive} resetKey={resetKey}/></Suspense>}</div>

          <div className="map-heading"><span className="eyebrow">GALAXY VIEW</span><span className="map-coordinate"><span className="live-dot"/> {phase === 'warping' ? 'HYPERSPACE TRANSIT' : 'NAVIGATION ONLINE'}</span></div>

          <div className="map-tools"><button className="icon-button" onClick={() => {setResetKey(k => k+1);setAnnouncement('Galaxy view reset.');}} disabled={phase === 'warping'} title="Reset map view" aria-label="Reset map view"><Focus size={19}/></button><button className="icon-button" onClick={back} disabled={!history.length || phase === 'warping'} title="Return to previous world" aria-label="Return to previous world"><ArrowLeft size={19}/></button></div>

          <div className="map-bottom"><div className="current-location"><span className="location-icon"><Radar size={18}/></span><div><span>YOUR LOCATION</span><strong>{current.name}</strong></div></div><div className="map-legend"><i/> Reference atlas · schematic placement</div></div>

          <div className="mini-map" aria-label="Galaxy overview"><svg viewBox="0 0 120 80" role="img" aria-label={`Overview: currently at ${current.name}`}><ReferenceOverview regions={regionsVisible} routes={routesVisible}/>{mapWorlds.map(w => <g key={w.id}><circle className={w.id === currentId ? 'mini-current' : 'mini-world'} cx={60+w.x*43} cy={40-w.y*28} r={w.id === currentId ? 3.5 : 2}/>{w.id === currentId && <circle className="mini-ring" cx={60+w.x*43} cy={40-w.y*28} r="7"/>}</g>)}</svg><span>OVERVIEW</span></div>

          {phase === 'idle' && previewId !== currentId && <div className="map-jump-bar"><div><span>DESTINATION SELECTED</span><strong>{preview.name}</strong></div><button aria-label={`Jump to ${preview.name}`} onClick={jump}><Rocket size={14}/> Jump <ArrowRight size={14}/></button></div>}

          {phase === 'warping' && <motion.div initial={false} className="transit-panel" role="status"><span className="eyebrow"><Sparkles size={13}/> JUMP IN PROGRESS</span><strong>{current.name}<ArrowRight size={17}/>{destination?.name}</strong><div><button className="quiet-button" onClick={cancel}><X size={14}/> Cancel</button><button className="quiet-button" onClick={arrive}>Skip animation <ChevronRight size={14}/></button></div><div className="warp-progress" aria-hidden="true"><span/></div></motion.div>}

        </div>



        <aside className="world-dossier" aria-label={`${preview.name} destination details`}>

          <div className="dossier-top"><span className="eyebrow">DESTINATION FILE</span><span className="file-number">{String(ALL_WORLDS.indexOf(preview)+1).padStart(2,'0')} / {String(ALL_WORLDS.length).padStart(2,'0')}</span></div>

          <motion.div key={preview.id} initial={{opacity:.3,scale:.94}} animate={{opacity:1,scale:1}} transition={{duration:.5}} className={`planet-portrait planet-${preview.id}`} style={{'--planet-color':preview.color} as React.CSSProperties}><div className="planet-orbit"/><div className="planet-sphere"/><span className="portrait-caption">ILLUSTRATIVE VIEW</span><div className="planet-spark spark-one"/><div className="planet-spark spark-two"/><div className="planet-latitude"/><div className="planet-glow"/></motion.div>

          <motion.div key={`title-${preview.id}`} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} className="world-title"><span className="world-region">{preview.region}</span><h2>{preview.name}</h2><p>{detail.subtitle}</p></motion.div>

          <p className="world-description">{preview.description}</p>

          <dl className="world-facts"><div><dt>GRID REFERENCE</dt><dd>{preview.grid}<span>Official atlas</span></dd></div><div><dt>LANDSCAPE</dt><dd>{detail.terrain}<span>{detail.kind}</span></dd></div></dl>

          <div className="story-connection"><span className="story-icon"><Globe2 size={17}/></span><div><span>STORY CONNECTION</span><strong>{preview.film}</strong></div></div>

          <div className="jump-area"><button className={`jump-button ${previewId === currentId ? 'at-destination' : ''}`} onClick={jump} disabled={previewId === currentId || phase === 'warping'}>{previewId === currentId ? <><Check size={17}/> You are here</> : <><Rocket size={17}/> Jump to {preview.name}<ArrowRight size={17}/></>}</button><p>{previewId === currentId ? 'Select another world to continue exploring.' : reducedMotion ? 'Instant arrival · reduced motion enabled' : 'Cinematic transition · no simulated travel time'}</p></div>

          <a className="source-link" href={preview.sourceUrl} target="_blank" rel="noreferrer">Read world source <ExternalLink size={12}/></a>

          <a className="source-link" href={GEOGRAPHY_SOURCE} target="_blank" rel="noreferrer">View geographic source <ExternalLink size={12}/></a>

          <ShareDestination worldId={preview.id} worldName={preview.name}/>

          <details className="position-note"><summary>About this position</summary><p>{preview.uncertainty}</p></details>

        </aside>

      </section>



      {view === 'galaxy' && <div className="world-stories-panel"><WorldStories worldId={preview.id} worldName={preview.name} watchedIds={watchedIds}/></div>}
      <section hidden={view === 'journey'} className="destinations" aria-label="Choose a destination"><div className="destinations-heading"><span className="eyebrow">CHART YOUR COURSE</span><span>01—{String(WORLDS.length).padStart(2,'0')} <span className="slash">/</span> CURATED WORLDS</span></div><div className="destination-grid">{WORLDS.map((world:World,index:number) => <button key={world.id} className={`destination-card ${previewId === world.id ? 'is-selected' : ''}`} onClick={() => selectWorld(world.id)} disabled={phase === 'warping'} aria-pressed={previewId === world.id}><span className={`destination-thumb thumb-${world.id}`} style={{'--planet-color':world.color} as React.CSSProperties}/><span className="destination-copy"><span>{String(index+1).padStart(2,'0')} <i/> {world.region}</span><strong>{world.name}</strong></span><span className="destination-indicator">{world.id === currentId ? <span className="here-dot"/> : <ArrowRight size={18}/>}</span></button>)}</div></section>



      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>

    </main>

      <footer className="app-footer"><span><Compass size={14}/> A LITTLE CURIOSITY. A WHOLE GALAXY.</span><button className={`motion-toggle ${reducedMotion ? 'is-on' : ''}`} role="switch" aria-checked={reducedMotion} onClick={() => {if(phase==='warping') arrive();setReducedMotion(!reducedMotion);}}><span className="toggle-track"><span/></span> Reduce motion</button></footer>

  </div></MotionConfig>;

}



