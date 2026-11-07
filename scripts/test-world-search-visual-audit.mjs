import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const checks=[],errors=[];
try {
 for(const width of [320,390,768,1440]) {
  const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#galaxy');
  const search=page.getByRole('searchbox',{name:'Search worlds',exact:true});
  await search.waitFor();
  if(width<=390) {
   const fields=await page.locator('.world-explorer-fields input,.world-explorer-fields select').evaluateAll(es=>es.map(e=>({font:parseFloat(getComputedStyle(e).fontSize),height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width})));
   assert(fields.every(f=>f.font>=16&&f.height>=44&&f.width>=220),JSON.stringify(fields));
  }
  await search.fill('zzzz-no-world');
  assert(await page.getByText('No mapped worlds match these filters.',{exact:false}).isVisible());
  await page.getByRole('button',{name:'Reset world filters'}).click();
  await search.fill('Hoth');
  await page.getByRole('combobox',{name:'Find a mapped world'}).selectOption('hoth');
  await page.getByRole('heading',{name:'Hoth',exact:true}).waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  checks.push(`${width}px: readable world fields, empty/reset/search and selection, no overflow`);
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({checks,errors},null,2));
} finally {await browser.close();}
