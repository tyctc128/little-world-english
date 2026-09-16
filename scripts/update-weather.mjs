import {readFile,writeFile,rename} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {cities} from '../dist/data.js';
import {teachingSky,validWeather,localDate} from '../dist/daily-weather.js';
export function forecastURL(){
 const url=new URL('https://api.open-meteo.com/v1/forecast');
 url.search=new URLSearchParams({latitude:cities.map(c=>c.lat).join(','),longitude:cities.map(c=>c.lon).join(','),
  daily:'weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_probability_max,wind_speed_10m_max',
  timezone:'auto',forecast_days:'3',temperature_unit:'celsius',wind_speed_unit:'kmh'});
 return url;
}
export function normalizeForecast(raw,now=new Date()){
 if(!Array.isArray(raw)||raw.length!==cities.length)throw new Error('Expected all 15 cities');
 const result={schemaVersion:1,source:'Open-Meteo',sourceUrl:'https://open-meteo.com/',updatedAt:now.toISOString(),cities:{}};
 raw.forEach((r,i)=>{
  const city=cities[i],d=r.daily;
  if(Math.abs(r.latitude-city.lat)>.5||Math.abs(r.longitude-city.lon)>.5)throw new Error('Unexpected forecast location');
  if(d?.time?.length!==3||d.time[0]!==localDate(now,r.timezone))throw new Error('Missing current local forecast date');
  result.cities[city.id]={timezone:r.timezone,latitude:city.lat,longitude:city.lon,days:d.time.map((date,j)=>({
   date,code:d.weather_code[j],temperature:d.temperature_2m_mean[j],low:d.temperature_2m_min[j],high:d.temperature_2m_max[j],
   rainChance:d.precipitation_probability_max[j],wind:d.wind_speed_10m_max[j],sky:teachingSky(d.weather_code[j],d.wind_speed_10m_max[j])
  }))};
 });
 if(!validWeather(result,cities.map(c=>c.id)))throw new Error('Forecast validation failed');
 return result;
}
export async function updateWeather({fetcher=fetch,directory='dist',now=new Date()}={}){
 const status={attemptedAt:now.toISOString(),ok:false};
 try{
  let response,lastError;
  for(let attempt=0;attempt<3;attempt++){
   try{response=await fetcher(forecastURL(),{signal:AbortSignal.timeout(45000)});if(!response.ok)throw new Error(`Weather HTTP ${response.status}`);
    const data=normalizeForecast(await response.json(),now);
    await writeFile(`${directory}/weather.json.tmp`,JSON.stringify(data,null,2)+'\n');
    await rename(`${directory}/weather.json.tmp`,`${directory}/weather.json`);
    status.ok=true;status.updatedAt=data.updatedAt;break;
   }catch(error){lastError=error;if(attempt<2)await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));}
  }
  if(!status.ok)throw lastError;
 }catch(error){
  console.warn(`::warning::Weather update failed; retaining the previous forecast. ${error.message}`);
  try{status.updatedAt=JSON.parse(await readFile(`${directory}/weather.json`,'utf8')).updatedAt;}catch{status.updatedAt=null;}
 }
 await writeFile(`${directory}/weather-status.json`,JSON.stringify(status,null,2)+'\n');
 return status;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const status=await updateWeather();console.log(JSON.stringify(status));
 // The workflow deploys the retained file even on failure, then reports a failed run.
}
