// Paint Studio — HTML5 Canvas drawing & PNG exporter
let paintCtx = null;
let drawing = false;
let paintColor = '#06b6d4';
let brushSize = 4;
let activeTool = 'brush';
let lastX = 0;
let lastY = 0;

function initPaint() {
  const canvas = document.getElementById('paint-canvas');
  if (!canvas) return;
  
  paintCtx = canvas.getContext('2d');
  paintCtx.fillStyle = '#0f172a';
  paintCtx.fillRect(0, 0, canvas.width, canvas.height);
  
  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const r = canvas.getBoundingClientRect();
    lastX = e.clientX - r.left;
    lastY = e.clientY - r.top;
    
    if (activeTool === 'brush') {
      paintCtx.beginPath();
      paintCtx.arc(lastX, lastY, brushSize / 2, 0, Math.PI * 2);
      paintCtx.fillStyle = paintColor;
      paintCtx.fill();
    }
  });
  
  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const r = canvas.getBoundingClientRect();
    const curX = e.clientX - r.left;
    const curY = e.clientY - r.top;
    
    paintCtx.beginPath();
    paintCtx.moveTo(lastX, lastY);
    paintCtx.lineTo(curX, curY);
    paintCtx.strokeStyle = activeTool === 'eraser' ? '#0f172a' : paintColor;
    paintCtx.lineWidth = activeTool === 'eraser' ? brushSize * 2 : brushSize;
    paintCtx.lineCap = 'round';
    paintCtx.stroke();
    
    lastX = curX;
    lastY = curY;
  });
  
  canvas.addEventListener('mouseup', () => { drawing = false; });
  canvas.addEventListener('mouseleave', () => { drawing = false; });
}

function setTool(tool) {
  activeTool = tool;
  document.getElementById('tool-brush')?.classList.toggle('bg-cyan-500/30', tool === 'brush');
  document.getElementById('tool-eraser')?.classList.toggle('bg-cyan-500/30', tool === 'eraser');
}

function setColor(c) {
  paintColor = c;
}

function clearCanvas() {
  const canvas = document.getElementById('paint-canvas');
  if (canvas && paintCtx) {
    paintCtx.fillStyle = '#0f172a';
    paintCtx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function saveDrawing() {
  const canvas = document.getElementById('paint-canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `drawing-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
}
