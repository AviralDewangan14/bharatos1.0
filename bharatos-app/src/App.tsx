import { useState, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { Launcher } from './components/Launcher';
import { NotificationCenter } from './components/NotificationCenter';
import { LockScreen } from './components/LockScreen';
import { initFS } from './services/filesystem';
import { registerAllApps } from './apps';
import { useSettingsStore } from './stores/settingsStore';
import { sound } from './services/sound';
import { Sparkles, Power, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [locked, setLocked] = useState(true);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [bootStage, setBootStage] = useState(0); // 0: starting, 1: vfs, 2: apps, 3: ready
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isPoweredOff, setIsPoweredOff] = useState(false);

  const { brightness, soundEnabled, soundVolume } = useSettingsStore();

  useEffect(() => {
    registerAllApps();

    // Staged realistic boot animation sequence
    const t1 = setTimeout(() => setBootStage(1), 400);
    const t2 = setTimeout(() => {
      initFS().catch(console.error);
      setBootStage(2);
    }, 900);
    const t3 = setTimeout(() => {
      setBootStage(3);
      if (soundEnabled) sound.playNotification(soundVolume * 0.4);
    }, 1500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        setLauncherOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleShutdown = () => {
    setIsShuttingDown(true);
    if (soundEnabled) sound.playLock(soundVolume);
    setTimeout(() => {
      setIsShuttingDown(false);
      setIsPoweredOff(true);
    }, 1200);
  };

  const handleRestart = () => {
    setIsShuttingDown(true);
    if (soundEnabled) sound.playLock(soundVolume);
    setTimeout(() => {
      setIsShuttingDown(false);
      setBootStage(0);
      setLocked(true);
      setTimeout(() => setBootStage(1), 300);
      setTimeout(() => setBootStage(2), 700);
      setTimeout(() => {
        setBootStage(3);
        if (soundEnabled) sound.playNotification(soundVolume * 0.4);
      }, 1200);
    }, 1000);
  };

  const handlePowerOn = () => {
    setIsPoweredOff(false);
    setBootStage(0);
    setLocked(true);
    setTimeout(() => setBootStage(1), 300);
    setTimeout(() => setBootStage(2), 700);
    setTimeout(() => {
      setBootStage(3);
      if (soundEnabled) sound.playNotification(soundVolume * 0.4);
    }, 1200);
  };

  // 1. Standby / Powered Off Screen
  if (isPoweredOff) {
    return (
      <div className="w-screen h-screen bg-[#05080c] flex flex-col items-center justify-center select-none text-slate-400 font-sans p-6">
        <div className="flex flex-col items-center max-w-sm text-center space-y-6 animate-in fade-in duration-500">
          <div className="w-20 h-20 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-slate-500 shadow-2xl">
            <Power size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">BharatOS is Powered Off</h2>
            <p className="text-xs text-slate-500">System safely halted and virtual state saved to local storage.</p>
          </div>
          <button
            onClick={handlePowerOn}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-xl shadow-orange-500/25 transition-all hover:scale-105"
          >
            <Power size={15} />
            <span>Power On System</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Shutting Down Transition
  if (isShuttingDown) {
    return (
      <div className="w-screen h-screen bg-[#090d12] flex flex-col items-center justify-center select-none text-slate-300 font-sans animate-in fade-in duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-xl animate-spin">
            <RotateCcw size={20} />
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">Shutting down BharatOS...</h2>
          <p className="text-xs text-slate-500 font-mono">Syncing IndexedDB storage & closing sessions</p>
        </div>
      </div>
    );
  }

  // 3. Staged Booting Splash Animation
  if (bootStage < 3) {
    return (
      <div className="w-screen h-screen bg-[#070b0e] flex flex-col items-center justify-center select-none text-slate-300 font-sans p-6">
        <div className="flex flex-col items-center max-w-xs w-full text-center space-y-6">
          
          {/* Sovereign Logo Emblem */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-2xl shadow-orange-500/30 ring-4 ring-amber-500/20 animate-pulse">
            <Sparkles size={36} className="stroke-[2.5]" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">BharatOS</h1>
            <p className="text-xs text-amber-400 font-semibold tracking-widest uppercase mt-0.5">Sovereign Edition</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-500 ease-out"
              style={{ width: bootStage === 0 ? '25%' : bootStage === 1 ? '65%' : '100%' }}
            />
          </div>

          {/* Boot Status Log */}
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 h-6">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>
              {bootStage === 0 && 'Initializing kernel runtime...'}
              {bootStage === 1 && 'Mounting IndexedDB filesystem...'}
              {bootStage === 2 && 'Starting window compositor...'}
            </span>
          </div>

        </div>
      </div>
    );
  }

  // 4. Main Desktop Environment
  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans select-none relative">
      
      {/* Global Hardware Brightness Dimming Layer */}
      {brightness < 100 && (
        <div
          className="fixed inset-0 z-[300] bg-black pointer-events-none transition-opacity duration-150"
          style={{ opacity: (100 - brightness) / 100 * 0.85 }}
        />
      )}

      {locked ? (
        <LockScreen onUnlock={() => setLocked(false)} />
      ) : (
        <>
          <Desktop />
          <Taskbar
            isLauncherOpen={launcherOpen}
            onToggleLauncher={() => setLauncherOpen(!launcherOpen)}
            onLock={() => setLocked(true)}
            onShutdown={handleShutdown}
            onRestart={handleRestart}
          />
          {launcherOpen && <Launcher onClose={() => setLauncherOpen(false)} />}
          <NotificationCenter />
        </>
      )}
    </div>
  );
}
