import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256Lf } from './lib-hash.mjs';
import { BOBA_FETT_CONNECTIONS } from '../src/connectionsBobaFett.ts';
import { STORY_SEQUENCES, STORY_CONNECTIONS } from '../src/chronology.ts';
import { getLocation } from '../src/locations.ts';
import { ALL_WORLDS } from '../src/journeyWorlds.ts';
const sourceBytes=readFileSync(new URL('../docs/boba-fett-source.json',import.meta.url));
const source=JSON.parse(sourceBytes);
const {items,metadata}=JSON.parse(readFileSync(new URL('../src/catalog.generated.json',import.meta.url)));
assert.equal(source.episodes.length,7);
assert.equal(metadata.sourceFiles.find(s=>s.name==='boba-fett-source.json').sha256,sha256Lf(sourceBytes));
const ids=source.episodes.map(e=>`boba-fett-s01e${String(e.number).padStart(2,'0')}`);
assert.deepEqual(STORY_SEQUENCES.find(s=>s.id==='boba-fett').itemIds,ids);
for(const [i,id] of ids.entries()) {
 const item=items.find(e=>e.id===id), original=source.episodes[i];
 assert.equal(item.title,original.name); assert.equal(item.releaseDate,original.airdate);assert.equal(item.sourceUrl,original.url);
 assert.equal(item.seriesId,'boba-fett');assert.equal(item.kind,'episode');assert.equal(item.runtimeMinutes,null);
 assert(BOBA_FETT_CONNECTIONS.some(c=>c.itemId===id));
}
assert.equal(BOBA_FETT_CONNECTIONS.length,11);
assert.deepEqual(STORY_CONNECTIONS.find(c=>c.id==='mandalorian-boba-fett').includedItemIds,ids.slice(4));
for(const c of BOBA_FETT_CONNECTIONS){assert(ids.includes(c.itemId));assert.equal(new URL(c.sourceUrl).hostname,'www.starwars.com');assert(!('sequence' in c));assert(!('x' in c));assert(!('grid' in c));}
assert.equal(BOBA_FETT_CONNECTIONS.find(c=>c.worldId==='mandalore').context,'flashback');
assert.equal(BOBA_FETT_CONNECTIONS.find(c=>c.worldId==='coruscant').context,'flashback');
for(const [id,kind] of [['glavis-ringworld','space-station'],['luke-jedi-school','surface-site']]) {
 assert.equal(getLocation(id).kind,kind);assert(!ALL_WORLDS.some(w=>w.id===id));assert(!('x' in getLocation(id)));
}
assert(!BOBA_FETT_CONNECTIONS.some(c=>['ossus','naboo','concordia','oba-diah'].includes(c.worldId)),'Do not turn unsupported parent identity or mentioned origins into appearances');
console.log('Boba Fett: seven sourced chapters, eleven partial associations, internal bridge, flashback contexts and unplaced station/site passed.');
