import { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_WORLDS } from './journeyWorlds';
import { CONNECTIONS } from './connections';
import { CATALOG, SERIES } from './catalog';
import WorldStories from './WorldStories';
import ImmersiveDossier from './ImmersiveDossier';
import LocationDossier from './LocationDossier';
import { getLocation } from './locations';
import WorldDirectoryCard, { type DirectoryWorld } from './WorldDirectoryCard';
import { WORLD_TERRAIN } from './worldDossiers';
import './world-directory.css';

const worlds = new Map<string, DirectoryWorld>(ALL_WORLDS.map(world => [world.id, { id: world.id, name: world.name, mapped: true, region: world.region, color: world.color }]));
for (const link of CONNECTIONS) if (!worlds.has(link.worldId)) worlds.set(link.worldId, { id: link.worldId, name: link.worldName, mapped: false });
const directory = [...worlds.values()].sort((a, b) => a.name.localeCompare(b.name));
const regions = [...new Set(ALL_WORLDS.map(world => world.region))].sort();
const terrainOptions = [...new Map(Object.values(WORLD_TERRAIN).map(terrain => [terrain.category, terrain.label])).entries()].sort((a,b) => a[1].localeCompare(b[1]));
const catalogSeries = new Map(CATALOG.map(item => [item.id,item.seriesId]));
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function WorldDirectory({ watchedIds }: { watchedIds: ReadonlySet<string> }) {
  const [query, setQuery] = useState('');
  const [placement, setPlacement] = useState('all');
  const [series, setSeries] = useState('all');
  const [region, setRegion] = useState('all');
  const [terrain, setTerrain] = useState('all');
  const [watched, setWatched] = useState('all');
  const [revealCollections, setRevealCollections] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [limit, setLimit] = useState(12);
  const storyHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (selected) storyHeading.current?.focus(); }, [selected]);
  const accessible = useMemo(() => CONNECTIONS.filter(link => revealCollections || watchedIds.has(link.itemId)), [revealCollections, watchedIds]);
  const watchedCounts = useMemo(() => { const groups = new Map<string, Set<string>>(); for (const link of CONNECTIONS) if(watchedIds.has(link.itemId)) { if(!groups.has(link.worldId)) groups.set(link.worldId,new Set()); groups.get(link.worldId)!.add(link.itemId); } return new Map([...groups].map(([id,items])=>[id,items.size])); }, [watchedIds]);
  const results = directory.filter(world => normalize(world.name).includes(normalize(query.trim())) && (placement === 'all' || world.mapped === (placement === 'mapped')) && (series === 'all' || accessible.some(link => link.worldId === world.id && catalogSeries.get(link.itemId) === series)) && (region === 'all' || (region === 'unknown' ? !world.region : world.region === region)) && (terrain === 'all' || (WORLD_TERRAIN[world.id]?.category || 'unreviewed') === terrain) && (watched === 'all' || (watched === 'watched' ? (watchedCounts.get(world.id) || 0) > 0 : !watchedCounts.get(world.id))));
  const selection = directory.find(world => world.id === selected);
  const reset = () => { setQuery(''); setPlacement('all'); setSeries('all'); setRegion('all'); setTerrain('all'); setWatched('all'); setLimit(12); };
  return <details id="world-directory" className="world-directory">
    <summary>World directory <span>{directory.length} locations · {directory.filter(world => !world.mapped).length} without map placements</span></summary>
    <section aria-label="World directory">
      <p>Explore mapped worlds and other locations with sourced story links. World names may reveal settings. A missing placement means geography is unverified here; no position is inferred.</p>
      <div className="directory-filters">
        <label>Find a world<input type="search" placeholder="World name" value={query} onChange={event => {setQuery(event.target.value);setLimit(12);}}/></label>
        <label>Map placement<select value={placement} onChange={event => {setPlacement(event.target.value);setLimit(12);}}><option value="all">All worlds</option><option value="mapped">Mapped</option><option value="unmapped">Without map placement</option></select></label>
        <label>Linked collection<select value={series} onChange={event => {setSeries(event.target.value);setLimit(12);}}><option value="all">All collections</option>{SERIES.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label>Region<select aria-label="Region" value={region} onChange={event => {setRegion(event.target.value);setLimit(12);}}><option value="all">All regions</option>{regions.map(name=><option key={name} value={name}>{name}</option>)}<option value="unknown">Region not established</option></select></label>
        <label>Terrain<select aria-label="Terrain" value={terrain} onChange={event => {setTerrain(event.target.value);setLimit(12);}}><option value="all">All terrain</option>{terrainOptions.map(([category,label])=><option key={category} value={category}>{label}</option>)}<option value="unreviewed">Not reviewed</option></select></label>
        <label>Watch progress<select aria-label="Watch progress" value={watched} onChange={event => {setWatched(event.target.value);setLimit(12);}}><option value="all">All worlds</option><option value="watched">Has watched title links</option><option value="no-watched">No watched title links</option></select></label>
      </div>
      <p>{revealCollections ? 'Collection filters include unwatched titles. Individual title lists remain hidden until revealed.' : 'Collection filters use watched titles only. All collections shows every world without exposing title links.'}</p>
      {!revealCollections && <button onClick={() => setRevealCollections(true)}>Include unwatched collection links</button>}
      <p role="status">{results.length} matching locations · {Math.min(limit, results.length)} shown</p>
      {!results.length && <p>No worlds match. Try another name, clear filters, or include unwatched collection links.</p>}
      <button onClick={reset}>Clear directory filters</button>
      <div className="directory-grid">{results.slice(0, limit).map(world => <WorldDirectoryCard key={world.id} world={world} terrain={WORLD_TERRAIN[world.id]} watchedCount={watchedCounts.get(world.id) || 0} selected={selected === world.id} onSelect={() => setSelected(world.id)}/>)}</div>
      {results.length > limit && <button onClick={() => setLimit(limit + 12)}>Show more worlds ({results.length - limit} remaining)</button>}
      {selection && <div className="directory-stories" aria-live="polite"><h2 ref={storyHeading} tabIndex={-1}>{selection.name}</h2>{!selection.mapped && <p>No supported map position is available. Explore title links below; map travel is unavailable.</p>}<WorldStories key={selection.id} worldId={selection.id} worldName={selection.name} watchedIds={watchedIds}/>{!selection.mapped && getLocation(selection.id) ? <LocationDossier id={selection.id} reducedMotion={true} showHeading={false}/> : <ImmersiveDossier worldId={selection.id} worldName={selection.name}/>}</div>}
      <p>Thumbnails are original illustrations, not official images or surface maps. Terrain categories cover reviewed worlds only; missing terrain is not inferred.</p>
      <p>Partial appearance coverage. Collection links do not establish complete scene coverage or a character’s route.</p>
    </section>
  </details>;
}
