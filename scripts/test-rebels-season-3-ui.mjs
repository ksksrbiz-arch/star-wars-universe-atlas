import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { CONNECTIONS } from '../src/connections.ts';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 for(const width of [1440,390,320]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const expand=async()=>{if(width<721&&await page.locator('.sheet-toggle').getAttribute('aria-expanded')==='false')await page.locator('.sheet-toggle').click();};
  await page.goto(base+'/#journey/rebels-s02e21');await expand();
  await page.getByRole('button',{name:'Next story chapter',exact:true}).click();await page.waitForURL('**/#journey/rebels-s03e01');
  assert.match(await page.locator('.journey-item-meta').innerText(),/SEASON 3 · EPISODES 1–2/);
  assert.equal(await page.locator('.journey-stop').count(),0);
  if(await page.locator('.story-chapter-picker').getAttribute('open')===null)await page.locator('.story-chapter-picker summary').click();
  await page.getByLabel('Season',{exact:true}).selectOption('3');
  assert.match(await page.locator('.journey-search-count').innerText(),/^19 matching chapters/);
  for(const [code,id,range] of [['S03E02','rebels-s03e01','S03E01–02'],['S03E13','rebels-s03e12','S03E12–13'],['S03E22','rebels-s03e21','S03E21–22']]) {
   await page.getByRole('button',{name:'Search the atlas',exact:true}).click();
   const search=page.getByRole('combobox',{name:'World, location, movie, episode or collection'});await search.fill('Rebels '+code);
   const option=page.getByRole('dialog').getByRole('option');assert.equal(await option.count(),1);assert((await option.innerText()).includes(range));
   await search.press('Enter');await page.waitForURL('**/#journey/'+id);await expand();
   await page.waitForFunction(expected=>document.querySelector('.journey-item-meta')?.textContent?.endsWith('EPISODES '+expected),range.replace(/^S03E/,'').replace(/0(?=\d)/g,''));
   assert.equal(await page.locator('.journey-stop').count(),0);
  }
  assert.equal(await page.getByRole('button',{name:'Next story chapter',exact:true}).isDisabled(),false);
  await page.getByRole('button',{name:'Next story chapter',exact:true}).click();
  await page.waitForURL('**/#journey/rebels-s04e01');
  await page.goto(base+'/#journey/rebels-s03e12');await expand();
  await page.getByRole('button',{name:'Reveal locations for this title',exact:true}).click();
  const ghostLinks=CONNECTIONS.filter(row=>row.itemId==='rebels-s03e12');
  assert(ghostLinks.length>0,'Ghosts of Geonosis needs reviewed location evidence');
  assert.equal(await page.locator('.journey-stop').count(),ghostLinks.length);
  assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
  await page.getByRole('button',{name:'Mark watched & continue',exact:true}).click();await page.waitForURL('**/#journey/rebels-s03e14');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('galactic-atlas.watch.v1')).watchedIds),['rebels-s03e12']);
  assert.equal(await page.locator('.journey-stop').count(),0);
  await page.getByRole('link',{name:'Library',exact:true}).click();
  await page.locator('.collection-tabs').getByRole('button',{name:/Rebels/}).click();
  await page.getByLabel('Search films and episodes').fill('S03E13');
  assert.equal(await page.locator('.catalog-item').count(),1);assert.match(await page.locator('.catalog-kicker').innerText(),/E12–13/);
  assert.match(await page.locator('.catalog-item h2').innerText(),/Ghosts of Geonosis/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS Rebels S2-to-S3 continuity, all three combined-story aliases, season filter, single combined progress record, reveal gates and library lookup at1440/390/320');
} finally {await browser.close();}
