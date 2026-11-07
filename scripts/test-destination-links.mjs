import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const checks=[];const errors=[];
try {
 for(const mobile of [false,true]) {
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1050},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#galaxy/hoth');
  await page.getByRole('heading',{name:'Hoth',exact:true}).waitFor();
  assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
  await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();
  assert.equal(await page.locator('.current-location strong').innerText(),'Hoth');
  await page.getByLabel('Find a mapped world').selectOption('bespin');
  assert(page.url().endsWith('#galaxy/bespin'));
  await page.reload();await page.getByRole('heading',{name:'Bespin',exact:true}).waitFor();
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copiedDestination=text}},configurable:true}));
  await page.getByRole('button',{name:'Copy destination link'}).click();
  assert.equal(await page.evaluate(()=>window.copiedDestination),base+'/#galaxy/bespin');
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('denied')}},configurable:true}));
  await page.getByRole('button',{name:'Copy destination link'}).click();
  assert.equal(await page.getByLabel('Destination link').inputValue(),base+'/#galaxy/bespin');
  await page.evaluate(()=>location.hash='galaxy/not-a-world');
  await page.getByRole('heading',{name:'Tatooine',exact:true}).waitFor();
  await page.evaluate(()=>location.hash='journey/ot-empire-strikes-back');
  await page.locator('.journey-current h2').filter({hasText:'The Empire Strikes Back'}).waitFor();
  await page.getByRole('link',{name:'Galaxy',exact:true}).click();
  await page.getByRole('heading',{name:'Tatooine',exact:true}).waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await mkdir('evidence/explorer-upgrade',{recursive:true});
  await page.screenshot({path:`evidence/explorer-upgrade/${mobile?'mobile':'desktop'}.png`,fullPage:true});
  checks.push(`${mobile?'Mobile390':'Desktop1440'} destination deep link, reload, reduced-motion jump, share/copy fallback, invalid route and section navigation`);
  await context.close();
 }
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
await writeFile('evidence/explorer-upgrade/navigation-results.json',JSON.stringify({base,checks,errors},null,2));
console.log(checks);
