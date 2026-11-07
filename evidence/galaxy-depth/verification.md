# Galaxy depth and corridor glow

November 7, 2026. Integrated on upstream133b635; no source positions, region shapes, or hyperspace trace control points changed.

Changes:
- Feathered cyan spiral ridges with slightly broader diffuse falloff, preserving the upstream warm nucleus, cloud knots, and turbulence.
- Sparse inter-arm stars and a warm-to-cool radial palette, within the existing2,600/6,500 particle budgets and existing single points draw.
- Static soft corridor halos exactly around the existing five route traces. Adds five bounded mesh draws; no timers, frame animation, route movement, or inferred navigation topology.
- Preserved lazy cinematic bloom, failure fallback, demand rendering and reduced-motion behavior. Warp implementation unchanged.

Executed checks:
- npm run build passed; existing large-chunk warning remains.
- npm run check:icm passed.
- node scripts/test-visual-graphics.mjs passed desktop1440, mobile390, and reduced-motion modes. Balanced/cinematic settled idle observations each recorded zero draw calls over600ms. Single canvas, skip/cancel, readable controls and no browser errors.
- node scripts/test-optional-bloom.mjs passed against built preview4175. Mobile/reduced modes skip effect download; quality changes reuse the module; failed effect download leaves base navigation usable.
- Visually inspected full map-stage screenshot: map-desktop.png. Reference layers, bright core and diffuse arm structure remain distinguishable.

These are Chromium/software-WebGL observations, not physical-device FPS measurements. Decorative stars and dust are illustrative. Raw snapshot tests also refreshed evidence/visual-graphics-*.
