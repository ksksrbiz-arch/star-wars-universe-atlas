import {chromium} from 'playwright';
import {writeFile,readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {resolve} from 'node:path';
const base=process.env.ATLAS_URL || 'http://localhost:4173';
const dist=process.env.ATLAS_DIST || '/workspace/perf-baseline-dist';
const output=process.env.ATLAS_PERF_OUTPUT || '/workspace/perf-baseline.json';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
const results=[];
try {
 for(const scenario of [
  {name:'library-desktop',hash:'#library',width:1440,height:1050},
  {name:'galaxy-mobile',hash:'#galaxy',width:390,height:844},
  {name:'galaxy-reduced',hash:'#galaxy',width:1440,height:1050,reducedMotion:'reduce'},
  {name:'galaxy-cinematic',hash:'#galaxy',width:1440,height:1050},
 ]) {
  const page=await browser.newPage({viewport:{width:scenario.width,height:scenario.height},reducedMotion:scenario.reducedMotion || 'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Optional external typography is held constant: system fallback in both runs.
  await page.route(/fonts\.(googleapis|gstatic)\.com/,route=>route.abort());
  await page.goto(base+'/'+scenario.hash);
  await page.waitForLoadState('networkidle');
  if(scenario.hash==='#galaxy')await page.getByRole('button',{name:'Explore Hoth',exact:true}).waitFor();
  else await page.locator('.catalog-item').first().waitFor();
  await page.waitForTimeout(1000);
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.startsWith(location.origin)&&new URL(r.name).pathname.endsWith('.js')).map(r=>({path:new URL(r.name).pathname,encodedBodySize:r.encodedBodySize,decodedBodySize:r.decodedBodySize})));
  let gzipBytes=0;for(const resource of resources)gzipBytes+=gzipSync(await readFile(resolve(dist,'.'+resource.path))).length;
  results.push({scenario:scenario.name,requestedJsBytes:resources.reduce((sum,r)=>sum+r.decodedBodySize,0),requestedJsGzipBytes:gzipBytes,resources,canvasCount:await page.locator('canvas').count(),errors});
  await page.close();
 }
}finally {await browser.close();}
await writeFile(output,JSON.stringify({environment:'Chromium software WebGL, fresh contexts, local uncompressed static server; optional remote fonts blocked consistently. gzip sum computed from actually requested production JS files. Byte/loading evidence only, not device FPS or latency benchmark.',results},null,2)+'\n');
console.log(JSON.stringify(results.map(({resources,...summary})=>summary),null,2));
if(results.some(result=>result.errors.length))process.exitCode=1;
