export const STALE_HOURS=36, MAX_AGE_HOURS=72;
const skies=['sunny','rainy','snowy','windy','cloudy'];
const snowCodes=[71,73,75,77,85,86];
const rainCodes=[51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99];
export function teachingSky(code,wind){
 if(snowCodes.includes(code))return 'snowy';
 if(rainCodes.includes(code))return 'rainy';
 if(wind>=30)return 'windy';
 return code<=1?'sunny':'cloudy';
}
export function localDate(now,timezone){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get=t=>parts.find(p=>p.type===t).value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
export function validForecastDay(d){
 return d && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && skies.includes(d.sky)
  && ['temperature','low','high','wind','rainChance','code'].every(k=>Number.isFinite(d[k]))
  && d.low>=-90&&d.high<=65&&d.low<=d.temperature&&d.temperature<=d.high
  && d.wind>=0&&d.rainChance>=0&&d.rainChance<=100;
}
export function validWeather(data,ids){
 try{return data?.schemaVersion===1 && Number.isFinite(Date.parse(data.updatedAt)) && ids.every(id=>{
  const c=data.cities[id];localDate(new Date(),c.timezone);
  return c.days.length===3&&c.days.every(validForecastDay)&&new Set(c.days.map(d=>d.date)).size===3;
 });}catch{return false;}
}
// Returns one stable snapshot; callers retain it throughout a packing round.
export function selectDailyWeather(data,city,now=new Date(),practiceDay=0){
 const fallback=reason=>({kind:'practice',weather:[...city.weather[practiceDay]],reason,updatedAt:data?.updatedAt||null});
 if(!validWeather(data,[city.id]))return fallback('Daily forecast unavailable. Practice weather.');
 const age=(now-new Date(data.updatedAt))/3600000;
 if(age>MAX_AGE_HOURS||age<-.25)return fallback('Forecast is too old or its date is invalid. Practice weather.');
 const c=data.cities[city.id],date=localDate(now,c.timezone),d=c.days.find(d=>d.date===date);
 if(!d)return fallback('No forecast for today in this city. Practice weather.');
 return {kind:'daily',weather:[Math.round(d.temperature),d.sky],date,timezone:c.timezone,
  low:d.low,high:d.high,rainChance:d.rainChance,updatedAt:data.updatedAt,
  stale:age>STALE_HOURS,reason:age>STALE_HOURS?'Update is late. Using the last saved forecast.':''};
}
