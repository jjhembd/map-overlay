export function initRenderer(canvas) {
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
