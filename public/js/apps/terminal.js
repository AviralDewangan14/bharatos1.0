// Web Terminal — Interactive command shell
const terminalHistory = [];
let historyIndex = -1;

const FS = {
  'welcome.txt': 'Welcome to BharatOS 1.0! Developed with love by Aviral Dewangan.',
  'kernel.c': 'void kmain() { init_gdt(); init_idt(); init_vga(); printk("BharatOS kernel online."); }',
  'todo.txt': '1. Test Web Audio Synthesizer\n2. Draw artwork in Paint\n3. Beat high score in Snake'
};

function initTerminal() {
  const input = document.getElementById('term-input');
  if (!input) return;
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      input.value = '';
      if (cmd) {
        terminalHistory.push(cmd);
        historyIndex = terminalHistory.length;
        handleCommand(cmd);
      }
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = terminalHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < terminalHistory.length - 1) {
        historyIndex++;
        input.value = terminalHistory[historyIndex];
      } else {
        historyIndex = terminalHistory.length;
        input.value = '';
      }
    }
  });
}

function appendTermOutput(text, isHtml = false) {
  const body = document.getElementById('term-body');
  if (!body) return;
  
  const div = document.createElement('div');
  div.className = 'term-line mb-1';
  if (isHtml) div.innerHTML = text;
  else div.textContent = text;
  body.appendChild(div);
  
  const win = document.getElementById('term-scroll');
  if (win) win.scrollTop = win.scrollHeight;
}

function handleCommand(raw) {
  appendTermOutput(`aviral@bharatos:~$ ${raw}`);
  const parts = raw.split(' ');
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  switch (cmd) {
    case 'help':
      appendTermOutput('Available commands:\n  help       - Show this command list\n  ls         - List files\n  cat <file> - View file contents\n  calc <exp> - Evaluate mathematical expression\n  date       - Show current date & time\n  clear      - Clear terminal window\n  snake      - Launch Snake Arcade game\n  synth      - Open Web Audio Synthesizer\n  about      - System & developer info');
      break;

    case 'ls':
      appendTermOutput(Object.keys(FS).join('    '));
      break;

    case 'cat':
      if (!arg) appendTermOutput('Usage: cat <filename>');
      else if (FS[arg]) appendTermOutput(FS[arg]);
      else appendTermOutput(`cat: ${arg}: No such file`);
      break;

    case 'calc':
      try {
        const clean = arg.replace(/[^0-9+\-*\/().Math.sincoPIE% ]/g, '');
        const res = Function('"use strict"; return (' + clean + ')')();
        appendTermOutput(`Result: ${res}`);
      } catch(e) {
        appendTermOutput('Error evaluating math expression.');
      }
      break;

    case 'date':
      appendTermOutput(new Date().toString());
      break;

    case 'clear':
      const body = document.getElementById('term-body');
      if (body) body.innerHTML = '';
      break;

    case 'snake':
      openApp('win-snake', 'dock-snake');
      appendTermOutput('Launched Snake game.');
      break;

    case 'synth':
      openApp('win-synth', 'dock-synth');
      appendTermOutput('Launched Web Audio Synthesizer.');
      break;

    case 'about':
      appendTermOutput('☸️ BharatOS 1.0\nDeveloper: Aviral Dewangan (@AviralDewangan14)\nArchitecture: 100% Client-Side Vanilla ES6 & Web APIs\nZero External Telemetry.');
      break;

    default:
      appendTermOutput(`command not found: ${cmd}. Type 'help' for options.`);
  }
}
