import { useState, useEffect } from 'react';
import { useWindowStore } from '../stores/windowStore';
import { useAppRegistry } from '../stores/appRegistry';
import { useNotificationStore } from '../stores/notificationStore';
import { Bell, Wifi, Volume2, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import * as LucideIcons from 'lucide-react';
import type { AppDefinition } from '../types/app';

interface TaskbarProps {
  onToggleLauncher: () => void;
  isLauncherOpen: boolean;
}

// Matching icon color badges for dock icons
const DOCK_APP_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  files: { bg: 'from-blue-500 to-indigo-600', text: 'text-white', glow: 'shadow-blue-500/30' },
  terminal: { bg: 'from-slate-900 to-emerald-950', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' },
  notes: { bg: 'from-amber-400 to-orange-600', text: 'text-white', glow: 'shadow-amber-500/30' },
  calculator: { bg: 'from-orange-500 to-rose-600', text: 'text-white', glow: 'shadow-orange-500/30' },
  settings: { bg: 'from-slate-600 to-zinc-800', text: 'text-slate-200', glow: 'shadow-slate-500/30' },
  browser: { bg: 'from-cyan-400 to-blue-600', text: 'text-white', glow: 'shadow-cyan-500/30' },
  'app-store': { bg: 'from-purple-500 to-indigo-700', text: 'text-white', glow: 'shadow-purple-500/30' },
  gallery: { bg: 'from-pink-500 to-rose-600', text: 'text-white', glow: 'shadow-rose-500/30' },
  music: { bg: 'from-violet-500 to-fuchsia-700', text: 'text-white', glow: 'shadow-violet-500/30' },
  'system-monitor': { bg: 'from-teal-400 to-emerald-600', text: 'text-white', glow: 'shadow-teal-500/30' }
};

export function Taskbar({ onToggleLauncher, isLauncherOpen }: TaskbarProps) {
  const { windows, focusWindow, minimizeWindow, openWindow } = useWindowStore();
  const { apps } = useAppRegistry();
  const { getUnreadCount, toggleDrawer } = useNotificationStore();
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = apps.filter(a => a.pinnedToDock);
  const dockApps: AppDefinition[] = [...pinnedApps];
  
  windows.forEach(w => {
    if (!dockApps.find(a => a.id === w.appId)) {
      const appDef = apps.find(a => a.id === w.appId);
      if (appDef) dockApps.push(appDef);
    }
  });

  const handleAppClick = (app: AppDefinition) => {
    const appWindows = windows.filter(w => w.appId === app.id);
    if (appWindows.length === 0) {
      // Launch new window
      openWindow({
        appId: app.id,
        title: app.name,
        icon: app.icon,
        position: { x: 140 + Math.floor(Math.random() * 50), y: 90 + Math.floor(Math.random() * 40) },
        size: app.defaultSize || { width: 800, height: 550 },
        minSize: app.minSize,
      });
      return;
    }
    
    // Toggle active state
    const win = appWindows[0];
    if (win.isFocused && !win.isMinimized) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  const getDockIcon = (app: AppDefinition) => {
    const color = DOCK_APP_COLORS[app.id] || {
      bg: 'from-slate-700 to-slate-900',
      text: 'text-white',
      glow: 'shadow-white/10'
    };
    const Icon = (LucideIcons as any)[app.icon || 'Box'] || LucideIcons.Box;

    return (
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.bg} border border-white/20 shadow-md ${color.glow} flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-1.5`}>
        <Icon size={20} className={`${color.text} drop-shadow-sm`} />
      </div>
    );
  };

  const unreadCount = getUnreadCount();

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="absolute bottom-3 inset-x-0 z-[100] flex items-center justify-center px-4 pointer-events-none select-none">
      <div className="pointer-events-auto flex items-center gap-3">
        
        {/* Sovereign Launcher Trigger Island */}
        <div className="flex items-center bg-slate-950/75 backdrop-blur-2xl border border-white/15 px-3 py-1.5 rounded-2xl shadow-2xl shadow-black/60 transition-all duration-200 hover:border-amber-500/50 hover:bg-slate-900/85">
          <button
            onClick={onToggleLauncher}
            className={clsx(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200 text-sm font-semibold tracking-wide",
              isLauncherOpen
                ? "bg-amber-500/25 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "text-white/90 hover:text-white hover:bg-white/10"
            )}
            title="BharatOS Launcher (Cmd/Win + Space)"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/30">
              <Sparkles size={14} className="text-white fill-white" />
            </div>
            <span className="hidden sm:inline font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
              Bharat
            </span>
          </button>
        </div>

        {/* Center Floating App Dock Island */}
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-2xl border border-white/15 px-3 py-1.5 rounded-2xl shadow-2xl shadow-black/70">
          {dockApps.map(app => {
            const appWindows = windows.filter(w => w.appId === app.id);
            const isRunning = appWindows.length > 0;
            const isFocused = appWindows.some(w => w.isFocused && !w.isMinimized);

            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className="relative group p-1 flex flex-col items-center justify-center focus:outline-none"
                title={app.name}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 origin-bottom bg-slate-900/95 text-white text-xs font-medium px-2.5 py-1 rounded-lg border border-white/15 shadow-xl shadow-black/80 pointer-events-none whitespace-nowrap z-50">
                  {app.name}
                </div>

                {/* Render colored app icon */}
                {getDockIcon(app)}

                {/* Running & Focused Indicators */}
                <div className="h-1.5 flex items-center justify-center mt-1">
                  {isFocused ? (
                    <div className="w-5 h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all duration-300" />
                  ) : isRunning ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.6)] transition-all duration-300" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Status & Control Capsule Island */}
        <div className="flex items-center gap-3 bg-slate-950/75 backdrop-blur-2xl border border-white/15 px-3 py-1.5 rounded-2xl shadow-2xl shadow-black/60 text-white/90">
          
          {/* Quick System Status Indicators */}
          <div className="hidden md:flex items-center gap-2.5 text-white/60 px-1">
            <span title="Wi-Fi Connected"><Wifi size={15} className="hover:text-emerald-400 transition-colors" /></span>
            <span title="Audio Ready"><Volume2 size={15} className="hover:text-amber-400 transition-colors" /></span>
          </div>

          {/* Notification Bell */}
          <button
            onClick={toggleDrawer}
            className="relative p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Notification Center"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] ring-1 ring-black" />
            )}
          </button>

          {/* Minimal Digital Clock */}
          <div className="flex flex-col items-end text-right px-1 border-l border-white/10 pl-2.5">
            <span className="text-xs font-bold tracking-wider text-white">
              {formattedTime}
            </span>
            <span className="text-[10px] font-medium text-white/50 tracking-tight">
              {formattedDate}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
