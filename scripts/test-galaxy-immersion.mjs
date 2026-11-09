import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.ATLAS_URL || 'http://localhost:4173';
const out = process.env.ATLAS_EVIDENCE_DIR || 'evidence/galaxy-immersion';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const results = [];
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1050 }, reducedMotion: width < 600 ? 'reduce' : 'no-preference' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`${base}/#galaxy`);
    await page.getByRole('button', { name: 'Explore Tatooine', exact: true }).waitFor();
    await page.waitForTimeout(1200);
    const stage = page.locator('.map-stage');
    if (width < 600) {
      const toggle = page.getByRole('button', { name: 'Toggle pan controls', exact: true });
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
      for (const name of ['Pan up', 'Pan left', 'Pan down', 'Pan right']) {
        const bounds = await page.getByRole('button', { name, exact: true }).boundingBox();
        assert(bounds && bounds.width >= 44 && bounds.height >= 44);
      }
      await toggle.click();
    }
    assert.equal(await stage.getAttribute('data-presentation'), 'immersive');
    assert.equal(await page.locator('[data-planetary-body="true"]').count(), 76);
    assert.equal(await page.locator('canvas').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const visibleNames = await page.locator('.world-map-label').evaluateAll(es => es.filter(e => e.closest('[data-map-html]').style.visibility === 'visible' && e.dataset.decluttered !== 'true').length);
    await stage.screenshot({ path: `${out}/galaxy-${width}.png` });
    await page.getByRole('button', { name: 'Reference chart', exact: true }).click();
    assert.equal(await page.locator('[data-planetary-body="true"]').count(), 0);
    assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
    await page.getByRole('button', { name: 'Immersive', exact: true }).click();
    await page.locator('.workspace-settings>summary').click();
    await page.getByLabel('Find a mapped world').selectOption('naboo');
    assert.equal(await page.locator('.workspace-settings').evaluate(e => e.open), false, 'Choosing a world dismisses settings');
    assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
    await page.getByRole('button', { name: 'Explore Naboo', exact: true }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Inspect Naboo', exact: true }).click();
    await page.waitForTimeout(300);
    assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine', 'Inspection never commits arrival');
    assert.equal(await page.locator('.is-preview').getAttribute('data-world-id'), 'naboo');
    await stage.screenshot({ path: `${out}/inspect-naboo-${width}.png` });
    await page.getByRole('button', { name: 'Reset map view', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Explore Naboo', exact: true }).isVisible(), true);
    assert.deepEqual(errors, []);
    results.push({ width, visibleNames, illustrativeGlobes: 76, referenceSwitch: true, inspectPreservesCurrent: true, consoleErrors: errors });
    await page.close();
  }
  await writeFile(`${out}/results.json`, JSON.stringify({ browser: 'Chromium software WebGL; desktop emulation, not physical-device validation', base, results }, null, 2));
  console.log('PASS immersive/reference views, 76 illustrative globes, preview inspection without arrival, single canvas and responsive layout');
} finally { await browser.close(); }
