import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const out=process.env.ATLAS_EVIDENCE_DIR||'evidence/prequel-visuals';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const results=[];
try {
 for(const [width,quality,motion] of [[1440,'cinematic','no-preference'],[1440,'balanced','reduce'],[390,'balanced','reduce'],[320,'balanced','reduce']]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:motion});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__draws=0;for(const C of [window.WebGLRenderingContext,window.WebGL2RenderingContext])if(C)for(const name of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced'])if(Object.hasOwn(C.prototype,name)){const fn=C.prototype[name];C.prototype[name]=function(...args){window.__draws++;return fn.apply(this,args);};}});
  await page.goto(base+'/#galaxy');await page.getByRole('button',{name:'Explore Tatooine',exact:true}).waitFor();
  await page.locator('.workspace-settings>summary').click();await page.getByLabel('Graphics quality').selectOption(quality);await page.locator('.workspace-settings>summary').click();
  const current=page.getByRole('button',{name:'Explore Tatooine',exact:true});assert.equal(await current.locator('.map-label-grid').innerText(),'R-16');
  await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.getByRole('button',{name:'Reset map view',exact:true}).click();
  await page.waitForTimeout(2000);const before=await page.evaluate(()=>window.__draws);await page.waitForTimeout(600);const draws=await page.evaluate(()=>window.__draws)-before;assert.equal(draws,0,'Static enhancements must settle');
  await page.locator('.map-stage').screenshot({path:`${out}/galaxy-${width}-${quality}.png`});
  if(width<600){
   assert.equal(await page.locator('.route-map-label').first().isVisible(),false,'Secondary geography names wait for zoom on mobile');
   for(let i=0;i<5;i++)await page.getByRole('button',{name:'Zoom in',exact:true}).click();
   await page.waitForTimeout(200);assert.equal(await page.locator('.route-map-label').first().isVisible(),true,'Route names become available at detail scale');
   await page.getByRole('button',{name:'Reset map view',exact:true}).click();
  }
  await page.locator('.workspace-settings>summary').click();await page.getByLabel('Find a mapped world').selectOption('naboo');
  assert.equal(await page.getByRole('button',{name:'Explore Naboo',exact:true}).locator('.map-label-grid').innerText(),'O-17');
  assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
  const selected=await page.getByRole('button',{name:'Explore Naboo',exact:true}).boundingBox(),frame=await page.locator('canvas').boundingBox();assert(selected.x>=frame.x&&selected.x+selected.width<=frame.x+frame.width+1,'Priority badge stays in map');
  assert.equal(await page.locator('canvas').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
  results.push({width,quality,motion,settledDrawsOver600ms:draws,errors});await page.close();
 }
 const travel=await browser.newPage({viewport:{width:1440,height:900}});await travel.goto(base+'/#galaxy');await travel.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();await travel.clock.install();await travel.clock.pauseAt(await travel.evaluate(()=>Date.now()+1000));
 await travel.getByRole('button',{name:'Explore Hoth',exact:true}).click();await travel.locator('.map-jump-bar button').click();await travel.clock.runFor(200);await travel.getByRole('button',{name:'Cancel',exact:true}).click();await travel.clock.runFor(2300);assert.equal(await travel.locator('.current-location strong').innerText(),'Tatooine');
 await travel.getByRole('button',{name:'Explore Hoth',exact:true}).click();await travel.locator('.map-jump-bar button').click();await travel.clock.runFor(200);await travel.getByRole('button',{name:'Skip animation'}).click();await travel.clock.runFor(100);assert.equal(await travel.locator('.current-location strong').innerText(),'Hoth');await travel.close();
 await writeFile(`${out}/results.json`,JSON.stringify({browser:'Chromium software WebGL; not physical-device FPS',results,warpCancelAndSkip:true},null,2));
 console.log('PASS static galaxy detail and route glows, source-grid badges, idle0/600ms cinematic/balanced/mobile, responsive map and cancel/skip');
} finally {await browser.close();}

