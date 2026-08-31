import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DesktopIcon {
  appId: string;
  position: { row: number; col: number };
}

interface DesktopStore {
  wallpaper: string;
  desktopIcons: DesktopIcon[];
  setWallpaper: (path: string) => void;
  moveIcon: (appId: string, row: number, col: number) => void;
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set) => ({
      wallpaper: '/wallpapers/ladakh_pangong.jpg',
      desktopIcons: [
        { appId: 'terminal', position: { row: 0, col: 0 } },
        { appId: 'files', position: { row: 1, col: 0 } },
        { appId: 'browser', position: { row: 2, col: 0 } },
        { appId: 'settings', position: { row: 3, col: 0 } },
      ],
      
      setWallpaper: (path) => set({ wallpaper: path }),
      
      moveIcon: (appId, row, col) => set((state) => {
        const icons = [...state.desktopIcons];
        const existingIdx = icons.findIndex(i => i.appId === appId);
        
        if (existingIdx >= 0) {
          icons[existingIdx] = { ...icons[existingIdx], position: { row, col } };
        } else {
          icons.push({ appId, position: { row, col } });
        }
        
        return { desktopIcons: icons };
      }),
    }),
    {
      name: 'bharatos-desktop',
    }
  )
);
