// BharatOS Boot & Initialization
function unlock() {
  const input = document.getElementById('lock-pass');
  if (!input || input.value === '1234' || input.value === '') {
    const lock = document.getElementById('lockscreen');
    if (lock) {
      lock.style.opacity = '0';
      setTimeout(() => { lock.style.display = 'none'; }, 350);
    }
  } else {
    alert('Incorrect passcode! Default is 1234');
    input.value = '';
  }
}

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const topClock = document.getElementById('top-clock');
  const lockClock = document.getElementById('lock-clock');
  
  if (topClock) topClock.textContent = timeStr;
  if (lockClock) lockClock.textContent = timeStr;
}

window.addEventListener('DOMContentLoaded', () => {
  const savedWall = localStorage.getItem('bharatos_wallpaper') || 'wallpapers/ladakh_pangong.jpg';
  setWallpaper(savedWall);
  
  updateClock();
  setInterval(updateClock, 1000);
  
  if (typeof initPaint === 'function') initPaint();
  if (typeof initTerminal === 'function') initTerminal();
  if (typeof initNotes === 'function') initNotes();
  if (typeof initSnake === 'function') initSnake();
});
