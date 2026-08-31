import { useState, useEffect, useRef  } from 'react';
import type { AppComponentProps } from '../../types/app';
import { Music as MusicIcon, Volume2, Settings2 } from 'lucide-react';
import clsx from 'clsx';

const KEYS = [
  { note: 'C4', key: 'a', type: 'white', freq: 261.63 },
  { note: 'C#4', key: 'w', type: 'black', freq: 277.18 },
  { note: 'D4', key: 's', type: 'white', freq: 293.66 },
  { note: 'D#4', key: 'e', type: 'black', freq: 311.13 },
  { note: 'E4', key: 'd', type: 'white', freq: 329.63 },
  { note: 'F4', key: 'f', type: 'white', freq: 349.23 },
  { note: 'F#4', key: 't', type: 'black', freq: 369.99 },
  { note: 'G4', key: 'g', type: 'white', freq: 392.00 },
  { note: 'G#4', key: 'y', type: 'black', freq: 415.30 },
  { note: 'A4', key: 'h', type: 'white', freq: 440.00 },
  { note: 'A#4', key: 'u', type: 'black', freq: 466.16 },
  { note: 'B4', key: 'j', type: 'white', freq: 493.88 },
  { note: 'C5', key: 'k', type: 'white', freq: 523.25 },
];

export default function MusicApp({ windowId: _windowId }: AppComponentProps) {
  const [volume, setVolume] = useState(0.5);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGainRef.current = audioCtxRef.current.createGain();
        masterGainRef.current.connect(audioCtxRef.current.destination);
      }
      if (masterGainRef.current) {
        masterGainRef.current.gain.value = volume;
      }
    };
    
    // User interaction required to start audio context usually, but we'll init eagerly
    initAudio();

    return () => {
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    };
  }, []);

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [volume]);

  const playNote = (noteId: string, freq: number) => {
    if (!audioCtxRef.current || !masterGainRef.current || oscillatorsRef.current.has(noteId)) return;
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.type = waveform;
    osc.frequency.value = freq;
    
    // Envelope to avoid clicks
    gainNode.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtxRef.current.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(masterGainRef.current);
    osc.start();
    
    oscillatorsRef.current.set(noteId, osc);
    setActiveKeys(prev => new Set(prev).add(noteId));
  };

  const stopNote = (noteId: string) => {
    const osc = oscillatorsRef.current.get(noteId);
    if (osc && audioCtxRef.current) {
      // Small fade out
      osc.stop(audioCtxRef.current.currentTime + 0.1);
      oscillatorsRef.current.delete(noteId);
    }
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(noteId);
      return next;
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = KEYS.find(k => k.key === e.key.toLowerCase());
      if (key) {
        playNote(key.note, key.freq);
      }
    };
    
    const onKeyUp = (e: KeyboardEvent) => {
      const key = KEYS.find(k => k.key === e.key.toLowerCase());
      if (key) {
        stopNote(key.note);
      }
    };
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [waveform, volume]); // Rebind to get fresh state

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-200 p-6 select-none">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400"><MusicIcon /> SynthToy</h2>
      </div>

      <div className="flex gap-8 mb-8 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider"><Settings2 size={14}/> Waveform</label>
          <div className="flex gap-2 bg-gray-950 p-1 rounded-lg">
            {['sine', 'square', 'triangle', 'sawtooth'].map(w => (
              <button 
                key={w}
                onClick={() => setWaveform(w as OscillatorType)}
                className={clsx(
                  "flex-1 py-2 px-3 rounded text-sm capitalize transition-colors font-medium",
                  waveform === w ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                )}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-48">
          <label className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider"><Volume2 size={14}/> Volume</label>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-blue-500 mt-2"
          />
        </div>
      </div>

      <div className="flex-1 flex justify-center items-end pb-8">
        <div className="relative flex h-48 bg-gray-900 p-2 rounded-lg border border-gray-800 shadow-2xl">
          {KEYS.filter(k => k.type === 'white').map((k) => (
            <div 
              key={k.note}
              onMouseDown={() => playNote(k.note, k.freq)}
              onMouseUp={() => stopNote(k.note)}
              onMouseLeave={() => stopNote(k.note)}
              className={clsx(
                "w-12 h-full rounded-b-md border border-gray-300 mx-px relative flex flex-col justify-end pb-4 items-center cursor-pointer transition-colors shadow-sm",
                activeKeys.has(k.note) ? "bg-gray-200" : "bg-white"
              )}
            >
              <span className="text-gray-400 text-xs font-bold uppercase">{k.key}</span>
            </div>
          ))}
          
          <div className="absolute top-2 left-2 right-2 flex pointer-events-none">
            {KEYS.map((k) => {
              if (k.type === 'white') return null;
              // Calculate left position based on note sequence
              const whiteIndex = k.note.includes('C#') ? 1 : k.note.includes('D#') ? 2 : k.note.includes('F#') ? 4 : k.note.includes('G#') ? 5 : k.note.includes('A#') ? 6 : 0;
              return (
                <div 
                  key={k.note}
                  onMouseDown={(e) => { e.stopPropagation(); playNote(k.note, k.freq); }}
                  onMouseUp={(e) => { e.stopPropagation(); stopNote(k.note); }}
                  onMouseLeave={(e) => { e.stopPropagation(); stopNote(k.note); }}
                  className={clsx(
                    "w-8 h-28 bg-gray-900 rounded-b absolute border border-black cursor-pointer pointer-events-auto flex flex-col justify-end pb-2 items-center text-white/50 text-xs",
                    activeKeys.has(k.note) ? "bg-gray-800" : ""
                  )}
                  style={{ left: `calc(${whiteIndex} * 3rem + 1.5rem + ${whiteIndex * 2}px - 1rem)` }}
                >
                  {k.key}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-xs">
        Use keyboard (A-K, W, E, T, Y, U) or click to play
      </div>
    </div>
  );
}
