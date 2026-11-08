import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { CONNECTIONS } from '../src/connections.ts';
const base = process.env.ATLAS_URL || 'http://localhost:4175';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
try {
 for (const width of [1440, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/#galaxy');
  await page.getByRole('button', { name: 'Search the atlas', exact: true }).click();
  const search = page.getByRole('combobox', { name: 'World, location, movie, episode or collection' });
  await search.fill('Rebels S01E02');
  assert.equal(await page.getByRole('dialog').getByRole('option').count(), 1, 'Official part two resolves to the combined premiere');
  assert.match(await page.getByRole('dialog').getByRole('option').innerText(), /S01E01–02/);
  await search.press('Enter'); await page.waitForURL('**/#journey/rebels-s01e01');
  if (width < 721) await page.locator('.sheet-toggle').click();
  assert.match(await page.locator('.journey-item-meta').innerText(), /EPISODES 1–2/);
  assert.equal(await page.locator('.journey-stop').count(), 0);
  await page.getByRole('button', { name: 'Reveal locations for this title', exact: true }).click();
  assert.equal(await page.locator('.journey-stop').count(), CONNECTIONS.filter(row => row.itemId === 'rebels-s01e01').length);
  await page.getByRole('button', { name: 'Show Lothal on map', exact: true }).click();
  assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
  await page.locator('.map-jump-bar').getByRole('button', { name: 'Jump to Lothal', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.current-location strong')?.textContent === 'Lothal');
  if (width < 721 && await page.locator('.sheet-toggle').getAttribute('aria-expanded') === 'false') await page.locator('.sheet-toggle').click();
  await page.getByRole('group', { name: 'Exploration panel views' }).getByRole('button', { name: 'Story', exact: true }).click();
  await page.getByRole('button', { name: 'Mark watched & continue', exact: true }).click();
  await page.waitForURL('**/#journey/rebels-s01e03');
  assert.match(await page.locator('.journey-current h2').innerText(), /Droids in Distress/i);
  assert.equal(await page.locator('.journey-stop').count(), 0);
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('galactic-atlas.watch.v1')).watchedIds), ['rebels-s01e01']);
  await page.getByRole('link', { name: 'Library', exact: true }).click();
  await page.locator('.collection-tabs').getByRole('button', { name: /Rebels/ }).click();
  await page.getByLabel('Search films and episodes').fill('S01E02');
  assert.equal(await page.locator('.catalog-item').count(), 1);
  assert.match(await page.locator('.catalog-kicker').innerText(), /E01–02/);
  assert.match(await page.locator('.catalog-item h2').innerText(), /Spark of Rebellion/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []); await page.close();
 }
 console.log('PASS Rebels combined premiere range/search aliases, single progress record, official episode3 advance, explicit reveal and Lothal travel at1440/390/320');
} finally { await browser.close(); }
