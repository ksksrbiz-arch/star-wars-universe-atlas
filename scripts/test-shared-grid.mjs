import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import { expandPanel } from './lib-journey-ui.mjs';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#journey/clone-wars-s02e06");
await expandPanel(page);
await page.getByRole('button',{name:'Reveal locations for this title'}).click();
await page.getByRole('button',{name:'Show Geonosis on map',exact:true}).click();
await page.locator('.map-stage').scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
const boxes=await page.locator('button[aria-label^="Explore "]').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{name:e.getAttribute('aria-label'),x:r.x,y:r.y,width:r.width,height:r.height,reachable:e===hit||e.contains(hit)};}));
assert.equal(boxes.length,2);assert.ok(boxes.every(b=>b.reachable),JSON.stringify(boxes));
const [a,b]=boxes;assert.ok(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)<=1||Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)<=1,'Shared-grid marker buttons overlap');
assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
await page.getByRole('button',{name:'Jump to Geonosis',exact:true}).first().click();
await page.waitForFunction(()=>document.querySelector('.current-location strong')?.textContent==='Geonosis');
assert.deepEqual(errors,[]);
const result={viewport:390,checks:['Tatooine and Geonosis labels reachable and nonoverlapping at shared R-16 grid','Full animated same-cell jump arrives Geonosis'],boxes,errors};
await writeFile('evidence/shared-grid-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
