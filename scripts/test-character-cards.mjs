import { newSpoilerProtectedPage } from './lib-spoiler-testing.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const base=process.env.ATLAS_URL||'http://localhost:4186';
const out=process.env.ATLAS_EVIDENCE_DIR||'evidence/character-cards';
await mkdir(out,{recursive:true});
const pixel=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aE2cAAAAASUVORK5CYII=','base64');
const characters=Array.from({length:20},(_,index)=>({id:`databank:card-fixture-${index}`,provider:'databank',providerId:`card-fixture-${index}`,entityType:'character',name:index===4?'A Character With An Exceptionally Long Archive Display Name':`Archive Character ${String(index+1).padStart(2,'0')}`,description:`Biography for archive character ${index+1}.`,sourceUrl:`https://www.starwars.com/databank/fixture-${index}`,image:{src:index===0?'/media/card-test/missing.png':`/media/card-test/portrait-${index}.png`,credit:'Fixture source credit',sourceUrl:`https://www.starwars.com/databank/fixture-${index}`}}));
delete characters[19].image;
characters[1].cutout={src:'/media/card-test/cutout-2.png',credit:'Cutout fixture creator',sourceUrl:'https://www.starwars.com/databank/cutout-fixture-2'};
characters[2].cutout={src:'/media/card-test/missing-cutout.png',credit:'Unavailable cutout creator',sourceUrl:'https://www.starwars.com/databank/cutout-fixture-3'};
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const checks=[];
try{
 for(const settings of [{width:1440,reducedMotion:'no-preference',touch:false},{width:390,reducedMotion:'reduce',touch:true},{width:320,reducedMotion:'reduce',touch:true}]){
  const page=await newSpoilerProtectedPage(browser, {viewport:{width:settings.width,height:1000},reducedMotion:settings.reducedMotion,isMobile:settings.touch,hasTouch:settings.touch});
  const errors=[];let apiCalls=0,mediaCalls=0;
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/media/card-test/**',route=>{mediaCalls++;return route.fulfill(route.request().url().includes('/missing')?{status:404,body:''}:{contentType:'image/png',body:pixel});});
  await page.route('**/api/databank?**',async route=>{
   apiCalls++;const url=new URL(route.request().url()),type=url.searchParams.get('type'),q=(url.searchParams.get('q')||'').toLowerCase(),offset=Number(url.searchParams.get('offset')),limit=Number(url.searchParams.get('limit')),artwork=url.searchParams.get('artwork');
   const source=type==='character'?characters:[{...characters[1],id:'databank:world-fixture',entityType:'location',name:'Tatooine'}];
   const filtered=source.filter(entry=>entry.name.toLowerCase().includes(q)&&(artwork!=='cutout'||Boolean(entry.cutout)));
   return route.fulfill({json:{items:filtered.slice(offset,offset+limit),total:filtered.length,offset,limit}});
  });
  await page.route('**/api/media-index',route=>route.fulfill({json:{items:[]}}));
  await page.goto(base+'/#library');
  await page.getByText('Explore the Galactic Databank',{exact:true}).click();
  assert.equal(apiCalls,0,'No descriptive character records fetched before spoiler consent');
  assert.equal(mediaCalls,0,'No character fixture images loaded before spoiler consent');
  assert.equal(await page.getByRole('button',{name:/^View .+ character card$/}).count(),0);
  const reveal=page.getByRole('checkbox',{name:/Reveal story imagery and details/});await reveal.check();
  await page.getByRole('group',{name:'Databank entry type'}).getByRole('button',{name:'Characters',exact:true}).click();
  const artOnly=page.getByRole('button',{name:'Transparent artwork',exact:true}),allCharacters=page.getByRole('button',{name:'All characters',exact:true});
  await page.getByRole('button',{name:'View Archive Character 02 character card',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:/^View .+ character card$/}).count(),2,'Transparent artwork filter shows only entries with a cutout source');
  await allCharacters.click();
  const first=page.getByRole('button',{name:'View Archive Character 01 character card',exact:true});await first.waitFor();
  assert.equal(await page.getByRole('button',{name:/^View .+ character card$/}).count(),12,'First page has a card for every returned character');
  await page.getByText('Reference image unavailable',{exact:true}).first().waitFor();
  const card=page.getByRole('button',{name:'View Archive Character 02 character card',exact:true});
  assert.equal(await card.getAttribute('data-art-mode'),'cutout');
  assert.equal(await card.locator('.character-card-art img').evaluate(node=>getComputedStyle(node).objectFit),'contain','Transparent figures fit completely without cropping');
  await page.waitForFunction(()=>document.querySelector('[data-character-id="databank:card-fixture-2"]')?.getAttribute('data-art-mode')==='portrait');
  const before=await card.evaluate(node=>getComputedStyle(node).transform),bounds=await card.boundingBox();
  if(bounds){await page.mouse.move(bounds.x+bounds.width*.2,bounds.y+bounds.height*.3);await page.mouse.move(bounds.x+bounds.width*.8,bounds.y+bounds.height*.7);}
  assert.equal(await card.evaluate(node=>getComputedStyle(node).transform),before,'Character artwork remains stable when the pointer moves');
  await card.scrollIntoViewIfNeeded();await card.press('Enter');
  const dialog=page.getByRole('dialog',{name:'Archive Character 02',exact:true});await dialog.waitFor();
  assert.match(await dialog.innerText(),/Biography for archive character 2/);
  assert(await dialog.getByRole('link',{name:/source/i}).count()>0,'Source attribution remains reachable in detail');
  assert(await dialog.getByRole('link',{name:/Cutout fixture creator/}).isVisible(),'Cutout creator attribution is visible');
  await page.keyboard.press('Shift+Tab');assert(await dialog.evaluate(node=>node.contains(document.activeElement)),'Reverse Tab stays in the modal');
  await page.keyboard.press('Tab');
  for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert(await dialog.evaluate(node=>node.contains(document.activeElement)),'Native modal traps keyboard focus');}
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Expanded character view fits viewport');
  await dialog.screenshot({path:`${out}/detail-${settings.width}.png`});
  await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
  assert(await card.evaluate(node=>document.activeElement===node),'Escape returns focus to the initiating card');
  await card.click();await dialog.waitFor();await dialog.getByRole('button',{name:'Close character card',exact:true}).click();await dialog.waitFor({state:'hidden'});
  await page.getByRole('navigation',{name:'Databank result pages'}).getByRole('button',{name:'Next',exact:true}).click();
  await page.getByRole('button',{name:'View Archive Character 13 character card',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:/^View .+ character card$/}).count(),8,'Remaining page retains every returned character');
  assert(await page.getByRole('navigation',{name:'Databank result pages'}).getByRole('button',{name:'Next',exact:true}).isDisabled());
  await page.getByRole('searchbox',{name:'Search the Galactic Databank'}).fill('Archive Character 20');
  await page.getByRole('button',{name:'View Archive Character 20 character card',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:/^View .+ character card$/}).count(),1);
  await page.getByRole('searchbox',{name:'Search the Galactic Databank'}).fill('');await first.waitFor();
  await page.locator('.galactic-databank').screenshot({path:`${out}/gallery-${settings.width}.png`});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Gallery fits viewport');
  await artOnly.click();await page.getByRole('button',{name:'View Archive Character 02 character card',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:/^View .+ character card$/}).count(),2);
  await reveal.uncheck();assert.equal(await page.getByRole('button',{name:/^View .+ character card$/}).count(),0,'Revoking consent removes character cards');
  assert.equal(await page.getByRole('dialog').count(),0);
  assert.deepEqual(errors,[]);checks.push({width:settings.width,reducedMotion:settings.reducedMotion,touch:settings.touch,apiCalls,mediaCalls,errors});await page.close();
 }
}finally{await browser.close();}
await writeFile(`${out}/results.json`,JSON.stringify({checkedAt:new Date().toISOString(),base,checks,limitation:'Fixture-backed Chromium browser coverage; screenshots use fixture art and are not a character-art quality audit.'},null,2));
console.log('PASS character cards: every paged character, disclosure, source detail, image fallback, search, keyboard/modal/focus and responsive layouts.');
