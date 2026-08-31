import { useState, useEffect, useRef  } from 'react';
import { useAppRegistry } from '../stores/appRegistry';
import { useWindowStore } from '../stores/windowStore';
import { Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';

interface LauncherProps {
  onClose: () => void;
}

const CATEGORIES = ['All', 'System', 'Utilities', 'Productivity', 'Media', 'Development', 'Internet'];

export function Launcher({ onClose }: LauncherProps) {
  const { apps } = useAppRegistry();
  const { openWindow } = useWindowStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                          app.description?.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' || app.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Box;
    return <Icon size={36} />;
  };

  const handleLaunch = (app: any) => {
    openWindow({
      appId: app.id,
      title: app.name,
      icon: app.icon,
      position: { x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 },
      size: { width: 800, height: 600 },
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[90] bg-black/70 backdrop-blur-2xl flex flex-col pt-20 px-8 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full pb-20">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-14 pr-6 text-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#d4722a] focus:bg-white/15 transition-all shadow-2xl"
          />
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={clsx(
                "px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === cat 
                  ? "bg-[#d4722a] text-white" 
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {filteredApps.map(app => (
            <div
              key={app.id}
              onClick={() => handleLaunch(app)}
              className="flex flex-col items-center p-6 rounded-2xl hover:bg-white/10 cursor-pointer transition-all group"
            >
              <div className="text-gray-200 mb-4 group-hover:scale-110 transition-transform duration-200 group-hover:text-[#d4722a]">
                {getIcon(app.icon || 'Box')}
              </div>
              <span className="text-gray-100 font-medium text-center mb-1">{app.name}</span>
              {app.description && (
                <span className="text-xs text-gray-400 text-center line-clamp-2">{app.description}</span>
              )}
            </div>
          ))}
          {filteredApps.length === 0 && (
            <div className="col-span-full text-center text-gray-400 mt-10 text-lg">
              No applications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
