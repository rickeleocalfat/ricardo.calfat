// ============================================================
// MOTOR DE RAVE — techno gerado em tempo real com Web Audio API.
// Nenhum arquivo de áudio: tudo sintetizado (kick, snare, hat,
// baixo e arpejo). Um analyser alimenta state.audioLevel/bass
// para deixar o 3D reativo à batida.
// ============================================================

import { state } from './state.js';

let ctx, master, analyser, freqData;
let noiseBuf;
let playing = false;
let timer = null;
let step = 0;
let nextTime = 0;
const BPM = 126;
const LOOKAHEAD = 0.1;      // segundos agendados à frente
const TICK = 25;            // ms do agendador

// escala menor pra dar clima "espacial/absurdo"
const ROOT = 55;           // Lá1
const bassPattern = [0, null, 12, 0, null, 3, 0, 7, 0, null, 12, 0, 3, null, 7, 10];
const arpPattern  = [0, 7, 12, 15, 19, 15, 12, 7];

function semis(base, s) { return base * Math.pow(2, s / 12); }

function makeNoise() {
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

// ---- vozes -----------------------------------------------------
function kick(t) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  g.gain.setValueAtTime(1.0, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  o.connect(g).connect(master); o.start(t); o.stop(t + 0.24);
}

function snare(t) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.8;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.7, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  src.connect(bp).connect(g).connect(master); src.start(t); src.stop(t + 0.2);
  // corpo
  const o = ctx.createOscillator(), og = ctx.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(180, t);
  og.gain.setValueAtTime(0.4, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  o.connect(og).connect(master); o.start(t); o.stop(t + 0.12);
}

function hat(t, open = false) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7500;
  const g = ctx.createGain();
  const dur = open ? 0.18 : 0.04;
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(hp).connect(g).connect(master); src.start(t); src.stop(t + dur + 0.02);
}

function bass(t, freq, dur) {
  const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  o.type = 'sawtooth'; o.frequency.value = freq;
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(180 + freq * 2, t);
  lp.frequency.exponentialRampToValueAtTime(120, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(lp).connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02);
}

function lead(t, freq) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  const dly = ctx.createDelay(); dly.delayTime.value = 0.27;
  const fb = ctx.createGain(); fb.gain.value = 0.38;
  o.type = 'square'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  o.connect(g); g.connect(master);
  g.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(master);
  o.start(t); o.stop(t + 0.22);
}

// ---- agendador (lookahead clássico do Web Audio) ---------------
function scheduleStep(s, t) {
  if (s % 4 === 0) kick(t);
  if (s === 4 || s === 12) snare(t);
  if (s % 2 === 1) hat(t, s % 8 === 7);
  const bn = bassPattern[s];
  if (bn !== null) bass(t, semis(ROOT, bn), 60 / BPM / 2);
  if (s % 2 === 0) lead(t, semis(ROOT * 4, arpPattern[(s / 2) % arpPattern.length]));
}

function scheduler() {
  const sixteenth = 60 / BPM / 4;
  while (nextTime < ctx.currentTime + LOOKAHEAD) {
    scheduleStep(step % 16, nextTime);
    nextTime += sixteenth;
    step++;
  }
}

// ---- loop do analyser: alimenta o estado p/ o 3D --------------
function analyse() {
  if (analyser && playing) {
    analyser.getByteFrequencyData(freqData);
    let sum = 0, low = 0;
    for (let i = 0; i < freqData.length; i++) { sum += freqData[i]; if (i < 6) low += freqData[i]; }
    const avg = sum / freqData.length / 255;
    const bs = low / 6 / 255;
    state.audioLevel += (avg - state.audioLevel) * 0.3;
    state.bass += (bs - state.bass) * 0.4;
  } else {
    state.audioLevel *= 0.9;
    state.bass *= 0.9;
  }
  requestAnimationFrame(analyse);
}

// ---- API -------------------------------------------------------
export function initAudio() {
  // gesto do usuário cria o contexto (autoplay-policy friendly)
  requestAnimationFrame(analyse);
  return { toggle, playBlip, isPlaying: () => playing };
}

function ensureCtx() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = 0.0;
  analyser = ctx.createAnalyser(); analyser.fftSize = 256;
  freqData = new Uint8Array(analyser.frequencyBinCount);
  master.connect(analyser); analyser.connect(ctx.destination);
  makeNoise();
}

export function toggle() {
  ensureCtx();
  if (ctx.state === 'suspended') ctx.resume();
  playing = !playing;
  state.raveMode = playing;
  if (playing) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.55, ctx.currentTime, 0.1);
    nextTime = ctx.currentTime + 0.05;
    step = 0;
    timer = setInterval(scheduler, TICK);
  } else {
    master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.1);
    clearInterval(timer); timer = null;
  }
  return playing;
}

// bip curto de feedback ao clicar
export function playBlip() {
  ensureCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(880, t);
  o.frequency.exponentialRampToValueAtTime(1760, t + 0.08);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  o.connect(g).connect(master || ctx.destination); o.start(t); o.stop(t + 0.14);
}
