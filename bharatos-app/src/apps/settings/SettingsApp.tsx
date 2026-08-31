import { useState, useEffect } from 'react';
import type { AppComponentProps } from '../../types/app';
import { useSettingsStore } from '../../stores/settingsStore';
import { useDesktopStore } from '../../stores/desktopStore';
import { sound } from '../../services/sound';
import {
  Palette,
  Globe,
  Monitor,
  Info,
  Users,
  Volume2,
  Lock,
  Plus,
  Trash2,
  Check,
  Shield,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';

export default function SettingsApp({ windowId: _windowId }: AppComponentProps) {
  const [activeTab, setActiveTab] = useState<
    'users' | 'lockscreen' | 'audio' | 'appearance' | 'language' | 'display' | 'about'
  >('users');

  const settings = useSettingsStore();
  const { wallpaper, setWallpaper } = useDesktopStore();

  // New User Form State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Standard'>('Standard');
  const [newUserPin, setNewUserPin] = useState('');
  const [newUserColor, setNewUserColor] = useState('from-blue-500 to-indigo-600');

  const colors = [
    { id: 'saffron', hex: '#f97316', label: 'Saffron' },
    { id: 'blue', hex: '#3b82f6', label: 'Sapphire' },
    { id: 'green', hex: '#22c55e', label: 'Emerald' },
    { id: 'purple', hex: '#a855f7', label: 'Amethyst' },
    { id: 'red', hex: '#ef4444', label: 'Crimson' },
    { id: 'pink', hex: '#ec4899', label: 'Rose' },
  ];

  const wallpaperList = [
    { path: '/wallpapers/ladakh_pangong.jpg', title: 'Pangong Lake, Ladakh' },
    { path: '/wallpapers/kashmir_dal.jpg', title: 'Dal Lake, Kashmir' },
    { path: '/wallpapers/munnar_hills.jpg', title: 'Tea Hills, Munnar' },
    { path: '/wallpapers/varanasi_dawn.jpg', title: 'Ghats, Varanasi' },
    { path: '/wallpapers/thar_twilight.jpg', title: 'Dunes, Thar Desert' },
    { path: '/wallpapers/andaman_beach.jpg', title: 'Radhanagar, Andaman' },
    { path: '/wallpapers/kutch_rann.jpg', title: 'White Desert, Kutch' },
    { path: '/wallpapers/waterfall_ghats.jpg', title: 'Western Ghats' }
  ];

  const avatarGradients = [
    'from-amber-500 to-orange-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-700',
    'from-purple-500 to-violet-700',
    'from-rose-500 to-pink-600',
    'from-slate-600 to-zinc-800'
  ];

  const [storageUsage, setStorageUsage] = useState('Querying...');

  useEffect(() => {
    if (activeTab === 'about' && navigator.storage && typeof navigator.storage.estimate === 'function') {
      navigator.storage.estimate().then(est => {
        const used = ((est.usage || 0) / (1024 * 1024)).toFixed(2);
        const total = ((est.quota || 0) / (1024 * 1024)).toFixed(2);
        setStorageUsage(`${used} MB / ${total} MB`);
      });
    }
  }, [activeTab]);

  const handleCreateUser = () => {
    if (!newUserName.trim()) return;
    settings.addUser({
      name: newUserName.trim(),
      role: newUserRole,
      pin: newUserPin.trim(),
      avatarColor: newUserColor,
      bio: `${newUserRole} user account`
    });
    setNewUserName('');
    setNewUserPin('');
    setIsAddingUser(false);
    if (settings.soundEnabled) sound.playClick(settings.soundVolume);
  };

  return (
    <div className="flex h-full bg-[#0d1217] text-slate-200 select-none overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <div className="w-56 bg-slate-950/80 border-r border-white/10 p-3 shrink-0 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            System Preferences
          </div>
          <nav className="space-y-1">
            {[
              { id: 'users', label: 'User Accounts', icon: Users, color: 'text-amber-400' },
              { id: 'lockscreen', label: 'Lock Screen', icon: Lock, color: 'text-blue-400' },
              { id: 'audio', label: 'Sound Effects', icon: Volume2, color: 'text-violet-400' },
              { id: 'appearance', label: 'Appearance', icon: Palette, color: 'text-rose-400' },
              { id: 'language', label: 'Language & Region', icon: Globe, color: 'text-emerald-400' },
              { id: 'display', label: 'Display & Text', icon: Monitor, color: 'text-cyan-400' },
              { id: 'about', label: 'About BharatOS', icon: Info, color: 'text-slate-400' },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (settings.soundEnabled) sound.playClick(settings.soundVolume * 0.5);
                  }}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group",
                    isActive
                      ? "bg-amber-500/20 text-amber-300 font-semibold shadow-sm border border-amber-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={16} className={clsx(tab.color, "transition-transform group-hover:scale-110")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Version Tag */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-[11px] text-slate-400">
          <div className="font-bold text-white flex items-center gap-1.5 mb-0.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>BharatOS 1.0.0</span>
          </div>
          <p className="text-[10px] text-slate-500">Sovereign Web Environment</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-900/40">
        
        {/* TAB 1: User Accounts */}
        {activeTab === 'users' && (
          <div className="max-w-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">User Profiles & Accounts</h3>
                <p className="text-xs text-slate-400">Manage multiple accounts, login PINs, and administrative permissions</p>
              </div>
              <button
                onClick={() => setIsAddingUser(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
              >
                <Plus size={15} />
                <span>Add User</span>
              </button>
            </div>

            {/* Add User Dialog */}
            {isAddingUser && (
              <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-2xl shadow-xl space-y-4 animate-in fade-in duration-150">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-amber-400">Create New User Account</h4>
                  <button onClick={() => setIsAddingUser(false)} className="text-slate-400 hover:text-white text-xs">
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Account Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Standard">Standard User</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Login PIN (Optional)</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={newUserPin}
                    onChange={(e) => setNewUserPin(e.target.value)}
                    placeholder="e.g. 1234 (leave blank for no PIN)"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Avatar Color Theme</label>
                  <div className="flex gap-2">
                    {avatarGradients.map(grad => (
                      <button
                        key={grad}
                        onClick={() => setNewUserColor(grad)}
                        className={clsx(
                          `w-8 h-8 rounded-xl bg-gradient-to-br ${grad} border-2 transition-transform`,
                          newUserColor === grad ? "border-white scale-110 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateUser}
                  disabled={!newUserName.trim()}
                  className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors"
                >
                  Save and Create Profile
                </button>
              </div>
            )}

            {/* List of Existing Users */}
            <div className="space-y-2.5">
              {settings.users.map(u => {
                const isActive = u.id === settings.activeUserId;
                const initials = u.name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();

                return (
                  <div
                    key={u.id}
                    className={clsx(
                      "flex items-center justify-between p-3.5 rounded-2xl border transition-all",
                      isActive
                        ? "bg-amber-500/10 border-amber-500/40 shadow-md shadow-amber-500/10"
                        : "bg-slate-950/60 border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${u.avatarColor || 'from-amber-500 to-orange-600'} flex items-center justify-center text-white font-bold shadow-md`}>
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{u.name}</span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1"><Shield size={11} className="text-amber-400" /> {u.role}</span>
                          <span>•</span>
                          <span>{u.pin ? 'PIN Protected' : 'No PIN'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isActive && (
                        <button
                          onClick={() => {
                            settings.setActiveUser(u.id);
                            if (settings.soundEnabled) sound.playClick(settings.soundVolume);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                        >
                          Switch User
                        </button>
                      )}
                      {settings.users.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete account for ${u.name}?`)) {
                              settings.removeUser(u.id);
                            }
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Lock Screen Customization */}
        {activeTab === 'lockscreen' && (
          <div className="max-w-xl space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Lock Screen Customization</h3>
              <p className="text-xs text-slate-400">Personalize lock screen wallpapers, clock display, and greetings</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Custom Lock Greeting</label>
                <input
                  type="text"
                  value={settings.lockScreenGreeting}
                  onChange={(e) => settings.setLockScreenGreeting(e.target.value)}
                  placeholder="e.g. Welcome to BharatOS"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Clock Display Format</label>
                  <div className="flex gap-2">
                    {(['12h', '24h'] as const).map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => settings.setLockScreenClockFormat(fmt)}
                        className={clsx(
                          "flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border",
                          settings.lockScreenClockFormat === fmt
                            ? "bg-amber-500/25 border-amber-500 text-amber-300"
                            : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
                        )}
                      >
                        {fmt === '12h' ? '12-Hour (AM/PM)' : '24-Hour (Military)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Background Blur</label>
                  <button
                    onClick={() => settings.setLockScreenBlur(!settings.lockScreenBlur)}
                    className={clsx(
                      "w-full py-2 rounded-xl text-xs font-semibold transition-colors border flex items-center justify-center gap-2",
                      settings.lockScreenBlur
                        ? "bg-amber-500/25 border-amber-500 text-amber-300"
                        : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
                    )}
                  >
                    <span>{settings.lockScreenBlur ? 'Frosted Blur: ON' : 'Frosted Blur: OFF'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Lock Screen Wallpaper</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {wallpaperList.map(wp => (
                    <div
                      key={wp.path}
                      onClick={() => settings.setLockScreenWallpaper(wp.path)}
                      className={clsx(
                        "relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all group",
                        settings.lockScreenWallpaper === wp.path
                          ? "border-amber-400 ring-2 ring-amber-500/40 scale-[1.02]"
                          : "border-white/10 hover:border-white/30"
                      )}
                    >
                      <img src={wp.path} alt={wp.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                      {settings.lockScreenWallpaper === wp.path && (
                        <div className="absolute top-1.5 right-1.5 bg-amber-500 rounded-full p-0.5 text-slate-950">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Sound Effects */}
        {activeTab === 'audio' && (
          <div className="max-w-xl space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Audio & Sound Effects</h3>
              <p className="text-xs text-slate-400">Configure Web Audio procedural UI sound synthesis and volume</p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-950/70 border border-white/10 rounded-2xl">
                <div>
                  <div className="text-sm font-bold text-white">Enable UI Sound Effects</div>
                  <p className="text-xs text-slate-400 mt-0.5">Play procedural tones on unlock, window opening, and alerts</p>
                </div>
                <button
                  onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
                  className={clsx(
                    "w-12 h-6 rounded-full transition-colors relative p-0.5",
                    settings.soundEnabled ? "bg-amber-500" : "bg-slate-700"
                  )}
                >
                  <div
                    className={clsx(
                      "w-5 h-5 rounded-full bg-white transition-transform",
                      settings.soundEnabled ? "translate-x-6" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Master UI Volume</span>
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

              {/* Sound Test Panel */}
              <div className="p-4 bg-slate-950/70 border border-white/10 rounded-2xl space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Sound Previews</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Unlock Chime', fn: () => sound.playUnlock(settings.soundVolume) },
                    { label: 'Lock Sound', fn: () => sound.playLock(settings.soundVolume) },
                    { label: 'Window Open', fn: () => sound.playWindowOpen(settings.soundVolume) },
                    { label: 'Window Close', fn: () => sound.playWindowClose(settings.soundVolume) },
                    { label: 'Notification Bell', fn: () => sound.playNotification(settings.soundVolume) },
                    { label: 'Tactile Click', fn: () => sound.playClick(settings.soundVolume) },
                  ].map(snd => (
                    <button
                      key={snd.label}
                      onClick={snd.fn}
                      className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Volume2 size={13} className="text-amber-400" />
                      <span>{snd.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Appearance */}
        {activeTab === 'appearance' && (
          <div className="max-w-xl space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Appearance & Theme</h3>
              <p className="text-xs text-slate-400">Customize the desktop wallpaper, accent color, and interface tone</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Accent Color Palette</label>
                <div className="flex gap-3">
                  {colors.map(c => (
                    <button
                      key={c.id}
                      onClick={() => settings.setAccentColor(c.hex)}
                      className={clsx(
                        "w-9 h-9 rounded-2xl flex items-center justify-center transition-all border-2",
                        settings.accentColor === c.hex ? "border-white scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
                      )}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    >
                      {settings.accentColor === c.hex && <Check size={14} className="text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Desktop Wallpaper</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {wallpaperList.map(wp => (
                    <div
                      key={wp.path}
                      onClick={() => setWallpaper(wp.path)}
                      className={clsx(
                        "relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all group",
                        wallpaper === wp.path
                          ? "border-amber-400 ring-2 ring-amber-500/40 scale-[1.02]"
                          : "border-white/10 hover:border-white/30"
                      )}
                    >
                      <img src={wp.path} alt={wp.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                      {wallpaper === wp.path && (
                        <div className="absolute top-1.5 right-1.5 bg-amber-500 rounded-full p-0.5 text-slate-950">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Language & Region */}
        {activeTab === 'language' && (
          <div className="max-w-xl space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Language & Localization</h3>
              <p className="text-xs text-slate-400">Switch system locale across all desktop applications</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'en', title: 'English (United States / India)', desc: 'Standard System English' },
                { id: 'hi', title: 'हिंदी (Hindi)', desc: 'संपूर्ण भारत ओएस हिंदी भाषा समर्थन' }
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => settings.setLanguage(lang.id as any)}
                  className={clsx(
                    "w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all",
                    settings.language === lang.id
                      ? "bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10"
                      : "bg-slate-950/60 border-white/10 hover:border-white/20 text-slate-300"
                  )}
                >
                  <div>
                    <div className="font-bold text-sm">{lang.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{lang.desc}</div>
                  </div>
                  {settings.language === lang.id && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                      <Check size={14} className="stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Display & Text */}
        {activeTab === 'display' && (
          <div className="max-w-xl space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Display & Text Scaling</h3>
              <p className="text-xs text-slate-400">Configure global font sizes and readability scaling</p>
            </div>

            <div className="space-y-3">
              {(['small', 'medium', 'large'] as const).map(sz => (
                <button
                  key={sz}
                  onClick={() => settings.setFontSize(sz)}
                  className={clsx(
                    "w-full p-3.5 rounded-2xl border text-left flex items-center justify-between capitalize transition-all",
                    settings.fontSize === sz
                      ? "bg-amber-500/15 border-amber-500 text-amber-300 font-bold"
                      : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20"
                  )}
                >
                  <span>{sz} Font Scaling</span>
                  {settings.fontSize === sz && <Check size={16} className="text-amber-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: About BharatOS */}
        {activeTab === 'about' && (
          <div className="max-w-xl space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">About BharatOS</h3>
              <p className="text-xs text-slate-400">System specification and runtime information</p>
            </div>

            <div className="p-5 bg-slate-950/80 rounded-2xl border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Operating System</span>
                <span className="font-semibold text-white">BharatOS Sovereign Edition</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Build Version</span>
                <span className="font-mono text-amber-400">1.0.0-LTS (2026)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Frontend Stack</span>
                <span className="text-slate-200">React 18 + TypeScript + Vite + Tailwind v4</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Filesystem Backend</span>
                <span className="text-slate-200">IndexedDB Virtual Hierarchy (`idb`)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Estimated Storage</span>
                <span className="font-mono text-slate-200">{storageUsage}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Developer</span>
                <span className="font-semibold text-white">Aviral Dewangan</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
