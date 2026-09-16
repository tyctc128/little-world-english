import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {cities,checkBag} from '../dist/data.js';
import {localDate,teachingSky,selectDailyWeather,validWeather} from '../dist/daily-weather.js';
import {normalizeForecast,updateWeather} from '../scripts/update-weather.mjs';
const city=cities.find(c=>c.id==='taipei');
const day=date=>({date,temperature:18,low:12,high:24,code:61,sky:'rainy',rainChance:80,wind:12});
const data={schemaVersion:1,updatedAt:'2026-09-16T22:17:00Z',cities:{taipei:{timezone:'Asia/Taipei',days:['2026-09-17','2026-09-18','2026-09-19'].map(day)}}};
test('local calendar selection handles opposite dates and daylight saving',()=>{
 const now=new Date('2026-09-16T22:17:00Z');
 assert.equal(localDate(now,'Asia/Taipei'),'2026-09-17');assert.equal(localDate(now,'America/New_York'),'2026-09-16');
 assert.equal(localDate(new Date('2026-07-01T04:30:00Z'),'America/New_York'),'2026-07-01');
 assert.equal(localDate(new Date('2026-01-01T04:30:00Z'),'America/New_York'),'2025-12-31');
 assert.equal(selectDailyWeather(data,city,now).date,'2026-09-17');
});
test('retains valid stale forecast, falls back when expired or local date absent',()=>{
 const stale=selectDailyWeather(data,city,new Date('2026-09-18T12:00:00Z'));
 assert.equal(stale.kind,'daily');assert.equal(stale.stale,true);
 assert.equal(selectDailyWeather(data,city,new Date('2026-09-20T01:00:00Z')).kind,'practice');
 const missing=structuredClone(data);missing.cities.taipei.days=missing.cities.taipei.days.map(d=>({...d,date:d.date.replace('09','08')}));
 assert.equal(selectDailyWeather(missing,city,new Date(data.updatedAt)).kind,'practice');
 assert.equal(selectDailyWeather(null,city).kind,'practice');
 assert.equal(selectDailyWeather({...data,updatedAt:'bad'},city).kind,'practice');
});
test('snow and rain outrank wind; daily snapshots use existing consistent packing rules',()=>{
 assert.equal(teachingSky(73,50),'snowy');assert.equal(teachingSky(95,50),'rainy');
 assert.equal(teachingSky(0,31),'windy');assert.equal(teachingSky(1,10),'sunny');assert.equal(teachingSky(45,10),'cloudy');
 const snapshot=selectDailyWeather(data,city,new Date(data.updatedAt));
 assert.deepEqual(checkBag(['sweater','pants','shoes','umbrella'],snapshot.weather),[]);
 assert.ok(checkBag(['sweater','pants','shoes'],snapshot.weather).some(s=>s.includes('umbrella')));
 const copy=structuredClone(data);const fixed=selectDailyWeather(copy,city,new Date(data.updatedAt));
 copy.cities.taipei.days[0].temperature=30;assert.deepEqual(fixed.weather,[18,'rainy']);
});
test('rejects malformed or incomplete forecasts',()=>{
 const bad=structuredClone(data);bad.cities.taipei.days[0].temperature=null;assert.equal(validWeather(bad,['taipei']),false);
 assert.throws(()=>normalizeForecast([],new Date(data.updatedAt)));
});
test('failed update leaves previous weather.json byte-for-byte intact and records failure',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'travel-weather-'));
 try{
  const original=JSON.stringify(data);await writeFile(join(directory,'weather.json'),original);
  const result=await updateWeather({directory,now:new Date(data.updatedAt),fetcher:async()=>({ok:false,status:503})});
  assert.equal(result.ok,false);assert.equal(await readFile(join(directory,'weather.json'),'utf8'),original);
  assert.equal(JSON.parse(await readFile(join(directory,'weather-status.json'),'utf8')).ok,false);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('saved production data has 15 cities and 45 complete forecasts',async()=>{
 const saved=JSON.parse(await readFile('dist/weather.json','utf8'));
 assert.equal(validWeather(saved,cities.map(c=>c.id)),true);
 assert.equal(Object.keys(saved.cities).length,15);
});
