import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.addInitScript(()=>{
  window.__audio={created:0,started:0,stopped:0,suspended:0,resumeResolvers:[],defer:false};
  class Context {
   constructor(){window.__audio.created++;this.state='suspended';this.currentTime=0;this.destination={};}
   async resume(){if(window.__audio.defer)await new Promise(resolve=>window.__audio.resumeResolvers.push(resolve));this.state='running';}
   async suspend(){window.__audio.suspended++;this.state='suspended';}
   async close(){this.state='closed';}
   createOscillator(){return {frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){window.__audio.started++;},stop(){window.__audio.stopped++;}};}
   createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
  }
  window.AudioContext=Context;
 });
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto((process.env.ATLAS_URL||'http://localhost:4173')+'/#galaxy');
 const sound=page.getByRole('switch',{name:'Interface sound'});await sound.waitFor();
 assert.equal(await sound.getAttribute('aria-checked'),'false');
 assert.equal(await page.evaluate(()=>window.__audio.created),0,'Default mute must not create audio context');
 await sound.focus();await page.keyboard.press('Space');
 await page.waitForFunction(()=>window.__audio.started>0);
 assert.equal(await sound.getAttribute('aria-checked'),'true');
 const beforeHidden=await page.evaluate(()=>window.__audio.stopped);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
 assert.ok(await page.evaluate(()=>window.__audio.stopped)>beforeHidden,'Hidden page stops active cues');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});});
 await sound.click();assert.equal(await sound.getAttribute('aria-checked'),'false');
 assert.ok(await page.evaluate(()=>window.__audio.suspended>0));
 const started=await page.evaluate(()=>window.__audio.started);
 await page.getByRole('button',{name:'Reset map view',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.__audio.started),started,'Muted controls must not emit sound');
 await page.reload();await sound.waitFor();assert.equal(await sound.getAttribute('aria-checked'),'false');assert.equal(await page.evaluate(()=>window.__audio.created),0,'Reload must not persist autoplay');
 await page.evaluate(()=>{window.__audio.defer=true;});
 await sound.click();
 // Rapid activation must remain operable or explicitly busy, not emit duplicate cues.
 if(!await sound.isDisabled())await sound.click();
 await page.evaluate(()=>{for(const resolve of window.__audio.resumeResolvers)resolve();});
 await page.waitForTimeout(100);
 assert.ok(await page.evaluate(()=>window.__audio.started<=1),'Pending activation must not duplicate audio');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);
 console.log('PASS interface audio default mute/no context, keyboard opt-in, mute suspension, no muted cues, reload no autoplay, pending activation and mobile layout');
}finally{await browser.close();}
