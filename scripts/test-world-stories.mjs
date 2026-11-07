import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:390,height:844}});
const checks=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await page.goto((process.env.ATLAS_URL || 'http://localhost:4173') + "/#galaxy");
await page.locator('.world-stories').waitFor();
assert.equal(await page.locator('.world-stories a').count(),0);
await page.getByRole('button',{name:'Reveal linked unwatched titles'}).click();
await page.locator('.world-stories a[href="#journey/ot-a-new-hope"]').click();
assert.equal(await page.locator('.journey-current h2').innerText(),'A New Hope');
assert.equal(await page.locator('.journey-stop').count(),0);
checks.push('Tatooine world dossier hides unwatched titles; explicit reveal links to A New Hope in correct Journey collection without revealing its stops');
for(const [id,stop,world] of [['andor-s01e01','Ferrix','Ferrix'],['mandalorian-s03e02','Mandalore','Mandalore'],['ot-return-of-the-jedi','Endor (forest moon)','Endor']]){
await page.goto(`${process.env.ATLAS_URL || 'http://localhost:4173'}/#journey/${id}`);
await page.getByRole('button',{name:'Reveal locations for this title'}).click();
await page.getByRole('button',{name:`Show ${stop} on map`,exact:true}).click();
assert.match(await page.locator('.world-title h2').innerText(),new RegExp(world,'i'));
await page.getByRole('button',{name:new RegExp(`^Jump to ${world}`)}).first().click();
await page.waitForFunction(name=>document.querySelector('.current-location strong')?.textContent.includes(name),world);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
checks.push(`Mobile Journey selects and completes animated arrival at ${world} without overflow`);
}
assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),null);
assert.deepEqual(errors,[]);
await writeFile('evidence/world-stories-results.json',JSON.stringify({checks,errors,browser:await browser.version()},null,2));
console.log(JSON.stringify({checks,errors},null,2));
}finally{await browser.close();}

