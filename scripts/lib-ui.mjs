// Shared browser-test helpers for the current shell UI.

// Map settings (world finder, search, graphics quality, map toggles) live inside a
// <details class="workspace-settings"> disclosure that is closed on load and is
// closed again after each world selection. Idempotent: only clicks when closed.
export async function openMapSettings(page) {
  const details = page.locator('details.workspace-settings');
  await details.waitFor({ state: 'attached' });
  if (!(await details.evaluate((el) => el.open))) {
    await details.locator(':scope > summary').click();
  }
}

// Collapses the map-settings disclosure again (it can overlay the map while open).
export async function closeMapSettings(page) {
  const details = page.locator('details.workspace-settings');
  if (await details.evaluate((el) => el.open)) {
    await details.locator(':scope > summary').click();
  }
}

// On narrow viewports the destination dossier lives in a collapsed bottom sheet
// (.sheet-toggle). Idempotent: expands only when the toggle is shown and collapsed.
export async function expandDossierSheet(page) {
  const toggle = page.locator('.sheet-toggle').first();
  await toggle.waitFor({ state: 'attached' }); // rendered on every viewport; only displayed on narrow ones
  if ((await toggle.isVisible()) && (await toggle.getAttribute('aria-expanded')) === 'false') {
    await toggle.click();
  }
}
