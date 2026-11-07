import { ALL_WORLDS } from '../src/journeyWorlds.ts';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('evidence', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const base = process.env.ATLAS_URL || 'http://localhost:4173';
const results = [];
try {
  for (const viewport of [{ width: 1440, height: 1050 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
    console.log(`Checking expanded map at ${viewport.width}px`);
    const page = await browser.newPage({ viewport, isMobile: viewport.width < 500, hasTouch: viewport.width < 500 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.clock.install();
    await page.goto(base);
    const finder = page.getByRole('combobox', { name: 'Find a mapped world' });
    await finder.waitFor();
    await page.getByRole('button', { name: 'Explore Mandalore', exact: true }).waitFor();
    const destinations = await finder.locator('option').evaluateAll(options => options.map(option => ({ id: option.value, name: option.textContent.split(' · ')[0] })));
    assert.equal(destinations.length, ALL_WORLDS.length, 'All supported supported worlds are available in the finder');
    assert.equal(new Set(destinations.map(world => world.id)).size, ALL_WORLDS.length, 'Finder has no duplicate destinations');
    assert.equal(await page.locator('button[aria-label^="Explore "]').count(), ALL_WORLDS.length, 'Every supported world has a map marker');
    const select = async name => {
      const world = destinations.find(entry => entry.name === name);
      assert.ok(world, `Destination ${name} exists`);
      await finder.selectOption(world.id);
      await page.getByRole('complementary', { name: `${name} destination details`, exact: true }).waitFor();
    };
    for (const world of destinations) {
      await select(world.name);
      assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine', 'Preview must not commit destination');
    }
    // With many labels and valid shared grid cells, marker overlap is expected at
    // overview scale. The finder must provide an accessible route to every world.
    await page.getByRole('button', { name: 'Reset map view', exact: true }).click();
    await select('Hoth');
    await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
    await page.getByRole('button', { name: 'Jump to Hoth', exact: true }).first().click();
    await page.locator('.transit-panel').waitFor();
    await page.clock.runFor(400);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
    await page.getByRole('complementary', { name: 'Tatooine destination details', exact: true }).waitFor();
    assert.equal(await page.locator('.transit-panel').count(), 0);
    await page.clock.runFor(2500);
    assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine', 'Cancelled animation cannot later commit arrival');
    await select('Hoth');
    await page.getByRole('button', { name: 'Jump to Hoth', exact: true }).first().click();
    await page.locator('.transit-panel').waitFor();
    await page.getByRole('button', { name: 'Skip animation', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.current-location strong')?.textContent === 'Hoth');
    assert.equal(await page.locator('.transit-panel').count(), 0);
    await page.clock.resume();
    await select('Bespin');
    await page.getByRole('button', { name: 'Jump to Bespin', exact: true }).first().click();
    await page.waitForFunction(() => document.querySelector('.current-location strong')?.textContent === 'Bespin');
    await page.getByRole('button', { name: 'Return to previous world', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.current-location strong')?.textContent === 'Hoth');
    await page.getByRole('link', { name: 'Library', exact: true }).click();
    await page.getByRole('link', { name: 'Galaxy', exact: true }).click();
    await finder.waitFor();
    assert.equal(await page.locator('.current-location strong').innerText(), 'Hoth', 'Section roundtrip preserves current world');
    await select('Bespin');
    await page.getByRole('button', { name: 'Reset map view', exact: true }).click();
    await page.screenshot({ path: `evidence/expanded-map-${viewport.width}.png`, fullPage: true });
    await page.setViewportSize({ width: viewport.width, height: viewport.height + 60 });
    assert.equal(await page.locator('.current-location strong').innerText(), 'Hoth', 'Resize preserves committed destination');
    await select('Mandalore');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, [], 'No browser page errors');
    results.push({ viewport, destinations: ALL_WORLDS.length, checks: ['All supported finder destinations select their correct dossier', 'Every supported world has a map marker', 'Preview does not change current destination', 'Cancel restores departure world and dossier without delayed arrival', 'Skip commits Hoth', 'Same-grid Hoth-to-Bespin animated jump completes', 'Back restores Hoth', 'Library to Galaxy roundtrip preserves current world and finder works', 'Resize preserves destination and finder remains usable', 'No horizontal overflow', 'No page errors'], errors });
    await page.close();
  }
  await writeFile('evidence/expanded-map-results.json', JSON.stringify({ date: '2026-11-07', environment: 'Playwright Chromium with software WebGL; mobile emulation, not physical-device performance evidence', results }, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
