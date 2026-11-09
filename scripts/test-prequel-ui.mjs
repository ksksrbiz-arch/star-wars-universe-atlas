import { newSpoilerProtectedPage } from './lib-spoiler-testing.mjs';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { CONNECTIONS } from '../src/connections.ts';

const base = process.env.ATLAS_URL || 'http://localhost:4173';
const ids = ['pt-phantom-menace', 'pt-attack-of-the-clones', 'pt-revenge-of-the-sith'];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
try {
  for (const width of [1440, 390, 320]) {
    const page = await newSpoilerProtectedPage(browser, { viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/#journey/${ids[0]}`);
    if (width < 721) await page.locator('.sheet-toggle').click();
    for (const [index, id] of ids.entries()) {
      await page.waitForURL(`**/#journey/${id}`);
      assert.match(await page.locator('.journey-item-meta').innerText(), /FEATURE FILM/);
      assert.equal(await page.locator('.journey-stop').count(), 0, 'Each new film starts with locations hidden');
      await page.getByRole('button', { name: 'Reveal locations for this title', exact: true }).click();
      const expected = CONNECTIONS.filter(row => row.itemId === id);
      assert(expected.length >= 3, 'A reviewed film must have meaningful location coverage');
      assert.equal(await page.locator('.journey-stop').count(), expected.length);
      assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine', 'Revealing locations does not travel');
      if (index < ids.length - 1) await page.getByRole('button', { name: 'Mark watched & continue', exact: true }).click();
    }
    const watched = await page.evaluate(() => JSON.parse(localStorage.getItem('galactic-atlas.watch.v1')).watchedIds);
    assert.deepEqual([...watched].sort(), ids.slice(0, 2).sort());
    const mustafar = page.getByRole('button', { name: 'Show Mustafar on map', exact: true });
    await mustafar.click();
    assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
    await page.locator('.map-jump-bar').getByRole('button', { name: 'Jump to Mustafar', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.current-location strong')?.textContent === 'Mustafar');
    assert.equal(await page.locator('.galaxy-canvas canvas').count(), 1);
    if (width < 721 && await page.locator('.sheet-toggle').getAttribute('aria-expanded') === 'false') await page.locator('.sheet-toggle').click();
    await page.getByRole('group', { name: 'Exploration panel views' }).getByRole('button', { name: 'Story', exact: true }).click();
    assert.equal(await page.locator('.journey-stop').count(), CONNECTIONS.filter(row => row.itemId === ids[2]).length);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('PASS prequel three-film progression, explicit reveal, separate watch state, Mustafar preview/arrival, one canvas and responsive layout at1440/390/320');
} finally { await browser.close(); }
