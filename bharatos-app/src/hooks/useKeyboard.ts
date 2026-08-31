import { useEffect } from 'react';

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  handler: (e: KeyboardEvent) => void;
};

// Global registry for shortcuts
const shortcuts: KeyboardShortcut[] = [];

export const registerShortcut = (shortcut: KeyboardShortcut) => {
  shortcuts.push(shortcut);
  return () => {
    const idx = shortcuts.indexOf(shortcut);
    if (idx > -1) shortcuts.splice(idx, 1);
  };
};

export const useKeyboard = (shortcut: KeyboardShortcut) => {
  useEffect(() => {
    return registerShortcut(shortcut);
  }, [shortcut]); // Only re-register if shortcut reference changes
};

// Global listener hook (to be mounted once at root, or just managed as a side effect)
export const initGlobalKeyboardListener = () => {
  if (typeof window === 'undefined') return;

  const handleKeyDown = (e: KeyboardEvent) => {
    // Walk backwards so newest shortcuts take precedence
    for (let i = shortcuts.length - 1; i >= 0; i--) {
      const s = shortcuts[i];
      if (
        e.key.toLowerCase() === s.key.toLowerCase() &&
        !!s.ctrl === e.ctrlKey &&
        !!s.alt === e.altKey &&
        !!s.shift === e.shiftKey &&
        !!s.meta === e.metaKey
      ) {
        e.preventDefault(); // commonly what we want for shortcuts
        s.handler(e);
        break; // stop at first matching
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
};
