import { useState, useEffect, useMemo } from 'react';
import type { AppComponentProps } from '../../types/app';
import * as filesystem from '../../services/filesystem';
import {
  Folder,
  FileText,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  LayoutGrid,
  List,
  Search,
  Trash2,
  Plus,
  FolderPlus,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Music as MusicIcon,
  Video as VideoIcon,
  Info,
  X,
  HardDrive,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Home,
  Monitor,
  Download,
  FolderOpen
} from 'lucide-react';
import clsx from 'clsx';
import { useWindowStore } from '../../stores/windowStore';

type FileItem = {
  id: string;
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  mtime: number;
  content?: string;
};

type QuickLocation = {
  name: string;
  path: string;
  icon: any;
  color: string;
};

const QUICK_LOCATIONS: QuickLocation[] = [
  { name: 'Home', path: '/home', icon: Home, color: 'text-blue-400' },
  { name: 'Desktop', path: '/home/Desktop', icon: Monitor, color: 'text-amber-400' },
  { name: 'Documents', path: '/home/Documents', icon: FileText, color: 'text-indigo-400' },
  { name: 'Downloads', path: '/home/Downloads', icon: Download, color: 'text-emerald-400' },
  { name: 'Pictures', path: '/home/Pictures', icon: ImageIcon, color: 'text-rose-400' },
  { name: 'Music', path: '/home/Music', icon: MusicIcon, color: 'text-violet-400' },
  { name: 'Videos', path: '/home/Videos', icon: VideoIcon, color: 'text-cyan-400' },
  { name: 'Trash', path: '/home/Trash', icon: Trash2, color: 'text-red-400' },
];

export default function FilesApp({ windowId: _windowId }: AppComponentProps) {
  const [currentPath, setCurrentPath] = useState('/home');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [history, setHistory] = useState<string[]>(['/home']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'docs' | 'media' | 'code'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [storageUsage, setStorageUsage] = useState<string>('0 KB');
  const [storagePercent, setStoragePercent] = useState<number>(2);
  const [storageFileCount, setStorageFileCount] = useState<number>(0);

  const { openWindow } = useWindowStore();

  const loadDir = async (path: string) => {
    try {
      const items = await filesystem.listDir(path);
      const mapped: FileItem[] = items.map((n: any) => ({
        id: n.id,
        name: n.name,
        path: path === '/' ? '/' + n.name : path + '/' + n.name,
        isDir: n.type === 'directory',
        size: n.size || 0,
        mtime: n.modifiedAt || Date.now(),
        content: n.content
      }));
      setFiles(mapped);
      setCurrentPath(path);
      setSelectedFile(null);

      // Load true browser storage metrics
      const stats = await filesystem.getGlobalStats();
      setStorageUsage(`${stats.quotaUsedMb} of ${stats.quotaTotalGb}`);
      setStoragePercent(stats.percentUsed);
      setStorageFileCount(stats.totalFiles);
    } catch (e) {
      console.error('Error reading directory:', e);
    }
  };

  useEffect(() => {
    loadDir(currentPath);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(path);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
    loadDir(path);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      loadDir(history[historyIdx - 1]);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      loadDir(history[historyIdx + 1]);
    }
  };

  const goUp = () => {
    if (currentPath === '/' || currentPath === '') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const upPath = parts.length === 0 ? '/' : '/' + parts.join('/');
    navigate(upPath);
  };

  const handleOpenItem = (item: FileItem) => {
    if (item.isDir) {
      navigate(item.path);
    } else {
      // Open text files in Notes
      openWindow({
        appId: 'notes',
        title: `Notes - ${item.name}`,
        size: { width: 750, height: 500 },
      });
    }
  };

  const handleCreateFolder = async () => {
    if (!newItemName.trim()) return;
    const folderPath = currentPath === '/' ? `/${newItemName.trim()}` : `${currentPath}/${newItemName.trim()}`;
    await filesystem.createDir(folderPath);
    setNewItemName('');
    setIsCreatingFolder(false);
    loadDir(currentPath);
  };

  const handleCreateFile = async () => {
    if (!newItemName.trim()) return;
    const filePath = currentPath === '/' ? `/${newItemName.trim()}` : `${currentPath}/${newItemName.trim()}`;
    await filesystem.createFile(filePath, '# New Document\n\nCreated in BharatOS Files.\n');
    setNewItemName('');
    setIsCreatingFile(false);
    loadDir(currentPath);
  };

  const handleDeleteItem = async (item: FileItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      await filesystem.deleteNode(item.path);
      setSelectedFile(null);
      loadDir(currentPath);
    }
  };

  // Filter and sort items
  const processedFiles = useMemo(() => {
    let result = files.filter(f => {
      // Search query
      if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Type chips
      if (filterType === 'docs') {
        return !f.isDir && /\.(txt|md|doc|pdf|json|csv)$/i.test(f.name);
      }
      if (filterType === 'media') {
        return !f.isDir && /\.(jpg|jpeg|png|svg|gif|mp3|wav|mp4|webm)$/i.test(f.name);
      }
      if (filterType === 'code') {
        return !f.isDir && /\.(gaz|js|ts|tsx|jsx|py|sh|html|css|json)$/i.test(f.name);
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;

      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        cmp = (b.mtime || 0) - (a.mtime || 0);
      } else if (sortBy === 'size') {
        cmp = (b.size || 0) - (a.size || 0);
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [files, searchQuery, filterType, sortBy, sortAsc]);

  const getFileIcon = (item: FileItem) => {
    if (item.isDir) {
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
          <Folder size={22} className="fill-white/30" />
        </div>
      );
    }

    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'md':
      case 'txt':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FileText size={22} />
          </div>
        );
      case 'json':
      case 'csv':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <FileSpreadsheet size={22} />
          </div>
        );
      case 'gaz':
      case 'ts':
      case 'js':
      case 'py':
      case 'sh':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <FileCode size={22} />
          </div>
        );
      case 'jpg':
      case 'png':
      case 'svg':
      case 'webp':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <ImageIcon size={22} />
          </div>
        );
      case 'mp3':
      case 'wav':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <MusicIcon size={22} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-slate-200 shadow-md">
            <FileText size={22} />
          </div>
        );
    }
  };

  // Breadcrumb path segments
  const pathSegments = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-[#0d1217] text-slate-200 select-none overflow-hidden font-sans">
      
      {/* Top Header & Search Toolbar */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900/90 border-b border-white/10 gap-3">
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            disabled={historyIdx <= 0}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-300"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={goForward}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-300"
            title="Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={goUp}
            disabled={currentPath === '/'}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-300"
            title="Up Directory"
          >
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Interactive Breadcrumbs Bar */}
        <div className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-slate-950/80 rounded-xl border border-white/10 text-xs overflow-x-auto">
          <button
            onClick={() => navigate('/')}
            className={clsx(
              "px-2 py-0.5 rounded hover:bg-white/10 font-semibold transition-colors flex items-center gap-1",
              currentPath === '/' ? "text-amber-400 bg-amber-500/10" : "text-slate-400"
            )}
          >
            <FolderOpen size={13} />
            root
          </button>
          {pathSegments.map((segment, idx) => {
            const segPath = '/' + pathSegments.slice(0, idx + 1).join('/');
            const isLast = idx === pathSegments.length - 1;
            return (
              <div key={segPath} className="flex items-center gap-1">
                <ChevronRight size={12} className="text-slate-600" />
                <button
                  onClick={() => navigate(segPath)}
                  className={clsx(
                    "px-2 py-0.5 rounded hover:bg-white/10 font-medium transition-colors whitespace-nowrap",
                    isLast ? "text-amber-400 bg-amber-500/15 font-semibold" : "text-slate-300"
                  )}
                >
                  {segment}
                </button>
              </div>
            );
          })}
        </div>

        {/* Instant Search Box */}
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-8 pr-7 py-1.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Actions & View Controls */}
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
          <button
            onClick={() => {
              setIsCreatingFolder(true);
              setIsCreatingFile(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
            title="Create Folder"
          >
            <FolderPlus size={14} className="text-amber-400" />
            <span className="hidden sm:inline">New Folder</span>
          </button>
          <button
            onClick={() => {
              setIsCreatingFile(true);
              setIsCreatingFolder(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
            title="Create File"
          >
            <Plus size={14} className="text-blue-400" />
            <span className="hidden sm:inline">New File</span>
          </button>
          
          <div className="flex items-center bg-slate-950/80 rounded-xl border border-white/10 p-0.5 ml-1">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'grid' ? "bg-amber-500/25 text-amber-300" : "text-slate-400 hover:text-white"
              )}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'list' ? "bg-amber-500/25 text-amber-300" : "text-slate-400 hover:text-white"
              )}
              title="List View"
            >
              <List size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowInspector(!showInspector)}
            className={clsx(
              "p-1.5 rounded-xl border border-white/10 transition-colors",
              showInspector ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:bg-white/5"
            )}
            title="Toggle File Inspector"
          >
            <Info size={14} />
          </button>
        </div>

      </div>

      {/* Filter Tabs Sub-toolbar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950/50 border-b border-white/5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mr-1">Filter:</span>
          {(['all', 'docs', 'media', 'code'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={clsx(
                "px-2.5 py-0.5 rounded-lg font-medium transition-colors capitalize",
                filterType === type
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {type === 'all' ? 'All Files' : type === 'docs' ? 'Documents' : type === 'media' ? 'Media' : 'Code'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="name">Name</option>
            <option value="date">Date Modified</option>
            <option value="size">File Size</option>
          </select>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px]"
            title="Toggle sort direction"
          >
            {sortAsc ? '▲ ASC' : '▼ DESC'}
          </button>
        </div>
      </div>

      {/* Main Body with Sidebar, Content Area, and Inspector */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Places & Hierarchy */}
        <div className="w-52 bg-slate-950/70 border-r border-white/10 flex flex-col justify-between p-3 shrink-0">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 mb-1.5">
                Quick Access
              </div>
              <div className="space-y-0.5">
                {QUICK_LOCATIONS.map(loc => {
                  const Icon = loc.icon;
                  const isActive = currentPath === loc.path;
                  return (
                    <button
                      key={loc.path}
                      onClick={() => navigate(loc.path)}
                      className={clsx(
                        "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all text-left group",
                        isActive
                          ? "bg-amber-500/20 text-amber-300 font-semibold shadow-sm border border-amber-500/20"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon size={16} className={clsx(loc.color, "transition-transform group-hover:scale-110")} />
                      <span className="flex-1 truncate">{loc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real Storage Meter Widget */}
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-white/10 text-xs shadow-md">
            <div className="flex items-center justify-between text-slate-300 font-medium mb-1.5">
              <div className="flex items-center gap-1.5">
                <HardDrive size={13} className="text-amber-400" />
                <span className="font-semibold text-white">Browser Storage</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold">{storagePercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                style={{ width: `${Math.max(4, storagePercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span className="truncate">{storageUsage}</span>
              <span className="shrink-0 ml-1">{storageFileCount} files</span>
            </div>
          </div>

        </div>

        {/* Center Main File Grid / List View */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          
          {/* New Item Inline Input Dialog */}
          {(isCreatingFolder || isCreatingFile) && (
            <div className="mb-4 p-3 bg-slate-900/95 border border-amber-500/40 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                {isCreatingFolder ? <FolderPlus size={18} /> : <Plus size={18} />}
              </div>
              <input
                type="text"
                autoFocus
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') isCreatingFolder ? handleCreateFolder() : handleCreateFile();
                  if (e.key === 'Escape') {
                    setIsCreatingFolder(false);
                    setIsCreatingFile(false);
                  }
                }}
                placeholder={isCreatingFolder ? "Folder name..." : "File name (e.g., notes.md)..."}
                className="flex-1 bg-slate-950 border border-white/15 rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={isCreatingFolder ? handleCreateFolder : handleCreateFile}
                className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreatingFolder(false);
                  setIsCreatingFile(false);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Empty State */}
          {processedFiles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3 py-16">
              <FolderOpen size={48} className="text-slate-600 stroke-[1.5]" />
              <div className="text-sm font-medium">This folder is empty</div>
              <p className="text-xs text-slate-600 max-w-xs text-center">
                Create a new file or folder using the toolbar buttons above.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 content-start">
              {processedFiles.map(item => {
                const isSelected = selectedFile?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFile(item)}
                    onDoubleClick={() => handleOpenItem(item)}
                    className={clsx(
                      "flex flex-col items-center p-3 rounded-2xl cursor-pointer border transition-all duration-150 group relative text-center",
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10"
                        : "bg-slate-900/50 hover:bg-slate-800/80 border-white/5 hover:border-white/15"
                    )}
                  >
                    <div className="mb-2 transition-transform duration-200 group-hover:scale-105">
                      {getFileIcon(item)}
                    </div>
                    <span className="text-xs font-medium text-slate-200 break-all line-clamp-2 w-full leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      {item.isDir ? 'Folder' : `${(item.size / 1024).toFixed(1)} KB`}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List / Table View */
            <div className="bg-slate-900/60 rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold bg-slate-950/40">
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Size</th>
                    <th className="py-2.5 px-4">Modified</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {processedFiles.map(item => {
                    const isSelected = selectedFile?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedFile(item)}
                        onDoubleClick={() => handleOpenItem(item)}
                        className={clsx(
                          "cursor-pointer transition-colors group",
                          isSelected ? "bg-amber-500/15 text-amber-200" : "hover:bg-white/5 text-slate-300"
                        )}
                      >
                        <td className="py-2 px-4 flex items-center gap-3 font-medium">
                          <div className="scale-75 origin-left">{getFileIcon(item)}</div>
                          <span className="truncate max-w-xs">{item.name}</span>
                        </td>
                        <td className="py-2 px-4 text-slate-400 text-[11px] font-mono">
                          {item.isDir ? '--' : `${(item.size / 1024).toFixed(1)} KB`}
                        </td>
                        <td className="py-2 px-4 text-slate-500 text-[11px]">
                          {new Date(item.mtime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Right Inspector & Preview Panel */}
        {showInspector && (
          <div className="w-64 bg-slate-950/80 border-l border-white/10 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center pb-4 border-b border-white/10">
                  <div className="scale-125 my-2">{getFileIcon(selectedFile)}</div>
                  <div className="text-xs font-bold text-white break-all mt-2">{selectedFile.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedFile.isDir ? 'Directory' : `${(selectedFile.size / 1024).toFixed(1)} KB`}
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Location</span>
                    <span className="text-slate-300 font-mono text-[11px] truncate max-w-[120px]" title={selectedFile.path}>
                      {selectedFile.path}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Modified</span>
                    <span className="text-slate-300 text-[11px]">
                      {new Date(selectedFile.mtime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* File Content Preview Box */}
                {!selectedFile.isDir && selectedFile.content && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Preview</span>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-white/10 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {selectedFile.content.slice(0, 300)}
                      {selectedFile.content.length > 300 && '...'}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  {!selectedFile.isDir && (
                    <button
                      onClick={() => handleOpenItem(selectedFile)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                    >
                      <ExternalLink size={14} />
                      Open in Notes
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteItem(selectedFile)}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-red-500/15 text-red-400 font-medium text-xs hover:bg-red-500/25 border border-red-500/20 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs py-10 space-y-2">
                <Info size={28} className="text-slate-600 stroke-[1.5]" />
                <span>Select a file or folder to view its properties and preview content</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-t border-white/10 text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-3">
          <span>{processedFiles.length} item{processedFiles.length === 1 ? '' : 's'}</span>
          {selectedFile && <span className="text-amber-400 truncate max-w-xs">Selected: {selectedFile.name}</span>}
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
          <Sparkles size={11} className="text-amber-500" />
          <span>BharatOS VFS</span>
        </div>
      </div>

    </div>
  );
}
