import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'https://star-wars-universe-atlas.skdev-371.workers.dev';
await mkdir('evidence/deployment',{recursive:true});
const checks=[];
const health=await fetch(base+'/api/health');assert.equal(health.status,200);const data=await health.json();assert.deepEqual({works:data.works,worlds:data.worlds,appearances:data.appearances},{works:185,worlds:62,appearances:171});checks.push('Live Hyperdrive/Postgres health and catalog counts');
for(const [endpoint,count]of [['catalog',185],['worlds',62],['appearances',171],['sequences',4],['regions',8],['routes',5]]){const r=await fetch(base+'/api/'+endpoint);assert.equal(r.status,200);assert.equal((await r.json()).items.length,count);}
checks.push('All six public catalog endpoints return expected records');
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
  assert.equal(await page.locator('canvas').count(),1);assert.equal(await page.getByLabel('Find a mapped world').locator('option').count(),62);
  await page.waitForTimeout(500);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.map-stage').screenshot({path:`evidence/deployment/live-${mobile?'mobile':'desktop'}-map.png`});
  await page.getByLabel('Find a mapped world').selectOption('hoth');
  await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));
  await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();await page.clock.runFor(800);
  assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
  assert.equal(await page.locator('.transit-panel').evaluate(el=>Number(getComputedStyle(el).opacity)),1);
  await page.locator('.map-stage').screenshot({path:`evidence/deployment/live-${mobile?'mobile':'desktop'}-warp.png`});
  await page.getByRole('button',{name:'Skip animation'}).click();await page.clock.runFor(100);
  assert.equal(await page.locator('.current-location strong').innerText(),'Hoth');
  await page.clock.resume();await page.getByRole('link',{name:'Journey',exact:true}).click();await page.locator('.journey-current h2').waitFor();
  checks.push(`Live ${mobile?'390px mobile':'1440px desktop'} map,62worlds,warp/skip,Journey navigation and nooverflow`);
  await page.close();
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();await writeFile('evidence/deployment/live-results.json',JSON.stringify({url:base,checkedAt:new Date().toISOString(),checks,errors,limitation:'Software WebGL and emulated mobile; not physical-device performance measurements'},null,2));}
console.log(JSON.stringify({checks,errors},null,2));

