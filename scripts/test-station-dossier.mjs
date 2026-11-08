import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const base = process.env.ATLAS_URL || 'http://localhost:4173';
try {
 for (const width of [1440, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/#journey/boba-fett-s01e05`);
  if (width < 721) await page.locator('.sheet-toggle').click();
  await page.getByRole('button', { name: 'Reveal locations for this title' }).click();
  await page.getByRole('button', { name: 'Read Glavis Ringworld location file' }).click();
  const dossier = page.locator('.workspace-panel .location-dossier');
  await dossier.getByRole('heading', { name: 'Glavis Ringworld', exact: true }).waitFor();
  assert.equal(await dossier.locator('.station-portrait').count(), 1);
  assert.equal(await dossier.locator('.portrait-disc').count(), 0, 'Station must not inherit a planet globe');
  assert.match(await dossier.getByRole('img').getAttribute('aria-label'), /ring station.*not to scale/);
  assert.match(await dossier.innerText(), /STRUCTURE & LIGHT/);
  assert.match(await dossier.locator('.location-placement').innerText(), /position not established/);
  assert.equal(await dossier.getByRole('link', { name: 'Structure source' }).getAttribute('href'), 'https://www.starwars.com/databank/glavis-ringworld');
  const plates = dossier.locator('details').filter({ hasText: 'Eclipse plates' });
  await plates.locator('summary').focus(); await page.keyboard.press('Enter');
  assert.equal(await plates.getAttribute('open'), '');
  assert.equal(await page.locator('.current-location strong').innerText(), 'Tatooine');
  assert.equal(await page.evaluate(() => localStorage.getItem('galactic-atlas.watch.v1')), null);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.goto(`${base}/#galaxy/`); await page.reload();
  await page.locator('#world-directory>summary').click();
  const directory = page.getByRole('region', { name: 'World directory', exact: true });
  await directory.getByLabel('Find a world').fill('Glavis');
  await directory.locator('.directory-grid button').first().click();
  assert.equal(await directory.locator('.directory-stories .station-portrait').count(), 1);
  assert.equal(await directory.locator('.directory-stories .immersive-dossier').count(), 1);
  assert.deepEqual(errors, []);
  await page.close();
 }
 console.log('PASS Glavis static station illustration, source/disclosure access, no false map/progress changes, Journey and Directory at 1440/390/320');
} finally { await browser.close(); }
