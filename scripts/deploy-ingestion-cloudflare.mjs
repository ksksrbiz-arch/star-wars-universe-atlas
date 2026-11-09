import {readFile} from 'node:fs/promises';
const config=JSON.parse(await readFile('cloudflare/deployment.json','utf8'));
const token=process.env.CLOUDFLARE_API_TOKEN;
if(!token)throw new Error('CLOUDFLARE_API_TOKEN is required in the private deployment environment');
async function api(path,method,body){
 const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}${path}`,{method,headers:{Authorization:`Bearer ${token}`,...(body instanceof FormData?{}:{'Content-Type':'application/json'})},body:body instanceof FormData?body:JSON.stringify(body)});
 const result=await response.json();if(!response.ok||result.success===false)throw new Error(`Cloudflare private deployment returned HTTP ${response.status}`);return result.result;
}
const bindings=[{type:'r2_bucket',name:'ORIGINALS',bucket_name:config.originalsBucket},{type:'r2_bucket',name:'PUBLISHED_ASSETS',bucket_name:config.publishedBucket},{type:'hyperdrive',name:'INGESTION_DB',id:config.ingestionHyperdriveId}];
if(process.env.INGESTION_TOKEN)bindings.push({type:'secret_text',name:'INGESTION_TOKEN',text:process.env.INGESTION_TOKEN});
const metadata={main_module:'ingestion-worker.mjs',compatibility_date:config.compatibilityDate,compatibility_flags:['nodejs_compat'],bindings,keep_bindings:process.env.INGESTION_TOKEN?[]:['secret_text'],limits:{cpu_ms:30000},observability:{enabled:true,head_sampling_rate:.1,redact_query_string:true}};
const form=new FormData();form.append('metadata',new Blob([JSON.stringify(metadata)],{type:'application/json'}));form.append('ingestion-worker.mjs',new Blob([await readFile('dist-worker/ingestion-worker.mjs')],{type:'application/javascript+module'}),'ingestion-worker.mjs');
const result=await api(`/workers/scripts/${config.ingestionWorkerName}`,'PUT',form);
await api(`/workers/scripts/${config.ingestionWorkerName}/schedules`,'PUT',[{cron:config.ingestionCron}]);
console.log(JSON.stringify({worker:config.ingestionWorkerName,deploymentId:result.deployment_id,cron:config.ingestionCron}));
