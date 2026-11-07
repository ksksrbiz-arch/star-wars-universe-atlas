// Reproducible direct-upload API deployment. No credentials are stored in this repository.
import { readFile,readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const config=JSON.parse(await readFile('cloudflare/deployment.json','utf8'));
const token=process.env.CLOUDFLARE_API_TOKEN;
if(!token) throw new Error('CLOUDFLARE_API_TOKEN must be provided by the build environment');
const base=`https://api.cloudflare.com/client/v4/accounts/${config.accountId}`;
async function api(route,method='GET',body,auth=token){
  const headers={Authorization:`Bearer ${auth}`};
  if(body && !(body instanceof FormData)) {headers['Content-Type']='application/json';body=JSON.stringify(body);}
  const response=await fetch(base+route,{method,headers,body});
  const data=await response.json();
  if(!response.ok || data.success===false) throw new Error(`Cloudflare ${route}: ${response.status} ${JSON.stringify(data.errors)}`);
  return data.result;
}
const files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else files.push(file);}}
await walk(config.assetsDirectory);
const manifest={},contents={};
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
for(const file of files){
  const bytes=await readFile(file),encoded=bytes.toString('base64'),ext=path.extname(file);
  const hash=createHash('sha256').update(encoded+ext).digest('hex').slice(0,32);
  manifest['/'+path.relative(config.assetsDirectory,file).replaceAll('\\','/')]={hash,size:bytes.length};
  contents[hash]={encoded,type:types[ext]||'application/octet-stream'};
}
const session=await api(`/workers/scripts/${config.workerName}/assets-upload-session`,'POST',{manifest});
let completion=session.jwt;
for(const bucket of session.buckets){const form=new FormData();for(const hash of bucket){const file=contents[hash];form.append(hash,new Blob([file.encoded],{type:file.type}),hash);}const result=await api('/workers/assets/upload?base64=true','POST',form,session.jwt);if(result?.jwt)completion=result.jwt;}
const metadata={main_module:'worker.mjs',compatibility_date:config.compatibilityDate,compatibility_flags:['nodejs_compat'],
  bindings:[{type:'assets',name:'ASSETS'},{type:'r2_bucket',name:'PUBLISHED_ASSETS',bucket_name:config.publishedBucket},{type:'hyperdrive',name:'HYPERDRIVE',id:config.hyperdriveId}],
  assets:{jwt:completion,config:{not_found_handling:'single-page-application',run_worker_first:['/api/*','/media/*'],_headers:'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable'}},
  observability:{enabled:true,head_sampling_rate:.1,redact_query_string:true}};
const form=new FormData();form.append('metadata',new Blob([JSON.stringify(metadata)],{type:'application/json'}));
form.append('worker.mjs',new Blob([await readFile(config.workerModule)],{type:'application/javascript+module'}),'worker.mjs');
const result=await api(`/workers/scripts/${config.workerName}`,'PUT',form);
await api(`/workers/scripts/${config.workerName}/subdomain`,'POST',{enabled:true,previews_enabled:false});
console.log(JSON.stringify({worker:config.workerName,deploymentId:result.deployment_id,assetCount:files.length}));
