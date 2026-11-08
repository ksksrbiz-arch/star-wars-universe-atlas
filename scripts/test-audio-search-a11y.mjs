import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const url=process.env.ATLAS_URL||'http://localhost:4173';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.addInitScript(()=>{
  window.__r=[];window.__defer=false;
  class C{constructor(){this.state='suspended';this.currentTime=0;this.destination={};}
   async resume(){if(window.__defer)await new Promise(r=>window.__r.push(r));this.state='running';}
   async suspend(){this.state='suspended';}async close(){this.state='closed';}
   createOscillator(){return {frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){},stop(){}};}
   createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}}
  window.AudioContext=C;
 });
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'/#galaxy');
 // Items 1 and 2: toggle keeps focus while pending; accessible name contains the visible text.
 const sound=page.getByRole('switch',{name:/Sound off/});await sound.waitFor();
 assert.match(await sound.innerText(),/Sound off/);
 await page.evaluate(()=>{window.__defer=true;});
 await sound.focus();await page.keyboard.press('Space');
 assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('role')),'switch','Focus stays on toggle while pending');
 assert.equal(await sound.getAttribute('aria-disabled'),'true');
 await page.keyboard.press('Space');
 await page.evaluate(()=>window.__r.forEach(r=>r()));
 await page.getByRole('switch',{name:/Sound on/}).waitFor();
 // Items 5, 6 and 7.
 const trigger=page.getByRole('button',{name:'Search the atlas'});
 await trigger.click();
 const dlg=page.locator('dialog.atlas-search-dialog');
 assert.ok(await dlg.evaluate(d=>d.open));
 await page.evaluate(()=>document.querySelector('.atlas-search-trigger').click());
 const input=dlg.getByRole('combobox');
 await input.fill('Lothal');
 const box=await input.boundingBox();
 await page.mouse.move(box.x+10,box.y+box.height/2);await page.mouse.down();
 await page.mouse.move(2,2);await page.mouse.up();
 assert.ok(await dlg.evaluate(d=>d.open),'Drag from input to backdrop must not close');
 await page.mouse.click(2,2);
 assert.ok(!await dlg.evaluate(d=>d.open),'Backdrop click closes');
 assert.equal(await page.evaluate(()=>document.activeElement?.matches('.atlas-search-trigger')),true,'Dismiss restores focus');
 await trigger.click();await input.fill('Lothal');
 await page.keyboard.press('Enter');
 assert.ok(!await dlg.evaluate(d=>d.open));
 assert.notEqual(await page.evaluate(()=>document.activeElement?.matches('.atlas-search-trigger')),true,'Navigation must not steal focus back');
 assert.deepEqual(errors,[]);
 console.log('audio/search a11y checks passed');
} finally { await browser.close(); }
