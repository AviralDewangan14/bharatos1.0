import { useRef, useCallback, useEffect } from 'react';

export const useDrag = (onDrag: (dx: number, dy: number) => void) => {
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    
    lastPos.current = { x: e.clientX, y: e.clientY };
    onDrag(dx, dy);
  }, [onDrag]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const onMouseDown = useCallback((e: React.MouseEvent | MouseEvent) => {
    // Only left click
    if ('button' in e && e.button !== 0) return;
    
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  // Cleanup on unmount just in case
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { onMouseDown };
};
