import { useState, useEffect  } from 'react';
import { useDesktopStore } from '../stores/desktopStore';
import { useSettingsStore } from '../stores/settingsStore';
import clsx from 'clsx';

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { wallpaper } = useDesktopStore();
  const { userName } = useSettingsStore();
  const [time, setTime] = useState(new Date());
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(onUnlock, 400); // Wait for fade out
  };

  const initials = userName ? userName.substring(0, 2).toUpperCase() : 'B';

  return (
    <div 
      className={clsx(
        "fixed inset-0 z-[200] bg-cover bg-center flex flex-col items-center justify-center select-none transition-opacity duration-400 ease-in-out",
        unlocking ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={handleUnlock}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-7xl font-light text-white mb-2 drop-shadow-lg tracking-wider">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className="text-xl text-gray-200 mb-16 drop-shadow-md">
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>

        <div className="w-24 h-24 rounded-full bg-[#d4722a] flex items-center justify-center mb-6 shadow-2xl border-2 border-white/20">
          <span className="text-3xl font-medium text-white tracking-widest">{initials}</span>
        </div>
        <h2 className="text-2xl font-medium text-white mb-8 drop-shadow-md">{userName || 'Bharat User'}</h2>
        
        <p className="text-sm text-gray-300 animate-pulse bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
          Click anywhere to unlock
        </p>
      </div>
    </div>
  );
}
