import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const base=process.env.ATLAS_URL||'http://localhost:4173';
try {
 for(const scenario of ['mobile','reduced','switch','failure']) {
  const page=await browser.newPage({viewport:{width:scenario==='mobile'?390:1440,height:1050},reducedMotion:scenario==='reduced'?'reduce':'no-preference'});
  const errors=[];let requests=0;page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/CinematicBloom-*.js',route=>{requests++;return scenario==='failure'?route.abort():route.continue();});
  await page.goto(base+'/#galaxy');await page.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();await page.waitForTimeout(500);
  await page.locator('.workspace-settings > summary').click();
  if(['mobile','reduced'].includes(scenario))assert.equal(requests,0,'ineligible scene must not request bloom');
  else {assert.equal(requests,1);await page.getByLabel('Graphics quality').selectOption('balanced');await page.getByLabel('Graphics quality').selectOption('cinematic');await page.waitForTimeout(200);assert.equal(requests,1,'quality switch reuses module');}
  await page.getByLabel('Find a mapped world').selectOption('hoth');assert.equal(await page.locator('.galaxy-canvas canvas').count(),1);assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS optional bloom skips mobile/reduced, quality switching reuses loaded module, failed download preserves canvas/navigation');
}finally{await browser.close();}
