// Aryabhata Scientific Calculator & 2D Function Grapher
let aryabhataCurrentExpr = '';

function aryabhataNum(num) {
    aryabhataCurrentExpr += num;
    updateAryabhataDisplay();
}

function aryabhataOp(op) {
    aryabhataCurrentExpr += op;
    updateAryabhataDisplay();
}

function aryabhataClear() {
    aryabhataCurrentExpr = '';
    updateAryabhataDisplay();
}

function aryabhataBackspace() {
    aryabhataCurrentExpr = aryabhataCurrentExpr.slice(0, -1);
    updateAryabhataDisplay();
}

function aryabhataEquals() {
    try {
        const formulaEl = document.getElementById('aryabhata-formula');
        if (formulaEl) formulaEl.textContent = aryabhataCurrentExpr + ' =';

        const sanitized = aryabhataCurrentExpr.replace(/[^0-9+\-*\/().Math.sincostanlogeqrtPIE% ]/g, '');
        const res = Function('"use strict"; return (' + sanitized + ')')();
        
        aryabhataCurrentExpr = String(res);
        updateAryabhataDisplay();
    } catch (e) {
        const disp = document.getElementById('aryabhata-display');
        if (disp) disp.textContent = 'Error';
    }
}

function updateAryabhataDisplay() {
    const disp = document.getElementById('aryabhata-display');
    if (disp) disp.textContent = aryabhataCurrentExpr || '0';

    const numVal = parseInt(aryabhataCurrentExpr, 10);
    if (!isNaN(numVal)) {
        document.getElementById('ary-hex').textContent = '0x' + numVal.toString(16).toUpperCase();
        document.getElementById('ary-dec').textContent = numVal.toString(10);
        document.getElementById('ary-bin').textContent = '0b' + numVal.toString(2);
        document.getElementById('ary-oct').textContent = '0o' + numVal.toString(8);
    }
}

function switchAryabhataTab(tab) {
    const calcView = document.getElementById('aryabhata-calc-view');
    const graphView = document.getElementById('aryabhata-graph-view');
    const tabCalc = document.getElementById('tab-ary-calc');
    const tabGraph = document.getElementById('tab-ary-graph');

    if (tab === 'calc') {
        if (calcView) calcView.classList.remove('hidden');
        if (graphView) graphView.classList.add('hidden');
        if (tabCalc) tabCalc.className = 'flex-1 py-2 text-center font-bold text-indigo-400 border-b-2 border-indigo-400';
        if (tabGraph) tabGraph.className = 'flex-1 py-2 text-center text-slate-400 hover:text-slate-200';
    } else {
        if (calcView) calcView.classList.add('hidden');
        if (graphView) graphView.classList.remove('hidden');
        if (tabGraph) tabGraph.className = 'flex-1 py-2 text-center font-bold text-indigo-400 border-b-2 border-indigo-400';
        if (tabCalc) tabCalc.className = 'flex-1 py-2 text-center text-slate-400 hover:text-slate-200';
        plotAryabhataGraph();
    }
}

function plotAryabhataGraph() {
    const canvas = document.getElementById('aryabhata-graph-canvas');
    const funcInput = document.getElementById('graph-func-input');
    if (!canvas || !funcInput) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const expr = funcInput.value;
    const w = canvas.width;
    const h = canvas.height;
    const midX = w / 2;
    const midY = h / 2;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Draw Grid Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY); ctx.lineTo(w, midY);
    ctx.moveTo(midX, 0); ctx.lineTo(midX, h);
    ctx.stroke();

    // Plot Function f(x)
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px < w; px++) {
        const x = (px - midX) / 35;
        try {
            const fn = new Function('x', 'return ' + expr);
            const y = fn(x);
            const py = midY - (y * 35);

            if (!isNaN(py) && isFinite(py)) {
                if (!started) {
                    ctx.moveTo(px, py);
                    started = true;
                } else {
                    ctx.lineTo(px, py);
                }
            }
        } catch (err) {}
    }
    ctx.stroke();
}
