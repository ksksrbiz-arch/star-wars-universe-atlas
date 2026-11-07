import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.addInitScript(()=>localStorage.setItem('galactic-atlas.watch.v1',JSON.stringify({version:1,watchedIds:['ot-a-new-hope']})));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.ATLAS_URL||'http://localhost:4173'}/#galaxy`);
 await page.locator('#world-directory>summary').click();
 const directory=page.getByRole('region',{name:'World directory',exact:true});
 const cards=directory.locator('.directory-world-card');
 assert.equal(await cards.count(),12);assert.equal(await directory.locator('.directory-thumbnail').count(),12);
 await directory.getByLabel('Terrain',{exact:true}).selectOption('ice');
 assert.equal(await cards.count(),1);assert.match(await cards.innerText(),/Hoth/);
 await directory.getByLabel('Watch progress').selectOption('watched');assert.equal(await cards.count(),0,'terrain/watch intersection');
 await directory.getByRole('button',{name:'Clear directory filters'}).click();
 await directory.getByLabel('Watch progress').selectOption('watched');assert.equal(await cards.count(),3,'only A New Hope watched worlds');
 await directory.getByLabel('Find a world').fill('Tatooine');
 assert.match(await cards.innerText(),/1 title/);assert.equal(await cards.getByRole('link',{name:'Terrain source for Tatooine'}).count(),1);
 await directory.getByLabel('Region',{exact:true}).selectOption('Core Worlds');assert.equal(await cards.count(),0);
 await directory.getByRole('button',{name:'Clear directory filters'}).click();
 await directory.getByLabel('Map placement').selectOption('unmapped');
 assert.ok(await cards.count()>0);assert.equal(await cards.locator('.directory-map-action').count(),0);
 assert.ok((await cards.locator('.directory-card-facts').allInnerTexts()).every(text=>text.includes('Not reviewed')));
 assert.ok((await cards.locator('.directory-art-caption').allInnerTexts()).every(text=>text.includes('No map position')));
 await directory.getByLabel('Linked collection').selectOption('ahsoka');assert.equal(await cards.count(),0,'hidden Ahsoka links must not filter as revealed');
 await directory.getByRole('button',{name:'Include unwatched collection links'}).click();assert.ok(await cards.count()>0);
 assert.ok((await cards.locator('.directory-card-facts').allInnerTexts()).every(text=>text.includes('0 titles')),'revealing collections never changes watched counts');
 await directory.getByLabel('Terrain',{exact:true}).focus();await page.keyboard.press('Home');await page.keyboard.press('Tab');assert.equal(await directory.getByLabel('Watch progress').evaluate(el=>el===document.activeElement),true);
 for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 assert.deepEqual(errors,[]);console.log('PASS visual directory thumbnails, reviewed terrain, region/watch intersection, hidden collection boundary, unmapped restrictions, watched counts, keyboard and mobile');
} finally {await browser.close();}
