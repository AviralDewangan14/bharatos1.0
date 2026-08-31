const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
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

// Copy public to dist
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, distDir);
  console.log('Synced public/ -> dist/');
}
