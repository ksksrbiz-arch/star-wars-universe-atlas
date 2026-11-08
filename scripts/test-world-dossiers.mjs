import assert from 'node:assert/strict';
import { WORLD_DOSSIERS, WORLD_TERRAIN } from '../src/worldDossiers.ts';
import { ALL_WORLDS } from '../src/journeyWorlds.ts';
assert.deepEqual(Object.keys(WORLD_DOSSIERS).sort(), ['atollon','malachor','seelos','lothal','kessel','stygeon-prime','fort-anaxes','bespin','coruscant','dagobah','eadu','endor','glavis-ringworld','hoth','kamino','kashyyyk','jedha','lahmu','mustafar','naboo','scarif','tatooine','utapau','geonosis','yavin'].sort());
const mapped = new Set(ALL_WORLDS.map(world=>world.id));
const sources = new Set();
for (const [id, dossier] of Object.entries(WORLD_DOSSIERS)) {
  assert.equal(dossier.worldId,id);
  assert(mapped.has(id) || ['atollon','malachor','seelos','kessel','stygeon-prime','fort-anaxes','scarif','jedha','eadu','lahmu','glavis-ringworld','kamino','kashyyyk','utapau'].includes(id), 'A textual dossier must not imply a map placement');
  assert(dossier.caveat.length > 50);
  assert(dossier.highlights.length >= 2);
  assert.equal(new Set(dossier.highlights.map(item=>item.id)).size,dossier.highlights.length);
  for (const fact of [dossier.overview,dossier.terrain,...dossier.highlights]) {
    const source = new URL(fact.sourceUrl);
    assert.equal(source.protocol,'https:');
    assert.equal(source.hostname,'www.starwars.com');
    assert(source.pathname.startsWith('/databank/') || source.href === 'https://www.starwars.com/news/fates-fulfilled-dave-filoni-reflects-on-star-wars-rebels-season-two-part-2');
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
 assert(WORLD_DOSSIERS[id], 'Terrain categories require a reviewed dossier');
 assert(['desert','urban','ice','wetlands','gas-giant','swamp','forest','tropical','cold-desert','rugged','mineral-rich','volcanic','ocean','sinkholes','plains','caverns','asteroid'].includes(terrain.category));
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

console.log(`PASS: ${Object.keys(WORLD_DOSSIERS).length} sourced world dossiers, ${sources.size} source pages, no invented coordinates or episode joins; key habitat/era distinctions retained`);

assert.match(WORLD_DOSSIERS.jedha.terrain.text,/persistent cold/);
assert.match(WORLD_DOSSIERS.jedha.caveat,/moon, not a parent planet/);
assert.match(WORLD_DOSSIERS.lahmu.terrain.text,/contaminated/);
assert.match(WORLD_DOSSIERS.mustafar.highlights.find(place=>place.id==='vaders-castle').description,/particular historical era/);
assert.equal(WORLD_DOSSIERS['ring-of-kafrene'],undefined,'No planet dossier invented for an asteroid outpost');

assert.match(WORLD_DOSSIERS['glavis-ringworld'].caveat, /not a planet/);
assert.equal(WORLD_DOSSIERS['glavis-ringworld'].environmentLabel, 'STRUCTURE & LIGHT');
assert.equal(WORLD_DOSSIERS.tatooine.highlights.find(place=>place.id==='garsas-sanctuary').sourceUrl, 'https://www.starwars.com/databank/garsa-s-sanctuary');

assert.equal(WORLD_TERRAIN.kamino.category, "ocean");
assert.equal(WORLD_TERRAIN.utapau.category, "sinkholes");
assert.match(WORLD_DOSSIERS.geonosis.caveat, /not an orbital model/);

assert.match(WORLD_DOSSIERS['fort-anaxes'].caveat,/not intact Clone Wars-era Anaxes/);
assert.equal(WORLD_TERRAIN['fort-anaxes'].category,'asteroid');
assert.equal(WORLD_TERRAIN.lothal.category,'plains');
