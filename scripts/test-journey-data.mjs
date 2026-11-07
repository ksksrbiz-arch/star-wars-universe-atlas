import assert from 'node:assert/strict';
import { writeFile, readFile } from 'node:fs/promises';
import { ALL_WORLDS } from '../src/journeyWorlds.ts';
import { gridToDisplay } from '../src/data.ts';
import { REFERENCE_PLACEMENTS } from '../src/referencePlacements.ts';
import { CONNECTIONS } from '../src/connections.ts';
const catalog=JSON.parse(await readFile(new URL('../src/catalog.generated.json',import.meta.url),'utf8')).items;
assert(ALL_WORLDS.length>=27);assert.equal(new Set(ALL_WORLDS.map(w=>w.id)).size,ALL_WORLDS.length);
let referenceTraced=0, cellCentered=0;
for(const world of ALL_WORLDS){const center=gridToDisplay(world.grid);assert(Math.abs(world.x-center.x)<=.05&&Math.abs(world.y-center.y)<=.05,`${world.id} inside published cell`);if(REFERENCE_PLACEMENTS[world.id]){assert(world.uncertainty.includes('approximately traced'));referenceTraced++;}else{assert.deepEqual({x:world.x,y:world.y},center);cellCentered++;}assert(Number.isFinite(world.x)&&Number.isFinite(world.y));assert(world.sourceUrl.startsWith('https://'));assert(world.uncertainty.length>20);}
assert.equal(referenceTraced,27);assert.equal(cellCentered,35);
const covered=new Set(CONNECTIONS.map(c=>c.itemId));const mapped=new Set(ALL_WORLDS.map(w=>w.id));
const bySeries=Object.fromEntries([...new Set(catalog.map(item=>item.seriesId))].map(id=>[id,{catalog:catalog.filter(i=>i.seriesId===id).length,withLocations:catalog.filter(i=>i.seriesId===id&&covered.has(i.id)).length}]));
const report={checkedOn:'2026-11-07',catalogItems:catalog.length,relationships:CONNECTIONS.length,titlesWithLocationEvidence:covered.size,titlesWithoutLocationEvidence:catalog.length-covered.size,mapPlacements:ALL_WORLDS.length,referenceTraced,cellCentered,bySeries,unplacedAssociatedWorlds:[...new Map(CONNECTIONS.filter(c=>!mapped.has(c.worldId)).map(c=>[c.worldId,c.worldName])).values()],unlinkedTitleIds:catalog.filter(i=>!covered.has(i.id)).map(i=>i.id),note:'A covered title has at least one sourced link, not necessarily all appearances. An unlinked title is not evidence of no planet appearances. Map grid placements are sourced independently.'};
await writeFile('evidence/journey-coverage.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,unlinkedTitleIds:undefined},null,2));
