// Advanced Paint Studio App — Brush, Eraser, Shapes, Bucket Fill, Undo/Redo
let paintCanvas, paintCtx;
let isPainting = false;
let currentTool = 'brush'; // 'brush', 'eraser', 'line', 'rect', 'circle', 'fill', 'picker'
let currentColor = '#38bdf8';
let brushSize = 4;
let brushOpacity = 1.0;

let startX = 0, startY = 0;
let snapshotData = null;
let undoStack = [];
let redoStack = [];
const MAX_HISTORY = 20;

function initPaint() {
  paintCanvas = document.getElementById('paint-canvas');
  if (!paintCanvas) return;
  paintCtx = paintCanvas.getContext('2d', { willReadFrequently: true });
  
  // Fill initial canvas with dark background
  paintCtx.fillStyle = '#0f172a';
  paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
  saveState();
  
  paintCanvas.addEventListener('mousedown', onPaintDown);
  paintCanvas.addEventListener('mousemove', onPaintMove);
  paintCanvas.addEventListener('mouseup', onPaintUp);
  paintCanvas.addEventListener('mouseleave', onPaintUp);
}

function saveState() {
  if (!paintCtx || !paintCanvas) return;
  if (undoStack.length >= MAX_HISTORY) undoStack.shift();
  undoStack.push(paintCtx.getImageData(0, 0, paintCanvas.width, paintCanvas.height));
  redoStack = []; // Clear redo on new action
}

function undoPaint() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    const prev = undoStack[undoStack.length - 1];
    paintCtx.putImageData(prev, 0, 0);
  }
}

function redoPaint() {
  if (redoStack.length > 0) {
    const next = redoStack.pop();
    undoStack.push(next);
    paintCtx.putImageData(next, 0, 0);
  }
}

function onPaintDown(e) {
  isPainting = true;
  const rect = paintCanvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  
  if (currentTool === 'fill') {
    floodFill(Math.floor(startX), Math.floor(startY), hexToRgb(currentColor));
    saveState();
    isPainting = false;
    return;
  }
  
  if (currentTool === 'picker') {
    pickColor(Math.floor(startX), Math.floor(startY));
    isPainting = false;
    return;
  }
  
  snapshotData = paintCtx.getImageData(0, 0, paintCanvas.width, paintCanvas.height);
  
  if (currentTool === 'brush' || currentTool === 'eraser') {
    paintCtx.beginPath();
    paintCtx.moveTo(startX, startY);
    applyStrokeStyle();
    paintCtx.lineTo(startX, startY);
    paintCtx.stroke();
  }
}

function onPaintMove(e) {
  if (!isPainting) return;
  const rect = paintCanvas.getBoundingClientRect();
  const curX = e.clientX - rect.left;
  const curY = e.clientY - rect.top;
  
  if (currentTool === 'brush' || currentTool === 'eraser') {
    applyStrokeStyle();
    paintCtx.lineTo(curX, curY);
    paintCtx.stroke();
  } else if (snapshotData && (currentTool === 'line' || currentTool === 'rect' || currentTool === 'circle')) {
    paintCtx.putImageData(snapshotData, 0, 0);
    applyStrokeStyle();
    paintCtx.beginPath();
    
    if (currentTool === 'line') {
      paintCtx.moveTo(startX, startY);
      paintCtx.lineTo(curX, curY);
      paintCtx.stroke();
    } else if (currentTool === 'rect') {
      paintCtx.strokeRect(startX, startY, curX - startX, curY - startY);
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(curX - startX, 2) + Math.pow(curY - startY, 2));
      paintCtx.arc(startX, startY, radius, 0, 2 * Math.PI);
      paintCtx.stroke();
    }
  }
}

function onPaintUp() {
  if (isPainting) {
    isPainting = false;
    saveState();
  }
}

function applyStrokeStyle() {
  paintCtx.lineCap = 'round';
  paintCtx.lineJoin = 'round';
  paintCtx.globalAlpha = brushOpacity;
  
  if (currentTool === 'eraser') {
    paintCtx.strokeStyle = '#0f172a';
    paintCtx.lineWidth = brushSize * 4;
  } else {
    paintCtx.strokeStyle = currentColor;
    paintCtx.lineWidth = brushSize;
  }
}

function setTool(tool) {
  currentTool = tool;
  const toolBtns = ['brush', 'eraser', 'line', 'rect', 'circle', 'fill', 'picker'];
  toolBtns.forEach(t => {
    document.getElementById('tool-' + t)?.classList.toggle('active', t === tool);
  });
}

function setBrushSize(size) {
  brushSize = parseInt(size);
  const label = document.getElementById('brush-size-val');
  if (label) label.textContent = size + 'px';
}

function setBrushOpacity(op) {
  brushOpacity = parseFloat(op);
  const label = document.getElementById('brush-opacity-val');
  if (label) label.textContent = Math.round(brushOpacity * 100) + '%';
}

function setColor(c) {
  currentColor = c;
  const picker = document.getElementById('custom-color-picker');
  if (picker) picker.value = c;
  if (currentTool === 'eraser') setTool('brush');
}

function clearCanvas() {
  if (!paintCtx || !paintCanvas) return;
  if (confirm('Clear the entire canvas?')) {
    paintCtx.globalAlpha = 1.0;
    paintCtx.fillStyle = '#0f172a';
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
    saveState();
  }
}

function saveDrawing() {
  if (!paintCanvas) return;
  const link = document.createElement('a');
  link.download = 'bharatos_artwork_' + Date.now() + '.png';
  link.href = paintCanvas.toDataURL('image/png');
  link.click();
}

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function pickColor(x, y) {
  const pixel = paintCtx.getImageData(x, y, 1, 1).data;
  const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
  setColor(hex);
  setTool('brush');
}

function floodFill(startX, startY, fillRgb) {
  const imgData = paintCtx.getImageData(0, 0, paintCanvas.width, paintCanvas.height);
  const data = imgData.data;
  const width = paintCanvas.width;
  const height = paintCanvas.height;
  
  const startIndex = (startY * width + startX) * 4;
  const startR = data[startIndex];
  const startG = data[startIndex + 1];
  const startB = data[startIndex + 2];
  
  if (startR === fillRgb[0] && startG === fillRgb[1] && startB === fillRgb[2]) return;
  
  const stack = [[startX, startY]];
  
  while (stack.length > 0) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    
    const idx = (y * width + x) * 4;
    if (data[idx] === startR && data[idx + 1] === startG && data[idx + 2] === startB) {
      data[idx] = fillRgb[0];
      data[idx + 1] = fillRgb[1];
      data[idx + 2] = fillRgb[2];
      data[idx + 3] = 255;
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }
  
  paintCtx.putImageData(imgData, 0, 0);
}
