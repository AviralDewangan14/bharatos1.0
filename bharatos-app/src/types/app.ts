/**
 * App definitions.
 *
 * Every app in the OS registers itself here.
 * The launcher and taskbar use this to figure out
 * what to show.
 */

import type { ComponentType } from 'react';
import type { WindowSize } from './window';

export type AppCategory =
  | 'system'
  | 'utilities'
  | 'productivity'
  | 'media'
  | 'development'
  | 'internet';

export interface AppDefinition {
  id: string;
  name: string;
  icon: string; // lucide icon name
  category: AppCategory;
  description: string;
  // the React component that renders inside the window
  component: ComponentType<AppComponentProps>;
  defaultSize?: WindowSize;
  minSize?: WindowSize;
  // show on desktop? pinned to dock?
  showOnDesktop?: boolean;
  pinnedToDock?: boolean;
  // single instance only?
  singleton?: boolean;
}

// every app component gets these props from the window shell
export interface AppComponentProps {
  windowId: string;
}
