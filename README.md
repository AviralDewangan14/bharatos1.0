# BharatOS

A browser-based desktop environment built with React 18, TypeScript, Vite, Tailwind CSS, Zustand, and IndexedDB.

I built BharatOS to see how far a desktop operating system paradigm could be pushed inside standard web browsers without relying on server-side runtimes, Electron, or cloud backends. Everything—from window management and file storage to terminal command parsing—runs entirely client-side.

---

## Architecture & How It Works

### Window Management (`src/components/Window.tsx`, `src/stores/windowStore.ts`)
The window manager handles window state, coordinates, dimensions, and z-index ordering.
- **Drag & Resize**: Implemented via custom hooks (`useDrag`, `useResize`) that attach global `mousemove` and `mouseup` listeners to the document during interaction, ensuring smooth movement even if the cursor leaves the window bounds.
- **Z-Index Stacking**: Clicking a window focuses it and increments its `zIndex` in `windowStore`. Zustand allows isolated state updates so dragging one window does not cause unnecessary re-renders across the entire component tree.
- **Window States**: Supports minimize (dock badge), maximize (snaps to screen bounds minus the 48px taskbar), and restore to previous coordinates.

### Virtual Filesystem (`src/services/filesystem.ts`)
The filesystem is a hierarchical tree stored locally in the browser via IndexedDB (`idb`).
- **Initialization**: On first boot, the system initializes `/home`, `/home/Desktop`, `/home/Documents`, `/home/Downloads`, `/home/Pictures`, `/home/Music`, `/home/Videos`, and `/home/Trash`.
- **API**: Provides standard async operations: `createFile`, `createDir`, `readFile`, `writeFile`, `rename`, `moveNode`, `copyNode`, `deleteNode`, and `listDir`.
- **Path Resolution**: Handles relative paths, current directory (`.`), and parent directory (`..`) traversal.
- **Persistence**: File edits in Notes, terminal manipulations, and file explorer operations persist across page reloads.

### Terminal & Shell Service (`src/apps/terminal/TerminalApp.tsx`, `src/services/shell.ts`)
The terminal emulator connects directly to the virtual filesystem service:
- **Command Parser**: Splits input strings while respecting double-quoted arguments.
- **Built-in Commands**: `ls` (with `-l` flag), `cd`, `pwd`, `cat`, `touch`, `mkdir`, `rm` (`-r`), `cp`, `mv`, `echo` (with `>` and `>>` file redirection), `date`, `whoami`, `neofetch`, `history`, `help`, `clear`.
- **Input History**: Maintains an internal command buffer navigable via the Up/Down arrow keys.

### Expression Parser (`src/apps/calculator/parser.ts`)
The Calculator avoids `eval()` and `new Function()` for security. Instead, it evaluates expressions using a small recursive descent parser with precedence climbing:
- Handles operator precedence: exponentiation (`^`) > multiplication/division/modulo (`*`, `/`, `%`) > addition/subtraction (`+`, `-`).
- Supports unary negation, floating-point decimals, and parenthetical sub-expressions.

### System Settings & i18n (`src/apps/settings/SettingsApp.tsx`, `src/i18n/`)
- **Themes & Accents**: Supports dark/light modes and customizable accent colors (saffron, emerald, royal blue, crimson).
- **Internationalization**: Full dictionary translations for English (`en.ts`) and Hindi (`hi.ts`). Switching language updates UI labels instantly through a reactive `t(key)` helper.

---

## Built-in Applications

1. **Files (`src/apps/files/FilesApp.tsx`)**: File explorer with folder navigation, breadcrumbs, grid/list views, and delete-to-trash actions.
2. **Terminal (`src/apps/terminal/TerminalApp.tsx`)**: Shell emulator hooked into the virtual filesystem.
3. **Notes (`src/apps/notes/NotesApp.tsx`)**: Multi-document scratchpad with debounced autosaving to `~/Documents`.
4. **Calculator (`src/apps/calculator/CalculatorApp.tsx`)**: Safe arithmetic calculator with history log.
5. **Settings (`src/apps/settings/SettingsApp.tsx`)**: Personalize wallpaper, accent color, theme, and language.
6. **Browser (`src/apps/browser/BrowserApp.tsx`)**: Sandboxed iframe browser with address bar, history stack, and bookmarks *(Note: external websites setting `X-Frame-Options: DENY` or restrictive CSP headers cannot be embedded)*.
7. **App Store (`src/apps/app-store/AppStoreApp.tsx`)**: Registry catalog showing installed system utilities.
8. **Gallery (`src/apps/gallery/GalleryApp.tsx`)**: Scenic wallpaper photo viewer with fullscreen modal.
9. **Music (`src/apps/music/MusicApp.tsx`)**: Web Audio API synthesizer with clickable piano keys and selectable oscillator waveforms (sine, square, triangle, sawtooth).
10. **System Monitor (`src/apps/system-monitor/SystemMonitorApp.tsx`)**: Session uptime, open window counter, and IndexedDB storage estimator.

---

## Project Structure

```text
bharatos-app/
├── src/
│   ├── apps/               # Built-in applications
│   │   ├── app-store/
│   │   ├── browser/
│   │   ├── calculator/
│   │   ├── files/
│   │   ├── gallery/
│   │   ├── music/
│   │   ├── notes/
│   │   ├── settings/
│   │   ├── system-monitor/
│   │   ├── terminal/
│   │   └── index.ts        # Central app registry setup
│   ├── components/         # Desktop shell components
│   │   ├── ContextMenu.tsx
│   │   ├── Desktop.tsx
│   │   ├── Launcher.tsx
│   │   ├── LockScreen.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── Taskbar.tsx
│   │   └── Window.tsx
│   ├── hooks/              # Custom hooks (useDrag, useResize, useContextMenu)
│   ├── i18n/               # Language dictionaries (en, hi)
│   ├── services/           # IndexedDB Virtual Filesystem & Shell Parser
│   ├── stores/             # Zustand stores (windowStore, desktopStore, settingsStore, notificationStore)
│   ├── styles/             # Tailwind CSS v4 entry
│   ├── types/              # TypeScript interface definitions
│   ├── App.tsx             # Root desktop layout
│   └── main.tsx            # React root mount
├── public/
│   └── wallpapers/         # Background wallpapers
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup & Run

```bash
# Clone the repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# Install dependencies
npm install --prefix bharatos-app

# Start the Vite development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Production Build

```bash
# Compile TypeScript and bundle via Vite into public/
npm run build
```

---

## Design Decisions & Trade-offs

- **Zustand over React Context**: Window coordinates update at up to 60fps during dragging. React Context triggers full subtree re-renders on every coordinate change, whereas Zustand allows individual components to subscribe only to the specific slices of state they need.
- **IndexedDB over localStorage**: `localStorage` has a strict ~5MB synchronous limit and blocks the main thread on writes. `IndexedDB` operates asynchronously and accommodates larger files without freezing the UI.
- **Tailwind CSS v4**: Uses the latest CSS-first configuration to keep stylesheet bundle sizes minimal (~45KB production CSS) without needing a heavy config file.
- **Lucide Icons**: Lightweight, tree-shakeable icons that keep the initial JS chunk small.

---

## Known Limitations

- **Browser App Framing**: Because modern websites often send `X-Frame-Options: SAMEORIGIN` or `frame-ancestors 'none'`, many external domains cannot load inside the sandboxed browser iframe.
- **Audio Synthesizer**: Requires user interaction on the page first before the browser's `AudioContext` can transition out of the suspended state.

---

## Author

**Aviral Dewangan**  
GitHub: [@AviralDewangan14](https://github.com/AviralDewangan14)  
Email: aviral.dewangan14@gmail.com

---

## License

MIT License. Feel free to explore, fork, and build on top of this project.
