// Window Manager — Drag, focus, minimize, maximize, and close
let highestZ = 100;
let activeDrag = null;
let mouseOffset = { x: 0, y: 0 };

function focusWindow(win) {
  if (!win) return;
  highestZ++;
  win.style.zIndex = highestZ;
}

function openApp(id, dockBtnId) {
  const win = document.getElementById(id);
  if (!win) return;
  
  win.style.display = 'flex';
  focusWindow(win);
  
  if (dockBtnId) {
    const btn = document.getElementById(dockBtnId);
    if (btn) btn.classList.add('active');
  }
}

function closeApp(id, dockBtnId, event) {
  if (event) event.stopPropagation();
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';
  
  if (dockBtnId) {
    const btn = document.getElementById(dockBtnId);
    if (btn) btn.classList.remove('active');
  }
}

function minimizeApp(id, dockBtnId, event) {
  if (event) event.stopPropagation();
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';
}

function toggleMax(id, event) {
  if (event) event.stopPropagation();
  const win = document.getElementById(id);
  if (!win) return;
  
  if (win.dataset.max === 'true') {
    win.style.top = win.dataset.origTop || '80px';
    win.style.left = win.dataset.origLeft || '100px';
    win.style.width = win.dataset.origWidth || '640px';
    win.style.height = win.dataset.origHeight || '460px';
    win.dataset.max = 'false';
  } else {
    win.dataset.origTop = win.style.top;
    win.dataset.origLeft = win.style.left;
    win.dataset.origWidth = win.style.width;
    win.dataset.origHeight = win.style.height;
    
    win.style.top = '36px';
    win.style.left = '8px';
    win.style.width = 'calc(100vw - 16px)';
    win.style.height = 'calc(100vh - 100px)';
    win.dataset.max = 'true';
  }
}

function startDrag(e, winId) {
  if (e.target.closest('.window-controls') || e.target.closest('button') || e.target.closest('select')) {
    return;
  }

  const win = document.getElementById(winId);
  if (!win || win.dataset.max === 'true') return;
  
  activeDrag = win;
  focusWindow(win);
  
  const rect = win.getBoundingClientRect();
  mouseOffset.x = e.clientX - rect.left;
  mouseOffset.y = e.clientY - rect.top;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
  if (!activeDrag) return;
  
  let x = e.clientX - mouseOffset.x;
  let y = e.clientY - mouseOffset.y;
  
  x = Math.max(0, Math.min(window.innerWidth - 80, x));
  y = Math.max(34, Math.min(window.innerHeight - 80, y));
  
  activeDrag.style.left = x + 'px';
  activeDrag.style.top = y + 'px';
}

function stopDrag() {
  activeDrag = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}
