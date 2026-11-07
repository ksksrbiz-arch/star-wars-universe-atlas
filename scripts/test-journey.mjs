import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({args:['--enable-unsafe-swiftshader']});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));const checks=[];
try {
await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#journey/ot-empire-strikes-back");
await page.locator('.journey-current h2').waitFor();
assert.equal(await page.locator('.journey-current h2').innerText(),'The Empire Strikes Back');
assert.equal(await page.locator('.journey-stop').count(),0);
await page.getByRole('button',{name:'Reveal locations for this title'}).click();
await page.getByRole('button',{name:'Show Hoth on map',exact:true}).click();
assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();
await page.getByRole('button',{name:'Skip animation'}).click();
await page.waitForFunction(()=>document.querySelector('.current-location strong')?.textContent==='Hoth');
checks.push('Direct title route selects collection; unwatched stops hidden; reveal previews and warp reaches Hoth');
await page.getByRole('button',{name:'Next story chapter'}).click();
assert.equal(await page.locator('.journey-current h2').innerText(),'Return of the Jedi');
assert.equal(await page.locator('.journey-stop').count(),0);
assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
checks.push('Next chapter follows narrative sequence and preserves spoiler boundary without marking watched');
await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#journey/andor-s01e01");
assert.match(await page.locator('.journey-current h2').innerText(),/Kassa/);
await page.getByRole('button',{name:'Reveal locations for this title'}).click();
await page.getByRole('button',{name:'Show Ferrix on map',exact:true}).click();
await page.getByRole('button',{name:'Jump to Ferrix',exact:true}).first().click();
await page.waitForFunction(()=>document.querySelector('.current-location strong')?.textContent==='Ferrix');
checks.push('Andor deep link reaches newly charted Ferrix with complete animated arrival');
await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#library");
await page.locator('.collection-tabs').getByRole('button',{name:/The Clone Wars/}).click();
await page.getByRole('combobox',{name:'Sort order'}).selectOption('story');
assert.equal(await page.locator('.catalog-item h2').first().innerText(),'Cat and Mouse');
assert.equal(await page.locator('.catalog-item h2').nth(1).innerText(),'Hidden Enemy');
assert.match(await page.locator('.catalog-item h2').nth(2).innerText(),/Clone Wars/);
await page.locator('.catalog-details summary').first().click();
await page.locator('.follow-story-link').first().click();
assert.equal(await page.locator('.journey-current h2').innerText(),'Cat and Mouse');
checks.push('Official CW story order and per-title Library→Journey links');
await page.screenshot({path:'evidence/journey-desktop.png',fullPage:true});
for (const width of [390,320]) {
 await page.setViewportSize({width,height:844});
 await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#journey/ot-empire-strikes-back");
 await page.locator('.journey-current h2').waitFor();
 const reveal = page.getByRole('button',{name:'Reveal locations for this title'}); if (await reveal.count()) await reveal.click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.equal(await page.getByRole('heading',{level:1}).count(),1);
 await page.screenshot({path:`evidence/journey-${width}.png`,fullPage:true});
}
checks.push('Journey fits390/320px with one visible page heading');
assert.deepEqual(errors,[]);checks.push('No browser errors across new map markers and section switches');
await writeFile('evidence/journey-results.json',JSON.stringify({checks,errors,browser:await browser.version()},null,2));console.log(JSON.stringify({checks,errors},null,2));
} finally {await browser.close();}

