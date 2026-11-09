// Legacy disclosure tests deliberately opt into spoiler protection. The product
// now shows source imagery and story details by default; fresh-browser coverage
// belongs in test-content-visibility.mjs rather than these protected-mode flows.
export async function newSpoilerProtectedPage(browserOrContext, options) {
  const page = await browserOrContext.newPage(options);
  await page.addInitScript(() => {
    try { localStorage.setItem('atlas:hide-spoilers:v1', 'true'); } catch {}
  });
  return page;
}
