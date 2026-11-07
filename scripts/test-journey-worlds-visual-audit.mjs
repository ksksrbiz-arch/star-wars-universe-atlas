import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.ATLAS_URL || 'http://localhost:4173';
const output = process.env.AUDIT_OUTPUT || 'work/audit-journey/verified';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const checks = [], errors = [];
try {
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/#galaxy`);
    await page.locator('.world-directory>summary').click();
    const directory = page.locator('.world-directory');
    await directory.getByLabel('Find a world', { exact: true }).fill('Coruscant');
    await directory.getByRole('button', { name: 'Stories at Coruscant', exact: true }).click();
    assert.equal(await directory.locator('.world-story-grid a').count(), 0, 'unwatched titles stay hidden');
    await directory.getByRole('button', { name: 'Reveal linked unwatched titles' }).click();
    const styles = await directory.locator('.world-stories').evaluate(el => ({
      inset: getComputedStyle(el).paddingLeft,
      cardWidth: el.querySelector('.world-story-grid a').getBoundingClientRect().width,
      gridWidth: el.querySelector('.world-story-grid').getBoundingClientRect().width,
      summarySize: getComputedStyle(el.querySelector('.world-story-evidence summary')).fontSize,
      fontSize: getComputedStyle(el.querySelector('input')).fontSize,
    }));
    assert.equal(styles.inset, '0px', 'directory padding must not leak into nested stories');
    assert.equal(styles.summarySize, '13px', 'source disclosure must not inherit directory heading typography');
    if (width <= 390) {
      assert.equal(styles.fontSize, '16px', 'phone search avoids small input typography');
      assert(Math.abs(styles.cardWidth - styles.gridWidth) <= 1, 'linked cards use the full nested panel width');
    }
    await directory.getByLabel('Find a linked title').fill('zzzz-no-title');
    await directory.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await directory.locator('.world-story-evidence summary').focus();
    await page.keyboard.press('Enter');
    assert(await directory.locator('.world-story-evidence').evaluate(el => el.open));
    assert(await directory.locator('.world-story-evidence li a').first().evaluate(el => el.getBoundingClientRect().height >= 44));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await directory.screenshot({ path: `${output}/directory-${width}.png` });
    await page.goto(`${base}/#journey/andor-s01e01`);
    await page.getByRole('button', { name: 'Reveal locations for this title' }).click();
    const stop = page.locator('.journey-stop').first();
    assert.equal(await stop.evaluate(el => getComputedStyle(el).animationName), 'journey-stop-enter');
    await page.waitForTimeout(600);
    assert.equal(await stop.evaluate(el => getComputedStyle(el).opacity), '1');
    await page.getByRole('switch', { name: 'Reduce motion' }).click();
    assert.equal(await stop.evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.getByRole('button', { name: 'Next story chapter' }).click();
    assert.equal(await page.getByRole('button', { name: 'Reveal locations for this title' }).count(), 1);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('.journey-panel').screenshot({ path: `${output}/journey-${width}.png` });
    checks.push({ width, ...styles, overflow: false, revealBoundary: true, keyboardSources: true, motionToggle: true });
    await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' });
  await reduced.goto(`${base}/#journey/andor-s01e01`);
  await reduced.getByRole('button', { name: 'Reveal locations for this title' }).click();
  assert.equal(await reduced.locator('.journey-stop').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  checks.push({ systemReducedMotion: true });
  await reduced.close();
  assert.deepEqual(errors, []);
  await writeFile(`${output}/results.json`, JSON.stringify({ base, checks, errors, limitation: 'Desktop Chromium and emulated widths; no physical-device performance claim.' }, null, 2));
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally { await browser.close(); }
