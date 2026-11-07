import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.ATLAS_URL || 'http://localhost:4173';
const out = 'work/audit-library';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const checks = [], errors = [];
try {
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.on('pageerror', error => errors.push(error.message));
    for (const view of ['library', 'timeline', 'watch']) {
      await page.goto(`${base}/#${view}`);
      const search = page.getByRole('textbox', { name: 'Search films and episodes' });
      await search.fill('A New Hope');
      await page.locator('.catalog-item').first().waitFor();
      const clear = page.getByRole('button', { name: 'Clear search' });
      const clearBox = await clear.boundingBox();
      assert.ok(clearBox.width >= 44 && clearBox.height >= 44, `${view}: clear target ${width}`);
      if (width <= 720) {
        const controls = await page.locator('.library-search input,.library-select-controls select').evaluateAll(elements => elements.map(element => ({ height: element.getBoundingClientRect().height, font: parseFloat(getComputedStyle(element).fontSize) })));
        assert.ok(controls.every(control => control.height >= 44 && control.font >= 16), `${view}: readable editing controls at ${width}`);
      }
      await page.locator('.catalog-details summary').first().focus();
      await page.keyboard.press('Enter');
      assert.ok(await page.locator('.follow-story-link').first().isVisible());
      if (width <= 720) assert.ok(await page.locator('.catalog-details p').first().evaluate(element => parseFloat(getComputedStyle(element).fontSize) >= 13));
      await clear.click();
      assert.equal(await search.inputValue(), '');
      await search.fill('no-such-atlas-title');
      await page.getByRole('heading', { name: 'No stories in this selection.' }).waitFor();
      await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
      assert.ok(await page.locator('.catalog-item').count() > 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${view}: overflow ${width}`);
      checks.push(`${view} ${width}px: clear/filter targets, disclosure keyboard flow, empty-state recovery, no overflow`);
    }
    await page.goto(`${base}/#library`);
    const toggle = page.getByRole('switch', { name: 'Reduce motion' });
    if (await toggle.getAttribute('aria-checked') !== 'true') await toggle.click();
    await page.getByRole('textbox', { name: 'Search films and episodes' }).fill('A New Hope');
    const item = page.locator('.catalog-item').first();
    await item.hover();
    const motion = await item.evaluate(element => ({ duration: getComputedStyle(element).transitionDuration, orbitDuration: getComputedStyle(element.querySelector('.catalog-art-orbit')).transitionDuration }));
    assert.equal(motion.duration, '0s');
    assert.equal(motion.orbitDuration, '0s');
    await page.screenshot({ path: `${out}/verified-library-${width}.png` });
    checks.push(`${width}px: manual reduced motion disables card/art transitions`);
    await page.close();
  }
  assert.deepEqual(errors, []);
} finally {
  await writeFile(`${out}/verification.json`, JSON.stringify({ url: base, checkedAt: new Date().toISOString(), browser: browser.version(), checks, errors, limitation: 'Chromium viewport emulation; iOS focus behavior and physical-device performance were not tested.' }, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ checks, errors }, null, 2));
