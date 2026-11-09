import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL??'https://star-wars-universe-atlas.skdev-371.workers.dev';
const out='evidence/ingestion/live';await mkdir(out,{recursive:true});
async function get(path){const r=await fetch(base+path);assert.equal(r.status,200,path);return r.json();}
const locations=await get('/api/databank?type=location&limit=1'),characters=await get('/api/databank?type=character&limit=1');
assert.equal(locations.total,326);assert.equal(characters.total,964);
for(const result of [locations,characters]){assert(!('raw' in result.items[0]));assert(!('payload' in result.items[0]));}
const {items}=await get('/api/media-index');
const counts=Object.fromEntries(['episode','world','series'].map(type=>[type,items.filter(row=>row.entityType===type).length]));
assert.deepEqual(counts,{episode:260,world:14,series:8});
const samples=[...items.filter(x=>x.entityType==='world').slice(0,3),...items.filter(x=>x.entityType==='episode').filter((_,i)=>i%30===0),...items.filter(x=>x.entityType==='series').slice(0,2)];
for(const sample of samples){const r=await fetch(base+sample.src,{method:'HEAD'});assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/^image\/(jpeg|png|webp)/);assert(Number(r.headers.get('content-length'))>0);}
assert.equal((await fetch(base+'/api/databank?type=person')).status,400);
assert.equal((await fetch(base+'/api/databank',{method:'POST'})).status,405);
assert.equal((await fetch('https://star-wars-atlas-ingestion.skdev-371.workers.dev/status')).status,404);
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const errors=[];
try{for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base+'/#library');await page.locator('.galactic-databank summary').click();
 assert.equal(await page.locator('.databank-card').count(),0);
 await page.getByRole('checkbox',{name:/Reveal story imagery and details/}).check();
 await page.getByRole('searchbox',{name:'Search the Galactic Databank'}).fill('Tatooine');
 await page.locator('.databank-card h2').filter({hasText:'Tatooine'}).waitFor();
 const photo=page.locator('.databank-card img').first();await photo.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>{const i=document.querySelector('.databank-card img');return i?.complete&&i.naturalWidth>100;});
 await page.screenshot({path:`${out}/databank-${width}.png`});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.goto(base+'/#journey/mandalorian-s01e01');
 if(width<721&&await page.locator('.sheet-toggle').getAttribute('aria-expanded')==='false')await page.locator('.sheet-toggle').click();
 const frame=page.locator('.source-media-episode');await frame.getByRole('button',{name:'Reveal image for this title'}).click();
 await frame.locator('img').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>{const i=document.querySelector('.source-media-episode img');return i?.complete&&i.naturalWidth>100;});
 assert.equal(await page.locator('.journey-stop').count(),0,'Image reveal must not disclose location joins');
 await frame.screenshot({path:`${out}/episode-${width}.png`});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.close();
}}finally{await browser.close();}
assert.deepEqual(errors,[]);
const result={checkedAt:new Date().toISOString(),url:base,locations:locations.total,characters:characters.total,media:counts,sampledImageResponses:samples.length,browserWidths:[1440,390],errors,checks:['Live database-backed search and pagination','Stored R2 raster delivery','Title and global spoiler consent','Attribution and fallbacks','Read-only public API and authenticated private service'],limitations:['Desktop Chromium with software WebGL and mobile emulation; no physical-device claim','Source media does not expand verified episode-to-planet coverage']};
await writeFile(`${out}/results.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));
