import { useState, useEffect  } from 'react';
import { useWindowStore } from '../stores/windowStore';
import { useAppRegistry } from '../stores/appRegistry';
import { useNotificationStore } from '../stores/notificationStore';
import { Bell, LayoutGrid } from 'lucide-react';
import clsx from 'clsx';
import * as LucideIcons from 'lucide-react';

interface TaskbarProps {
  onToggleLauncher: () => void;
  isLauncherOpen: boolean;
}

export function Taskbar({ onToggleLauncher, isLauncherOpen }: TaskbarProps) {
  const { windows, focusWindow, minimizeWindow } = useWindowStore();
  const { apps } = useAppRegistry();
  const { getUnreadCount, toggleDrawer } = useNotificationStore();
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = apps.filter(a => a.pinnedToDock);
  const runningAppIds = new Set(windows.map(w => w.appId));

  const dockApps = [...pinnedApps];
  windows.forEach(w => {
    if (!dockApps.find(a => a.id === w.appId)) {
      const appDef = apps.find(a => a.id === w.appId);
      if (appDef) dockApps.push(appDef);
    }
  });

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Box;
    return <Icon size={20} />;
  };

  const handleAppClick = (appId: string) => {
    const appWindows = windows.filter(w => w.appId === appId);
    if (appWindows.length === 0) {
      // should launch app, handled via registry/launcher usually, just placeholder
      return;
    }
    // simple toggle for first window
    const win = appWindows[0];
    if (win.isFocused && !win.isMinimized) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[48px] bg-gray-900/80 backdrop-blur-xl border-t border-white/10 z-[100] flex items-center justify-between px-2 select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleLauncher}
          className={clsx(
            "p-2 rounded-lg transition-colors text-white",
            isLauncherOpen ? "bg-white/20" : "hover:bg-white/10"
          )}
        >
          <LayoutGrid size={24} className="text-[#d4722a]" />
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center gap-2 h-full">
        {dockApps.map(app => {
          const isRunning = runningAppIds.has(app.id);
          const appWindows = windows.filter(w => w.appId === app.id);
          const isFocused = appWindows.some(w => w.isFocused && !w.isMinimized);

          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className={clsx(
                "relative p-2.5 rounded-lg transition-all",
                isFocused ? "bg-white/15" : "hover:bg-white/10 text-gray-300"
              )}
              title={app.name}
            >
              {getIcon(app.icon || 'Box')}
              {isRunning && (
                <div className={clsx(
                  "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                  isFocused ? "bg-[#d4722a]" : "bg-gray-400"
                )} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pr-2">
        <button 
          onClick={toggleDrawer}
          className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Bell size={18} />
          {getUnreadCount() > 0 && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d4722a] rounded-full" />
          )}
        </button>

        <button className="flex flex-col items-center justify-center hover:bg-white/10 px-2 py-0.5 rounded-lg transition-colors text-gray-200">
          <span className="text-[13px] font-medium leading-none mb-0.5">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] text-gray-400 leading-none">
            {time.toLocaleDateString([], { day: 'numeric', month: 'short' })}
          </span>
        </button>
      </div>
    </div>
  );
}
