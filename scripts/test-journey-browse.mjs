import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const CATALOG=JSON.parse(await readFile(new URL('../src/catalog.generated.json',import.meta.url),'utf8')).items;
import { CONNECTIONS } from '../src/connections.ts';
const browser = await chromium.launch({args:['--enable-unsafe-swiftshader']});
const checks=[];
try {
 const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.ATLAS_URL || 'http://localhost:4173'}/#journey/andor-s01e01`);
 await page.locator('.story-chapter-picker summary').click();
 const search=page.getByRole('searchbox',{name:'Find a chapter'});
 for(const code of ['S01E02','s1e2','S01 E002','season 1 episode 2']) {
  await search.fill(code);
  assert.equal(await page.locator('.journey-search-results button').count(),1);
  assert.match(await page.locator('.journey-search-results').innerText(),/That Would Be Me/);
 }
 checks.push('Padded, unpadded, spaced and long episode codes match the same chapter');
 await page.locator('.journey-search-results button').click();
 assert.equal(await page.locator('.journey-current h2').innerText(),'That Would Be Me');
 assert.equal(await page.locator('.journey-stop').count(),0);
 await page.getByLabel('Location research',{exact:true}).selectOption('linked');
 assert.match(await page.locator('.journey-search-results').innerText(),/Sourced location links/);
 assert.equal(await page.locator('.journey-stop').count(),0);
 await page.getByRole('button',{name:/Show more chapters/}).click();
 assert.ok(await page.locator('.journey-search-results button').count()>7);
 checks.push('Research filter and progressive browsing preserve location reveal boundary');
 await page.getByRole('button',{name:'Reveal locations for this title'}).click();
 assert.match(await page.locator('.journey-map-coverage').innerText(),/mapped locations?.*without a map placement/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
 checks.push('Mapped/unmapped explanation is revealed without changing watch progress');
 const linked=new Set(CONNECTIONS.map(c=>c.itemId));
 const unreviewed=CATALOG.find(item=>item.seriesId==='clone-wars'&&!linked.has(item.id));
 if(unreviewed) {
  await page.goto(`${process.env.ATLAS_URL || 'http://localhost:4173'}/#journey/${unreviewed.id}`);
  if(await page.locator('.story-chapter-picker').getAttribute('open')===null)await page.locator('.story-chapter-picker summary').click();
  await page.getByLabel('Location research',{exact:true}).selectOption('unreviewed');
  assert.match(await page.locator('.journey-search-results').innerText(),/Locations not yet linked/);
  assert.equal(await page.locator('.journey-stop').count(),0);
 }
 for(const width of [390,320]) {await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 checks.push('Unreviewed titles remain explicit; 390px and 320px layouts do not overflow');
 assert.deepEqual(errors,[]);console.log(JSON.stringify({checks,errors},null,2));
} finally {await browser.close();}
