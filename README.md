# map-overlay

Overlay simple polygons on a rastermap instance

## Initialization
mapOverlay.init takes a parameters object with the following properties:
- canvas: an HTML canvas element
- map: a rastermap instance (or equivalent). MUST have a method named
  xyToMapPixels, for converting x/y coordinates in the map's projection to
  pixel indices from the top left corner of the map
- width, height: the pixel dimensions of the rastermap drawingbuffer

## API
Initialization returns an object with the following methods:
- draw(polygon, mapChanged): Draws polygon on the overlay canvas.
  - polygong must be an array of points, where each point is a two-element
    array containing floating point numbers.
  - mapChanged is a flag indicating whether the underlying map coordinates
    have changed since the last draw call.
- reset(): Clears the canvas and the stored polygon

Note that the .draw method will do *nothing* if all of the following conditions
are true:
- polygon is the same as the last call
- overlay canvas has not changed size
- mapChanged is false
