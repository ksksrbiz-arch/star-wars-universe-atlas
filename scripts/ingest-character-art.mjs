import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const source=JSON.parse(await readFile('docs/character-art-source.json','utf8'));
const {token}=JSON.parse(await readFile('work/ingestion/runtime-private.json','utf8'));
const atlas=process.env.ATLAS_URL??'https://star-wars-universe-atlas.skdev-371.workers.dev';
const service=process.env.INGESTION_URL??'https://star-wars-atlas-ingestion.skdev-371.workers.dev';
const items=[];
for(const row of source.items){
 const response=await fetch(`${atlas}/api/databank?type=character&q=${encodeURIComponent(row.databankName)}&limit=100`);
 if(!response.ok)throw new Error('Character identity lookup unavailable');
 const matches=(await response.json()).items.filter(item=>item.name===row.databankName);
 if(matches.length!==1)throw new Error(`Ambiguous character identity: ${row.name}`);
 items.push({id:createHash('sha256').update(row.imageUrl).digest('hex'),provider:'databank',providerId:matches[0].providerId,kind:'character-cutout',sourceUrl:row.imageUrl,sourcePageUrl:row.sourceUrl,credit:row.credit,originProvider:row.originProvider,provenance:{reviewedName:row.name,revisionId:row.revisionId,revisionTimestamp:row.revisionTimestamp,sourceSha1:row.sourceSha1,sourceWidth:row.sourceWidth,sourceHeight:row.sourceHeight,framing:row.framing,useBasis:row.useBasis,verifiedAlpha:row.verifiedAlpha}});
}
const delivered=[],errors=[];
for(let i=0;i<items.length;i+=16){
 const response=await fetch(`${service}/media`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({items:items.slice(i,i+16)}),signal:AbortSignal.timeout(180000)});
 if(!response.ok)throw new Error(`Private artwork delivery returned HTTP ${response.status}`);
 const result=await response.json();delivered.push(...result.items??[]);errors.push(...result.errors??[]);
}
await mkdir('work/character-art',{recursive:true});await writeFile('work/character-art/delivered.json',JSON.stringify({items:delivered,errors},null,2));
console.log(JSON.stringify({requested:items.length,delivered:delivered.length,errors}));
if(errors.length)process.exitCode=2;
