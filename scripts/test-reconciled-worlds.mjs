import assert from 'node:assert/strict';
import { MAPPED_WORLDS_EXPANSION as RECONCILED_WORLDS } from '../src/mappedWorldsExpansion.ts';
import { ALL_WORLDS } from '../src/journeyWorlds.ts';
import { gridToDisplay } from '../src/data.ts';
const expected={abafar:['O-6','Outer Rim Territories'],adelphi:['P-17','Outer Rim Territories'],arcana:['M-5','Outer Rim Territories'],bothawui:['R-14','Mid Rim'],carlac:['K-5','Outer Rim Territories'],corellia:['M-11','Core Worlds'],lothal:['U-7','Outer Rim Territories'],'lotho-minor':['I-17','Outer Rim Territories'],'oba-diah':['T-10','Outer Rim Territories'],quarzite:['M-13','Inner Rim'],quell:['Q-6','Outer Rim Territories'],'ringo-vinda':['R-7','Mid Rim'],seatos:['M-19','Outer Rim Territories'],'segra-milo':['R-7','Outer Rim Territories']};
assert.equal(RECONCILED_WORLDS.length,14);assert.equal(ALL_WORLDS.length,76);assert.equal(new Set(ALL_WORLDS.map(w=>w.id)).size,76);
for(const w of RECONCILED_WORLDS){assert.deepEqual([w.grid,w.region],expected[w.id]);assert.deepEqual({x:w.x,y:w.y},gridToDisplay(w.grid));assert.match(w.uncertainty,/cell center, not an exact planet position/);assert.equal(ALL_WORLDS.filter(x=>x.id===w.id).length,1);}
assert.equal(ALL_WORLDS.find(w=>w.id==='endor').name,'Endor (forest moon)');
console.log('PASS14 independently reviewed direct system grids/regions, cell-center projection, unique76 registry and retained moon distinction');
