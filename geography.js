// Geographic projection retained for rebuilding the optional vector map.
export function project(lon, lat) {
  return {x:(lon+180)/360*1000, y:(90-lat)/180*500};
}
export function flightRoute(from, to) {
  // Use the same illustrated-map positions as the visible city pins.
  const start={x:from.x*10,y:from.y*5}, end={x:to.x*10,y:to.y*5};
  // A local sightseeing loop starts and ends at the actual city.
  const same=from.id===to.id;
  const c1=same?{x:start.x-65,y:start.y-65}:{x:(start.x+end.x)/2,y:Math.max(8,Math.min(start.y,end.y)-Math.max(35,Math.abs(end.x-start.x)*.18))};
  const c2=same?{x:start.x+65,y:start.y-65}:c1;
  return {start,end,c1,c2,path:`M ${start.x},${start.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`};
}
export function routePoint(route,t) {
  const u=1-t,{start:a,c1:b,c2:c,end:d}=route;
  return {x:u**3*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t**3*d.x,y:u**3*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t**3*d.y};
}
