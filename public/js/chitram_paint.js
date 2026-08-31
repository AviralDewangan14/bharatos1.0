// Chitram Vector Paint Studio
let chitramTool = 'brush';
let chitramColor = '#06b6d4';
let isChitramDrawing = false;
let chitramStartX = 0;
let chitramStartY = 0;
let chitramSnapshot = null;

function initChitramCanvas() {
    const canvas = document.getElementById('chitram-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.onmousedown = (e) => {
        isChitramDrawing = true;
        const rect = canvas.getBoundingClientRect();
        chitramStartX = e.clientX - rect.left;
        chitramStartY = e.clientY - rect.top;
        chitramSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(chitramStartX, chitramStartY);
    };

    canvas.onmousemove = (e) => {
        if (!isChitramDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const curX = e.clientX - rect.left;
        const curY = e.clientY - rect.top;
        const size = parseInt(document.getElementById('chitram-stroke-size')?.value || '4');

        if (chitramTool === 'brush') {
            ctx.strokeStyle = chitramColor;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineTo(curX, curY);
            ctx.stroke();
        } else if (chitramTool === 'eraser') {
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = size * 2;
            ctx.lineCap = 'round';
            ctx.lineTo(curX, curY);
            ctx.stroke();
        } else if (chitramSnapshot) {
            ctx.putImageData(chitramSnapshot, 0, 0);
            ctx.strokeStyle = chitramColor;
            ctx.lineWidth = size;

            if (chitramTool === 'line') {
                ctx.beginPath();
                ctx.moveTo(chitramStartX, chitramStartY);
                ctx.lineTo(curX, curY);
                ctx.stroke();
            } else if (chitramTool === 'rect') {
                ctx.strokeRect(chitramStartX, chitramStartY, curX - chitramStartX, curY - chitramStartY);
            } else if (chitramTool === 'circle') {
                const radius = Math.sqrt(Math.pow(curX - chitramStartX, 2) + Math.pow(curY - chitramStartY, 2));
                ctx.beginPath();
                ctx.arc(chitramStartX, chitramStartY, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    };

    canvas.onmouseup = () => { isChitramDrawing = false; };
    canvas.onmouseleave = () => { isChitramDrawing = false; };
}

function setChitramTool(tool) {
    chitramTool = tool;
    ['brush', 'eraser', 'line', 'rect', 'circle'].forEach(t => {
        const btn = document.getElementById('tool-' + t);
        if (btn) {
            if (t === tool) {
                btn.className = 'px-2.5 py-1.5 rounded-lg bg-pink-500/30 text-pink-300 border border-pink-500/50 font-bold active:scale-95';
            } else {
                btn.className = 'px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95';
            }
        }
    });
}

function setChitramColor(color) {
    chitramColor = color;
    const custom = document.getElementById('chitram-custom-color');
    if (custom) custom.value = color;
}

function clearChitramCanvas() {
    const canvas = document.getElementById('chitram-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function exportChitramPNG() {
    const canvas = document.getElementById('chitram-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'chitram_sketch_' + Date.now() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initChitramCanvas, 500);
});
