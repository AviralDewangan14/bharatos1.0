import { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../stores/windowStore';
import { useAppRegistry } from '../stores/appRegistry';
import { useNotificationStore } from '../stores/notificationStore';
import { useSettingsStore } from '../stores/settingsStore';
import { sound } from '../services/sound';
import {
  Bell,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Sun,
  Lock,
  Power,
  RotateCcw,
  Settings,
  Sparkles,
  Check,
  Radio
} from 'lucide-react';
import { BharatLogo } from './BharatLogo';
import clsx from 'clsx';
import * as LucideIcons from 'lucide-react';
import type { AppDefinition } from '../types/app';

interface TaskbarProps {
  onToggleLauncher: () => void;
  isLauncherOpen: boolean;
  onLock: () => void;
  onShutdown: () => void;
  onRestart: () => void;
}

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
  'system-monitor': { bg: 'from-teal-400 to-emerald-600', text: 'text-white', glow: 'shadow-teal-500/30' },
  focusdefend: { bg: 'from-rose-500 to-amber-600', text: 'text-white', glow: 'shadow-rose-500/30' }
};

const NEARBY_WIFI = [
  { ssid: 'BharatNet-5G Ultra', signal: 4, secured: true, speed: '450 Mbps' },
  { ssid: 'IndiFiber_Secure', signal: 3, secured: true, speed: '300 Mbps' },
  { ssid: 'Gov_Bharat_Public', signal: 3, secured: false, speed: '100 Mbps' },
  { ssid: 'CyberSpace_Office', signal: 2, secured: true, speed: '50 Mbps' },
];

export function Taskbar({
  onToggleLauncher,
  isLauncherOpen,
  onLock,
  onShutdown,
  onRestart
}: TaskbarProps) {
  const { windows, focusWindow, minimizeWindow, openWindow } = useWindowStore();
  const { apps } = useAppRegistry();
  const { getUnreadCount, toggleDrawer } = useNotificationStore();
  const settings = useSettingsStore();

  const [time, setTime] = useState(new Date());
  const [activePopover, setActivePopover] = useState<'wifi' | 'audio' | 'user' | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    if (activePopover) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [activePopover]);

  const activeUser = settings.users.find(u => u.id === settings.activeUserId) || settings.users[0];
  const userInitials = activeUser?.name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'B';

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
    const IconCmp = (LucideIcons as any)[app.icon] || LucideIcons.Box;

    return (
      <div className={clsx(
        "w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br flex items-center justify-center transition-all duration-200 shadow-md group-hover:shadow-lg",
        color.bg,
        color.text,
        color.glow
      )}>
        <IconCmp size={20} className="transition-transform group-hover:scale-110" />
      </div>
    );
  };

  const unread = getUnreadCount();

  return (
    <div className="fixed bottom-3 inset-x-0 z-[100] flex justify-center pointer-events-none px-4 select-none">
      
      {/* Floating 3-Island Dock Container */}
      <div className="flex items-center gap-2.5 max-w-full pointer-events-auto">

        {/* ISLAND 1: Sovereign Launcher Button */}
        <button
          onClick={() => {
            onToggleLauncher();
            if (settings.soundEnabled) sound.playClick(settings.soundVolume * 0.5);
          }}
          className={clsx(
            "h-12 px-3.5 rounded-2xl flex items-center gap-2.5 backdrop-blur-2xl border transition-all duration-200 shadow-xl group",
            isLauncherOpen
              ? "bg-amber-500/20 text-white border-amber-400 shadow-amber-500/25 scale-105"
              : "bg-slate-950/75 hover:bg-slate-900/90 text-white border-white/15 hover:border-amber-500/40 hover:shadow-amber-500/10"
          )}
          title="BharatOS Launcher (Cmd/Win + Space)"
        >
          <BharatLogo size={22} variant="color" className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold tracking-wide hidden md:inline">BharatOS</span>
        </button>

        {/* ISLAND 2: Center Applications Dock */}
        <div className="h-12 px-2.5 bg-slate-950/75 backdrop-blur-2xl border border-white/15 rounded-2xl flex items-center gap-1.5 shadow-2xl overflow-x-auto">
          {dockApps.map((app) => {
            const appWindows = windows.filter((w) => w.appId === app.id);
            const isOpen = appWindows.length > 0;
            const isFocused = appWindows.some((w) => w.isFocused && !w.isMinimized);

            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className={clsx(
                  "relative p-1 rounded-xl transition-all duration-200 flex flex-col items-center group",
                  "hover:-translate-y-1.5 hover:scale-105"
                )}
                title={app.name}
              >
                {getDockIcon(app)}

                {/* Running State Indicators */}
                {isOpen && (
                  <div
                    className={clsx(
                      "absolute -bottom-0.5 rounded-full transition-all duration-300",
                      isFocused
                        ? "w-4 h-1 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                        : "w-1.5 h-1.5 bg-white/70 shadow-sm"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ISLAND 3: Control Capsule & User Profile Avatar */}
        <div className="relative" ref={popoverRef}>
          <div className="h-12 px-3 bg-slate-950/75 backdrop-blur-2xl border border-white/15 rounded-2xl flex items-center gap-3 shadow-2xl">
            
            {/* Quick Status Buttons (Wi-Fi, Audio) */}
            <div className="flex items-center gap-2 text-white/70">
              
              {/* Wi-Fi Trigger */}
              <button
                onClick={() => {
                  setActivePopover(activePopover === 'wifi' ? null : 'wifi');
                  if (settings.soundEnabled) sound.playClick(settings.soundVolume * 0.5);
                }}
                className={clsx(
                  "p-1.5 rounded-xl transition-colors",
                  activePopover === 'wifi' ? "bg-amber-500/25 text-amber-300" : "hover:bg-white/10 hover:text-white"
                )}
                title="Wi-Fi Connection Details"
              >
                {settings.wifiEnabled ? <Wifi size={16} className="text-emerald-400" /> : <WifiOff size={16} className="text-red-400" />}
              </button>

              {/* Volume Trigger */}
              <button
                onClick={() => {
                  setActivePopover(activePopover === 'audio' ? null : 'audio');
                  if (settings.soundEnabled) sound.playClick(settings.soundVolume * 0.5);
                }}
                className={clsx(
                  "p-1.5 rounded-xl transition-colors",
                  activePopover === 'audio' ? "bg-amber-500/25 text-amber-300" : "hover:bg-white/10 hover:text-white"
                )}
                title="Sound & Volume Settings"
              >
                {settings.soundVolume === 0 ? <VolumeX size={16} className="text-slate-400" /> : <Volume2 size={16} className="text-amber-400" />}
              </button>

              {/* Notification Bell */}
              <button
                onClick={() => {
                  toggleDrawer();
                  if (settings.soundEnabled) sound.playClick(settings.soundVolume * 0.5);
                }}
                className="relative p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Notification Center"
              >
                <Bell size={16} />
                {unread > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-2 ring-slate-950" />
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-white/15" />

            {/* Digital Clock */}
            <div className="text-right font-medium hidden sm:block">
              <div className="text-xs text-white leading-tight font-semibold">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: settings.lockScreenClockFormat === '12h' })}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* User Profile Avatar Trigger */}
            <button
              onClick={() => {
                setActivePopover(activePopover === 'user' ? null : 'user');
                if (settings.soundEnabled) sound.playClick(settings.soundVolume * 0.5);
              }}
              className={clsx(
                "w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold border-2 transition-transform shadow-md",
                activeUser.avatarColor || 'from-amber-500 to-orange-600',
                activePopover === 'user' ? "border-amber-400 scale-105" : "border-white/20 hover:scale-105"
              )}
              title="Quick Settings & Power Menu"
            >
              <span>{userInitials}</span>
            </button>

          </div>

          {/* ============================================================ */}
          {/* POPOVER 1: Wi-Fi Connection Details Dialog */}
          {/* ============================================================ */}
          {activePopover === 'wifi' && (
            <div className="absolute bottom-16 right-0 w-80 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-2xl text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150 z-[120]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Wifi size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Wi-Fi Network</h4>
                    <p className="text-[10px] text-slate-400">
                      {settings.wifiEnabled ? settings.wifiConnectedSsid : 'Wi-Fi Disabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => settings.setWifiEnabled(!settings.wifiEnabled)}
                  className={clsx(
                    "w-10 h-5 rounded-full transition-colors relative p-0.5",
                    settings.wifiEnabled ? "bg-emerald-500" : "bg-slate-700"
                  )}
                >
                  <div className={clsx(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    settings.wifiEnabled ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              {settings.wifiEnabled ? (
                <div className="space-y-3 pt-3">
                  <div className="bg-slate-900/80 rounded-2xl p-3 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">IP Address</span>
                      <span className="font-mono text-[11px] text-emerald-400">192.168.1.108</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Link Speed</span>
                      <span className="font-mono text-[11px] text-slate-200">450 Mbps (5 GHz)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Security</span>
                      <span className="text-[11px] text-slate-200">WPA3-Personal</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                      Available Networks
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {NEARBY_WIFI.map(net => {
                        const isConnected = settings.wifiConnectedSsid === net.ssid;
                        return (
                          <button
                            key={net.ssid}
                            onClick={() => settings.setWifiConnectedSsid(net.ssid)}
                            className={clsx(
                              "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors",
                              isConnected ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30" : "bg-white/5 hover:bg-white/10 text-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Radio size={14} className={isConnected ? "text-emerald-400" : "text-slate-400"} />
                              <span>{net.ssid}</span>
                            </div>
                            {isConnected && <Check size={14} className="text-amber-400 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500 text-xs">
                  Turn on Wi-Fi to find and connect to local wireless networks.
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* POPOVER 2: Audio & Volume Popover Dialog */}
          {/* ============================================================ */}
          {activePopover === 'audio' && (
            <div className="absolute bottom-16 right-0 w-80 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-2xl text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150 z-[120] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Volume2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Audio & Sound</h4>
                    <p className="text-[10px] text-slate-400">{settings.outputDevice}</p>
                  </div>
                </div>
                <button
                  onClick={() => settings.setSoundVolume(settings.soundVolume > 0 ? 0 : 0.7)}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {settings.soundVolume === 0 ? 'Unmute' : 'Mute'}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Output Volume</span>
                  <span className="font-mono text-amber-400">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => settings.setSoundVolume(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Output Device Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Audio Output Device
                </label>
                <select
                  value={settings.outputDevice}
                  onChange={(e) => settings.setOutputDevice(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Built-in HD Speakers">Built-in HD Speakers</option>
                  <option value="Bharat Spatial Audio">Bharat Spatial Audio (Enhanced)</option>
                  <option value="Bluetooth Headphones">Bluetooth Wireless Headset</option>
                </select>
              </div>

              {/* Audio Test Button */}
              <button
                onClick={() => sound.playNotification(settings.soundVolume)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>Test Audio Chime</span>
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* POPOVER 3: User Profile & Quick Settings & Power Menu */}
          {/* ============================================================ */}
          {activePopover === 'user' && (
            <div className="absolute bottom-16 right-0 w-84 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-2xl text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150 z-[120] space-y-4">
              
              {/* User Header */}
              <div className="flex items-center gap-3.5 pb-3 border-b border-white/10">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeUser.avatarColor || 'from-amber-500 to-orange-600'} flex items-center justify-center text-white font-bold text-base shadow-lg border border-white/20`}>
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{activeUser.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      {activeUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">aviral.dewangan14@gmail.com</p>
                </div>
              </div>

              {/* Sliders (Brightness & Volume) */}
              <div className="space-y-3 bg-slate-900/80 rounded-2xl p-3 border border-white/5">
                
                {/* Brightness Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1.5"><Sun size={13} className="text-amber-400" /> Display Brightness</span>
                    <span className="font-mono text-amber-400">{settings.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={settings.brightness}
                    onChange={(e) => settings.setBrightness(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Volume Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1.5"><Volume2 size={13} className="text-blue-400" /> Sound Volume</span>
                    <span className="font-mono text-blue-400">{Math.round(settings.soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) => settings.setSoundVolume(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

              </div>

              {/* Quick Actions & Power Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActivePopover(null);
                    onLock();
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Lock size={14} className="text-amber-400" />
                  <span>Lock Session</span>
                </button>

                <button
                  onClick={() => {
                    setActivePopover(null);
                    openWindow({ appId: 'settings', title: 'Settings' });
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Settings size={14} className="text-blue-400" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    setActivePopover(null);
                    onRestart();
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw size={14} className="text-indigo-400" />
                  <span>Restart OS</span>
                </button>

                <button
                  onClick={() => {
                    setActivePopover(null);
                    onShutdown();
                  }}
                  className="p-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-xs font-bold text-red-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Power size={14} />
                  <span>Shut Down</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
