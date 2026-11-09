import {chromium} from 'playwright';
import {appearanceDigest,datasetDigest} from './appearance-publication.mjs';
import assert from 'node:assert/strict';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'https://star-wars-universe-atlas.skdev-371.workers.dev';
const expectationSource=process.env.ATLAS_DB_EXPECTATION_FILE || new URL('../cloudflare/database-expectation.json',import.meta.url);
const expected=JSON.parse(await readFile(expectationSource,'utf8'));
for(const key of ['works','worlds','appearances']) assert.ok(Number.isSafeInteger(expected[key]) && expected[key]>0,`Invalid database expectation: ${key}`);
assert.ok(typeof expected.id==='string' && expected.id.length>0,'Database expectation must name its intended publication');
assert.match(expected.sha256,/^[0-9a-f]{64}$/,'Database expectation must include the reviewed appearance payload digest');
const expectedCounts={...{sequences:10,regions:8,routes:5},...expected};
for(const key of ['sequences','regions','routes']) assert.ok(Number.isSafeInteger(expectedCounts[key]) && expectedCounts[key]>0,`Invalid database expectation: ${key}`);
await mkdir('evidence/deployment',{recursive:true});
const checks=[];
const health=await fetch(base+'/api/health');assert.equal(health.status,200);const data=await health.json();assert.deepEqual({works:data.works,worlds:data.worlds,appearances:data.appearances},{works:expected.works,worlds:expected.worlds,appearances:expected.appearances});checks.push(`Live database counts match explicit expectation ${expected.id}; independent of bundled frontend data`);
for(const [endpoint,count]of [['catalog',expected.works],['worlds',expected.worlds],['appearances',expected.appearances],['sequences',expectedCounts.sequences],['regions',expectedCounts.regions],['routes',expectedCounts.routes]]){const r=await fetch(base+'/api/'+endpoint);assert.equal(r.status,200);const items=(await r.json()).items;assert.equal(items.length,count);if(endpoint==='worlds' && expected.worldsSha256)assert.equal(datasetDigest(items),expected.worldsSha256,'Published map content mismatch');if(endpoint==='catalog' && expected.catalogSha256)assert.equal(datasetDigest(items),expected.catalogSha256,'Published catalog content mismatch');if(endpoint==='sequences' && expected.sequencesSha256)assert.equal(datasetDigest(items),expected.sequencesSha256,'Published sequences content mismatch');if(endpoint==='appearances'){assert.equal(appearanceDigest(items),expected.sha256,'Published appearance content differs from the explicit expected publication');if(expected.coveredTitles!==undefined)assert.equal(new Set(items.map(item=>item.itemId)).size,expected.coveredTitles);}}
checks.push('All six public catalog endpoints return expected records; full appearance payload digest matches reviewed expectation');
assert.equal((await fetch(base+'/api/not-found')).status,404);
assert.equal((await fetch(base+'/api/catalog',{method:'POST'})).status,405);
assert.equal((await fetch(base+'/media/nonexistent-verification-object')).status,404);
checks.push('Unknown API/media objects return404 and public writes return405');
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const errors=[];
try{
 for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1050},isMobile:mobile,hasTouch:mobile});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.clock.install();await page.goto(base);await page.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();
  assert.equal(await page.locator('.galaxy-canvas canvas').count(),1);assert.equal(await page.getByLabel('Find a mapped world').locator('option').count(),expected.worlds);
  await page.waitForTimeout(500);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.map-stage').screenshot({path:`evidence/deployment/live-${mobile?'mobile':'desktop'}-map.png`});
  await page.getByRole('button',{name:'Explore Hoth',exact:true}).click();
  await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));
  await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();await page.clock.runFor(800);
  assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
  assert.equal(await page.locator('.transit-panel').evaluate(el=>Number(getComputedStyle(el).opacity)),1);
  await page.locator('.map-stage').screenshot({path:`evidence/deployment/live-${mobile?'mobile':'desktop'}-warp.png`});
  await page.getByRole('button',{name:'Skip animation'}).click();await page.clock.runFor(100);
  assert.equal(await page.locator('.current-location strong').innerText(),'Hoth');
  await page.clock.resume();await page.getByRole('link',{name:'Journey',exact:true}).click();
  if(mobile&&await page.locator('.sheet-toggle').getAttribute('aria-expanded')==='false')await page.locator('.sheet-toggle').click();
  await page.locator('.journey-current h2').waitFor();
  checks.push(`Live ${mobile?'390px mobile':'1440px desktop'} map,${expected.worlds}worlds,warp/skip,Journey navigation and nooverflow`);
  await page.close();
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();await writeFile('evidence/deployment/live-results.json',JSON.stringify({url:base,checkedAt:new Date().toISOString(),databaseExpectation:expected,appearanceContentVerified:true,publicationRowIdentityVerified:false,checks,errors,limitation:'Appearance content digest verified; publication-row identity is not exposed by the API. Software WebGL and emulated mobile; not physical-device performance measurements'},null,2));}
console.log(JSON.stringify({checks,errors},null,2));

