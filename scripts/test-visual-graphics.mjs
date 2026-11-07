import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('evidence', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const results = [];
try {
  for (const mode of ['desktop', 'mobile', 'reduced']) {
    const mobile = mode === 'mobile';
    const page = await browser.newPage({ viewport: mobile ? {width:390,height:844} : {width:1440,height:1050}, isMobile:mobile, hasTouch:mobile, reducedMotion:mode === 'reduced' ? 'reduce' : 'no-preference' });
    const errors = [];
    page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
    await page.addInitScript(() => {
      window.__drawCalls = 0;
      for (const ctor of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
        if (!ctor) continue;
        for (const name of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']) {
          if (!Object.hasOwn(ctor.prototype, name)) continue;
          const original = ctor.prototype[name];
          ctor.prototype[name] = function(...args) { window.__drawCalls++; return original.apply(this,args); };
        }
      }
    });
    if (mode !== 'reduced') await page.clock.install();
    await page.goto(process.env.ATLAS_URL || 'http://localhost:4173');
    await page.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();
    assert.equal(await page.locator('canvas').count(),1);
    const quality = page.getByLabel('Graphics quality');
    assert.equal(await quality.inputValue(),mobile ? 'balanced' : 'cinematic');
    const idle = {};
    for (const value of ['balanced','cinematic']) {
      await quality.selectOption(value);
      assert.equal(await page.locator('.map-stage').getAttribute('data-quality'),value);
      await page.waitForTimeout(2500);
      const before = await page.evaluate(() => window.__drawCalls);
      await page.waitForTimeout(600);
      idle[value] = (await page.evaluate(() => window.__drawCalls)) - before;
      assert.equal(idle[value],0,`${mode}/${value}: settled idle must not keep drawing`);
    }
    if (mobile) await quality.selectOption('balanced');
    await page.screenshot({path:`evidence/visual-graphics-${mode}-map.png`});
    await page.getByRole('button',{name:'Explore Hoth',exact:true}).click();
    if (mode !== 'reduced') await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
    await page.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();
    if (mode === 'reduced') {
      await page.waitForTimeout(350);
      assert.equal(await page.locator('.current-location strong').textContent(),'Hoth');
      assert.equal(await page.locator('.transit-panel').count(),0);
    } else {
      await page.clock.runFor(800);
      assert.ok(await page.locator('.mini-map').isVisible());
      assert.ok(await page.getByRole('button',{name:'Cancel',exact:true}).isVisible());
      assert.ok(await page.getByRole('button',{name:'Skip animation'}).isVisible());
      assert.ok(await quality.isDisabled());
      const panel = await page.locator('.transit-panel').boundingBox();
      const stage = await page.locator('.map-stage').boundingBox();
      assert.ok(panel.x >= stage.x && panel.x + panel.width <= stage.x + stage.width + 1, 'Transit panel stays inside map horizontally');
      assert.equal(await page.locator('canvas').count(),1);
      await page.screenshot({path:`evidence/visual-graphics-${mode}-warp.png`});
      await page.clock.resume();
      await page.waitForTimeout(2200);
      await page.getByRole('button',{name:'Explore Tatooine',exact:true}).click();
      await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
      await page.getByRole('button',{name:'Jump to Tatooine',exact:true}).first().click();
      await page.clock.runFor(200);
      await page.getByRole('button',{name:'Cancel',exact:true}).click();
      await page.clock.runFor(100);
      assert.equal(await page.locator('.current-location strong').textContent(),'Hoth');
      await page.getByRole('button',{name:'Explore Tatooine',exact:true}).click();
      await page.getByRole('button',{name:'Jump to Tatooine',exact:true}).first().click();
      await page.clock.runFor(200);
      await page.getByRole('button',{name:'Skip animation'}).click();
      await page.clock.runFor(100);
      assert.equal(await page.locator('.current-location strong').textContent(),'Tatooine');
      await page.clock.resume();
    }
    await page.waitForTimeout(300);
    assert.deepEqual(errors,[]);
    results.push({mode,idleDrawCallsOver600ms:idle,canvasCount:await page.locator('canvas').count(),errors});
    await page.close();
  }
} finally {
  await writeFile('evidence/visual-graphics-results.json',JSON.stringify({note:'Software WebGL browser checks, not hardware FPS measurements. Idle observation is a finite 600ms settled window per quality mode.',results},null,2));
  await browser.close();
}
console.log(JSON.stringify(results,null,2));





