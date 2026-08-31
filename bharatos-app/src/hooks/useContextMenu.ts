import { useState, useCallback, useEffect } from 'react';

export const useContextMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onContextMenu = useCallback((e: React.MouseEvent | MouseEvent) => {
    e.preventDefault();
    
    // Simple viewport containment heuristic
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // Assume menu is approx 200px wide, 250px high max for quick calculation
    // A more robust implementation would use a ref on the rendered menu to adjust,
    // but this gives a snappy native feel without layout thrashing.
    const menuWidth = 200; 
    const menuHeight = 250;
    
    const x = (clickX + menuWidth > window.innerWidth) ? window.innerWidth - menuWidth : clickX;
    const y = (clickY + menuHeight > window.innerHeight) ? window.innerHeight - menuHeight : clickY;
    
    setMenuPosition({ x, y });
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleGlobalClick = () => closeMenu();
      window.addEventListener('click', handleGlobalClick);
      window.addEventListener('contextmenu', handleGlobalClick); // close if right clicked elsewhere
      
      return () => {
        window.removeEventListener('click', handleGlobalClick);
        window.removeEventListener('contextmenu', handleGlobalClick);
      };
    }
  }, [isOpen, closeMenu]);

  return {
    menuPosition,
    isOpen,
    onContextMenu,
    closeMenu
  };
};
