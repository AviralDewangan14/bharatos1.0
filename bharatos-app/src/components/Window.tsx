import React, { useRef, useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import clsx from 'clsx';
import { useWindowStore } from '../stores/windowStore';
import { sound } from '../services/sound';
import type { WindowState } from '../types/window';

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

export function Window({ windowState, children }: WindowProps) {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
  } = useWindowStore();

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getIcon = (iconName: string) => { const IconCmp = (LucideIcons as any)[iconName] || LucideIcons.Box; return <IconCmp size={16} />; };

  const { id, title, position, size, isMinimized, isMaximized, isFocused, minSize, icon } = windowState;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        if (isMaximized) return;
        moveWindow(id, {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (isResizing) {
        let newWidth = size.width;
        let newHeight = size.height;
        const minW = minSize?.width || 300;
        const minH = minSize?.height || 200;

        if (isResizing.includes('r')) {
          newWidth = Math.max(minW, e.clientX - position.x);
        }
        if (isResizing.includes('b')) {
          newHeight = Math.max(minH, e.clientY - position.y);
        }
        resizeWindow(id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, id, dragOffset, position, size, isMaximized, minSize, moveWindow, resizeWindow]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.window-controls')) return;
    focusWindow(id);
    if (!isMaximized) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    focusWindow(id);
    setIsResizing(type);
  };

  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      onMouseDown={() => focusWindow(id)}
      className={clsx(
        'absolute flex flex-col overflow-hidden bg-gray-900/90 backdrop-blur-xl transition-shadow',
        isMaximized ? 'inset-0 mb-[48px]' : 'rounded-xl shadow-2xl',
        isFocused ? 'border border-white/20 shadow-black/50 z-50' : 'border border-white/5 shadow-black/20 z-40'
      )}
      style={
        isMaximized
          ? {}
          : {
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
            }
      }
    >
      <div
        className="flex items-center justify-between h-10 px-3 bg-white/5 select-none cursor-default"
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={() => maximizeWindow(id)}
      >
        <div className="flex items-center gap-2 overflow-hidden text-gray-300">
          {icon && getIcon(icon)}
          <span className="text-sm font-medium truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 window-controls ml-2">
          <button
            onClick={() => {
              minimizeWindow(id);
              sound.playWindowClose(0.12);
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => {
              maximizeWindow(id);
              sound.playClick(0.12);
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Maximize2 size={14} /> : <Square size={14} />}
          </button>
          <button
            onClick={() => {
              closeWindow(id);
              sound.playWindowClose(0.15);
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-red-500/80 rounded-full transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        {children}
      </div>

      {!isMaximized && (
        <>
          <div
            className="absolute top-0 right-0 w-2 h-full cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'r')}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'b')}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, 'rb')}
          />
        </>
      )}
    </div>
  );
}
