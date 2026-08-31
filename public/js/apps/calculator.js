// Calculator App — Simple, reliable, with keyboard support
let calcInput = '';

function calcAdd(char) {
  calcInput += char;
  updateCalcDisplay();
}

function calcClear() {
  calcInput = '';
  updateCalcDisplay();
}

function calcDelete() {
  calcInput = calcInput.slice(0, -1);
  updateCalcDisplay();
}

function calcEquals() {
  try {
    const clean = calcInput.replace(/[^0-9+\-*\/().Math.sqrtPIE% ]/g, '');
    const res = Function('"use strict"; return (' + clean + ')')();
    calcInput = String(res);
    updateCalcDisplay();
  } catch (e) {
    const display = document.getElementById('calc-display');
    if (display) display.textContent = 'Error';
  }
}

function updateCalcDisplay() {
  const display = document.getElementById('calc-display');
  if (display) {
    display.textContent = calcInput || '0';
  }
}

window.addEventListener('keydown', (e) => {
  const calcWin = document.getElementById('win-calc');
  if (!calcWin || calcWin.style.display === 'none') return;
  
  if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
    calcAdd(e.key);
  } else if (e.key === 'Enter') {
    calcEquals();
  } else if (e.key === 'Backspace') {
    calcDelete();
  } else if (e.key === 'Escape') {
    calcClear();
  }
});
