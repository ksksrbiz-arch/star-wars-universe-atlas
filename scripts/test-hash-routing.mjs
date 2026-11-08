import { chromium } from 'playwright';
import assert from 'node:assert/strict';

// Hash routing: same-hash re-navigation, bare #galaxy, Journey nav keeps the chapter,
// unknown ids are normalised, route changes retitle the document and move focus.
const url = process.env.ATLAS_URL || 'http://localhost:4173';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const hash = () => page.evaluate(() => location.hash);
  const preview = () => page.locator('.world-dossier h2').textContent();
  const here = name => page.waitForFunction(n => document.querySelector('.current-location strong')?.textContent === n, name);
  // Same as clicking an in-page `<a href="#...">`: only fires hashchange when the hash really changes.
  const goto = async h => { await page.evaluate(v => { location.hash = v; }, h); await page.waitForTimeout(250); };
  const jumpTo = async name => {
    await goto(`#galaxy/${name.toLowerCase()}`);
    await page.getByRole('button', { name: `Jump to ${name}`, exact: true }).first().click();
    const skip = page.getByRole('button', { name: 'Skip animation' });
    if (await skip.count()) await skip.evaluate(el => el.click());
    await here(name);
  };

  // 5. unknown ids are normalised on load and on navigation
  await page.goto(`${url}/#galaxy/not-a-world`);
  await page.locator('.world-dossier h2').waitFor();
  assert.equal(await hash(), '#galaxy', 'unknown world id normalised on load');
  await goto('#journey/not-a-chapter');
  assert.equal(await hash(), '#journey', 'unknown chapter id normalised on navigation');
  assert.match(await page.title(), /^Story journey/);

  // 6. title per section; focus moves on route change but not on load
  const fresh = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  await fresh.goto(`${url}/#galaxy`);
  await fresh.locator('.world-dossier h2').waitFor();
  assert.match(await fresh.title(), /^Galaxy map/);
  assert.equal(await fresh.evaluate(() => document.activeElement === document.body), true, 'initial load does not steal focus');
  await fresh.close();
  await page.goto(`${url}/#galaxy`);
  await page.locator('.world-dossier h2').waitFor();
  await page.getByRole('link', { name: 'Library', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.matches('.platform-main h1, .platform-main h2'));
  assert.match(await page.title(), /^Library/);
  await page.getByRole('link', { name: 'Galaxy', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.matches('#atlas h1'));
  assert.match(await page.title(), /^Galaxy map/);

  // 2. after back (and cancel) the same #galaxy/<id> link re-selects the world
  await jumpTo('Hoth');
  await page.getByRole('button', { name: 'Return to previous world' }).click();
  await here('Tatooine');
  assert.equal(await preview(), 'Tatooine', 'back resets preview');
  await page.getByRole('button', { name: 'Explore Hoth', exact: true }).click();
  assert.equal(await hash(), '#galaxy/hoth');
  await goto('#galaxy/hoth'); // no-op: already there
  await page.getByRole('button', { name: 'Reset map view' }).click();
  await goto('#galaxy/alderaan');
  assert.equal(await preview(), 'Alderaan');
  // cancel path
  await page.getByRole('button', { name: 'Jump to Alderaan', exact: true }).first().click();
  const cancel = page.getByRole('button', { name: 'Cancel', exact: true });
  await cancel.waitFor();
  await cancel.evaluate(el => el.click());
  assert.equal(await preview(), 'Tatooine', 'cancel returns the preview to the current world');
  await goto('#galaxy/alderaan');
  assert.equal(await preview(), 'Alderaan', 'same link re-selects after cancel');

  // 3. bare #galaxy means no preview, not the first world
  await jumpTo('Hoth');
  await page.getByRole('link', { name: 'Journey', exact: true }).click();
  await page.getByRole('link', { name: 'Galaxy', exact: true }).click();
  await page.waitForTimeout(250);
  assert.equal(await hash(), '#galaxy');
  assert.equal(await preview(), 'Hoth', 'bare #galaxy keeps the current world as the preview');
  assert.equal(await page.locator('.map-jump-bar').count(), 0, 'no destination bar for bare #galaxy');

  // 4. Journey nav while in Journey keeps the chapter
  await page.goto(`${url}/#journey/ot-empire-strikes-back`);
  await page.locator('.journey-current h2').waitFor();
  assert.equal(await page.locator('.journey-current h2').innerText(), 'The Empire Strikes Back');
  await page.getByRole('link', { name: 'Journey', exact: true }).click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.journey-current h2').innerText(), 'The Empire Strikes Back', 'Journey nav keeps chapter');
  assert.equal(await hash(), '#journey/ot-empire-strikes-back', 'URL keeps identifying the chapter');

  assert.deepEqual(errors, [], 'no page errors');
  console.log(JSON.stringify({ unknownIdsNormalised: true, titlesAndFocus: true, sameHashReselects: true, bareGalaxyNoPreview: true, journeyNavKeepsChapter: true }));
} finally { await browser.close(); }
