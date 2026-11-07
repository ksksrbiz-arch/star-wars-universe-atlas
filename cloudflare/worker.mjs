import { Client } from 'pg';

const publicQueries = {
  '/api/catalog': 'SELECT payload FROM atlas_works ORDER BY id',
  '/api/worlds': 'SELECT payload FROM atlas_worlds ORDER BY id',
  '/api/appearances': 'SELECT payload FROM atlas_appearances ORDER BY work_id,world_id',
  '/api/sequences': 'SELECT payload FROM atlas_sequences ORDER BY id',
  '/api/regions': "SELECT payload FROM atlas_map_layers WHERE kind='region' ORDER BY id",
  '/api/routes': "SELECT payload FROM atlas_map_layers WHERE kind='route' ORDER BY id",
};
const json = (body, status=200, cache='no-store') => Response.json(body,{status,headers:{'Cache-Control':cache,'X-Content-Type-Options':'nosniff'}});

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
    const path = new URL(request.url).pathname;
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
    if (path.startsWith('/api/')) {
      if (path !== '/api/health' && !publicQueries[path]) return json({error:'Not found'},404);
      let client;
      try {
        client = new Client({connectionString:env.HYPERDRIVE.connectionString,connectionTimeoutMillis:10000,query_timeout:10000});
        await client.connect();
        if (path === '/api/health') {
          const result=await client.query('SELECT (SELECT count(*)::int FROM atlas_works) AS works,(SELECT count(*)::int FROM atlas_worlds) AS worlds,(SELECT count(*)::int FROM atlas_appearances) AS appearances');
          return json({status:'ok',database:'connected',...result.rows[0]});
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
      catch { return new Response('Not found',{status:404}); }
      if (!key || key.includes('..')) return new Response('Not found',{status:404});
      // R2 does not implement If-Range. A full response is safe when it is supplied;
      // HEAD must ignore Range as well (RFC 9110 section 14.2).
      const range = request.method === 'GET' && !request.headers.has('If-Range') ? request.headers : undefined;
      let object;
      try { object=await env.PUBLISHED_ASSETS.get(key,{range,onlyIf:request.headers}); }
      catch (error) {
        // R2 reports unsatisfiable reads as InvalidRange (10039), not an object.
        if (range && /(?:\b10039\b|\bInvalidRange\b)/.test(String(error?.message))) {
          const metadata=await env.PUBLISHED_ASSETS.head(key);
          return new Response(null,{status:416,headers:metadata?{'Content-Range':`bytes */${metadata.size}`}:{}});
        }
        throw error;
      }
      if (!object) return new Response('Not found',{status:404});
      const headers=new Headers({'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=3600'});
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

