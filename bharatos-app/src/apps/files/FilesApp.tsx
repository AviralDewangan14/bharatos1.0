import React, { useState, useEffect } from 'react';
import type { AppComponentProps } from '../../types/app';
import * as filesystem from '../../services/filesystem';
import { FolderIcon, FileTextIcon, ArrowLeft, ArrowRight, ArrowUp, LayoutGrid, List, Search, Trash, Edit2, Copy, File } from 'lucide-react';
import clsx from 'clsx';
import { useWindowStore } from '../../stores/windowStore';

type FileItem = { name: string; path: string; isDir: boolean; size: number; mtime: number };

export default function FilesApp({ windowId: _windowId }: AppComponentProps) {
  const [currentPath, setCurrentPath] = useState('/home');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [history, setHistory] = useState<string[]>(['/home']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, file: FileItem | null } | null>(null);

  const { openWindow } = useWindowStore();

  const loadDir = async (path: string) => {
    try {
      // Mocking fs service for now
      const items = await filesystem.listDir(path);
      setFiles(items.map((n: any) => ({ name: n.name, path: path === '/' ? '/' + n.name : path + '/' + n.name, isDir: n.type === 'directory', size: n.size || 0, mtime: n.modifiedAt })));
      setCurrentPath(path);
      setSelected(new Set());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDir(currentPath);
  }, []);

  const navigate = (path: string) => {
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
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const upPath = '/' + parts.join('/');
    navigate(upPath);
  };

  const openItem = (item: FileItem) => {
    if (item.isDir) {
      navigate(item.path);
    } else {
      // Open in Notes if text, else generic
      if (item.name.endsWith('.txt') || item.name.endsWith('.md')) {
        openWindow({ appId: 'notes', title: 'Notes' });
      } else {
        openWindow({ appId: 'notes', title: 'Notes' }); // fallback
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file: item });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200" onClick={() => setContextMenu(null)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex gap-1">
          <button onClick={goBack} disabled={historyIdx === 0} className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50"><ArrowLeft size={18} /></button>
          <button onClick={goForward} disabled={historyIdx === history.length - 1} className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50"><ArrowRight size={18} /></button>
          <button onClick={goUp} disabled={currentPath === '/'} className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50"><ArrowUp size={18} /></button>
        </div>
        
        <div className="flex-1 flex items-center bg-gray-900 px-3 py-1.5 rounded border border-gray-700 text-sm overflow-hidden">
          {currentPath.split('/').map((part, i, arr) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-gray-500 mx-1">/</span>}
              <span className="hover:text-white cursor-pointer hover:underline" onClick={() => {
                const path = arr.slice(0, i + 1).join('/') || '/';
                navigate(path);
              }}>{part || 'root'}</span>
            </React.Fragment>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded py-1 pl-8 pr-2 text-sm focus:outline-none focus:border-blue-500 w-48"
          />
        </div>

        <div className="flex gap-1 ml-2 border-l border-gray-700 pl-2">
          <button onClick={() => setViewMode('grid')} className={clsx("p-1.5 rounded", viewMode === 'grid' ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-400")}><LayoutGrid size={18} /></button>
          <button onClick={() => setViewMode('list')} className={clsx("p-1.5 rounded", viewMode === 'list' ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-400")}><List size={18} /></button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredFiles.map(file => (
              <div 
                key={file.path}
                className={clsx(
                  "flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors text-center",
                  selected.has(file.path) ? "bg-blue-600/30 border border-blue-500/50" : "hover:bg-gray-800 border border-transparent"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.shiftKey) {
                    const newSel = new Set(selected);
                    if (newSel.has(file.path)) newSel.delete(file.path);
                    else newSel.add(file.path);
                    setSelected(newSel);
                  } else {
                    setSelected(new Set([file.path]));
                  }
                }}
                onDoubleClick={() => openItem(file)}
                onContextMenu={(e) => handleContextMenu(e, file)}
              >
                {file.isDir ? <FolderIcon size={48} className="text-blue-400" /> : <FileTextIcon size={48} className="text-gray-400" />}
                <span className="text-sm truncate w-full" title={file.name}>{file.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Date Modified</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium text-right">Size</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map(file => (
                <tr 
                  key={file.path}
                  className={clsx(
                    "border-b border-gray-800/50 cursor-pointer transition-colors",
                    selected.has(file.path) ? "bg-blue-600/20" : "hover:bg-gray-800"
                  )}
                  onClick={(e) => {
                    if (e.shiftKey) {
                      const newSel = new Set(selected);
                      newSel.has(file.path) ? newSel.delete(file.path) : newSel.add(file.path);
                      setSelected(newSel);
                    } else {
                      setSelected(new Set([file.path]));
                    }
                  }}
                  onDoubleClick={() => openItem(file)}
                  onContextMenu={(e) => handleContextMenu(e, file)}
                >
                  <td className="py-2 flex items-center gap-2">
                    {file.isDir ? <FolderIcon size={16} className="text-blue-400" /> : <FileTextIcon size={16} className="text-gray-400" />}
                    {file.name}
                  </td>
                  <td className="py-2 text-gray-400">{new Date(file.mtime).toLocaleString()}</td>
                  <td className="py-2 text-gray-400">{file.isDir ? 'Folder' : 'File'}</td>
                  <td className="py-2 text-right text-gray-400">{file.isDir ? '--' : formatSize(file.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FolderIcon size={48} className="mb-4 opacity-50" />
            <p>This folder is empty.</p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed bg-gray-800 border border-gray-700 shadow-xl rounded py-1 min-w-[160px] z-50 text-sm"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2" onClick={() => { openItem(contextMenu.file!); setContextMenu(null); }}>
            <File size={14} /> Open
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2" onClick={() => setContextMenu(null)}>
            <Copy size={14} /> Copy
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2" onClick={() => setContextMenu(null)}>
            <Edit2 size={14} /> Rename
          </button>
          <div className="border-t border-gray-700 my-1"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-red-900/50 text-red-400 flex items-center gap-2" onClick={() => setContextMenu(null)}>
            <Trash size={14} /> Move to Trash
          </button>
        </div>
      )}
    </div>
  );
}
