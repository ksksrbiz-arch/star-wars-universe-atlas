import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = process.env.ATLAS_URL || 'http://localhost:4175';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
try {
 for (const width of [1440,390,320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#journey/rebels-s01e15');
  const expand=async()=>{if(width<721 && await page.locator('.sheet-toggle').getAttribute('aria-expanded')==='false')await page.locator('.sheet-toggle').click();};
  await expand();
  await page.getByRole('button',{name:'Next story chapter',exact:true}).click();
  await page.waitForURL('**/#journey/rebels-s02e01');
  assert.match(await page.locator('.journey-item-meta').innerText(),/SEASON 2 · EPISODES 1–2/);
  assert.equal(await page.locator('.journey-stop').count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
  if(await page.locator('.story-chapter-picker').getAttribute('open')===null) await page.locator('.story-chapter-picker summary').click();
  await page.getByLabel('Season',{exact:true}).selectOption('2');
  assert.match(await page.locator('.journey-search-count').innerText(),/^20 matching chapters/);
  await page.getByLabel('Find a chapter',{exact:true}).fill('S02E22');
  assert.match(await page.locator('.journey-search-count').innerText(),/^1 matching chapter/);
  await page.locator('.journey-search-results').getByRole('button',{name:/Twilight of the Apprentice/}).click();
  await page.waitForURL('**/#journey/rebels-s02e21');
  assert.match(await page.locator('.journey-item-meta').innerText(),/EPISODES 21–22/);
  assert.equal(await page.getByRole('button',{name:'Next story chapter',exact:true}).isDisabled(),false);
  await page.getByRole('button',{name:'Next story chapter',exact:true}).click();
  await page.waitForURL('**/#journey/rebels-s03e01');
  await page.getByRole('button',{name:'Search the atlas',exact:true}).click();
  const search=page.getByRole('combobox',{name:'World, location, movie, episode or collection'});
  await search.fill('Rebels S02E02');
  assert.equal(await page.getByRole('dialog').getByRole('option').count(),1);
  assert.match(await page.getByRole('dialog').getByRole('option').innerText(),/S02E01–02/);
  await search.press('Enter'); await page.waitForURL('**/#journey/rebels-s02e01'); await expand();
  await page.getByRole('button',{name:'Mark watched & continue',exact:true}).click();
  await page.waitForURL('**/#journey/rebels-s02e03');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('galactic-atlas.watch.v1')).watchedIds),['rebels-s02e01']);
  assert.equal(await page.locator('.journey-stop').count(),0);
  // Season selection is scoped to its collection, never hiding another series' chapters.
  await page.goto(base+'/#journey/clone-wars-s01e01');await expand();
  if(await page.locator('.story-chapter-picker').getAttribute('open')===null) await page.locator('.story-chapter-picker summary').click();
  assert.equal(await page.getByLabel('Season',{exact:true}).inputValue(),'all');
  await page.getByLabel('Season',{exact:true}).selectOption('films');
  assert.match(await page.locator('.journey-search-count').innerText(),/^1 matching chapter/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS Rebels S1-to-S2 continuity, both combined-story aliases, season filtering, scoped film filter, stable progress and hidden locations at1440/390/320');
} finally {await browser.close();}
