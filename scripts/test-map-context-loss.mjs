import { chromium } from 'playwright';
import assert from 'node:assert/strict';

// Forces a WebGL context loss after the map is up and checks that the host is told
// (map-only controls disabled) and that restoring the context does not throw.
const url = process.env.ATLAS_URL || 'http://localhost:4173';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${url}/#galaxy`);
  await page.getByRole('button', { name: 'Explore Hoth', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Zoom in', exact: true }).isDisabled(), false, 'zoom enabled before loss');
  const lost = await page.evaluate(() => new Promise(resolve => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const ext = gl?.getExtension('WEBGL_lose_context');
    if (!ext) return resolve(false);
    window.__loseContext = ext;
    canvas.addEventListener('webglcontextlost', () => resolve(true), { once: true });
    ext.loseContext();
  }));
  assert.equal(lost, true, 'context loss event fired');
  await page.waitForFunction(() => document.querySelector('button[aria-label="Zoom in"]')?.disabled === true, null, { timeout: 5000 });
  // Let the synthetic loss dispatch finish before requesting its reversal. Without
  // a browser turn, the synthetic loss can still be settling during initial setup.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => resolve(null))));
  await page.evaluate(() => window.__loseContext.restoreContext());
  // webglcontextrestored must clear the unavailable flag so map controls come back.
  await page.waitForFunction(() => document.querySelector('button[aria-label="Zoom in"]')?.disabled === false, null, { timeout: 5000 });
  assert.equal(await page.getByRole('button', { name: 'Zoom out', exact: true }).isDisabled(), false, 'zoom out re-enabled after restore');
  assert.deepEqual(errors, [], 'no page errors across loss/restore');
  console.log(JSON.stringify({ contextLossDisablesMapControls: true, controlsReenabledAfterRestore: true, restoreWithoutErrors: true }));
} finally { await browser.close(); }
