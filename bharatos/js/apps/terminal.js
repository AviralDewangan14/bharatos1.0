// Terminal App
let termHistory = [];
let histIndex = -1;

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
    printTermLine('Available commands:');
    printTermLine('  help       - Show this help manual');
    printTermLine('  ls         - List files');
    printTermLine('  cat <file> - Read a file');
    printTermLine('  calc <exp> - Evaluate math expression');
    printTermLine('  date       - Show current date & time');
    printTermLine('  snake      - Launch Snake Arcade');
    printTermLine('  synth      - Launch Synthesizer');
    printTermLine('  about      - Display system info');
    printTermLine('  clear      - Clear terminal screen');
  } else if (base === 'ls') {
    printTermLine('welcome.txt   notes.txt   config.sys   bharatos.img');
  } else if (base === 'cat') {
    const file = parts[1];
    if (file === 'welcome.txt') {
      printTermLine('Welcome to BharatOS 1.0 — A clean web desktop environment.');
    } else if (file === 'notes.txt') {
      const saved = localStorage.getItem('bharatos_notes') || '(empty notes)';
      printTermLine(saved);
    } else {
      printTermLine('File not found: ' + (file || ''));
    }
  } else if (base === 'calc') {
    try {
      const res = eval(parts.slice(1).join(' '));
      printTermLine('= ' + res, '#38bdf8');
    } catch(err) {
      printTermLine('Math error: ' + err.message, '#f87171');
    }
  } else if (base === 'date') {
    printTermLine(new Date().toString());
  } else if (base === 'clear') {
    const body = document.getElementById('term-body');
    if (body) body.innerHTML = '';
  } else if (base === 'snake') {
    openApp('win-snake', 'dock-snake');
  } else if (base === 'synth') {
    openApp('win-synth', 'dock-synth');
  } else if (base === 'about') {
    printTermLine('BharatOS 1.0 by Aviral Dewangan. Built with pure HTML/CSS/JS.');
  } else {
    printTermLine("Command not found: '" + base + "'. Type 'help' for commands.", '#f87171');
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
  
  const scroll = document.getElementById('win-term');
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
}
