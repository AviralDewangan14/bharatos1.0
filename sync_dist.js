const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');
const wallpapersDir = path.join(__dirname, 'wallpapers');
const bharatosDir = path.join(__dirname, 'bharatos');

// Sync wallpapers to public and dist
if (fs.existsSync(wallpapersDir)) {
  copyDir(wallpapersDir, path.join(publicDir, 'wallpapers'));
  copyDir(wallpapersDir, path.join(distDir, 'wallpapers'));
}

// Sync public to dist and root
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, distDir);
  copyDir(publicDir, bharatosDir);
  console.log('Synced assets across public/, dist/, and bharatos/');
}
