import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const base = process.env.ATLAS_URL || 'http://localhost:4173';
try {
 for (const width of [1440, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const storedIds = () => page.evaluate(() => JSON.parse(localStorage.getItem('galactic-atlas.watch.v1') || '{"watchedIds":[]}').watchedIds);
  const hiddenLocations = async () => {
   await page.getByRole('button', { name: 'Reveal locations for this title' }).waitFor();
   assert.equal(await page.locator('.journey-stop').count(), 0);
   if(width < 721) assert.equal(await page.locator('.sheet-toggle').getAttribute('aria-expanded'), 'true', 'Story bridge preserves open mobile sheet');
   assert.equal(await page.getByRole('button', { name: 'Reveal locations for this title' }).count(), 1);
   assert.match(await page.locator('.journey-watch-status').innerText(), /Not marked watched/);
  };
  await page.goto(`${base}/#journey/mandalorian-s02e08`);
  if (width < 721) await page.locator('.sheet-toggle').click();
  await page.locator('.journey-current h2').waitFor();
  assert.equal(await page.locator('.journey-stop').count(), 0);
  assert.match(await page.locator('.journey-watch-status').innerText(), /Not marked watched/);
  const bridges = page.locator('.journey-bridges');
  await bridges.locator('a[href="#journey/boba-fett-s01e05"]').click();
  await page.waitForURL('**/#journey/boba-fett-s01e05');
  await hiddenLocations(); assert.deepEqual(await storedIds(), []);
  assert.match(await page.locator('.journey-current h2').innerText(), /Return of the Mandalorian/);
  await page.getByRole('button', { name: 'Reveal locations for this title' }).click();
  await page.getByRole('button', { name: 'Read Glavis Ringworld location file' }).click();
  await page.locator('.workspace-panel .station-portrait').waitFor();
  assert.equal(await page.locator('.workspace-panel-content').evaluate(el => el.scrollTop), 0, 'New destination starts at top after story scrolling');
  await page.getByRole('group', { name: 'Exploration panel views' }).getByRole('button', { name: 'Story', exact: true }).click();
  await page.getByRole('button', { name: 'Mark watched & continue', exact: true }).click();
  await page.waitForURL('**/#journey/boba-fett-s01e06');
  await hiddenLocations(); assert.deepEqual(await storedIds(), ['boba-fett-s01e05']);
  await page.getByRole('button', { name: 'Reveal locations for this title' }).click();
  const school = page.locator('.journey-stop').filter({ has: page.getByRole('heading', { name: 'Luke’s Jedi school', exact: true }) });
  assert.match(await school.innerText(), /surface site/i);
  assert.equal(await school.getByRole('button', { name: 'Luke’s Jedi school: map unavailable' }).isDisabled(), true);
  await school.getByRole('button', { name: 'Read Luke’s Jedi school location file' }).click();
  const dossier = page.locator('.workspace-panel .location-dossier');
  assert.match(await dossier.innerText(), /planet unnamed/);
  assert.equal(await dossier.locator('.atlas-portrait').count(), 0, 'School does not invent a parent globe');
  assert.equal(await dossier.getByRole('button').count(), 0, 'Textual school dossier cannot initiate warp');
  assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
  assert.deepEqual(await storedIds(), ['boba-fett-s01e05']);
  await page.getByRole('group', { name: 'Exploration panel views' }).getByRole('button', { name: 'Story', exact: true }).click();
  await bridges.locator('a[href="#journey/boba-fett-s01e07"]').click();
  await page.waitForURL('**/#journey/boba-fett-s01e07'); await hiddenLocations();
  await bridges.locator('a[href="#journey/mandalorian-s03e01"]').click();
  await page.waitForURL('**/#journey/mandalorian-s03e01'); await hiddenLocations();
  assert.deepEqual(await storedIds(), ['boba-fett-s01e05'], 'Cross-collection navigation must not transfer watched state');
  assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []); await page.close();
 }
 console.log('PASS Mando S2 finale → Boba5/6/7 → Mando S3 bridge; separate progress and reveals, school surface-site/no warp, destination scroll reset at1440/390/320');
} finally { await browser.close(); }
