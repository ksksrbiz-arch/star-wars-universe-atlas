import { ExternalLink, Orbit } from 'lucide-react';
import { getLocation } from './locations';
import ImmersiveDossier from './ImmersiveDossier';
import PlanetPortrait from './PlanetPortrait';
import StationPortrait from './StationPortrait';
import { WORLD_TERRAIN } from './worldDossiers';

export default function LocationDossier({id,reducedMotion,showHeading=true}:{id:string;reducedMotion:boolean;showHeading?:boolean}) {
 const location=getLocation(id);
 if(!location) return null;
 return <section className="location-dossier" aria-label={`${location.name} location details`}>
  <span className="eyebrow">LOCATION FILE · {location.kind.replaceAll('-', ' ')}</span>
  {id==='glavis-ringworld'&&location.kind==='space-station'?<StationPortrait name={location.name}/>:location.kind==='planet'||location.kind==='moon'?<PlanetPortrait id={id} name={location.name} color="#94b8c0" reducedMotion={reducedMotion}/>:<div className="location-symbol"><Orbit size={60} strokeWidth={1}/><span>Location symbol · no surface illustration</span></div>}
  {showHeading && <h2>{location.name}</h2>}<p>{location.overview}</p>
  <p className="location-placement">Map position not established in this atlas. Your current galaxy location is unchanged.</p>
  <a className="field-source" href={location.sourceUrl} target="_blank" rel="noreferrer">Location identity source <ExternalLink size={12}/></a>
  {WORLD_TERRAIN[id]&&<p className="location-art-note">Original, source-informed illustration. {location.kind==='space-station'?'Structural':'Surface'} details do not establish galaxy coordinates.</p>}
  <ImmersiveDossier worldId={id} worldName={location.name}/>
 </section>;
}
