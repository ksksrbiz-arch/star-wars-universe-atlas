import assert from 'node:assert/strict';
import { WORLD_DOSSIERS, WORLD_TERRAIN } from '../src/worldDossiers.ts';
import { ALL_WORLDS } from '../src/journeyWorlds.ts';
assert.deepEqual(Object.keys(WORLD_DOSSIERS).sort(), ['bespin','coruscant','dagobah','endor','hoth','naboo','tatooine','yavin']);
const mapped = new Set(ALL_WORLDS.map(world=>world.id));
const sources = new Set();
for (const [id, dossier] of Object.entries(WORLD_DOSSIERS)) {
  assert.equal(dossier.worldId,id);
  assert(mapped.has(id));
  assert(dossier.caveat.length > 50);
  assert(dossier.highlights.length >= 2);
  assert.equal(new Set(dossier.highlights.map(item=>item.id)).size,dossier.highlights.length);
  for (const fact of [dossier.overview,dossier.terrain,...dossier.highlights]) {
    const source = new URL(fact.sourceUrl);
    assert.equal(source.protocol,'https:');
    assert.equal(source.hostname,'www.starwars.com');
    assert(source.pathname.startsWith('/databank/'));
    assert((fact.text ?? fact.description).length > 40);
    sources.add(fact.sourceUrl);
    for (const field of ['x','y','latitude','longitude','distance','sequence','itemId']) assert(!(field in fact), `Dossier must not infer ${field}`);
  }
}
assert.match(WORLD_DOSSIERS.coruscant.terrain.text,/landscape is urban/);
assert.match(WORLD_DOSSIERS.hoth.highlights.find(item=>item.id==='wampa-caverns').description,/not a single named cave/);
assert.match(WORLD_DOSSIERS.naboo.highlights.find(item=>item.id==='otoh-gunga').description,/Lake Paonga/);
assert.match(WORLD_DOSSIERS.coruscant.caveat,/change across eras/);

assert.deepEqual(Object.keys(WORLD_TERRAIN).sort(),Object.keys(WORLD_DOSSIERS).sort());
for(const [id, terrain] of Object.entries(WORLD_TERRAIN)) {
 assert(mapped.has(id));
 assert(['desert','urban','ice','wetlands','gas-giant','swamp','forest'].includes(terrain.category));
 assert.equal(new URL(terrain.sourceUrl).hostname,'www.starwars.com');
 assert(terrain.label.length > 2);
}
assert.equal(WORLD_TERRAIN.bespin.category,'gas-giant');
assert.equal(WORLD_TERRAIN.yavin.category,'forest');
assert.equal(WORLD_TERRAIN.endor.category,'forest');
assert.equal(WORLD_TERRAIN.dagobah.category,'swamp');
assert.equal(WORLD_TERRAIN.alderaan,undefined,'No inferred terrain for unreviewed worlds');
assert.match(WORLD_DOSSIERS.yavin.caveat,/moon, not the gas giant/);
assert.match(WORLD_DOSSIERS.endor.caveat,/separate ocean moon Kef Bir/);
assert.match(WORLD_DOSSIERS.bespin.terrain.text,/atmosphere rather than a conventional solid surface/);

console.log(`PASS: eight sourced world dossiers, ${sources.size} source pages, no invented coordinates or episode joins; key habitat/era distinctions retained`);
