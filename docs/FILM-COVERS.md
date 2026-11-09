# Film posters and library artwork

The library previously rendered only its original typographic placeholders. Imported episode imagery and eight show posters existed in `/api/media-index` but were not connected to library/watch/release-timeline rows.

The shared artwork component now uses a film's exact poster, an episode's accepted still, or a clearly labeled series poster. If an image fails, episode artwork falls back to its series poster; if both fail, the original typographic artwork retains readable titles and controls. Optional spoiler protection uses series posters instead of unwatched episode stills. The owner's default remains all imagery visible. Viewing artwork never marks a title watched.

## Film import

`src/filmCovers.generated.json` records twelve film identities and their primary posters, extracted from each official StarWars.com film page's `poster-inner poster-box` image. The importer deliberately avoids `og:image`, which can be a cropped social banner. It checks the Lumiere host, raster signature/MIME and portrait dimensions, creates content hashes, and stages 320/640-wide provider derivatives under ignored `work/covers/`. These are CDN derivatives, not newly generated artwork.

`npm run ingest:film-covers` stages the source manifest and bytes. Upload the staged variants to the existing `star-wars-atlas-published` R2 bucket using their `sources/<sha256>.<extension>` keys. Run `npm run ingest:film-covers -- --publish` after delivery; it checks every public object's exact bytes/hash before writing the frontend manifest. No token is embedded in the browser or committed manifest. The R2 upload is an authenticated operator step, not a public write route.

Every entry retains the film ID/title, official page, original image URL, retrieval timestamp, page hash, credit, personal fan-use basis, variant dimensions, MIME, byte length and SHA-256. Poster copyright remains with Lucasfilm/its owners; this import does not assert a general redistribution license. Original posters remain in their native proportions, without cropping their lettering. Film imagery also appears in the matching Journey source-image panel.

The manifest supplements the existing read-only media index; it does not alter catalog records, runtimes, chronology, appearances, placements or database permissions. TVmaze's scheduled series/episode ingestion continues unchanged. Future films need an explicit reviewed identity; a series poster never masquerades as a specific episode still.

## Verification

`npm run test:library-covers` checks all 327 catalog records have an artwork path at the time of the run, verifies all 24 film derivatives against the manifest, decodes each film poster and a real image from each show, checks 1440/390/320px layouts, and exercises image failure and optional spoiler protection. Local browser runs proxy the live read-only API/media service. This is Chromium viewport emulation, not a physical-device test.

At initial verification, 260 episode IDs had an accepted still; the remaining 55 used a labeled series poster. All twelve films had individual posters. These counts are a point-in-time media inventory, not a claim of 327 episode-specific images.
