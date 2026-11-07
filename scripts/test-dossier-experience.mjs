import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {WORLD_DOSSIERS} from '../src/worldDossiers.ts';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const base=process.env.ATLAS_URL||'http://localhost:4173';
try {
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [id,dossier] of Object.entries(WORLD_DOSSIERS)){
   await page.goto(base+'/#galaxy/'+id);const guide=page.locator('.immersive-dossier');await guide.waitFor();
   assert.equal(await page.locator('.immersive-dossier').count(),1);assert.match(await guide.getAttribute('aria-label'),new RegExp(id,'i'));
   assert.equal(await guide.getByRole('link',{name:'World overview source'}).getAttribute('href'),dossier.overview.sourceUrl);
   assert.equal(await guide.getByRole('link',{name:'Landscape source'}).getAttribute('href'),dossier.terrain.sourceUrl);
   assert.equal(await guide.locator('.field-caveat').innerText(),dossier.caveat);
   for(const place of dossier.highlights){const disclosure=guide.locator('details').filter({has:page.locator('summary',{hasText:place.name})});assert.equal(await disclosure.getAttribute('open'),null);await disclosure.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await disclosure.getByRole('link',{name:`Read ${place.name} source`}).getAttribute('href'),place.sourceUrl);await page.keyboard.press('Enter');}
   assert.equal(await page.locator('.atlas-portrait svg').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
   assert.equal(await page.locator('.world-story-grid a').count(),0,'Broad dossier must not reveal episode links');
   const explorerHeight=await page.locator('.explorer').evaluate(e=>e.getBoundingClientRect().height);
   if(width===1440)assert.ok(explorerHeight<1700,'Field guide must not stretch canvas with full article length');
  }
  await page.goto(base+'/#galaxy/alderaan');await page.locator('.world-title h2').waitFor();assert.equal(await page.locator('.immersive-dossier').count(),0,'Other worlds must not inherit previous dossier');assert.deepEqual(errors,[]);await page.close();
 }
 console.log(`PASS${Object.keys(WORLD_DOSSIERS).length}world dossiers source links,keyboard disclosures,era/caveat text,original portraits,unfeatured fallback,no spoilers/progress mutations,1440/390/320 layout`);
}finally{await browser.close();}
