# Intermediate loading comparison

Captured in the original executor while the next batch was in progress; these files identify the measured asset hashes, not the final integrated release. Fresh Chromium contexts with software WebGL and external font requests consistently blocked. This measures requested production JS bytes and computed gzip sums, not latency, FPS, or physical devices.

Mobile and reduced-motion galaxy requested JS fell from 1,627,631 to 1,551,261 bytes (gzip sum 438,151 to 417,735). Only cinematic desktop requested the optional Bloom module. Cinematic total grew to 1,634,300 bytes; Library grew from 591,108 to 596,003 as app/data changes were integrated. All four scenarios reported zero page errors.

## Final integrated measurement

`final.json` was captured in the current executor against the final combined production build, using the same four fresh-context scenarios and font blocking. Mobile and reduced-motion galaxy requested JavaScript is 1,555,316 bytes versus 1,627,631 baseline: 72,315 fewer bytes (4.44%). Computed gzip sums are 418,501 versus 438,151: 19,650 fewer bytes (4.48%). Desktop cinematic requests 1,638,355 bytes and Library 599,900 bytes; those totals increased with the new catalog/UI. This is conditional loading improvement, not a total bundle-size reduction or latency/FPS claim.

New regression checks `test-optional-bloom.mjs` verify no optional Bloom request on mobile/reduced motion, module reuse on quality switching, and working canvas/navigation if the optional chunk download fails. `test-episode-map-controls.mjs` verifies fit label bounds at 1440/390/320px, resize/reset and keyboard navigation. All passed without page errors; full map desktop/mobile screenshots were inspected.
