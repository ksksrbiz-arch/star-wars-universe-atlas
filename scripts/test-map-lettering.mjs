import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import { openMapSettings } from './lib-ui.mjs';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:2});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.ATLAS_URL||'http://localhost:4173')+'/#galaxy');
 const tatooine=page.getByRole('button',{name:'Explore Tatooine',exact:true});await tatooine.waitFor();
 assert.match(await tatooine.getAttribute('title'),/Tatooine · source grid R-16/);
 await tatooine.focus();assert.equal(await tatooine.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
 async function ratio(){return page.locator('.galaxy-canvas canvas').evaluate(e=>e.width/e.getBoundingClientRect().width);}
 assert.ok(Math.abs(await ratio()-2)<.02,'cinematic DPR capped at2');
 await openMapSettings(page);await page.getByLabel('Graphics quality').selectOption('balanced');await page.waitForTimeout(200);
 assert.ok(Math.abs(await ratio()-1.5)<.02,'balanced DPR capped at1.5');
 await openMapSettings(page);await page.getByRole('switch',{name:'Reduce motion'}).click();await page.getByLabel('Graphics quality').selectOption('cinematic');await page.waitForTimeout(200);
 assert.ok(Math.abs(await ratio()-1.5)<.02,'reduced-motion retains1.5 cap');assert.deepEqual(errors,[]);
 console.log('PASS source-grid lettering, keyboard focus visibility and high-DPI quality/reduced-motion resolution caps');
}finally{await browser.close();}
