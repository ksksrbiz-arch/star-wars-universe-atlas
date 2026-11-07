import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {ALL_WORLDS} from '../src/journeyWorlds.ts';
import {CONNECTIONS} from '../src/connections.ts';
import {STORY_SEQUENCES,STORY_CONNECTIONS} from '../src/chronology.ts';
import {GALACTIC_REGIONS} from '../src/galacticRegions.ts';
import {HYPERSPACE_ROUTES} from '../src/hyperspaceRoutes.ts';
const catalog=JSON.parse(await readFile('src/catalog.generated.json','utf8'));
const quote=value=>"'"+String(value).replaceAll("'","''")+"'";
const payload=value=>quote(JSON.stringify(value))+'::jsonb';
const statements=(await readFile('db/001_atlas.sql','utf8')).split('\n').filter(line=>!line.trim().startsWith('--')).join('\n').split(';').map(line=>line.trim()).filter(Boolean);
for(const w of catalog.items)statements.push(`INSERT INTO atlas_works VALUES (${quote(w.id)},${quote(w.seriesId)},${quote(w.kind)},${payload(w)}) ON CONFLICT DO NOTHING`);
for(const w of ALL_WORLDS)statements.push(`INSERT INTO atlas_worlds VALUES (${quote(w.id)},${quote(w.grid)},${payload(w)}) ON CONFLICT DO NOTHING`);
for(const c of CONNECTIONS)statements.push(`INSERT INTO atlas_appearances VALUES (${quote(c.itemId)},${quote(c.worldId)},${payload(c)}) ON CONFLICT DO NOTHING`);
for(const s of STORY_SEQUENCES){statements.push(`INSERT INTO atlas_sequences VALUES (${quote(s.id)},${payload(s)}) ON CONFLICT DO NOTHING`);for(const [i,id]of s.itemIds.entries())statements.push(`INSERT INTO atlas_sequence_items VALUES (${quote(s.id)},${quote(id)},${i+1}) ON CONFLICT DO NOTHING`);}
for(const [kind,items]of [['region',GALACTIC_REGIONS],['route',HYPERSPACE_ROUTES]])for(const x of items)statements.push(`INSERT INTO atlas_map_layers VALUES (${quote(kind+'-'+x.id)},${quote(kind)},${payload(x)}) ON CONFLICT DO NOTHING`);
statements.push(`INSERT INTO atlas_publications(id,payload) VALUES ('initial-2026-11-07',${payload({catalogMetadata:catalog.metadata,storyBridges:STORY_CONNECTIONS,note:'Partial appearance coverage; reference geography is approximate'})}) ON CONFLICT DO NOTHING`);
await mkdir('work/deploy',{recursive:true});await writeFile('work/deploy/seed-statements.json',JSON.stringify(statements));
console.log(`Prepared ${statements.length} additive schema/seed statements`);
