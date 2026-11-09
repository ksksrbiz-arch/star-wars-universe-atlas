import { newSpoilerProtectedPage } from './lib-spoiler-testing.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 const page=await newSpoilerProtectedPage(browser, {viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.ATLAS_URL||'http://localhost:4173')+'/#journey/andor-s01e01');
 await page.getByRole('button',{name:'Reveal locations for this title'}).click();
 const group=page.getByRole('group',{name:'Highlighted episode worlds'});const buttons=group.getByRole('button');
 await buttons.first().focus();await page.keyboard.press('End');assert(await buttons.last().evaluate(e=>e===document.activeElement));
 await page.keyboard.press('Home');assert(await buttons.first().evaluate(e=>e===document.activeElement));
 await page.keyboard.press('ArrowLeft');assert(await buttons.last().evaluate(e=>e===document.activeElement));
 async function bounds(){await page.getByRole('button',{name:'Fit episode locations',exact:true}).click();await page.waitForTimeout(300);const canvas=await page.locator('.galaxy-canvas canvas').boundingBox();for(const marker of await page.locator('[data-episode-location]').all()){const box=await marker.boundingBox();assert(box&&box.x>=canvas.x&&box.x+box.width<=canvas.x+canvas.width&&box.y>=canvas.y&&box.y+box.height<=canvas.y+canvas.height,'highlight label inside fitted canvas');}}
 await mkdir('/workspace/map-review',{recursive:true});
 await bounds();await page.locator('.map-stage').screenshot({path:'/workspace/map-review/fit-desktop.png'});await page.setViewportSize({width:390,height:844});await bounds();await page.locator('.map-stage').screenshot({path:'/workspace/map-review/fit-mobile.png'});await page.setViewportSize({width:320,height:740});await bounds();
 await page.getByRole('button',{name:'Reset map view',exact:true}).click();await bounds();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
 console.log('PASS episode fit desktop/390/320 resize/reset, highlighted labels within canvas, keyboard Home/End/arrows and no overflow/errors');
}finally{await browser.close();}
