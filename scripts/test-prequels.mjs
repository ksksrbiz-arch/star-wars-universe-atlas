import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sha256Lf} from './lib-hash.mjs';
import {PREQUEL_CONNECTIONS} from '../src/connectionsPrequels.ts';
import {STORY_SEQUENCES,STORY_CONNECTIONS} from '../src/chronology.ts';
import {getLocation} from '../src/locations.ts';
import {ALL_WORLDS} from '../src/journeyWorlds.ts';
const bytes=readFileSync(new URL('../docs/prequel-trilogy-source.json',import.meta.url));
const source=JSON.parse(bytes);const {items,metadata}=JSON.parse(readFileSync(new URL('../src/catalog.generated.json',import.meta.url)));
const ids=['pt-phantom-menace','pt-attack-of-the-clones','pt-revenge-of-the-sith'];
assert.deepEqual(STORY_SEQUENCES.find(s=>s.id==='pt').itemIds,ids);
assert.equal(metadata.sourceFiles.find(s=>s.name==='prequel-trilogy-source.json').sha256,sha256Lf(bytes));
for(const original of source.films){const item=items.find(i=>i.id===original.id);assert.equal(item.seriesId,'pt');assert.equal(item.title,original.title);assert.equal(item.releaseDate,original.releaseDate);assert.equal(item.sourceUrl,original.sourceUrl);assert.equal(item.runtimeMinutes,null);assert.equal(item.kind,'film');assert(!('episode' in item));}
assert.deepEqual(ids.map(id=>PREQUEL_CONNECTIONS.filter(c=>c.itemId===id).length),[3,5,12]);
for(const c of PREQUEL_CONNECTIONS){assert(ids.includes(c.itemId));assert.equal(new URL(c.sourceUrl).hostname,'www.starwars.com');assert(!('sequence' in c));assert(!('x' in c));assert(!('grid' in c));}
assert(!PREQUEL_CONNECTIONS.some(c=>c.worldId==='dagobah'),'Deleted-scene arrival is not a theatrical film appearance');
const overlap=STORY_CONNECTIONS.find(c=>c.id==='clone-wars-revenge-of-the-sith');assert.equal(overlap.kind,'overlap');assert.deepEqual(overlap.includedItemIds,[ids[2]]);assert.equal(overlap.externalTitles.length,0);assert(!overlap.afterItemId&&!overlap.beforeItemId);
for(const id of ['kamino','kashyyyk','utapau','mygeeto','polis-massa']){assert(getLocation(id));assert(!ALL_WORLDS.some(w=>w.id===id));assert(!('x' in getLocation(id)));}
assert.equal(getLocation('polis-massa').kind,'asteroid-outpost');
for(const id of ['felucia','mygeeto','cato-neimoidia','saleucami'])assert.match(PREQUEL_CONNECTIONS.find(c=>c.itemId===ids[2]&&c.worldId===id).note,/montage|Order 66/i);
assert.equal(PREQUEL_CONNECTIONS.find(c=>c.itemId===ids[2]&&c.worldId==='cato-neimoidia').context,undefined,'Atmospheric combat must not be labeled orbit');
console.log('PASS prequel trilogy3films/20partialjoins, sourced dates, internaloverlap, montage/atmosphere qualifications, unplacedidentities and deletedscene exclusion');
