import {illustratedPosition} from './map-anchors.js?v=art3';
// Original artwork: calibrated visual anchors are shared by pins and flights.
export const cities = [
 {id:'reykjavik',name:'Reykjavík',say:'Reykjavik',country:'Iceland',lat:64.15,lon:-21.94,flag:'is',label:'up',weather:[[-2,'snowy'],[5,'windy'],[11,'cloudy']],landmark:'Look at the colorful houses!'},
 {id:'london',name:'London',country:'United Kingdom',lat:51.51,lon:-.13,flag:'gb',label:'left',weather:[[12,'rainy'],[17,'cloudy'],[22,'sunny']],landmark:'Look! A big clock and a red bus!'},
 {id:'paris',name:'Paris',country:'France',lat:48.86,lon:2.35,flag:'fr',label:'right',weather:[[19,'sunny'],[10,'rainy'],[4,'cloudy']],landmark:'Look at the Eiffel Tower! It is tall!'},
 {id:'new-york',name:'New York',country:'United States',lat:40.71,lon:-74.01,flag:'us',weather:[[3,'snowy'],[26,'sunny'],[15,'windy']],landmark:'Look at the Statue of Liberty!'},
 {id:'beijing',name:'Beijing',country:'China',lat:39.9,lon:116.41,flag:'cn',label:'up',weather:[[8,'windy'],[29,'sunny'],[-3,'snowy']],landmark:'Look at the Great Wall! It is long!'},
 {id:'tokyo',name:'Tokyo',country:'Japan',lat:35.68,lon:139.69,flag:'jp',label:'right',weather:[[18,'rainy'],[27,'sunny'],[9,'cloudy']],landmark:'Look at Mount Fuji! It is big!'},
 {id:'taipei',name:'Taipei',country:'Taiwan',lat:25.03,lon:121.57,flag:'tw',label:'right',weather:[[28,'rainy'],[32,'sunny'],[16,'windy']],landmark:'Look at Taipei one oh one! It is tall!'},
 {id:'cairo',name:'Cairo',country:'Egypt',lat:30.04,lon:31.24,flag:'eg',label:'left',weather:[[32,'sunny'],[24,'sunny'],[17,'windy']],landmark:'Look at the pyramids in the sand!'},
 {id:'dubai',name:'Dubai',country:'United Arab Emirates',lat:25.2,lon:55.27,flag:'ae',label:'right',weather:[[35,'sunny'],[28,'sunny'],[22,'cloudy']],landmark:'Look at the tall tower!'},
 {id:'singapore',name:'Singapore',country:'Singapore',lat:1.35,lon:103.82,flag:'sg',label:'down',weather:[[30,'rainy'],[31,'sunny'],[28,'cloudy']],landmark:'Look! The Merlion has a fish tail!'},
 {id:'nairobi',name:'Nairobi',country:'Kenya',lat:-1.29,lon:36.82,flag:'ke',label:'right',weather:[[22,'sunny'],[18,'rainy'],[12,'cloudy']],landmark:'Look! A giraffe near the city!'},
 {id:'rio',name:'Rio de Janeiro',say:'Rio',country:'Brazil',lat:-22.91,lon:-43.17,flag:'br',label:'right',weather:[[29,'sunny'],[25,'rainy'],[20,'cloudy']],landmark:'Look at the beach and the mountain!'},
 {id:'cape-town',name:'Cape Town',country:'South Africa',lat:-33.92,lon:18.42,flag:'za',weather:[[16,'windy'],[24,'sunny'],[11,'rainy']],landmark:'Look! The mountain is flat on top!'},
 {id:'sydney',name:'Sydney',country:'Australia',lat:-33.87,lon:151.21,flag:'au',weather:[[23,'sunny'],[14,'windy'],[18,'rainy']],landmark:'Look at the Opera House by the water!'},
 {id:'buenos-aires',name:'Buenos Aires',country:'Argentina',lat:-34.6,lon:-58.38,flag:'ar',label:'left',weather:[[15,'cloudy'],[27,'sunny'],[9,'rainy']],landmark:'Look at the colorful houses and the tall tower!'}
].map(city=>({...city,...illustratedPosition(city.id)}));
export const clothes = [
 {id:'t-shirt',name:'T-shirt',type:'top'}, {id:'sweater',name:'sweater',type:'warm'}, {id:'coat',name:'coat',type:'coat'}, {id:'shorts',name:'shorts',type:'bottom'},
 {id:'pants',name:'pants',type:'bottom'}, {id:'shoes',name:'shoes',type:'feet'}, {id:'boots',name:'boots',type:'feet'}, {id:'hat',name:'hat',type:'sun'},
 {id:'scarf',name:'scarf',type:'warm'}, {id:'gloves',name:'gloves',type:'warm'}, {id:'umbrella',name:'umbrella',type:'rain'}, {id:'sunglasses',name:'sunglasses',type:'sun'}
];
export const weatherIcons={sunny:'☀️',rainy:'🌧️',snowy:'🌨️',windy:'🌬️',cloudy:'☁️'};
export const warmth=t=>t<=10?'cold':t>=25?'hot':'cool';
export function itemProblem(id,[temp,sky]){
 if(temp<=10 && id==='shorts')return "It is cold. Take pants, not shorts.";
 if(temp>=25 && ['coat','sweater','scarf','gloves'].includes(id))return `It is hot. You do not need ${id==='gloves'?'gloves':`a ${id}`}.`;
 if(sky==='windy' && id==='umbrella')return 'It is windy. Put the umbrella away.';
 return '';
}
export function checkBag(ids,weather){
 const bag=new Set(ids),[temp,sky]=weather,issues=[];
 for(const id of bag){const p=itemProblem(id,weather);if(p)issues.push(p);}
 if(!bag.has('t-shirt')&&!bag.has('sweater'))issues.push('Pack a T-shirt or a sweater.');
 if(!bag.has('pants')&&!bag.has('shorts'))issues.push('Pack pants or shorts.');
 if(!bag.has('shoes')&&!bag.has('boots'))issues.push('Pack shoes or boots.');
 if(temp<=10&&!bag.has('coat'))issues.push('It is cold. Pack a coat.');
 if(temp>10&&temp<20&&!bag.has('sweater')&&!bag.has('coat'))issues.push('It is cool. Pack a sweater or a coat.');
 if(temp<=0&&!bag.has('gloves'))issues.push('It is very cold. Pack gloves.');
 if(sky==='rainy'&&!bag.has('umbrella'))issues.push('It is rainy. Pack an umbrella.');
 if(sky==='snowy'&&!bag.has('boots'))issues.push('It is snowy. Pack boots.');
 if(sky==='sunny'&&!bag.has('hat')&&!bag.has('sunglasses'))issues.push('It is sunny. Pack a hat or sunglasses.');
 return [...new Set(issues)];
}
