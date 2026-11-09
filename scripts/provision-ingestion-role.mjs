import {Client} from 'pg';
import {randomBytes} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const c=new Client({connectionString:process.env.ATLAS_DATABASE_URL});
await c.connect();
try{
 const file='work/ingestion/runtime-private.json';
 let saved;try{saved=JSON.parse(await readFile(file,'utf8'));}catch{}
 const exists=(await c.query("SELECT 1 FROM pg_roles WHERE rolname='atlas_ingestor'")).rowCount;
 if(exists&&!saved?.databaseUrl&&!process.argv.includes('--recover-new-role'))throw new Error('Existing ingestion role needs its saved connection; no password rotation performed');
 const password=saved?new URL(saved.databaseUrl).password:randomBytes(32).toString('hex');
 const url=new URL(process.env.ATLAS_DATABASE_URL);url.username='atlas_ingestor';url.password=password;
 const runtime={databaseUrl:url.href,token:saved?.token??randomBytes(32).toString('hex')};
 await mkdir('work/ingestion',{recursive:true});await writeFile(file,JSON.stringify(runtime));
 if(!exists)await c.query(`CREATE ROLE atlas_ingestor LOGIN PASSWORD '${password}' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT`);
 else if(!saved)await c.query(`ALTER ROLE atlas_ingestor PASSWORD '${password}'`);
 await c.query('GRANT USAGE ON SCHEMA public TO atlas_ingestor');
 await c.query('GRANT SELECT,INSERT,UPDATE ON atlas_source_records,atlas_source_snapshots,atlas_source_media,atlas_source_links,atlas_ingestion_runs TO atlas_ingestor');
 console.log(JSON.stringify({role:'atlas_ingestor',privateCredentialsSaved:true,...(await c.query("SELECT (SELECT count(*)::int FROM atlas_source_records) AS sources,has_table_privilege('atlas_reader','atlas_source_records','SELECT') AS readerCanReadRaw,has_table_privilege('atlas_ingestor','atlas_works','INSERT') AS ingestorCanWriteCanon")).rows[0]}));
}finally{await c.end();}
