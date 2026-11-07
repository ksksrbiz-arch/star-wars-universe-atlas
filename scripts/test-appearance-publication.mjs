import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Client} from 'pg';
import {CONNECTIONS} from '../src/connections.ts';
import {ALL_WORLDS} from '../src/journeyWorlds.ts';
import {buildPublication,appearanceDigest} from './appearance-publication.mjs';
const catalog=JSON.parse(await readFile(new URL('../src/catalog.generated.json',import.meta.url),'utf8'));
const publication=buildPublication(CONNECTIONS,{works:catalog.items.length,worlds:ALL_WORLDS.length});
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
 for(const item of catalog.items) await client.query('INSERT INTO atlas_works VALUES($1,$2,$3,$4)',[item.id,item.seriesId,item.kind,item]);
 for(const world of ALL_WORLDS) await client.query('INSERT INTO atlas_worlds VALUES($1,$2,$3)',[world.id,world.grid,world]);
 const reset=async()=>{
  await client.query('TRUNCATE atlas_appearances,atlas_publications');
  await client.query("INSERT INTO atlas_publications(id,payload) VALUES('initial-2026-11-07','{}')");
  for(const row of CONNECTIONS.slice(0,171)) await client.query('INSERT INTO atlas_appearances VALUES($1,$2,$3)',[row.itemId,row.worldId,row]);
 };
 await reset();await client.query(publication.sql);
 const first=await client.query('SELECT id,published_at,payload FROM atlas_publications ORDER BY id');
 await client.query(publication.sql);
 assert.deepEqual((await client.query('SELECT id,published_at,payload FROM atlas_publications ORDER BY id')).rows,first.rows);
 assert.equal(appearanceDigest((await client.query('SELECT payload FROM atlas_appearances')).rows.map(row=>row.payload)),publication.manifest.sha256);
 console.log('PASS real Postgres additive publication, full payload verification, idempotent replay preserving timestamp');
 const rejects=async(pattern)=>{
  const before=(await client.query('SELECT count(*)::int AS n FROM atlas_appearances')).rows[0].n;
  await assert.rejects(client.query(publication.sql),pattern);await client.query('ROLLBACK');
  assert.equal((await client.query('SELECT count(*)::int AS n FROM atlas_appearances')).rows[0].n,before);
  assert.equal((await client.query('SELECT count(*)::int AS n FROM atlas_publications WHERE id=$1',[publication.manifest.id])).rows[0].n,0);
 };
 await reset();await client.query("UPDATE atlas_appearances SET payload=payload || '{\"note\":\"conflicting evidence\"}'::jsonb WHERE work_id=$1 AND world_id=$2",[CONNECTIONS[0].itemId,CONNECTIONS[0].worldId]);await rejects(/conflicts/);
 await reset();await client.query('INSERT INTO atlas_appearances VALUES($1,$2,$3)',[CONNECTIONS[0].itemId,'unexpected-world',{}]);await rejects(/conflicts/);
 await reset();await client.query('DELETE FROM atlas_publications');await rejects(/initial publication/);
 await reset();await client.query("INSERT INTO atlas_worlds VALUES('unexpected-world','A-1','{}')");await rejects(/baseline/);
 console.log('PASS conflict/unknown appearance/missing publication/baseline mismatch abort without partial inserts or publication');
}finally {
 if(client)await client.end();
 await admin.query(`DROP DATABASE ${db}`);await admin.end();
}
