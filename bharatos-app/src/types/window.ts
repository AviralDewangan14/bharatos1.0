/**
 * Types for the window management system.
 * Each app runs inside a Window — these define how windows
 * track their position, size, and state.
 */

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon?: string;
  position: WindowPosition;
  size: WindowSize;
  minSize?: WindowSize;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  // stash the position/size before maximize so we can restore
  preMaximize?: { position: WindowPosition; size: WindowSize };
}

// what we need to open a new window
export interface OpenWindowOptions {
  appId: string;
  title: string;
  icon?: string;
  position?: WindowPosition;
  size?: WindowSize;
  minSize?: WindowSize;
}
