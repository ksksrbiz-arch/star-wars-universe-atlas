import { useState, lazy, Suspense } from 'react';
const OrbitViewer = lazy(() => import('./OrbitViewer'));
import { ExternalLink } from 'lucide-react';
import PlanetGlobe from './PlanetGlobe';
import { PLANET_APPEARANCES } from './planetAppearance';
import './planet-portrait.css';

type Props = { id: string; name: string; color: string; reducedMotion: boolean };
/** Original per-world studies. Source-backed environments, not surveyed surface maps. */
export default function PlanetPortrait({id,name,reducedMotion}: Props) {
 const [orbitOpen,setOrbitOpen] = useState(false);
 const profile = PLANET_APPEARANCES[id];
 const reviewed = profile && profile.kind !== 'unknown';
 return <figure className={`atlas-portrait planet-study surface-${profile?.kind ?? 'unknown'}`} data-world={id} data-motion={reducedMotion?'reduced':'full'}>
  <div className="planet-study-image portrait-disc"><PlanetGlobe id={id} name={name}/></div>
  <figcaption><span>{reviewed ? 'ORIGINAL WORLD STUDY' : 'APPEARANCE NOT ESTABLISHED'}</span><span>{reviewed ? (profile.kind === 'clouded' ? 'Atmospheric study · surface unverified' : profile.kind === 'gas' ? 'Atmospheric study · illustrative bands' : 'Reference-informed · illustrative surface') : 'A location marker, not a planet texture'}</span>
   {reviewed && <a href={profile.sourceUrl} target="_blank" rel="noreferrer">Appearance reference <ExternalLink size={12} aria-hidden="true"/></a>}
   {reviewed && <button className="open-orbit-view" onClick={()=>setOrbitOpen(true)}>Explore from orbit</button>}
  </figcaption>
  {orbitOpen && <Suspense fallback={<p role="status">Opening orbital view…</p>}><OrbitViewer id={id} name={name} onClose={()=>setOrbitOpen(false)}/></Suspense>}
 </figure>;
}
