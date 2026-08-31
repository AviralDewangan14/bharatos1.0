import { useAppRegistry } from '../stores/appRegistry';
import FilesApp from './files/FilesApp';
import TerminalApp from './terminal/TerminalApp';
import NotesApp from './notes/NotesApp';
import CalculatorApp from './calculator/CalculatorApp';
import SettingsApp from './settings/SettingsApp';
import BrowserApp from './browser/BrowserApp';
import AppStoreApp from './app-store/AppStoreApp';
import GalleryApp from './gallery/GalleryApp';
import MusicApp from './music/MusicApp';
import SystemMonitorApp from './system-monitor/SystemMonitorApp';
import FocusDefendApp from './focusdefend/FocusDefendApp';

export function registerAllApps() {
  const { registerApp } = useAppRegistry.getState();

  registerApp({
    id: 'files',
    name: 'Files',
    icon: 'FolderOpen',
    description: 'Browse, manage, and inspect files in the IndexedDB virtual filesystem.',
    category: 'system',
    defaultSize: { width: 800, height: 550 },
    showOnDesktop: true,
    pinnedToDock: true,
    singleton: true,
    component: FilesApp
  });

  registerApp({
    id: 'terminal',
    name: 'Terminal',
    icon: 'Terminal',
    description: 'Unix-style shell with standard file operations, pipes, and history.',
    category: 'system',
    defaultSize: { width: 700, height: 450 },
    showOnDesktop: true,
    pinnedToDock: true,
    component: TerminalApp
  });

  registerApp({
    id: 'notes',
    name: 'Notes',
    icon: 'FileText',
    description: 'Minimalist text editor with autosave to ~/Documents.',
    category: 'productivity',
    defaultSize: { width: 750, height: 500 },
    showOnDesktop: true,
    pinnedToDock: true,
    singleton: true,
    component: NotesApp
  });

  registerApp({
    id: 'calculator',
    name: 'Calculator',
    icon: 'Calculator',
    description: 'Safe recursive-descent math calculator with history.',
    category: 'utilities',
    defaultSize: { width: 350, height: 520 },
    minSize: { width: 300, height: 450 },
    component: CalculatorApp
  });

  registerApp({
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    description: 'Personalize wallpapers, accent colors, theme, and language.',
    category: 'system',
    defaultSize: { width: 800, height: 550 },
    singleton: true,
    showOnDesktop: true,
    component: SettingsApp
  });

  registerApp({
    id: 'browser',
    name: 'Browser',
    icon: 'Globe',
    description: 'Web navigation frame with bookmarks and history.',
    category: 'internet',
    defaultSize: { width: 900, height: 600 },
    pinnedToDock: true,
    component: BrowserApp
  });

  registerApp({
    id: 'app-store',
    name: 'App Store',
    icon: 'Store',
    description: 'Explore and launch installed system utilities and packages.',
    category: 'system',
    defaultSize: { width: 850, height: 600 },
    pinnedToDock: true,
    singleton: true,
    component: AppStoreApp
  });

  registerApp({
    id: 'gallery',
    name: 'Gallery',
    icon: 'Image',
    description: 'Scenic wallpaper collection and local picture viewer.',
    category: 'media',
    defaultSize: { width: 800, height: 550 },
    component: GalleryApp
  });

  registerApp({
    id: 'music',
    name: 'Music',
    icon: 'Music',
    description: 'Web Audio API tone synthesizer and piano keyboard.',
    category: 'media',
    defaultSize: { width: 500, height: 400 },
    component: MusicApp
  });

  registerApp({
    id: 'system-monitor',
    name: 'System Monitor',
    icon: 'Activity',
    description: 'Track active windows, session uptime, and browser storage stats.',
    category: 'system',
    defaultSize: { width: 600, height: 450 },
    singleton: true,
    component: SystemMonitorApp
  });

  registerApp({
    id: 'focusdefend',
    name: 'FocusDefend',
    icon: 'Shield',
    description: 'Deep-work flow timer, distraction firewall, and procedural focus soundscapes.',
    category: 'productivity',
    defaultSize: { width: 850, height: 580 },
    pinnedToDock: true,
    showOnDesktop: true,
    singleton: true,
    component: FocusDefendApp
  });
}
