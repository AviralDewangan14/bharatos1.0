// Calculator App
let calcExpr = '';

function calcAdd(val) {
  const disp = document.getElementById('calc-display');
  if (calcExpr === '0' && val !== '.') calcExpr = '';
  calcExpr += val;
  if (disp) disp.textContent = calcExpr;
}

function calcClear() {
  calcExpr = '0';
  const disp = document.getElementById('calc-display');
  if (disp) disp.textContent = '0';
}

function calcEquals() {
  const disp = document.getElementById('calc-display');
  try {
    calcExpr = String(eval(calcExpr));
    if (disp) disp.textContent = calcExpr;
  } catch(err) {
    if (disp) disp.textContent = 'Error';
    calcExpr = '0';
  }
}

window.addEventListener('keydown', (e) => {
  const win = document.getElementById('win-calc');
  if (!win || win.style.display === 'none') return;
  
  if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
    calcAdd(e.key);
  } else if (e.key === 'Enter') {
    calcEquals();
  } else if (e.key === 'Backspace' || e.key === 'Escape') {
    calcClear();
  }
});
