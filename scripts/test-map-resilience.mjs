import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const url = process.env.ATLAS_URL || 'http://localhost:4173';
const checks = [];
for (const webgl of [false, true]) {
  const browser = await chromium.launch({ args: webgl ? ['--enable-unsafe-swiftshader'] : ['--disable-webgl'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
    await page.goto(`${url}/#galaxy`);
    const current = () => page.locator('.current-location strong').innerText();
    if (!webgl) {
      await page.getByText('The interactive map is unavailable.', { exact: false }).waitFor();
      await page.getByRole('combobox', { name: 'Find a mapped world' }).selectOption('hoth');
      await page.getByRole('button', { name: 'Jump to Hoth', exact: true }).first().click();
      assert.equal(await current(), 'Hoth');
      assert.equal(await page.locator('.transit-panel').count(), 0);
      await page.getByRole('button', { name: 'Return to previous world', exact: true }).click();
      assert.equal(await current(), 'Tatooine');
      await page.getByRole('link', { name: 'Library', exact: true }).click();
      await page.locator('.platform-main').waitFor();
      checks.push('Disabled WebGL retains world selection, immediate travel, Back and Library navigation.');
    } else {
      await page.getByRole('button', { name: 'Explore Tatooine', exact: true }).waitFor();
      for (const target of ['library', 'journey', 'atlas']) {
        await page.getByRole('combobox', { name: 'Find a mapped world' }).selectOption('alderaan');
        await page.getByRole('button', { name: 'Jump to Alderaan', exact: true }).first().click();
        await page.locator('.transit-panel').waitFor();
        // Hash navigation also covers bookmarks and browser history, not only nav click handlers.
        await page.evaluate(hash => { location.hash = hash; }, target);
        await page.waitForTimeout(2300);
        await page.getByRole('link', { name: 'Galaxy', exact: true }).click();
        await page.locator('.page-intro h1').waitFor({ state: 'visible' });
        await page.locator('.transit-panel').waitFor({ state: 'detached' });
        assert.equal(await current(), 'Tatooine', `${target} must cancel the pending arrival`);
      }
      checks.push('Direct hash changes to Library, Journey and home cancel travel without a stale arrival.');
    }
  } finally { await browser.close(); }
}
console.log(JSON.stringify({ checks }, null, 2));
