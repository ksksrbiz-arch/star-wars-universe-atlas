import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { expandPanel, openChapterPicker } from './lib-journey-ui.mjs';
const base = process.env.ATLAS_URL || 'http://localhost:4173';
const browser = await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[]; page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${base}/#journey/ot-a-new-hope`);
 await page.evaluate(()=>localStorage.removeItem('galactic-atlas.watch.v1'));
 await page.reload();
 await expandPanel(page);
 await page.getByRole('button',{name:'Mark watched & continue',exact:true}).waitFor();
 const initialTitle=await page.locator('.journey-current h2').innerText();
 await page.getByRole('button',{name:'Mark watched & continue',exact:true}).click();
 assert.equal(await page.locator('.journey-current h2').innerText(),'The Empire Strikes Back');
 assert.equal(await page.locator('.journey-stop').count(),0);
 let progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('galactic-atlas.watch.v1')));
 assert.equal(progress.watchedIds.length,1);
 await page.getByRole('button',{name:'Next story chapter',exact:true}).click();
 await openChapterPicker(page);
 await page.getByRole('button',{name:'Resume',exact:true}).click();
 assert.equal(await page.locator('.journey-current h2').innerText(),'The Empire Strikes Back');
 assert.equal(await page.locator('.journey-stop').count(),0);
 await page.getByRole('button',{name:'Mark watched & continue',exact:true}).click();
 await page.getByRole('button',{name:'Mark final chapter watched',exact:true}).click();
 await openChapterPicker(page);
 assert.match(await page.locator('.journey-resume').innerText(),/Every chapter watched/);
 await page.getByRole('button',{name:'Mark unwatched',exact:true}).click();
 assert.equal(await page.locator('.journey-stop').count(),0);
 progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('galactic-atlas.watch.v1')));
 assert.equal(progress.watchedIds.length,2);
 for (const width of [320,390,1440]) {
  await page.setViewportSize({width,height:900});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({checks:['Mark and advance persists progress','Next unwatched keeps locations hidden','Resume selects first unwatched in collection order','Completion and mark-unwatched work','320/390/1440 layout fits'],initialTitle,errors},null,2));
} finally { await browser.close(); }
