import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('evidence', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const names = ['Tatooine', 'Alderaan', 'Yavin 4', 'Hoth', 'Dagobah', 'Bespin', 'Coruscant', 'Mandalore'];
const results = [];
try {
  for (const viewport of [{ width: 1440, height: 1050 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
    console.log(`Checking expanded map at ${viewport.width}px`);
    const page = await browser.newPage({ viewport, isMobile: viewport.width < 500, hasTouch: viewport.width < 500 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:4173');
    const marker = name => page.getByRole('button', { name: `Explore ${name}`, exact: true });
    const reset = async () => { await page.getByRole('button', { name: 'Reset map view', exact: true }).click(); await page.waitForTimeout(250); };
    await marker('Mandalore').waitFor();
    await reset();
    const boxes = await page.locator('button[aria-label^="Explore "]').evaluateAll(elements => elements.map(e => {
      const r = e.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { name: e.getAttribute('aria-label'), x: r.x, y: r.y, width: r.width, height: r.height, reachable: hit === e || e.contains(hit) };
    }));
    assert.equal(boxes.length, 8);
    assert.ok(boxes.every(r => r.reachable), `All markers reachable at ${viewport.width}: ${JSON.stringify(boxes.filter(r => !r.reachable))}`);
    const overlaps = [];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
      const h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
      if (w > 1 && h > 1) overlaps.push([a.name, b.name, w, h]);
    }
    assert.deepEqual(overlaps, [], `No overlapping marker buttons at ${viewport.width}`);
    for (const name of names) {
      await marker(name).click();
      await page.getByRole('complementary', { name: `${name} destination details`, exact: true }).waitFor();
      assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine', 'Preview must not commit destination');
    }
    await reset();
    await marker('Hoth').click();
    const before = await marker('Alderaan').boundingBox();
    const beforeStage = await page.locator('.map-stage').boundingBox();
    await page.getByRole('button', { name: 'Jump to Hoth', exact: true }).first().click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
    // Cancel restores the departure dossier, whose height may resize the canvas.
    // Restore the same preview before comparing camera projection in like geometry.
    await marker('Hoth').click();
    await page.waitForTimeout(250);
    const after = await marker('Alderaan').boundingBox();
    const afterStage = await page.locator('.map-stage').boundingBox();
    assert.ok(Math.abs((before.x-beforeStage.x) - (after.x-afterStage.x)) < 2 && Math.abs((before.y-beforeStage.y) - (after.y-afterStage.y)) < 2, `Cancel restores camera: before=${JSON.stringify(before)} after=${JSON.stringify(after)}`);
    await marker('Hoth').click();
    await page.getByRole('button', { name: 'Jump to Hoth', exact: true }).first().click();
    await page.getByRole('button', { name: 'Skip animation', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.current-location strong')?.textContent === 'Hoth');
    await reset();
    await marker('Bespin').click();
    await page.getByRole('button', { name: 'Jump to Bespin', exact: true }).first().click();
    await page.waitForFunction(() => document.querySelector('.current-location strong')?.textContent === 'Bespin');
    await page.getByRole('button', { name: 'Return to previous world', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.current-location strong')?.textContent === 'Hoth');
    await reset();
    await page.getByRole('link', { name: 'Library', exact: true }).click();
    await page.getByRole('link', { name: 'Galaxy', exact: true }).click();
    await marker('Hoth').waitFor();
    assert.equal(await page.locator('.current-location strong').innerText(), 'Hoth', 'Section roundtrip preserves current world');
    await marker('Bespin').click();
    await page.getByRole('complementary', { name: 'Bespin destination details', exact: true }).waitFor();
    await reset();
    await page.screenshot({ path: `evidence/expanded-map-${viewport.width}.png`, fullPage: true });
    await page.setViewportSize({ width: viewport.width, height: viewport.height + 60 });
    assert.equal(await page.locator('.current-location strong').innerText(), 'Hoth', 'Resize preserves committed destination');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    results.push({ viewport, markers: 8, markerButtonOverlaps: overlaps.length, checks: ['All eight map labels reachable and select correct dossier', 'Preview does not change current destination', 'Cancel restores camera and departure world', 'Skip commits Hoth', 'Same-grid Hoth-to-Bespin jump completes', 'Back restores Hoth', 'Library to Galaxy roundtrip preserves current world and marker selection works', 'Resize preserves destination', 'No horizontal overflow', 'No page errors'], errors });
    await page.close();
  }
  await writeFile('evidence/expanded-map-results.json', JSON.stringify({ date: '2026-11-07', environment: 'Playwright Chromium with software WebGL; mobile emulation, not physical-device performance evidence', results }, null, 2));
  console.log(JSON.stringify(results, null, 2));
  assert.deepEqual(results.flatMap(r => r.errors), [], 'No browser page errors across viewports');
} finally { await browser.close(); }
