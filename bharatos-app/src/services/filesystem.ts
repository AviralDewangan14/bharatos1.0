import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import type { FSNode, FSStats, FSNodeType } from '../types/filesystem';

const DB_NAME = 'bharatos-fs';
const STORE_NAME = 'nodes';

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('parentId', 'parentId');
          store.createIndex('path', 'path'); 
        }
      },
    });
  }
  return dbPromise;
};

export const generateId = () => crypto.randomUUID();

const createNode = (name: string, type: FSNodeType, parentId: string | null = null, content: string = ''): FSNode => ({
  id: generateId(),
  name,
  type,
  parentId,
  content: type === 'file' ? content : undefined,
  createdAt: Date.now(),
  modifiedAt: Date.now(),
  size: content.length,
});

export const initFS = async (): Promise<void> => {
  const db = await getDB();
  const rootExists = await db.get(STORE_NAME, 'root');
  
  if (!rootExists) {
    const rootNode = { ...createNode('', 'directory', null), id: 'root' };
    const homeNode = { ...createNode('home', 'directory', 'root'), id: 'home' };
    const desktopNode = { ...createNode('Desktop', 'directory', 'home'), id: 'desktop' };
    const docsNode = { ...createNode('Documents', 'directory', 'home'), id: 'documents' };
    const downNode = { ...createNode('Downloads', 'directory', 'home'), id: 'downloads' };
    const picsNode = { ...createNode('Pictures', 'directory', 'home'), id: 'pictures' };
    const musicNode = { ...createNode('Music', 'directory', 'home'), id: 'music' };
    const vidsNode = { ...createNode('Videos', 'directory', 'home'), id: 'videos' };
    const trashNode = { ...createNode('Trash', 'directory', 'home'), id: 'trash' };

    // Initial files
    const welcomeFile = createNode(
      'Welcome_to_BharatOS.md',
      'file',
      'documents',
      '# Welcome to BharatOS\n\nBharatOS is a browser-based desktop operating system built with React 18, TypeScript, Tailwind CSS, and IndexedDB.\n\n### Key Features:\n- Persistent virtual filesystem stored in IndexedDB\n- Shell terminal with Unix-style commands (ls, cat, mkdir, rm, etc.)\n- Safe mathematical calculator with recursive-descent parsing\n- Notes editor with auto-save\n- Synthesizer toy powered by Web Audio API\n- Multilingual interface (English & Hindi)\n\nEnjoy exploring your system!'
    );

    const notesFile = createNode(
      'Project_Notes.txt',
      'file',
      'documents',
      'BharatOS Engineering Log\n- Client-side virtual filesystem verified\n- Window stacking and focus tracking active\n- Floating liquid glass dock implemented\n- Color-coded application icon themes active\n'
    );

    const manifestFile = createNode(
      'system_packages.json',
      'file',
      'downloads',
      JSON.stringify(
        {
          os: 'BharatOS',
          version: '1.0.0',
          engine: 'React 18 + Vite',
          filesystem: 'IndexedDB Virtual VFS',
          author: 'Aviral Dewangan'
        },
        null,
        2
      )
    );

    const quickStartFile = createNode(
      'Quick_Start.md',
      'file',
      'desktop',
      '# BharatOS Quick Tips\n\n- Press `Cmd/Win + Space` to trigger the app launcher.\n- Double click on desktop icons or use the bottom dock to launch apps.\n- Right-click anywhere on the desktop to switch wallpapers or create new notes.\n- Open the Terminal to run shell commands on the virtual filesystem.\n'
    );

    const tx = db.transaction(STORE_NAME, 'readwrite');
    await Promise.all([
      tx.store.put(rootNode),
      tx.store.put(homeNode),
      tx.store.put(desktopNode),
      tx.store.put(docsNode),
      tx.store.put(downNode),
      tx.store.put(picsNode),
      tx.store.put(musicNode),
      tx.store.put(vidsNode),
      tx.store.put(trashNode),
      tx.store.put(welcomeFile),
      tx.store.put(notesFile),
      tx.store.put(manifestFile),
      tx.store.put(quickStartFile),
    ]);
    await tx.done;
  }
};

export const resolvePath = (path: string, cwd: string): string => {
  if (!path) return cwd;
  
  let fullPath = path.startsWith('/') ? path : `${cwd}/${path}`;
  // Clean up multiple slashes
  fullPath = fullPath.replace(/\/+/g, '/');
  
  const parts = fullPath.split('/').filter(Boolean);
  const resolved: string[] = [];
  
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  
  return '/' + resolved.join('/');
};

export const getGlobalStats = async () => {
  const db = await getDB();
  const allNodes = await db.getAll(STORE_NAME);
  const files = allNodes.filter((n: any) => n.type === 'file');
  const dirs = allNodes.filter((n: any) => n.type === 'directory');
  const totalSize = files.reduce((acc: number, f: any) => acc + (f.size || f.content?.length || 0), 0);

  let quotaUsedMb = (totalSize / (1024 * 1024)).toFixed(2);
  let quotaTotalGb = '50.0';
  let percentUsed = 2;

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const est = await navigator.storage.estimate();
      const used = (est.usage || totalSize) / (1024 * 1024);
      const total = (est.quota || 50 * 1024 * 1024 * 1024) / (1024 * 1024 * 1024);
      quotaUsedMb = used < 0.1 ? (used * 1024).toFixed(1) + ' KB' : used.toFixed(2) + ' MB';
      quotaTotalGb = total.toFixed(1) + ' GB';
      percentUsed = Math.min(100, Math.max(2, Math.round(((est.usage || totalSize) / (est.quota || 1)) * 100)));
    } catch {}
  }

  return {
    totalFiles: files.length,
    totalDirs: dirs.length,
    totalSize,
    quotaUsedMb,
    quotaTotalGb,
    percentUsed
  };
};

const getNodeById = async (id: string): Promise<FSNode | null> => {
  const db = await getDB();
  return (await db.get(STORE_NAME, id)) || null;
};

export const getNodeByPath = async (path: string): Promise<FSNode | null> => {
  const cleanPath = path === '/' ? '/' : path.replace(/\/$/, '');
  if (cleanPath === '/') return getNodeById('root');
  
  const parts = cleanPath.split('/').filter(Boolean);
  let currentId = 'root';
  
  for (let i = 0; i < parts.length; i++) {
    const children = await getChildren(currentId);
    const child = children.find(c => c.name === parts[i]);
    if (!child) return null;
    currentId = child.id;
  }
  
  return getNodeById(currentId);
};

export const getChildren = async (dirId: string): Promise<FSNode[]> => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('parentId');
  return index.getAll(dirId);
};

export const listDir = async (path: string): Promise<FSNode[]> => {
  const node = await getNodeByPath(path);
  if (!node || node.type !== 'directory') throw new Error('Not a directory');
  return getChildren(node.id);
};

const getParentDir = async (path: string): Promise<{ parent: FSNode, name: string }> => {
  const cleanPath = path.replace(/\/$/, '');
  const parts = cleanPath.split('/').filter(Boolean);
  const name = parts.pop() || '';
  const parentPath = '/' + parts.join('/');
  
  const parent = await getNodeByPath(parentPath);
  if (!parent) throw new Error('Parent directory does not exist');
  if (parent.type !== 'directory') throw new Error('Parent is not a directory');
  
  return { parent, name };
};

export const createFile = async (path: string, content: string = ''): Promise<FSNode> => {
  const { parent, name } = await getParentDir(path);
  const existing = await getNodeByPath(path);
  if (existing) throw new Error('File already exists');
  
  const newNode = createNode(name, 'file', parent.id, content);
  const db = await getDB();
  await db.put(STORE_NAME, newNode);
  return newNode;
};

export const createDir = async (path: string): Promise<FSNode> => {
  const { parent, name } = await getParentDir(path);
  const existing = await getNodeByPath(path);
  if (existing) throw new Error('Directory already exists');
  
  const newNode = createNode(name, 'directory', parent.id);
  const db = await getDB();
  await db.put(STORE_NAME, newNode);
  return newNode;
};

export const readFile = async (path: string): Promise<string> => {
  const node = await getNodeByPath(path);
  if (!node) throw new Error('File not found');
  if (node.type !== 'file') throw new Error('Not a file');
  return node.content || '';
};

export const writeFile = async (path: string, content: string): Promise<void> => {
  const node = await getNodeByPath(path);
  const db = await getDB();
  if (node) {
    if (node.type !== 'file') throw new Error('Not a file');
    node.content = content;
    node.modifiedAt = Date.now();
    node.size = content.length;
    await db.put(STORE_NAME, node);
  } else {
    await createFile(path, content);
  }
};

export const deleteNode = async (path: string): Promise<void> => {
  const node = await getNodeByPath(path);
  if (!node) throw new Error('Not found');
  
  const db = await getDB();
  
  // recursive delete for directories
  const deleteRecursive = async (id: string) => {
    const children = await getChildren(id);
    for (const child of children) {
      await deleteRecursive(child.id);
    }
    await db.delete(STORE_NAME, id);
  };
  
  await deleteRecursive(node.id);
};

export const rename = async (path: string, newName: string): Promise<void> => {
  const node = await getNodeByPath(path);
  if (!node) throw new Error('Not found');
  
  const db = await getDB();
  node.name = newName;
  node.modifiedAt = Date.now();
  await db.put(STORE_NAME, node);
};

export const moveNode = async (srcPath: string, destPath: string): Promise<void> => {
  const node = await getNodeByPath(srcPath);
  if (!node) throw new Error('Source not found');
  
  const { parent, name } = await getParentDir(destPath);
  
  const db = await getDB();
  node.parentId = parent.id;
  node.name = name;
  node.modifiedAt = Date.now();
  
  await db.put(STORE_NAME, node);
};

export const copyNode = async (srcPath: string, destPath: string): Promise<void> => {
  const node = await getNodeByPath(srcPath);
  if (!node) throw new Error('Source not found');
  
  const { parent, name } = await getParentDir(destPath);
  
  const copyRecursive = async (srcNode: FSNode, targetParentId: string, targetName: string) => {
    const newNode = createNode(targetName, srcNode.type, targetParentId, srcNode.content || '');
    const db = await getDB();
    await db.put(STORE_NAME, newNode);
    
    if (srcNode.type === 'directory') {
      const children = await getChildren(srcNode.id);
      for (const child of children) {
        await copyRecursive(child, newNode.id, child.name);
      }
    }
  };
  
  await copyRecursive(node, parent.id, name);
};

export const stat = async (path: string): Promise<FSStats> => {
  const node = await getNodeByPath(path);
  if (!node) throw new Error('Not found');
  return {
    size: node.size || 0,
    type: node.type,
    createdAt: new Date(node.createdAt),
    modifiedAt: new Date(node.modifiedAt),
    name: node.name,
    path: path
  };
};

export const exists = async (path: string): Promise<boolean> => {
  const node = await getNodeByPath(path);
  return node !== null;
};

export const search = async (query: string, startPath: string = '/'): Promise<FSNode[]> => {
  const startNode = await getNodeByPath(startPath);
  if (!startNode) return [];
  
  const results: FSNode[] = [];
  const db = await getDB();
  const allNodes = await db.getAll(STORE_NAME);
  
  const searchRecursive = (nodeId: string) => {
    const node = allNodes.find(n => n.id === nodeId);
    if (!node) return;
    
    if (node.name.toLowerCase().includes(query.toLowerCase())) {
      results.push(node);
    }
    
    const children = allNodes.filter(n => n.parentId === nodeId);
    for (const child of children) {
      searchRecursive(child.id);
    }
  };
  
  searchRecursive(startNode.id);
  return results;
};
