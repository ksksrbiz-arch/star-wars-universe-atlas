import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { GALACTIC_REGIONS, REGION_REFERENCE, referencePoint } from '../src/galacticRegions.ts';
import { HYPERSPACE_ROUTES } from '../src/hyperspaceRoutes.ts';
import { REFERENCE_MAP, REFERENCE_PLACEMENTS, referencePixelToDisplay } from '../src/referencePlacements.ts';
import { ALL_WORLDS } from '../src/journeyWorlds.ts';
import { gridToDisplay } from '../src/data.ts';

const near = (a,b,epsilon=1e-9) => Math.abs(a-b) < epsilon;
const distance = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1]);
const inside = ([x,y],polygon) => {
  let result=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const [ax,ay]=polygon[i], [bx,by]=polygon[j];
    if((ay>y)!==(by>y) && x<(bx-ax)*(y-ay)/(by-ay)+ax) result=!result;
  }
  return result;
};
const area = polygon => polygon.reduce((sum,p,i)=>{const q=polygon[(i+1)%polygon.length];return sum+p[0]*q[1]-q[0]*p[1];},0)/2;
const cross = (a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const crosses = (a,b,c,d)=>cross(a,b,c)*cross(a,b,d)<-1e-10 && cross(c,d,a)*cross(c,d,b)<-1e-10;
const checks=[];

assert.equal(GALACTIC_REGIONS.length,8);
assert.equal(new Set(GALACTIC_REGIONS.map(r=>r.id)).size,8);
for(const region of GALACTIC_REGIONS) {
  assert(region.points.length>=3);
  assert(region.points.flat().every(Number.isFinite));
  assert(Math.abs(area(region.points))>.01,`${region.id} has nonzero area`);
  for(let i=0;i<region.points.length;i++) for(let j=i+2;j<region.points.length;j++) {
    if(i===0&&j===region.points.length-1) continue;
    assert(!crosses(region.points[i],region.points[(i+1)%region.points.length],region.points[j],region.points[(j+1)%region.points.length]),`${region.id} self-intersects`);
  }
  if(region.inner) {
    const hole=GALACTIC_REGIONS.find(r=>r.id===region.inner); assert(hole);
    assert(hole.points.every(p=>inside(p,region.points)),`${region.id} hole vertices remain inside outer silhouette`);
    assert(Math.abs(area(hole.points))<Math.abs(area(region.points)));
  }
}
checks.push('Eight finite non-self-intersecting region polygons; six nested holes inside their outer silhouettes.');

assert.equal(HYPERSPACE_ROUTES.length,5);
assert.equal(new Set(HYPERSPACE_ROUTES.map(r=>r.id)).size,5);
assert.equal(new Set(HYPERSPACE_ROUTES.map(r=>r.color)).size,5);
for(const route of HYPERSPACE_ROUTES) {
  assert(route.points.length>2); assert(route.points.flat().every(Number.isFinite));
  assert(route.points.every(([x,y])=>x>=-10&&x<=10&&y>=-10&&y<=10));
  assert(route.sourceUrls.length && route.uncertainty.length>30);
  route.referencePixels.forEach((pixel,i)=>assert.deepEqual(route.points[i],referencePoint(...pixel)));
}
assert(near(REGION_REFERENCE.gridCalibration.cell*2.5,REFERENCE_MAP.gridPitchPixels));
assert(near(REGION_REFERENCE.gridCalibration.centerK*2.5,REFERENCE_MAP.originPixels[0]));
assert(near(REGION_REFERENCE.gridCalibration.centerRow11*2.5,REFERENCE_MAP.originPixels[1]));
checks.push('Five unique sourced route traces and region/route/planet geometry share the same reference calibration.');

const perlemian=HYPERSPACE_ROUTES.find(r=>r.id==='perlemian');
const run=HYPERSPACE_ROUTES.find(r=>r.id==='corellian-run');
const spine=HYPERSPACE_ROUTES.find(r=>r.id==='corellian-trade-spine');
const coruscant=ALL_WORLDS.find(w=>w.id==='coruscant');
const coruscantScene=[coruscant.x*10,coruscant.y*10];
assert.deepEqual(perlemian.points[0],run.points[0]);
assert(distance(run.points[0],coruscantScene)<.06,'Coruscant route origins align within six hundredths of a grid cell');
assert.deepEqual(run.points[4],spine.points[0]);
checks.push('Coruscant route origins agree and align with traced planet; Run/Spine share the same Corellia display junction.');

let traced=0, retained=0;
for(const world of ALL_WORLDS) {
  const center=gridToDisplay(world.grid), anchor=REFERENCE_PLACEMENTS[world.id];
  assert(Math.abs(world.x-center.x)<=.05&&Math.abs(world.y-center.y)<=.05,`${world.id} remains in published cell`);
  if(anchor) {
    assert.equal(anchor.grid,world.grid);
    const raw=referencePixelToDisplay(anchor.pixel);
    assert(Math.abs(raw.x-world.x)<.005&&Math.abs(raw.y-world.y)<.005);
    assert(world.uncertainty.includes('approximately traced'));
    traced++;
  } else {assert.deepEqual({x:world.x,y:world.y},center);retained++;}
}
assert.equal(traced,27);assert.equal(retained,ALL_WORLDS.length-27);
checks.push(`27 reference-traced world symbols remain within published cells; ${retained} untraced worlds retain grid centers.`);

const report={checkedOn:'2026-11-07',checks,counts:{regions:GALACTIC_REGIONS.length,routes:HYPERSPACE_ROUTES.length,tracedWorlds:traced,gridCenterWorlds:retained},limitations:['Geometry checks establish internal consistency, not independent cartographic accuracy.','Routes are simplified visual traces; missing branches, intermediate systems, and era availability are not inferred.','Reference-image resolution and label density limit exact symbol and border placement.']};
await writeFile('evidence/reference-data-results.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
