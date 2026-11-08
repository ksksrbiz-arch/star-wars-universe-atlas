import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const base=process.env.ATLAS_URL||'http://localhost:4173';const results=[];
try{
 for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__draws=0;for(const C of [window.WebGLRenderingContext,window.WebGL2RenderingContext])if(C)for(const name of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced'])if(Object.hasOwn(C.prototype,name)){const fn=C.prototype[name];C.prototype[name]=function(...args){window.__draws++;return fn.apply(this,args);};}});
 await page.goto(base+'/#galaxy');await page.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.getByRole('button',{name:'Pan right',exact:true}).click();await page.waitForTimeout(1800);
 const before=await page.evaluate(()=>window.__draws);await page.waitForTimeout(600);const draws=await page.evaluate(()=>window.__draws)-before;assert.equal(draws,0,'commands must settle without continuous rendering');
 const labels=await page.locator('.world-map-label').evaluateAll(nodes=>({total:nodes.length,visible:nodes.filter(e=>getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).opacity!=='0').length}));assert.deepEqual(errors,[]);results.push({width,drawCallsOverSettled600ms:draws,labels,errors});await page.close();
 }
 console.log(JSON.stringify({scope:'Chromium software WebGL, reduced motion; finite idle window, not hardware FPS',results},null,2));
}finally{await browser.close();}
