#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Client} from 'pg';
import {publishRecords,normalizePublication} from './ingestion/publication-plan.mjs';

const records=JSON.parse(await readFile('work/ingestion/latest/records.json','utf8'));
const delivery=JSON.parse(await readFile('work/ingestion/delivered.json','utf8'));
const delivered=Array.isArray(delivery)?delivery:delivery.items;
const plan=normalizePublication(records,delivered);
const fingerprint=createHash('sha256').update(JSON.stringify({records:records.map(r=>[r.provider,r.providerId,r.payloadSha256]),delivered})).digest('hex');
if(!process.argv.includes('--apply')){
 console.log(JSON.stringify({mode:'dry-run',sourceRecords:plan.sourceRows.length,deliveredMedia:plan.mediaRows.length,canonicalMediaLinks:plan.links.length,fingerprint,canonicalWrites:0}));
}else{
 if(!process.env.ATLAS_DATABASE_URL)throw new Error('ATLAS_DATABASE_URL is required');
 const client=new Client({connectionString:process.env.ATLAS_DATABASE_URL,connectionTimeoutMillis:15000});
 const startedAt=new Date().toISOString();
 try{
  await client.connect();await client.query('BEGIN');
  await client.query("SELECT pg_advisory_xact_lock(hashtext('atlas-source-publication'))");
  // Schema migration is additive and idempotent. Existing canonical tables are never written.
  await client.query(await readFile('db/002_enrichment.sql','utf8'));
  const counts=await publishRecords(client,records,delivered);
  await client.query('INSERT INTO atlas_ingestion_runs(id,started_at,completed_at,status,payload) VALUES($1,$2,now(),$3,$4::jsonb) ON CONFLICT(id) DO UPDATE SET completed_at=now(),status=EXCLUDED.status,payload=EXCLUDED.payload',[
   `publication:${fingerprint}`,startedAt,'complete',JSON.stringify({...counts,fingerprint,canonicalWrites:0})]);
  await client.query('COMMIT');console.log(JSON.stringify({mode:'published',...counts,fingerprint,canonicalWrites:0}));
 }catch(error){await client.query('ROLLBACK').catch(()=>{});throw error;}finally{await client.end();}
}
