import React, { useState, useRef } from 'react';
import type { AppComponentProps } from '../../types/app';
import { ArrowLeft, ArrowRight, RotateCw, Search, Star } from 'lucide-react';
import clsx from 'clsx';

export default function BrowserApp({ windowId: _windowId }: AppComponentProps) {
  const [url, setUrl] = useState('browser://welcome');
  const [inputUrl, setInputUrl] = useState('browser://welcome');
  const [history, setHistory] = useState<string[]>(['browser://welcome']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const bookmarks = [
    { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com' },
    { name: 'Example', url: 'https://example.com' },
  ];

  const navigateTo = (newUrl: string) => {
    let finalUrl = newUrl;
    if (!finalUrl.startsWith('http') && !finalUrl.startsWith('browser://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    setInputUrl(finalUrl);
    setUrl(finalUrl);
    setError(null);
    setLoading(true);

    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(finalUrl);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  };

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      setUrl(history[newIdx]);
      setInputUrl(history[newIdx]);
      setError(null);
      setLoading(true);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      setUrl(history[newIdx]);
      setInputUrl(history[newIdx]);
      setError(null);
      setLoading(true);
    }
  };

  const reload = () => {
    if (iframeRef.current) {
      setLoading(true);
      setError(null);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const onLoad = () => {
    setLoading(false);
  };

  const onError = () => {
    setLoading(false);
    setError('Failed to load page. The site might refuse to be framed (X-Frame-Options).');
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 text-gray-900">
      {/* Toolbar */}
      <div className="flex flex-col border-b border-gray-300 bg-gray-200">
        <div className="flex items-center gap-2 p-2">
          <button onClick={goBack} disabled={historyIdx === 0} className="p-1.5 rounded hover:bg-gray-300 disabled:opacity-50 text-gray-700"><ArrowLeft size={18} /></button>
          <button onClick={goForward} disabled={historyIdx === history.length - 1} className="p-1.5 rounded hover:bg-gray-300 disabled:opacity-50 text-gray-700"><ArrowRight size={18} /></button>
          <button onClick={reload} className="p-1.5 rounded hover:bg-gray-300 text-gray-700"><RotateCw size={18} className={clsx(loading && "animate-spin")} /></button>
          
          <form onSubmit={handleGo} className="flex-1 flex bg-white rounded-full border border-gray-300 px-3 py-1.5 items-center overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-inner">
            <Search size={14} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
              placeholder="Search or enter web address"
            />
          </form>
        </div>
        
        {/* Bookmarks */}
        <div className="flex items-center gap-1 px-3 pb-1 text-xs">
          {bookmarks.map(b => (
            <button key={b.name} onClick={() => navigateTo(b.url)} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-300 text-gray-600">
              <Star size={12} className="text-gray-400" /> {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative bg-white">
        {url === 'browser://welcome' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Bharat Web</h1>
            <p className="text-gray-600 max-w-md">Welcome to the decentralized web. Please note that many modern websites block embedding via iframes for security reasons.</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-center p-8 text-red-800">
            <p>{error}</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            onLoad={onLoad}
            onError={onError}
            title="browser-content"
          />
        )}
        
        {loading && url !== 'browser://welcome' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
            <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
