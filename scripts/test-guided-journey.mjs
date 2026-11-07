import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const base=process.env.ATLAS_URL||'http://localhost:4173';
try {
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#galaxy');const guide=page.locator('.guided-journey');const summary=guide.locator('summary');await summary.waitFor();
  assert.equal(await guide.getAttribute('open'),null,'Guide must be opt-in');
  const before=await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1'));
  await summary.focus();await page.keyboard.press('Enter');
  await guide.getByLabel('Journey collection').selectOption('clone-wars');
  await guide.getByRole('button',{name:'Choose starting point →'}).click();
  assert.equal(await guide.locator('h2').evaluate(e=>document.activeElement===e),true);
  assert.match(await guide.locator('.guided-start').innerText(),/Cat and Mouse/);
  assert.equal(await guide.getByRole('link',{name:'Open chapter →'}).getAttribute('href'),'#journey/clone-wars-s02e16');
  await guide.getByRole('button',{name:'Restart guide'}).click();
  assert.equal(await guide.getByLabel('Journey collection').inputValue(),'ot');
  await guide.getByRole('button',{name:'Dismiss guide'}).click();assert.equal(await guide.getAttribute('open'),null);assert.equal(await summary.evaluate(e=>document.activeElement===e),true);
  await summary.click();await guide.getByLabel('Journey collection').selectOption('clone-wars');await guide.getByRole('button',{name:'Choose starting point →'}).click();await guide.getByRole('link',{name:'Open chapter →'}).click();
  await page.locator('.journey-current h2').waitFor();assert.match(await page.locator('.journey-current h2').innerText(),/Cat and Mouse/);assert.equal(await page.locator('.journey-stop').count(),0,'Guide must not reveal locations');
  assert.equal(await page.evaluate(()=>localStorage.getItem('galactic-atlas.watch.v1')),before,'Guide must not modify watch progress');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await page.close();
 }
 const page=await browser.newPage({reducedMotion:'reduce'});await page.addInitScript(()=>localStorage.setItem('galactic-atlas.watch.v1',JSON.stringify({version:1,watchedIds:['clone-wars-s02e16']})));
 await page.goto(base+'/#galaxy');const guide=page.locator('.guided-journey');await guide.locator('summary').click();await guide.getByLabel('Journey collection').selectOption('clone-wars');await guide.getByRole('button',{name:'Choose starting point →'}).click();await guide.getByLabel('Starting point').selectOption('resume');assert.equal(await guide.getByRole('link',{name:'Open chapter →'}).getAttribute('href'),'#journey/clone-wars-s01e16');
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('galactic-atlas.watch.v1')).watchedIds),['clone-wars-s02e16']);
 await guide.getByRole('button',{name:'Restart guide'}).click();await guide.getByLabel('Journey collection').selectOption('ahsoka');await guide.getByRole('button',{name:'Choose starting point →'}).click();assert.equal(await guide.getByLabel('Starting point').inputValue(),'first');assert.equal(await guide.getByRole('link',{name:'Open chapter →'}).getAttribute('href'),'#journey/ahsoka-s01e01');
 const complete=await browser.newPage({reducedMotion:'reduce'});await complete.addInitScript(()=>localStorage.setItem('galactic-atlas.watch.v1',JSON.stringify({version:1,watchedIds:['ot-a-new-hope','ot-empire-strikes-back','ot-return-of-the-jedi']})));await complete.goto(base+'/#galaxy');const completeGuide=complete.locator('.guided-journey');await completeGuide.locator('summary').click();await completeGuide.getByRole('button',{name:'Choose starting point →'}).click();assert.equal(await completeGuide.getByLabel('Starting point').locator('option[value="resume"]').isDisabled(),true);assert.match(await completeGuide.getByLabel('Starting point').innerText(),/Revisit the first chapter/);assert.equal(await completeGuide.getByRole('link',{name:'Open chapter →'}).getAttribute('href'),'#journey/ot-a-new-hope');
 console.log('PASS optional guide, keyboard focus,dismiss/restart,official Clone Wars order,first-unwatched,no reveal/watch mutation,1440/390/320');
}finally{await browser.close();}
