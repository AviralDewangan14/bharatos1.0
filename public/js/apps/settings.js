// Settings App — Independent Home Screen & Lock Screen Wallpaper Engine
let selectedTarget = 'home'; // 'home', 'lock', or 'both'

function setTargetScreen(target) {
  selectedTarget = target;
  document.getElementById('target-btn-home')?.classList.toggle('bg-cyan-500/30', target === 'home');
  document.getElementById('target-btn-home')?.classList.toggle('text-cyan-300', target === 'home');
  document.getElementById('target-btn-lock')?.classList.toggle('bg-cyan-500/30', target === 'lock');
  document.getElementById('target-btn-lock')?.classList.toggle('text-cyan-300', target === 'lock');
  document.getElementById('target-btn-both')?.classList.toggle('bg-cyan-500/30', target === 'both');
  document.getElementById('target-btn-both')?.classList.toggle('text-cyan-300', target === 'both');
}

function applyWallpaper(src) {
  if (selectedTarget === 'home' || selectedTarget === 'both') {
    setHomeWallpaper(src);
  }
  if (selectedTarget === 'lock' || selectedTarget === 'both') {
    setLockWallpaper(src);
  }
}

function setHomeWallpaper(src) {
  const bg = document.getElementById('desktop-bg');
  if (bg) {
    bg.style.backgroundImage = `url('${src}')`;
    localStorage.setItem('bharatos_home_wallpaper', src);
  }
}

function setLockWallpaper(src) {
  const lockBg = document.getElementById('lockscreen-bg');
  if (lockBg) {
    lockBg.style.backgroundImage = `url('${src}')`;
    localStorage.setItem('bharatos_lock_wallpaper', src);
  }
}

function switchSettingsTab(tabName) {
  ['wallpapers', 'about', 'display'].forEach(t => {
    const pane = document.getElementById(`settings-tab-${t}`);
    const navBtn = document.getElementById(`settings-nav-${t}`);
    if (pane) pane.classList.toggle('hidden', t !== tabName);
    if (navBtn) {
      navBtn.classList.toggle('bg-cyan-500/20', t === tabName);
      navBtn.classList.toggle('text-cyan-300', t === tabName);
      navBtn.classList.toggle('font-bold', t === tabName);
    }
  });
}

function setAccentColor(hex) {
  document.documentElement.style.setProperty('--accent-cyan', hex);
  localStorage.setItem('bharatos_accent', hex);
}
