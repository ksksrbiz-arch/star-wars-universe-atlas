import { renderPlanetGlobe } from './planetGlobeRenderer';
import type { PlanetAppearance } from './planetAppearance';
self.onmessage = (event: MessageEvent<{requestId:string;profile:PlanetAppearance;size:number}>) => {
 const {requestId,profile,size}=event.data;
 try {
  const image=renderPlanetGlobe(profile,size);
  // Cached previews transfer a copy; uncached 4K transfers its buffer directly.
  const pixels=size>2048?image.data:image.data.slice();
  self.postMessage({requestId,size,pixels}, {transfer:[pixels.buffer]});
 } catch { self.postMessage({requestId,error:true}); }
};
