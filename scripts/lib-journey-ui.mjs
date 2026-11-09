// Shared helpers for Journey/world-story browser scripts.

// At <=720px the exploration panel (Journey reader, linked stories, destination
// dossier) lives in a collapsed bottom sheet: `.sheet-toggle` with aria-expanded.
// The sheet collapses again whenever the view changes (galaxy <-> journey), so
// call this after every navigation that needs panel content. It is a no-op on
// desktop, where the toggle is display:none and the panel is always open.
export async function expandPanel(page) {
  await page.locator('.workspace-panel').waitFor({ state: 'attached' });
  const toggle = page.locator('.sheet-toggle');
  if (await toggle.isVisible() && (await toggle.getAttribute('aria-expanded')) === 'false') {
    await toggle.click();
    await page.locator('.sheet-toggle[aria-expanded="true"]').waitFor();
  }
}

// Click "Jump to <name>" and then "Skip animation", both from inside the page.
// The warp is wall-clock timed (4.2s); in a software-GL sandbox a Playwright
// click on Jump can itself take longer than that, so the HUD would be gone
// before a second round trip. Resolves 'skipped' | 'no-jump-button' | 'no-skip-button'.
export async function jumpAndSkip(page, name, timeout = 30000) {
  return page.evaluate(([label, ms]) => new Promise(resolve => {
    const text = b => (b.getAttribute('aria-label') || b.textContent).trim().replace(/\s+/g, ' ');
    const jump = [...document.querySelectorAll('button')].find(b => text(b) === `Jump to ${label}`);
    if (!jump || jump.disabled || !jump.offsetParent) { resolve('no-jump-button'); return; }
    const find = () => [...document.querySelectorAll('button')].find(b => /^Skip animation/.test(b.textContent.trim()));
    const done = value => { observer.disconnect(); clearTimeout(timer); resolve(value); };
    const observer = new MutationObserver(() => { const b = find(); if (b) { b.click(); done('skipped'); } });
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = setTimeout(() => done('no-skip-button'), ms);
    jump.click();
  }), [name, timeout]);
}

// Selecting or arriving at a location switches the panel to its Destination tab
// (App.tsx panelTab). The chapter controls live on the Story tab, so switch back.
export async function openStoryTab(page) {
  await expandPanel(page);
  const tab = page.getByRole('group', { name: 'Exploration panel views' }).getByRole('button', { name: 'Story', exact: true });
  await tab.waitFor({ state: 'attached' });
  if ((await tab.getAttribute('aria-pressed')) === 'false') await tab.click();
}

// "Resume" and the watch-progress summary live in the collapsed
// <details class="story-chapter-picker"> ("Browse chapters & watch progress").
export async function openChapterPicker(page) {
  const picker = page.locator('details.story-chapter-picker');
  if (!(await picker.evaluate(el => el.open))) await picker.locator('summary').click();
}
