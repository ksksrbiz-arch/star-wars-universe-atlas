import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.ATLAS_URL || 'http://localhost:4173';
const out = process.env.ATLAS_EVIDENCE_DIR || 'evidence/hyperspace-flight';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const results=[];
try {
 for(const width of [1440,390,320]) {
  const page = await browser.newPage({viewport:{width,height:1000}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(base+'/#galaxy');await page.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();
  await page.clock.install();await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));
  const stage=page.locator('.map-stage');
  const distance=()=>page.locator('[data-world-id="hoth"]').evaluate(e=>{const a=new DOMMatrix(getComputedStyle(e.closest('[data-map-html]')).transform);const b=new DOMMatrix(getComputedStyle(document.querySelector('[data-world-id="tatooine"]').closest('[data-map-html]')).transform);return Math.hypot(a.m41-b.m41,a.m42-b.m42)});
  const initial=await distance();
  await page.getByRole('button',{name:'Explore Hoth',exact:true}).click();await page.locator('.map-jump-bar button').click();
  let elapsed=0;const samples=[];
  for(const [time,phase] of [[420,'charge'],[1850,'hyperspace'],[3600,'arrival']]) {
   await page.clock.fastForward(time-elapsed);await page.clock.runFor(32);elapsed=time+32;
   assert.equal(await stage.getAttribute('data-flight-phase'),phase);
   assert.equal(await page.locator('.transit-panel').evaluate(e=>getComputedStyle(e).backdropFilter),'none','Flight detail must not be blurred by the HUD shell');
   assert.equal(await page.locator('.galaxy-symbol-key').evaluate(e=>getComputedStyle(e).opacity),'0');
   assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
   const ratio=(await distance())/initial;samples.push({time,phase,projectedScale:ratio});
   assert.equal(await page.locator('.mini-map').isVisible(),true);
   for(const label of ['Cancel','Skip animation']){const button=page.getByRole('button',{name:label,exact:true});const rect=await button.boundingBox();assert(rect&&rect.width>=44&&rect.height>=44);assert(await button.evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}));}
   await stage.screenshot({path:`${out}/${width}-${phase}.png`});
  }
  assert(samples[1].projectedScale<.7,'Transit pulls back substantially from the chart');
  assert(samples[2].projectedScale>2.5,'Arrival approaches a large destination');
  await page.clock.fastForward(900);await page.clock.runFor(32);assert.equal(await page.locator('.current-location strong').innerText(),'Hoth');assert.equal(await page.locator('.transit-panel').count(),0);assert.equal(await stage.getAttribute('data-flight-phase'),null);
  assert((await distance())/initial>3.9,'Natural arrival ends at the close destination framing');
  await page.getByRole('button',{name:'Reset map view',exact:true}).click();await page.clock.runFor(100);
  await page.getByRole('button',{name:'Explore Tatooine',exact:true}).click();await page.locator('.map-jump-bar button').click();await page.clock.fastForward(2100);await page.clock.runFor(32);const cancel=page.getByRole('button',{name:'Cancel',exact:true});if(width===320){await cancel.focus();await page.keyboard.press('Enter')}else await cancel.click();await page.clock.fastForward(4600);await page.clock.runFor(100);assert.equal(await page.locator('.current-location strong').innerText(),'Hoth');assert.equal(await page.locator('.transit-panel').count(),0);assert(Math.abs((await distance())/initial-1)<.02,'Cancel restores preflight framing');
  await page.getByRole('button',{name:'Explore Tatooine',exact:true}).click();await page.locator('.map-jump-bar button').click();await page.clock.fastForward(200);await page.clock.runFor(32);await page.getByRole('button',{name:'Skip animation'}).click();await page.clock.runFor(100);assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);results.push({width,samples,naturalArrival:true,cancelMidflight:true,skip:true,errors});await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});await reduced.goto(base+'/#galaxy');await reduced.getByRole('button',{name:'Explore Hoth',exact:true}).click();await reduced.locator('.map-jump-bar button').click();assert.equal(await reduced.locator('.current-location strong').innerText(),'Hoth');assert.equal(await reduced.locator('.transit-panel').count(),0);await reduced.close();
 await writeFile(`${out}/results.json`,JSON.stringify({base,browser:'Chromium software WebGL, emulated viewports; not hardware FPS',durationMs:4200,reducedMotionInstantArrival:true,results},null,2));
 console.log('PASS charge / 3D hyperspace / close arrival, geographic inset, live44px controls, natural completion, midflight Cancel, Skip and reduced motion at1440/390/320');
} finally {await browser.close()}
