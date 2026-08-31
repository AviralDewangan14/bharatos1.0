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

const rootDir = __dirname;
const appDist = path.join(rootDir, 'bharatos-app', 'dist');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');
const bharatosDir = path.join(rootDir, 'bharatos');
const wallpapersDir = path.join(rootDir, 'wallpapers');

// 1. Sync app dist to root dist, public, and bharatos
if (fs.existsSync(appDist)) {
  copyDir(appDist, distDir);
  copyDir(appDist, publicDir);
  copyDir(appDist, bharatosDir);
  if (fs.existsSync(path.join(appDist, 'index.html'))) {
    fs.copyFileSync(path.join(appDist, 'index.html'), path.join(rootDir, 'index.html'));
  }
}

// 2. Sync wallpapers to dist/wallpapers, public/wallpapers, and bharatos-app/dist/wallpapers
if (fs.existsSync(wallpapersDir)) {
  copyDir(wallpapersDir, path.join(distDir, 'wallpapers'));
  copyDir(wallpapersDir, path.join(publicDir, 'wallpapers'));
  copyDir(wallpapersDir, path.join(appDist, 'wallpapers'));
}

console.log('Successfully synchronized production distribution across all directories.');
