import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {ALL_WORLDS} from '../src/journeyWorlds.ts';
import {MAPPED_WORLDS_EXPANSION} from '../src/mappedWorldsExpansion.ts';
const base=process.env.ATLAS_URL||'http://localhost:4173';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});const checks=[],errors=[];
try {
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#galaxy');const finder=page.getByLabel('Find a mapped world');await finder.waitFor();
  assert.equal(await finder.locator('option').count(),ALL_WORLDS.length);
  for(const w of MAPPED_WORLDS_EXPANSION){await finder.selectOption(w.id);assert.equal((await page.locator('.world-title h2').textContent()).trim(),w.name);assert.match(await page.locator('.position-note').textContent(),new RegExp(w.grid));assert.equal(await page.locator('.current-location strong').textContent(),'Tatooine');}
  await finder.selectOption('lothal');await page.getByRole('button',{name:'Jump to Lothal',exact:true}).first().click();assert.equal(await page.locator('.current-location strong').textContent(),'Lothal');
  await page.getByRole('button',{name:'Explore Lothal',exact:true}).waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.goto(base+'/#journey/ahsoka-s01e01');await page.getByRole('button',{name:'Reveal locations for this title'}).click();
  for(const name of ['Arcana','Lothal'])assert(await page.getByRole('button',{name:`Show ${name} on map`,exact:true}).isEnabled());
  await page.goto(base+'/#journey/ahsoka-s01e06');await page.getByRole('button',{name:'Reveal locations for this title'}).click();assert(await page.getByRole('button',{name:'Peridea: map unavailable',exact:true}).isDisabled());
  checks.push(`${width}px: all ${MAPPED_WORLDS_EXPANSION.length} new destinations selectable, source grids retained, Lothal jump, Ahsoka mapped stops and Peridea exclusion`);
  await page.close();
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
await mkdir('evidence/mapped-batch',{recursive:true});await writeFile('evidence/mapped-batch/navigation.json',JSON.stringify({base,checks,errors},null,2));console.log(checks);
