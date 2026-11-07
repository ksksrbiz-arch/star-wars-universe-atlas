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

export default {
  async fetch(request, env, ctx) {
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
      const key=path.slice('/media/'.length);
      if (!key || key.includes('..')) return new Response('Not found',{status:404});
      const object=await env.PUBLISHED_ASSETS.get(key,{range:request.headers,onlyIf:request.headers});
      if (!object) return new Response('Not found',{status:404});
      const headers=new Headers({'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=3600'});
      object.writeHttpMetadata(headers);headers.set('ETag',object.httpEtag);
      if (!('body' in object)) return new Response(null,{status:304,headers});
      let status=200;
      if (object.range && 'offset' in object.range) {status=206;headers.set('Content-Range',`bytes ${object.range.offset}-${object.range.offset+object.range.length-1}/${object.size}`);}
      return new Response(request.method==='HEAD'?null:object.body,{status,headers});
    }
    return env.ASSETS.fetch(request);
  }
};

