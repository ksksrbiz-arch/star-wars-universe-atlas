import { expandPanel } from './lib-journey-ui.mjs';
import { newSpoilerProtectedPage } from './lib-spoiler-testing.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const base=process.env.ATLAS_URL||'http://localhost:4173';
try {
 const page=await newSpoilerProtectedPage(browser, {viewport:{width:390,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#galaxy/ferrix');const stories=page.locator('.world-stories-panel .world-stories');
 await expandPanel(page);
 assert.equal(await stories.locator('.related-worlds').count(),0,'hidden titles must not expose their worlds');
 await stories.getByRole('button',{name:'Reveal linked unwatched titles'}).click();await stories.getByRole('searchbox').fill('S01E01');
 const related=stories.locator('.related-worlds');assert.equal(await related.count(),1);assert.equal(await related.locator('li').count(),0,'title reveal does not expose other worlds');
 await related.locator('summary').focus();await page.keyboard.press('Enter');await related.getByRole('link',{name:'Preview Kenari on map'}).waitFor();
 assert.equal(await related.getByRole('link',{name:/Preview Morlana/}).count(),0,'unmapped has no fabricated map link');assert.match(await related.innerText(),/Morlana One/);assert.match(await related.innerText(),/Position not mapped/);
 assert.equal(await related.locator('li').count(),2);assert.equal(await related.locator('a a').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await related.locator('summary').click();await related.locator('li').first().waitFor({state:'detached'});assert.equal(await related.locator('li').count(),0,'close removes disclosure content');await related.locator('summary').click();
 await related.getByRole('link',{name:'Preview Kenari on map'}).click();await page.waitForFunction(()=>location.hash==='#galaxy/kenari');await expandPanel(page);
 assert.equal(await stories.locator('.related-worlds li').count(),0,'destination change resets per-title location disclosures');
 await stories.getByRole('button',{name:'Reveal linked unwatched titles'}).click();await stories.getByRole('searchbox').fill('S01E01');await stories.locator('a[href="#journey/andor-s01e01"]').click();await expandPanel(page);await page.locator('.journey-current h2').waitFor();assert.equal(await page.locator('.journey-stop').count(),0,'related-world disclosure does not reveal Journey');
 assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);assert.deepEqual(errors,[]);
 console.log('PASS hidden-title boundary,explicit per-title world disclosure,close/reset,source links,mapped navigation,unmapped text,no nested anchors,no watch/autoJourney reveal,390px');
}finally{await browser.close();}
