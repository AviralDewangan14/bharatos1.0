// Web Audio Synthesizer
let audioCtx = null;
let activeOsc = null;
let currentWaveform = 'sine';

const noteFreqs = {
  'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00,
  'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88, 'C5': 523.25
};

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function setWaveform(wf) {
  currentWaveform = wf;
}

function startNote(note) {
  stopNote();
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  
  activeOsc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  activeOsc.type = currentWaveform;
  activeOsc.frequency.setValueAtTime(noteFreqs[note] || 440, ctx.currentTime);
  
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  activeOsc.connect(gain);
  gain.connect(ctx.destination);
  
  activeOsc.start();
}

function stopNote() {
  if (activeOsc) {
    try {
      activeOsc.stop();
      activeOsc.disconnect();
    } catch(e) {}
    activeOsc = null;
  }
}
