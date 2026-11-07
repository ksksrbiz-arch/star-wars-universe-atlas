import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const base=process.env.ATLAS_URL||'http://localhost:4173';
try {
 for(const width of [1440,390,320]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#galaxy');await page.getByRole('button',{name:'Browse worlds',exact:true}).click();
  const directory=page.getByRole('region',{name:'World directory',exact:true});
  assert.equal(await page.locator('#world-directory').getAttribute('open'),'');assert.equal(await page.locator('#world-directory>summary').evaluate(e=>e===document.activeElement),true);assert.equal(new URL(page.url()).hash,'#galaxy');
  assert.equal(await directory.locator('.directory-thumbnail').count(),12);
  await directory.getByLabel('Terrain',{exact:true}).selectOption('ice');assert.equal(await directory.locator('.directory-grid h3').allTextContents().then(x=>x.join()),'Hoth');
  assert.equal(await directory.getByRole('link',{name:'Terrain source for Hoth'}).getAttribute('href'),'https://www.starwars.com/databank/hoth');
  await directory.getByLabel('Watch progress').selectOption('watched');assert.equal(await directory.locator('.directory-grid article').count(),0,'No unwatched associations revealed through watched filter');
  await directory.getByRole('button',{name:'Clear directory filters'}).click();
  await directory.getByLabel('Region',{exact:true}).selectOption('unknown');assert.ok(await directory.locator('.directory-grid article').count()>0);assert.equal(await directory.locator('.directory-map-action').count(),0);
  await directory.getByRole('button',{name:'Clear directory filters'}).click();await directory.getByLabel('Find a world').fill('Narkina');assert.match(await directory.locator('.directory-card-art').innerText(),/No map position · no surface illustration/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS directory hero discovery/focus/hash, original thumbnails, reviewed terrain source, region and watched filters, unmapped honesty, no watch mutation,1440/390/320');
}finally{await browser.close();}
