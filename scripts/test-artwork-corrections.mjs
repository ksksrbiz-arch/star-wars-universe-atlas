import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'http://127.0.0.1:4181',out=process.env.ATLAS_EVIDENCE_DIR||'evidence/artwork-corrections';
await mkdir(out,{recursive:true});const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const results=[];
try{
 const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const [id,kind]of Object.entries({bothawui:'gas',pantora:'terrestrial',quarzite:'clouded',quell:'clouded',teth:'terrestrial'})){
  await p.goto(base+'/#galaxy/'+id);const portrait=p.locator('.workspace-panel .atlas-portrait');
  await p.waitForFunction(id=>document.querySelector(`.workspace-panel [data-profile-id="${id}"] canvas`)?.dataset.resolution==='1024',id);
  assert.equal(await portrait.locator('.planet-globe').getAttribute('data-family'),kind);
  if(kind==='gas')assert.match(await portrait.innerText(),/illustrative bands/);
  await portrait.screenshot({path:`${out}/profile-${id}.png`});
  await portrait.getByRole('button',{name:'Explore from orbit',exact:true}).click();const dialog=p.getByRole('dialog');
  await p.waitForFunction(()=>document.querySelector('.orbit-viewer canvas')?.dataset.resolution==='2048',null,{timeout:60000});
  const canvas=dialog.locator('canvas');const url=await canvas.evaluate(c=>c.toDataURL());await writeFile(`${out}/${id}-2048.png`,Buffer.from(url.split(',')[1],'base64'));
  await dialog.screenshot({path:`${out}/orbit-${id}.png`});await p.keyboard.press('Escape');await dialog.waitFor({state:'detached'});results.push({id,kind,pixels:2048});
 }
 assert.deepEqual(errors,[]);await writeFile(`${out}/corrections-results.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),results,errors,limitation:'Software Chromium, desktop emulation; patterns are illustrative.'},null,2));console.log('PASS five corrected profiles and native 2048px orbital renders');
}finally{await browser.close();}
