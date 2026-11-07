import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.ATLAS_URL || 'http://localhost:4173');
    const search = page.getByRole('searchbox', { name: 'Search worlds' });
    const finder = page.getByRole('combobox', { name: 'Find a mapped world' });
    const region = page.getByRole('combobox', { name: 'Region', exact: true });
    await search.waitFor();
    assert.equal(await finder.locator('option').count(), 62);
    await search.fill('hOtH');
    assert.equal(await finder.locator('option[value="hoth"]').count(), 1);
    await finder.selectOption('hoth');
    assert.equal(await page.locator('.world-title h2').textContent(), 'Hoth');
    assert.equal(await page.locator('.current-location strong').textContent(), 'Tatooine', 'search previews without committing arrival');
    await search.fill('K-18');
    assert.ok(await finder.locator('option[value="hoth"]').count());
    assert.ok(await finder.locator('option[value="bespin"]').count());
    await search.fill('no-such-world');
    assert.ok(await finder.isDisabled());
    assert.ok(await page.getByText('No mapped worlds match these filters.', { exact: false }).isVisible());
    await page.getByRole('button', { name: 'Reset world filters' }).click();
    assert.equal(await finder.locator('option').count(), 62);
    assert.equal(await finder.inputValue(), 'hoth', 'reset preserves selection');
    await region.selectOption({ label: 'Core Worlds' });
    assert.ok(await finder.locator('option[value="coruscant"]').count());
    assert.equal(await finder.locator('option[value="hoth"]').count(), 0);
    await page.getByRole('button', { name: 'Reset world filters' }).click();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal overflow');
    assert.deepEqual(errors, []);
    console.log(`World search passed: ${width}px, name/grid/region, empty state, reset, selection preservation.`);
    await page.close();
  }
} finally { await browser.close(); }
