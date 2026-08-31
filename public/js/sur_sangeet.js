// Sur Sangeet DSP Synthesizer & Web Audio Engine
window.sangeetAudioCtx = null;
let currentSynthOsc = null;
let currentSynthGain = null;
let synthOctave = 4;
let synthVisualizerAnim = null;

const NOTE_FREQS = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88,
    'C5': 523.25
};

function getAudioContext() {
    if (!window.sangeetAudioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        window.sangeetAudioCtx = new AudioContextClass();
    }
    if (window.sangeetAudioCtx.state === 'suspended') {
        window.sangeetAudioCtx.resume();
    }
    return window.sangeetAudioCtx;
}

function playSynthNote(note) {
    const ctx = getAudioContext();
    stopSynthNote();

    const baseFreq = NOTE_FREQS[note] || 440.0;
    const freq = baseFreq * Math.pow(2, synthOctave - 4);
    const waveform = document.getElementById('synth-waveform')?.value || 'sine';

    currentSynthOsc = ctx.createOscillator();
    currentSynthGain = ctx.createGain();

    currentSynthOsc.type = waveform;
    currentSynthOsc.frequency.setValueAtTime(freq, ctx.currentTime);

    currentSynthGain.gain.setValueAtTime(0.01, ctx.currentTime);
    currentSynthGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);

    currentSynthOsc.connect(currentSynthGain);
    currentSynthGain.connect(ctx.destination);

    currentSynthOsc.start();
    startSynthVisualizer(freq);
}

function stopSynthNote() {
    if (currentSynthGain && window.sangeetAudioCtx) {
        currentSynthGain.gain.exponentialRampToValueAtTime(0.0001, window.sangeetAudioCtx.currentTime + 0.08);
        setTimeout(() => {
            if (currentSynthOsc) {
                try { currentSynthOsc.stop(); } catch(e) {}
                currentSynthOsc = null;
            }
        }, 90);
    }
}

function playSolfeggioTone(freqHz) {
    const ctx = getAudioContext();
    stopSynthNote();

    currentSynthOsc = ctx.createOscillator();
    currentSynthGain = ctx.createGain();

    currentSynthOsc.type = 'sine';
    currentSynthOsc.frequency.setValueAtTime(freqHz, ctx.currentTime);

    currentSynthGain.gain.setValueAtTime(0.01, ctx.currentTime);
    currentSynthGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.08);

    currentSynthOsc.connect(currentSynthGain);
    currentSynthGain.connect(ctx.destination);

    currentSynthOsc.start();
    startSynthVisualizer(freqHz);

    setTimeout(() => {
        stopSynthNote();
    }, 1800);
}

function adjustSynthOctave(delta) {
    synthOctave = Math.max(1, Math.min(8, synthOctave + delta));
    const disp = document.getElementById('synth-octave-disp');
    if (disp) disp.textContent = synthOctave;
}

function startSynthVisualizer(freq) {
    const canvas = document.getElementById('sangeet-visualizer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (synthVisualizerAnim) cancelAnimationFrame(synthVisualizerAnim);

    let phase = 0;
    const draw = () => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const midY = canvas.height / 2;
        for (let x = 0; x < canvas.width; x++) {
            const y = midY + Math.sin(x * 0.04 + phase) * 28 * Math.cos(x * 0.01);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        phase += 0.15;
        synthVisualizerAnim = requestAnimationFrame(draw);
    };
    draw();

    setTimeout(() => {
        if (synthVisualizerAnim) cancelAnimationFrame(synthVisualizerAnim);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }, 2000);
}
