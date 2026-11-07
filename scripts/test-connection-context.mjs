import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const checks=[],errors=[];
try {
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#journey/andor-s01e02');
 assert.equal(await page.locator('.appearance-context').count(),0);
 await page.getByRole('button',{name:'Reveal locations for this title'}).click();
 const kenari=page.locator('.journey-stop').filter({has:page.getByRole('heading',{name:'Kenari',exact:true})});
 assert.equal(await kenari.locator('.appearance-context').textContent(),'Flashback');
 await kenari.getByRole('button',{name:'Show Kenari on map',exact:true}).click();
 await page.getByRole('button',{name:'Jump to Kenari',exact:true}).first().click();
 assert.equal(await page.locator('.current-location strong').textContent(),'Kenari');
 checks.push('New Kenari link remains hidden until revealed, labels flashback, and jumps using existing sourced placement');
 await page.goto(base+'/#journey/andor-s01e11');await page.getByRole('button',{name:'Reveal locations for this title'}).click();
 const orbital=page.locator('.journey-stop').filter({has:page.getByRole('heading',{name:'Segra-Milo',exact:true})});
 assert.equal(await orbital.locator('.appearance-context').textContent(),'Orbital setting');assert(await orbital.getByRole('button',{name:'Show Segra-Milo on map'}).isEnabled());
 checks.push('Segra-Milo orbit label retains scene context with independently sourced map action');
 await page.goto(base+'/#journey/clone-wars-s02e03');await page.getByRole('button',{name:'Reveal locations for this title'}).click();
 for(const name of ['Coruscant','Rodia','Naboo'])assert.equal(await page.locator('.journey-stop').filter({has:page.getByRole('heading',{name,exact:true})}).locator('.appearance-context').textContent(),'Surface setting');
 await mkdir('evidence/galaxy-depth',{recursive:true});await page.locator('.journey-worlds').screenshot({path:'evidence/galaxy-depth/expanded-episode-mobile.png'});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks.push('Expanded Clone Wars scene links render source context without mobile overflow');assert.deepEqual(errors,[]);
}finally{await browser.close();}
await writeFile('evidence/galaxy-depth/connection-ui-results.json',JSON.stringify({base,checks,errors},null,2));console.log({checks,errors});
