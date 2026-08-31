import { useSettingsStore } from '../stores/settingsStore';
import { 
  resolvePath, listDir, createFile, createDir, 
  readFile, writeFile, deleteNode, copyNode, moveNode, stat
} from './filesystem';

const commandHistory: string[] = [];

const parseArgs = (input: string): string[] => {
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  const args: string[] = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    args.push(match[1] || match[2] || match[0]);
  }
  return args;
};

export const executeCommand = async (input: string, cwd: string): Promise<{ output: string; newCwd: string }> => {
  if (!input.trim()) return { output: '', newCwd: cwd };
  
  commandHistory.push(input);
  const args = parseArgs(input);
  const cmd = args[0].toLowerCase();

  try {
    switch (cmd) {
      case 'help':
        return {
          output: `Available commands:
  help    - Show this help
  clear   - Clear terminal
  pwd     - Print working directory
  ls      - List directory contents (ls [-l] [path])
  cd      - Change directory
  mkdir   - Create directory
  touch   - Create file
  cat     - Read file
  echo    - Print text (supports > and >> for files)
  rm      - Remove file or directory (rm [-r] path)
  cp      - Copy node (cp src dst)
  mv      - Move node (mv src dst)
  whoami  - Print current user
  date    - Print current date
  uname   - Print system info
  history - Show command history
  neofetch- Display system info in ASCII`,
          newCwd: cwd
        };

      case 'pwd':
        return { output: cwd, newCwd: cwd };

      case 'whoami':
        return { output: useSettingsStore.getState().userName || 'user', newCwd: cwd };

      case 'date':
        return { output: new Date().toString(), newCwd: cwd };

      case 'uname':
        return { output: 'BharatOS 1.0.0 x86_64', newCwd: cwd };

      case 'history':
        return { output: commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n'), newCwd: cwd };

      case 'neofetch':
        const user = useSettingsStore.getState().userName;
        const fetchOutput = `
   .-------.        ${user}@BharatOS
 .'         '.      ----------------
/   O     O   \\     OS: BharatOS 1.0.0
|   .-------.   |    Kernel: Web 1.0
 \\  '-------'  /     Uptime: ${Math.floor(performance.now() / 1000)}s
  '.         .'      Packages: 12 (idb)
    '-------'        Shell: bsh
                     Resolution: ${window.innerWidth}x${window.innerHeight}
        `;
        return { output: fetchOutput, newCwd: cwd };

      case 'cd': {
        const target = args[1] || '/home';
        const newDir = resolvePath(target, cwd);
        const stats = await stat(newDir).catch(() => null);
        if (!stats) return { output: `cd: ${target}: No such file or directory`, newCwd: cwd };
        if (stats.type !== 'directory') return { output: `cd: ${target}: Not a directory`, newCwd: cwd };
        return { output: '', newCwd: newDir };
      }

      case 'ls': {
        const isLong = args[1] === '-l';
        const targetPath = resolvePath(isLong ? (args[2] || '.') : (args[1] || '.'), cwd);
        const nodes = await listDir(targetPath);
        
        if (isLong) {
          if (nodes.length === 0) return { output: 'Total 0', newCwd: cwd };
          const out = nodes.map(n => {
            const date = new Date(n.modifiedAt).toLocaleString();
            const type = n.type === 'directory' ? 'd' : '-';
            return `${type}rw-r--r-- 1 root root ${n.size?.toString().padStart(5) || '    0'} ${date} ${n.name}`;
          }).join('\n');
          return { output: out, newCwd: cwd };
        }
        
        return { output: nodes.map(n => n.name).join('  '), newCwd: cwd };
      }

      case 'mkdir': {
        if (!args[1]) return { output: 'mkdir: missing operand', newCwd: cwd };
        await createDir(resolvePath(args[1], cwd));
        return { output: '', newCwd: cwd };
      }

      case 'touch': {
        if (!args[1]) return { output: 'touch: missing operand', newCwd: cwd };
        await createFile(resolvePath(args[1], cwd));
        return { output: '', newCwd: cwd };
      }

      case 'cat': {
        if (!args[1]) return { output: 'cat: missing operand', newCwd: cwd };
        const content = await readFile(resolvePath(args[1], cwd));
        return { output: content, newCwd: cwd };
      }

      case 'echo': {
        const redirectIdx = args.findIndex(a => a === '>' || a === '>>');
        if (redirectIdx > -1) {
          const text = args.slice(1, redirectIdx).join(' ');
          const file = args[redirectIdx + 1];
          const mode = args[redirectIdx];
          if (!file) return { output: 'echo: syntax error near unexpected token `newline`', newCwd: cwd };
          
          const targetPath = resolvePath(file, cwd);
          if (mode === '>>') {
            const existing = await readFile(targetPath).catch(() => '');
            await writeFile(targetPath, existing + text + '\n');
          } else {
            await writeFile(targetPath, text + '\n');
          }
          return { output: '', newCwd: cwd };
        }
        return { output: args.slice(1).join(' '), newCwd: cwd };
      }

      case 'rm': {
        const isRecursive = args[1] === '-r' || args[1] === '-rf';
        const target = isRecursive ? args[2] : args[1];
        if (!target) return { output: 'rm: missing operand', newCwd: cwd };
        
        const p = resolvePath(target, cwd);
        const stats = await stat(p).catch(() => null);
        if (!stats) return { output: `rm: cannot remove '${target}': No such file or directory`, newCwd: cwd };
        if (stats.type === 'directory' && !isRecursive) {
          return { output: `rm: cannot remove '${target}': Is a directory`, newCwd: cwd };
        }
        await deleteNode(p);
        return { output: '', newCwd: cwd };
      }

      case 'cp': {
        if (args.length < 3) return { output: 'cp: missing operand', newCwd: cwd };
        await copyNode(resolvePath(args[1], cwd), resolvePath(args[2], cwd));
        return { output: '', newCwd: cwd };
      }

      case 'mv': {
        if (args.length < 3) return { output: 'mv: missing operand', newCwd: cwd };
        await moveNode(resolvePath(args[1], cwd), resolvePath(args[2], cwd));
        return { output: '', newCwd: cwd };
      }

      default:
        // Clear is usually handled by the terminal component itself 
        // to reset the local UI state, but we'll return an empty string here
        if (cmd === 'clear') {
          return { output: '', newCwd: cwd };
        }
        return { output: `bsh: command not found: ${cmd}`, newCwd: cwd };
    }
  } catch (err: any) {
    return { output: `${cmd}: ${err.message}`, newCwd: cwd };
  }
};
