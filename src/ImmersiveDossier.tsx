import { ExternalLink, MapPin, ScanLine } from 'lucide-react';
import { WORLD_DOSSIERS } from './worldDossiers';
import DatabankGuide from './DatabankGuide';
import './immersive-dossier.css';

export default function ImmersiveDossier({ worldId, worldName }: { worldId: string; worldName: string }) {
 const dossier = WORLD_DOSSIERS[worldId];
 if (!dossier) return null;
 return <section className={`immersive-dossier dossier-${worldId}`} aria-label={`${worldName} field guide`}>
  <header><span className="field-guide-kicker"><ScanLine size={14} aria-hidden="true"/> FIELD GUIDE</span><h3>A closer look at {worldName}</h3><p>{dossier.eyebrow}</p></header>
  <div className="field-guide-body">
  <div className="field-guide-summary"><p className="field-guide-overview">{dossier.overview.text}</p>
  <a className="field-source" href={dossier.overview.sourceUrl} target="_blank" rel="noreferrer">World overview source <ExternalLink size={11} aria-hidden="true"/></a></div>
  <div className="field-terrain"><span>{dossier.environmentLabel ?? 'LANDSCAPE & ATMOSPHERE'}</span><h4>{dossier.terrain.label}</h4><p>{dossier.terrain.text}</p><a className="field-source" href={dossier.terrain.sourceUrl} target="_blank" rel="noreferrer">{dossier.environmentLabel ? 'Structure source' : 'Landscape source'} <ExternalLink size={11} aria-hidden="true"/></a></div>
  <div className="field-landmarks"><h4>Places to know</h4><p className="field-intro">Open a location to explore its setting and source.</p>{dossier.highlights.map(place=><details key={`${worldId}-${place.id}`}><summary><MapPin size={14} aria-hidden="true"/><span>{place.name}</span><span className="field-expand" aria-hidden="true">+</span></summary><div className="field-place-content"><p>{place.description}</p><a className="field-source" href={place.sourceUrl} target="_blank" rel="noreferrer">Read {place.name} source <ExternalLink size={11} aria-hidden="true"/></a></div></details>)}</div>
  <p className="field-caveat">{dossier.caveat}</p>
  </div>
  <DatabankGuide worldId={worldId} worldName={worldName}/>
 </section>;
}
