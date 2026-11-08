import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Minus, Plus, X, RotateCcw, ExternalLink } from 'lucide-react';
import PlanetGlobe from './PlanetGlobe';
import { PLANET_APPEARANCES } from './planetAppearance';
import './orbit-viewer.css';

type Props={id:string;name:string;onClose:()=>void};
export default function OrbitViewer({id,name,onClose}:Props){
 const dialog=useRef<HTMLDialogElement>(null);
 const [ultra,setUltra]=useState(false);
 const [zoom,setZoom]=useState(1.15);
 const [offset,setOffset]=useState({x:0,y:0});
 const drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 const source=PLANET_APPEARANCES[id];
 const move=(x:number,y:number)=>setOffset(old=>({x:Math.max(-500,Math.min(500,old.x+x)),y:Math.max(-500,Math.min(500,old.y+y))}));
 useEffect(()=>{const element=dialog.current;if(!element)return;const previous=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';element.showModal();element.querySelector<HTMLButtonElement>('.orbit-close')?.focus();return()=>{document.body.style.overflow=overflow;element.close();previous?.focus({preventScroll:true});};},[]);
 return <dialog ref={dialog} className="orbit-viewer" aria-label={`Orbital view of ${name}`} onClose={onClose}>
  <header className="orbit-header"><div><span>ORBITAL VIEW</span><h2>{name}</h2></div><button className="orbit-close" onClick={onClose} aria-label="Close orbital view"><X size={22}/></button></header>
  <div className="orbit-stage" tabIndex={0} role="group" aria-label="Planet view. Drag to pan; use arrow keys to move." onKeyDown={e=>{const actions:Record<string,[number,number]>={ArrowLeft:[-40,0],ArrowRight:[40,0],ArrowUp:[0,-40],ArrowDown:[0,40]};const action=actions[e.key];if(action){e.preventDefault();move(...action);}}}
   onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,left:offset.x,top:offset.y};e.currentTarget.setPointerCapture(e.pointerId);}}
   onPointerMove={e=>{if(drag.current)setOffset({x:Math.max(-500,Math.min(500,drag.current.left+e.clientX-drag.current.x)),y:Math.max(-500,Math.min(500,drag.current.top+e.clientY-drag.current.y))});}}
   onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
   <div className="orbit-world" style={{transform:`translate(${offset.x}px, ${offset.y}px) scale(${zoom})`}}><PlanetGlobe id={id} name={name} resolution={ultra?4096:2048}/></div>
   <div className="orbit-vignette" aria-hidden="true"/>
  </div>
  <footer className="orbit-footer"><div className="orbit-controls" role="group" aria-label="Orbital view controls">
   <button onClick={()=>setZoom(v=>Math.max(.8,v-.2))} disabled={zoom<=.8} aria-label="Zoom orbital view out"><Minus size={18}/></button>
   <button onClick={()=>setZoom(v=>Math.min(2.8,v+.2))} disabled={zoom>=2.8} aria-label="Zoom orbital view in"><Plus size={18}/></button>
   <button onClick={()=>move(-50,0)} aria-label="Pan orbital view left"><ArrowLeft size={18}/></button><button onClick={()=>move(50,0)} aria-label="Pan orbital view right"><ArrowRight size={18}/></button><button onClick={()=>move(0,-50)} aria-label="Pan orbital view up"><ArrowUp size={18}/></button><button onClick={()=>move(0,50)} aria-label="Pan orbital view down"><ArrowDown size={18}/></button>
   <button onClick={()=>{setZoom(1.15);setOffset({x:0,y:0});}} aria-label="Reset orbital view"><RotateCcw size={18}/></button>
  </div><button className="orbit-detail-toggle" aria-pressed={ultra} onClick={()=>setUltra(value=>!value)}>Ultra detail</button><p>{source?.kind === 'clouded' ? 'Original atmospheric reconstruction. Surface terrain is unverified; no continents are inferred.' : 'Original reconstruction from environmental references. Surface layout and cloud patterns are illustrative.'}</p>{source&&<a href={source.sourceUrl} target="_blank" rel="noreferrer">Appearance reference <ExternalLink size={12}/></a>}</footer>
 </dialog>;
}
