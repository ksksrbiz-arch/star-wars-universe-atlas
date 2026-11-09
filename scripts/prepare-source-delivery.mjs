import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const records=JSON.parse(await readFile('work/ingestion/latest/records.json','utf8'));
// Reviewed planet identities: provider descriptions describe the world itself,
// rather than a city, station, parent system or similarly named location.
const reviewedWorlds=new Set(['tatooine','hoth','bespin','dagobah','coruscant','naboo','kamino','geonosis','mustafar','alderaan','ilum','mandalore','lothal','scarif','ferrix','kenari']);
const items=[];
for(const r of records){
 let media,canonicalId,canonicalType,reviewEvidence;
 if(r.provider==='databank'&&['location','character'].includes(r.entityType)){
  media=r.media?.[0];
  const world=r.match?.canonicalIds?.[0];
  if(r.entityType==='location'&&r.match?.canonicalIds?.length===1&&reviewedWorlds.has(world)){
   canonicalId=world;canonicalType='world';reviewEvidence=r.sourceUrl;
  }
 }else if(r.provider==='tvmaze'&&r.entityType==='episode'&&r.match?.status==='candidate-exact'){
  media=r.media.find(m=>m.kind==='episode-still');canonicalId=r.match.canonicalIds[0];canonicalType='episode';
 }else if(r.provider==='tvmaze'&&r.entityType==='series'){
  media=r.media.find(m=>m.kind==='poster')??r.media.find(m=>m.kind==='backdrop');canonicalId=r.seriesId;canonicalType='series';
 }
 if(!media)continue;
 let sourceUrl=media.sourceUrl;
 // The provider CDN performs the resize. Keep the original source identity for provenance.
 if(new URL(sourceUrl).hostname==='lumiere-a.akamaihd.net'){
  const u=new URL(sourceUrl);u.searchParams.set('width','960');sourceUrl=u.href;
 }
 items.push({id:createHash('sha256').update(media.sourceUrl).digest('hex'),provider:r.provider,providerId:r.providerId,sourceUrl,sourcePageUrl:r.sourceUrl,credit:media.credit,...(canonicalId?{canonicalId,canonicalType,reviewEvidence}:{}),originalSourceUrl:media.sourceUrl});
}
// Show real episode frames and mapped references before filling out the full directory.
items.sort((a,b)=>Number(Boolean(b.canonicalId))-Number(Boolean(a.canonicalId)));
await mkdir('work/ingestion',{recursive:true});
await writeFile('work/ingestion/delivery-input.json',JSON.stringify({items}));
console.log(JSON.stringify({assets:items.length,linked:items.filter(x=>x.canonicalId).length,reviewedWorlds:items.filter(x=>x.canonicalType==='world').length}));
