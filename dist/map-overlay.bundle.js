// Very similar to greggman's module:

// Make sure the canvas drawingbuffer is the same size as the display
// webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resizeCanvasToDisplaySize(canvas) {
  let width = canvas.clientWidth;
  let height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    // Resize drawingbuffer to match resized display
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

function initGeometry(canvas, map, width, height) {
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

function initRenderer(canvas) {
  // Input canvas is an HTML Canvas element

  const ctx = canvas.getContext("2d");

  return {
    drawPoly,
    drawBox,
    clear: () => ctx.clearRect(0, 0, canvas.width, canvas.height),
  };

  function drawPoly(poly, params) {
    setup(params);

    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.stroke();
  }

  function drawBox(box, params) {
    setup(params);

    ctx.strokeRect(
      box[0][0],
      box[0][1],
      box[1][0] - box[0][0],
      box[1][1] - box[0][1]
    );
  }

  function setup(params) {
    if (!params) params = {};
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = params.lineWidth || 5;
    ctx.strokeStyle = params.strokeStyle || "#FF0000";
  }
}

function init(canvas, map, width, height) {
  // Input canvas is an HTML Canvas element
  // Input map is an instance of tile-frame
  // Input width, height are the pixel sizes of the rastermap grid

  if (!canvas || canvas.nodeName !== "CANVAS") {
    return console.log("ERROR in mapOverlay: No valid canvas element!");
  } else if (!map || !map.xyToMapPixels) {
    return console.log("ERROR in mapOverlay: No valid tile-frame instance!");
  }

  // Initialize geometry methods and renderer
  const geometry = initGeometry(canvas, map, width, height);
  const renderer = initRenderer(canvas);

  // Declare arrays for the polygon, in global and local coordinates
  const rawQC = [], pixQC = [];

  return {
    reset,
    draw,
  };

  function reset() {
    renderer.clear();
    rawQC.length = 0;
  }

  function draw(poly, mapChanged) {
    // Check for a valid polygon. TODO: Check each element is a valid point?
    if (poly.length < 2) return;

    // Check if anything changed since last call
    var polyChanged = geometry.updatePoly(rawQC, poly);
    var canvasResized = resizeCanvasToDisplaySize(canvas);
    if (!polyChanged && !canvasResized && !mapChanged) return;
    if (canvas.width < 5 || canvas.height < 5) return;

    // Convert box to map pixels and draw
    geometry.toPixels(pixQC, rawQC);
    return (pixQC.length === 2) 
      ? renderer.drawBox(pixQC)
      : renderer.drawPoly(pixQC);
  }
}

export { init };
