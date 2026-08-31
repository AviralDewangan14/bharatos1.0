// Window Manager — Drag, z-index elevation, minimize, maximize, and close
let topZIndex = 100;
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };

function bringToFront(win) {
    topZIndex += 1;
    win.style.zIndex = topZIndex;
}

function openWindow(winId, dockId) {
    const win = document.getElementById(winId);
    if (!win) return;

    win.style.display = 'flex';
    bringToFront(win);

    if (dockId) {
        const dockBtn = document.getElementById(dockId);
        if (dockBtn) dockBtn.classList.add('active');
    }
}

function closeWindow(winId, dockId) {
    const win = document.getElementById(winId);
    if (!win) return;
    win.style.display = 'none';

    if (dockId) {
        const dockBtn = document.getElementById(dockId);
        if (dockBtn) dockBtn.classList.remove('active');
    }
}

function minimizeWindow(winId, dockId) {
    const win = document.getElementById(winId);
    if (!win) return;
    win.style.display = 'none';
}

function toggleMaximize(winId) {
    const win = document.getElementById(winId);
    if (!win) return;

    if (win.dataset.maximized === 'true') {
        win.style.top = win.dataset.prevTop || '80px';
        win.style.left = win.dataset.prevLeft || '120px';
        win.style.width = win.dataset.prevWidth || '760px';
        win.style.height = win.dataset.prevHeight || '520px';
        win.dataset.maximized = 'false';
    } else {
        win.dataset.prevTop = win.style.top;
        win.dataset.prevLeft = win.style.left;
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;

        win.style.top = '42px';
        win.style.left = '8px';
        win.style.width = 'calc(100vw - 16px)';
        win.style.height = 'calc(100vh - 110px)';
        win.dataset.maximized = 'true';
    }
}

function initWindowDrag(e, winId) {
    const win = document.getElementById(winId);
    if (!win || win.dataset.maximized === 'true') return;

    draggedWindow = win;
    bringToFront(win);

    const rect = win.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    document.addEventListener('mousemove', onWindowDrag);
    document.addEventListener('mouseup', stopWindowDrag);
}

function onWindowDrag(e) {
    if (!draggedWindow) return;
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
    newY = Math.max(38, Math.min(window.innerHeight - 80, newY));

    draggedWindow.style.left = `${newX}px`;
    draggedWindow.style.top = `${newY}px`;
}

function stopWindowDrag() {
    draggedWindow = null;
    document.removeEventListener('mousemove', onWindowDrag);
    document.removeEventListener('mouseup', stopWindowDrag);
}
