import { useState } from 'react';
import { NASA_STARFIELD } from './mediaAssets';
import './atlas-hero.css';
import GuidedJourney from './GuidedJourney';

export default function AtlasHero({ reducedMotion, watchedIds }: { reducedMotion: boolean; watchedIds: ReadonlySet<string> }) {
 const [failed,setFailed]=useState(false);
 const [small,medium,large]=NASA_STARFIELD.files;
 const openMap = () => {
  const map = document.getElementById('galaxy-map');
  map?.focus({ preventScroll: true });
  map?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
 };
 const browseWorlds = () => {
  const directory = document.getElementById('world-directory') as HTMLDetailsElement | null;
  if (!directory) return;
  directory.open = true;
  directory.querySelector('summary')?.focus({ preventScroll: true });
  directory.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
 };
 return <div className="page-intro atlas-hero">
  {!failed&&<picture className="atlas-hero-media" aria-hidden="true"><source media="(min-width: 768px)" srcSet={medium.src} type="image/webp"/><img src={small.src} width={small.width} height={small.height} alt="" decoding="async" onError={()=>setFailed(true)}/></picture>}
  <div className="atlas-hero-copy"><div className="eyebrow"><span className="small-line"/> EXPLORE THE GALAXY</div><h2>Your next story is out there<span>.</span></h2><p>Choose a world. Follow a story. Make the jump.</p><button className="hero-open-map" onClick={openMap}>Open galaxy map <span aria-hidden="true">↓</span></button><button className="hero-open-map hero-browse-worlds" onClick={browseWorlds}>Browse worlds <span aria-hidden="true">↗</span></button></div>
  <GuidedJourney watchedIds={watchedIds}/>
  <details className="atlas-hero-credit"><summary>Illustrative starfield · NASA SVS</summary><p>{NASA_STARFIELD.credit}</p><p>{NASA_STARFIELD.meaning}</p><a href={NASA_STARFIELD.sourceUrl} target="_blank" rel="noreferrer">View original and credit ↗</a><a href={large.src} target="_blank" rel="noreferrer">Open 4K derivative (1.6 MB) ↗</a><a href={NASA_STARFIELD.rightsUrl} target="_blank" rel="noreferrer">Public-domain reuse guidance ↗</a></details>
 </div>;
}
