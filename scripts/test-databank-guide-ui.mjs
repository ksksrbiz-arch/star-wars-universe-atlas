import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { DATABANK_GUIDES } from '../src/databankGuides.ts';

const base = process.env.ATLAS_URL || 'http://localhost:4173';
const out = process.env.ATLAS_EVIDENCE_DIR || 'evidence/databank-expansion/local';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--disable-gpu'] });
const results = [];
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    let externalRequests = 0;
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://www.starwars.com/**', route => { externalRequests++; return route.abort(); });
    await page.goto(base + '/#galaxy/naboo');
    if (width < 721) await page.locator('.sheet-toggle').click();
    const guide = page.getByRole('region', { name: 'Naboo official Databank guide', exact: true });
    await guide.waitFor();
    assert.match(await guide.innerText(), /temperate/);
    assert.equal(await guide.getByRole('link', { name: 'Padmé Amidala', exact: true }).count(), 0);
    const reveal = guide.getByRole('button', { name: 'Reveal Databank connections and media for Naboo', exact: true });
    await page.keyboard.press('Tab');
    await reveal.focus();
    assert(await reveal.evaluate(el => el.matches(':focus-visible')));
    await page.keyboard.press('Enter');
    assert.equal(await guide.getByRole('button', { name: 'Hide Databank connections and media for Naboo', exact: true }).getAttribute('aria-expanded'), 'true');
    for (const connection of DATABANK_GUIDES.naboo.connections) {
      const link = guide.getByRole('link', { name: connection.name, exact: true });
      assert.equal(await link.getAttribute('href'), connection.sourceUrl);
    }
    assert.equal(await guide.locator('.databank-media li').count(), 2);
    assert.equal(await guide.locator('img,iframe,video').count(), 0);
    assert.equal(await page.locator('.world-story-grid a').count(), 0);
    assert.equal(await page.evaluate(() => localStorage.getItem('galactic-atlas.watch.v1')), null);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    for (const link of await guide.locator('a').all()) {
      const box = await link.boundingBox();
      assert(box && box.height >= 44, 'Source links retain touch targets');
    }
    await guide.locator('header').scrollIntoViewIfNeeded();
    await page.locator('.workspace-panel').screenshot({ path: `${out}/naboo-${width}.png` });
    await guide.locator('.databank-media').scrollIntoViewIfNeeded();
    await page.locator('.workspace-panel').screenshot({ path: `${out}/naboo-media-${width}.png` });
    await guide.getByRole('button', { name: 'Hide Databank connections and media for Naboo', exact: true }).click();
    assert.equal(await guide.getByRole('link', { name: 'Padmé Amidala', exact: true }).count(), 0);
    // Browse an unplaced destination through the existing directory workflow.
    await page.locator('#world-directory>summary').click();
    const directory = page.getByRole('region', { name: 'World directory', exact: true });
    await directory.getByLabel('Find a world').fill('Serenno');
    await directory.locator('.directory-grid button').first().click();
    const serenno = page.getByRole('region', { name: 'Serenno official Databank guide', exact: true });
    await serenno.waitFor();
    assert.equal(await serenno.getByRole('link', { name: 'Count Dooku', exact: true }).count(), 0);
    await serenno.getByRole('button', { name: 'Reveal Databank connections and media for Serenno', exact: true }).click();
    assert.equal(await serenno.locator('.databank-media li').count(), 5);
    assert.match(await serenno.innerText(), /15 images/);
    assert.equal(await serenno.getByRole('link', { name: 'Serenno History Gallery', exact: true }).getAttribute('href'), 'https://www.starwars.com/databank/serenno');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await serenno.locator('.databank-media').screenshot({ path: `${out}/serenno-${width}.png` });
    await directory.getByLabel('Find a world').fill('Naboo');
    await directory.locator('.directory-grid button').first().click();
    const directoryNaboo = page.locator('.directory-stories').getByRole('region', { name: 'Naboo official Databank guide', exact: true });
    await directoryNaboo.waitFor();
    assert.equal(await directoryNaboo.getByRole('button').getAttribute('aria-expanded'), 'false', 'Serenno consent must not reveal another directory destination');
    assert.equal(await directoryNaboo.getByRole('link', { name: 'Padmé Amidala', exact: true }).count(), 0);
    assert.equal(externalRequests, 0, 'Bundled guide and link fallback work without third-party media requests');
    assert.deepEqual(errors, []);
    results.push({ width, keyboardRevealHide: true, sourceLinks: true, noWatchMutation: true, noMediaRequestsRequired: true, directoryAccess: true, noOverflow: true, errors });
    console.log(`PASS ${width}px Databank destination and directory checks`);
    await page.close();
  }
  console.log('PASS Databank facts, gated connections/media, official links, keyboard focus, touch targets, directory access and watch isolation at 1440/390/320');
} finally {
  await browser.close();
  await writeFile(`${out}/results.json`, JSON.stringify({ base, checkedAt: new Date().toISOString(), results, limitation: 'Desktop Chromium with emulated phone widths; external player playback and physical devices not tested.' }, null, 2));
}
