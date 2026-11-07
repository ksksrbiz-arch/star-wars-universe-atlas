import {STORY_SEQUENCES} from '../src/chronology.ts';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Client} from 'pg';
import {CONNECTIONS} from '../src/connections.ts';
import {ALL_WORLDS} from '../src/journeyWorlds.ts';
import {buildPublication,appearanceDigest,datasetDigest} from './appearance-publication.mjs';
const catalog=JSON.parse(await readFile(new URL('../src/catalog.generated.json',import.meta.url),'utf8'));
const publication=buildPublication(CONNECTIONS,{works:catalog.items.length,worlds:ALL_WORLDS.length,catalog:catalog.items,sequences:STORY_SEQUENCES});
assert.deepEqual(JSON.parse(await readFile('db/publications/appearances.json','utf8')),publication.manifest);
assert.equal(await readFile('db/publications/appearances.sql','utf8'),publication.sql);
assert.equal(appearanceDigest([...CONNECTIONS].reverse()),publication.manifest.sha256);
assert.throws(()=>buildPublication([...CONNECTIONS,CONNECTIONS[0]],{works:185,worlds:62}),/Duplicate/);
console.log('PASS artifact/registry identity, deterministic order, duplicate rejection');
if(!process.env.ATLAS_TEST_DATABASE_URL) {
 console.log('Postgres integration NOT RUN; set ATLAS_TEST_DATABASE_URL to a disposable local PostgreSQL administrator database.');
 process.exit(0);
}
const url=new URL(process.env.ATLAS_TEST_DATABASE_URL);
if(!['localhost','127.0.0.1','[::1]'].includes(url.hostname)) throw Error('Integration tests require a local disposable Postgres server');
const admin=new Client({connectionString:url.toString()});await admin.connect();
const db=`atlas_test_${process.pid}_${Date.now()}`;
let client;
try {
 await admin.query(`CREATE DATABASE ${db}`);
 url.pathname=`/${db}`;client=new Client({connectionString:url.toString()});await client.connect();
 await client.query(await readFile('db/001_atlas.sql','utf8'));
 for(const item of catalog.items.filter(item=>item.seriesId!=='ahsoka')) await client.query('INSERT INTO atlas_works VALUES($1,$2,$3,$4)',[item.id,item.seriesId,item.kind,item]);
 for(const world of ALL_WORLDS) await client.query('INSERT INTO atlas_worlds VALUES($1,$2,$3)',[world.id,world.grid,world]);
 const reset=async()=>{
  await client.query('TRUNCATE atlas_appearances,atlas_publications,atlas_sequence_items,atlas_sequences');
  await client.query("DELETE FROM atlas_works WHERE series_id='ahsoka'");
  for(const sequence of STORY_SEQUENCES.filter(s=>!s.id.includes('ahsoka'))) {await client.query('INSERT INTO atlas_sequences VALUES($1,$2)',[sequence.id,sequence]);for(const [i,id] of sequence.itemIds.entries())await client.query('INSERT INTO atlas_sequence_items VALUES($1,$2,$3)',[sequence.id,id,i+1]);}
  await client.query("INSERT INTO atlas_publications(id,payload) VALUES('initial-2026-11-07','{}')");
  for(const row of CONNECTIONS.slice(0,171)) await client.query('INSERT INTO atlas_appearances VALUES($1,$2,$3)',[row.itemId,row.worldId,row]);
 };
 await reset();await client.query(publication.sql);
 const first=await client.query('SELECT id,published_at,payload FROM atlas_publications ORDER BY id');
 await client.query(publication.sql);
 assert.deepEqual((await client.query('SELECT id,published_at,payload FROM atlas_publications ORDER BY id')).rows,first.rows);
 assert.equal(appearanceDigest((await client.query('SELECT payload FROM atlas_appearances')).rows.map(row=>row.payload)),publication.manifest.sha256);
 assert.equal(datasetDigest((await client.query('SELECT payload FROM atlas_works')).rows.map(r=>r.payload)),publication.manifest.catalogSha256);
 assert.equal(datasetDigest((await client.query('SELECT payload FROM atlas_sequences')).rows.map(r=>r.payload)),publication.manifest.sequencesSha256);
 assert.equal((await client.query('SELECT count(*)::int AS n FROM atlas_sequence_items')).rows[0].n,STORY_SEQUENCES.reduce((n,s)=>n+s.itemIds.length,0));
 console.log('PASS real Postgres additive publication, full payload verification, idempotent replay preserving timestamp');
 const rejects=async(pattern)=>{
  const before=(await client.query('SELECT count(*)::int AS n FROM atlas_appearances')).rows[0].n;
  const workCount=(await client.query('SELECT count(*)::int AS n FROM atlas_works')).rows[0].n;
  const seqCount=(await client.query('SELECT count(*)::int AS n FROM atlas_sequences')).rows[0].n;
  await assert.rejects(client.query(publication.sql),pattern);await client.query('ROLLBACK');
  assert.equal((await client.query('SELECT count(*)::int AS n FROM atlas_appearances')).rows[0].n,before);
  assert.equal((await client.query('SELECT count(*)::int AS n FROM atlas_works')).rows[0].n,workCount);
  assert.equal((await client.query('SELECT count(*)::int AS n FROM atlas_sequences')).rows[0].n,seqCount);
  assert.equal((await client.query('SELECT count(*)::int AS n FROM atlas_publications WHERE id=$1',[publication.manifest.id])).rows[0].n,0);
 };
 await reset();await client.query("UPDATE atlas_appearances SET payload=payload || '{\"note\":\"conflicting evidence\"}'::jsonb WHERE work_id=$1 AND world_id=$2",[CONNECTIONS[0].itemId,CONNECTIONS[0].worldId]);await rejects(/conflicts/);
 await reset();await client.query('INSERT INTO atlas_appearances VALUES($1,$2,$3)',[CONNECTIONS[0].itemId,'unexpected-world',{}]);await rejects(/conflicts/);
 await reset();await client.query('DELETE FROM atlas_publications');await rejects(/initial publication/);
 await reset();await client.query("UPDATE atlas_works SET payload=payload || '{\"title\":\"conflicting title\"}'::jsonb WHERE id=$1",[catalog.items[0].id]);await rejects(/catalog conflicts/);await client.query('UPDATE atlas_works SET payload=$1 WHERE id=$2',[catalog.items[0],catalog.items[0].id]);
 await reset();await client.query('UPDATE atlas_sequence_items SET position=99999 WHERE sequence_id=$1 AND position=1',[STORY_SEQUENCES.find(s=>!s.id.includes('ahsoka')).id]);await rejects(/sequence order conflicts/);
 await reset();await client.query("UPDATE atlas_sequences SET payload=payload || '{\"description\":\"conflict\"}'::jsonb");await rejects(/sequence conflicts/);
 await reset();await client.query("INSERT INTO atlas_worlds VALUES('unexpected-world','A-1','{}')");await rejects(/baseline/);
 console.log('PASS conflict/unknown appearance/missing publication/baseline mismatch abort without partial inserts or publication');
}finally {
 if(client)await client.end();
 await admin.query(`DROP DATABASE ${db}`);await admin.end();
}
