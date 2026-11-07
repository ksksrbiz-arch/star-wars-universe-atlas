import { useId } from 'react';
import { ArrowUpRight } from 'lucide-react';

export type DirectoryWorld = { id: string; name: string; mapped: boolean; region?: string; color?: string };
type Terrain = { category: string; label: string; sourceUrl: string };
/** Lightweight original symbols: never a claim about precise surface geography. */
function WorldThumbnail({ world, terrain }: { world: DirectoryWorld; terrain?: Terrain }) {
 const key=useId().replaceAll(':','');
 const color=world.color || '#6f8c9c';
 return <svg className="directory-thumbnail" viewBox="0 0 280 142" aria-hidden="true" focusable="false">
  <defs><radialGradient id={`${key}-globe`} cx="29%" cy="24%"><stop stopColor="#f3eee0"/><stop offset=".3" stopColor={color}/><stop offset="1" stopColor="#09121a"/></radialGradient><clipPath id={`${key}-mask`}><circle cx="140" cy="70" r="48"/></clipPath></defs>
  <g fill="none" stroke="#779baa" strokeOpacity=".2"><ellipse cx="140" cy="71" rx="99" ry="28" transform="rotate(-18 140 71)"/><path d="M20 70h19m202 0h19M140 5v10m0 112v10"/></g>
  {world.mapped?<><circle cx="140" cy="70" r="51" fill={color} opacity=".1"/><circle cx="140" cy="70" r="48" fill={`url(#${key}-globe)`}/><g clipPath={`url(#${key}-mask)`}>
   {terrain?.category==='urban'?<g fill="none" stroke="#f6d99b" strokeWidth=".6" opacity=".36">{[0,1,2,3,4,5].map(i=><path key={i} d={`M${99+i*16} 17v105M90 ${30+i*17}h100`}/>)}</g>:terrain?.category==='gas-giant'?<g fill="none" stroke="#e7d9c5" opacity=".2">{[0,1,2,3,4].map(i=><path key={i} d={`M85 ${35+i*17}q55 15 112-5`} strokeWidth="7"/>)}</g>:terrain?.category==='ice'?<path d="M94 60l26-17 18 12 24-22 23 19M100 94l27-22 20 10 17-15 26 14" fill="none" stroke="#d8f2fa" strokeWidth="3" opacity=".3"/>:terrain?.category==='desert'?<path d="M101 53l25-15 17 23-14 16-21-7zM147 83l22-13 16 19-11 18-23-5z" fill="#c7985c" opacity=".3"/>:terrain?<path d="M111 28l25 14-9 18 18 16-23 24-16-22-13-23zM158 72l29-8 8 28-25 21-19-19z" fill="#365d4c" opacity=".35"/>:null}
  </g><circle cx="140" cy="70" r="48" fill="none" stroke="#cee7eb" strokeOpacity=".2"/></>:<g fill="none" stroke="#88a6b4"><circle cx="140" cy="70" r="43" strokeDasharray="3 6" strokeOpacity=".5"/><circle cx="140" cy="70" r="24" strokeOpacity=".25"/><path d="M133 63a8 8 0 1 1 12 7q-5 3-5 9m0 7v2" strokeWidth="1.6"/></g>}
  <g fill="#acced9" opacity=".6"><circle cx="57" cy="35" r="1"/><circle cx="221" cy="109" r="1"/><circle cx="227" cy="28" r=".7"/></g>
 </svg>;
}

export default function WorldDirectoryCard({world,terrain,watchedCount,selected,onSelect}:{world:DirectoryWorld;terrain?:Terrain;watchedCount:number;selected:boolean;onSelect:()=>void}) {
 return <article className={`directory-world-card ${selected?'is-selected':''}`}>
  <div className="directory-card-art"><WorldThumbnail world={world} terrain={terrain}/><span className="directory-placement">{world.mapped?'Mapped':'Unmapped'}</span><span className="directory-art-caption">{world.mapped?'Original illustration':'No map position · no surface illustration'}</span></div>
  <div className="directory-card-body"><span className="directory-region">{world.region || 'Region not established'}</span><h3>{world.name}</h3>
   <dl className="directory-card-facts"><div><dt>Terrain</dt><dd>{terrain?.label || 'Not reviewed'}</dd></div><div><dt>Your watched links</dt><dd>{watchedCount} {watchedCount===1?'title':'titles'}</dd></div></dl>
   {terrain&&<a className="directory-terrain-source" href={terrain.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Terrain source for ${world.name}`}>Terrain source <ArrowUpRight size={12} aria-hidden="true"/></a>}
   <button aria-pressed={selected} onClick={onSelect}>Stories at {world.name}</button>
   {world.mapped&&<a className="directory-map-action" href={`#galaxy/${world.id}`}>Preview {world.name} on map</a>}
  </div>
 </article>;
}
