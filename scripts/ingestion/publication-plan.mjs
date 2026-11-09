/** Pure validation and SQL plan shared by the local publisher and scheduled writer. */
const providers = new Set(['databank','tvmaze','wookieepedia']);
const hash = value => typeof value==='string' && /^[a-f0-9]{64}$/.test(value);
const https = value => {try{return new URL(value).protocol==='https:';}catch{return false;}};
const localMedia = value => typeof value==='string' && /^\/media\/[a-zA-Z0-9/_-]+\.(?:webp|jpe?g|png|avif)$/.test(value) && !value.includes('..');
const key = row => `${row.provider}:${row.providerId}`;

export function normalizePublication(records, delivered) {
  if (!Array.isArray(records) || !Array.isArray(delivered)) throw new Error('Records and delivered media must be arrays');
  const seen = new Set();
  const sourceRows = records.map(row=>{
    if(!providers.has(row.provider)||typeof row.providerId!=='string'||!row.providerId||typeof row.name!=='string'||!row.name.trim()||!https(row.sourceUrl)||!hash(row.payloadSha256)||!Number.isFinite(Date.parse(row.collectedAt))) throw new Error('Invalid source record');
    if(seen.has(key(row)))throw new Error('Duplicate source identity');
    seen.add(key(row));
    return { ...row, publicPayload:{id:key(row),provider:row.provider,providerId:row.providerId,entityType:row.entityType,name:row.name,...(typeof row.description==='string'?{description:row.description}:{}),sourceUrl:row.sourceUrl} };
  });
  const byId=new Map(sourceRows.map(row=>[key(row),row]));
  const mediaRows=[],links=[],mediaSeen=new Set();
  for(const media of delivered){
    const record=byId.get(key(media));
    if(!record||!hash(media.id)||!hash(media.sha256)||!localMedia(media.src)||!https(media.sourceUrl)||!media.credit||!Number.isSafeInteger(media.bytes)||media.bytes<1||!/^image\/(?:webp|jpeg|png|avif)$/.test(media.mime))throw new Error('Invalid delivered media');
    if(media.srcSet && !media.srcSet.split(',').every(part=>{const [src,width,...extra]=part.trim().split(/\s+/);return !extra.length&&localMedia(src)&&/^\d+w$/.test(width);}))throw new Error('Invalid responsive media paths');
    // No actor/person record can become character artwork through a provider ID.
    if(record.entityType==='person')continue;
    const mediaKey=`${media.id}:${key(media)}`;
    if(!mediaSeen.has(mediaKey)){mediaRows.push(media);mediaSeen.add(mediaKey);}
    if(!media.canonicalId)continue;
    let accepted=false;
    if(media.canonicalType==='episode')accepted=record.entityType==='episode'&&record.match?.status==='candidate-exact'&&record.match.canonicalIds?.length===1&&record.match.canonicalIds[0]===media.canonicalId&&!record.match.combinedRecord;
    if(media.canonicalType==='series')accepted=record.entityType==='series'&&record.seriesId===media.canonicalId;
    if(media.canonicalType==='world')accepted=record.entityType==='location'&&record.match?.canonicalIds?.includes(media.canonicalId)&&https(media.reviewEvidence);
    if(!accepted)throw new Error(`Unreviewed canonical media link: ${key(media)}`);
    links.push(media);
  }
  return {sourceRows,mediaRows,links};
}

export const recordUpsert = `INSERT INTO atlas_source_records(provider,provider_id,entity_type,name,description,source_url,payload,public_payload,payload_sha256,collected_at)
 SELECT x.provider,x."providerId",x."entityType",x.name,x.description,x."sourceUrl",x.payload,x."publicPayload",x."payloadSha256",x."collectedAt"::timestamptz
 FROM jsonb_to_recordset($1::jsonb) AS x(provider text,"providerId" text,"entityType" text,name text,description text,"sourceUrl" text,payload jsonb,"publicPayload" jsonb,"payloadSha256" text,"collectedAt" text)
 ON CONFLICT(provider,provider_id) DO UPDATE SET entity_type=EXCLUDED.entity_type,name=EXCLUDED.name,description=EXCLUDED.description,source_url=EXCLUDED.source_url,payload=EXCLUDED.payload,public_payload=EXCLUDED.public_payload,payload_sha256=EXCLUDED.payload_sha256,collected_at=EXCLUDED.collected_at
 WHERE EXCLUDED.collected_at>=atlas_source_records.collected_at`;
export const snapshotInsert = `INSERT INTO atlas_source_snapshots(provider,provider_id,payload_sha256,payload,collected_at)
 SELECT x.provider,x."providerId",x."payloadSha256",x.payload,x."collectedAt"::timestamptz FROM jsonb_to_recordset($1::jsonb) AS x(provider text,"providerId" text,"payloadSha256" text,payload jsonb,"collectedAt" text)
 ON CONFLICT DO NOTHING`;
export const mediaUpsert = `INSERT INTO atlas_source_media(id,provider,provider_id,payload,delivered)
 SELECT x.id,x.provider,x."providerId",x.payload,true FROM jsonb_to_recordset($1::jsonb) AS x(id text,provider text,"providerId" text,payload jsonb)
 ON CONFLICT(id,provider,provider_id) DO UPDATE SET payload=EXCLUDED.payload,delivered=true`;
export const linkUpsert = `INSERT INTO atlas_source_links(provider,provider_id,canonical_id,canonical_type,media_id,accepted)
 SELECT x.provider,x."providerId",x."canonicalId",x."canonicalType",x.id,true FROM jsonb_to_recordset($1::jsonb) AS x(provider text,"providerId" text,"canonicalId" text,"canonicalType" text,id text)
 ON CONFLICT(provider,provider_id,canonical_type,canonical_id) DO UPDATE SET media_id=EXCLUDED.media_id,accepted=true`;
export const invalidateChangedLinks = `UPDATE atlas_source_links l SET accepted=false FROM atlas_source_records r,
 jsonb_to_recordset($1::jsonb) AS x(provider text,"providerId" text,payload jsonb,"collectedAt" text)
 WHERE l.provider=r.provider AND l.provider_id=r.provider_id AND r.provider=x.provider AND r.provider_id=x."providerId"
 AND (r.payload->>'name',r.payload->>'entityType',r.payload->>'seriesId',r.payload->>'season',r.payload->>'episode',r.payload->>'continuity')
 IS DISTINCT FROM (x.payload->>'name',x.payload->>'entityType',x.payload->>'seriesId',x.payload->>'season',x.payload->>'episode',x.payload->>'continuity')
 AND x."collectedAt"::timestamptz>=r.collected_at`;

export async function publishRecords(client,records,delivered){
 const plan=normalizePublication(records,delivered);
 const rows=plan.sourceRows.map(({publicPayload,...row})=>({...row,publicPayload,payload:row}));
 const chunks=async(sql,list)=>{for(let i=0;i<list.length;i+=100)await client.query(sql,[JSON.stringify(list.slice(i,i+100))]);};
 await chunks(invalidateChangedLinks,rows);await chunks(recordUpsert,rows);await chunks(snapshotInsert,rows);
 await chunks(mediaUpsert,plan.mediaRows.map(row=>({...row,payload:row})));
 await chunks(linkUpsert,plan.links);
 return {sourceRecords:rows.length,deliveredMedia:plan.mediaRows.length,canonicalMediaLinks:plan.links.length};
}
