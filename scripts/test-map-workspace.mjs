import { newSpoilerProtectedPage } from './lib-spoiler-testing.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const base=process.env.ATLAS_URL||'http://localhost:4173';const results=[];const evidenceDir=process.env.ATLAS_EVIDENCE_DIR||'evidence/map-workspace';
await mkdir(evidenceDir,{recursive:true});
try{
 for(const width of[1440,390,320]){
  const page=await newSpoilerProtectedPage(browser, {viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of['galaxy','journey/andor-s01e01']){
   await page.goto(base+'/#'+route);await page.locator('.galaxy-canvas canvas').waitFor();const map=page.locator('.map-stage');const top=(await map.boundingBox()).y;assert(top<250,`${route} ${width}px map top ${top}`);assert.equal(await page.locator('.galaxy-canvas canvas').count(),1);
   assert.equal(await page.locator('.workspace-settings').getAttribute('open'),null);
   if(width<721){assert.equal(await page.locator('.sheet-toggle').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('.workspace-panel-content').isVisible(),false);await page.locator('.sheet-toggle').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.workspace-panel-content').isVisible(),true);await page.locator('.sheet-toggle').click();assert.equal(await page.locator('.workspace-panel-content').isVisible(),false);}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:`${evidenceDir}/${route.startsWith('journey')?'journey':'galaxy'}-${width}.png`});results.push({width,route,mapTop:top});
  }
  if(width<721)await page.locator('.sheet-toggle').click();assert.match(await page.locator('.journey-current h2').innerText(),/Kassa/);assert.equal(await page.locator('.journey-stop').count(),0);
  await page.getByRole('button',{name:'Reveal locations for this title'}).click();assert.equal(await page.locator('.journey-stop').count(),3);await page.getByRole('button',{name:'Show Ferrix on map',exact:true}).click();assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine','Preview is not arrival');
  await page.locator('.map-jump-bar').getByRole('button',{name:'Jump to Ferrix',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.current-location strong')?.textContent==='Ferrix');
  if(width<721&&await page.locator('.sheet-toggle').getAttribute('aria-expanded')==='false')await page.locator('.sheet-toggle').click();
  await page.getByRole('group',{name:'Exploration panel views'}).getByRole('button',{name:'Destination',exact:true}).click();await page.getByRole('group',{name:'Exploration panel views'}).getByRole('button',{name:'Story',exact:true}).click();assert.equal(await page.locator('.journey-stop').count(),3);
  await page.getByRole('button',{name:'Next story chapter'}).click();assert.equal(await page.locator('.journey-stop').count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
  await page.locator('.workspace-settings>summary').click();await page.getByLabel('Find a mapped world').selectOption('hoth');assert.equal(await page.getByLabel('Find a mapped world').inputValue(),'hoth');assert.equal(await page.locator('.workspace-settings').getAttribute('open'),null);assert.equal(await page.locator('.map-stage').evaluate(e=>e===document.activeElement),true);assert.equal(await page.locator('.current-location strong').innerText(),'Ferrix');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await page.close();
 }
 await writeFile(`${evidenceDir}/results.json`,JSON.stringify(results,null,2));console.log('PASS map-first Galaxy/Andor top<250, mobile keyboard expansion, reveal/preview/arrival boundaries, tab preservation, next chapter spoiler gate, settings finder, watch unchanged at1440/390/320');
}finally{await browser.close();}
