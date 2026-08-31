import { useRef, useCallback, useEffect } from 'react';

export const useResize = (onResize: (dw: number, dh: number, dx: number, dy: number) => void) => {
  const isResizing = useRef(false);
  const activeEdge = useRef<string | null>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !activeEdge.current) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    lastPos.current = { x: e.clientX, y: e.clientY };

    let resizeDx = 0;
    let resizeDy = 0;
    let resizeDw = 0;
    let resizeDh = 0;

    switch (activeEdge.current) {
      case 'right':
        resizeDw = dx;
        break;
      case 'bottom':
        resizeDh = dy;
        break;
      case 'bottom-right':
        resizeDw = dx;
        resizeDh = dy;
        break;
      // You could add top, left, etc. here if needed
    }

    onResize(resizeDw, resizeDh, resizeDx, resizeDy);
  }, [onResize]);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    activeEdge.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const onMouseDown = useCallback((edge: string) => (e: React.MouseEvent | MouseEvent) => {
    e.stopPropagation(); // prevent drag handler if overlapping
    
    isResizing.current = true;
    activeEdge.current = edge;
    lastPos.current = { x: e.clientX, y: e.clientY };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { onMouseDown };
};
