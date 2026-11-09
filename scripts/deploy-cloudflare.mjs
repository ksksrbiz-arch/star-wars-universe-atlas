// Reproducible direct-upload API deployment. No credentials are stored in this repository.
// Importing this module has no side effects; the deployment only runs when it is executed directly.
import { readFile,readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const contentTypes={
  '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.mjs':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8','.map':'application/json; charset=utf-8','.webmanifest':'application/manifest+json',
  '.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8',
  '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif','.ico':'image/x-icon',
  '.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.otf':'font/otf',
  '.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.mp4':'video/mp4','.webm':'video/webm',
  '.wasm':'application/wasm','.pdf':'application/pdf'
};
export function contentTypeFor(file){return contentTypes[path.extname(file).toLowerCase()]||'application/octet-stream';}

// Policy derived from the built dist/: one same-origin module script and stylesheet, React inline style attributes,
// the Google Fonts stylesheet <link> in index.html (fonts.googleapis.com / fonts.gstatic.com), same-origin WebP/JPEG textures loaded by three.js (fetch/ImageBitmap, possibly blob: URLs),
// data:/blob: images, and no inline scripts, iframes, plugins or third-party network calls.
export const contentSecurityPolicy=[
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "connect-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ');
// frame-ancestors is ignored in Report-Only mode, so the clickjacking guard is enforced separately.
export const enforcedCsp="frame-ancestors 'none'";
// The full policy is Report-Only because no real-browser run of the deployed build was available when it was written.
// Promote to Content-Security-Policy after the browser console shows no violations.
export function headersFile(){
  return ['/*','  X-Content-Type-Options: nosniff','  Referrer-Policy: strict-origin-when-cross-origin',`  Content-Security-Policy: ${enforcedCsp}`,`  Content-Security-Policy-Report-Only: ${contentSecurityPolicy}`,'/assets/*','  Cache-Control: public, max-age=31536000, immutable'].join('\n');
}

export async function walk(dir,files=[]){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file,files);else files.push(file);}return files;}

export async function buildAssetManifest(assetsDirectory){
  const files=await walk(assetsDirectory),manifest={},contents={};
  for(const file of files){
    const bytes=await readFile(file),encoded=bytes.toString('base64'),ext=path.extname(file),type=contentTypeFor(file);
    // The content type is part of the hash so a corrected type is re-uploaded instead of deduplicated against an older octet-stream copy.
    const hash=createHash('sha256').update(encoded+ext+type).digest('hex').slice(0,32);
    manifest['/'+path.relative(assetsDirectory,file).replaceAll('\\','/')]={hash,size:bytes.length};
    contents[hash]={encoded,type};
  }
  return {files,manifest,contents};
}

async function deploy(){
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
  const {files,manifest,contents}=await buildAssetManifest(config.assetsDirectory);
  const session=await api(`/workers/scripts/${config.workerName}/assets-upload-session`,'POST',{manifest});
  let completion=session.jwt;
  for(const bucket of session.buckets){const form=new FormData();for(const hash of bucket){const file=contents[hash];form.append(hash,new Blob([file.encoded],{type:file.type}),hash);}const result=await api('/workers/assets/upload?base64=true','POST',form,session.jwt);if(result?.jwt)completion=result.jwt;}
  const metadata={main_module:'worker.mjs',compatibility_date:config.compatibilityDate,compatibility_flags:['nodejs_compat'],
    bindings:[{type:'assets',name:'ASSETS'},{type:'r2_bucket',name:'PUBLISHED_ASSETS',bucket_name:config.publishedBucket},{type:'hyperdrive',name:'HYPERDRIVE',id:config.hyperdriveId}],
    assets:{jwt:completion,config:{not_found_handling:'single-page-application',run_worker_first:['/api/*','/media/*'],_headers:headersFile()}},
    observability:{enabled:true,head_sampling_rate:.1,redact_query_string:true}};
  const form=new FormData();form.append('metadata',new Blob([JSON.stringify(metadata)],{type:'application/json'}));
  form.append('worker.mjs',new Blob([await readFile(config.workerModule)],{type:'application/javascript+module'}),'worker.mjs');
  const result=await api(`/workers/scripts/${config.workerName}`,'PUT',form);
  await api(`/workers/scripts/${config.workerName}/subdomain`,'POST',{enabled:true,previews_enabled:false});
  console.log(JSON.stringify({worker:config.workerName,deploymentId:result.deployment_id,assetCount:files.length}));
}

const isMain=process.argv[1]&&realpathSync(process.argv[1])===realpathSync(fileURLToPath(import.meta.url));
if(isMain)await deploy();
