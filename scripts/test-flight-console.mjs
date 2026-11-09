import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'http://127.0.0.1:4181';
const output=process.env.ATLAS_EVIDENCE_DIR||'work/flight-console';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const checks=[];
try {
 for(const width of [320,390,768,1440]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#galaxy/serenno');
  await page.locator('.platform-nav a').first().waitFor();
  const nav=await page.locator('.platform-nav a').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,height:r.height}}));
  assert.equal(nav.length,5);
  assert(nav.every(r=>r.left>=0&&r.right<=width&&r.height>=44),'Five visible touch-sized section controls');
  assert.equal(await page.locator('.platform-nav [aria-current=page]').count(),1);
  await page.getByRole('button',{name:'Search the atlas',exact:true}).click();
  const dialog=page.getByRole('dialog');await dialog.waitFor({state:'visible'});
  await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);
  assert.equal(await page.getByRole('button',{name:'Search the atlas',exact:true}).evaluate(e=>e===document.activeElement),true);
  if(width<721)await page.locator('.sheet-toggle').click();
  await page.waitForFunction(()=>document.querySelector('.workspace-panel [data-profile-id="serenno"] canvas')?.dataset.resolution==='1024');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Galaxy has no horizontal overflow');
  await page.screenshot({path:`${output}/galaxy-${width}.png`});
  await page.locator('.platform-nav a[href="#library"]').click();
  await page.locator('.catalog-item').first().waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Library has no horizontal overflow');
  await page.screenshot({path:`${output}/library-${width}.png`});
  assert.deepEqual(errors,[]);checks.push({width,navigation:'five visible links, >=44px',search:'Escape closes and restores focus',overflow:false,errors});
  await page.close();
 }
 await writeFile(`${output}/results.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),checks},null,2));
 console.log('PASS flight console: navigation, focus restoration, textured dossier, library, no overflow at 320/390/768/1440');
} finally {await browser.close()}
