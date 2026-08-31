// Web Audio Piano Synthesizer — Real AudioContext oscillators
let audioContext = null;
let osc = null;
let gainNode = null;
let currentWave = 'sine';

const NOTE_FREQS = {
  'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00,
  'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88, 'C5': 523.25
};

function getAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function startNote(note) {
  const ctx = getAudio();
  stopNote();
  
  const freq = NOTE_FREQS[note] || 440;
  osc = ctx.createOscillator();
  gainNode = ctx.createGain();
  
  osc.type = currentWave;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start();
}

function stopNote() {
  if (gainNode && audioContext) {
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08);
    setTimeout(() => {
      if (osc) {
        try { osc.stop(); } catch(e) {}
        osc = null;
      }
    }, 90);
  }
}

function setWaveform(w) {
  currentWave = w;
}
