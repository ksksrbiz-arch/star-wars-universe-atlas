import { Client } from 'pg';

const publicQueries = {
  '/api/catalog': 'SELECT payload FROM atlas_works ORDER BY id',
  '/api/worlds': 'SELECT payload FROM atlas_worlds ORDER BY id',
  '/api/appearances': 'SELECT payload FROM atlas_appearances ORDER BY work_id,world_id',
  '/api/sequences': 'SELECT payload FROM atlas_sequences ORDER BY id',
  '/api/regions': "SELECT payload FROM atlas_map_layers WHERE kind='region' ORDER BY id",
  '/api/routes': "SELECT payload FROM atlas_map_layers WHERE kind='route' ORDER BY id",
  '/api/media-index': 'SELECT payload FROM atlas_media_public ORDER BY canonical_type,canonical_id,provider',
};
const json = (body, status=200, cache='no-store') => Response.json(body,{status,headers:{'Cache-Control':cache,'X-Content-Type-Options':'nosniff'}});

const nosniff = {'X-Content-Type-Options':'nosniff'};
const plain = (body, status, extra={}) => new Response(body,{status,headers:{...nosniff,...extra}});
// Media is user-controllable content served from the app origin: never let it run script.
const mediaSecurity = {...nosniff,'Content-Security-Policy':"default-src 'none'; sandbox"};
const mediaError = (body, status, extra={}) => new Response(body,{status,headers:{...mediaSecurity,...extra}});
// Reject only real traversal: a '..' path segment (either separator style) in the decoded key.
const hasTraversal = key => key.split(/[\\/]/).includes('..');

export function databankParameters(url) {
  const type=url.searchParams.get('type')||null;
  const q=(url.searchParams.get('q')||'').trim();
  const offsetText=url.searchParams.get('offset')??'0',limitText=url.searchParams.get('limit')??'30';
  if(type&&!['location','character'].includes(type)||q.length>100||!/^\d+$/.test(offsetText)||!/^\d+$/.test(limitText))return null;
  const offset=Number(offsetText),limit=Number(limitText);
  return offset<=100000&&limit>=1&&limit<=100?{type,q,offset,limit}:null;
}
const databankQuery = `WITH filtered AS (SELECT provider,provider_id,name,payload FROM atlas_databank_public
 WHERE ($1::text IS NULL OR entity_type=$1) AND ($2::text='' OR strpos(lower(name),lower($2))>0))
 SELECT (SELECT count(*)::int FROM filtered) AS total,
 COALESCE((SELECT jsonb_agg(payload) FROM (SELECT payload FROM filtered ORDER BY lower(name),provider,provider_id LIMIT $3 OFFSET $4) page),'[]'::jsonb) AS items`;

function failedPrecondition(headers, object) {
  const match = headers.get('If-Match');
  if (match !== null) return match.trim() !== '*' && !match.split(',').some(tag => tag.trim() === object.httpEtag);
  const unmodified = Date.parse(headers.get('If-Unmodified-Since') || '');
  return Number.isFinite(unmodified) && Math.floor(object.uploaded.getTime() / 1000) > Math.floor(unmodified / 1000);
}

export default {
  async fetch(request, env, ctx) {
    const response = await handleRequest(request, env, ctx);
    // HEAD has the same status and headers as GET, but never a response body.
    return request.method === 'HEAD' ? new Response(null, response) : response;
  }
};

async function handleRequest(request, env, ctx) {
    const url = new URL(request.url),path=url.pathname;
    if (!['GET','HEAD'].includes(request.method)) return plain('Method not allowed',405,{Allow:'GET, HEAD'});
    if (path.startsWith('/api/')) {
      if (path !== '/api/health' && path !== '/api/databank' && !publicQueries[path]) return json({error:'Not found'},404);
      const parameters=path==='/api/databank'?databankParameters(url):null;
      if(path==='/api/databank'&&!parameters)return json({error:'Invalid Databank filters'},400);
      let client;
      try {
        client = new Client({connectionString:env.HYPERDRIVE.connectionString,connectionTimeoutMillis:10000,query_timeout:10000});
        await client.connect();
        if (path === '/api/health') {
          const result=await client.query('SELECT (SELECT count(*)::int FROM atlas_works) AS works,(SELECT count(*)::int FROM atlas_worlds) AS worlds,(SELECT count(*)::int FROM atlas_appearances) AS appearances');
          return json({status:'ok',database:'connected',...result.rows[0]});
        }
        if(path==='/api/databank'){
          const {type,q,offset,limit}=parameters;
          const result=await client.query(databankQuery,[type,q,limit,offset]);
          return json({...result.rows[0],offset,limit},200,'public, max-age=60, s-maxage=300');
        }
        const result=await client.query(publicQueries[path]);
        return json({items:result.rows.map(row=>row.payload)},200,'public, max-age=60, s-maxage=300');
      } catch {
        console.error('Atlas database request failed');
        return json({error:'Catalog service temporarily unavailable'},503);
      } finally { if (client) ctx.waitUntil(client.end().catch(()=>{})); }
    }
    if (path.startsWith('/media/')) {
      let key;
      try { key=decodeURIComponent(path.slice('/media/'.length)); }
      catch { return mediaError('Not found',404); }
      if (!key || hasTraversal(key)) return mediaError('Not found',404);
      // R2 does not implement If-Range. A full response is safe when it is supplied;
      // HEAD must ignore Range as well (RFC 9110 section 14.2).
      const range = request.method === 'GET' && !request.headers.has('If-Range') ? request.headers : undefined;
      let object;
      try { object=await env.PUBLISHED_ASSETS.get(key,{range,onlyIf:request.headers}); }
      catch (error) {
        try {
          // R2 reports unsatisfiable reads as InvalidRange (10039), not an object.
          if (range && /(?:\b10039\b|\bInvalidRange\b)/.test(String(error?.message))) {
            const metadata=await env.PUBLISHED_ASSETS.head(key);
            if (!metadata) return mediaError('Not found',404);
            return mediaError(null,416,{'Content-Range':`bytes */${metadata.size}`});
          }
        } catch {}
        // Constant message: never log error details (may contain credentials).
        console.error('Atlas media request failed');
        return mediaError('Media service temporarily unavailable',503,{'Cache-Control':'no-store'});
      }
      if (!object) return mediaError('Not found',404);
      const headers=new Headers({...mediaSecurity,'Cache-Control':'public, max-age=3600'});
      object.writeHttpMetadata(headers);headers.set('ETag',object.httpEtag);
      headers.set('Accept-Ranges','bytes');
      if (!('body' in object)) return new Response(null,{status:failedPrecondition(request.headers,object)?412:304,headers});
      let status=200;
      if (object.range) {
        const length = 'suffix' in object.range ? Math.min(object.range.suffix,object.size) : Math.min(object.range.length ?? object.size-(object.range.offset ?? 0),object.size-(object.range.offset ?? 0));
        const offset = 'suffix' in object.range ? object.size-length : object.range.offset ?? 0;
        status=206;headers.set('Content-Range',`bytes ${offset}-${offset+length-1}/${object.size}`);
        headers.set('Content-Length',String(length));
      } else headers.set('Content-Length',String(object.size));
      return new Response(request.method==='HEAD'?null:object.body,{status,headers});
    }
    return env.ASSETS.fetch(request);
}

