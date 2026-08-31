// Settings App — Wallpapers and Appearance
function setWallpaper(src) {
  const bg = document.getElementById('desktop-bg');
  if (bg) {
    bg.style.backgroundImage = `url('${src}')`;
  }
}
