// Main Application Entry, Widgets & Lockscreen Handler
function unlock() {
  const input = document.getElementById('lock-pass');
  if (!input || input.value === '1234' || input.value === '') {
    const lock = document.getElementById('lockscreen');
    if (lock) {
      lock.style.opacity = '0';
      setTimeout(() => { lock.style.display = 'none'; }, 400);
    }
  } else {
    alert('Incorrect passcode! Try 1234');
    input.value = '';
  }
}

function setWallpaper(src) {
  const bg = document.getElementById('desktop-bg');
  if (bg) {
    bg.style.backgroundImage = `url('${src}')`;
  }
}

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  
  const topClock = document.getElementById('top-clock');
  if (topClock) topClock.textContent = timeStr;
  
  const lockClock = document.getElementById('lock-clock');
  if (lockClock) lockClock.textContent = timeStr;
  
  const lockDate = document.getElementById('lock-date');
  if (lockDate) lockDate.textContent = dateStr;

  const widgetDate = document.getElementById('widget-date');
  if (widgetDate) widgetDate.textContent = dateStr;
}

function updateSystemResourceWidget() {
  // Realistic simulated CPU / Memory telemetry
  const cpuEl = document.getElementById('widget-cpu-text');
  const cpuBar = document.getElementById('widget-cpu-bar');
  const ramEl = document.getElementById('widget-ram-text');
  const ramBar = document.getElementById('widget-ram-bar');

  const randCpu = Math.floor(8 + Math.random() * 12);
  const randRam = (1.4 + Math.random() * 0.2).toFixed(1);

  if (cpuEl) cpuEl.textContent = `${randCpu}%`;
  if (cpuBar) cpuBar.style.width = `${randCpu * 3}%`;
  if (ramEl) ramEl.textContent = `${randRam} GB / 8.0 GB`;
  if (ramBar) ramBar.style.width = `${(randRam / 8.0) * 100}%`;
}

window.addEventListener('DOMContentLoaded', () => {
  setWallpaper('wallpapers/ladakh_pangong.jpg');
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(updateSystemResourceWidget, 3000);
  updateSystemResourceWidget();
  
  if (typeof initTerminal === 'function') initTerminal();
  if (typeof initNotes === 'function') initNotes();
  if (typeof initPaint === 'function') initPaint();
  if (typeof initSnake === 'function') initSnake();
});
