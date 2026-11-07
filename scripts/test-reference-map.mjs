import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('evidence', {recursive:true});
const browser = await chromium.launch({args:['--enable-unsafe-swiftshader']});
const results = [];
try {
  for (const mode of ['desktop','mobile','reduced']) {
    const mobile = mode === 'mobile';
    const page = await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1050},isMobile:mobile,hasTouch:mobile,reducedMotion:mode==='reduced'?'reduce':'no-preference'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {if(message.type()==='error') errors.push(message.text())});
    await page.clock.install();
    await page.goto(process.env.ATLAS_URL || 'http://localhost:4173');
    const finder = page.getByRole('combobox',{name:'Find a mapped world'});
    await finder.waitFor();
    await page.getByRole('button',{name:'Explore Tatooine',exact:true}).waitFor();
    await page.waitForTimeout(700);
    assert.equal(await finder.locator('option').count(),76);
    assert.equal(await page.locator('canvas').count(),1);
    const layers = [['Regions','.region-map-label',9],['Hyperspace routes','.route-map-label',5],['Grid','.grid-map-label',42]];
    for (const [name, selector, count] of layers) {
      const checkbox = page.getByRole('checkbox',{name,exact:true});
      assert.ok(await checkbox.isChecked());
      assert.equal(await page.locator(selector).count(),count,`${name} labels initially present`);
      await checkbox.uncheck();
      await page.waitForFunction(selector => document.querySelectorAll(selector).length===0,selector);
      assert.equal(await page.locator(selector).count(),0);
      await checkbox.check();
      await page.waitForFunction(({selector,count})=>document.querySelectorAll(selector).length===count,{selector,count});
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:`evidence/reference-map-${mode}.png`,fullPage:true});
    await finder.selectOption('hoth');
    assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine','preview does not commit arrival');
    if (mode === 'reduced') {
      await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();
      await page.waitForFunction(()=>document.querySelector('.current-location strong')?.textContent==='Hoth');
      assert.equal(await page.locator('.transit-panel').count(),0);
    } else {
      await page.clock.pauseAt(await page.evaluate(()=>Date.now()+10000));
      await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();
      await page.clock.runFor(800);
      assert.ok(await page.getByRole('button',{name:'Cancel',exact:true}).isVisible());
      assert.ok(await page.getByRole('button',{name:'Skip animation',exact:true}).isVisible());
      assert.ok(await page.locator('.mini-map').isVisible());
      const stage=await page.locator('.map-stage').boundingBox(), panel=await page.locator('.transit-panel').boundingBox();
      assert.ok(panel.x>=stage.x-1&&panel.x+panel.width<=stage.x+stage.width+1,'panel stays inside map');
      assert.ok(await page.locator('.transit-panel').evaluate(el=>Number(getComputedStyle(el).opacity)>.95),'Transit controls are visibly opaque at midpoint');
      await page.locator('.map-stage').screenshot({path:`evidence/reference-map-${mode}-warp.png`});
      await page.getByRole('button',{name:'Cancel',exact:true}).click();
      assert.equal(await page.locator('.current-location strong').innerText(),'Tatooine');
      await page.clock.resume();
      await finder.selectOption('hoth');
      await page.clock.pauseAt(await page.evaluate(()=>Date.now()+10000));
      await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();
      await page.clock.runFor(400);
      await page.getByRole('button',{name:'Skip animation',exact:true}).click();
      assert.equal(await page.locator('.current-location strong').innerText(),'Hoth');
      await page.clock.resume();
    }
    if (mobile) {
      await page.setViewportSize({width:320,height:844});
      await page.waitForTimeout(300);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'320px overflow');
    }
    await page.waitForTimeout(300);
    assert.deepEqual(errors,[]);
    results.push({mode,mappedOptions:76,regionLabels:9,routeLabels:5,gridLabels:42,singleCanvas:true,layerToggles:true,warp:mode==='reduced'?'reduced-motion bypass':'midpoint capture, cancel preserves origin, skip arrives',errors});
    await page.close();
  }
} finally {
  await writeFile('evidence/reference-map-results.json',JSON.stringify({checkedAt:new Date().toISOString(),environment:'Headless Chromium software WebGL; no physical-device performance claim.',results},null,2));
  await browser.close();
}
console.log(JSON.stringify(results,null,2));
