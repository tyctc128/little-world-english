import test from 'node:test';
import assert from 'node:assert/strict';
import {cities,clothes,checkBag,itemProblem} from '../dist/data.js';
import {existsSync} from 'node:fs';
test('every city scenario has a valid practical packing solution',()=>{
 for(const city of cities)for(const w of city.weather){
 const [t,s]=w;const bag=['t-shirt','pants',s==='snowy'?'boots':'shoes'];
 if(t<=10)bag.push('coat');else if(t<20)bag.push('sweater');
 if(t<=0)bag.push('gloves');if(s==='rainy')bag.push('umbrella');if(s==='sunny')bag.push('hat');
 assert.deepEqual(checkBag(bag,w),[],city.id+JSON.stringify(w));
 }
});
test('essentials cannot be bypassed by packing only weather accessories',()=>{
 const issues=checkBag(['umbrella','hat'],[28,'rainy']);assert.equal(issues.length,3);
 assert.ok(checkBag(['t-shirt','pants','shoes'],[-2,'snowy']).some(x=>x.includes('coat')));
 assert.ok(checkBag(['t-shirt','pants','coat','gloves','shoes'],[-2,'snowy']).some(x=>x.includes('boots')));
});
test('immediate feedback and final checks agree on unsuitable items',()=>{
 for(const c of clothes)for(const city of cities)for(const w of city.weather){const p=itemProblem(c.id,w);if(p)assert.ok(checkBag([c.id],w).includes(p));}
 assert.match(itemProblem('coat',[30,'sunny']),/hot/);assert.match(itemProblem('shorts',[10,'cloudy']),/cold/);
 assert.equal(itemProblem('shorts',[11,'cloudy']),'');assert.equal(itemProblem('coat',[24,'sunny']),'');
});
test('15 distinct destinations have metadata, scenes and all garment assets',()=>{
 assert.equal(cities.length,15);assert.equal(new Set(cities.map(c=>c.id)).size,15);
 assert.ok(Math.max(...cities.map(c=>c.lat))-Math.min(...cities.map(c=>c.lat))>95);
 for(const c of cities){assert.ok(existsSync(`dist/assets/cities/${c.id}.webp`));assert.ok(c.x>0&&c.x<100&&c.y>0&&c.y<100);}
 for(const c of clothes)assert.ok(existsSync(`dist/assets/clothes/${c.id}.png`));
 assert.ok(existsSync('dist/assets/plane.png'));assert.ok(existsSync('dist/assets/world-map.svg'));
});
