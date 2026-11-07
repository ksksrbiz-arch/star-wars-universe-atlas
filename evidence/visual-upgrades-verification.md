# Visual upgrade verification — November 7, 2026

Implemented locally using three parallel agents, followed by a parallel verification batch. No deployment or repository push was performed.

## Changes

- Layered procedural galaxy dust, spiral stars, luminous core, and restrained cinematic bloom.
- Balanced and cinematic graphics settings. Mobile defaults to balanced; bloom requires a wide viewport and is disabled under reduced motion.
- Original two-second warp shader with stretched stars, translucent cyan tunnel filaments, and a soft arrival halo. It shares the camera's progress clock and existing WebGL canvas. Map labels, minimap, cancel, and skip controls remain above the effect.
- Motion-powered chapter/card/dossier transitions, richer planet shading, map frame treatments, and transit progress.
- Reduced-motion behavior and stable keyboard focus. Outgoing chapter headings are removed immediately to avoid duplicate accessible content.
- Map labels detach immediately and defer React-root disposal until the current commit finishes, eliminating observed StrictMode cleanup warnings.

## Reused software

Pinned Motion 14.10.1, @react-three/postprocessing 3.2.2, and postprocessing 6.39.6 alongside the existing React Three Fiber/Three/Drei stack. Package license files remain in their distributions. The new galaxy/warp shaders and CSS planet treatment are original procedural implementations; no React Bits source, film footage, or external texture pack was copied.

## Verification

- Production TypeScript/Vite build passes. Main JavaScript is 150.98 KB gzip; lazy galaxy chunk is 275.18 KB gzip; CSS is 11.86 KB gzip. Vite still reports large minified chunks, so these are not a claim of a completed bundle optimization pass.
- ICM structure check passes.
- Journey, Journey accessibility, platform, and Library accessibility checks pass.
- Lifecycle checks pass: cancellation, skip/back, section changes during travel, locked quality selector, reduced-motion toggling, and orientation changes.
- Emulated touch pan/pinch and shared-grid label/navigation checks pass after the label bridge change. Touch coordinates now derive from canvas bounds following the new toolbar layout.
- Visual UI checks cover manual reduced motion, keyboard focus, one chapter heading, filtering without ghost cards, and 320/390/1440px layouts.
- Visual inspection caught and fixed a shader-uniform update bug and Motion overriding the transit panel's centering transform. The shader now updates its live material uniforms; the panel animates opacity only.
- Final desktop mid-warp capture visibly shows radial star streaks and cyan tunnel filaments over the underlying galaxy, with a centered transit panel and visible overview map. See `visual-graphics-desktop-warp.png`.
- One original Journey test initially raced the natural end of the two-second animation while clicking Skip; an unchanged rerun passed. Dedicated lifecycle checks also cover Skip.

Machine-readable results and screenshots are adjacent in this evidence directory. Browser checks use Chromium software WebGL; no physical-device frame-rate or GPU-memory claims are established. Data coverage remains 185 titles, 171 relationships, and 62 schematic map placements; the visual work does not add factual coverage.

Final graphics checks also pass on emulated mobile and reduced-motion contexts: visible warp, transit panel containment, single canvas, quality switching, cancel/skip, and reduced-motion bypass. No console errors or page errors were recorded. Both quality modes showed no draw-call growth in finite 600ms settled idle observations.
