import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { sound } from '../services/sound';
import { Unlock, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const {
    lockScreenWallpaper,
    lockScreenGreeting,
    lockScreenClockFormat,
    lockScreenBlur,
    users,
    activeUserId,
    setActiveUser,
    soundEnabled,
    soundVolume
  } = useSettingsStore();

  const [time, setTime] = useState(new Date());
  const [unlocking, setUnlocking] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const activeUser = users.find(u => u.id === activeUserId) || users[0] || {
    id: 'user-default',
    name: 'Bharat User',
    avatarColor: 'from-amber-500 to-orange-600',
    role: 'Admin',
    pin: ''
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    if (activeUser.pin && activeUser.pin.length > 0) {
      if (pinInput !== activeUser.pin) {
        setPinError(true);
        if (soundEnabled) sound.playClick(soundVolume * 0.5);
        setTimeout(() => setPinError(false), 800);
        return;
      }
    }

    if (soundEnabled) {
      sound.playUnlock(soundVolume);
    }
    setUnlocking(true);
    setTimeout(onUnlock, 350);
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: lockScreenClockFormat === '12h'
  });

  const formattedDate = time.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const initials = activeUser.name
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[200] bg-cover bg-center flex flex-col items-center justify-between p-8 select-none transition-all duration-400 ease-in-out",
        unlocking ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      )}
      style={{ backgroundImage: `url(${lockScreenWallpaper || '/wallpapers/ladakh_pangong.jpg'})` }}
    >
      {/* Background Dim & Blur */}
      <div
        className={clsx(
          "absolute inset-0 bg-slate-950/45",
          lockScreenBlur ? "backdrop-blur-xl" : "backdrop-blur-sm"
        )}
      />

      {/* Top Header & Custom Greeting */}
      <div className="relative z-10 flex flex-col items-center pt-8 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-white/15 backdrop-blur-md text-xs font-semibold text-amber-400 mb-3 shadow-lg">
          <ShieldCheck size={14} className="text-amber-400" />
          <span>BharatOS Sovereign Environment</span>
        </div>
        <p className="text-sm font-medium text-slate-300 tracking-wide drop-shadow-md">
          {lockScreenGreeting || 'Welcome to BharatOS'}
        </p>
      </div>

      {/* Center Clock & Authentication Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        
        {/* Large Digital Clock */}
        <h1 className="text-7xl sm:text-8xl font-extralight text-white mb-1 drop-shadow-2xl tracking-tight">
          {formattedTime}
        </h1>
        <p className="text-lg text-slate-200/90 mb-10 drop-shadow-md font-medium">
          {formattedDate}
        </p>

        {/* User Profile Card */}
        <div className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
          
          {/* Avatar Circle */}
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${activeUser.avatarColor || 'from-amber-500 to-orange-600'} flex items-center justify-center mb-3 shadow-xl border-2 border-white/20`}>
            <span className="text-2xl font-bold text-white tracking-widest">{initials}</span>
          </div>

          <h2 className="text-lg font-bold text-white mb-0.5">{activeUser.name}</h2>
          <span className="text-xs text-amber-400/90 font-medium mb-4">{activeUser.role} Profile</span>

          {/* PIN Input or Direct Unlock */}
          {activeUser.pin ? (
            <div className="w-full space-y-3">
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  placeholder="Enter PIN (1234)..."
                  className={clsx(
                    "w-full pl-9 pr-10 py-2.5 bg-slate-950/90 border rounded-xl text-sm text-center text-white tracking-widest placeholder-slate-500 focus:outline-none transition-all",
                    pinError
                      ? "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-shake"
                      : "border-white/15 focus:border-amber-500/80"
                  )}
                />
                <button
                  onClick={handleUnlock}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                >
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </button>
              </div>
              {pinError && (
                <p className="text-xs text-red-400 font-medium">Incorrect PIN. Please try again.</p>
              )}
            </div>
          ) : (
            <button
              onClick={handleUnlock}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Unlock size={16} />
              <span>Unlock Desktop</span>
            </button>
          )}

        </div>

        {/* Multi-User Switcher Carousel */}
        {users.length > 1 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">Switch User:</span>
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => {
                  setActiveUser(u.id);
                  setPinInput('');
                  setPinError(false);
                }}
                className={clsx(
                  "px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
                  u.id === activeUserId
                    ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-white/10"
                )}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${u.avatarColor}`} />
                <span>{u.name}</span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-4 text-center">
        <p className="text-xs text-slate-400/80 bg-slate-950/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          Press <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-amber-300">Enter</kbd> or click Unlock to start your session
        </p>
      </div>

    </div>
  );
}
