// Settings App — Multi-tab Settings, About System, and Wallpaper Persistence
function setWallpaper(src) {
  const bg = document.getElementById('desktop-bg');
  if (bg) {
    bg.style.backgroundImage = `url('${src}')`;
    localStorage.setItem('bharatos_wallpaper', src);
  }
  
  document.querySelectorAll('.wallpaper-btn').forEach(btn => {
    btn.classList.toggle('border-cyan-400', btn.dataset.src === src);
    btn.classList.toggle('ring-2', btn.dataset.src === src);
    btn.classList.toggle('ring-cyan-400/40', btn.dataset.src === src);
  });
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
