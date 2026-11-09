import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.ATLAS_URL || 'http://localhost:4173';
const output = process.env.ATLAS_EVIDENCE_DIR || 'work/audit-shell';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({args:['--enable-unsafe-swiftshader']});
const checks = [], errors = [];
try {
  for (const width of [320,390,768,1440]) {
    const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:'no-preference'});
    page.on('pageerror',error=>errors.push(error.message));
    await page.clock.install();
    await page.goto(base+'/#galaxy');
    await page.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();
    const nav = await page.locator('.platform-nav a').evaluateAll(elements=>elements.map(element=>{
      const rect=element.getBoundingClientRect();return {left:rect.left,right:rect.right,height:rect.height};
    }));
    assert.equal(nav.length,5);
    assert(nav.every(rect=>rect.left>=0 && rect.right<=width && rect.height>=44),'All five sections must be visible without horizontal navigation scrolling');
    const bounds = async selector => page.locator(selector).evaluateAll(elements=>elements.map(element=>{
      const rect=element.getBoundingClientRect();return {width:rect.width,height:rect.height};
    }));
    assert((await bounds('.map-tools button')).every(rect=>rect.width>=44&&rect.height>=44));
    await page.getByLabel('Find a mapped world').selectOption('hoth');
    assert((await bounds('.map-jump-bar button')).every(rect=>rect.height>=44));
    await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));
    await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();
    await page.clock.runFor(500);
    assert((await bounds('.transit-panel button')).every(rect=>rect.width>=44&&rect.height>=44),'Cancel and Skip need usable touch targets');
    assert.equal(await page.locator('.warp-progress span').evaluate(element=>getComputedStyle(element).animationName),'warp-progress');
    await page.locator('.map-stage').screenshot({path:`${output}/travel-${width}.png`});
    await page.getByRole('button',{name:'Skip animation',exact:true}).click();
    assert.equal(await page.locator('.current-location strong').innerText(),'Hoth');
    await page.getByRole('switch',{name:'Reduce motion'}).click();
    await page.getByLabel('Find a mapped world').selectOption('tatooine');
    await page.getByRole('button',{name:'Jump to Tatooine',exact:true}).first().click();
    assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
    assert.equal(await page.locator('.transit-panel').count(),0);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.clock.resume();
    await page.screenshot({path:`${output}/shell-${width}.png`,fullPage:true});
    checks.push(`${width}px: all five navigation links visible; map, Jump, Cancel and Skip targets at least 44px; warp progress animates; reduced-motion travel is immediate; no document overflow`);
    await page.close();
  }
  assert.deepEqual(errors,[]);
} finally {
  await writeFile(`${output}/results.json`,JSON.stringify({url:base,checkedAt:new Date().toISOString(),browser:browser.version(),checks,errors,limitation:'Software WebGL and emulated viewports; not physical-device performance testing.'},null,2));
  await browser.close();
}
console.log(JSON.stringify({checks,errors},null,2));
