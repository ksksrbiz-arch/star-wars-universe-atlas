import {useEffect,useId,useRef} from 'react';
import {ExternalLink,X} from 'lucide-react';
import CharacterCard,{type CharacterCardEntry} from './CharacterCard';
import {sourceLink} from './SourceMedia';
import './character-dossier.css';

export default function CharacterDossier({entry,onClose}:{entry:CharacterCardEntry;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),backdrop=useRef(false),id=useId();
 useEffect(()=>{
  const element=dialog.current;if(!element)return;
  const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';element.showModal();element.querySelector<HTMLButtonElement>('.character-dossier-close')?.focus();
  return()=>{document.body.style.overflow=overflow;element.close();if(previous?.isConnected)previous.focus({preventScroll:true});};
 },[]);
 const artworkCredits=[...(entry.cutout?[{label:'CHARACTER ARTWORK',image:entry.cutout}]:[]),...(entry.image?[{label:entry.cutout?'SOURCE PORTRAIT':'ARTWORK',image:entry.image}]:[])],entryUrl=sourceLink(entry.sourceUrl);
 const description=entry.description?.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
 return <dialog ref={dialog} className="character-dossier" aria-labelledby={`${id}-title`} onKeyDown={event=>{
  if(event.key!=='Tab')return;
  const focusable=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(element=>element.getClientRects().length>0);
  const first=focusable[0],last=focusable.at(-1);if(!first||!last)return;
  const outside=!event.currentTarget.contains(document.activeElement);
  if(event.shiftKey&&(document.activeElement===first||outside)){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||outside)){event.preventDefault();first.focus();}
 }} onCancel={event=>{event.preventDefault();onClose();}} onPointerDown={event=>{backdrop.current=event.target===event.currentTarget;}} onClick={event=>{if(backdrop.current&&event.target===event.currentTarget)onClose();backdrop.current=false;}}>
  <div className="character-dossier-shell">
   <button className="character-dossier-close" aria-label="Close character card" onClick={onClose}><X size={22}/></button>
   <div className="character-dossier-art"><CharacterCard entry={entry} featured/></div>
   <div className="character-dossier-copy"><span className="eyebrow">CHARACTER ARCHIVE</span><h2 id={`${id}-title`}>{entry.name}</h2><span className="character-dossier-rule"/>
    {description?<p className="character-dossier-description">{description}</p>:<p className="character-dossier-description">Explore the source entry for more about {entry.name}.</p>}
    {entryUrl&&<a className="character-dossier-source" href={entryUrl} target="_blank" rel="noreferrer">Explore the source entry <ExternalLink size={14}/></a>}
    {artworkCredits.map(({label,image})=><div className="character-dossier-credit" key={label}><span>{label}</span>{sourceLink(image.sourceUrl)?<a href={sourceLink(image.sourceUrl)} target="_blank" rel="noreferrer">{image.credit}<ExternalLink size={12}/></a>:<p>{image.credit}</p>}</div>)}
   </div>
  </div>
 </dialog>;
}
