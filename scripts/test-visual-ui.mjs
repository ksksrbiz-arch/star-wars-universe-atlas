import{chromium}from'playwright';import assert from'node:assert/strict';import{writeFile}from'node:fs/promises';
const b=await chromium.launch({args:['--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});const errors=[],checks=[];p.on('pageerror',e=>errors.push(e.message));
try{
await p.goto('http://localhost:4173/#journey/andor-s01e01');await p.getByRole('switch',{name:'Reduce motion'}).click();
assert.equal(await p.getByRole('switch',{name:'Reduce motion'}).getAttribute('aria-checked'),'true');
await p.getByRole('button',{name:'Next story chapter'}).focus();await p.keyboard.press('Enter');
assert.equal(await p.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Next story chapter');assert.equal(await p.locator('.journey-current h2').count(),1);
const sample=async selector=>p.evaluate(async selector=>{const samples=[];for(let i=0;i<12;i++){await new Promise(requestAnimationFrame);samples.push([...document.querySelectorAll(selector)].map(e=>getComputedStyle(e).transform));}return samples},selector);
const journeyTransforms=await sample('.journey-current>div:first-child');assert.ok(journeyTransforms.flat().every(t=>t==='none'||t==='matrix(1, 0, 0, 1, 0, 0)'),JSON.stringify(journeyTransforms));checks.push('Manual reduced motion suppresses chapter transforms; keyboard Next retains focus; one current heading');
await p.goto('http://localhost:4173/#journey/andor-s01e01');await p.getByRole('button',{name:'Reveal locations for this title'}).focus();await p.keyboard.press('Enter');
for(const width of [1440,390,320]){await p.setViewportSize({width,height:1000});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(width!==320)await p.screenshot({path:`evidence/visual-ui-journey-${width}.png`,fullPage:true});}
await p.goto('http://localhost:4173/#library');await p.getByRole('textbox',{name:'Search films and episodes'}).fill('Andor');
const libraryTransforms=await sample('.catalog-item');assert.ok(libraryTransforms.flat().every(t=>t==='none'||t==='matrix(1, 0, 0, 1, 0, 0)'),JSON.stringify(libraryTransforms));
await p.getByRole('textbox',{name:'Search films and episodes'}).fill('A New Hope');assert.equal(await p.locator('.catalog-item').count(),1);assert.equal(await p.getByRole('textbox',{name:'Search films and episodes'}).evaluate(e=>e===document.activeElement),true);
await p.locator('.catalog-details summary').focus();await p.keyboard.press('Enter');assert.ok(await p.locator('.follow-story-link').isVisible());checks.push('Manual reduced motion suppresses library transforms; filtering keeps input focus with no ghost cards; keyboard record disclosure opens');
await p.getByRole('textbox',{name:'Search films and episodes'}).fill('');await p.locator('.collection-tabs').getByRole('button',{name:/Original trilogy/}).click();
for(const width of [1440,390,320]){await p.setViewportSize({width,height:1000});await p.waitForTimeout(250);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const rects=await p.locator('.catalog-item').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return{top:r.top,bottom:r.bottom}}));assert.ok(rects.every((r,i)=>i===0||r.top>=rects[i-1].bottom));if(width!==320)await p.screenshot({path:`evidence/visual-ui-library-${width}.png`,fullPage:true});}
checks.push('Journey and Library fit1440/390/320px; filtered cards nonoverlapping');assert.deepEqual(errors,[]);await writeFile('evidence/visual-ui-results.json',JSON.stringify({checks,errors,journeyTransforms,libraryTransforms},null,2));console.log(JSON.stringify({checks,errors},null,2));
}finally{await b.close();}
