import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const requests=[];const errors=[];
  page.on('request',request=>{if(request.url().includes('/visuals/'))requests.push(request.url());});page.on('pageerror',error=>errors.push(error.message));
  await page.goto((process.env.ATLAS_URL||'http://localhost:4173')+'/#galaxy');
  const image=page.locator('.atlas-hero-media img');await image.waitFor();await page.waitForFunction(()=>document.querySelector('.atlas-hero-media img')?.naturalWidth>0);
  const source=await image.evaluate(e=>e.currentSrc);
  assert.match(source,width>=768?/-2k\.webp$/ : /-preview\.jpg$/);
  assert(!requests.some(url=>url.includes('-4k.')),'4K derivative must not download without user action');
  const credit=page.locator('.atlas-hero-credit summary');await credit.focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('.atlas-hero-credit').innerText(),/not Star Wars geography/);
  assert.equal(await page.locator('.atlas-hero-credit a[href$="-4k.webp"]').count(),1);
  assert.match(await page.locator('.atlas-portrait svg').getAttribute('aria-label'),/Original illustrative portrait of Tatooine/);
  assert.match(await page.locator('.atlas-portrait').innerText(),/not surface geography/);
  assert.equal(await page.locator('.portrait-disc').evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const originalHash=await page.evaluate(()=>location.hash);
  await page.getByRole('button',{name:'Open galaxy map',exact:true}).click();
  assert.equal(await page.locator('#galaxy-map').evaluate(e=>document.activeElement===e),true);
  assert.equal(await page.evaluate(()=>location.hash),originalHash);
  const mapBox=await page.locator('#galaxy-map').boundingBox();assert.ok(mapBox.y>=-1&&mapBox.y<80,'Map action scrolls to focused map');
  assert.deepEqual(errors,[]);await page.close();
 }
 const fallback=await browser.newPage({reducedMotion:'reduce'});await fallback.route('**/visuals/**',route=>route.abort());
 await fallback.goto((process.env.ATLAS_URL||'http://localhost:4173')+'/#galaxy');
 await fallback.locator('.atlas-hero-media').waitFor({state:'detached'});assert(await fallback.getByRole('heading',{name:'Your next story is out there.'}).isVisible());
 assert(await fallback.locator('.atlas-portrait svg').isVisible());
 console.log('PASS responsive local starfield selection/no eager4K, keyboard credits, decorative meaning, original accessible portrait/reduced motion,1440/390/320 nooverflow, failed-image fallback');
}finally{await browser.close();}
