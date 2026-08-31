import type { MouseEvent } from 'react';
import { useState} from 'react';
import { useDesktopStore } from '../stores/desktopStore';
import { useAppRegistry } from '../stores/appRegistry';
import { useWindowStore } from '../stores/windowStore';
import { Window } from './Window';
import { ContextMenu } from './ContextMenu';
import * as LucideIcons from 'lucide-react';
import type { AppDefinition } from '../types/app';

export function Desktop() {
  const { wallpaper } = useDesktopStore();
  const { apps } = useAppRegistry();
  const { windows, openWindow } = useWindowStore();
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const desktopApps = apps.filter(app => app.showOnDesktop);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleAppClick = (app: AppDefinition) => {
    openWindow({
      appId: app.id,
      title: app.name,
      icon: app.icon,
      // Default positions/sizes could be dynamic
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
    });
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Box;
    return <Icon size={32} />;
  };

  return (
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})`, backgroundColor: '#0f1419' }}
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <div className="p-4 grid grid-flow-col auto-rows-max gap-4 h-full content-start items-start">
        {desktopApps.map(app => (
          <div
            key={app.id}
            onClick={() => handleAppClick(app)}
            className="flex flex-col items-center gap-1 w-20 p-2 rounded-lg hover:bg-white/10 cursor-pointer group transition-colors"
          >
            <div className="text-gray-100 drop-shadow-md">
              {getIcon(app.icon || 'Box')}
            </div>
            <span className="text-xs text-center text-white drop-shadow-md font-medium px-1 truncate w-full group-hover:whitespace-normal">
              {app.name}
            </span>
          </div>
        ))}
      </div>

      {windows.map(win => (
        <Window key={win.id} windowState={win}>
          {/* Here we'd render the actual app component based on win.appId */}
          <div className="p-4 text-gray-300">App: {win.appId} content</div>
        </Window>
      ))}

      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onClose={closeContextMenu}
          items={[
            { label: 'New Folder', icon: 'FolderPlus', onClick: () => console.log('New Folder') },
            { label: 'New File', icon: 'FilePlus', onClick: () => console.log('New File') },
            { divider: true },
            { label: 'Change Wallpaper', icon: 'Image', onClick: () => console.log('Wallpaper') },
            { label: 'Settings', icon: 'Settings', onClick: () => console.log('Settings') },
            { divider: true },
            { label: 'Refresh', icon: 'RefreshCw', onClick: () => console.log('Refresh') },
          ]}
        />
      )}
    </div>
  );
}
