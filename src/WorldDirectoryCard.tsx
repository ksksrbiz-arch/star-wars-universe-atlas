import { getLocationKind } from './locations';
import PlanetGlobe from './PlanetGlobe';
import { PLANET_APPEARANCES } from './planetAppearance';
import { ArrowUpRight } from 'lucide-react';

export type DirectoryWorld = { id: string; name: string; mapped: boolean; region?: string; color?: string };
type Terrain = { category: string; label: string; sourceUrl: string };

export default function WorldDirectoryCard({world,terrain,watchedCount,selected,onSelect}:{world:DirectoryWorld;terrain?:Terrain;watchedCount:number;selected:boolean;onSelect:()=>void}) {
 const reviewed = PLANET_APPEARANCES[world.id]?.kind && PLANET_APPEARANCES[world.id].kind !== 'unknown';
 return <article className={`directory-world-card ${selected?'is-selected':''}`}>
  <div className="directory-card-art"><div className="directory-thumbnail"><PlanetGlobe id={world.id} name={world.name} thumbnail/></div><span className="directory-placement">{world.mapped?'Mapped':'Unmapped'}</span><span className="directory-art-caption">{reviewed ? (world.mapped ? 'Original world study' : 'Original study · position unmapped') : 'Appearance not established'}</span></div>
  <div className="directory-card-body"><span className="directory-region">{world.region || 'Region not established'}</span><h3>{world.name}</h3>{getLocationKind(world.id) !== 'unknown' && <span className="location-kind">{getLocationKind(world.id).replaceAll('-', ' ')}</span>}
   <dl className="directory-card-facts"><div><dt>Terrain</dt><dd>{terrain?.label || 'Not reviewed'}</dd></div><div><dt>Your watched links</dt><dd>{watchedCount} {watchedCount===1?'title':'titles'}</dd></div></dl>
   {terrain&&<a className="directory-terrain-source" href={terrain.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Terrain source for ${world.name}`}>Terrain source <ArrowUpRight size={12} aria-hidden="true"/></a>}
   <button aria-pressed={selected} onClick={onSelect}>Stories at {world.name}</button>
   {world.mapped&&<a className="directory-map-action" href={`#galaxy/${world.id}`}>Preview {world.name} on map</a>}
  </div>
 </article>;
}
