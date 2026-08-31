import React, { useState, useEffect } from 'react';
import type { AppComponentProps } from '../../types/app';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2, Play, Pause } from 'lucide-react';
import clsx from 'clsx';

export default function GalleryApp({ windowId: _windowId }: AppComponentProps) {
  const [images] = useState([
    { id: 1, name: 'Default Wallpaper', src: '/wallpapers/default.jpg', type: 'wallpaper' },
    { id: 2, name: 'Nature', src: '/wallpapers/nature.jpg', type: 'wallpaper' },
    { id: 3, name: 'Abstract', src: '/wallpapers/abstract.jpg', type: 'wallpaper' },
    { id: 4, name: 'Space', src: '/wallpapers/space.jpg', type: 'wallpaper' },
    // Mock local images
    { id: 5, name: 'Screenshot_1.png', src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTVhYWZmIiAvPjwvc3ZnPg==', type: 'local' },
    { id: 6, name: 'Design_Mockup.jpg', src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY1NWFhIiAvPjwvc3ZnPg==', type: 'local' },
  ]);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideshow, setSlideshow] = useState(false);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    let timer: any;
    if (slideshow && viewerOpen) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [slideshow, viewerOpen, images.length]);

  const openViewer = (idx: number) => {
    setCurrentIndex(idx);
    setViewerOpen(true);
    setSlideshow(false);
    setZoom(false);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSlideshow(false);
  };

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200 relative">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2"><ImageIcon size={20}/> Gallery</h2>
        <div className="text-sm text-gray-400">{images.length} items</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div 
              key={img.id} 
              className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer group relative border border-gray-700 hover:border-blue-500 transition-colors"
              onClick={() => openViewer(idx)}
            >
              {/* Fallback for invalid paths since we don't have real files */}
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${img.src}), linear-gradient(45deg, #1f2937, #374151)` }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {img.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Viewer */}
      {viewerOpen && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white/80 z-10">
            <div className="text-sm font-medium">{images[currentIndex].name}</div>
            <div className="flex gap-4">
              <button onClick={() => setSlideshow(!slideshow)} className="hover:text-white" title="Slideshow">
                {slideshow ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={() => setZoom(!zoom)} className="hover:text-white" title="Toggle Zoom">
                <Maximize2 size={20} />
              </button>
              <button onClick={closeViewer} className="hover:text-white" title="Close">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center overflow-hidden" onClick={() => setZoom(!zoom)}>
            <div 
              className={clsx(
                "w-full h-full bg-no-repeat bg-center transition-all duration-300 cursor-pointer",
                zoom ? "bg-auto" : "bg-contain"
              )}
              style={{ backgroundImage: `url(${images[currentIndex].src}), linear-gradient(45deg, #1f2937, #374151)` }}
            />
            
            <button 
              onClick={prev}
              className="absolute left-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next}
              className="absolute right-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="p-4 text-center text-xs text-white/50">
            {currentIndex + 1} of {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
