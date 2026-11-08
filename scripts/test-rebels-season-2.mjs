import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {STORY_SEQUENCES} from '../src/chronology.ts';import {REBELS_SEASON_2_CONNECTIONS as links} from '../src/connectionsRebelsSeason2.ts';import {CONNECTION_COVERAGE} from '../src/connections.ts';import {getLocationKind} from '../src/locations.ts';
const catalog=JSON.parse(readFileSync('src/catalog.generated.json','utf8'));const snapshot=JSON.parse(readFileSync('docs/rebels-season-2-source.json','utf8'));const items=catalog.items.filter(x=>x.seriesId==='rebels'&&x.season===2);
assert.equal(items.length,20);assert.deepEqual(items.flatMap(x=>Array.from({length:(x.episodeEnd??x.episode)-x.episode+1},(_,i)=>x.episode+i)),Array.from({length:22},(_,i)=>i+1));
assert.deepEqual(items.filter(x=>x.episodeEnd).map(x=>[x.episode,x.episodeEnd]),[[1,2],[21,22]]);assert(!items.some(x=>[2,22].includes(x.episode)));assert(items.every(x=>x.runtimeMinutes===null));
assert.deepEqual(STORY_SEQUENCES.find(x=>x.id==='rebels').itemIds.slice(14,34),items.map(x=>x.id));
for(const source of snapshot.episodes){assert.equal(source.number,source.providerNumber===1?1:source.providerNumber+1);const item=items.find(x=>x.id===source.id);assert.equal(item.title,source.name);assert.equal(item.releaseDate,source.airdate);assert.equal(item.sourceUrl,source.sourceUrl);}
assert.equal(snapshot.episodeEvidence.length,20);assert.equal(catalog.metadata.sourceFiles.find(x=>x.name==='rebels-season-2-source.json').sha256,createHash('sha256').update(readFileSync('docs/rebels-season-2-source.json')).digest('hex'));
assert.equal(links.length,24);assert.equal(new Set(links.map(x=>x.itemId)).size,18);for(const x of links){assert(items.some(i=>i.id===x.itemId));assert.equal(new URL(x.sourceUrl).hostname,'www.starwars.com');assert.equal(x.sequence,undefined);assert(!('x' in x)&&!('y' in x));}
for(const id of ['rebels-s02e15','rebels-s02e19']){assert(!links.some(x=>x.itemId===id));assert(CONNECTION_COVERAGE.reviewedWithoutPlanetLink.some(x=>x.itemId===id));}
assert.equal(getLocationKind('concord-dawn-third-moon'),'moon');assert.equal(getLocationKind('concord-dawn-system'),'system');assert.equal(getLocationKind('geonosis-icy-moon'),'moon');
for(const id of ['broken-horn','shadow-caster','titus-interdictor'])assert.equal(getLocationKind(id),'ship');assert.equal(getLocationKind('abandoned-republic-medical-station'),'space-station');
assert(links.filter(x=>['geonosis','ryloth','ibaar'].includes(x.worldId)).every(x=>x.context==='orbit'));
assert(!links.some(x=>['mustafar','lasan','alderaan','yost','rinn'].includes(x.worldId)));assert(!links.some(x=>x.itemId==='rebels-s02e18'&&x.worldId==='malachor'));
console.log('Rebels season two passed: 20 records / 22 official parts / 24 joins / 18 covered / two explicit gaps.');
