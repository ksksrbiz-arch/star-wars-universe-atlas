import assert from 'node:assert/strict';
import {PLANET_APPEARANCES} from '../src/planetAppearance.ts';
import {ALL_WORLDS} from '../src/journeyWorlds.ts';
import {WORLD_DOSSIERS} from '../src/worldDossiers.ts';
import {getLocationKind} from '../src/locations.ts';
const expected=new Set([...ALL_WORLDS.map(w=>w.id),...Object.keys(WORLD_DOSSIERS)]);
for(const id of expected)assert.ok(PLANET_APPEARANCES[id],`Explicit appearance profile required: ${id}`);
const seeds=new Set();
for(const[id,p]of Object.entries(PLANET_APPEARANCES)){
 assert.equal(p.id,id);assert.ok(['terrestrial','gas','city','ice','lava','clouded','unknown'].includes(p.kind));
 for(const key of['ocean','land','highland','cloud'])assert.match(p[key],/^#[0-9a-f]{6}$/i);
 for(const key of['oceanCoverage','cloudCoverage','iceCoverage','roughness'])assert.ok(Number.isFinite(p[key])&&p[key]>=0&&p[key]<=1,`${id} ${key} bounds`);
 assert.ok(Number.isSafeInteger(p.seed));assert.ok(!seeds.has(p.seed),`${id} seed identity must be distinct`);seeds.add(p.seed);
 assert.ok(['www.starwars.com','cdnvideo.dolimg.com'].includes(new URL(p.sourceUrl).hostname)||['https://starwars.fandom.com/wiki/Bothawui','https://starwars.fandom.com/wiki/Quarzite','https://starwars.fandom.com/wiki/Quell','https://starwars.fandom.com/wiki/Teth'].includes(p.sourceUrl));assert.match(p.note,/illustrat|decorativ|composition/i);
 for(const key of ['atmosphere','cloudAccent'])if(p[key])assert.match(p[key],/^#[0-9a-f]{6}$/i);
}
assert.equal(PLANET_APPEARANCES.alderaan.kind,'terrestrial');assert.ok(PLANET_APPEARANCES.alderaan.oceanCoverage>0);assert.ok(PLANET_APPEARANCES.alderaan.iceCoverage>0);
assert.equal(PLANET_APPEARANCES.yavin.kind,'terrestrial');assert.equal(getLocationKind('yavin'),'moon');
assert.deepEqual(Object.values(PLANET_APPEARANCES).filter(p=>p.kind==='gas').map(p=>p.id),['bespin','bothawui']);
assert.equal(PLANET_APPEARANCES['unreviewed-fictional-world'],undefined,'Unknown identities have no fabricated profile');
for(const id of['glavis-ringworld','fort-anaxes']){assert.equal(PLANET_APPEARANCES[id].kind,'unknown');assert.notEqual(getLocationKind(id),'planet');}
console.log(`PASS ${ALL_WORLDS.length} explicit mapped profiles, ${Object.keys(PLANET_APPEARANCES).length} total, bounded illustrative parameters, source references, unique seeds and nonplanet distinctions`);

// Atmospheric evidence supports a visible treatment without inferring physical composition.
for(const id of ['quarzite','quell']){
 const p=PLANET_APPEARANCES[id];assert.equal(p.kind,'clouded');
 assert.equal(p.oceanCoverage,0);assert.equal(p.iceCoverage,0);
 assert.match(p.note,/surface|terrain/i);
}
assert.match(PLANET_APPEARANCES.quarzite.note,/subterranean crystals are not exposed/i);
assert.ok(PLANET_APPEARANCES.quarzite.cloudAccent);
assert.equal(PLANET_APPEARANCES.pantora.kind,'terrestrial');assert.equal(PLANET_APPEARANCES.pantora.iceCoverage,0);assert.equal(getLocationKind('pantora'),'moon');
assert.match(PLANET_APPEARANCES.quell.note,/class is terrestrial/);
assert.ok(PLANET_APPEARANCES.teth.atmosphere);assert.match(PLANET_APPEARANCES.teth.note,/Wild Space.*Outer Rim.*U-12/);
