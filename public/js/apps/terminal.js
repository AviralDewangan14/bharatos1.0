// Terminal Shell — Rich Command Suite
let termHistory = [];
let histIndex = -1;
let virtualFS = {
  'welcome.txt': 'Welcome to BharatOS 1.0 sovereign desktop environment.\nBuilt from scratch with vanilla web technologies.',
  'system.cfg': 'OS_NAME=BharatOS\nVERSION=1.0.0\nAUTHOR=Aviral Dewangan\nSANDBOX=CLIENT_SIDE',
  'todo.txt': '- Add more terminal utilities\n- Polish canvas drawing tools\n- Test Web Audio synth harmonies'
};
let matrixInterval = null;

function initTerminal() {
  const input = document.getElementById('term-input');
  if (!input) return;
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        termHistory.push(cmd);
        histIndex = termHistory.length;
        handleCommand(cmd);
      }
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      if (histIndex > 0) {
        histIndex--;
        input.value = termHistory[histIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (histIndex < termHistory.length - 1) {
        histIndex++;
        input.value = termHistory[histIndex];
      } else {
        histIndex = termHistory.length;
        input.value = '';
      }
    }
  });
}

function handleCommand(cmd) {
  printTermLine('aviral@bharatos:~$ ' + cmd, '#94a3b8');
  const parts = cmd.split(' ');
  const base = parts[0].toLowerCase();
  
  if (base === 'help') {
    printTermLine('=== BharatOS Terminal Commands ===', '#38bdf8');
    printTermLine('File System:   ls, cat <file>, touch <file>, rm <file>, echo <text> [> file]');
    printTermLine('System Info:   neofetch, uname, whoami, uptime, date, history, about');
    printTermLine('Utilities:     calc <expr>, weather [city], quote, matrix, clear');
    printTermLine('App Launchers: paint, notes, calc, synth, snake, settings, lock');
  } 
  else if (base === 'neofetch' || base === 'sysinfo') {
    printTermLine('       /\\          aviral@bharatos', '#38bdf8');
    printTermLine('      /  \\         -------------------', '#38bdf8');
    printTermLine('     / /\\ \\        OS: BharatOS 1.0 Sovereign', '#e2e8f0');
    printTermLine('    / /  \\ \\       Host: WebAssembly / ES6 Browser Engine', '#e2e8f0');
    printTermLine('   / / /\\ \\ \\      Kernel: Vanilla Client Sandbox', '#e2e8f0');
    printTermLine('  /_/ /__\\ \\_\\     Uptime: ' + Math.floor((Date.now() - performance.timeOrigin) / 1000) + ' seconds', '#e2e8f0');
    printTermLine('                      Shell: BharatOS Interactive Prompt', '#e2e8f0');
    printTermLine('                      Resolution: ' + window.innerWidth + 'x' + window.innerHeight, '#e2e8f0');
    printTermLine('                      Author: Aviral Dewangan', '#38bdf8');
  }
  else if (base === 'ls') {
    const files = Object.keys(virtualFS).join('   ');
    printTermLine(files || '(empty directory)', '#38bdf8');
  }
  else if (base === 'cat') {
    const file = parts[1];
    if (!file) {
      printTermLine('Usage: cat <filename>', '#f87171');
    } else if (virtualFS[file]) {
      printTermLine(virtualFS[file]);
    } else {
      printTermLine("cat: " + file + ": No such file", '#f87171');
    }
  }
  else if (base === 'touch') {
    const file = parts[1];
    if (file) {
      virtualFS[file] = '';
      printTermLine("Created file '" + file + "'", '#34d399');
    }
  }
  else if (base === 'rm') {
    const file = parts[1];
    if (virtualFS[file] !== undefined) {
      delete virtualFS[file];
      printTermLine("Removed file '" + file + "'", '#34d399');
    } else {
      printTermLine("rm: cannot remove '" + file + "': No such file", '#f87171');
    }
  }
  else if (base === 'echo') {
    const full = parts.slice(1).join(' ');
    if (full.includes('>')) {
      const [text, target] = full.split('>').map(s => s.trim());
      virtualFS[target] = text;
      printTermLine("Wrote to " + target, '#34d399');
    } else {
      printTermLine(full);
    }
  }
  else if (base === 'uname') {
    printTermLine('BharatOS 1.0-sovereign x86_64 web-standalone');
  }
  else if (base === 'whoami') {
    printTermLine('aviral (Administrator & Lead Developer)');
  }
  else if (base === 'uptime') {
    const secs = Math.floor((Date.now() - performance.timeOrigin) / 1000);
    printTermLine('System uptime: ' + secs + ' seconds');
  }
  else if (base === 'date') {
    printTermLine(new Date().toString());
  }
  else if (base === 'calc') {
    const expr = parts.slice(1).join(' ');
    try {
      const res = eval(expr);
      printTermLine('= ' + res, '#38bdf8');
    } catch(err) {
      printTermLine('Error evaluating: ' + err.message, '#f87171');
    }
  }
  else if (base === 'weather') {
    const city = parts[1] || 'New Delhi';
    printTermLine('🌤️ Weather for ' + city + ':', '#38bdf8');
    printTermLine('  Condition: Clear Sky (28°C / 82°F)');
    printTermLine('  Humidity: 45% | Wind: 12 km/h NW');
  }
  else if (base === 'quote') {
    const quotes = [
      '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
      '"Digital sovereignty begins with writing code you understand and own." — Aviral Dewangan',
      '"First, solve the problem. Then, write the code." — John Johnson'
    ];
    printTermLine(quotes[Math.floor(Math.random() * quotes.length)], '#fcd34d');
  }
  else if (base === 'matrix') {
    startMatrixEffect();
  }
  else if (base === 'history') {
    termHistory.forEach((h, i) => printTermLine(' ' + (i + 1) + '  ' + h));
  }
  else if (base === 'clear') {
    const body = document.getElementById('term-body');
    if (body) body.innerHTML = '';
  }
  else if (base === 'paint') openApp('win-paint', 'dock-paint');
  else if (base === 'notes') openApp('win-notes', 'dock-notes');
  else if (base === 'synth') openApp('win-synth', 'dock-synth');
  else if (base === 'snake') openApp('win-snake', 'dock-snake');
  else if (base === 'settings') openApp('win-settings', 'dock-settings');
  else if (base === 'lock') {
    const lock = document.getElementById('lockscreen');
    if (lock) { lock.style.display = 'flex'; lock.style.opacity = '1'; }
  }
  else if (base === 'about') {
    printTermLine('BharatOS 1.0 created by Aviral Dewangan (@AviralDewangan14).');
    printTermLine('A sovereign web desktop operating system built with zero external frameworks.');
  }
  else {
    printTermLine("Command not found: '" + base + "'. Type 'help' for a list of commands.", '#f87171');
  }
}

function printTermLine(text, color='#e2e8f0') {
  const body = document.getElementById('term-body');
  if (!body) return;
  const line = document.createElement('div');
  line.className = 'term-line';
  line.style.color = color;
  line.textContent = text;
  body.appendChild(line);
  
  const scroll = document.getElementById('term-scroll') || body;
  scroll.scrollTop = scroll.scrollHeight;
}

function startMatrixEffect() {
  printTermLine('Starting Matrix stream (Press Ctrl+C or clear)...', '#34d399');
  let count = 0;
  if (matrixInterval) clearInterval(matrixInterval);
  matrixInterval = setInterval(() => {
    if (count > 20) { clearInterval(matrixInterval); return; }
    const chars = '01010101010101010101010101010101010101010101';
    let line = '';
    for (let i = 0; i < 40; i++) {
      line += chars[Math.floor(Math.random() * chars.length)] + ' ';
    }
    printTermLine(line, '#10b981');
    count++;
  }, 100);
}
