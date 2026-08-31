import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { sound } from '../services/sound';
import { ArrowRight } from 'lucide-react';
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
    name: 'Aviral Dewangan',
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
        "fixed inset-0 z-[200] bg-cover bg-center flex flex-col items-center justify-between p-8 select-none transition-all duration-500 ease-in-out",
        unlocking ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"
      )}
      style={{ backgroundImage: `url(${lockScreenWallpaper || '/wallpapers/ladakh_pangong.jpg'})` }}
    >
      {/* Soft Vignette & Backdrop Blur */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/40",
          lockScreenBlur ? "backdrop-blur-md" : ""
        )}
      />

      {/* Top Section: Minimal Clock & Date */}
      <div className="relative z-10 flex flex-col items-center pt-10 text-center">
        <h1 className="text-7xl sm:text-8xl font-extralight text-white tracking-tight drop-shadow-lg">
          {formattedTime}
        </h1>
        <p className="text-base sm:text-lg text-white/80 font-medium drop-shadow mt-1">
          {formattedDate}
        </p>
        {lockScreenGreeting && (
          <p className="text-xs text-white/60 tracking-wider uppercase mt-2">
            {lockScreenGreeting}
          </p>
        )}
      </div>

      {/* Center Section: Sleek Human-Crafted User Auth Card */}
      <div className="relative z-10 flex flex-col items-center max-w-xs w-full pb-10">
        
        {/* User Avatar Circle */}
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${activeUser.avatarColor || 'from-amber-500 to-orange-600'} flex items-center justify-center text-white text-xl font-semibold shadow-2xl ring-2 ring-white/20 mb-3 transition-transform hover:scale-105`}>
          <span>{initials}</span>
        </div>

        <h2 className="text-base font-semibold text-white mb-4 drop-shadow">
          {activeUser.name}
        </h2>

        {/* Input or Unlock Button */}
        {activeUser.pin ? (
          <div className="w-full space-y-2">
            <div className="relative">
              <input
                type="password"
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Enter PIN..."
                className={clsx(
                  "w-full px-4 py-2.5 bg-black/30 backdrop-blur-xl border rounded-full text-xs text-center text-white placeholder-white/40 focus:outline-none transition-all",
                  pinError
                    ? "border-red-400 ring-2 ring-red-400/40 animate-shake"
                    : "border-white/20 focus:border-white/50 focus:bg-black/50"
                )}
              />
              <button
                onClick={handleUnlock}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                title="Unlock"
              >
                <ArrowRight size={13} />
              </button>
            </div>
            {pinError && (
              <p className="text-[11px] text-red-300 text-center font-medium">Incorrect PIN</p>
            )}
          </div>
        ) : (
          <button
            onClick={handleUnlock}
            className="w-full py-2.5 px-6 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 text-white font-medium text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Click or Press Enter to Unlock
          </button>
        )}

        {/* Minimal User Switcher */}
        {users.length > 1 && (
          <div className="mt-5 flex items-center gap-1.5">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => {
                  setActiveUser(u.id);
                  setPinInput('');
                  setPinError(false);
                }}
                className={clsx(
                  "px-3 py-1 rounded-full text-xs transition-all",
                  u.id === activeUserId
                    ? "bg-white/20 text-white font-medium border border-white/30"
                    : "text-white/50 hover:text-white/80 hover:bg-white/10"
                )}
              >
                {u.name}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Minimalist Hint */}
      <div className="relative z-10 text-[11px] text-white/40 font-normal tracking-wide">
        Press <span className="text-white/70 font-medium">Enter</span> to sign in
      </div>

    </div>
  );
}
