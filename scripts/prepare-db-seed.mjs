import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {ALL_WORLDS} from '../src/journeyWorlds.ts';
import {CONNECTIONS} from '../src/connections.ts';
import {STORY_SEQUENCES,STORY_CONNECTIONS} from '../src/chronology.ts';
import {GALACTIC_REGIONS} from '../src/galacticRegions.ts';
import {HYPERSPACE_ROUTES} from '../src/hyperspaceRoutes.ts';
const catalog=JSON.parse(await readFile('src/catalog.generated.json','utf8'));
const quote=value=>"'"+String(value).replaceAll("'","''")+"'";
const payload=value=>quote(JSON.stringify(value))+'::jsonb';
// Split SQL on top-level semicolons only: quotes, quoted identifiers, dollar-quoting and comments are respected; comments are dropped.
function splitSql(sql){
  const out=[];let cur='',i=0;
  const flush=()=>{const t=cur.trim();if(t)out.push(t);cur='';};
  while(i<sql.length){
    const c=sql[i],two=sql.slice(i,i+2);
    if(two==='--'){const e=sql.indexOf('\n',i);i=e<0?sql.length:e;continue;}
    if(two==='/*'){let depth=1;i+=2;while(i<sql.length&&depth){if(sql.startsWith('/*',i)){depth++;i+=2;}else if(sql.startsWith('*/',i)){depth--;i+=2;}else i++;}cur+=' ';continue;}
    if(c==="'"||c==='"'){let j=i+1;while(j<sql.length){if(sql[j]===c){if(sql[j+1]===c){j+=2;continue;}break;}j++;}cur+=sql.slice(i,j+1);i=j+1;continue;}
    if(c==='$'){const m=/^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(sql.slice(i));if(m){const e=sql.indexOf(m[0],i+m[0].length);const end=e<0?sql.length:e+m[0].length;cur+=sql.slice(i,end);i=end;continue;}}
    if(c===';'){flush();i++;continue;}
    cur+=c;i++;
  }
  flush();return out;
}
const statements=splitSql(await readFile('db/001_atlas.sql','utf8'));
for(const w of catalog.items)statements.push(`INSERT INTO atlas_works VALUES (${quote(w.id)},${quote(w.seriesId)},${quote(w.kind)},${payload(w)}) ON CONFLICT DO NOTHING`);
for(const w of ALL_WORLDS)statements.push(`INSERT INTO atlas_worlds VALUES (${quote(w.id)},${quote(w.grid)},${payload(w)}) ON CONFLICT DO NOTHING`);
for(const c of CONNECTIONS)statements.push(`INSERT INTO atlas_appearances VALUES (${quote(c.itemId)},${quote(c.worldId)},${payload(c)}) ON CONFLICT DO NOTHING`);
for(const s of STORY_SEQUENCES){statements.push(`INSERT INTO atlas_sequences VALUES (${quote(s.id)},${payload(s)}) ON CONFLICT DO NOTHING`);for(const [i,id]of s.itemIds.entries())statements.push(`INSERT INTO atlas_sequence_items VALUES (${quote(s.id)},${quote(id)},${i+1}) ON CONFLICT DO NOTHING`);}
for(const [kind,items]of [['region',GALACTIC_REGIONS],['route',HYPERSPACE_ROUTES]])for(const x of items)statements.push(`INSERT INTO atlas_map_layers VALUES (${quote(kind+'-'+x.id)},${quote(kind)},${payload(x)}) ON CONFLICT DO NOTHING`);
statements.push(`INSERT INTO atlas_publications(id,payload) VALUES ('initial-2026-11-07',${payload({catalogMetadata:catalog.metadata,storyBridges:STORY_CONNECTIONS,note:'Partial appearance coverage; reference geography is approximate'})}) ON CONFLICT DO NOTHING`);
await mkdir('work/deploy',{recursive:true});await writeFile('work/deploy/seed-statements.json',JSON.stringify(statements));
console.log(`Prepared ${statements.length} additive schema/seed statements`);
