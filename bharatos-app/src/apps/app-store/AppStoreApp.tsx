import { useState } from 'react';
import type { AppComponentProps } from '../../types/app';
import { useAppRegistry } from '../../stores/appRegistry';
import { useWindowStore } from '../../stores/windowStore';
import { Store, Check, Search, Grid, Star } from 'lucide-react';
import clsx from 'clsx';

export default function AppStoreApp({ windowId: _windowId }: AppComponentProps) {
  const apps = useAppRegistry(s => s.apps);
  const openWindow = useWindowStore(s => s.openWindow);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const categories = ['all', 'system', 'productivity', 'utilities', 'media', 'internet'];

  const filteredApps = Object.values(apps).filter(app => {
    if (app.id === 'app-store') return false; // Hide itself
    if (category !== 'all' && app.category !== category) return false;
    if (search && !app.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-full bg-gray-900 text-gray-200 font-sans">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800/50 border-r border-gray-700 flex flex-col p-4">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Store className="text-blue-400"/> Store</h2>
        
        <div className="space-y-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={clsx(
                "w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors",
                category === cat ? "bg-blue-600 text-white font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-2 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white capitalize">{category === 'all' ? 'Discover' : category}</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search apps..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>

        {/* Featured Section (only on 'all') */}
        {category === 'all' && !search && (
          <div className="p-6 pb-0">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 shadow-lg border border-blue-800/50 flex justify-between items-center">
              <div>
                <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded text-white uppercase tracking-wider mb-2 inline-block">Featured</span>
                <h3 className="text-2xl font-bold text-white mb-2">Browser App</h3>
                <p className="text-blue-200 max-w-md">Surf the decentralized web right from your desktop. Fast, secure, and minimal.</p>
              </div>
              <button 
                onClick={() => openWindow({ appId: 'browser', title: 'App' })}
                className="bg-white text-blue-900 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors"
              >
                Open
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map(app => (
              <div key={app.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 flex flex-col hover:bg-gray-800 transition-colors">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-inner">
                    {/* Simplified icon representation since we can't dynamically import Lucide easily without dynamic mapping */}
                    <Grid size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-100">{app.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{app.category}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 flex-1 mb-4 line-clamp-2">
                  Essential {app.category} application for Bharat OS. Built-in and optimized for your workspace.
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex text-yellow-500"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} className="text-gray-600"/></div>
                  <button 
                    onClick={() => openWindow({ appId: app.id, title: app.name })}
                    className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1.5 px-4 rounded-full flex items-center gap-1 transition-colors"
                  >
                    <Check size={14} /> Installed
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredApps.length === 0 && (
            <div className="text-center text-gray-500 mt-12">No apps found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}
