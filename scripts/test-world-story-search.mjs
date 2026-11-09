import { newSpoilerProtectedPage } from './lib-spoiler-testing.mjs';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { expandPanel } from './lib-journey-ui.mjs';
const browser = await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
  const page = await newSpoilerProtectedPage(browser, {viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.ATLAS_URL||'http://localhost:4173')+'/#galaxy');
  await expandPanel(page);
  const stories=page.getByRole('region',{name:'Linked stories'});
  // The WorldStories reveal state lives as long as its world stays mounted, so returning to
  // a world revealed earlier in this session shows it already revealed (no Reveal button).
  const revealIfHidden=async()=>{const reveal=stories.getByRole('button',{name:'Reveal linked unwatched titles'});await stories.waitFor();if(await reveal.count())await reveal.click();};
  await stories.waitFor();
  assert.equal(await stories.getByRole('searchbox').count(),0,'hidden stories must not be searchable');
  assert.equal(await stories.locator('.world-story-evidence').count(),0,'hidden stories must not leak evidence');
  await stories.getByRole('button',{name:'Reveal linked unwatched titles'}).click();
  await stories.getByRole('searchbox').fill('A New Hope');
  assert.equal(await stories.locator('.world-story-grid a').count(),1);
  await stories.locator('.world-story-evidence summary').click();
  assert.equal(await stories.locator('.world-story-evidence li').count(),1);
  assert.match(await stories.locator('.world-story-evidence').innerText(),/Tatooine/);
  assert.match(await stories.locator('.world-story-evidence a').getAttribute('href'),/^https:\/\/www\.starwars\.com\//);
  await stories.getByLabel('Collection').selectOption('clone-wars');
  await stories.getByText('No revealed titles match these filters.',{exact:false}).waitFor();
  await stories.getByRole('button',{name:'Clear filters'}).click();
  assert.equal(await stories.getByRole('searchbox').inputValue(),'');
  assert.equal(await stories.getByLabel('Collection').inputValue(),'all');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await stories.getByRole('searchbox').fill('A New Hope');
  await stories.locator('a[href="#journey/ot-a-new-hope"]').click();
  await expandPanel(page);
  assert.equal(await page.locator('.journey-current h2').innerText(),'A New Hope');
  assert.equal(await page.locator('.journey-stop').count(),0,'world title reveal must not reveal Journey stops');
  await page.evaluate(()=>{location.hash='#galaxy/tatooine'});
  await page.waitForFunction(()=>/Tatooine/.test(document.querySelector('.world-title h2')?.textContent||'')&&location.hash==='#galaxy/tatooine');
  await expandPanel(page);
  await revealIfHidden();
  await stories.getByRole('searchbox').fill('no match');
  await page.evaluate(()=>{location.hash='#galaxy/coruscant'});
  await page.waitForFunction(()=>/Coruscant/.test(document.querySelector('.world-title h2')?.textContent||''));
  await expandPanel(page);
  await stories.getByRole('button',{name:'Reveal linked unwatched titles'}).click();
  assert.equal(await stories.getByRole('searchbox').inputValue(),'','filters reset when destination changes');
  assert.equal(await stories.getByLabel('Collection').inputValue(),'all');
  assert.deepEqual(errors,[]);
  console.log('PASS: spoiler-safe search, collection intersection, empty-state reset, mobile overflow, Journey deep link and independent reveal');
} finally {await browser.close();}
