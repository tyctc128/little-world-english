import test from 'node:test';
import assert from 'node:assert/strict';
import {project,flightRoute,routePoint} from '../dist/geography.js';
import {cities} from '../dist/data.js';
test('projection anchors match the world map extent and equator',()=>{
 assert.deepEqual(project(-180,90),{x:0,y:0});
 assert.deepEqual(project(0,0),{x:500,y:250});
 assert.deepEqual(project(180,-90),{x:1000,y:500});
});
test('all 225 flights start and finish on their city pins, including local loops',()=>{
 for(const from of cities)for(const to of cities){
  const r=flightRoute(from,to);
  for(const [t,c] of [[0,from],[1,to]]){
   const p=routePoint(r,t);assert.ok(Math.abs(p.x-c.x*10)<1e-9);assert.ok(Math.abs(p.y-c.y*5)<1e-9);
  }
  for(let i=0;i<=100;i++){const p=routePoint(r,i/100);assert.ok(p.x>=0&&p.x<=1000&&p.y>=0&&p.y<=500);}
 }
});
