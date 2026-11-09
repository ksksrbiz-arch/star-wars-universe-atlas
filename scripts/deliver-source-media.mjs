import {readFile,writeFile} from 'node:fs/promises';
const runtime=JSON.parse(await readFile('work/ingestion/runtime-private.json','utf8'));
const source=JSON.parse(await readFile('work/ingestion/delivery-input.json','utf8')).items;
let saved;try{saved=JSON.parse(await readFile('work/ingestion/delivered.json','utf8'));}catch{saved={items:[]};}
const delivered=new Map(saved.items.map(row=>[`${row.provider}:${row.providerId}:${row.id}`,row]));
const selected=source.filter(row=>!delivered.has(`${row.provider}:${row.providerId}:${row.id}`));
const maximum=Number(process.env.INGESTION_MAX_ITEMS??selected.length);
const url=process.env.INGESTION_URL??'https://star-wars-atlas-ingestion.skdev-371.workers.dev';
let failures=0,cursor=0,saves=Promise.resolve();
async function run(){for(;;){
 const i=cursor;cursor+=16;if(i>=Math.min(selected.length,maximum))return;
 const input=selected.slice(i,Math.min(i+16,maximum));
 let response;
 for(let attempt=0;attempt<4;attempt++){
  response=await fetch(url+'/media',{method:'POST',headers:{Authorization:`Bearer ${runtime.token}`,'Content-Type':'application/json'},body:JSON.stringify({items:input}),signal:AbortSignal.timeout(240000)});
  if(![409,429,502,503,504].includes(response.status))break;
  if(attempt<3){await response.body?.cancel();await new Promise(resolve=>setTimeout(resolve,2000*(attempt+1)));}
 }
 if(!response.ok)throw new Error(`Private media service returned HTTP ${response.status}`);
 const result=await response.json();
 for(const row of result.items??[]){const original=input.find(x=>x.id===row.id&&x.providerId===row.providerId&&x.provider===row.provider);delivered.set(`${row.provider}:${row.providerId}:${row.id}`,{...row,...(original?.reviewEvidence?{reviewEvidence:original.reviewEvidence}:{})});}
 failures+=(result.errors??[]).length;
 saves=saves.then(()=>writeFile('work/ingestion/delivered.json',JSON.stringify({items:[...delivered.values()]})));await saves;
 console.log(JSON.stringify({completed:delivered.size,planned:source.length,batch:input.length,failures}));
}}
await Promise.all(Array.from({length:Math.min(4,Number(process.env.INGESTION_CONCURRENCY??4))},run));
console.log(JSON.stringify({done:true,delivered:delivered.size,remaining:source.length-delivered.size,failures}));
