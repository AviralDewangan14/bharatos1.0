# BharatOS

A functional browser-based desktop operating system built with React 18, TypeScript, Vite, Tailwind CSS, Zustand, and IndexedDB.

BharatOS is an independent desktop environment running entirely on client-side web technologies. It is not a static landing page or mock dashboard — it is a modular desktop operating system running inside the browser with genuine window management, a persistent virtual filesystem, a terminal shell, and built-in system applications.

---

## 🖥️ System Architecture & Features

### 1. Window Management & Desktop Shell
- **Window Manager (`src/components/Window.tsx`, `src/stores/windowStore.ts`)**:
  - Full mouse-driven dragging with titlebar collision detection.
  - Multi-directional resizing (right, bottom, bottom-right).
  - Window state controls: Minimize to dock, Maximize/Restore with smooth viewport scaling, and Close.
  - Stacking context & focus management: clicking any window brings it to the top z-index.
- **Desktop (`src/components/Desktop.tsx`)**:
  - Grid-aligned application shortcuts.
  - Desktop context menu (New Folder, New File, Change Wallpaper, System Settings).
  - Dynamic wallpaper switching.
- **Taskbar / Dock (`src/components/Taskbar.tsx`)**:
  - Running application indicators and focus toggles.
  - Pinned system app launchers.
  - Live clock with date popover and notification badge indicators.
- **Application Launcher (`src/components/Launcher.tsx`)**:
  - Fullscreen app launcher overlay with instant fuzzy search.
  - Category tabs: All, System, Utilities, Productivity, Media, Internet.
  - Keyboard accessible (`Super` / `Win` / `Cmd` + `Space` shortcut).
- **Lock Screen (`src/components/LockScreen.tsx`)**:
  - Ambient lock screen with live clock and user profile avatar.

---

### 2. Virtual Filesystem (IndexedDB)
Located at `src/services/filesystem.ts`, the virtual filesystem provides a persistent Unix-style directory tree backed by browser IndexedDB (`idb`):
- **Standard Hierarchy**: Pre-populated with `/home`, `/home/Desktop`, `/home/Documents`, `/home/Downloads`, `/home/Pictures`, `/home/Music`, `/home/Videos`, and `/home/Trash`.
- **File Operations**: Full asynchronous CRUD API supporting `createFile`, `createDir`, `readFile`, `writeFile`, `rename`, `moveNode`, `copyNode`, `deleteNode`, and `listDir`.
- **Path Resolution**: Handles relative paths, parent directories (`..`), and current directory (`.`).
- **Data Persistence**: All user files and folder modifications survive browser restarts and page refreshes.

---

### 3. Built-in Applications

BharatOS comes equipped with 10 native applications:

| Application | Path | Description |
|---|---|---|
| **Files** | `src/apps/files/FilesApp.tsx` | Graphical file explorer with breadcrumbs, grid/list view toggles, folder navigation, and file deletion. |
| **Terminal** | `src/apps/terminal/TerminalApp.tsx` | Unix shell emulator hooked into the virtual filesystem (`ls`, `cd`, `pwd`, `cat`, `touch`, `mkdir`, `rm`, `cp`, `mv`, `echo`, `date`, `whoami`, `neofetch`, `history`). |
| **Notes** | `src/apps/notes/NotesApp.tsx` | Document scratchpad with automatic debounced saving to `~/Documents`. |
| **Calculator** | `src/apps/calculator/CalculatorApp.tsx` | Safe arithmetic engine using a custom recursive descent parser (`parser.ts`) without `eval()` or `Function()`. |
| **Settings** | `src/apps/settings/SettingsApp.tsx` | System preferences for wallpaper selection, theme toggling, accent colors, and English/Hindi language options. |
| **Browser** | `src/apps/browser/BrowserApp.tsx` | Sandboxed web browsing viewer with navigation controls, address bar, and presets. |
| **App Store** | `src/apps/app-store/AppStoreApp.tsx` | Catalogue and launcher for installed system utilities and packages. |
| **Gallery** | `src/apps/gallery/GalleryApp.tsx` | Photo viewer featuring high-definition scenic wallpapers with fullscreen viewing modal. |
| **Music** | `src/apps/music/MusicApp.tsx` | Web Audio API tone synthesizer with interactive piano keys and waveform oscillators. |
| **System Monitor** | `src/apps/system-monitor/SystemMonitorApp.tsx` | Real-time session uptime tracking, active window counter, and storage usage metrics. |

---

### 4. Internationalization (i18n)
- Comprehensive English (`src/i18n/en.ts`) and Hindi (`src/i18n/hi.ts`) translation dictionaries.
- Dynamic `t(key)` helper that reacts immediately to language changes in System Settings.

---

## 📂 Project Structure

```text
bharatos-app/
├── src/
│   ├── apps/               # Built-in applications
│   │   ├── app-store/      # App Store catalog
│   │   ├── browser/        # Web browser frame
│   │   ├── calculator/     # Calculator & recursive descent parser
│   │   ├── files/          # File manager
│   │   ├── gallery/        # Scenic photo gallery
│   │   ├── music/          # Web Audio synth
│   │   ├── notes/          # Notes scratchpad
│   │   ├── settings/       # System preferences & customization
│   │   ├── system-monitor/ # Resource & uptime monitor
│   │   ├── terminal/       # Command line shell
│   │   └── index.ts        # App registration entry
│   ├── components/         # Desktop shell components
│   │   ├── ContextMenu.tsx # Right-click context menus
│   │   ├── Desktop.tsx     # Desktop workspace & icon grid
│   │   ├── Launcher.tsx    # App search launcher overlay
│   │   ├── LockScreen.tsx  # Ambient lock screen
│   │   ├── NotificationCenter.tsx # System tray toasts & drawer
│   │   ├── Taskbar.tsx     # Bottom dock & system tray
│   │   └── Window.tsx      # Window chrome & drag/resize container
│   ├── hooks/              # Reusable interaction hooks (useDrag, useResize, useContextMenu)
│   ├── i18n/               # Localization (English & Hindi dictionaries)
│   ├── services/           # IndexedDB Virtual Filesystem & Shell Parser
│   ├── stores/             # Zustand state management (windows, settings, notifications, desktop)
│   ├── styles/             # Tailwind CSS v4 styling
│   ├── types/              # Strict TypeScript interfaces
│   ├── App.tsx             # Main OS shell layout
│   └── main.tsx            # React root mount
├── public/
│   └── wallpapers/         # System wallpapers
├── index.html              # HTML shell
├── package.json            # App dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build pipeline
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# Install dependencies
npm install --prefix bharatos-app

# Start the Vite development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with BharatOS.

### Production Build

```bash
# Build the production distribution into public/
npm run build
```

---

## 🛠️ Technology Stack & Engineering Choices

- **React 18 + TypeScript**: Strict types across window instances, filesystem nodes, and app registry items ensure stability without runtime type errors.
- **Tailwind CSS v4**: Clean utility styling featuring a dark slate palette (`#0f1419`) with warm saffron accents (`#d4722a`) and backdrop blur effects.
- **Zustand**: Lightweight, decoupled state management avoiding context provider re-rendering overhead.
- **IndexedDB (`idb`)**: Asynchronous, high-capacity client-side storage for the entire virtual filesystem hierarchy.
- **Lucide Icons**: Consistent vector iconography across all system components.

---

## 👤 Author

**Aviral Dewangan**  
- GitHub: [@AviralDewangan14](https://github.com/AviralDewangan14)  
- Email: aviral.dewangan14@gmail.com

---

## 📄 License

This project is licensed under the MIT License.
