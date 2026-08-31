import React, { useState } from 'react';
import type { AppComponentProps } from '../../types/app';
import { useSettingsStore } from '../../stores/settingsStore';
import { useDesktopStore } from '../../stores/desktopStore';
import { Palette, Globe, Monitor, Info } from 'lucide-react';
import clsx from 'clsx';

export default function SettingsApp({ windowId: _windowId }: AppComponentProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'language' | 'display' | 'about'>('appearance');
  const settings = useSettingsStore();
  
  const updateSettings = (updates: Partial<typeof settings>) => {
    if (updates.theme) settings.setTheme(updates.theme);
    if (updates.accentColor) settings.setAccentColor(updates.accentColor);
    if (updates.language) settings.setLanguage(updates.language);
    if (updates.fontSize) settings.setFontSize(updates.fontSize);
    if (updates.userName !== undefined) settings.setUserName(updates.userName);
  };

  const setWallpaper = useDesktopStore(s => s.setWallpaper);

  const colors = [
    { id: 'saffron', hex: '#f97316' },
    { id: 'blue', hex: '#3b82f6' },
    { id: 'green', hex: '#22c55e' },
    { id: 'purple', hex: '#a855f7' },
    { id: 'red', hex: '#ef4444' },
    { id: 'pink', hex: '#ec4899' },
  ];

  const wallpapers = [
    '/wallpapers/default.jpg',
    '/wallpapers/nature.jpg',
    '/wallpapers/abstract.jpg',
    '/wallpapers/space.jpg'
  ];

  const storageEst = (navigator.storage && typeof navigator.storage.estimate === 'function') ? 'Querying...' : 'Not available';
  const [storageUsage, setStorageUsage] = useState(storageEst);

  
  React.useEffect(() => {
    if (activeTab === 'about' && navigator.storage && typeof navigator.storage.estimate === 'function') {
      navigator.storage.estimate().then(est => {
        const used = ((est.usage || 0) / (1024 * 1024)).toFixed(2);
        const total = ((est.quota || 0) / (1024 * 1024)).toFixed(2);
        setStorageUsage(`${used} MB / ${total} MB`);
      });
    }
  }, [activeTab]);


  return (
    <div className="flex h-full bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800/50 border-r border-gray-700 py-4">
        <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Settings</h2>
        <nav className="space-y-1 px-2">
          <button onClick={() => setActiveTab('appearance')} className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors", activeTab === 'appearance' ? "bg-blue-600/30 text-blue-100" : "hover:bg-gray-700/50")}>
            <Palette size={16} /> Appearance
          </button>
          <button onClick={() => setActiveTab('language')} className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors", activeTab === 'language' ? "bg-blue-600/30 text-blue-100" : "hover:bg-gray-700/50")}>
            <Globe size={16} /> Language
          </button>
          <button onClick={() => setActiveTab('display')} className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors", activeTab === 'display' ? "bg-blue-600/30 text-blue-100" : "hover:bg-gray-700/50")}>
            <Monitor size={16} /> Display
          </button>
          <button onClick={() => setActiveTab('about')} className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors", activeTab === 'about' ? "bg-blue-600/30 text-blue-100" : "hover:bg-gray-700/50")}>
            <Info size={16} /> About
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'appearance' && (
          <div className="space-y-8 max-w-2xl">
            <section>
              <h3 className="text-lg font-medium text-white mb-4">Theme</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" checked={settings.theme === 'dark'} onChange={() => updateSettings({ theme: 'dark' })} className="accent-blue-500" /> Dark
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" checked={settings.theme === 'light'} onChange={() => updateSettings({ theme: 'light' })} className="accent-blue-500" /> Light
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-white mb-4">Accent Color</h3>
              <div className="flex gap-3">
                {colors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => updateSettings({ accentColor: c.hex })}
                    className={clsx(
                      "w-8 h-8 rounded-full border-2 transition-transform",
                      settings.accentColor === c.hex ? "border-white scale-110" : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-white mb-4">Wallpaper</h3>
              <div className="grid grid-cols-2 gap-4">
                {wallpapers.map(w => (
                  <div key={w} onClick={() => setWallpaper(w)} className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-400 aspect-video bg-gray-800">
                    {/* Fallback to simple color block since we don't have real images yet */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center text-xs text-gray-500">{w.split('/').pop()}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'language' && (
          <div className="space-y-6 max-w-2xl">
            <section>
              <h3 className="text-lg font-medium text-white mb-4">System Language</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                  <input type="radio" name="lang" checked={settings.language === 'en'} onChange={() => updateSettings({ language: 'en' })} className="accent-blue-500" />
                  <div>
                    <div className="font-medium">English</div>
                    <div className="text-sm text-gray-400">US English</div>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                  <input type="radio" name="lang" checked={settings.language === 'hi'} onChange={() => updateSettings({ language: 'hi' })} className="accent-blue-500" />
                  <div>
                    <div className="font-medium">Hindi (हिंदी)</div>
                    <div className="text-sm text-gray-400">Indian Hindi</div>
                  </div>
                </label>
              </div>
              <p className="mt-4 text-sm text-yellow-500 italic">* More Indian languages coming soon</p>
            </section>
          </div>
        )}

        {activeTab === 'display' && (
          <div className="space-y-6 max-w-2xl">
            <section>
              <h3 className="text-lg font-medium text-white mb-4">Font Size</h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="fontSize" checked={settings.fontSize === 'small'} onChange={() => updateSettings({ fontSize: 'small' })} className="accent-blue-500" /> Small
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="fontSize" checked={settings.fontSize === 'medium'} onChange={() => updateSettings({ fontSize: 'medium' })} className="accent-blue-500" /> Medium
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="fontSize" checked={settings.fontSize === 'large'} onChange={() => updateSettings({ fontSize: 'large' })} className="accent-blue-500" /> Large
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-white mb-4">User Name</h3>
              <input 
                type="text" 
                value={settings.userName || 'User'} 
                onChange={(e) => updateSettings({ userName: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full max-w-sm focus:outline-none focus:border-blue-500"
              />
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6 max-w-2xl text-sm">
            <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-xl mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-white to-green-500 rounded-full mb-4 shadow-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-xl">BOS</span>
              </div>
              <h2 className="text-2xl font-bold text-white">BharatOS</h2>
              <p className="text-gray-400">Version 1.0.0 (Web Desktop Edition)</p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-gray-800 pt-6">
              <div className="text-gray-400">Built by</div>
              <div className="col-span-2 font-medium">Aviral Dewangan</div>

              <div className="text-gray-400">Tech Stack</div>
              <div className="col-span-2 font-medium">React 18 + TypeScript + Vite + Tailwind 4</div>

              <div className="text-gray-400">Browser</div>
              <div className="col-span-2 text-gray-300 break-words">{navigator.userAgent}</div>

              <div className="text-gray-400">Storage Usage</div>
              <div className="col-span-2 text-gray-300">{storageUsage}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
