// Main Application Entry & Clock
function unlock() {
  const input = document.getElementById('lock-pass');
  if (!input || input.value === '1234' || input.value === '') {
    const lock = document.getElementById('lockscreen');
    if (lock) {
      lock.style.opacity = '0';
      setTimeout(() => { lock.style.display = 'none'; }, 300);
    }
  } else {
    alert('Incorrect passcode! Try 1234');
    input.value = '';
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
}

window.addEventListener('DOMContentLoaded', () => {
  setWallpaper('wallpapers/ladakh_pangong.jpg');
  setInterval(updateClock, 1000);
  updateClock();
  
  initTerminal();
  initNotes();
  initPaint();
  initSnake();
});
