import { useState, useEffect,   } from 'react';
import type { AppComponentProps } from '../../types/app';
import * as filesystem from '../../services/filesystem';
import { Plus, Trash, Search, Save, FileText } from 'lucide-react';
import clsx from 'clsx';

type Note = { name: string; path: string };

export default function NotesApp({ windowId: _windowId }: AppComponentProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [unsaved, setUnsaved] = useState(false);

  const notesDir = '/home/Documents';

  const loadNotes = async () => {
    try {
      try { await filesystem.createDir(notesDir); } catch(e) {}
      const items = await filesystem.listDir(notesDir);
      const txtFiles = items.filter((i: any) => !i.isDir && (i.name.endsWith('.txt') || i.name.endsWith('.md')));
      setNotes(txtFiles.map((n: any) => ({ name: n.name, path: notesDir + '/' + n.name })));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const openNote = async (path: string) => {
    if (unsaved && activeNote) {
      await saveNote(activeNote, content);
    }
    try {
      const text = await filesystem.readFile(path);
      setContent(text);
      setActiveNote(path);
      setUnsaved(false);
    } catch (e) {
      console.error(e);
    }
  };

  const saveNote = async (path: string, text: string) => {
    try {
      await filesystem.writeFile(path, text);
      setUnsaved(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-save debounce
  useEffect(() => {
    if (!activeNote || !unsaved) return;
    const timer = setTimeout(() => {
      saveNote(activeNote, content);
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, activeNote, unsaved]);

  const createNewNote = async () => {
    const name = `Note_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.txt`;
    const path = `${notesDir}/${name}`;
    await filesystem.writeFile(path, '');
    await loadNotes();
    openNote(path);
  };

  const deleteNote = async (path: string) => {
    try {
      await filesystem.deleteNode(path);
      if (activeNote === path) {
        setActiveNote(null);
        setContent('');
      }
      await loadNotes();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredNotes = notes.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));
  const activeNoteObj = notes.find(n => n.path === activeNote);

  return (
    <div className="flex h-full bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800/50 border-r border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold text-gray-100 flex items-center gap-2"><FileText size={16}/> Notes</h2>
          <button onClick={createNewNote} className="p-1 hover:bg-gray-700 rounded text-gray-300">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="p-2 border-b border-gray-700">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded py-1 pl-7 pr-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.map(note => (
            <div 
              key={note.path}
              onClick={() => openNote(note.path)}
              className={clsx(
                "p-2 rounded cursor-pointer flex justify-between items-center group text-sm transition-colors",
                activeNote === note.path ? "bg-blue-600/30 text-blue-100" : "hover:bg-gray-700/50"
              )}
            >
              <span className="truncate flex-1">{note.name.replace('.txt', '').replace('.md', '')}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteNote(note.path); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-gray-500"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="text-center text-gray-500 text-sm mt-4">No notes found.</div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            <div className="p-3 bg-gray-800/30 border-b border-gray-700 flex justify-between items-center">
              <input 
                type="text"
                value={activeNoteObj?.name || ''}
                onChange={async (e) => {
                  // Basic rename logic
                  const newName = e.target.value;
                  if (!newName) return;
                  const newPath = `${notesDir}/${newName}`;
                  await filesystem.rename(activeNote, newPath);
                  setActiveNote(newPath);
                  loadNotes();
                }}
                className="bg-transparent border-none outline-none font-semibold text-lg flex-1"
              />
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {unsaved ? <span className="text-yellow-500">Unsaved</span> : <span className="flex items-center gap-1"><Save size={14}/> Saved</span>}
              </div>
            </div>
            
            <textarea 
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setUnsaved(true);
              }}
              className="flex-1 w-full bg-gray-900 text-gray-200 p-4 outline-none resize-none font-sans"
              placeholder="Start typing..."
              spellCheck={false}
            />
            
            <div className="p-1 px-4 bg-gray-800 text-xs text-gray-500 border-t border-gray-700 flex justify-between">
              <span>{content.split(/\s+/).filter(Boolean).length} words</span>
              <span>{content.length} characters</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <FileText size={48} className="mb-4 opacity-30" />
            <p>Select a note or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
