import {readFileSync,writeFileSync} from 'node:fs';
import {project} from '../dist/geography.js';
// Input: Natural Earth ne_50m_land.geojson (public domain).
const geo=JSON.parse(readFileSync(process.argv[2],'utf8'));
const paths=[];
for(const f of geo.features){
 const polygons=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
 for(const polygon of polygons)paths.push(polygon.map(ring=>ring.map(([lon,lat],i)=>{const p=project(lon,lat);return `${i?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`;}).join('')+'Z').join(''));
}
const grid=[];
for(let lon=-150;lon<180;lon+=30){const p=project(lon,0);grid.push(`<path d="M${p.x},0V500"/>`);}
for(let lat=-60;lat<90;lat+=30){const p=project(0,lat);grid.push(`<path d="M0,${p.y}H1000"/>`);}
writeFileSync('dist/assets/world-map.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500"><title>World map — Natural Earth</title><rect width="1000" height="500" fill="#d6ebea"/><g stroke="#bcdad8" stroke-width=".6" fill="none">${grid.join('')}</g><g fill="#c4d9a7" stroke="#789e83" stroke-width=".65" stroke-linejoin="round" fill-rule="evenodd">${paths.map(d=>`<path d="${d}"/>`).join('')}</g><path d="M0,250H1000" stroke="#719f9a" stroke-dasharray="4 5" opacity=".5"/><g font-family="sans-serif" fill="#568983" font-size="10" letter-spacing="2"><text x="80" y="265">PACIFIC OCEAN</text><text x="360" y="260">ATLANTIC OCEAN</text><text x="680" y="320">INDIAN OCEAN</text></g><text x="15" y="480" font-family="sans-serif" font-size="9" fill="#52776d">Made with Natural Earth · Geographic city positions</text></svg>`);
