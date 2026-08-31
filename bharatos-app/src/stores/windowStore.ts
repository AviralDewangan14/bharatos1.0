import { create } from 'zustand';
import type { WindowState, OpenWindowOptions, WindowPosition, WindowSize } from '../types/window';

interface WindowStore {
  windows: WindowState[];
  nextZIndex: number;
  openWindow: (opts: OpenWindowOptions) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  moveWindow: (id: string, position: WindowPosition) => void;
  resizeWindow: (id: string, size: WindowSize) => void;
  getWindow: (id: string) => WindowState | undefined;
  getFocusedWindow: () => WindowState | undefined;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZIndex: 1,

  openWindow: (opts) => {
    const id = crypto.randomUUID();
    const zIndex = get().nextZIndex;
    
    // Create a random cascading effect
    const offset = Math.floor(Math.random() * 200) + 100;
    
    const newWindow: WindowState = {
      id,
      appId: opts.appId,
      title: opts.title || 'Window',
      icon: opts.icon,
      position: opts.position || { x: offset, y: offset },
      size: opts.size || { width: 800, height: 600 },
      isFocused: true,
      isMinimized: false,
      isMaximized: false,
      zIndex,
    };

    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, isFocused: false })).concat(newWindow),
      nextZIndex: state.nextZIndex + 1,
    }));

    try {
      import('../services/sound').then(({ sound }) => sound.playWindowOpen(0.15));
    } catch {}

    return id;
  },

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter((w) => w.id !== id)
  })),

  focusWindow: (id) => set((state) => {
    const target = state.windows.find((w) => w.id === id);
    if (!target || target.isFocused) return state;

    const newZIndex = state.nextZIndex;
    return {
      windows: state.windows.map((w) => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? newZIndex : w.zIndex,
      })),
      nextZIndex: newZIndex + 1,
    };
  }),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) => 
      w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
    )
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) => {
      if (w.id !== id) return w;
      if (w.isMaximized) {
        // Restore window
        return {
          ...w,
          isMaximized: false,
          position: w.preMaximize?.position || w.position,
          size: w.preMaximize?.size || w.size,
        };
      } else {
        // Maximize window
        return {
          ...w,
          isMaximized: true,
          preMaximize: { position: w.position, size: w.size },
          position: { x: 0, y: 0 },
          // Using typical web APIs for full sizing minus a typical taskbar height
          size: { width: window.innerWidth, height: window.innerHeight - 48 }
        };
      }
    })
  })),

  moveWindow: (id, position) => set((state) => ({
    windows: state.windows.map((w) => 
      w.id === id ? { ...w, position, isMaximized: false } : w
    )
  })),

  resizeWindow: (id, size) => set((state) => ({
    windows: state.windows.map((w) => 
      w.id === id ? { ...w, size, isMaximized: false } : w
    )
  })),

  getWindow: (id) => get().windows.find((w) => w.id === id),
  
  getFocusedWindow: () => get().windows.find((w) => w.isFocused),
}));
