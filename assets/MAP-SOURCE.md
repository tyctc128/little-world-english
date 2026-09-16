Coastlines: Natural Earth 1:50m land, public domain.
https://www.naturalearthdata.com/about/terms-of-use/
Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson

Equirectangular projection: longitude -180..180, latitude 90..-90,
SVG extent 1000 x 500. Coastlines, city pins and flight endpoints share
dist/geography.js. City coordinates are rounded to 0.01 degrees.
Flight curves are decorative animations, not real airline routes.
Rebuild: node scripts/build-map.mjs path/to/ne_50m_land.geojson
