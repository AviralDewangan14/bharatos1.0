import { useState, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { Launcher } from './components/Launcher';
import { NotificationCenter } from './components/NotificationCenter';
import { LockScreen } from './components/LockScreen';
import { initFS } from './services/filesystem';
import { registerAllApps } from './apps';

export default function App() {
  const [locked, setLocked] = useState(true);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // boot sequence — init filesystem, register apps
    registerAllApps();
    initFS()
      .then(() => setReady(true))
      .catch(console.error);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        setLauncherOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!ready) {
    return (
      <div className="w-screen h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-light text-gray-300 mb-2">Bharat OS</div>
          <div className="text-sm text-gray-500">Starting up...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-gray-100 font-sans selection:bg-[#d4722a]/30">
      {locked ? (
        <LockScreen onUnlock={() => setLocked(false)} />
      ) : (
        <>
          <Desktop />
          <Taskbar
            isLauncherOpen={launcherOpen}
            onToggleLauncher={() => setLauncherOpen(!launcherOpen)}
          />
          {launcherOpen && <Launcher onClose={() => setLauncherOpen(false)} />}
          <NotificationCenter />
        </>
      )}
    </div>
  );
}
