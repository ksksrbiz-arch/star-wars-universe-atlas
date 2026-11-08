import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {ALL_WORLDS} from '../src/journeyWorlds.ts';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const dir=process.env.ATLAS_EVIDENCE_DIR||'work/bad-batch-season-two-dossiers';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try{
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [id,name]of[['pabu','Pabu'],['serenno','Serenno'],['ipsidon','Ipsidon']]){
   const mapped=ALL_WORLDS.some(world=>world.id===id);
   await page.goto(base+'/#galaxy');
   await page.getByRole('button',{name:'Search the atlas',exact:true}).click();
   await page.getByRole('combobox',{name:'World, location, movie, episode or collection'}).fill(name);
   await page.getByRole('option').filter({hasText:name}).filter({has:page.locator('.atlas-search-type',{hasText:mapped?'World':'Location'})}).first().click();
   if(mapped)await page.locator('.world-title h2').filter({hasText:name}).waitFor({state:'attached'});
   if(mapped&&width<721)await page.locator('.sheet-toggle').click();
   const context=mapped?page.locator('.workspace-panel'):page.getByRole('dialog');
   const portrait=context.locator('.portrait-featured');
   await portrait.waitFor();
   assert.equal(await portrait.count(),1);assert.match(await portrait.getByRole('img').getAttribute('aria-label'),/Original illustrative (portrait|asteroid outpost study)/);
   assert.equal(await portrait.getAttribute('data-motion'),'reduced');
   const guide=context.locator('.immersive-dossier');assert.equal(await guide.count(),1);
   assert.equal(await guide.getByRole('link',{name:'World overview source'}).getAttribute('href'),`https://www.starwars.com/databank/${id}`);
   const first=guide.locator('details').first();await first.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await first.getAttribute('open'),'');
   if(!mapped)assert.match(await context.locator('.location-placement').innerText(),/position not established/);
   assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
   assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await portrait.screenshot({path:`${dir}/${id}-${width}.png`});
   if(!mapped)await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS three Bad Batch season-two portraits/dossiers, source links, keyboard disclosures, no fabricated placement or arrival/progress,1440/390/320');
}finally{await browser.close();}
