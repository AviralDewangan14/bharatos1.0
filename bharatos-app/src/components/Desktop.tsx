import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useDesktopStore } from '../stores/desktopStore';
import { useAppRegistry } from '../stores/appRegistry';
import { useWindowStore } from '../stores/windowStore';
import { Window } from './Window';
import { ContextMenu } from './ContextMenu';
import * as LucideIcons from 'lucide-react';
import type { AppDefinition } from '../types/app';

// Rich, distinct color themes for each application icon
const APP_COLOR_SCHEMES: Record<string, { bg: string; border: string; shadow: string; text: string }> = {
  files: {
    bg: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700',
    border: 'border-blue-400/30',
    shadow: 'shadow-blue-500/25',
    text: 'text-white'
  },
  terminal: {
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950',
    border: 'border-emerald-500/40',
    shadow: 'shadow-emerald-500/20',
    text: 'text-emerald-400'
  },
  notes: {
    bg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600',
    border: 'border-amber-300/40',
    shadow: 'shadow-amber-500/25',
    text: 'text-white'
  },
  calculator: {
    bg: 'bg-gradient-to-br from-orange-500 via-rose-500 to-red-600',
    border: 'border-orange-400/30',
    shadow: 'shadow-orange-500/25',
    text: 'text-white'
  },
  settings: {
    bg: 'bg-gradient-to-br from-slate-600 via-slate-700 to-zinc-800',
    border: 'border-slate-400/30',
    shadow: 'shadow-slate-500/20',
    text: 'text-slate-200'
  },
  browser: {
    bg: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600',
    border: 'border-cyan-300/40',
    shadow: 'shadow-cyan-500/25',
    text: 'text-white'
  },
  'app-store': {
    bg: 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700',
    border: 'border-purple-300/40',
    shadow: 'shadow-purple-500/25',
    text: 'text-white'
  },
  gallery: {
    bg: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500',
    border: 'border-pink-300/40',
    shadow: 'shadow-rose-500/25',
    text: 'text-white'
  },
  music: {
    bg: 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700',
    border: 'border-violet-300/40',
    shadow: 'shadow-violet-500/25',
    text: 'text-white'
  },
  'system-monitor': {
    bg: 'bg-gradient-to-br from-teal-400 via-emerald-500 to-teal-700',
    border: 'border-teal-300/40',
    shadow: 'shadow-teal-500/25',
    text: 'text-white'
  }
};

export function Desktop() {
  const { wallpaper, setWallpaper } = useDesktopStore();
  const { apps } = useAppRegistry();
  const { windows, openWindow } = useWindowStore();
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const desktopApps = apps.filter(app => app.showOnDesktop);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleAppClick = (app: AppDefinition) => {
    openWindow({
      appId: app.id,
      title: app.name,
      icon: app.icon,
      position: { x: 120 + Math.floor(Math.random() * 60), y: 80 + Math.floor(Math.random() * 40) },
      size: app.defaultSize || { width: 800, height: 550 },
      minSize: app.minSize,
    });
  };

  const getAppTile = (app: AppDefinition) => {
    const scheme = APP_COLOR_SCHEMES[app.id] || {
      bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
      border: 'border-white/20',
      shadow: 'shadow-black/30',
      text: 'text-white'
    };
    const Icon = (LucideIcons as any)[app.icon || 'Box'] || LucideIcons.Box;

    return (
      <div
        className={`w-14 h-14 rounded-2xl ${scheme.bg} ${scheme.border} border shadow-lg ${scheme.shadow} flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-white/40 group-active:scale-95`}
      >
        <Icon size={28} className={`${scheme.text} drop-shadow-sm`} />
      </div>
    );
  };

  return (
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat overflow-hidden select-none"
      style={{ backgroundImage: `url(${wallpaper})`, backgroundColor: '#0b0f14' }}
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      {/* Subtle overlay gradient to ensure high legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Desktop Icons Grid */}
      <div className="relative z-10 p-6 grid grid-flow-col auto-rows-max gap-5 h-full content-start items-start">
        {desktopApps.map(app => (
          <div
            key={app.id}
            onClick={(e) => {
              e.stopPropagation();
              handleAppClick(app);
            }}
            className="flex flex-col items-center gap-2 w-24 p-2 rounded-2xl hover:bg-white/10 active:bg-white/15 cursor-pointer group transition-all duration-200"
          >
            {getAppTile(app)}
            <span className="text-xs font-medium text-white/95 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center line-clamp-1 px-1.5 py-0.5 rounded-md group-hover:bg-black/30 transition-colors">
              {app.name}
            </span>
          </div>
        ))}
      </div>

      {/* Open Windows Layer */}
      {windows.map(win => {
        const app = apps.find(a => a.id === win.appId);
        const AppComponent = app ? app.component : null;
        
        return (
          <Window key={win.id} windowState={win}>
            {AppComponent ? <AppComponent windowId={win.id} /> : <div className="p-4 text-gray-400">Application not found</div>}
          </Window>
        );
      })}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onClose={closeContextMenu}
          items={[
            {
              label: 'New Text File',
              icon: 'FileText',
              onClick: () => {
                const notesApp = apps.find(a => a.id === 'notes');
                if (notesApp) handleAppClick(notesApp);
              }
            },
            {
              label: 'Open Terminal Here',
              icon: 'Terminal',
              onClick: () => {
                const termApp = apps.find(a => a.id === 'terminal');
                if (termApp) handleAppClick(termApp);
              }
            },
            {
              label: 'Switch Wallpaper',
              icon: 'Image',
              onClick: () => {
                const wallpapers = [
                  '/wallpapers/ladakh_pangong.jpg',
                  '/wallpapers/kashmir_dal.jpg',
                  '/wallpapers/munnar_hills.jpg',
                  '/wallpapers/varanasi_dawn.jpg',
                  '/wallpapers/thar_twilight.jpg',
                  '/wallpapers/andaman_beach.jpg',
                  '/wallpapers/kutch_rann.jpg',
                  '/wallpapers/waterfall_ghats.jpg'
                ];
                const currentIndex = wallpapers.indexOf(wallpaper);
                const nextIndex = (currentIndex + 1) % wallpapers.length;
                setWallpaper(wallpapers[nextIndex]);
              }
            },
            {
              label: 'System Settings',
              icon: 'Settings',
              onClick: () => {
                const settingsApp = apps.find(a => a.id === 'settings');
                if (settingsApp) handleAppClick(settingsApp);
              }
            }
          ]}
        />
      )}
    </div>
  );
}
