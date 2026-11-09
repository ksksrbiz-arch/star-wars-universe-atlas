# Flight-console UX — November 9, 2026

The user's [HUDS+GUIS reference](https://www.hudsandguis.com/home/2016/3/14/star-wars) informed a restrained original-trilogy / Force Awakens console direction: physical panel framing, precise linework, dark desaturated surfaces, warm ivory keys, amber accents and pale-blue selection. The implementation uses original CSS, existing icons and existing atlas art; no reference screenshots, film graphics, fonts or audio were imported.

The five section controls have stronger selected states, full visible phone layouts and at least 44-pixel touch targets. Map presentation and destination tabs use consistent illuminated selection. The galaxy, dossiers, library records, collections and search dialog share panel and control treatment. Keyboard focus uses an explicit amber outline. There are no new flashing or moving scanline effects; existing reduced-motion behavior is preserved. At narrow widths the long brand subtitle is hidden so it cannot collide with header controls; attribution remains in the About panel.

## Verification

- Production TypeScript/Vite build, Worker build and ICM structure check passed; pre-existing large-chunk warnings remain.
- `scripts/test-flight-console.mjs`: five navigation targets, active section, search Escape/focus restoration, textured Serenno dossier, library and absence of horizontal overflow at 320/390/768/1440 pixels.
- Guided journey: desktop/390/320, keyboard focus, guide dismiss/restart and spoiler/watch-state preservation passed.
- Library accessibility: keyboard record/source access, empty-state recovery, collection filters, watch targets and library/timeline/watch at 320 pixels passed.
- Screenshots reviewed for desktop map, phone map and phone library. Evidence is desktop Chromium with software WebGL and viewport emulation, not physical-device performance or a comprehensive accessibility audit.

Primary implementation: `src/flight-console.css`, imported after the existing workspace/galaxy styles. Content facts, source caveats, map coordinates and watch-progress behavior are unchanged.
