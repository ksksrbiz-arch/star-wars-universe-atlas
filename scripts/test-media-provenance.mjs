import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {NASA_STARFIELD} from '../src/mediaAssets.ts';
for(const field of ['id','title','provider','providerId','sourceUrl','sourceDownloadUrl','sourceSha256','credit','rights','rightsUrl','rightsExcerpt','retrievedOn','meaning','alt','fallback','transform'])assert.ok(NASA_STARFIELD[field]?.trim(),`Missing media provenance ${field}`);
for(const field of ['sourceUrl','sourceDownloadUrl','rightsUrl'])assert.equal(new URL(NASA_STARFIELD[field]).hostname,'svs.gsfc.nasa.gov');
assert.match(NASA_STARFIELD.meaning,/not Star Wars geography/);
assert.match(NASA_STARFIELD.rights,/Public domain/);
assert.match(NASA_STARFIELD.sourceSha256,/^[a-f0-9]{64}$/);
const seen=new Set();
for(const file of NASA_STARFIELD.files){
 assert.match(file.src,/^\/visuals\/[a-z0-9-]+\.(jpg|webp)$/);
 assert(!seen.has(file.src),'Duplicate asset path');seen.add(file.src);
 const url=new URL('../public'+file.src,import.meta.url);const bytes=await readFile(url);
 assert.equal((await stat(url)).size,file.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);
 assert.ok(file.width>0&&file.height>0);assert.equal(file.width/file.height,2);
 if(file.format==='image/webp'){assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');}
 else {assert.equal(file.format,'image/jpeg');assert.equal(bytes.readUInt16BE(0),0xffd8);}
}
console.log('PASS NASA media provenance, explicit decorative meaning, local visual namespace, file identities, sizes and format signatures');
