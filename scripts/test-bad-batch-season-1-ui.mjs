import {STORY_SEQUENCES} from '../src/chronology.ts';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { CONNECTIONS } from '../src/connections.ts';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {for(const width of [1440,390,320]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const expand=async()=>{if(width<721&&await page.locator('.sheet-toggle').getAttribute('aria-expanded')==='false')await page.locator('.sheet-toggle').click();};
 await page.goto(base+'/#galaxy');await page.getByRole('button',{name:'Search the atlas',exact:true}).click();
 const search=page.getByRole('combobox',{name:'World, location, movie, episode or collection'});await search.fill('Bad Batch S01E01');
 assert.equal(await page.getByRole('dialog').getByRole('option').count(),1);await search.press('Enter');await page.waitForURL('**/#journey/bad-batch-s01e01');await expand();
 await page.waitForFunction(()=>document.querySelector('.journey-current h2')?.textContent==='Aftermath');
 assert.equal(await page.locator('.journey-stop').count(),0);assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
 assert.deepEqual((await page.locator('.journey-collection-number').allTextContents()).map(x=>x.trim()),Array.from({length:STORY_SEQUENCES.length},(_,i)=>String(i+1).padStart(2,'0')));
 await page.getByRole('button',{name:'Reveal locations for this title',exact:true}).click();const links=CONNECTIONS.filter(x=>x.itemId==='bad-batch-s01e01');assert(links.length>0);assert.equal(await page.locator('.journey-stop').count(),links.length);
 assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
 await page.getByRole('button',{name:'Mark watched & continue',exact:true}).click();await page.waitForURL('**/#journey/bad-batch-s01e02');
 await page.waitForFunction(()=>document.querySelector('.journey-current h2')?.textContent==='Cut and Run');assert.equal(await page.locator('.journey-stop').count(),0);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('galactic-atlas.watch.v1')).watchedIds),['bad-batch-s01e01']);
 await page.goto(base+'/#journey/bad-batch-s01e16');await expand();await page.waitForFunction(()=>document.querySelector('.journey-current h2')?.textContent==='Kamino Lost');assert.equal(await page.getByRole('button',{name:'Next story chapter',exact:true}).isDisabled(),false);await page.getByRole('button',{name:'Next story chapter',exact:true}).click();await page.waitForURL('**/#journey/bad-batch-s02e01');
 await page.getByRole('link',{name:'Library',exact:true}).click();await page.locator('.collection-tabs').getByRole('button',{name:/Bad Batch/}).click();
 await page.getByLabel('Search films and episodes').fill('S01E16');assert.equal(await page.locator('.catalog-item').count(),1);assert.match(await page.locator('.catalog-item h2').innerText(),/Kamino Lost/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await page.close();
}console.log('PASS Bad Batch search, collection numbering, episode progression/finale, source reveal, stable progress and library at1440/390/320');}finally{await browser.close();}
