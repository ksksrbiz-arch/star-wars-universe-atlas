import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
const errors = [], warnings = [], checks = [];
let stage = 'initial load';
page.on('pageerror', e => errors.push(e.message));
page.on('console', message => {
  if (message.type() === 'error') errors.push(`${stage}: ${message.text()}`);
  if (/shader|WebGL|context lost/i.test(message.text()) && message.type() === 'warning') warnings.push(message.text());
});
const current = () => page.locator('.current-location strong').innerText();
const waitCurrent = name => page.waitForFunction(n => document.querySelector('.current-location strong')?.textContent === n, name);
const settled = () => page.locator('.transit-panel').waitFor({ state: 'detached' });
async function start(name) {
  await page.getByRole('button', { name: 'Reset map view', exact: true }).click();
  await page.locator('.destination-card').filter({ has: page.locator('strong', { hasText: new RegExp(`^${name}$`) }) }).click();
  await page.getByRole('button', { name: `Jump to ${name}`, exact: true }).first().click();
  await page.locator('.transit-panel').waitFor();
}
try {
  await page.clock.install();
  await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#galaxy");
  await page.locator('canvas').waitFor();
  await page.getByRole('combobox', { name: 'Graphics quality' }).selectOption('balanced');
  const initial = await current();
  // Freeze travel time while scheduling controls; advance frames explicitly for partial warps.
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
  for (let i = 0; i < 3; i++) {
    stage = `cancel cycle ${i + 1}`;
    await start('Alderaan');
    assert.equal(await page.getByRole('combobox', { name: 'Graphics quality' }).isDisabled(), true);
    await page.clock.runFor(150);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await settled();
    assert.equal(await current(), initial);
  }
  checks.push('Three repeated partial warps cancel to the committed origin; graphics quality is locked during transit.');
  await start('Alderaan');
  await page.getByRole('button', { name: 'Skip animation', exact: true }).click();
  await waitCurrent('Alderaan'); await settled();
  await page.getByRole('button', { name: 'Return to previous world', exact: true }).click();
  await waitCurrent(initial);
  checks.push('Skip commits once and Back restores the departure destination.');

  for (const target of ['Library', 'Journey', 'Release timeline']) {
    stage = `section change ${target}`;
    await start('Alderaan');
    await page.getByRole('link', { name: target, exact: true }).click();
    await page.getByRole('link', { name: 'Galaxy', exact: true }).click();
    await page.locator('canvas').waitFor();
    await settled();
    assert.equal(await current(), initial);
  }
  checks.push('Rapid Library/Journey/Timeline changes during warp cancel cleanly and remount the map without committing a stale arrival.');

  stage = 'reduced motion mid-warp';
  await start('Alderaan');
  // Trigger the genuine control without scrolling away from the active canvas.
  await page.getByRole('switch', { name: 'Reduce motion' }).evaluate(button => button.click());
  await waitCurrent('Alderaan'); await settled();
  assert.equal(await page.getByRole('switch', { name: 'Reduce motion' }).getAttribute('aria-checked'), 'true');
  await page.clock.fastForward(2200);
  assert.equal(await current(), 'Alderaan');
  await page.getByRole('switch', { name: 'Reduce motion' }).evaluate(button => button.click());
  checks.push('Enabling reduced motion mid-warp settles immediately; the old animation cannot produce a delayed second arrival.');

  stage = 'cinematic quality and resize';
  await page.getByRole('combobox', { name: 'Graphics quality' }).selectOption('cinematic');
  await start('Yavin 4');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.runFor(100);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.clock.resume();
  await waitCurrent('Yavin 4'); await settled();
  assert.equal(await page.getByRole('combobox', { name: 'Graphics quality' }).isEnabled(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.getByRole('button', { name: 'Return to previous world', exact: true }).click();
  await waitCurrent('Alderaan');
  checks.push('Cinematic warp completes through portrait/landscape viewport changes; controls unlock and Back remains valid.');

  stage = 'final cinematic completion';
  await start('Tatooine');
  await waitCurrent('Tatooine'); await settled();
  assert.deepEqual(errors, []);
  assert.equal(warnings.some(w => /shader.*error|context lost/i.test(w)), false);
  checks.push('Balanced and cinematic shaders rendered during travel without browser/console errors or context-loss warnings.');
} finally {
  const result = { checkedAt: new Date().toISOString(), browser: await browser.version(), environment: 'Headless Chromium with software WebGL; viewport orientation changes, not physical-device performance evidence.', checks, errors, warnings };
  await writeFile('evidence/visual-lifecycle-results.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}
