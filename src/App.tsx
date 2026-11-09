import PlanetGlobe from './PlanetGlobe';
import AtlasSearch from './AtlasSearch';
import LocationDossier from './LocationDossier';
import { getLocation } from './locations';
import ImmersiveDossier from './ImmersiveDossier';
import AtlasHero from './AtlasHero';
import AtlasAudio from './AtlasAudio';
import PlanetPortrait from './PlanetPortrait';
import SourceMedia from './SourceMedia';
import { WORLD_TERRAIN } from './worldDossiers';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';

import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Plus, Minus, ChevronDown, Check, Compass, ExternalLink, Focus, Globe2, Info, Orbit, Radar, Rocket, X, BookOpen, Route, Clock3, BookmarkCheck } from 'lucide-react';

const Galaxy = lazy(() => import('./Galaxy'));

import { WORLDS, GEOGRAPHY_SOURCE, type World } from './data';

import './styles.css';

import './platform.css';
import './visual-upgrades.css';
import './reference-map.css';

import Library from './Library';
import Journey from './Journey';
import WorldStories from './WorldStories';
import WorldDirectory from './WorldDirectory';
import ReferenceOverview from './ReferenceOverview';
import MapBoundary from './MapBoundary';
import WorldExplorer from './WorldExplorer';
import ProgressTools from './ProgressTools';
import ShareDestination from './ShareDestination';
import { HYPERSPACE_ROUTES } from './hyperspaceRoutes';
import { ALL_WORLDS } from './journeyWorlds';

import { CATALOG } from './catalog';
import { CONNECTIONS } from './connections';
import { STORY_SEQUENCES } from './chronology';
import './episode-highlights.css';
import './workspace.css';
import './galaxy-immersion.css';
import './flight-console.css';
import TransitStatus from './TransitStatus';
import type { MapCommand } from './Galaxy';
import EpisodeLocationControls from './EpisodeLocationControls';

import { useWatchProgress } from './useWatchProgress';
import {useSpoilerPreference} from './spoilerPreference';
import './spoiler-preference.css';



type View = 'journey' | 'galaxy' | 'library' | 'timeline' | 'watch';

/** A bare `#galaxy` (or anything unrecognised) means "no preview": callers fall back to the current world. */
const readWorld = (): string | null => { const id = location.hash.split('/')[1]; return location.hash.startsWith('#galaxy/') && ALL_WORLDS.some(world => world.id === id) ? id : null; };

/** Rewrite `#journey/<unknown>` and `#galaxy/<unknown>` to the bare section so the URL matches what is shown. */
const normalizeHash = () => {
  const [section, id] = location.hash.slice(1).split('/');
  if (id === undefined) return;
  const known = section === 'journey' ? CATALOG.some(item => item.id === id) : section === 'galaxy' ? ALL_WORLDS.some(world => world.id === id) : true;
  if (!known) window.history.replaceState(null, '', `#${section}`);
};

const SECTION_TITLES: Record<View, string> = { galaxy: 'Galaxy map', journey: 'Story journey', library: 'Library', timeline: 'Release timeline', watch: 'My watchlist' };

const readView = (): View => ['journey','library','timeline','watch'].includes(location.hash.slice(1).split('/')[0]) ? location.hash.slice(1).split('/')[0] as View : 'galaxy';



const DETAILS: Record<string, { subtitle: string; terrain: string; kind: string }> = {

  endor: { subtitle: 'The forest moon', terrain: 'Forest', kind: 'Moon / system grid' },
  hoth: { subtitle: 'Rebellion on the frozen frontier', terrain: 'Ice', kind: 'Planet' },

  dagobah: { subtitle: 'Wisdom beyond the familiar', terrain: 'Swamp', kind: 'Planet' },

  bespin: { subtitle: 'A city among the clouds', terrain: 'Gas giant', kind: 'Planet' },

  coruscant: { subtitle: 'At the heart of galactic power', terrain: 'City-covered', kind: 'Planet' },

  mandalore: { subtitle: 'A world shaped by its history', terrain: 'Rock & desert', kind: 'Planet' },

  tatooine: { subtitle: 'Where the journey begins', terrain: 'Desert', kind: 'Planet' },

  alderaan: { subtitle: 'A world worth remembering', terrain: 'Mountains & oceans', kind: 'Planet' },

  yavin: { subtitle: 'A spark of rebellion', terrain: 'Jungle moon', kind: 'System / moon' },

};



export default function App() {
  const {hideSpoilers,setHideSpoilers}=useSpoilerPreference();

  const [view, setView] = useState<View>(readView);
  const [inspectedLocationId, setInspectedLocationId] = useState<string | null>(null);
  const [panelTab, setPanelTab] = useState<'story' | 'destination'>(() => readView() === 'journey' ? 'story' : 'destination');
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [mapCommand, setMapCommand] = useState<MapCommand | null>(null);
  const commandMap = (action: MapCommand['action']) => setMapCommand(old => ({id: (old?.id ?? 0) + 1, action}));
  useEffect(() => { setInspectedLocationId(null); setPanelTab(view === 'journey' ? 'story' : 'destination'); setSheetExpanded(false); }, [view]);
  const [galaxyMounted, setGalaxyMounted] = useState(() => ['galaxy','journey'].includes(readView()));
  useEffect(() => { if (view === 'galaxy' || view === 'journey') setGalaxyMounted(true); }, [view]);

  const { watchedIds, toggleWatched, storageWarning, exportProgress, importProgress } = useWatchProgress();



  const [activeItemId, setActiveItemId] = useState<string | null>(() => { const id = location.hash.split('/')[1]; return CATALOG.some(item => item.id === id) ? id : null; });
  const [journeyDisclosure, setJourneyDisclosure] = useState<{ itemId: string; revealed: boolean } | null>(null);
  const [journeyStatus, setJourneyStatus] = useState('Choose a story, then select a mapped stop.');
  const [currentId, setCurrentId] = useState(WORLDS[0].id);

  const [previewId, setPreviewId] = useState(() => readWorld() ?? WORLDS[0].id);

  useEffect(() => {
    if (panelTab !== 'destination') return;
    for (const panel of document.querySelectorAll<HTMLElement>('.workspace-panel, .workspace-panel-content')) panel.scrollTop = 0;
  }, [inspectedLocationId, previewId, panelTab]);

  const [targetId, setTargetId] = useState<string | null>(null);

  const [phase, setPhase] = useState<'idle' | 'warping'>('idle');
  const [warpStartedAt, setWarpStartedAt] = useState(0);

  const [history, setHistory] = useState<string[]>([]);

  const [resetKey, setResetKey] = useState(0);
  const [episodeFitKey, setEpisodeFitKey] = useState(0);

  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const [quality, setQuality] = useState<'balanced' | 'cinematic'>(() => window.matchMedia('(min-width: 1024px)').matches ? 'cinematic' : 'balanced');
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const viewportQuery = window.matchMedia('(min-width: 1024px)');
    const onMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    const onViewport = (event: MediaQueryListEvent) => setQuality(event.matches ? 'cinematic' : 'balanced');
    motionQuery.addEventListener('change', onMotion);
    viewportQuery.addEventListener('change', onViewport);
    return () => { motionQuery.removeEventListener('change', onMotion); viewportQuery.removeEventListener('change', onViewport); };
  }, []);
  const [panControlsVisible, setPanControlsVisible] = useState(() => window.matchMedia('(min-width: 721px)').matches);
  const [presentation, setPresentation] = useState<'immersive' | 'reference'>('immersive');
  const [regionsVisible, setRegionsVisible] = useState(true);
  const [routesVisible, setRoutesVisible] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [mapUnavailable, setMapUnavailable] = useState(false);

  const [announcement, setAnnouncement] = useState('Galaxy ready. Choose a world to explore.');

  const preview = ALL_WORLDS.find(w => w.id === previewId) || WORLDS[0];

  const current = ALL_WORLDS.find(w => w.id === currentId) || WORLDS[0];

  const destination = ALL_WORLDS.find(w => w.id === targetId);

  const terrain = WORLD_TERRAIN[preview.id];
  const detail = DETAILS[preview.id] || {subtitle: 'A stop on your story journey',terrain: terrain?.label ?? 'Not cataloged',kind: terrain ? 'Reviewed setting' : 'System grid'};
  const displayedJourneyId = activeItemId ?? STORY_SEQUENCES[0]?.itemIds[0];
  const locationsDisclosed = view === 'journey' && !!displayedJourneyId && (!hideSpoilers || journeyDisclosure?.itemId === displayedJourneyId && (journeyDisclosure.revealed || watchedIds.has(displayedJourneyId)));
  const episodeWorldIds = useMemo(() => new Set(locationsDisclosed ? CONNECTIONS.filter(link => link.itemId === displayedJourneyId).map(link => link.worldId) : []), [locationsDisclosed, displayedJourneyId]);
  const highlightedWorlds = ALL_WORLDS.filter(world => episodeWorldIds.has(world.id));
  const mapWorlds = useMemo(() => view === 'journey' ? ALL_WORLDS.filter(w => [currentId, previewId, targetId].includes(w.id) || episodeWorldIds.has(w.id)) : ALL_WORLDS, [view, currentId, previewId, targetId, episodeWorldIds]);
  useEffect(() => {
    const change = () => {
      if (phase === 'warping') cancel(false);
      normalizeHash();
      const nextView = readView();
      setView(nextView);
      setPanelTab(nextView === 'journey' ? 'story' : 'destination');
      setInspectedLocationId(null);
      if (view !== 'journey' || nextView !== 'journey') setSheetExpanded(false);
      const id = location.hash.split('/')[1];
      // A bare `#journey` (nav link while already reading) keeps the current chapter.
      if (CATALOG.some(item => item.id === id)) setActiveItemId(id);
      else if (nextView !== 'journey') setActiveItemId(null);
      else if (id === undefined && activeItemId) window.history.replaceState(null, '', `#journey/${activeItemId}`);
      if (nextView === 'galaxy') setPreviewId(readWorld() ?? currentId);
    };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, [phase, currentId, view, activeItemId]);

  function selectJourneyStop(itemId: string, worldId: string) {
    if (phase === 'warping') cancel();
    setInspectedLocationId(null); setSheetExpanded(false);
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

    setInspectedLocationId(null);
    setPreviewId(id);
    const settings = document.querySelector<HTMLDetailsElement>('.workspace-settings');
    if (settings?.open) { settings.open = false; document.getElementById('galaxy-map')?.focus({preventScroll: true}); }
    if (view === 'galaxy') window.history.replaceState(null, '', `#galaxy/${id}`);

    const world = ALL_WORLDS.find(w => w.id === id);

    setAnnouncement(`${world?.name || 'World'} selected. ${id === currentId ? 'You are here.' : 'Ready to jump.'}`);

    revealMap(true);

  }

  /** Shared by the error boundary and WebGL context loss: map controls go off and any transit is abandoned. */
  function handleMapUnavailable() { setMapUnavailable(true); if (phase === 'warping') cancel(); }

  function arrive() {

    if (!targetId) return;

    setHistory(h => [...h, currentId]);

    setCurrentId(targetId);
    setPanelTab('destination'); setSheetExpanded(true);

    setPreviewId(targetId);

    setAnnouncement(`Arrived at ${destination?.name || 'your destination'}.`);
    if (view === 'journey') setJourneyStatus(`Arrived at ${destination?.name || 'your destination'}. Choose another location or continue to the next chapter.`);

    setTargetId(null);

    setPhase('idle');

  }

  function jump() {

    if (previewId === currentId || phase === 'warping') return;

    revealMap();

    if (reducedMotion || mapUnavailable) {

      setHistory(h => [...h, currentId]);

      setCurrentId(previewId);
      setPanelTab('destination'); setSheetExpanded(true);

      setAnnouncement(`Arrived at ${preview.name}. ${mapUnavailable ? 'Map unavailable; instant arrival.' : 'Motion reduced.'}`);
      if (view === 'journey') setJourneyStatus(`Arrived at ${preview.name}. Choose another location or continue to the next chapter.`);

    } else {

      setTargetId(previewId);
      setWarpStartedAt(performance.now());
      setPhase('warping');

      setAnnouncement(`Jumping to ${preview.name}. You can skip or cancel the transition.`);

    }

  }

  /** Drop a stale `#galaxy/<id>` so a later link to the same world fires hashchange again. */
  function clearGalaxyHash() { if (view === 'galaxy' && location.hash.startsWith('#galaxy/')) window.history.replaceState(null, '', '#galaxy'); }

  function cancel(clearHash = true) {

    if (clearHash) clearGalaxyHash();
    setTargetId(null);

    setPhase('idle');

    setPreviewId(currentId);

    setAnnouncement(`Jump cancelled. Returned to ${current.name}.`);
    if (view === 'journey') setJourneyStatus(`Jump cancelled. You remain at ${current.name}.`);

  }

  function back() {

    const previous = history.at(-1);

    if (!previous || phase === 'warping') return;

    clearGalaxyHash();
    setHistory(h => h.slice(0, -1));

    setCurrentId(previous);

    setPreviewId(previous);

    setResetKey(k => k + 1);

    setAnnouncement(`Returned to ${ALL_WORLDS.find(w => w.id === previous)?.name}.`);

  }

  useEffect(() => { normalizeHash(); }, []);

  const shownView = useRef<View | null>(null);
  useEffect(() => {
    document.title = `${SECTION_TITLES[view]} · Galactic Atlas`;
    const previous = shownView.current;
    shownView.current = view;
    if (previous === null || previous === view) return; // never steal focus on initial load
    const main = document.querySelector<HTMLElement>(view === 'galaxy' || view === 'journey' ? '#atlas' : '.platform-main');
    const heading = main?.querySelector<HTMLElement>('h1, h2');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus();
  }, [view]);

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

      <div className="header-right"><AtlasSearch reducedMotion={reducedMotion} onOpen={() => { if (phase === 'warping') cancel(); }} onNavigate={href => { if (phase === 'warping') cancel(); location.hash = href; }}/><AtlasAudio phase={phase} currentId={currentId}/><span className="prototype-label"><span/> EXPLORER PREVIEW</span><button className="icon-button info-button" aria-label="About this prototype" aria-expanded={showInfo} onClick={() => setShowInfo(!showInfo)}><Info size={19}/></button></div>

    </motion.header>



    <nav className="platform-nav" aria-label="Atlas sections">{(['galaxy','journey','library','timeline','watch'] as View[]).map(item => <a key={item} href={`#${item}`} aria-current={view === item ? 'page' : undefined} onClick={() => { if (phase === 'warping') cancel(); }}>{(() => { const Icon = {galaxy:Orbit,journey:Route,library:BookOpen,timeline:Clock3,watch:BookmarkCheck}[item]; return <Icon size={16} aria-hidden="true"/>; })()}{item === 'watch' ? 'My watchlist' : item === 'timeline' ? 'Release timeline' : item[0].toUpperCase()+item.slice(1)}{item === 'watch' && <span>{watchedIds.size}</span>}</a>)}<span className="catalog-count">{ALL_WORLDS.length} MAPPED WORLDS · {CATALOG.length} STORIES</span></nav>

      {showInfo && <section className="about-panel" aria-label="About this prototype"><div><strong>A small window into a much larger galaxy.</strong><p>This explorer connects {ALL_WORLDS.length} mapped worlds with a curated {CATALOG.length}-title catalog and sourced story journeys. Positions represent published grid cells on a schematic map; transitions are cinematic, not measured routes. It is not a complete Star Wars catalog.</p><p>Original interface and planet illustrations. Star Wars belongs to Lucasfilm. This is an unofficial fan project.</p><div className="spoiler-preference"><label><input type="checkbox" aria-label="Hide spoilers" checked={hideSpoilers} onChange={event=>setHideSpoilers(event.target.checked)}/>Hide spoilers</label><p>{hideSpoilers?'Spoiler protection is on. Reveal content individually as needed.':'All images and story details are shown.'}</p></div></div><button className="icon-button" onClick={() => setShowInfo(false)} aria-label="Close prototype information"><X size={18}/></button></section>}

    {storageWarning && <p className="storage-warning" role="status">{storageWarning}</p>}

    {view !== 'galaxy' && view !== 'journey' && <main className="platform-main"><Library mode={view} watchedIds={watchedIds} onToggleWatched={toggleWatched}/>{view === 'watch' && <ProgressTools exportProgress={exportProgress} importProgress={importProgress}/>}<p className="catalog-attribution">Episode metadata: <a href="https://www.tvmaze.com" target="_blank" rel="noreferrer">TVmaze</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA</a>. Curated catalog; title-level location links are still being researched. Progress stays in this browser.</p></main>}

    <main id="atlas" hidden={view !== 'galaxy' && view !== 'journey'}>










      <div className="workspace-heading"><div><span className="eyebrow">GALACTIC WORKSPACE</span><h1>{view === 'journey' ? 'Follow the story' : 'Explore the galaxy'}</h1></div><div className="galaxy-presentation" role="group" aria-label="Galaxy presentation"><button aria-pressed={presentation === 'immersive'} disabled={phase === 'warping'} onClick={() => setPresentation('immersive')}>Immersive</button><button aria-pressed={presentation === 'reference'} disabled={phase === 'warping'} onClick={() => setPresentation('reference')}>Reference chart</button></div><details className="workspace-settings"><summary>Find a world &amp; map settings</summary><div className="workspace-settings-content">      <div className="flight-toolbar"><div><span className="flight-mark"/><span>GALACTIC NAVIGATION</span><small>{phase === 'warping' ? 'TRANSIT ACTIVE' : 'SYSTEM READY'}</small></div><label>Graphics <select aria-label="Graphics quality" value={quality} disabled={phase === 'warping'} onChange={event=>setQuality(event.target.value as 'balanced'|'cinematic')}><option value="balanced">Balanced</option><option value="cinematic">Cinematic</option></select></label></div>
      <div className="reference-controls" aria-label="Map layers">
        <div className="layer-switches"><label><input type="checkbox" checked={regionsVisible} onChange={e=>setRegionsVisible(e.target.checked)}/> Regions</label><label><input type="checkbox" checked={routesVisible} onChange={e=>setRoutesVisible(e.target.checked)}/> Hyperspace routes</label><label><input type="checkbox" checked={gridVisible} onChange={e=>setGridVisible(e.target.checked)}/> Grid</label></div>
        <WorldExplorer selectedId={previewId} disabled={phase === 'warping'} onSelect={selectWorld}/>
      </div>
      <details className="reference-key"><summary>Map key &amp; reference</summary><p>Colored boundaries and five major hyperspace lanes follow the supplied galaxy-map reference as approximate visual traces. Published system grids remain the placement source; traced positions are identified in each destination’s position note. Story connections are separate from these routes.</p><ul className='route-legend-list'>{HYPERSPACE_ROUTES.map(route=><li key={route.id}><i style={{background:route.color}}/>{route.number}. {route.name}</li>)}</ul><p>Planet globes and star clouds are original illustrations; globe sizes are exaggerated and are not to scale. Switch to Reference chart for stronger region fills. Zoom for smaller world labels. <a href="http://www.swgalaxymap.com/" target="_blank" rel="noreferrer">SW Galaxy Map reference ↗</a></p></details>
</div></details></div>
      <section className="explorer map-workspace" aria-label="Galaxy explorer">

        <div id="galaxy-map" tabIndex={-1} aria-label="Interactive galaxy map" className={`map-stage ${phase === 'warping' ? 'is-warping' : 'is-navigating'}`} data-quality={quality} data-presentation={presentation}>

          <div className="galaxy-canvas">{galaxyMounted && <MapBoundary onUnavailable={handleMapUnavailable}><Suspense fallback={<div className="galaxy-loading" role="status"><Orbit size={32} aria-hidden="true"/><strong>Charting the galaxy…</strong><span>Preparing your navigation view</span></div>}><Galaxy presentation={presentation} command={mapCommand} fitKey={episodeFitKey} highlightedIds={episodeWorldIds} worlds={mapWorlds} selectedId={currentId} previewId={previewId} targetId={targetId} warpStartedAt={warpStartedAt} phase={phase} reducedMotion={reducedMotion} quality={quality} regionsVisible={regionsVisible} routesVisible={routesVisible} gridVisible={gridVisible} onSelect={selectWorld} onArrive={arrive} resetKey={resetKey} onUnavailable={handleMapUnavailable} onRecovered={() => setMapUnavailable(false)}/></Suspense></MapBoundary>}</div>

          <div className="map-heading"><span className="eyebrow">{presentation === 'immersive' ? 'THE GALAXY AWAITS' : 'REFERENCE CHART'}</span><span className="map-coordinate"><span className="live-dot"/> {phase === 'warping' ? 'HYPERSPACE TRANSIT' : 'NAVIGATION ONLINE'}</span></div>

          <div className="map-tools" aria-label="Map navigation"><button className="icon-button" aria-label="Toggle pan controls" aria-expanded={panControlsVisible} aria-controls="galaxy-pan-controls" disabled={phase === 'warping' || mapUnavailable} onClick={() => setPanControlsVisible(value => !value)}><Compass size={19}/></button><button className="icon-button" aria-label="Zoom in" disabled={phase === 'warping' || mapUnavailable} onClick={() => commandMap('zoomIn')}><Plus size={19}/></button><button className="icon-button" aria-label="Zoom out" disabled={phase === 'warping' || mapUnavailable} onClick={() => commandMap('zoomOut')}><Minus size={19}/></button><button className="icon-button" onClick={() => {setResetKey(k => k+1);setAnnouncement('Galaxy view reset.');}} disabled={phase === 'warping'} title="Reset map view" aria-label="Reset map view"><Focus size={19}/></button><button className="icon-button" onClick={back} disabled={!history.length || phase === 'warping'} title="Return to previous world" aria-label="Return to previous world"><ArrowLeft size={19}/></button></div>

          <div id="galaxy-pan-controls" className="map-pan-controls" hidden={!panControlsVisible} role="group" aria-label="Pan galaxy"><button aria-label="Pan up" disabled={phase === 'warping' || mapUnavailable} onClick={() => commandMap('panUp')}><ArrowUp size={16}/></button><button aria-label="Pan left" disabled={phase === 'warping' || mapUnavailable} onClick={() => commandMap('panLeft')}><ArrowLeft size={16}/></button><button aria-label="Pan down" disabled={phase === 'warping' || mapUnavailable} onClick={() => commandMap('panDown')}><ArrowDown size={16}/></button><button aria-label="Pan right" disabled={phase === 'warping' || mapUnavailable} onClick={() => commandMap('panRight')}><ArrowRight size={16}/></button></div>
          <div className="map-bottom"><div className="current-location"><span className="location-icon"><Radar size={18}/></span><div><span>YOUR LOCATION</span><strong>{current.name}</strong>{presentation === 'immersive' && <button className="inspect-world" disabled={phase === 'warping' || mapUnavailable} onClick={() => {commandMap('inspect');setAnnouncement(`Close view of ${preview.name}. Illustrative globe; current location unchanged.`);}}>Inspect {preview.name} <Focus size={13}/></button>}</div></div><div className="map-legend"><i/> Reference atlas · schematic placement</div></div>

          <div className="mini-map" aria-label="Galaxy overview"><svg viewBox="0 0 120 80" role="img" aria-label={`Overview: currently at ${current.name}`}><ReferenceOverview regions={regionsVisible} routes={routesVisible}/>{phase === 'warping' && destination && <g className="mini-transit"><line x1={60+current.x*43} y1={40-current.y*28} x2={60+destination.x*43} y2={40-destination.y*28}/><circle cx={60+destination.x*43} cy={40-destination.y*28} r="5"/></g>}{mapWorlds.map(w => <g key={w.id}><circle className={w.id === currentId ? 'mini-current' : 'mini-world'} cx={60+w.x*43} cy={40-w.y*28} r={w.id === currentId ? 3.5 : 2}/>{w.id === currentId && <circle className="mini-ring" cx={60+w.x*43} cy={40-w.y*28} r="7"/>}</g>)}</svg><span>{phase === 'warping' ? 'GALAXY POSITION' : 'OVERVIEW'}</span></div>

          {phase === 'idle' && previewId !== currentId && <div className="map-jump-bar"><div><span>DESTINATION SELECTED</span><strong>{preview.name}</strong></div><button aria-label={`Jump to ${preview.name}`} onClick={jump}><Rocket size={14}/> Jump <ArrowRight size={14}/></button></div>}

          {phase === 'warping' && <TransitStatus origin={current.name} destination={destination?.name ?? preview.name} startedAt={warpStartedAt} onCancel={() => cancel()} onSkip={arrive} reducedMotion={reducedMotion}/>}

        </div>



        <aside className={`workspace-panel ${sheetExpanded ? 'is-expanded' : ''}`} aria-label="Exploration panel">
          <button className="sheet-toggle" aria-expanded={sheetExpanded} aria-controls="workspace-panel-content" onClick={() => setSheetExpanded(value => !value)}><span><small>{view === 'journey' ? 'STORY & DESTINATION' : 'DESTINATION FILE'}</small><strong>{panelTab === 'story' ? CATALOG.find(item => item.id === displayedJourneyId)?.title : (inspectedLocationId ? getLocation(inspectedLocationId)?.name : preview.name)}</strong></span><ChevronDown size={20}/><span className="sr-only">{sheetExpanded ? 'Collapse exploration panel' : 'Expand exploration panel'}</span></button>
          <div id="workspace-panel-content" className="workspace-panel-content">
            <div className="workspace-tabs" role="group" aria-label="Exploration panel views">{view === 'journey' && <button aria-pressed={panelTab === 'story'} onClick={() => setPanelTab('story')}>Story</button>}<button aria-pressed={panelTab === 'destination'} onClick={() => setPanelTab('destination')}>Destination</button>{view !== 'journey' && <a href="#journey">Choose a story <ArrowRight size={14}/></a>}</div>
            <div hidden={panelTab !== 'story'} className="workspace-story">{view === 'journey' && <><Journey onInspectLocation={id => {setInspectedLocationId(id);setPanelTab('destination');setSheetExpanded(true);}} onLocationDisclosure={setJourneyDisclosure} onToggleWatched={toggleWatched} watchedIds={watchedIds} onSelectStop={selectJourneyStop} activeItemId={activeItemId} onActiveItemChange={id => {if(phase === 'warping') cancel();setInspectedLocationId(null);setActiveItemId(id);setPreviewId(currentId);window.history.replaceState(null, '', `#journey/${id}`);setJourneyStatus('Choose a mapped location to preview your next stop.');}}/><p className="journey-map-status" role="status">{journeyStatus}</p></>}      {locationsDisclosed && <EpisodeLocationControls worlds={highlightedWorlds} unmappedCount={episodeWorldIds.size - highlightedWorlds.length} disabled={phase === 'warping'} mapUnavailable={mapUnavailable} onFit={() => {setEpisodeFitKey(key => key + 1);setAnnouncement('Map fitted to this chapter’s sourced mapped locations.');document.querySelector('.map-stage')?.scrollIntoView({behavior: 'instant', block: 'start'});}} onSelect={id => selectJourneyStop(displayedJourneyId!, id)}/>}
</div>
            <div hidden={panelTab !== 'destination'}>
            {inspectedLocationId ? <LocationDossier id={inspectedLocationId} reducedMotion={reducedMotion}/> : <>
            <div className="world-dossier" aria-label={`${preview.name} destination details`}>

          <div className="dossier-top"><span className="eyebrow">DESTINATION FILE</span><span className="file-number">{String(ALL_WORLDS.indexOf(preview)+1).padStart(2,'0')} / {String(ALL_WORLDS.length).padStart(2,'0')}</span></div>

          <PlanetPortrait key={preview.id} id={preview.id} name={preview.name} color={preview.color} reducedMotion={reducedMotion}/>

          <motion.div key={`title-${preview.id}`} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} className="world-title"><span className="world-region">{preview.region}</span><h2>{preview.name}</h2><p>{detail.subtitle}</p></motion.div>

          <p className="world-description">{preview.description}</p>
          <SourceMedia key={`source-${preview.id}`} entityId={preview.id} entityType="world" title={preview.name}/>

          <dl className="world-facts"><div><dt>GRID REFERENCE</dt><dd>{preview.grid}<span>Official atlas</span></dd></div><div><dt>LANDSCAPE</dt><dd>{detail.terrain}<span>{detail.kind}</span></dd></div></dl>

          <div className="story-connection"><span className="story-icon"><Globe2 size={17}/></span><div><span>STORY CONNECTION</span><strong>{preview.film}</strong></div></div>

          <div className="jump-area"><button className={`jump-button ${previewId === currentId ? 'at-destination' : ''}`} onClick={jump} disabled={previewId === currentId || phase === 'warping'}>{previewId === currentId ? <><Check size={17}/> You are here</> : <><Rocket size={17}/> Jump to {preview.name}<ArrowRight size={17}/></>}</button><p>{previewId === currentId ? 'Select another world to continue exploring.' : mapUnavailable ? 'Instant arrival (interactive map unavailable)' : reducedMotion ? 'Instant arrival · reduced motion enabled' : 'Cinematic transition · no simulated travel time'}</p></div>

          <a className="source-link" href={preview.sourceUrl} target="_blank" rel="noreferrer">Read world source <ExternalLink size={12}/></a>

          <a className="source-link" href={GEOGRAPHY_SOURCE} target="_blank" rel="noreferrer">View geographic source <ExternalLink size={12}/></a>

          <ShareDestination worldId={preview.id} worldName={preview.name}/>

          <details className="position-note"><summary>About this position</summary><p>{preview.uncertainty}</p></details>

            </div>
            <ImmersiveDossier key={preview.id} worldId={preview.id} worldName={preview.name}/>
            <div className="world-stories-panel"><WorldStories key={preview.id} worldId={preview.id} worldName={preview.name} watchedIds={watchedIds}/></div>
            </>}
            </div>
          </div>
        </aside>

      </section>



      {view === 'galaxy' && <AtlasHero reducedMotion={reducedMotion} watchedIds={watchedIds}/>}
      {view === 'galaxy' && <WorldDirectory watchedIds={watchedIds}/>}
      <section hidden={view === 'journey'} className="destinations" aria-label="Choose a destination"><div className="destinations-heading"><span className="eyebrow">CHART YOUR COURSE</span><span>01—{String(WORLDS.length).padStart(2,'0')} <span className="slash">/</span> CURATED WORLDS</span></div><div className="destination-grid">{WORLDS.map((world:World,index:number) => <button key={world.id} className={`destination-card ${previewId === world.id ? 'is-selected' : ''}`} onClick={() => selectWorld(world.id)} disabled={phase === 'warping'} aria-pressed={previewId === world.id}><span className="destination-thumb"><PlanetGlobe id={world.id} name={world.name} thumbnail/></span><span className="destination-copy"><span>{String(index+1).padStart(2,'0')} <i/> {world.region}</span><strong>{world.name}</strong></span><span className="destination-indicator">{world.id === currentId ? <span className="here-dot"/> : <ArrowRight size={18}/>}</span></button>)}</div></section>



      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>

    </main>

      <footer className="app-footer"><span><Compass size={14}/> A LITTLE CURIOSITY. A WHOLE GALAXY.</span><button className={`motion-toggle ${reducedMotion ? 'is-on' : ''}`} role="switch" aria-checked={reducedMotion} onClick={() => {if(phase==='warping') arrive();setReducedMotion(!reducedMotion);}}><span className="toggle-track"><span/></span> Reduce motion</button></footer>

  </div></MotionConfig>;

}



