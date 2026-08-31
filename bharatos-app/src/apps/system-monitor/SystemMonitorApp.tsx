import { useState, useEffect  } from 'react';
import type { AppComponentProps } from '../../types/app';
import { useWindowStore } from '../../stores/windowStore';
import { useAppRegistry } from '../../stores/appRegistry';
import { Activity, HardDrive, Clock, Cpu } from 'lucide-react';
import clsx from 'clsx';

export default function SystemMonitorApp({ windowId: _windowId }: AppComponentProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'storage' | 'sessions'>('overview');
  const [uptime, setUptime] = useState(0);
  const [storageData, setStorageData] = useState({ used: 0, total: 100 });
  
  const windows = useWindowStore(s => s.windows);
  const apps = useAppRegistry(s => s.apps);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'storage' && navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(est => {
        setStorageData({
          used: est.usage || 0,
          total: est.quota || 1024 * 1024 * 1024 // fallback to 1GB
        });
      });
    }
  }, [activeTab]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb > 1024) return (mb / 1024).toFixed(2) + ' GB';
    return mb.toFixed(2) + ' MB';
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200">
      <div className="flex bg-gray-800 p-2 gap-2 border-b border-gray-700">
        {(['overview', 'storage', 'sessions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-1.5 rounded text-sm capitalize transition-colors font-medium",
              activeTab === tab ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-blue-900/50 text-blue-400 rounded-lg"><Clock size={24}/></div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Session Uptime</div>
                  <div className="text-2xl font-mono text-white mt-1">{formatUptime(uptime)}</div>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-green-900/50 text-green-400 rounded-lg"><Activity size={24}/></div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Active Windows</div>
                  <div className="text-2xl font-mono text-white mt-1">{Object.keys(windows).length}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-4 py-3 bg-gray-800/80 border-b border-gray-700 font-medium text-gray-300 flex items-center gap-2">
                <Cpu size={16}/> Environment Info (Browser-Estimated)
              </div>
              <div className="p-4 space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-700/50 pb-2">
                  <span className="text-gray-500">Registered Apps</span>
                  <span className="font-mono text-gray-300">{Object.keys(apps).length}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700/50 pb-2">
                  <span className="text-gray-500">Screen Resolution</span>
                  <span className="font-mono text-gray-300">{window.innerWidth}x{window.innerHeight}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700/50 pb-2">
                  <span className="text-gray-500">Language</span>
                  <span className="font-mono text-gray-300">{navigator.language}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">User Agent</span>
                  <span className="font-mono text-xs text-gray-400 bg-gray-900 p-2 rounded block break-words border border-gray-800">
                    {navigator.userAgent}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2"><HardDrive size={20} className="text-blue-400"/> Local Storage Usage</h3>
              
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-400">IndexedDB Estimate</span>
                <span className="text-white font-mono">{formatBytes(storageData.used)} / {formatBytes(storageData.total)}</span>
              </div>
              
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700 mb-6">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000 relative"
                  style={{ width: `${Math.max(1, (storageData.used / storageData.total) * 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'}}></div>
                </div>
              </div>

              <div className="text-xs text-yellow-500 bg-yellow-900/20 p-3 rounded border border-yellow-900/50">
                Note: Values are browser estimates. The OS uses IndexedDB for filesystem simulation.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p className="text-gray-400 mb-4 text-sm">Current session started at: <strong className="text-white">{new Date(Date.now() - uptime * 1000).toLocaleTimeString()}</strong></p>
            <p className="text-sm text-gray-500 italic">Session tracking is ephemeral and resets on page reload.</p>
          </div>
        )}
      </div>
    </div>
  );
}
