// Chitram Paint Studio — HTML5 Canvas 2D
let currentPaintTool = 'brush';
let currentPaintColor = '#06b6d4';
let isPainting = false;
let paintStartX = 0;
let paintStartY = 0;
let canvasBuffer = null;

function initPaintCanvas() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.onmousedown = (e) => {
        isPainting = true;
        const r = canvas.getBoundingClientRect();
        paintStartX = e.clientX - r.left;
        paintStartY = e.clientY - r.top;
        canvasBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(paintStartX, paintStartY);
    };

    canvas.onmousemove = (e) => {
        if (!isPainting) return;
        const r = canvas.getBoundingClientRect();
        const curX = e.clientX - r.left;
        const curY = e.clientY - r.top;
        const size = parseInt(document.getElementById('paint-size-slider')?.value || '4');

        if (currentPaintTool === 'brush') {
            ctx.strokeStyle = currentPaintColor;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineTo(curX, curY);
            ctx.stroke();
        } else if (currentPaintTool === 'eraser') {
            ctx.strokeStyle = '#090d16';
            ctx.lineWidth = size * 2;
            ctx.lineCap = 'round';
            ctx.lineTo(curX, curY);
            ctx.stroke();
        } else if (canvasBuffer) {
            ctx.putImageData(canvasBuffer, 0, 0);
            ctx.strokeStyle = currentPaintColor;
            ctx.lineWidth = size;

            if (currentPaintTool === 'line') {
                ctx.beginPath();
                ctx.moveTo(paintStartX, paintStartY);
                ctx.lineTo(curX, curY);
                ctx.stroke();
            } else if (currentPaintTool === 'rect') {
                ctx.strokeRect(paintStartX, paintStartY, curX - paintStartX, curY - paintStartY);
            } else if (currentPaintTool === 'circle') {
                const radius = Math.sqrt(Math.pow(curX - paintStartX, 2) + Math.pow(curY - paintStartY, 2));
                ctx.beginPath();
                ctx.arc(paintStartX, paintStartY, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    };

    canvas.onmouseup = () => { isPainting = false; };
    canvas.onmouseleave = () => { isPainting = false; };
}

function selectPaintTool(tool) {
    currentPaintTool = tool;
    ['brush', 'eraser', 'line', 'rect', 'circle'].forEach(t => {
        const btn = document.getElementById('tool-btn-' + t);
        if (btn) {
            if (t === tool) btn.className = 'px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/40';
            else btn.className = 'px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700';
        }
    });
}

function selectPaintColor(color) {
    currentPaintColor = color;
}

function clearPaintCanvas() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function exportPaintImage() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `chitram_artwork_${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
}
