// Settings App — Wallpaper Switcher
function setWallpaper(src) {
  const bg = document.getElementById('desktop-bg');
  const lockBg = document.getElementById('lockscreen-bg');
  if (bg) {
    bg.style.backgroundImage = `url('${src}')`;
    localStorage.setItem('bharatos_wallpaper', src);
  }
  if (lockBg) {
    lockBg.style.backgroundImage = `url('${src}')`;
  }
}
