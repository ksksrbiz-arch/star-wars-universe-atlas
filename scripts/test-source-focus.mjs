import { newSpoilerProtectedPage } from './lib-spoiler-testing.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const out=process.env.ATLAS_EVIDENCE_DIR||'evidence/source-focus';await mkdir(out,{recursive:true});
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const results=[];
try { for(const [width,fontCase] of [[1440,'normal'],[390,'normal'],[320,'normal'],[1440,'unavailable'],[390,'unavailable'],[320,'unavailable']]) {
 const page=await newSpoilerProtectedPage(browser, {viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 if(fontCase==='unavailable')await page.route(/fonts\.(googleapis|gstatic)\.com/,route=>route.abort());
 await page.addInitScript(()=>{window.__draws=0;for(const C of [window.WebGLRenderingContext,window.WebGL2RenderingContext])if(C)for(const key of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced'])if(Object.hasOwn(C.prototype,key)){const fn=C.prototype[key];C.prototype[key]=function(...args){window.__draws++;return fn.apply(this,args)};}});
 await page.goto((process.env.ATLAS_URL||'http://localhost:4173')+'/#journey/pt-revenge-of-the-sith');
 await page.evaluate(()=>document.fonts.ready);
 if(width<721)await page.locator('.sheet-toggle').click();
 await page.getByRole('button',{name:'Reveal locations for this title'}).click();await page.getByRole('button',{name:'Fit episode locations'}).click();await page.waitForTimeout(2000);
 async function overlaps(){return page.locator('.world-map-label').evaluateAll(es=>{const visible=es.filter(e=>e.closest('[data-map-html]')?.style.visibility==='visible'&&e.dataset.decluttered!=='true');const result=[];for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++){const a=visible[i].getBoundingClientRect(),b=visible[j].getBoundingClientRect();if(a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y)result.push([visible[i].textContent,visible[j].textContent]);}return result;});}
 assert.deepEqual(await overlaps(),[],`${width} dense episode labels`);
 const saleucami=page.getByRole('button',{name:'Explore Saleucami',exact:true});
 const anchorBefore=await saleucami.evaluate(e=>{const r=e.closest('[data-map-html]').getBoundingClientRect();return [r.x,r.y]});
 await saleucami.hover();await page.waitForTimeout(200);assert.equal(await saleucami.getAttribute('data-source-focus'),'true');
 assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
 await page.mouse.move(0,0);await page.waitForTimeout(200);assert.equal(await saleucami.getAttribute('data-source-focus'),'false');
 await saleucami.focus();await page.waitForTimeout(200);assert.deepEqual(await overlaps(),[],`${width} keyboard priority labels`);assert.equal(await saleucami.evaluate(e=>document.activeElement===e),true);assert.equal(await saleucami.getAttribute('data-source-focus'),'true');assert.deepEqual(await saleucami.evaluate(e=>{const r=e.closest('[data-map-html]').getBoundingClientRect();return [r.x,r.y]}),anchorBefore);
 await page.waitForTimeout(2000);const before=await page.evaluate(()=>window.__draws);await page.waitForTimeout(600);const idle=await page.evaluate(()=>window.__draws)-before;assert.equal(idle,0);
 assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);assert.deepEqual(errors,[]);
 await page.locator('.map-stage').screenshot({path:`${out}/source-focus-${width}-${fontCase}.png`});await saleucami.blur();await page.waitForTimeout(200);assert.equal(await saleucami.getAttribute('data-source-focus'),'false');results.push({width,fontCase,hoverAndFocusPreserveSource:true,overlaps:0,keyboardFocus:true,idleDrawsOver600ms:idle});await page.close();
}await writeFile(`${out}/results.json`,JSON.stringify({browser:'Chromium software WebGL; not physical-device FPS',results},null,2));console.log('PASS source tracing hover/focus, fixed anchors and dense packing at 1440/390/320 normal/fallback fonts, idle 0/600ms');} finally {await browser.close();}


