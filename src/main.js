import { resizeCanvasToDisplaySize } from 'yawgl';
import { initGeometry } from "./geometry.js";
import { initRenderer } from "./renderer.js";

export function init(canvas, map, width, height) {
  // Input canvas is an HTML Canvas element
  // Input map is an instance of rastermap
  // Input width, height are the pixel sizes of the rastermap grid

  if (!canvas || canvas.nodeName !== "CANVAS") {
    return console.log("ERROR in mapOverlay: No valid canvas element!");
  } else if (!map || !map.xyToMapPixels) {
    return console.log("ERROR in mapOverlay: No valid rastermap instance!");
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
