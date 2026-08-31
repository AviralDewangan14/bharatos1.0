// Main Application Entry & Profile Menu Handler
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

function lockDesktop() {
  const lock = document.getElementById('lockscreen');
  const profileMenu = document.getElementById('dock-profile-menu');
  if (profileMenu) profileMenu.classList.add('hidden');
  if (lock) {
    lock.style.display = 'flex';
    setTimeout(() => { lock.style.opacity = '1'; }, 20);
  }
}

function toggleProfileMenu(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('dock-profile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Close Profile Menu on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('#dock-profile-menu') && !e.target.closest('#dock-profile-btn')) {
    const menu = document.getElementById('dock-profile-menu');
    if (menu) menu.classList.add('hidden');
  }
});

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
  // Load separate wallpapers for Home vs Lock screen
  const savedHomeWall = localStorage.getItem('bharatos_home_wallpaper') || 'wallpapers/ladakh_pangong.jpg';
  const savedLockWall = localStorage.getItem('bharatos_lock_wallpaper') || 'wallpapers/varanasi_dawn.jpg';
  
  if (typeof setHomeWallpaper === 'function') setHomeWallpaper(savedHomeWall);
  if (typeof setLockWallpaper === 'function') setLockWallpaper(savedLockWall);

  const savedAccent = localStorage.getItem('bharatos_accent');
  if (savedAccent && typeof setAccentColor === 'function') setAccentColor(savedAccent);

  updateClock();
  setInterval(updateClock, 1000);
  
  if (typeof initTerminal === 'function') initTerminal();
  if (typeof initNotes === 'function') initNotes();
  if (typeof initPaint === 'function') initPaint();
  if (typeof initSnake === 'function') initSnake();
});
