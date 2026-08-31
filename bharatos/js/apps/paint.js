// Paint Studio App
let paintCanvas, paintCtx;
let isDrawing = false;
let currentTool = 'brush';
let currentColor = '#38bdf8';

function initPaint() {
  paintCanvas = document.getElementById('paint-canvas');
  if (!paintCanvas) return;
  paintCtx = paintCanvas.getContext('2d');
  
  paintCtx.fillStyle = '#0f172a';
  paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
  
  paintCanvas.addEventListener('mousedown', startPaint);
  paintCanvas.addEventListener('mousemove', drawPaint);
  paintCanvas.addEventListener('mouseup', stopPaint);
  paintCanvas.addEventListener('mouseleave', stopPaint);
}

function startPaint(e) {
  isDrawing = true;
  const rect = paintCanvas.getBoundingClientRect();
  paintCtx.beginPath();
  paintCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function drawPaint(e) {
  if (!isDrawing) return;
  const rect = paintCanvas.getBoundingClientRect();
  
  if (currentTool === 'brush') {
    paintCtx.strokeStyle = currentColor;
    paintCtx.lineWidth = 3;
  } else {
    paintCtx.strokeStyle = '#0f172a';
    paintCtx.lineWidth = 20;
  }
  paintCtx.lineCap = 'round';
  paintCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  paintCtx.stroke();
}

function stopPaint() {
  isDrawing = false;
}

function setTool(tool) {
  currentTool = tool;
  document.getElementById('tool-brush')?.classList.toggle('active', tool === 'brush');
  document.getElementById('tool-eraser')?.classList.toggle('active', tool === 'eraser');
}

function setColor(c) {
  currentColor = c;
  setTool('brush');
}

function clearCanvas() {
  if (!paintCtx || !paintCanvas) return;
  paintCtx.fillStyle = '#0f172a';
  paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
}

function saveDrawing() {
  if (!paintCanvas) return;
  const link = document.createElement('a');
  link.download = 'bharatos_drawing.png';
  link.href = paintCanvas.toDataURL();
  link.click();
}
