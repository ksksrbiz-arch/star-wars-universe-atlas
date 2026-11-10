// Regression checks for the November 9, 2026 browser audit: field-guide readability in the
// narrow sidebar, scrollbar-aware 320px width, labelled retained destination, and no false
// WebGL fallback text. Needs ATLAS_URL (default http://localhost:4173).
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = process.env.ATLAS_URL || 'http://localhost:4173';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'], ignoreDefaultArgs: ['--hide-scrollbars'] });
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(base + '/#galaxy/tatooine');
  const guide = desktop.locator('.workspace-panel .immersive-dossier');
  await guide.waitFor();
  const m = await guide.evaluate(el => {
    const w = s => el.querySelector(s).getBoundingClientRect().width;
    const px = s => parseFloat(getComputedStyle(el.querySelector(s)).fontSize);
    return { overview: w('.field-guide-overview'), terrain: w('.field-terrain p'), cols: getComputedStyle(el.querySelector('.field-guide-body')).gridTemplateColumns.split(' ').length, fontOverview: px('.field-guide-overview'), fontTerrain: px('.field-terrain p'), fontIntro: px('.field-intro') };
  });
  assert.equal(m.cols, 1, 'narrow sidebar field guide stacks in one column');
  assert.ok(m.overview >= 250 && m.terrain >= 250, `paragraphs use the sidebar width (${m.overview}/${m.terrain})`);
  assert.ok(m.fontOverview >= 14 && m.fontTerrain >= 14 && m.fontIntro >= 12, 'readable field-guide type');
  await guide.locator('summary').first().click();
  const place = await guide.locator('details[open] .field-place-content p').first().evaluate(el => el.getBoundingClientRect().width);
  assert.ok(place >= 250, `expanded place text is readable (${place})`);
  assert.equal(await desktop.getByText('needs WebGL').count(), 0, 'no false renderer-unavailable text');

  const narrow = await browser.newPage({ viewport: { width: 320, height: 740 } });
  await narrow.goto(base + '/#galaxy');
  await narrow.locator('.map-stage').waitFor();
  const o = await narrow.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  assert.ok(o.scroll <= o.client, `no horizontal page overflow at 320px (${o.scroll} > ${o.client})`);

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(base + '/#galaxy/hoth');
  await phone.locator('.map-jump-bar').waitFor();
  await phone.goto(base + '/#journey/st-force-awakens');
  await phone.locator('.workspace-story').waitFor({ state: 'attached' });
  await phone.evaluate(() => [...document.querySelectorAll('button')].find(b => /Read location file/.test(b.textContent))?.click());
  const bar = phone.locator('.map-jump-bar');
  await bar.waitFor();
  assert.match(await bar.innerText(), /DESTINATION SELECTED ON MAP[\s\S]*Hoth[\s\S]*Open file: [\s\S]*Map selection unchanged/);
  assert.match(await phone.locator('.map-inspect').innerText(), /SELECTED ON MAP · NOT YOUR LOCATION[\s\S]*Inspect Hoth/);
  assert.doesNotMatch(await phone.locator('.current-location').innerText(), /Inspect/, 'current-location card has no destination action');
  console.log('PASS field guide readability, 320px overflow, retained destination labelling, no false WebGL fallback');
} finally { await browser.close(); }
