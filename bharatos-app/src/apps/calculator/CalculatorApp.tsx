import { useState, useEffect, useCallback } from 'react';
import type { AppComponentProps } from '../../types/app';
import { parseAndEvaluate } from './parser';
import clsx from 'clsx';
import { History, Delete } from 'lucide-react';

export default function CalculatorApp({ windowId: _windowId }: AppComponentProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleInput = useCallback((val: string) => {
    if (result !== '' && !/[+\-*/%^]/.test(val)) {
      setExpression(val);
      setResult('');
    } else if (result !== '' && /[+\-*/%^]/.test(val)) {
      setExpression(result + val);
      setResult('');
    } else {
      setExpression((prev) => prev + val);
    }
  }, [result]);

  const calculate = useCallback(() => {
    if (!expression) return;
    try {
      const res = parseAndEvaluate(expression);
      const resStr = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(8)).toString();
      setResult(resStr);
      setHistory(prev => [{ expr: expression, res: resStr }, ...prev].slice(0, 20));
    } catch (err) {
      setResult('Error');
    }
  }, [expression]);

  const clear = () => {
    setExpression('');
    setResult('');
  };

  const clearEntry = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9.+\-*/%^()]/.test(key)) {
        e.preventDefault();
        handleInput(key);
      } else if (key === 'Enter') {
        e.preventDefault();
        calculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        clearEntry();
      } else if (key === 'Escape') {
        e.preventDefault();
        clear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, calculate]);

  const buttons = [
    { label: 'C', onClick: clear, type: 'danger' },
    { label: 'CE', onClick: clearEntry, type: 'danger' },
    { label: '(', onClick: () => handleInput('('), type: 'operator' },
    { label: ')', onClick: () => handleInput(')'), type: 'operator' },
    { label: '7', onClick: () => handleInput('7'), type: 'number' },
    { label: '8', onClick: () => handleInput('8'), type: 'number' },
    { label: '9', onClick: () => handleInput('9'), type: 'number' },
    { label: '/', onClick: () => handleInput('/'), type: 'operator' },
    { label: '4', onClick: () => handleInput('4'), type: 'number' },
    { label: '5', onClick: () => handleInput('5'), type: 'number' },
    { label: '6', onClick: () => handleInput('6'), type: 'number' },
    { label: '*', onClick: () => handleInput('*'), type: 'operator' },
    { label: '1', onClick: () => handleInput('1'), type: 'number' },
    { label: '2', onClick: () => handleInput('2'), type: 'number' },
    { label: '3', onClick: () => handleInput('3'), type: 'number' },
    { label: '-', onClick: () => handleInput('-'), type: 'operator' },
    { label: '0', onClick: () => handleInput('0'), type: 'number' },
    { label: '.', onClick: () => handleInput('.'), type: 'number' },
    { label: '=', onClick: calculate, type: 'operator' },
    { label: '+', onClick: () => handleInput('+'), type: 'operator' },
  ];

  return (
    <div className="flex h-full bg-gray-900 text-white select-none">
      <div className={clsx("flex-1 flex flex-col p-4", showHistory ? "w-2/3" : "w-full")}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-semibold text-gray-400">Calculator</div>
          <button onClick={() => setShowHistory(!showHistory)} className="p-1 hover:bg-gray-800 rounded">
            <History size={18} />
          </button>
        </div>
        
        <div className="flex-1 bg-gray-800 rounded-lg p-4 flex flex-col justify-end items-end mb-4 border border-gray-700 shadow-inner overflow-hidden">
          <div className="text-gray-400 text-lg mb-1 truncate w-full text-right h-7">{expression}</div>
          <div className="text-4xl font-semibold truncate w-full text-right h-10">{result}</div>
        </div>

        <div className="grid grid-cols-4 gap-2 flex-[2]">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={clsx(
                "rounded-lg text-xl font-medium transition-colors duration-150 flex items-center justify-center py-3",
                btn.type === 'number' && "bg-gray-700/50 hover:bg-gray-600/50 text-gray-100",
                btn.type === 'operator' && "bg-orange-600/80 hover:bg-orange-500/80 text-white",
                btn.type === 'danger' && "bg-red-600/60 hover:bg-red-500/60 text-white"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {showHistory && (
        <div className="w-1/3 bg-gray-950 border-l border-gray-800 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-200">History</h3>
            <button onClick={() => setHistory([])} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-red-400">
              <Delete size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {history.length === 0 ? (
              <div className="text-gray-500 text-sm text-center mt-4">No history yet</div>
            ) : (
              history.map((item, i) => (
                <div key={i} className="text-right hover:bg-gray-900 p-2 rounded cursor-pointer transition-colors" onClick={() => {
                  setExpression(item.expr);
                  setResult(item.res);
                }}>
                  <div className="text-gray-400 text-sm">{item.expr} =</div>
                  <div className="text-gray-200 font-medium text-lg">{item.res}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
