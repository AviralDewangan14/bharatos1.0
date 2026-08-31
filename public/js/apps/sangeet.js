// Sur Sangeet 8-Channel Synthesizer — Web Audio API
let synthCtx = null;
let currentOsc = null;
let currentGain = null;
let activeOctave = 4;

const NOTES = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88,
    'C5': 523.25
};

function getSynthAudio() {
    if (!synthCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        synthCtx = new AudioClass();
    }
    if (synthCtx.state === 'suspended') {
        synthCtx.resume();
    }
    return synthCtx;
}

function playNote(noteName) {
    const ctx = getSynthAudio();
    stopNote();

    const base = NOTES[noteName] || 440.0;
    const freq = base * Math.pow(2, activeOctave - 4);
    const waveform = document.getElementById('sangeet-wave-select')?.value || 'sine';

    currentOsc = ctx.createOscillator();
    currentGain = ctx.createGain();

    currentOsc.type = waveform;
    currentOsc.frequency.setValueAtTime(freq, ctx.currentTime);

    currentGain.gain.setValueAtTime(0.01, ctx.currentTime);
    currentGain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.04);

    currentOsc.connect(currentGain);
    currentGain.connect(ctx.destination);

    currentOsc.start();
}

function stopNote() {
    if (currentGain && synthCtx) {
        currentGain.gain.exponentialRampToValueAtTime(0.0001, synthCtx.currentTime + 0.08);
        setTimeout(() => {
            if (currentOsc) {
                try { currentOsc.stop(); } catch(e) {}
                currentOsc = null;
            }
        }, 90);
    }
}

function playSolfeggio(freqHz) {
    const ctx = getSynthAudio();
    stopNote();

    currentOsc = ctx.createOscillator();
    currentGain = ctx.createGain();

    currentOsc.type = 'sine';
    currentOsc.frequency.setValueAtTime(freqHz, ctx.currentTime);

    currentGain.gain.setValueAtTime(0.01, ctx.currentTime);
    currentGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.06);

    currentOsc.connect(currentGain);
    currentGain.connect(ctx.destination);

    currentOsc.start();
    setTimeout(stopNote, 1500);
}

function setOctave(delta) {
    activeOctave = Math.max(1, Math.min(8, activeOctave + delta));
    const disp = document.getElementById('sangeet-octave-text');
    if (disp) disp.textContent = activeOctave;
}
