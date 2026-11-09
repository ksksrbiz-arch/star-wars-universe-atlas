import { useEffect, useRef, useState } from 'react';
import { PLANET_APPEARANCES } from './planetAppearance';
import { renderPlanetGlobe } from './planetGlobeRenderer';

type Props = { id: string; name: string; thumbnail?: boolean; resolution?: number };
export default function PlanetGlobe({id,name,thumbnail=false,resolution=1024}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),profile=PLANET_APPEARANCES[id];
 const [ready,setReady]=useState<string|null>(null);
 const [rendered,setRendered]=useState(0);
 const [completed,setCompleted]=useState<string|null>(null);
 const painted=useRef<{id:string;size:number}|null>(null);
 const [failed,setFailed]=useState<string|null>(null);
 const size=thumbnail?160:Math.min(4096,Math.max(512,Math.round(resolution))),renderKey=`${id}:${size}`;
 const known=Boolean(profile&&profile.kind!=='unknown');
 useEffect(()=>{
  const target=canvas.current;if(!target||!known)return;
  let cancelled=false,task:number|undefined,worker:Worker|undefined;
  const draw=(image:ImageData)=>{
   if(cancelled)return;
   const context=target.getContext('2d');if(!context)throw new Error('Canvas unavailable');
   target.width=image.width;target.height=image.height;context.putImageData(image,0,0);
   painted.current={id,size:image.width};setRendered(image.width);setReady(id);
  };
  const fallback=()=>{
   worker?.terminate();worker=undefined;
   if(cancelled)return;
   try{if(painted.current?.id!==id)draw(renderPlanetGlobe(profile,Math.min(512,size)));}catch{setFailed(renderKey);}
   setCompleted(renderKey);
  };
  const paint=()=>{
   if(cancelled)return;
   if(thumbnail){fallback();return;}
   try{
    worker=new Worker(new URL('./planetGlobe.worker.ts',import.meta.url),{type:'module'});
    worker.onmessage=(event:MessageEvent<{requestId:string;size:number;pixels:Uint8ClampedArray<ArrayBuffer>;error?:boolean}>)=>{
     if(cancelled||event.data.requestId!==renderKey)return;
     if(event.data.error){fallback();return;}
     try{draw(new ImageData(event.data.pixels,event.data.size,event.data.size));}catch{fallback();return;}
     if(event.data.size<size)worker?.postMessage({requestId:renderKey,profile,size:event.data.size<2048?Math.min(2048,size):size});
     else{setCompleted(renderKey);worker?.terminate();worker=undefined;}
    };
    worker.onerror=fallback;
    const previous=painted.current?.id===id?painted.current.size:0;
    worker.postMessage({requestId:renderKey,profile,size:previous>=512?Math.min(previous<2048?2048:size,size):Math.min(512,size)});
   }catch{fallback();}
  };
  const schedule=()=>{if(task===undefined)task=window.setTimeout(paint,0);};
  let observer:IntersectionObserver|undefined;
  if(thumbnail&&typeof IntersectionObserver!=='undefined'){
   observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer?.disconnect();schedule();}},{rootMargin:'120px'});
   observer.observe(target);
  }else schedule();
  return()=>{cancelled=true;observer?.disconnect();window.clearTimeout(task);worker?.terminate();};
 },[profile,size,renderKey,known,thumbnail,id]);
 return <span className={`planet-globe ${thumbnail?'planet-globe-thumbnail':'planet-globe-main'}`} data-profile-id={id} data-family={profile?.kind||'unknown'} data-kind={profile?.kind||'unknown'} style={{display:'block',position:'relative',width:'100%',aspectRatio:'1',maxWidth:thumbnail?160:size,margin:'auto'}}>
  {known&&failed!==renderKey?<canvas ref={canvas} width={512} height={512} data-ready={ready===id} data-resolution={ready===id?rendered:0} role="img" aria-label={profile?.kind==='clouded'?`Original illustrative atmospheric view of ${name}; surface not established`:`Original illustrative globe of ${name}; imagined surface detail, not an official map`} style={{display:'block',width:'100%',height:'100%',opacity:ready===id?1:0}}/>:<svg viewBox="0 0 160 160" role="img" aria-label={`${name}: ${known?"globe illustration unavailable":"no reviewed globe appearance"}`} style={{display:'block',width:'100%',height:'100%'}}><circle cx="80" cy="80" r="48" fill="none" stroke="#718d9f" strokeOpacity=".5" strokeDasharray="3 6"/><circle cx="80" cy="80" r="26" fill="none" stroke="#718d9f" strokeOpacity=".3"/><path d="M72 71a10 10 0 1 1 15 9q-7 4-7 11m0 8v2" fill="none" stroke="#a5b9c4" strokeWidth="2"/></svg>}
 {!thumbnail&&known&&completed!==renderKey&&failed!==renderKey&&<span role="status" style={{position:'absolute',bottom:0,left:0,right:0,textAlign:'center',fontSize:'11px',color:'#afc4d0'}}>Refining surface detail…</span>}
 </span>;
}
