import test from 'node:test';
import assert from 'node:assert/strict';
import {FlightAudio} from '../dist/flight-audio.js';
function mockContext(){
 const sources=[];
 const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){}});
 const node=()=>({gain:param(),frequency:param(),Q:param(),connect(n){return n;},disconnect(){}});
 const source=()=>{const n={...node(),starts:0,stops:[],start(){this.starts++;},stop(t){this.stops.push(t);}};sources.push(n);return n;};
 return {sources,state:'running',currentTime:10,sampleRate:100,destination:node(),resume:async()=>{},createGain:node,createOscillator:source,createBufferSource:source,createBiquadFilter:node,createBuffer:()=>({getChannelData:()=>new Float32Array(200)})};
}
test('flight sources have a bounded lifetime; mute stops every source',()=>{
 const ctx=mockContext(),audio=new FlightAudio(()=>ctx);audio.start(6.5);
 assert.equal(ctx.sources.length,3);
 assert.ok(ctx.sources.every(n=>n.starts===1&&n.stops[0]===16.5));
 audio.setEnabled(false);assert.equal(audio.active,null);
 assert.ok(ctx.sources.every(n=>n.stops.length===2));
 audio.start();assert.equal(ctx.sources.length,3);
 audio.setEnabled(true);audio.start(1.2);assert.equal(ctx.sources.length,6);
 audio.stop();assert.equal(audio.active,null);
});
test('unavailable audio does not interrupt the game',()=>{
 const audio=new FlightAudio(()=>{throw new Error('Unavailable');});
 assert.doesNotThrow(()=>audio.start());assert.equal(audio.active,null);
});
