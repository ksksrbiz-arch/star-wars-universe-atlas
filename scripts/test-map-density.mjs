import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const base=process.env.ATLAS_URL||'http://localhost:4173';
const checks=[];
try {
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:1050},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#galaxy');await page.getByRole('button',{name:'Explore Tatooine',exact:true}).waitFor();
  await page.locator('.map-stage').scrollIntoViewIfNeeded();
  const stage=await page.locator('.galaxy-canvas canvas').boundingBox();await page.mouse.move(stage.x+stage.width*.5,stage.y+stage.height*.5);
  for(let i=0;i<38;i++){await page.mouse.wheel(0,-100);await page.waitForTimeout(40);}
  await page.waitForTimeout(1000);
  const stats=await page.evaluate(()=>{
   const all=[...document.querySelectorAll('.world-map-label')];
   const zoomed=all.filter(e=>e.closest('[data-map-html]')?.style.visibility==='visible');
   const shown=zoomed.filter(e=>e.dataset.decluttered!=='true');
   const optional=shown.filter(e=>e.dataset.labelPriority==='0');
   let overlaps=0;
   for(const a of optional)for(const b of shown){if(a===b)continue;const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();if(x.left<y.right&&x.right>y.left&&x.top<y.bottom&&x.bottom>y.top)overlaps++;}
   return{total:all.length,zoomed:zoomed.length,culled:zoomed.length-shown.length,optional:optional.length,overlaps};
  });
  console.log(width,stats);
  assert.equal(stats.overlaps,0,'visible optional labels must not collide');
  assert(stats.culled>0,'dense zoom should cull overlapping or clipped optional labels');
  await page.getByLabel('Find a mapped world').selectOption('naboo');
  const selected=page.getByRole('button',{name:'Explore Naboo',exact:true});
  await selected.waitFor();assert.equal(await selected.getAttribute('data-label-priority'),'3');assert.equal(await selected.getAttribute('data-decluttered'),'false');
  await page.getByRole('button',{name:'Reset map view',exact:true}).click();await page.keyboard.press('Tab');await selected.focus();assert.equal(await selected.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
  await page.getByLabel('Find a mapped world').selectOption('lothal');
  await page.getByRole('button',{name:'Reset map view',exact:true}).click();await page.waitForTimeout(300);
  const edge = await page.getByRole('button',{name:'Explore Lothal',exact:true}).boundingBox();const frame = await page.locator('.galaxy-canvas canvas').boundingBox();
  assert(edge.x>=frame.x && edge.x+edge.width<=frame.x+frame.width+1,'Lothal edge label fits canvas');
  assert.equal(await page.locator('.galaxy-canvas canvas').count(),1);assert.deepEqual(errors,[]);
  await mkdir('evidence/map-density',{recursive:true});await page.locator('.map-stage').screenshot({path:`evidence/map-density/${width}.png`});
  checks.push({width,...stats,selectedAlwaysAvailable:true,errors});await page.close();
 }
}finally{await browser.close();}
await writeFile('evidence/map-density/results.json',JSON.stringify({checks,note:'Desktop Chromium software WebGL; emulated viewports, no physical-device FPS measurement.'},null,2));console.log(checks);
