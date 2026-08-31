import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Headphones,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Flame,
  Clock,
  TrendingUp,
  Sliders,
  ListTodo
} from 'lucide-react';
import clsx from 'clsx';

interface BlockedItem {
  id: string;
  domain: string;
  category: 'Social' | 'Entertainment' | 'Gaming' | 'Custom';
  blocksCount: number;
}

interface FocusTask {
  id: string;
  text: string;
  completed: boolean;
}

const DEFAULT_BLOCKED: BlockedItem[] = [
  { id: '1', domain: 'instagram.com', category: 'Social', blocksCount: 14 },
  { id: '2', domain: 'x.com', category: 'Social', blocksCount: 22 },
  { id: '3', domain: 'youtube.com', category: 'Entertainment', blocksCount: 9 },
  { id: '4', domain: 'reddit.com', category: 'Social', blocksCount: 31 },
  { id: '5', domain: 'netflix.com', category: 'Entertainment', blocksCount: 4 },
];

export default function FocusDefendApp() {
  const [activeTab, setActiveTab] = useState<'timer' | 'blocker' | 'audio' | 'analytics'>('timer');
  
  // Timer State
  const [shieldActive, setShieldActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'deepflow' | 'shortbreak'>('deepflow');
  const [totalSeconds, setTotalSeconds] = useState(90 * 60); // 90 mins for deep flow
  const [secondsLeft, setSecondsLeft] = useState(90 * 60);
  const [isPaused, setIsPaused] = useState(true);

  // Focus Stats
  const [todayFocusMins, setTodayFocusMins] = useState(145);
  const [streakDays] = useState(7);
  const [blocksIntercepted] = useState(80);

  // Blocklist
  const [blockList, setBlockList] = useState<BlockedItem[]>(DEFAULT_BLOCKED);
  const [newDomain, setNewDomain] = useState('');

  // Tasks
  const [tasks, setTasks] = useState<FocusTask[]>([
    { id: '1', text: 'Build BharatOS focus defender shield', completed: true },
    { id: '2', text: 'Verify real-time audio synthesizer & blocklist', completed: false },
    { id: '3', text: 'Deploy production release to Vercel', completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Audio Engine State
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selectedSoundscape, setSelectedSoundscape] = useState<'binaural' | 'rain' | 'whitenoise' | 'drone'>('binaural');
  const [soundVolume, setSoundVolume] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ osc1?: OscillatorNode; osc2?: OscillatorNode; gain?: GainNode; noiseNode?: AudioBufferSourceNode } | null>(null);

  // Timer Countdown Logic
  useEffect(() => {
    let interval: any = null;
    if (shieldActive && !isPaused && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setShieldActive(false);
            setIsPaused(true);
            setTodayFocusMins(m => m + Math.round(totalSeconds / 60));
            stopSoundscape();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [shieldActive, isPaused, secondsLeft, totalSeconds]);

  // Handle Mode Change
  const switchMode = (newMode: 'pomodoro' | 'deepflow' | 'shortbreak') => {
    setMode(newMode);
    setIsPaused(true);
    setShieldActive(false);
    stopSoundscape();
    let duration = 25 * 60;
    if (newMode === 'deepflow') duration = 90 * 60;
    if (newMode === 'shortbreak') duration = 5 * 60;
    setTotalSeconds(duration);
    setSecondsLeft(duration);
  };

  const startFocus = () => {
    setShieldActive(true);
    setIsPaused(false);
    if (audioPlaying) {
      startSoundscape(selectedSoundscape, soundVolume);
    }
  };

  const pauseFocus = () => {
    setIsPaused(true);
    stopSoundscape();
  };

  const resetFocus = () => {
    setIsPaused(true);
    setShieldActive(false);
    setSecondsLeft(totalSeconds);
    stopSoundscape();
  };

  // ==========================================
  // PROCEDURAL WEB AUDIO FOCUS ENGINE
  // ==========================================
  const startSoundscape = (type: string, volume: number) => {
    try {
      stopSoundscape();
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'binaural') {
        // Binaural 14Hz Alpha wave on 216Hz carrier
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc1.connect(merger, 0, 0);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(230, ctx.currentTime); // 14Hz difference
        osc2.connect(merger, 0, 1);

        merger.connect(masterGain);
        osc1.start();
        osc2.start();

        soundNodesRef.current = { osc1, osc2, gain: masterGain };
      } else if (type === 'drone') {
        // Warm Harmonic Drone (432Hz harmonic chord)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(108, ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(216, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        soundNodesRef.current = { osc1, osc2, gain: masterGain };
      } else {
        // Procedural White/Pink Noise (Rain / Static)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Filtered pink rain
            lastOut = (lastOut * 0.95) + (white * 0.05);
            data[i] = lastOut * 3.0;
          } else {
            data[i] = white * 0.3;
          }
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 600 : 1200, ctx.currentTime);

        noiseNode.connect(filter);
        filter.connect(masterGain);
        noiseNode.start();

        soundNodesRef.current = { noiseNode, gain: masterGain };
      }

      setAudioPlaying(true);
    } catch (e) {
      console.error('Audio start error:', e);
    }
  };

  const stopSoundscape = () => {
    try {
      if (soundNodesRef.current) {
        if (soundNodesRef.current.osc1) soundNodesRef.current.osc1.stop();
        if (soundNodesRef.current.osc2) soundNodesRef.current.osc2.stop();
        if (soundNodesRef.current.noiseNode) soundNodesRef.current.noiseNode.stop();
        soundNodesRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch {}
    setAudioPlaying(false);
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  // Add Custom Domain
  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    const clean = newDomain.replace(/^(https?:\/\/)?(www\.)?/, '').trim();
    const item: BlockedItem = {
      id: Date.now().toString(),
      domain: clean,
      category: 'Custom',
      blocksCount: 0
    };
    setBlockList([item, ...blockList]);
    setNewDomain('');
  };

  const removeDomain = (id: string) => {
    setBlockList(blockList.filter(b => b.id !== id));
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      
      {/* Top Header & Mode Tabs */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/80 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
            <Shield size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              FocusDefend
              <span className={clsx(
                "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                shieldActive && !isPaused
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse"
                  : "bg-slate-800 text-slate-400 border-white/10"
              )}>
                {shieldActive && !isPaused ? 'SHIELD ACTIVE' : 'STANDBY'}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Deep-Work Shield & Distraction Blocker</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('timer')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
              activeTab === 'timer' ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            )}
          >
            <Clock size={13} />
            <span>Focus Timer</span>
          </button>

          <button
            onClick={() => setActiveTab('blocker')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
              activeTab === 'blocker' ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            )}
          >
            <ShieldAlert size={13} />
            <span>Blocklist ({blockList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
              activeTab === 'audio' ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            )}
          >
            <Headphones size={13} />
            <span>Focus Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
              activeTab === 'analytics' ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            )}
          >
            <TrendingUp size={13} />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* ========================================================= */}
        {/* TAB 1: FOCUS TIMER & TASK CHECKLIST */}
        {/* ========================================================= */}
        {activeTab === 'timer' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            {/* Left: Timer Ring & Controls (2 Cols) */}
            <div className="md:col-span-2 bg-slate-900/60 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-between text-center backdrop-blur-xl shadow-xl space-y-6">
              
              {/* Preset Selector */}
              <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold">
                <button
                  onClick={() => switchMode('deepflow')}
                  className={clsx(
                    "px-4 py-1.5 rounded-xl transition-all",
                    mode === 'deepflow' ? "bg-rose-500 text-white shadow-md font-bold" : "text-slate-400 hover:text-white"
                  )}
                >
                  Deep Flow (90m)
                </button>
                <button
                  onClick={() => switchMode('pomodoro')}
                  className={clsx(
                    "px-4 py-1.5 rounded-xl transition-all",
                    mode === 'pomodoro' ? "bg-amber-500 text-slate-950 shadow-md font-bold" : "text-slate-400 hover:text-white"
                  )}
                >
                  Pomodoro (25m)
                </button>
                <button
                  onClick={() => switchMode('shortbreak')}
                  className={clsx(
                    "px-4 py-1.5 rounded-xl transition-all",
                    mode === 'shortbreak' ? "bg-emerald-500 text-slate-950 shadow-md font-bold" : "text-slate-400 hover:text-white"
                  )}
                >
                  Rest Break (5m)
                </button>
              </div>

              {/* Central Circular Display */}
              <div className="relative w-56 h-56 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={276}
                    strokeDashoffset={276 - (276 * progressPercent) / 100}
                    strokeLinecap="round"
                    className={clsx(
                      "transition-all duration-1000 ease-linear",
                      mode === 'deepflow' ? "text-rose-500" : mode === 'pomodoro' ? "text-amber-400" : "text-emerald-400"
                    )}
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extralight tracking-tight text-white font-mono">
                    {formatTime(secondsLeft)}
                  </span>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mt-1">
                    {mode === 'deepflow' ? 'Deep Work' : mode === 'pomodoro' ? 'Sprint' : 'Rest'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {isPaused ? (
                  <button
                    onClick={startFocus}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/25 transition-all hover:scale-105"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>Engage Shield</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseFocus}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-white/20 shadow-xl transition-all hover:scale-105"
                  >
                    <Pause size={16} fill="currentColor" />
                    <span>Pause Session</span>
                  </button>
                )}

                <button
                  onClick={resetFocus}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

            </div>

            {/* Right: Session Target Tasks */}
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-5 flex flex-col justify-between backdrop-blur-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ListTodo size={14} className="text-amber-400" />
                    <span>Session Targets</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {tasks.filter(t => t.completed).length}/{tasks.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {tasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className={clsx(
                        "p-2.5 rounded-xl border flex items-center gap-2.5 text-xs cursor-pointer transition-all",
                        t.completed
                          ? "bg-slate-950/40 border-white/5 text-slate-500 line-through"
                          : "bg-slate-800/60 border-white/10 text-slate-200 hover:border-amber-500/40"
                      )}
                    >
                      {t.completed ? (
                        <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Circle size={15} className="text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Task Input */}
              <form onSubmit={handleAddTask} className="pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  placeholder="New focus goal..."
                  className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DISTRACTION BLOCKLIST & FIREWALL */}
        {/* ========================================================= */}
        {activeTab === 'blocker' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={16} className="text-rose-400" />
                    <span>Distraction Firewall Rules</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Web domains and apps strictly quarantined while Focus Shield is engaged.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/25 text-xs font-bold text-rose-400">
                  <span>{blocksIntercepted} Attempts Intercepted</span>
                </div>
              </div>

              {/* Add Domain Bar */}
              <form onSubmit={handleAddDomain} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newDomain}
                  onChange={e => setNewDomain(e.target.value)}
                  placeholder="Add domain to block (e.g., twitter.com, tiktok.com)..."
                  className="flex-1 bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Block Domain</span>
                </button>
              </form>

              {/* Blocked List Table */}
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {blockList.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-xs hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                      <span className="font-mono text-white font-medium">{item.domain}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400 border border-white/5">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-slate-400">
                        <strong className="text-rose-400">{item.blocksCount}</strong> blocked
                      </span>
                      <button
                        onClick={() => removeDomain(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove Rule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PROCEDURAL FOCUS SOUNDSCAPES */}
        {/* ========================================================= */}
        {activeTab === 'audio' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Headphones size={16} className="text-violet-400" />
                    <span>Sovereign Ambient Synthesizer</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time mathematical wave generators to induce deep cognitive flow.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (audioPlaying) {
                      stopSoundscape();
                    } else {
                      startSoundscape(selectedSoundscape, soundVolume);
                    }
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg",
                    audioPlaying
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:scale-105"
                  )}
                >
                  {audioPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{audioPlaying ? 'Stop Audio' : 'Play Soundscape'}</span>
                </button>
              </div>

              {/* Soundscape Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'binaural', name: 'Binaural Alpha', hz: '14 Hz Flow', desc: 'Dual sine tone frequency for alertness', color: 'from-amber-500 to-orange-600' },
                  { id: 'rain', name: 'Pink Rain', hz: 'Gentle Noise', desc: 'Mathematical pink noise frequency', color: 'from-blue-500 to-cyan-600' },
                  { id: 'drone', name: 'Cosmic Drone', hz: '432 Hz Warm', desc: 'Multi-saw harmonic chord resonator', color: 'from-violet-500 to-purple-700' },
                  { id: 'whitenoise', name: 'Focus Static', hz: 'Broadband', desc: 'Uniform frequency distraction shield', color: 'from-slate-600 to-zinc-800' }
                ].map(snd => {
                  const isSelected = selectedSoundscape === snd.id;
                  return (
                    <button
                      key={snd.id}
                      onClick={() => {
                        setSelectedSoundscape(snd.id as any);
                        if (audioPlaying) startSoundscape(snd.id, soundVolume);
                      }}
                      className={clsx(
                        "p-4 rounded-2xl text-left border transition-all flex flex-col justify-between h-32",
                        isSelected
                          ? "bg-white/10 border-amber-400 ring-2 ring-amber-400/20 shadow-lg"
                          : "bg-slate-950/60 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${snd.color} flex items-center justify-center text-white text-xs shadow-md`}>
                          <Headphones size={15} />
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold">{snd.hz}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{snd.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{snd.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5"><Sliders size={13} className="text-violet-400" /> Synthesizer Gain</span>
                  <span className="font-mono text-amber-400">{Math.round(soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setSoundVolume(v);
                    if (audioPlaying && soundNodesRef.current?.gain && audioCtxRef.current) {
                      soundNodesRef.current.gain.gain.setValueAtTime(v * 0.4, audioCtxRef.current.currentTime);
                    }
                  }}
                  className="w-full accent-violet-500"
                />
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FOCUS & PRODUCTIVITY ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-3 gap-4">
              
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-4 backdrop-blur-xl text-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-2">
                  <Clock size={18} />
                </div>
                <h4 className="text-2xl font-bold text-white font-mono">{todayFocusMins}m</h4>
                <p className="text-[11px] text-slate-400 font-medium">Focus Logged Today</p>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-4 backdrop-blur-xl text-center">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 mx-auto flex items-center justify-center mb-2">
                  <Flame size={18} />
                </div>
                <h4 className="text-2xl font-bold text-white font-mono">{streakDays} Days</h4>
                <p className="text-[11px] text-slate-400 font-medium">Daily Shield Streak</p>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-4 backdrop-blur-xl text-center">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="text-2xl font-bold text-white font-mono">96%</h4>
                <p className="text-[11px] text-slate-400 font-medium">Deep-Work Score</p>
              </div>

            </div>

            {/* Weekly Activity Heatmap */}
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" />
                <span>Weekly Focus Distribution</span>
              </h4>

              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {[
                  { day: 'Mon', mins: 180, level: 'bg-emerald-500' },
                  { day: 'Tue', mins: 210, level: 'bg-emerald-500' },
                  { day: 'Wed', mins: 120, level: 'bg-emerald-600' },
                  { day: 'Thu', mins: 240, level: 'bg-emerald-400' },
                  { day: 'Fri', mins: 195, level: 'bg-emerald-500' },
                  { day: 'Sat', mins: 90, level: 'bg-emerald-700' },
                  { day: 'Sun', mins: 145, level: 'bg-emerald-500' }
                ].map(d => (
                  <div key={d.day} className="space-y-2">
                    <div className="h-24 bg-slate-950/80 rounded-xl p-1 flex flex-col justify-end">
                      <div
                        className={`w-full rounded-lg ${d.level} transition-all`}
                        style={{ height: `${(d.mins / 240) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium block">{d.day}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">{d.mins}m</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
