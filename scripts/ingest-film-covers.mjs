import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {imageDetails} from '../cloudflare/ingestion-worker.mjs';

// Reviewed film-page identities. Do not select og:image: that is often a cropped banner.
const overrides = {
  'ot-a-new-hope': 'star-wars-episode-iv-a-new-hope',
  'ot-empire-strikes-back': 'star-wars-episode-v-the-empire-strikes-back',
  'ot-return-of-the-jedi': 'star-wars-episode-vi-return-of-the-jedi',
  solo: 'solo',
};
const directory = 'work/covers';
await mkdir(directory, {recursive: true});
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const catalog = JSON.parse(await readFile('src/catalog.generated.json', 'utf8')).items;
const items = [];
for (const film of catalog.filter(item => item.kind === 'film')) {
  const sourceUrl = overrides[film.id] ? `https://www.starwars.com/films/${overrides[film.id]}` : film.sourceUrl;
  const page = await fetch(sourceUrl, {signal: AbortSignal.timeout(30000)});
  if (!page.ok) throw new Error(`${film.id}: film page returned ${page.status}`);
  const html = await page.text();
  const match = html.match(/poster-inner poster-box[\s\S]{0,1200}?<img[^>]+data-src="([^"]+)"/);
  if (!match) throw new Error(`${film.id}: no primary film poster; manual review required`);
  const imageUrl = new URL(match[1].replaceAll('&amp;', '&'));
  if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== 'lumiere-a.akamaihd.net') throw new Error('Unexpected image host');
  const variants = [];
  for (const width of [320, 640]) {
    const url = new URL(imageUrl); url.searchParams.set('width', String(width));
    const response = await fetch(url, {redirect: 'error', signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`${film.id}: poster returned ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > 8 * 1024 * 1024) throw new Error('Poster too large');
    const details = imageDetails(bytes);
    if (details.mime !== response.headers.get('content-type')?.split(';')[0] || !details.width || details.width / details.height > .85 || details.width / details.height < .5) throw new Error(`${film.id}: expected a portrait poster`);
    const sha256 = hash(bytes), key = `sources/${sha256}.${details.extension}`;
    await writeFile(`${directory}/${sha256}.${details.extension}`, bytes);
    variants.push({src: `/media/${key}`, key, sha256, bytes: bytes.length, ...details});
  }
  const primary = variants.at(-1);
  items.push({entityId: film.id, entityType: 'film', provider: 'starwars', title: film.title,
    src: primary.src, srcSet: variants.map(row => `${row.src} ${row.width}w`).join(', '),
    credit: 'Poster © Lucasfilm Ltd. / StarWars.com', sourceUrl, originalSourceUrl: imageUrl.href,
    useBasis: 'User-authorized personal noncommercial fan atlas; underlying rights retained by their owners.',
    retrievedAt: new Date().toISOString(), pageSha256: hash(html), variants});
  console.log(`${film.id}: ${primary.width}×${primary.height} primary film poster`);
}
await writeFile(`${directory}/manifest.json`, JSON.stringify({items}, null, 2) + '\n');
// The operator uploads content-addressed variants to the existing published R2
// bucket, then --publish verifies the delivered bytes before exposing the manifest.
if (process.argv.includes('--publish')) {
  const origin = process.env.ATLAS_URL ?? 'https://star-wars-universe-atlas.skdev-371.workers.dev';
  for (const item of items) for (const variant of item.variants) {
    const response = await fetch(origin + variant.src);
    if (!response.ok || hash(Buffer.from(await response.arrayBuffer())) !== variant.sha256) throw new Error('R2 delivery verification failed');
  }
  await writeFile('src/filmCovers.generated.json', JSON.stringify({items}, null, 2) + '\n');
}
