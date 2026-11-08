import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ROGUE_ONE_CONNECTIONS } from '../src/connectionsRogueOne.ts';
import { getLocationKind, LOCATION_KINDS } from '../src/locations.ts';
import { STORY_CONNECTIONS, STORY_SEQUENCES } from '../src/chronology.ts';
const { items, metadata } = JSON.parse(readFileSync(new URL('../src/catalog.generated.json', import.meta.url)));
const source = JSON.parse(readFileSync(new URL('../docs/rogue-one-source.json', import.meta.url)));
const film = items.find(item => item.id === 'rogue-one');
assert.equal(film.kind, 'film'); assert.equal(film.releaseDate, source.releaseDate); assert.equal(film.sourceUrl, source.sourceUrl); assert.equal(film.runtimeMinutes, null);
assert.equal(metadata.originalAuditCohortCount,185);
assert.deepEqual(STORY_SEQUENCES.find(s=>s.id==='rogue-one').itemIds,['rogue-one']);
const bridge=STORY_CONNECTIONS.find(c=>c.id==='andor-rogue-one');
assert.deepEqual(bridge.includedItemIds,['rogue-one']); assert.deepEqual(bridge.externalTitles,[]);
assert.equal(bridge.afterItemId,'andor-s02e12'); assert.equal(bridge.beforeItemId,'ot-a-new-hope');
assert.equal(ROGUE_ONE_CONNECTIONS.length,8);
assert.equal(getLocationKind('ring-of-kafrene'),'asteroid-outpost'); assert.equal(getLocationKind('jedha'),'moon'); assert.equal(getLocationKind('yavin'),'moon'); assert.equal(getLocationKind('not-reviewed'),'unknown');
for(const c of ROGUE_ONE_CONNECTIONS){
 assert.equal(c.locationKind,getLocationKind(c.worldId)); assert.equal(c.itemId,'rogue-one');
 assert.equal(new URL(c.sourceUrl).hostname,'www.starwars.com');
 assert.equal(new URL(LOCATION_KINDS[c.worldId].sourceUrl).hostname,'www.starwars.com');
 for(const key of ['x','y','grid','sequence']) assert(!Object.hasOwn(c,key));
}
for(const id of ['coruscant','dantooine','corellia','kashyyyk','najedha']) assert(!ROGUE_ONE_CONNECTIONS.some(c=>c.worldId===id),'Tour waypoint or parent is not appearance');
console.log('Rogue One: eight typed locations, internal whole-work bridge, historical cohort and evidence boundaries passed.');
