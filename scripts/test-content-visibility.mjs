import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const base=process.env.ATLAS_URL||'http://localhost:4186';
const out=process.env.ATLAS_EVIDENCE_DIR||'evidence/content-visibility';
const preferenceKey='atlas:hide-spoilers:v1';
const watchKey='galactic-atlas.watch.v1';
const pixel=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aE2cAAAAASUVORK5CYII=','base64');
const image={src:'/media/content-visibility/fixture.png',credit:'Reference image fixture',sourceUrl:'https://www.starwars.com/databank/tatooine'};
const browser=await chromium.launch({args:['--disable-gpu']});
await mkdir(out,{recursive:true});
const checks=[];

async function fixtures(page){
 await page.route('**/media/content-visibility/**',route=>route.fulfill({contentType:'image/png',body:pixel}));
 await page.route('**/api/media-index',route=>route.fulfill({json:{items:[
  ...['mandalorian-s01e01','mandalorian-s01e02'].map(entityId=>({...image,entityId,entityType:'episode',provider:'tvmaze'})),
  {...image,entityId:'tatooine',entityType:'world',provider:'databank'},
 ]}}));
 await page.route('**/api/databank?**',route=>{
  const url=new URL(route.request().url()),type=url.searchParams.get('type');
  const entry={id:'databank:visibility-fixture',provider:'databank',providerId:'visibility-fixture',entityType:type,name:type==='character'?'Leia Organa':'Tatooine',description:'Always-visible source details from the reference fixture.',sourceUrl:image.sourceUrl,image};
  return route.fulfill({json:{items:[entry],total:1,offset:0,limit:12}});
 });
}

async function showDatabank(page){
 const details=page.locator('.galactic-databank');
 await details.waitFor();
 if(await details.getAttribute('open')===null)await details.locator('summary').click();
}

async function expandJourney(page,width){
 await page.locator('.journey-panel').waitFor({state:'attached'});
 if(width<721&&await page.locator('.sheet-toggle').getAttribute('aria-expanded')==='false')await page.locator('.sheet-toggle').click();
}

async function setHidden(page,hidden){
 const panel=page.getByRole('region',{name:'About this prototype'});
 // The About panel is a named section, not a modal; setting the preference must
 // take effect without navigation or a watch-progress action.
 if(!await panel.count()||!await panel.isVisible())await page.getByRole('button',{name:'About this prototype',exact:true}).click();
 const checkbox=page.getByRole('checkbox',{name:'Hide spoilers',exact:true});
 await checkbox.setChecked(hidden);
 assert.equal(await checkbox.isChecked(),hidden);
 await page.getByRole('button',{name:'Close prototype information',exact:true}).click();
}

async function noProgressChange(page){
 assert.equal(await page.evaluate(key=>localStorage.getItem(key),watchKey),null,'Changing visibility must not mark titles watched');
}

async function fits(page,label){
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label);
}

try{
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await fixtures(page);
  await page.goto(base+'/#library');
  await showDatabank(page);
  await page.locator('.databank-card img').waitFor();
  await page.waitForFunction(()=>document.querySelector('.databank-card img')?.naturalWidth>0);
  assert.match(await page.locator('.databank-card').innerText(),/Always-visible source details/);
  assert.equal(await page.getByRole('checkbox',{name:/Reveal story imagery and details/}).count(),0,'Default view does not require saga-wide consent');
  await noProgressChange(page);
  await fits(page,`${width}px default Databank fits`);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.databank-card img')].map(image=>image.decode()));});
  await page.locator('.galactic-databank').screenshot({path:`${out}/default-databank-${width}.png`});

  await page.goto(base+'/#journey/mandalorian-s01e01');
  await expandJourney(page,width);
  await page.locator('.source-media-episode img').waitFor();
  await page.waitForFunction(()=>document.querySelectorAll('.journey-stop').length>0);
  assert.equal(await page.getByRole('button',{name:'Reveal locations for this title',exact:true}).count(),0);
  assert.equal(await page.getByRole('button',{name:'Reveal image for this title',exact:true}).count(),0);
  await page.getByRole('complementary',{name:'Episode location highlights'}).waitFor();
  await noProgressChange(page);
  await fits(page,`${width}px default Journey fits`);
  await page.getByRole('button',{name:'Next story chapter',exact:true}).click();
  await page.locator('.source-media-episode img').waitFor();
  assert(await page.locator('.journey-stop').count()>0,'The next unwatched chapter also shows its locations');

  await page.goto(base+'/#galaxy/tatooine');
  if(width<721&&await page.locator('.sheet-toggle').getAttribute('aria-expanded')==='false')await page.locator('.sheet-toggle').click();
  await page.locator('.source-media-world img').waitFor();
  await page.locator('.world-stories-panel .world-story-card').first().waitFor();
  assert.equal(await page.getByRole('button',{name:'Reveal linked unwatched titles',exact:true}).count(),0);
  await noProgressChange(page);

  await setHidden(page,true);
  assert.equal(await page.locator('.world-stories-panel .world-story-card').count(),0,'Optional protection hides unwatched world links');
  assert.equal(await page.locator('.source-media-world img').count(),0,'Optional protection hides reference imagery');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),preferenceKey),'true');
  await page.goto(base+'/#library');await showDatabank(page);
  await page.getByRole('checkbox',{name:/Reveal story imagery and details/}).waitFor();
  assert.equal(await page.locator('.databank-card').count(),0,'Protected Databank waits for deliberate reveal');
  await page.reload();await showDatabank(page);
  await page.getByRole('checkbox',{name:/Reveal story imagery and details/}).waitFor();
  assert.equal(await page.locator('.databank-card').count(),0,'Hidden preference survives reload');

  await page.goto(base+'/#journey/mandalorian-s01e01');await expandJourney(page,width);
  await page.getByRole('button',{name:'Reveal locations for this title',exact:true}).waitFor();
  assert.equal(await page.locator('.journey-stop').count(),0);
  assert.equal(await page.locator('.source-media-episode img').count(),0);
  await setHidden(page,false);
  await page.locator('.source-media-episode img').waitFor();
  await page.waitForFunction(()=>document.querySelectorAll('.journey-stop').length>0);
  await page.getByRole('complementary',{name:'Episode location highlights'}).waitFor();
  await noProgressChange(page);
  await page.reload();await expandJourney(page,width);
  await page.locator('.source-media-episode img').waitFor();
  assert(await page.locator('.journey-stop').count()>0,'Showing all survives reload');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),preferenceKey),'false');
  await noProgressChange(page);await fits(page,`${width}px revealed Journey fits`);
  if(width===1440){
   const sibling=await page.context().newPage();sibling.on('pageerror',error=>errors.push(error.message));
   await fixtures(sibling);await sibling.goto(base+'/#library');await showDatabank(sibling);
   await sibling.locator('.databank-card').first().waitFor();
   await setHidden(page,true);
   await sibling.getByRole('checkbox',{name:/Reveal story imagery and details/}).waitFor();
   assert.equal(await sibling.locator('.databank-card').count(),0,'Another open tab applies a changed protection preference');
   await setHidden(sibling,false);
   await page.locator('.source-media-episode img').waitFor();
   await page.waitForFunction(()=>document.querySelectorAll('.journey-stop').length>0);
   await noProgressChange(sibling);await sibling.close();
  }
  assert.deepEqual(errors,[]);
  checks.push({width,defaultVisible:true,optionalProtectionPersists:true,watchProgressUnchanged:true,errors});
  await context.close();
 }

 for(const storageMode of ['both','writes']){
  const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(({key,mode})=>{
   const read=Storage.prototype.getItem,write=Storage.prototype.setItem;
   if(mode==='writes')write.call(localStorage,key,'false');
   Storage.prototype.getItem=function(name){if(mode==='both'&&name===key)throw new DOMException('Storage unavailable','SecurityError');return read.call(this,name);};
   Storage.prototype.setItem=function(name,value){if(name===key)throw new DOMException('Storage unavailable','SecurityError');return write.call(this,name,value);};
  },{key:preferenceKey,mode:storageMode});
  await fixtures(page);await page.goto(base+'/#library');await showDatabank(page);
  await page.locator('.databank-card').first().waitFor();
  await setHidden(page,true);
  await page.getByRole('checkbox',{name:/Reveal story imagery and details/}).waitFor();
  assert.equal(await page.locator('.databank-card').count(),0,'Session preference works without a successful storage write');
  await setHidden(page,false);await page.locator('.databank-card').first().waitFor();
  await noProgressChange(page);assert.deepEqual(errors,[]);
  checks.push({storageMode,sessionToggleWorks:true,errors});await page.close();
 }
 const result={checkedAt:new Date().toISOString(),url:base,checks,limitations:['Databank and source-image APIs use controlled fixtures; this suite verifies visibility behavior rather than source artwork quality.','Chromium desktop and mobile emulation, not physical-device performance measurements.']};
 await writeFile(`${out}/results.json`,JSON.stringify(result,null,2));
 console.log('PASS default-visible content at1440/390/320; optional spoiler preference persists, source/world/episode gates stay consistent, watch progress unchanged, and storage failure retains session controls.');
}finally{await browser.close();}
