import type { PlanetAppearance } from './planetAppearance';

type RGB = [number, number, number];
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, v: number) => { const t = clamp((v-a)/(b-a)); return t*t*(3-2*t); };
const rgb = (hex: string): RGB => { const s = hex.replace('#',''); const n = parseInt(s.length===3?s.split('').map(c=>c+c).join(''):s,16); return [(n>>16)&255,(n>>8)&255,n&255]; };
function random(x: number,y: number,z: number,seed: number) {
 let h = Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,2147483647)^seed;
 h = Math.imul(h^(h>>>13),1274126177); return ((h^(h>>>16))>>>0)/4294967295;
}
function noise(x: number,y: number,z: number,seed: number) {
 const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);
 let tx=x-ix,ty=y-iy,tz=z-iz;tx=tx*tx*(3-2*tx);ty=ty*ty*(3-2*ty);tz=tz*tz*(3-2*tz);
 const a=mix(random(ix,iy,iz,seed),random(ix+1,iy,iz,seed),tx),b=mix(random(ix,iy+1,iz,seed),random(ix+1,iy+1,iz,seed),tx);
 const c=mix(random(ix,iy,iz+1,seed),random(ix+1,iy,iz+1,seed),tx),d=mix(random(ix,iy+1,iz+1,seed),random(ix+1,iy+1,iz+1,seed),tx);
 return mix(mix(a,b,ty),mix(c,d,ty),tz);
}
function fractal(x: number,y: number,z: number,seed: number,octaves=5) {
 let value=0,weight=.5,total=0;
 for(let i=0;i<octaves;i++){value+=noise(x,y,z,seed+i*1013)*weight;total+=weight;x=x*2.13+7.1;y=y*2.13+3.7;z=z*2.13-5.2;weight*=.49;}
 return value/total;
}
const cache = new Map<string, ImageData>();
let cacheBytes=0;
/** Static original sphere study. No geographic coordinates or external textures enter this renderer. */
export function renderPlanetGlobe(profile: PlanetAppearance, size: number): ImageData {
 const key=JSON.stringify([profile,size]);const previous=cache.get(key);if(previous)return previous;
 const image=new ImageData(size,size),pixels=image.data,radius=size*.405,center=size*.5;
 const ocean=rgb(profile.ocean),land=rgb(profile.land),highland=rgb(profile.highland),cloud=rgb(profile.cloud);
 const atmosphere=profile.atmosphere?rgb(profile.atmosphere):null,accent=profile.cloudAccent?rgb(profile.cloudAccent):null;
 const seed=profile.seed|0,angle=(seed%628)/100,cs=Math.cos(angle),sn=Math.sin(angle);
 const lx=-.66,ly=-.46,lz=.593;const halfLen=Math.hypot(lx,ly,lz+1),hx=lx/halfLen,hy=ly/halfLen,hz=(lz+1)/halfLen;
 const coast=.28+clamp(profile.oceanCoverage)*.44;
 for(let py=0;py<size;py++)for(let px=0;px<size;px++){
  const index=(py*size+px)*4,x=(px+.5-center)/radius,y=(py+.5-center)/radius,rr=x*x+y*y;
  if(rr>1){
   const edge=Math.sqrt(rr)-1;if(edge>.1)continue;
   const facing=clamp((x*lx+y*ly+.4)*.65+.3),glow=Math.exp(-edge*53)*facing*.23;
   pixels[index]=atmosphere?.[0]??mix(highland[0],115,.5);pixels[index+1]=atmosphere?.[1]??mix(highland[1],168,.5);pixels[index+2]=atmosphere?.[2]??mix(highland[2],210,.5);pixels[index+3]=Math.round(glow*255);continue;
  }
  const z=Math.sqrt(1-rr),nx=x*cs+z*sn,ny=y,nz=-x*sn+z*cs;
  const warp=noise(nx*2.7+10,ny*2.7,nz*2.7,seed+19)-.5;
  const shape=fractal(nx*2.7+warp*.7,ny*2.7+warp*.4,nz*2.7-warp*.6,seed);
  const fine=noise(nx*128+3,ny*128-2,nz*128,seed+71),grain=noise(nx*310,ny*310,nz*310,seed+52);
  let r=0,g=0,b=0,water=0,emission=0;
  const detail=fractal(nx*31+warp*2,ny*31,nz*31,seed+321,size>160?5:2);
  const ridge=1-Math.abs(detail*2-1);
  const erosion=noise(nx*155+detail*4,ny*155,nz*155,seed+911);
  let relief=1;
  if(profile.kind==='clouded'){
   const layers=fractal(nx*8+warp*3,ny*8,nz*8,seed+191,5);
   const atmospheric=smooth(.2,.8,layers)*.75+detail*.25;
   r=mix(land[0],cloud[0],atmospheric);g=mix(land[1],cloud[1],atmospheric);b=mix(land[2],cloud[2],atmospheric);
  }else if(profile.kind==='gas'){
   const turbulence=fractal(nx*5,ny*7,nz*5,seed+29,4);
   const bands=.5+.5*Math.sin(ny*34+turbulence*2.8+Math.sin(nx*5+nz*3)*.4);
   const streak=fractal(nx*9,ny*56,nz*9,seed+67,3);
   const t=clamp(bands*.8+streak*.2);
   r=mix(land[0],highland[0],t);g=mix(land[1],highland[1],t);b=mix(land[2],highland[2],t);
  }else{
   water=profile.oceanCoverage<=.01?0:1-smooth(coast-.012,coast+.012,shape);
   const mountain=smooth(coast-.03,coast+.23,shape),terrainDetail=((fine-.5)*profile.roughness*35+(grain-.5)*8)*(1-water);
   const shore=water*smooth(coast-.045,coast-.01,shape);
   const rugged=smooth(.35,.8,mountain)*profile.roughness*(1-water);
   relief=1+(ridge-.7)*rugged*.85+(erosion-.5)*rugged*.28;
   // Subpixel-scale ridges and darker eroded valleys sit within the existing biome palette.
   const valley=(1-ridge)*rugged;
   relief-=valley*.35;
   r=mix(mix(land[0],highland[0],mountain),ocean[0]+shore*16,water)+terrainDetail;
   g=mix(mix(land[1],highland[1],mountain),ocean[1]+shore*23,water)+terrainDetail;
   b=mix(mix(land[2],highland[2],mountain),ocean[2]+shore*18,water)+terrainDetail;
   if(profile.kind==='ice'||profile.iceCoverage>0){
    const cap=profile.kind==='ice'?clamp(.75+shape*.25):smooth(1-clamp(profile.iceCoverage)*.8-.08,1-clamp(profile.iceCoverage)*.8+.08,Math.abs(ny)+warp*.08);
    const iceLevel=clamp(shape*.75+fine*.22),fissure=profile.kind==='ice'?1-smooth(.006,.025,Math.abs(noise(nx*18,ny*18,nz*18,seed+83)-.5)):0;
    r=mix(r,mix(highland[0],cloud[0],iceLevel)-fissure*28,cap);g=mix(g,mix(highland[1],cloud[1],iceLevel)-fissure*18,cap);b=mix(b,mix(highland[2],cloud[2],iceLevel)-fissure*8,cap);
   }
   if(profile.kind==='city'){
    const lon=Math.atan2(nx,nz),lat=Math.asin(ny);
    const gridX=Math.abs(Math.sin(lon*115+warp*.8)),gridY=Math.abs(Math.sin(lat*130+warp*.8));
    const avenue=(1-smooth(.025,.095,Math.min(gridX,gridY)))*.65;
    const blocks=noise(nx*85,ny*85,nz*85,seed+99);
    const district=1-smooth(.018,.055,Math.abs(Math.sin(Math.hypot(lon*.8,lat)*94+warp*.5)));
    const metal=.2+blocks*.23+avenue*.24+district*.14;
    r=highland[0]*metal;g=highland[1]*metal;b=highland[2]*metal;
    water=0;
   }
   if(profile.kind==='lava'){
    const crack=1-smooth(.012,.034,Math.abs(fractal(nx*12,ny*12,nz*12,seed+47,3)-.5));
    const hot=smooth(.39,.66,shape)*crack;emission=hot;
    const basalt=.1+ridge*.13+erosion*.07;
    r=mix(r*basalt,highland[0],hot*.82);g=mix(g*basalt,highland[1],hot*.82);b=mix(b*basalt,highland[2],hot*.82);
   }
  }
  const diffuse=Math.max(0,x*lx+y*ly+z*lz),light=.025+Math.pow(diffuse,.78)*.94;
  const cloudNoise=profile.cloudCoverage>0?fractal(nx*5+warp*1.8,ny*5,nz*5,seed+191,5):0;
  const wisps=profile.cloudCoverage>0?fractal(nx*23+warp*5,ny*47+detail*2,nz*23,seed+831,3):0;
  const cloudEdge=fractal(nx*72+warp*12,ny*72+detail*4,nz*72,seed+574,3);
  const feathered=cloudNoise+(cloudEdge-.5)*.11;
  let cover=profile.cloudCoverage>0&&profile.kind!=='gas'?smooth(.65-profile.cloudCoverage*.32,.92-profile.cloudCoverage*.32,feathered):0;
  if(profile.kind!=='gas')cover=clamp(cover*(.66+cloudEdge*.34)+smooth(.53,.76,wisps)*profile.cloudCoverage*.28);
  const shadowNoise=profile.cloudCoverage>0?fractal(nx*5+warp*1.8+.045,ny*5+.035,nz*5,seed+191,4):0;
  const cloudShadow=1-smooth(.72-profile.cloudCoverage*.32,.87-profile.cloudCoverage*.32,shadowNoise)*.3;
  r*=relief;g*=relief;b*=relief;
  r=r*light*cloudShadow;g=g*light*cloudShadow;b=b*light*cloudShadow;
  r=mix(r,cloud[0]*(light+.045),cover*.92);g=mix(g,cloud[1]*(light+.045),cover*.92);b=mix(b,cloud[2]*(light+.045),cover*.92);
  // Static atmospheric color motifs, without animation or an exposed crystal surface.
  if(accent&&profile.kind==='clouded'){
   const tint=smooth(.60,.76,wisps)*.32;
   r=mix(r,accent[0]*(light+.08),tint);g=mix(g,accent[1]*(light+.08),tint);b=mix(b,accent[2]*(light+.08),tint);
  }
  if(atmosphere){const haze=.12+Math.pow(1-z,2)*.35;r=mix(r,atmosphere[0]*light,haze);g=mix(g,atmosphere[1]*light,haze);b=mix(b,atmosphere[2]*light,haze);}
  if(profile.kind==='city'){
   const settlement=smooth(.43,.66,shape),lightMask=smooth(.73,.89,fine)*settlement;
   const night=1-smooth(.02,.28,diffuse),lit=lightMask*night*(1-cover*.8);
   r+=255*lit;g+=186*lit;b+=83*lit;
  }
  if(emission>0){r+=highland[0]*emission*.44;g+=highland[1]*emission*.44;b+=highland[2]*emission*.44;}
  const reflection=Math.pow(Math.max(0,x*hx+y*hy+z*hz),82)*water*(1-cover)*57;
  const rim=Math.pow(1-z,3.5)*Math.pow(diffuse,.35)*.5;
  pixels[index]=Math.round(Math.max(0,Math.min(255,r+reflection+rim*mix(highland[0],cloud[0],.65)*.55)));
  pixels[index+1]=Math.round(Math.max(0,Math.min(255,g+reflection+rim*mix(highland[1],cloud[1],.65)*.65)));
  pixels[index+2]=Math.round(Math.max(0,Math.min(255,b+reflection+rim*mix(highland[2],cloud[2],.65)*.75)));
  pixels[index+3]=Math.round(clamp((1-Math.sqrt(rr))*radius+.5)*255);
 }
 if(image.data.byteLength>24*1024*1024)return image;
 while(cache.size&&cacheBytes+image.data.byteLength>24*1024*1024){const oldest=cache.keys().next().value!;cacheBytes-=cache.get(oldest)!.data.byteLength;cache.delete(oldest);}
 cache.set(key,image);cacheBytes+=image.data.byteLength;return image;
}
