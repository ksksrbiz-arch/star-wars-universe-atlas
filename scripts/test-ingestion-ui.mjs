import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = process.env.ATLAS_URL || 'http://localhost:4186';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aE2cAAAAASUVORK5CYII=', 'base64');
const image = { src: '/media/test/reference.png', credit: 'Lucasfilm / source fixture', sourceUrl: 'https://www.starwars.com/databank/tatooine' };
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/media/test/**', async route => {
      requests.push(route.request().url());
      if (route.request().url().includes('missing')) return route.fulfill({ status: 404, body: '' });
      return route.fulfill({ contentType: 'image/png', body: pixel });
    });
    let calls = 0;
    await page.route('**/api/databank?**', async route => {
      calls++;
      await new Promise(resolve => setTimeout(resolve, 180));
      const url = new URL(route.request().url()), type = url.searchParams.get('type'), q = url.searchParams.get('q'), offset = Number(url.searchParams.get('offset'));
      if (q === 'offline') return route.fulfill({ status: 503, json: { error: 'Unavailable' } });
      const name = type === 'character' ? 'Leia Organa' : offset ? 'Bespin' : 'Tatooine';
      const items = q === 'missing' ? [] : [{ id: `databank:${name}`, provider: 'databank', providerId: name, entityType: type, name, description: 'Hidden source details about the saga.', sourceUrl: 'https://www.starwars.com/databank/tatooine', image: { ...image, ...(type === 'character' ? { src: '/media/test/missing.png' } : {}) } }];
      return route.fulfill({ json: { items, total: q === 'missing' ? 0 : 25, limit: 12, offset } });
    });
    await page.route('**/api/media-index', async route => {
      await new Promise(resolve => setTimeout(resolve, 180));
      return route.fulfill({ json: { items: [{ ...image, entityId: 'mandalorian-s01e01', entityType: 'episode', provider: 'tvmaze' }, { ...image, entityId: 'mandalorian-s01e02', entityType: 'episode', provider: 'tvmaze' }, { ...image, entityId: 'tatooine', entityType: 'world', provider: 'databank' }] } });
    });
    await page.goto(`${base}/#library`);
    await page.getByText('Explore the Galactic Databank', { exact: true }).click();
    assert.equal(calls, 0, 'Databank records not fetched before consent');
    assert.equal(await page.locator('.databank-card').count(), 0);
    await page.getByRole('checkbox', { name: /Reveal story imagery and details/ }).check();
    await page.locator('.databank-card').first().waitFor();
    assert.equal(await page.locator('.databank-card h2').innerText(), 'Tatooine');
    await page.locator('.databank-card img').waitFor();
    await page.waitForFunction(() => document.querySelector('.databank-card img')?.naturalWidth > 0);
    assert.match(await page.locator('.databank-card').innerText(), /Hidden source details/);
    assert.equal(await page.locator('.databank-card figcaption a').getAttribute('href'), image.sourceUrl);
    await page.getByRole('navigation', { name: 'Databank result pages' }).getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('heading', { name: 'Bespin', exact: true }).waitFor();
    await page.getByRole('group', { name: 'Databank entry type' }).getByRole('button', { name: 'Characters', exact: true }).click();
    await page.getByRole('heading', { name: 'Leia Organa', exact: true }).waitFor();
    await page.getByText('Reference image unavailable', { exact: true }).waitFor();
    const search = page.getByRole('searchbox', { name: 'Search the Galactic Databank' });
    await search.fill('missing');
    await page.getByText('No matching entries. Try another name or switch the entry type.', { exact: true }).waitFor();
    await search.fill('offline');
    await page.getByText('The Databank is temporarily unavailable. Your story library is still available below.', { exact: true }).waitFor();
    assert(await page.locator('.catalog-item').count() > 0);
    await page.getByRole('checkbox', { name: /Reveal story imagery and details/ }).uncheck();
    assert.equal(await page.locator('.databank-card').count(), 0);
    assert.equal(await page.locator('.databank-card img').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width} Library fits viewport`);

    await page.goto(`${base}/#journey/mandalorian-s01e01`);
    if (width < 721 && await page.locator('.sheet-toggle').getAttribute('aria-expanded') === 'false') await page.locator('.sheet-toggle').click();
    const frame = page.locator('.source-media-episode');
    await frame.getByRole('button', { name: 'Reveal image for this title', exact: true }).waitFor();
    assert.equal(await frame.locator('img').count(), 0, 'Episode frame concealed before reveal');
    await frame.getByRole('button', { name: 'Reveal image for this title', exact: true }).click();
    await frame.locator('img').waitFor();
    assert.equal(await page.locator('.journey-stop').count(), 0, 'Image disclosure does not reveal location joins');
    assert.equal(await page.evaluate(() => localStorage.getItem('galactic-atlas.watch.v1')), null);
    await page.getByRole('button', { name: 'Next story chapter', exact: true }).click();
    await frame.getByRole('button', { name: 'Reveal image for this title', exact: true }).waitFor();
    assert.equal(await frame.locator('img').count(), 0, 'Image disclosure does not carry into next title');
    await page.getByRole('button', { name: 'Reveal locations for this title', exact: true }).click();
    await frame.locator('img').waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width} Journey fits viewport`);
    assert.deepEqual(errors, []);
    assert(requests.length > 0);
    await page.close();
  }
  console.log('PASS ingestion UI: explicit spoiler opt-in, delayed API rendering, images/credits/fallback, pagination/search, API failure, title-specific reveal at 1440/390/320.');
} finally { await browser.close(); }
