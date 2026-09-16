// Visual anchors on the original 1774 x 887 illustrated map.
// This hand-painted coastline is stylized, not a geographic projection.
// Keep lat/lon in data.js as metadata; pins and flights use these same anchors.
export const mapAnchors = {
 'reykjavik':[690,146],
 'london':[803,214],
 'paris':[814,246],
 'new-york':[478,278],
 'beijing':[1386,278],
 'tokyo':[1500,309],
 'taipei':[1427,358],
 'cairo':[956,330],
 'dubai':[1071,365],
 'singapore':[1334,506],
 'nairobi':[970,482],
 'rio':[597,589],
 'cape-town':[893,637],
 'sydney':[1560,653],
 'buenos-aires':[541,648]
};
export function illustratedPosition(id) {
 const anchor=mapAnchors[id];
 if(!anchor)throw new Error(`Missing map anchor: ${id}`);
 return {x:anchor[0]/1774*100,y:anchor[1]/887*100};
}
