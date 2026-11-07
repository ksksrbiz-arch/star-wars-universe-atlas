import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:320,height:844}});
const checks=[];
await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#library");
await page.locator('.catalog-item').first().waitFor();
assert.equal(await page.getByRole('heading',{level:1}).count(),1);checks.push('One exposed page heading; hidden galaxy heading excluded');
const search=page.getByRole('textbox',{name:'Search films and episodes'});
await search.focus();await page.keyboard.type('Empire Strikes');
assert.equal(await page.locator('.catalog-item').count(),1);
const summary=page.locator('.catalog-details summary').first();await summary.focus();await page.keyboard.press('Enter');
assert.equal(await page.locator('.catalog-details').first().getAttribute('open'),'');
assert.match(await page.locator('.catalog-details').innerText(),/Premiere versus theatrical release/);
await page.keyboard.press('Tab');assert.equal(await page.locator('.catalog-details a').first().evaluate(el=>el===document.activeElement),true);
checks.push('Keyboard opens details and reaches source; film release caveat visible');
await search.focus();await page.keyboard.press('Control+A');await page.keyboard.type('nonexistentzzz');
await page.getByRole('heading',{name:'No stories in this selection.'}).waitFor();
await page.getByRole('button',{name:'Reset filters',exact:true}).focus();await page.keyboard.press('Enter');
assert.equal(await search.inputValue(),'');assert.equal(await page.locator('.catalog-item').count(),24);
checks.push('Keyboard empty-state recovery clears filters');
assert.match(await page.getByRole('status').last().innerText(),/24 of 185/);
await page.locator('.collection-tabs').getByRole('button',{name:/The Clone Wars/}).focus();await page.keyboard.press('Enter');
assert.match(await page.locator('.library-results-heading').innerText(),/134/);
assert.equal(await page.getByRole('option',{name:/Story order/}).isDisabled(),false);
await page.getByRole('combobox',{name:'Sort order'}).selectOption('story');
assert.match(await page.locator('.catalog-item h2').first().innerText(),/Cat and Mouse/);
checks.push('Collection filters keyboard operable; documented story ordering available for selected collection');
const watched=page.locator('.watched-button').first();const box=await watched.boundingBox();assert.ok(box.width>=44&&box.height>=44);
const summaryBox=await page.locator('.catalog-details summary').first().boundingBox();assert.ok(summaryBox.height>=44);
checks.push('Mobile watch toggle and record disclosure targets at least44px high; watch44px wide');
for(const route of ['library','timeline','watch']){
 await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#"+route);await page.locator('.library-view').waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' overflow');
 assert.equal(await page.getByRole('heading',{level:1}).count(),1);
 await page.screenshot({path:'evidence/a11y-'+route+'-320.png'});
}
checks.push('Library, timeline and watch fit320px with one visible h1');
await writeFile('evidence/library-a11y-results.json',JSON.stringify({checks,limitations:['Not a full WCAG audit; automated checks plus screenshot review.'],browser:await browser.version()},null,2));
console.log(JSON.stringify(checks,null,2));await browser.close();


