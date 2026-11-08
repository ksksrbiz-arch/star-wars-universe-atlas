import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = process.env.ATLAS_URL || 'http://localhost:4173';
const key = 'galactic-atlas.watch.v1', backup = `${key}.backup`;
const a = 'ot-a-new-hope';
const browser = await chromium.launch();
const checks = [], errors = [];
async function fresh(seed) {
  const context = await browser.newContext({viewport: {width: 390, height: 844}});
  await context.addInitScript(([k, v]) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1'); } }, [key, seed]);
  const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${base}/#watch`);
  await page.getByRole('button', {name: 'Import watch progress', exact: true}).waitFor();
  return {context, page};
}
const get = (page, k) => page.evaluate(k => localStorage.getItem(k), k);
const toggle = page => page.getByRole('button', {name: /Mark watched:/}).first().click();
for (const [label, seed] of [['corrupt JSON', '{broken'], ['newer version', JSON.stringify({version: 2, watchedIds: [a], extra: {x: 1}})]]) {
  const {context, page} = await fresh(seed);
  await page.locator('.storage-warning').filter({hasText: 'could not be read'}).waitFor();
  assert.equal(await get(page, key), seed, `${label}: untouched on load`);
  await toggle(page);
  await page.waitForFunction(k => { try { return JSON.parse(localStorage.getItem(k)).version === 1; } catch { return false; } }, key);
  assert.equal(await get(page, backup), seed, `${label}: raw blob backed up byte-for-byte`);
  assert.equal(JSON.parse(await get(page, key)).watchedIds.length, 1);
  await page.locator('.storage-warning').filter({hasText: backup}).waitFor();
  checks.push(`${label}: blob untouched on load, backed up before first write, toggle saved`);
  await context.close();
}
{
  const seed = JSON.stringify({version: 1, watchedIds: [a, 'future-title-1', 'future-title-2']});
  const {context, page} = await fresh(seed);
  await page.getByRole('button', {name: /Mark unwatched:/}).first().click();
  await page.waitForFunction(k => !JSON.parse(localStorage.getItem(k)).watchedIds.includes('ot-a-new-hope'), key);
  assert.deepEqual(JSON.parse(await get(page, key)).watchedIds.sort(), ['future-title-1', 'future-title-2']);
  await toggle(page);
  const saved = JSON.parse(await get(page, key)).watchedIds;
  assert.ok(saved.includes('future-title-1') && saved.includes('future-title-2') && saved.length === 3);
  assert.equal(await get(page, backup), null);
  checks.push('Unknown ids saved by another catalog version survive toggles');
  await context.close();
}
{
  const context = await browser.newContext();
  await context.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); }; });
  const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${base}/#watch`);
  await page.getByRole('button', {name: 'Import watch progress', exact: true}).waitFor();
  await toggle(page);
  await page.locator('.storage-warning').filter({hasText: 'could not save progress'}).waitFor();
  checks.push('Blocked storage still warns truthfully');
  await context.close();
}
assert.deepEqual(errors, []);
console.log(JSON.stringify({checks, errors}, null, 2));
await browser.close();
