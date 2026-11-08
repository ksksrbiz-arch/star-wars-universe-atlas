import assert from 'node:assert/strict';
import {leaderEndAtLabelEdge} from '../src/labelLeaderGeometry.ts';
assert.deepEqual(leaderEndAtLabelEdge(100,0,80,44).map(Math.round),[57,0]);
assert.deepEqual(leaderEndAtLabelEdge(-100,0,80,44).map(Math.round),[-57,0]);
assert.deepEqual(leaderEndAtLabelEdge(0,100,80,44),[0,75]);
assert.deepEqual(leaderEndAtLabelEdge(0,-100,80,44),[0,-75]);
for(const [x,y] of [[0,0],[20,10],[-20,-10]])assert(leaderEndAtLabelEdge(x,y,80,44).every(n=>n===0));
for(const [x,y,w,h] of [[100,100,80,44],[-180,60,140,44],[50,-110,100,48],[200,5,120,44]]){
 const [a,b]=leaderEndAtLabelEdge(x,y,w,h);assert(Math.abs(a*y-b*x)<1e-8,'endpoint stays on the source ray');assert(Math.abs(a)<Math.abs(x)||Math.abs(b)<Math.abs(y),'endpoint is nearer the source');assert(Math.abs(Math.max(Math.abs(a-x)/(w/2+3),Math.abs(b-y)/(h/2+3))-1)<1e-8,'endpoint meets padded near border');
}
console.log('PASS leader near-edge clipping: axes, diagonals, negative offsets and covered sources');

