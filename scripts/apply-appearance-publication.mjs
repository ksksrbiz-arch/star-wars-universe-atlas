import {STORY_SEQUENCES} from '../src/chronology.ts';
import {readFile} from 'node:fs/promises';
import {Client} from 'pg';
import {CONNECTIONS} from '../src/connections.ts';
import {appearanceDigest,buildPublication,canonicalJson,datasetDigest} from './appearance-publication.mjs';
const connectionString=process.env.ATLAS_DATABASE_URL;
if(!connectionString) throw new Error('Configure ATLAS_DATABASE_URL securely with a publication writer connection to the atlas database.');
let target;
try {target=new URL(connectionString);} catch {throw new Error('ATLAS_DATABASE_URL must be a valid PostgreSQL URI; value omitted.');}
if(!['postgres:','postgresql:'].includes(target.protocol)) throw new Error('Expected a PostgreSQL URI; value omitted.');
if(target.pathname!='/atlas' || !target.hostname.endsWith('.neon.tech')) throw new Error('Refusing publication: expected the dedicated Neon atlas database.');
const manifest=JSON.parse(await readFile('db/publications/appearances.json','utf8'));
if(appearanceDigest(CONNECTIONS)!==manifest.sha256) throw new Error('Publication artifact is stale; regenerate and review it.');
const catalog=JSON.parse(await readFile('src/catalog.generated.json','utf8'));
const {ALL_WORLDS}=await import('../src/journeyWorlds.ts');
const expected=buildPublication(CONNECTIONS,{works:catalog.items.length,worlds:ALL_WORLDS.length,mappedWorlds:ALL_WORLDS,catalog:catalog.items,sequences:STORY_SEQUENCES,sequenceBaselines:JSON.parse(await readFile('db/sequence-extension-baselines.json','utf8'))});
const sql=await readFile('db/publications/appearances.sql','utf8');
if(canonicalJson(expected.manifest)!==canonicalJson(manifest) || sql!==expected.sql) throw new Error('Reviewed SQL/manifest does not match the current generator and registry.');
if(process.argv.includes('--apply') && process.env.ATLAS_DATABASE_HOST!==target.hostname) throw new Error('Set non-secret ATLAS_DATABASE_HOST to the independently verified dedicated Neon endpoint before applying.');
// Enforce verified TLS even if a supplied URI requests weaker sslmode behavior.
for(const name of ['sslmode','sslcert','sslkey','sslrootcert']) target.searchParams.delete(name);
const client=new Client({connectionString:target.toString(),ssl:{rejectUnauthorized:true},connectionTimeoutMillis:10000});
try {
 await client.connect();
 const {rows:[identity]}=await client.query("SELECT current_database() AS database, current_user AS role, (SELECT count(*)::int FROM public.atlas_appearances) AS appearances");
 if(identity.database!=='atlas') throw new Error('Database identity mismatch');
 console.log(JSON.stringify({host:target.hostname,...identity,proposedPublication:manifest.id}));
 if(!process.argv.includes('--apply')) console.log('Read-only target check complete. Pass --apply only after reviewing this identity and the SQL/manifest.');
 else {
  await client.query(sql);
  const {rows}=await client.query('SELECT payload FROM public.atlas_appearances ORDER BY work_id,world_id');
  if(appearanceDigest(rows.map(row=>row.payload))!==manifest.sha256) throw new Error('Post-publication verification mismatch');
  for(const [table,hash] of [['atlas_worlds',manifest.worldsSha256],['atlas_works',manifest.catalogSha256],['atlas_sequences',manifest.sequencesSha256]]) {const result=await client.query(`SELECT payload FROM public.${table}`);if(datasetDigest(result.rows.map(row=>row.payload))!==hash)throw new Error('Post-publication catalog verification mismatch');}
  console.log(`Verified ${rows.length} published appearances: ${manifest.id}`);
 }
} catch(error) {
 await client.query('ROLLBACK').catch(()=>{});
 // Never echo connection strings or raw driver errors that may contain credentials.
 console.error(`Publication stopped: ${error.code || 'validation failure'}. No credentials are printed.`);
 process.exitCode=1;
} finally {await client.end();}
