# Graphics QA

`node scripts/test-visual-graphics.mjs` passes desktop 1440×1050, mobile 390×844, and reduced-motion desktop checks against localhost:4173.

- Balanced/cinematic controls update map state. One canvas remains mounted.
- Both modes show zero intercepted WebGL draw calls during a settled 600ms observation window on each viewport. This is a finite idle observation, not an FPS or hardware performance measurement.
- No console.error or pageerror events were recorded, including shader compilation errors.
- Overview, Cancel, and Skip remain visible during transit. Cancel preserves the previous location; Skip commits the destination. Reduced motion bypasses transit.
- Map imagery has distinct gold/cyan dust arms and an illuminated core, with readable anchored HTML world labels.

Midpoint images use Playwright clock installed before navigation, paused before Jump, then advanced 800ms. Final desktop and mobile images visibly show cyan radial streaks and a hollow tunnel while the underlying galaxy and overview remain visible. The transit panel is centered and fully contained horizontally in both viewports (now asserted). The first review exposed a shader live-uniform update bug and a conflicting transit transform; both were fixed by their owners and the complete suite passed again. These checks use software WebGL, not physical-device performance measurements.

