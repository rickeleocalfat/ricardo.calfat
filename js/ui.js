// ============================================================
// INTERFACE ABSURDA — botões, rastro de cursor, chuva de pizza,
// tremor de tela, frases aleatórias, medidor de absurdo e o
// sagrado código Konami (MODO ULTRA).
// ============================================================

import { state, onAbsurd } from './state.js';

const TRAIL_EMOJIS = ['🥔', '✨', '🍕', '🛸', '🌀', '💫', '⭐', '🤪', '👽', '🪩'];
const RAIN_PIZZA = ['🍕', '🍕', '🍕', '🧀', '🍍'];
const RAIN_CHAOS = ['🥔', '🍕', '🛸', '🦆', '🍌', '🪩', '👽', '🍄', '🪐', '💥', '🌈', '🤯'];

const PHRASES = [
  'arraste a tela. a batata observa.',
  'clique nos objetos. eles gostam.',
  '99% dos cientistas não entenderam este site.',
  'a batata não pede desculpas pelo que vai acontecer.',
  'você está oficialmente na dimensão errada.',
  'patos de borracha são a única constante do universo.',
  'a pizza é redonda, a verdade também.',
  'cuidado: o nível de absurdo só sobe.',
  'isto foi aprovado por 7 dimensões e nenhum adulto.',
  'segure o caos. ou não. tanto faz.',
  'a coroa é pesada, mas a batata aguenta.',
  'se você está lendo isto, a batata também está te lendo.',
  'modo rave = produtividade negativa garantida.',
  'gravidade é só uma sugestão por aqui.',
];

let trailLayer, toastEl, phraseEl, absurdFill, absurdValue, fpsBadge;
let lastTrail = 0;
let hit100 = false;

export function initUI(world, audio) {
  trailLayer = document.getElementById('trail');
  phraseEl = document.getElementById('phrase');
  absurdFill = document.getElementById('absurdFill');
  absurdValue = document.getElementById('absurdValue');
  fpsBadge = document.getElementById('fpsBadge');

  // elementos criados dinamicamente
  toastEl = el('div', 'toast'); toastEl.id = 'toast'; document.body.appendChild(toastEl);
  const flash = el('div'); flash.id = 'chaosFlash'; document.body.appendChild(flash);

  wireButtons(world, audio);
  setupTrail();
  setupPhrases();
  setupKonami(world);

  onAbsurd(updateMeter);
  updateMeter(state.absurd);

  return { toast, fpsBadge, screenShake, flashChaos: () => boom(flash) };
}

// ---- botões ----------------------------------------------------
function wireButtons(world, audio) {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playBlip();
      const a = btn.dataset.action;
      if (a === 'rave') {
        const on = audio.toggle();
        btn.classList.toggle('on', on);
        toast(on ? '🔊 RAVE ON' : '🔇 silêncio...');
      } else if (a === 'spawn') {
        world.spawnObjects(8);
        rain(RAIN_PIZZA.concat(['🥔', '🥔']), 10);
        toast('🥔 +BATATAS');
      } else if (a === 'pizza') {
        rain(RAIN_PIZZA, 40);
        world.popRandom();
        toast('🍕 PIZZA!!!');
      } else if (a === 'dimension') {
        toast('🌀 ' + world.randomDimension());
      } else if (a === 'shake') {
        screenShake();
        toast('💥💥💥');
      } else if (a === 'chaos') {
        const on = !state.chaos;
        world.setChaos(on);
        btn.classList.toggle('on', on);
        document.body.classList.toggle('ultra', on || state.ultraMode);
        if (on) { rain(RAIN_CHAOS, 60); screenShake(); }
        toast(on ? '☢ CAOS TOTAL' : '😌 calmaria');
      }
    });
  });
}

// ---- rastro do cursor -----------------------------------------
function setupTrail() {
  const move = (x, y) => {
    const now = performance.now();
    if (now - lastTrail < 35) return;
    lastTrail = now;
    const b = el('div', 'trail-bit');
    b.textContent = TRAIL_EMOJIS[(Math.random() * TRAIL_EMOJIS.length) | 0];
    b.style.left = x + 'px'; b.style.top = y + 'px';
    b.style.fontSize = (16 + Math.random() * 18) + 'px';
    trailLayer.appendChild(b);
    setTimeout(() => b.remove(), 1000);
  };
  window.addEventListener('pointermove', (e) => move(e.clientX, e.clientY), { passive: true });
}

// ---- chuva de objetos -----------------------------------------
function rain(set, n) {
  for (let i = 0; i < n; i++) {
    const f = el('div', 'faller');
    f.textContent = set[(Math.random() * set.length) | 0];
    f.style.left = Math.random() * 100 + 'vw';
    f.style.fontSize = (24 + Math.random() * 36) + 'px';
    document.body.appendChild(f);
    const dur = 2500 + Math.random() * 2500;
    const drift = (Math.random() - 0.5) * 200;
    f.animate(
      [{ transform: 'translateY(0) rotate(0deg)' },
       { transform: `translate(${drift}px, 112vh) rotate(${Math.random() * 1080 - 540}deg)` }],
      { duration: dur, easing: 'cubic-bezier(.4,0,.7,1)', fill: 'forwards' }
    ).onfinish = () => f.remove();
  }
}

// ---- frases ----------------------------------------------------
function setupPhrases() {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % PHRASES.length;
    phraseEl.style.opacity = '0';
    setTimeout(() => { phraseEl.textContent = PHRASES[i]; phraseEl.style.opacity = '1'; }, 350);
  }, 4500);
}

// ---- toast central --------------------------------------------
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove('show');
  void toastEl.offsetWidth;   // reinicia animação
  toastEl.classList.add('show');
}

// ---- tremor de tela -------------------------------------------
function screenShake() {
  document.body.classList.remove('shake');
  void document.body.offsetWidth;
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 520);
}

function boom(flash) { flash.classList.remove('boom'); void flash.offsetWidth; flash.classList.add('boom'); }

// ---- medidor de absurdo ---------------------------------------
function updateMeter(level) {
  const pct = Math.round(level);
  absurdFill.style.width = pct + '%';
  absurdValue.textContent = pct + '%';
  if (pct >= 100 && !hit100) {
    hit100 = true;
    toast('🏆 ABSURDO MÁXIMO 🏆');
    document.body.classList.add('ultra');
  }
}

// ---- código Konami → MODO ULTRA -------------------------------
function setupKonami(world) {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let idx = 0;
  window.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        idx = 0;
        state.ultraMode = true;
        document.body.classList.add('ultra');
        world.spawnObjects(20);
        rain(RAIN_CHAOS, 80);
        screenShake();
        toast('🌈 MODO ULTRA 🌈');
      }
    } else {
      idx = (k === seq[0]) ? 1 : 0;
    }
  });
}

// helper
function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
