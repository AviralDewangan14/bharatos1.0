import React, { useState, useEffect, useRef } from 'react';
import type { AppComponentProps } from '../../types/app';
import * as shellService from '../../services/shell';
import clsx from 'clsx';

type Line = { type: 'input' | 'output' | 'error'; text: string };

export default function TerminalApp({ windowId: _windowId }: AppComponentProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: 'BharatOS Terminal v1.0' },
    { type: 'output', text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/home');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    
    setLines(prev => [...prev, { type: 'input', text: `user@bharatos:${cwd}$ ${trimmed}` }]);
    setHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    try {
      const result = await shellService.executeCommand(trimmed, cwd);
      if (result.newCwd) {
        setCwd(result.newCwd);
      }
      if (result.output) {
        setLines(prev => [...prev, { type: 'output', text: result.output }]);
      }
      if (!result.output && !result.newCwd) {
        setLines(prev => [...prev, { type: 'error', text: "" }]);
      }
    } catch (e: any) {
      setLines(prev => [...prev, { type: 'error', text: e.message || 'Command failed' }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx < history.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-gray-950 text-gray-200 font-mono text-sm p-2 overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap break-words custom-scrollbar">
        {lines.map((line, i) => (
          <div key={i} className={clsx(
            "mb-1",
            line.type === 'error' ? "text-red-400" : "text-gray-300",
            line.type === 'input' ? "text-gray-100" : ""
          )}>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      <div className="flex items-center mt-2">
        <span className="text-green-400 mr-2 shrink-0">user@bharatos:{cwd}$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-gray-100 caret-gray-100"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
