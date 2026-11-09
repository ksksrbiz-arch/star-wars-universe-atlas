# Media policy

The initial data contract contains no third-party image URL. Planet appearance is illustrative; UI should say so. Do not represent generated textures or decorative artwork as official screenshots.

For later media ingestion, retain source URL, provider ID, credit, rights/use basis, and fallback for each asset. HTTP delivery is not a rights determination. External images require individual provenance; wiki text licenses do not automatically cover images. Use provider APIs under their terms and supported embeds for authorized videos.

Do not put API keys or access tokens in browser data, context, screenshots, or committed evidence.

Current approved import: NASA SVS 4856 randomized starfield, stored locally under `/visuals/` with `src/mediaAssets.ts` source/credit/rights/hash metadata and responsive fallback. It is decorative and does not establish fictional geography. Original SVG planet studies and synthesized Web Audio cues use no film stills, score, or recorded samples. Audio requires explicit opt-in and begins muted each session.

The user-authorized personal fan atlas also imports source imagery through the private ingestion service; see [ingestion operations](../../docs/INGESTION.md). Eight reviewed transparent character artworks have individual file-page/revision provenance and a documented personal noncommercial use basis in [character artwork sources](../../docs/CHARACTER-ART-SOURCES.md). Underlying rights stay with their owners; no general redistribution license is asserted. Cutouts and source portraits remain separate, credited media types. Source images do not establish screen appearances or canon continuity. Character artwork is visible by default at the owner’s request; optional spoiler protection restores the explicit Databank disclosure.

Twelve primary film posters from their official StarWars.com film pages have per-film source/use-basis and content-hash provenance in `src/filmCovers.generated.json`; [film cover operations](../../docs/FILM-COVERS.md) documents R2 delivery and verification. Library/watch/timeline rows show individual film posters, accepted episode stills or labeled series-poster fallbacks. Underlying poster rights remain with their owners. All art is visible by default; optional protection substitutes show posters for unwatched episode stills.
