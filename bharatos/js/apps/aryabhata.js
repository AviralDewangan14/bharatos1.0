// Aryabhata Scientific Calculator & Function Plotter
let calcExpression = '';

function calcPress(val) {
    calcExpression += val;
    renderCalcDisplay();
}

function calcClear() {
    calcExpression = '';
    renderCalcDisplay();
}

function calcBackspace() {
    calcExpression = calcExpression.slice(0, -1);
    renderCalcDisplay();
}

function calcEvaluate() {
    try {
        const sanitized = calcExpression.replace(/[^0-9+\-*\/().Math.sincostanlogeqrtPIE% ]/g, '');
        const res = Function('"use strict"; return (' + sanitized + ')')();
        calcExpression = String(res);
        renderCalcDisplay();
    } catch (e) {
        const d = document.getElementById('calc-main-display');
        if (d) d.textContent = 'Error';
    }
}

function renderCalcDisplay() {
    const d = document.getElementById('calc-main-display');
    if (d) d.textContent = calcExpression || '0';

    const n = parseInt(calcExpression, 10);
    if (!isNaN(n)) {
        const h = document.getElementById('calc-hex');
        const b = document.getElementById('calc-bin');
        if (h) h.textContent = '0x' + n.toString(16).toUpperCase();
        if (b) b.textContent = '0b' + n.toString(2);
    }
}

function plotGraph() {
    const canvas = document.getElementById('graph-canvas');
    const input = document.getElementById('graph-expression-input');
    if (!canvas || !input) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const expr = input.value;
    const w = canvas.width;
    const h = canvas.height;
    const midX = w / 2;
    const midY = h / 2;

    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY); ctx.lineTo(w, midY);
    ctx.moveTo(midX, 0); ctx.lineTo(midX, h);
    ctx.stroke();

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px < w; px++) {
        const x = (px - midX) / 35;
        try {
            const y = new Function('x', 'return ' + expr)(x);
            const py = midY - (y * 35);
            if (!isNaN(py) && isFinite(py)) {
                if (!started) { ctx.moveTo(px, py); started = true; }
                else { ctx.lineTo(px, py); }
            }
        } catch(e) {}
    }
    ctx.stroke();
}
