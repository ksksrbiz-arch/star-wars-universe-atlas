import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const base=process.env.ATLAS_URL||'http://localhost:4173';
try{
 const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#galaxy');await page.locator('canvas').waitFor();await page.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();
 const click=async name=>{await page.getByRole('button',{name,exact:true}).click();await page.waitForTimeout(80);};
 const point=id=>page.locator(`[data-world-id="${id}"]`).evaluate(el=>{const p=el.closest('[data-map-html]');const m=new DOMMatrix(getComputedStyle(p).transform);return{x:m.m41,y:m.m42};});
 const distance=async()=>{const a=await point('tatooine'),b=await point('hoth');return Math.hypot(a.x-b.x,a.y-b.y);};
 const original=await distance();await click('Zoom in');assert((await distance())>original*1.15,'zoom in increases projected separation');await click('Zoom out');assert(Math.abs(await distance()-original)<2,'zoom out reverses zoom');
 let p=await point('tatooine');await click('Pan left');let q=await point('tatooine');assert(q.x>p.x+10,'pan left moves viewport west');await click('Pan right');assert(Math.abs((await point('tatooine')).x-p.x)<2);await click('Pan up');assert((await point('tatooine')).y>p.y+10);await click('Pan down');assert(Math.abs((await point('tatooine')).y-p.y)<2);
 for(let i=0;i<20;i++)await click('Zoom in');const maximum=await distance();await click('Zoom in');assert(Math.abs(await distance()-maximum)<1,'upper zoom bound');
 for(let i=0;i<30;i++)await click('Zoom out');const minimum=await distance();await click('Zoom out');assert(Math.abs(await distance()-minimum)<1,'lower zoom bound');
 for(let i=0;i<12;i++)await click('Pan left');p=await point('tatooine');await click('Pan left');assert(Math.abs((await point('tatooine')).x-p.x)<1,'pan boundary');
 await click('Reset map view');assert(Math.abs(await distance()-original)<2,'reset restores framing');
 await page.getByRole('button',{name:'Zoom in',exact:true}).focus();await page.keyboard.press('Enter');await page.waitForTimeout(100);assert((await distance())>original*1.15,'keyboard activates zoom');await click('Reset map view');
 await page.setViewportSize({width:390,height:844});await click('Zoom in');await click('Pan right');await click('Reset map view');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
 await page.close();
 const travel=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'no-preference'});const travelErrors=[];travel.on('pageerror',e=>travelErrors.push(e.message));
 await travel.clock.install();await travel.goto(base+'/#galaxy');await travel.getByRole('button',{name:'Explore Hoth',exact:true}).click();
 await travel.clock.pauseAt(await travel.evaluate(()=>Date.now()+1000));await travel.getByRole('button',{name:'Jump to Hoth',exact:true}).first().click();await travel.clock.runFor(200);
 for(const name of ['Zoom in','Zoom out','Pan left','Pan right','Pan up','Pan down'])assert.equal(await travel.getByRole('button',{name,exact:true}).isDisabled(),true,`${name} disabled during warp`);
 await travel.getByRole('button',{name:'Skip animation'}).click();await travel.clock.runFor(100);assert.equal(await travel.getByRole('button',{name:'Zoom in',exact:true}).isEnabled(),true);assert.deepEqual(travelErrors,[]);
 console.log('PASS zoom/pan direction,repeated commands,bounds,reset,keyboard activation,warp disabled/arrival enabled,mobile overflow and reduced-motion interaction');
}finally{await browser.close();}
