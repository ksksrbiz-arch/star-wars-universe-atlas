import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { CONNECTIONS } from '../src/connections.ts';
import { readFile } from 'node:fs/promises';
const worldSource = await readFile('src/journeyWorlds.ts','utf8') + await readFile('src/data.ts','utf8');
const ALL_WORLDS = [...worldSource.matchAll(/(?:"id"|id):\s*['"]([^'"]+)['"]/g)].map(match=>({id:match[1]}));
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:390,height:844}});
const checks=[],errors=[];page.on('pageerror',error=>errors.push(error.message));
const open=async id=>{await page.goto(`${process.env.ATLAS_URL || 'http://localhost:4173'}/#journey/${id}`);await page.locator('.journey-current h2').waitFor();};
try {
await open('andor-s01e01');
const reveal=page.getByRole('button',{name:'Reveal locations for this title'});
await reveal.focus();assert.equal(await reveal.evaluate(el=>el===document.activeElement),true);
await page.keyboard.press('Enter');
const kenari=page.locator('.journey-stop').filter({has:page.getByRole('heading',{name:'Kenari',exact:true})});
assert.match(await kenari.locator('.journey-stop-note').innerText(),/Flashback.*many years before/);
assert.equal(await kenari.locator('a').isVisible(),true);
assert.equal(await page.locator('.journey-stop').count(),3);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.screenshot({path:'evidence/journey-accessibility-phone.png',fullPage:true});
checks.push('390px keyboard Enter reveals locations; Kenari flashback qualification and appearance source directly visible; no overflow');
await page.setViewportSize({width:1440,height:1000});
await page.screenshot({path:'evidence/journey-accessibility-desktop.png',fullPage:true});
await page.getByRole('button',{name:'Next story chapter'}).click();
assert.equal(await page.locator('.journey-stop').count(),0);
await page.getByRole('button',{name:'Previous story chapter'}).click();
assert.equal(await page.locator('.journey-stop').count(),3);
assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
checks.push('Next hides unrevealed chapter locations; previous restores explicitly revealed chapter; watched state untouched');
const unplaced=CONNECTIONS.find(c=>!ALL_WORLDS.some(w=>w.id===c.worldId));
assert.ok(unplaced,'At least one sourced location remains unplaced');
await open(unplaced.itemId);
const gate=page.getByRole('button',{name:'Reveal locations for this title'});if(await gate.count())await gate.click();
const unavailable=page.getByRole('button',{name:`${unplaced.worldName}: map unavailable`,exact:true});
assert.equal(await unavailable.isDisabled(),true);assert.equal(await unavailable.isVisible(),true);
checks.push(`Unplaced ${unplaced.worldName} remains visible with disabled Map unavailable button`);
for(const [id,expected] of [['andor-s02e12','Rogue One'],['mandalorian-s02e08','The Book of Boba Fett'],['clone-wars-s07e11','Revenge of the Sith']]){
await open(id);assert.match(await page.locator('.journey-bridges').innerText(),new RegExp(expected));
assert.match(await page.locator('.journey-bridges').innerText(),/OUTSIDE THIS COLLECTION/);
}
checks.push('Andor finale, Mando S2E8, CW S7E11 display referenced external bridges or overlap, clearly outside collection');
assert.deepEqual(errors,[]);
await writeFile('evidence/journey-accessibility-results.json',JSON.stringify({checks,errors,browser:await browser.version()},null,2));console.log(JSON.stringify({checks,errors},null,2));
}finally{await browser.close();}
