import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const out=process.env.ATLAS_EVIDENCE_DIR||'evidence/rebels-visuals';await mkdir(out,{recursive:true});
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const results=[];
try{
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__draws=0;for(const C of [window.WebGLRenderingContext,window.WebGL2RenderingContext])if(C)for(const key of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced'])if(Object.hasOwn(C.prototype,key)){const fn=C.prototype[key];C.prototype[key]=function(...args){window.__draws++;return fn.apply(this,args)};}});
  await page.goto(base+'/#journey/andor-s01e01');await page.getByRole('button',{name:'Explore Tatooine',exact:true}).waitFor();
  const key=page.getByRole('complementary',{name:'Map symbols'});assert.equal(await key.getAttribute('data-story-count'),'0');assert.equal(await key.getByText(/story marker/).count(),0);
  if(width<721)await page.locator('.sheet-toggle').click();
  await page.getByRole('button',{name:'Reveal locations for this title'}).click();await page.getByRole('button',{name:'Fit episode locations'}).click();
  await page.waitForTimeout(400);const count=await page.locator('[data-episode-location]').count();assert.equal(count,2);assert.equal(await key.getAttribute('data-story-count'),String(count));assert.match(await key.innerText(),/Appearances, not a route/);
  await page.getByRole('button',{name:'Show Ferrix on map',exact:true}).click();assert.match(await key.innerText(),/Preview only/);assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
  await page.getByRole('button',{name:'Reset map view',exact:true}).click();await page.waitForTimeout(1700);const before=await page.evaluate(()=>window.__draws);await page.waitForTimeout(600);const draws=await page.evaluate(()=>window.__draws)-before;assert.equal(draws,0);
  const a=await key.boundingBox();for(const control of await page.locator('.map-tools button,.map-pan-controls button').all()){const b=await control.boundingBox();assert(!(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y),'Legend must not overlap camera controls');}
  for(const name of ['Ferrix','Tatooine']){const label=await page.getByRole('button',{name:`Explore ${name}`,exact:true}).boundingBox();for(const control of await page.locator('.map-tools button,.map-pan-controls button').all()){const b=await control.boundingBox();assert(!(label.x<b.x+b.width&&label.x+label.width>b.x&&label.y<b.y+b.height&&label.y+label.height>b.y),`${name} label clears camera controls`);}}
  await page.locator('.map-stage').screenshot({path:`${out}/story-focus-${width}.png`});
  assert.equal(await page.locator('.galaxy-canvas canvas').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
  if(width<721)await page.locator('.sheet-toggle').click();await page.getByRole('button',{name:'Next story chapter'}).click();assert.equal(await key.getAttribute('data-story-count'),'0');assert.equal(await page.locator('[data-episode-location]').count(),0);
  await page.goto(base+'/#galaxy/lothal');await page.getByRole('button',{name:'Explore Lothal',exact:true}).waitFor();await page.waitForTimeout(500);
  const lothal=page.getByRole('button',{name:'Explore Lothal',exact:true});const lb=await lothal.boundingBox(),cb=await page.locator('.galaxy-canvas canvas').boundingBox();assert(lb.x>=cb.x&&lb.x+lb.width<=cb.x+cb.width+1,'Lothal edge label stays within canvas');
  for(const control of await page.locator('.map-tools button,.map-pan-controls button').all()){const b=await control.boundingBox();assert(!(lb.x<b.x+b.width&&lb.x+lb.width>b.x&&lb.y<b.y+b.height&&lb.y+lb.height>b.y),'Lothal preview clears camera controls');}
  await page.locator('.map-jump-bar button').click();await page.waitForFunction(()=>document.querySelector('.current-location strong')?.textContent==='Lothal');assert.equal(await lothal.getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);results.push({width,storyCount:count,settledDrawsOver600ms:draws,controlsClear:true,disclosurePreserved:true});await page.close();
 }
 await writeFile(`${out}/results.json`,JSON.stringify({browser:'Chromium software WebGL; not physical-device FPS',results},null,2));console.log('PASS fixed-screen story focus/key at1440/390/320, explicit disclosure/reset, preview separate from arrival, idle0/600ms, camera controls clear and no watch mutation');
}finally{await browser.close();}
