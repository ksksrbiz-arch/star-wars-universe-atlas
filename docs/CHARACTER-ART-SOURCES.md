# Character artwork sources

Checked November 9, 2026. The user wants the character artwork itself to stand out, with clean transparent backgrounds. This research prioritizes real cutouts rather than trading-card effects.

## Recommended source and delivery

Keep existing Databank imagery as the coverage fallback for all964 current character entries. Add a separate reviewed artwork layer sourced through MediaWiki file records. Wookieepedia's API supplies file source descriptions, page/revision IDs, timestamps, dimensions and hashes in batches. Query up to50 file titles using `prop=imageinfo|revisions`, `iiprop=url|size|mime|sha1|timestamp|extmetadata`, `rvprop=ids|timestamp|content`, `rvslots=main`, and `iiurlwidth=1280`. Categorymembers and namespace6 search discover candidate promotional files; matching filenames alone are insufficient validation.

Eight selected images have genuine transparency, verified with Pillow on unmodified provider downloads. No background removal, cropping, tracing or generative editing was performed. The URLs end in `.png`, but these responses are WebP. Preserve measured MIME and alpha rather than trusting extensions. Display with `object-fit:contain` to retain the available character framing.

## Implemented artwork layer

The eight reviewed assets are published in R2 at their full original resolution, with640px provider thumbnails. Their delivered bytes were downloaded from the public atlas and checked for real transparency, dimensions and SHA-256 identity; see [published artwork checks](../evidence/character-cards/published-artwork.json). Han is2620×4000, Ahsoka2362×3089, Chewbacca2250×4100 and Rey3100×3915. The table below records the earlier research fetch, which used smaller provider thumbnails for some entries.

The character view initially shows these eight transparent artworks. “All characters” retains the964 searchable source portraits, each opening an accessible character dossier. Existing portraits stay separate from cutouts and remain a loading fallback. No foil, tilt or trading-card effects are used. Character identities are matched explicitly; the artwork does not establish new episode appearances or faction facts.

`docs/character-art-source.json` retains reviewed file pages, revisions, actual source providers, framing and use basis. `npm run ingest:character-art` delivers that manifest through the authenticated ingestion service. Media use `kind:'character-cutout'`, and `/api/databank?type=character&artwork=cutout` returns only entries with delivered cutouts. Original PNG/WebP artwork is preserved rather than wrapped in an SVG container. Genuine vector coverage remains a separate sourcing gap.

| Character | Measured fetched size | Provider original size | Framing | File provenance |
| --- | --- | --- | --- | --- |
| Han Solo | 2620 ×4000 | 2620 ×4000 | Full body | [Han-Solo-Fathead-01.png](https://disney.fandom.com/wiki/File:Han-Solo-Fathead-01.png) |
| Darth Vader | 700 ×1280 | 700 ×1280 | Full body | [Darth Vader Promo Rogue One.png](https://starwars.fandom.com/wiki/File:Darth_Vader_Promo_Rogue_One.png) |
| Luke Skywalker | 1250 ×1650 | 1250 ×1650 | Bust | [LukeSkywalker-Insider217.png](https://starwars.fandom.com/wiki/File:LukeSkywalker-Insider217.png) |
| Leia Organa | 500 ×960 | 500 ×960 | Full body | [ArmedWithAttitudeLeia-OfficialPix.png](https://starwars.fandom.com/wiki/File:ArmedWithAttitudeLeia-OfficialPix.png) |
| Ahsoka Tano | 1280 ×1674 | 2362 ×3089 | Bust | [Ahsoka-Tano-AG-2023.png](https://starwars.fandom.com/wiki/File:Ahsoka-Tano-AG-2023.png) |
| Chewbacca | 1280 ×2332 | 2250 ×4100 | Full body | [Chewbacca-Fathead.png](https://starwars.fandom.com/wiki/File:Chewbacca-Fathead.png) |
| Din Djarin | 725 ×900 | 725 ×900 | Bust | [DinDjarinArmor-CGSWG.png](https://starwars.fandom.com/wiki/File:DinDjarinArmor-CGSWG.png) |
| Rey | 1280 ×1617 | 3100 ×3915 | Full body | [Rey-Fathead.png](https://disney.fandom.com/wiki/File:Rey-Fathead.png) |

Han has classic full-length artwork. The Vader selection depicts the armored Rogue One appearance, avoiding a different result depicting Anakin before his armor. Luke's source identifies an Official Pix publicity portrait reproduced in Insider217; it is a bust. Leia is a classic Official Pix publicity pose reproduced in licensed reference books, with a500-pixel width limit. Ahsoka's file cites Advanced Graphics and Insider220; it is a live-action bust. Chewbacca's source points to Fathead. Din is a helmeted publicity portrait from the2024 Star Wars Encyclopedia. Han and Rey's short Disney Wiki file descriptions do not identify the original creator; retain that uncertainty.

## Coverage and quality limits

This pack does not establish964 cutouts or964 vectors. Four selected source originals exceed2000 pixels in at least one dimension; Leia and Din need stronger resolution alternatives. Track framing and depicted era explicitly. A picture, game tag, or Legends category on an artwork page does not establish a movie/show appearance or continuity claim.

Rejected candidates included opaque Luke, Leia and Chewbacca images despite `.png` names; two Moment's Edge illustrations whose alpha stayed252–255 (effectively opaque); and tiny main-page thumbnails with almost no useful transparency. Alpha validation must examine transparent coverage rather than channel presence. Some cutouts have existing edge imperfections; large pixel dimensions alone do not prove high source detail.

For broader coverage, resolve reviewed character IDs to source titles, fetch file metadata in batches, validate raster signature/dimensions/alpha coverage, score framing/resolution, retain source credits, and publish accepted candidates through R2. Store proposed alternatives separately. Missing artwork retains existing imagery and text; wrapping a JPEG inside SVG does not produce a vector character.

## True SVG and 3D options

No complete, detailed full-body vector catalog was established. [Star Wars Glyph Icons](https://github.com/maxgreb/StarWars-Glyph-Icons) is a scalable icon/font resource for small emblems and interface details, not a964-character portrait/body collection.

[EA's Battlefront II material](https://www.ea.com/games/starwars/battlefront/news/han-solo-season-is-coming-soon) supplies game-render reference and identifies its screenshots as game-engine captures. It does not establish a downloadable character-model or transparent-render API. [SWGOH.GG's unit database](https://swgoh.gg/units/han-solo/) provides game-specific unit icons and identities; those icons are not large full-body artwork, and game stats/tags must not become movie/show facts.

## Use basis and attribution

These are source references for the user's requested personal, noncommercial fan atlas. Retain Lucasfilm and original creator/source credits plus each file URL and revision. No public-domain, newly-created, SVG, or general redistribution license is asserted. The wiki's Promotional/Fairuse labels describe its source rationale, not a new license. Unknown original authors remain explicit. Existing user authorization permits personal fan-reference use; no additional approval gate is inferred.

## Reproduction evidence

The ignored `work/character-art/cutout-manifest.json` contains all eight source/page/revision IDs, original and fetched URLs, measured dimensions, SHA256, byte counts, MIME, transparent-pixel coverage, framing, and use basis. Original downloads and raw API provenance remain in the same ignored folder. Han, Ahsoka and Luke were also visually inspected; automated alpha measurement does not certify every cutout edge.
