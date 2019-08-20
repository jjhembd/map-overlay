export function initGeometry(canvas, map, width, height) {
  // Input canvas is an HTML Canvas element
  // Input map is an instance of rastermap
  // Input width, height are the pixel sizes of the rastermap grid

  return {
    updatePoly,
    toPixels,
  };

  function updatePoly(pOld, pNew) {
    if (polyMatch(pOld, pNew)) return false;
    pOld.length = 0;
    pNew.forEach( pt => pOld.push([pt[0], pt[1]]) ); 
    return true;
  }

  function polyMatch(poly1, poly2) {
    if (poly1.length !== poly2.length) return false;
    return poly1.every( (pt, i) => pointMatch(pt, poly2[i]) );
  }

  function pointMatch(p1, p2) {
    return (p1[0] === p2[0] && p1[1] === p2[1]);
  }

  function toPixels(pix, raw) {
    // Update scaling of the overlay canvas vs. the map drawingbuffer
    let xscale = canvas.width / width;
    let yscale = canvas.height / height;

    // Clear the pix array
    pix.length = 0;

    // Convert raw polygon from world X/Y to map pixels
    const pixPt = [];
    raw.forEach(pt => {
      map.xyToMapPixels( pixPt, pt );
      pixPt[0] *= xscale;
      pixPt[1] *= yscale;
      pix.push([pixPt[0], pixPt[1]]);
    });
  }
}
