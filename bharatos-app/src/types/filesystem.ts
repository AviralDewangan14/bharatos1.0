/**
 * Virtual filesystem types.
 *
 * The FS is a tree stored in IndexedDB.
 * Each node has a unique id, a name, a type, and
 * a reference to its parent (null for root).
 */

export type FSNodeType = 'file' | 'directory';

export interface FSNode {
  id: string;
  name: string;
  type: FSNodeType;
  parentId: string | null;
  // only files have content
  content?: string;
  createdAt: number;
  modifiedAt: number;
  size: number; // in bytes, 0 for dirs
}

// what we return from stat()
export interface FSStats {
  name: string;
  type: FSNodeType;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  path: string;
  childCount?: number; // only for directories
}
