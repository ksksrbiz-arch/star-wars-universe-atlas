import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'http://127.0.0.1:4181',out=process.env.ATLAS_EVIDENCE_DIR||'evidence/artwork-release/serenno';
await mkdir(out,{recursive:true});const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const results=[];
try{for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#galaxy/serenno');if(width<721)await page.locator('.sheet-toggle').click();
 await page.waitForFunction(()=>document.querySelector('.workspace-panel [data-profile-id="serenno"] canvas')?.dataset.resolution==='1024',null,{timeout:60000});
 assert.match(await page.locator('.world-facts').innerText(),/Forests, mountains and plains/);
 assert.equal(await page.locator('.workspace-panel .atlas-portrait svg[role="img"]').count(),0);
 assert.equal(await page.getByRole('button',{name:'Explore from orbit',exact:true}).count(),1);
 await page.locator('.workspace-panel').screenshot({path:`${out}/serenno-card-${width}.png`});assert.deepEqual(errors,[]);results.push({width,texturePixels:1024,terrain:'Forests, mountains and plains',errors});await page.close();
}await writeFile(`${out}/serenno-results.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),results},null,2));console.log('PASS live-ready textured Serenno card and sourced landscape at desktop/phone widths');}finally{await browser.close();}
