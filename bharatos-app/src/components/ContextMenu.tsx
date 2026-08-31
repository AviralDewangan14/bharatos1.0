import { useEffect, useRef  } from 'react';
import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';

interface MenuItem {
  label?: string;
  onClick?: () => void;
  icon?: string;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  items: MenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Ensure menu stays within viewport bounds
  let posX = position.x;
  let posY = position.y;
  
  if (menuRef.current) {
    const rect = menuRef.current.getBoundingClientRect();
    if (posX + rect.width > window.innerWidth) {
      posX = window.innerWidth - rect.width - 5;
    }
    if (posY + rect.height > window.innerHeight - 48) { // -48 for taskbar
      posY = window.innerHeight - rect.height - 53;
    }
  }

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={16} className="mr-3 text-gray-400" /> : <div className="w-4 mr-3" />;
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[200] w-64 py-1.5 bg-gray-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
      style={{ left: posX, top: posY }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, idx) => {
        if (item.divider) {
          return <div key={idx} className="h-px bg-white/10 my-1 mx-2" />;
        }

        return (
          <button
            key={idx}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
            className={clsx(
              "w-full flex items-center px-4 py-2 text-sm text-left transition-colors",
              item.disabled ? "text-gray-500 cursor-not-allowed" : "text-gray-200 hover:bg-[#d4722a]/80 hover:text-white"
            )}
          >
            {item.icon && getIcon(item.icon)}
            {!item.icon && <div className="w-4 mr-3" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
