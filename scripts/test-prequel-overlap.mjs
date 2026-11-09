import { newSpoilerProtectedPage } from './lib-spoiler-testing.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try{
 for(const width of[1440,390,320]){
  const page=await newSpoilerProtectedPage(browser, {viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto(base+'/#journey/clone-wars-s07e11');
  if(width<721)await page.locator('.sheet-toggle').click();
  const connections=page.locator('.journey-bridges');
  assert.match(await connections.innerText(),/PARALLEL STORY/);
  assert.match(await connections.innerText(),/not an official scene-interleaving/);
  assert.equal(await page.locator('.journey-stop').count(),0);
  await connections.locator('a[href="#journey/pt-revenge-of-the-sith"]').click();
  await page.waitForURL('**/#journey/pt-revenge-of-the-sith');
  await page.getByRole('button',{name:'Reveal locations for this title'}).waitFor();
  assert.equal(await page.locator('.journey-stop').count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
  assert.match(await connections.innerText(),/PARALLEL STORY/);
  for(const n of[9,10,11,12])assert.equal(await connections.locator(`a[href="#journey/clone-wars-s07e${String(n).padStart(2,'0')}"]`).count(),1,'Film exposes linked overlapping chapters');
  await connections.locator('a[href="#journey/clone-wars-s07e11"]').click();
  await page.waitForURL('**/#journey/clone-wars-s07e11');
  await page.getByRole('button',{name:'Reveal locations for this title'}).waitFor();
  assert.equal(await page.locator('.journey-stop').count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
  assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.close();
 }
 console.log('PASS CloneWars finalarc ↔ RevengeSith overlap links preserve reveal/watch/map state at1440/390/320; no scene-interleaving claim');
}finally{await browser.close();}
