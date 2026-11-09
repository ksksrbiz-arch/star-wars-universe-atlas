import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PLANET_APPEARANCES} from '../src/planetAppearance.ts';
import {renderPlanetGlobe} from '../src/planetGlobeRenderer.ts';
globalThis.ImageData=class{constructor(width,height){this.width=width;this.height=height;this.data=new Uint8ClampedArray(width*height*4);}};
const hashes=new Set();
for(const p of Object.values(PLANET_APPEARANCES).filter(p=>p.kind!=='unknown')){
 const image=renderPlanetGlobe(p,64);assert.equal(image.data.length,64*64*4);assert.equal(image.data[3],0,'Corners transparent');assert.ok(image.data[(32*64+32)*4+3]>240,'Globe center opaque');
 const digest=createHash('sha256').update(image.data).digest('hex');assert.ok(!hashes.has(digest),`${p.id} must have distinct rendered art`);hashes.add(digest);
 assert.equal(createHash('sha256').update(renderPlanetGlobe(p,64).data).digest('hex'),digest,'Static render deterministic');
}
console.log(`PASS ${hashes.size} unique deterministic globe renders, transparent corners and opaque centers`);
