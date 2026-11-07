# Map and motion contract

Renderers consume the shared ALL_WORLDS registry in [journeyWorlds.ts](../../src/journeyWorlds.ts). The base [data.ts](../../src/data.ts) A–U/1–21 display window maps cell centers to x/y in [-1,1]. Twenty-seven registry positions are refined by approximate reference-image traces constrained to their published cells; 35 retain cell centers. x increases right; y increases up. SVG screen y must be inverted. This is a presentation window, not a claim of galaxy extent or physical scale.

Published grid cells identify systems. Yavin 4 uses parent Yavin's cell. The camera may travel between display positions, but animation duration is not canonical distance or elapsed story time. Illustrative planet spheres and decorative stars are not factual imagery.

Keep one stable map viewport. Camera/scene transforms own pan and zoom. Distinguish preview selection, in-flight target, and committed destination. New requests supersede stale ones. Skip reaches destination; Cancel/Back restores a stable view. Reduced motion removes streaks and dramatic camera travel. A fallback must preserve usable destination navigation if WebGL fails.

Check coordinate agreement among main map, minimap, and fallback after projection changes. Avoid hiding all geography behind an opaque travel overlay.

Region silhouettes and five major corridor traces share the image calibration in their source modules. They are approximate geographic overlays, not complete topology or era-specific route availability. The overview uses the same geometry. Story connection lines remain distinct from hyperspace corridors.
