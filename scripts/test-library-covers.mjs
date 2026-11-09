import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const base = process.env.ATLAS_URL || 'http://localhost:4187';
const live = 'https://star-wars-universe-atlas.skdev-371.workers.dev';
const out = process.env.ATLAS_EVIDENCE_DIR || 'evidence/library-covers';
const covers = JSON.parse(await readFile('src/filmCovers.generated.json', 'utf8')).items;
const catalog = JSON.parse(await readFile('src/catalog.generated.json', 'utf8')).items;
const indexResponse = await fetch(live + '/api/media-index'); assert(indexResponse.ok);
const media = (await indexResponse.json()).items;
const mediaKeys = new Set(media.map(item => `${item.entityType}:${item.entityId}`));
const checks = [];
assert.equal(covers.length, catalog.filter(item => item.kind === 'film').length);
assert.equal(new Set(covers.map(item => item.entityId)).size, 12);
for (const item of catalog) {
  assert(item.kind === 'film' ? covers.some(cover => cover.entityId === item.id) : mediaKeys.has(`episode:${item.id}`) || mediaKeys.has(`series:${item.seriesId}`), `No art for ${item.id}`);
}
for (const cover of covers) {
  assert.equal(new URL(cover.sourceUrl).hostname, 'www.starwars.com');
  assert(cover.credit && cover.useBasis && cover.pageSha256);
  for (const variant of cover.variants) {
    const response = await fetch(live + variant.src); assert(response.ok, variant.src);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(createHash('sha256').update(bytes).digest('hex'), variant.sha256);
    assert.equal(bytes.length, variant.bytes);
    assert.equal(response.headers.get('content-type')?.split(';')[0], variant.mime);
  }
}
checks.push('All 327 records resolve to film artwork, an episode still or a labeled series poster; all 24 film derivatives delivered with exact hashes');
await mkdir(out, {recursive: true});
const browser = await chromium.launch({args: ['--disable-gpu']});
async function loaded(image) {
  await image.scrollIntoViewIfNeeded();
  await image.evaluate(async element => { await element.decode(); });
  assert(await image.evaluate(element => element.naturalWidth > 1));
}
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({viewport: {width, height: 1000}, reducedMotion: 'reduce'});
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    // Local preview exercises the live read-only media service, not tiny image fixtures.
    if (!base.startsWith(live)) await page.route(/\/(?:api|media)\//, async route => {
      const url = new URL(route.request().url());
      await route.fulfill({response: await page.request.fetch(live + url.pathname + url.search)});
    });
    await page.goto(base + '/#library');
    await page.locator('.catalog-cover img').first().waitFor();
    await loaded(page.locator('.catalog-cover img').first());
    await page.waitForFunction(() => document.querySelectorAll('.catalog-cover').length === 24);
    assert.equal(await page.locator('.catalog-cover').count(), 24);
    const search = page.getByRole('textbox', {name: 'Search films and episodes'});
    if (width === 1440) {
      for (const film of catalog.filter(item => item.kind === 'film')) {
        await search.fill(film.title);
        const row = page.locator('.catalog-item').filter({has: page.getByRole('heading', {name: film.title, exact: true})});
        await loaded(row.locator('.catalog-cover img'));
        assert.match(await row.locator('.catalog-cover figcaption').innerText(), /Film poster/);
      }
      for (const seriesId of new Set(catalog.filter(item => item.kind === 'episode').map(item => item.seriesId))) {
        const episode = catalog.find(item => item.kind === 'episode' && item.seriesId === seriesId);
        await search.fill(episode.title);
        const row = page.locator('.catalog-item').filter({has: page.getByRole('heading', {name: episode.title, exact: true})}).first();
        await loaded(row.locator('.catalog-cover img'));
      }
      checks.push('Decoded all 12 film posters and a real image from each of eight series in the browser');
    }
    await search.fill('');
    await page.locator('.library-toolbar').scrollIntoViewIfNeeded();
    await loaded(page.locator('.catalog-cover img').nth(1));
    await page.locator('.library-toolbar').scrollIntoViewIfNeeded();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px overflow`);
    assert.equal(await page.evaluate(() => localStorage.getItem('galactic-atlas.watch.v1')), null);
    assert.deepEqual(errors, []);
    await page.screenshot({path: `${out}/library-${width}.png`});
    checks.push(`${width}px default artwork decoded, labeled sources, no horizontal overflow or changed watch progress`);
    await page.unrouteAll({behavior: 'wait'});
    await page.close();
  }
  // A missing episode image must fall through to its show poster; missing both
  // keeps the title/controls usable with the original typographic fallback.
  const page = await browser.newPage({viewport: {width: 390, height: 1000}, reducedMotion: 'reduce'});
  const episode = media.find(item => item.entityId === 'mandalorian-s01e01' && item.entityType === 'episode');
  const series = media.find(item => item.entityId === 'mandalorian' && item.entityType === 'series');
  const episodePaths = [episode.src, ...(episode.srcSet || '').split(',').map(part => part.trim().split(/\s+/)[0])];
  await page.route('**/api/media-index', route => route.fulfill({json: {items: [episode, series]}}));
  await page.route('**/media/**', async route => {
    const url = new URL(route.request().url());
    if (episodePaths.includes(url.pathname)) return route.fulfill({status: 404, body: ''});
    await route.fulfill({response: await page.request.fetch(live + url.pathname)});
  });
  await page.goto(base + '/#library');
  await page.getByRole('textbox', {name: 'Search films and episodes'}).fill('The Mandalorian');
  await loaded(page.locator('.catalog-cover img').first());
  assert.match(await page.locator('.catalog-cover figcaption').first().innerText(), /Series poster/);
  await page.evaluate(() => localStorage.setItem('atlas:hide-spoilers:v1', 'true'));
  await page.reload();
  await page.getByRole('textbox', {name: 'Search films and episodes'}).fill('The Mandalorian');
  await loaded(page.locator('.catalog-cover img').first());
  assert.equal(await page.locator('.catalog-cover-still').count(), 0);
  await page.route('**/media/**', route => route.fulfill({status: 404, body: ''}));
  await page.reload();
  await page.getByRole('textbox', {name: 'Search films and episodes'}).fill('The Mandalorian');
  await page.locator('.catalog-art').first().scrollIntoViewIfNeeded();
  await page.locator('.catalog-art').first().waitFor();
  assert(await page.getByRole('heading', {name: 'Chapter 1: The Mandalorian', exact: true}).isVisible());
  checks.push('Episode-load failure falls back to series art; optional protection uses series posters; both missing preserves usable typographic fallback');
  await page.unrouteAll({behavior: 'wait'});
  await page.close();
} finally {
  for (const context of browser.contexts()) for (const page of context.pages()) await page.unrouteAll({behavior: 'ignoreErrors'});
  await browser.close();
}
await writeFile(`${out}/checks.json`, JSON.stringify({base, checkedAt: new Date().toISOString(), checks}, null, 2) + '\n');
console.log(JSON.stringify(checks, null, 2));
