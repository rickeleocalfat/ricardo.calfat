// ============================================================
// MAIN — conecta mundo 3D + áudio + interface e some com o loader.
// ============================================================

import { initWorld } from './world.js';
import { initAudio, playBlip } from './audio.js';
import { initUI } from './ui.js';
import { addAbsurd } from './state.js';

function start() {
  const canvas = document.getElementById('webgl');
  const audio = initAudio();

  // inicia interface depois (precisa da API do mundo)
  let ui;

  const world = initWorld(canvas, {
    onFps: (fps) => { if (ui) ui.fpsBadge.textContent = fps + ' fps'; },
    onDimension: () => {},
    onPotatoClick: (isHero) => {
      playBlip();
      if (ui) ui.toast(isHero ? '👑 SALVE A BATATA 👑' : '✨ boop ✨');
      addAbsurd(isHero ? 3 : 1);
    },
  });

  ui = initUI(world, audio);

  // sucesso: avisa o fallback e some com o loader
  window.__BATATA_OK__ = true;
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 600);

  // começa já com um pouco de absurdo no medidor
  addAbsurd(8);
}

// captura erros de carregamento de módulo (ex.: sem internet p/ CDN)
window.addEventListener('error', (e) => {
  console.error('Erro ao iniciar a Batata:', e.message);
});

start();
