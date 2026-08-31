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
import { Power } from 'lucide-react';

export default function App() {
  const [locked, setLocked] = useState(true);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [bootProgress, setBootProgress] = useState(0); // 0 to 100
  const [isBooted, setIsBooted] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isPoweredOff, setIsPoweredOff] = useState(false);

  const { brightness, soundEnabled, soundVolume } = useSettingsStore();

  useEffect(() => {
    registerAllApps();

    // Natural, smooth progress bar load
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 25) + 15;
      if (current >= 100) {
        current = 100;
        setBootProgress(100);
        clearInterval(interval);
        initFS()
          .then(() => {
            setTimeout(() => {
              setIsBooted(true);
              if (soundEnabled) sound.playNotification(soundVolume * 0.3);
            }, 300);
          })
          .catch(console.error);
      } else {
        setBootProgress(current);
      }
    }, 120);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        setLauncherOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleShutdown = () => {
    setIsShuttingDown(true);
    if (soundEnabled) sound.playLock(soundVolume);
    setTimeout(() => {
      setIsShuttingDown(false);
      setIsPoweredOff(true);
    }, 900);
  };

  const handleRestart = () => {
    setIsShuttingDown(true);
    if (soundEnabled) sound.playLock(soundVolume);
    setTimeout(() => {
      setIsShuttingDown(false);
      setBootProgress(0);
      setIsBooted(false);
      setLocked(true);

      let current = 0;
      const interval = setInterval(() => {
        current += 30;
        if (current >= 100) {
          setBootProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            setIsBooted(true);
            if (soundEnabled) sound.playNotification(soundVolume * 0.3);
          }, 250);
        } else {
          setBootProgress(current);
        }
      }, 100);
    }, 800);
  };

  const handlePowerOn = () => {
    setIsPoweredOff(false);
    setBootProgress(0);
    setIsBooted(false);
    setLocked(true);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        setBootProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsBooted(true);
          if (soundEnabled) sound.playNotification(soundVolume * 0.3);
        }, 250);
      } else {
        setBootProgress(current);
      }
    }, 100);
  };

  // 1. Powered Off Standby Screen
  if (isPoweredOff) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center select-none text-slate-500 font-sans p-6">
        <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500">
          <button
            onClick={handlePowerOn}
            className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white/50 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xl"
            title="Power On"
          >
            <Power size={24} />
          </button>
          <span className="text-xs tracking-wider uppercase text-white/40">Click to power on</span>
        </div>
      </div>
    );
  }

  // 2. Shutting Down Transition
  if (isShuttingDown) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center select-none text-white/70 font-sans animate-in fade-in duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs text-white/60 font-medium tracking-wide">Shutting down...</span>
        </div>
      </div>
    );
  }

  // 3. Minimalist Clean OS Boot Screen
  if (!isBooted) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center select-none font-sans p-6">
        <div className="flex flex-col items-center max-w-[200px] w-full space-y-8 animate-in fade-in duration-300">
          
          {/* Minimalist Monogram / Logo */}
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl font-light tracking-wider">BharatOS</span>
          </div>

          {/* Minimal Apple-Style Thin Loading Bar */}
          <div className="w-full bg-white/15 rounded-full h-[3px] overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-150 ease-out"
              style={{ width: `${bootProgress}%` }}
            />
          </div>

        </div>
      </div>
    );
  }

  // 4. Active Desktop Environment
  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans select-none relative">
      
      {/* Global Brightness Dimming Layer */}
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
