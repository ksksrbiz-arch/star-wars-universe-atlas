# Bulk source ingestion

Checked November 9, 2026. Source ingestion is now a separate, executable bulk job. It does not run during a production build or in a visitor's browser.

## Source stack

| Source | Role | Observed access and scope |
|---|---|---|
| [Community Star Wars Databank API](https://starwars-databank.vercel.app/) | Fast illustrated entity inventory | Keyless. The full run collected326 locations and964 characters, with IDs, descriptions and image references. Community operated; its [about page](https://starwars-databank.vercel.app/about) distinguishes it from an official Lucasfilm service. No episode appearances, continuity, revision history or coordinates in this schema. |
| [Wookieepedia MediaWiki API](https://starwars.fandom.com/api.php?action=query&format=json&meta=siteinfo) | Rich lore, revisions, continuity, source citations, appearance candidates and file metadata | API requests worked here. The four-page pilot collected Ilum, Ilum/Legends, Mandalore and Bespin plus featured-image metadata in two requests. Canon/Legends categories, page/revision IDs and raw citation templates are preserved. |
| [TVmaze API](https://www.tvmaze.com/api) | TV series, episode records, summaries, cast, posters, backdrops and episode stills | Keyless. Eight series are configured by verified IDs. Two requests per show fetch embedded episodes/cast and the show image gallery. Specials, future placeholders and provider numbering remain staging records. |
| [TMDB](https://developer.themoviedb.org/docs/append-to-response) | Optional next adapter for film artwork and larger image/trailer inventories | Requires an API credential; none was configured or used in this run. It supports film/TV/season/episode image collections. [Noncommercial developer access](https://developer.themoviedb.org/docs/faq) is free with attribution. This adapter is not implemented yet. |

SWAPI remains a limited supplemental source: the research probe returned six films and60 planets, without our TV episode scope or a media library. It is not the main source for this platform.

## What was reused from the TWD approach

The current TWD repository has dedicated Fandom category/page collectors, revision/source records, entity reconciliation, per-entity galleries and image-delivery validation. See its [enrichment architecture](https://github.com/ksksrbiz-arch/walking-dead-universe-atlas/blob/main/docs/DATA_ENRICHMENT_ARCHITECTURE.md), [collector](https://github.com/ksksrbiz-arch/walking-dead-universe-atlas/blob/main/scripts/ingest-fandom-atlas.mjs) and [gallery collector](https://github.com/ksksrbiz-arch/walking-dead-universe-atlas/blob/main/scripts/ingest-fandom-entity-galleries.mjs).

This implementation follows that source-snapshot, reconciliation and media-manifest pattern. Star Wars continuity/disambiguation is retained explicitly. Name-only location matches become review candidates; they cannot overwrite a world or fuse Canon and Legends.

## Run

```sh
npm run ingest:sources
npm run ingest:sources -- --refresh
npm run ingest:sources -- --providers databank
npm run ingest:sources -- --providers wookieepedia --wiki-titles "Ilum|Ilum/Legends|Mandalore|Bespin"
npm run test:ingestion
```

`--max-records 2000` caps each Databank collection; the default fully covers the two collections observed here. Wookieepedia remains a bounded pilot, with batched page/image requests and continuation handling. It is not a full-wiki crawl.

The default output is private/ignored `work/ingestion/latest/`:

- `records.json`: normalized source records, original payloads, SHA-256 fingerprints, continuity and candidate reconciliation.
- `media-manifest.json`: deduplicated image references, credits, source-record links and fallback metadata.
- `appearance-candidates.json`: source-reported TV citations with original templates, revision IDs and mention/flashback/unknown distinctions.
- `summary.json`: counts, timings, source failures and response-snapshot provenance.

The shared client limits each host to one in-flight request with spacing, retries429/server failures, deduplicates requests and caches successful JSON for24 hours. `--refresh` fetches again. Cached bodies are integrity-checked; historical raw responses are preserved by content hash under `work/ingestion/cache/snapshots/`. A failed provider is reported independently; a partial run exits with status2 rather than claiming complete coverage.

## Measured proof

The [first live batch](../evidence/ingestion/first-live-batch.json) completed in **9.47 seconds** using32 HTTP requests, with zero provider errors:

- 1,721 source records:326 locations,964 characters,337 provider episode rows,8 series,82 actors and4 wiki pages.
- 1,851 unique media references. These are inventory references, not downloaded or delivered image files.
- 260 episode metadata candidates match current series/season/episode/title;52 episode rows need reconciliation. Combined releases, specials and future placeholders are not silently added to the327-item catalog.
- 62 name-only location candidates are retained for entity reconciliation, not automatically accepted as canonical identities.

The [cached batch](../evidence/ingestion/cached-batch.json) completed in **1.29 seconds**, with zero HTTP requests and32 cache hits. Its wiki extraction produced67 source-reported appearance/mention candidates:43 exact Canon catalog matches,24 unmatched;17 appearances,7 flashbacks,23 mentions and20 unknown contexts. Legends entries cannot borrow Canon catalog IDs. These counts are not67 verified visits or new canonical links.

[Six representative image HEAD requests](../evidence/ingestion/media-delivery-sample.json) returned HTTP200 with image MIME types across all three sources. No image bytes were downloaded; this is a delivery sample, not an exhaustive media audit. Eleven deterministic tests cover pagination, revisions, continuity, context markers, special/future rows, actor-versus-character images, cache corruption, snapshot preservation and upstream failures. The live timings are observations from this environment, not an SLA.

## Published integration

The collector command remains a local staging tool. The separate [private ingestion service](INGESTION-AUTOMATION.md) now stores inventory and revision snapshots in Neon, delivers bounded responsive provider derivatives into R2, and refreshes them on a Cloudflare schedule. The public Worker remains read-only. The inventory does not alter the327 reviewed catalog items,76 mapped worlds,521 appearance relationships or viewing sequences. Unknown coordinates stay null; screen imagery remains separate from planet sphere textures.

The Library's Galactic Databank searches326 locations and964 character entries. Descriptions and images are visible by default; optional “Hide spoilers” restores the explicit Databank disclosure. Journey exposes source stills for260 exactly matched episodes by default, or after watched/title reveal when optional spoiler protection is enabled; eight series images and14 manually reviewed world identities also have published media links. Ambiguous numbering, combined releases and name-only planet candidates remain held. Actor portraits are not published as character artwork.

`/api/databank?type=location&q=Tatooine&limit=12&offset=0` provides bounded search/pagination. `/api/media-index` exposes accepted, delivered media with attribution and same-origin paths, never raw payloads or credentials. Original atlas artwork remains available on source/API failure.

For repeatable local publication, inject the writer connection into `ATLAS_DATABASE_URL`, run `npm run ingest:sources`, `npm run ingest:prepare-media`, then `npm run ingest:deliver-media` with the private service credential in ignored `work/ingestion/runtime-private.json`. Run `npm run db:check-ingestion` before `npm run db:publish-ingestion`. Publication uses additive tables and a transaction, without canonical map/story writes. [Live evidence](../evidence/ingestion/live/results.json) records actual API, R2 and browser checks; rerun with `node scripts/verify-ingestion-live.mjs`.

For a later comprehensive lore bootstrap, Fandom documents [current-page XML dumps](https://community.fandom.com/wiki/Help:Database_download). The observed Star Wars dump was278,679,801 bytes compressed and accessible by HEAD; it was not downloaded. Dumps exclude image binaries. Use the separate file/image API and revision-aware refreshes rather than expecting a dump to be a complete media library. YouTube compilations remain supplementary discovery material, not this ingestion backbone.
