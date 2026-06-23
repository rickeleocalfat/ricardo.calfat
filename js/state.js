// ============================================================
// Estado global compartilhado entre mundo 3D, áudio e interface.
// Um objeto simples e mutável, importado por todos os módulos.
// ============================================================

export const state = {
  raveMode: false,    // beat do Web Audio tocando?
  ultraMode: false,   // código Konami ativado
  chaos: false,       // CAOS TOTAL ligado
  audioLevel: 0,      // 0..1 vindo do analyser de áudio
  bass: 0,            // energia de graves 0..1
  dimension: 0,       // paleta/atmosfera atual
  absurd: 0,          // nível de absurdo 0..100 (só sobe)
};

const listeners = new Set();

// permite que a UI reaja quando o absurdo muda
export function onAbsurd(fn) { listeners.add(fn); }

// soma absurdo (limitado a 100) e notifica ouvintes
export function addAbsurd(amount) {
  state.absurd = Math.min(100, state.absurd + amount);
  listeners.forEach((fn) => fn(state.absurd));
}
