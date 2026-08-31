# BharatOS & GenAz Ecosystem

An independent open-source desktop operating system in the browser along with a native standalone programming language (`GenAz`), built by **Aviral Dewangan**.

---

## 🌟 Overview

This repository hosts two core projects:

1. **BharatOS (`bharatos-app/`)**: A functional web-based desktop environment built with React 18, TypeScript, Vite, Tailwind CSS, and Zustand. It features an IndexedDB virtual filesystem, draggable/resizable window manager, terminal with shell execution, multi-app registry, and i18n support.
2. **GenAz (`genaz/`)**: A native compiled programming language with its own tokenizer, recursive-descent AST parser, Hindley-Milner type inference, stack bytecode compiler, binary `.gbc` format, and virtual machine with green threads, channels, and 80+ standard library functions.

---

## 🖥️ BharatOS Web Desktop

BharatOS is designed as a modular desktop environment that runs client-side in any modern browser without external cloud dependencies.

### Core Features

- **Window Management**: Custom drag, resize, z-index elevation, minimize/maximize animations, and focus tracking implemented with Zustand (`windowStore.ts`).
- **IndexedDB Virtual Filesystem**: Persistent hierarchy (`/home`, `/home/Documents`, `/home/Downloads`, etc.) supporting `createFile`, `createDir`, `readFile`, `writeFile`, `rename`, `move`, `copy`, and path normalization (`services/filesystem.ts`).
- **Terminal Shell**: Interactive command line supporting standard utilities (`ls`, `cd`, `pwd`, `cat`, `touch`, `mkdir`, `rm`, `cp`, `mv`, `echo`, `date`, `whoami`, `neofetch`, `history`).
- **Safe Calculator**: Arithmetic evaluator built using a hand-crafted recursive descent parser (`parser.ts`) without `eval()` or `Function()` calls.
- **Notes App**: Multi-document scratchpad with autosaving to `~/Documents`.
- **System Settings**: Theme switcher, accent colors (saffron, emerald, royal blue), wallpaper selector, and language toggle (English / Hindi).
- **Web Audio Synth**: Interactive keyboard synthesizer powered by the native Web Audio API.
- **System Monitor & App Store**: Live session metrics, storage estimation, and application catalogue.

### Project Structure (BharatOS)

```text
bharatos-app/
├── src/
│   ├── apps/               # Built-in applications
│   │   ├── files/          # FilesApp (IndexedDB file explorer)
│   │   ├── terminal/       # TerminalApp (command shell emulator)
│   │   ├── notes/          # NotesApp (editor with auto-save)
│   │   ├── calculator/     # CalculatorApp & safe parser
│   │   ├── settings/       # SettingsApp (themes, wallpapers, i18n)
│   │   ├── browser/        # BrowserApp (sandboxed web viewer)
│   │   ├── app-store/      # AppStoreApp (installed registry viewer)
│   │   ├── gallery/        # GalleryApp (scenic image viewer)
│   │   ├── music/          # MusicApp (Web Audio synthesizer)
│   │   └── system-monitor/ # SystemMonitorApp (session & memory stats)
│   ├── components/         # Shell UI (Window, Desktop, Taskbar, Launcher, LockScreen)
│   ├── hooks/              # Custom interaction hooks (useDrag, useResize, useContextMenu)
│   ├── i18n/               # Localization dictionaries (English, Hindi)
│   ├── services/           # Filesystem (IndexedDB) & Shell parser
│   ├── stores/             # Zustand stores (windows, settings, notifications, desktop)
│   ├── styles/             # Tailwind v4 globals
│   └── types/              # Strict TypeScript definitions
├── public/
│   └── wallpapers/         # Desktop background images
└── package.json
```

### Running BharatOS Locally

```bash
# Clone repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# Install dependencies and launch dev server
cd bharatos-app
npm install
npm run dev
```

Open `http://localhost:3000` to view the desktop.

---

## ⚡ GenAz Programming Language

`GenAz` is an independent programming language built from scratch in Python with a focus on simplicity, concurrency, and fast bytecode execution.

### Toolchain

- **CLI**: `python genaz/src/main.py [run|build|check|dis|ast|tokens|repl|gui]`
- **Bytecode Compiler**: Emits `.gbc` binary files.
- **Virtual Machine**: Stack-based execution engine with preemptive coroutines, typed channels, and math/string/file built-ins.
- **IDE**: Native graphical code editor with syntax highlighting (`python genaz/src/main.py gui`).

### Running GenAz Examples

```bash
# Run Fibonacci example
python genaz/src/main.py run genaz/examples/02_fibonacci.gaz

# Run Concurrency with channels & green threads
python genaz/src/main.py run genaz/examples/03_concurrency.gaz

# Launch the interactive REPL
python genaz/src/main.py repl

# Launch the native Desktop IDE
python genaz/src/main.py gui
```

---

## 🛠️ Tech Stack & Decisions

- **React 18 + TypeScript**: Type safety across windows, filesystem nodes, and app lifecycle state.
- **Tailwind CSS v4**: Minimal overhead styling with a deep slate/charcoal palette and warm saffron accents.
- **Zustand**: Fast state stores without boilerplate or context provider re-render issues.
- **IndexedDB**: Real local storage persistence for virtual files, surviving page refreshes.
- **Lucide Icons**: Crisp vector icons throughout window chrome, launcher, and system dock.

---

## 👤 Author

**Aviral Dewangan**  
- GitHub: [@AviralDewangan14](https://github.com/AviralDewangan14)  
- Email: aviral.dewangan14@gmail.com
