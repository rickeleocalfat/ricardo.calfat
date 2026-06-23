// ============================================================
// MUNDO 3D — Three.js + bloom + objetos absurdos orbitando
// a Batata Cósmica Suprema.
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { state, addAbsurd } from './state.js';

// ---- paletas de cada "dimensão" --------------------------------
const DIMENSIONS = [
  { name: 'NEON',      skyTop: 0x1b0040, skyBot: 0x03000a, fog: 0x14002e, lights: [0xff2bd6, 0x19f0ff, 0xffe600] },
  { name: 'VAPORWAVE', skyTop: 0x3a0a5e, skyBot: 0x0a0030, fog: 0x2a0a4d, lights: [0xff61d8, 0x6bf0ff, 0xb36bff] },
  { name: 'TÓXICO',    skyTop: 0x103a10, skyBot: 0x001005, fog: 0x002a12, lights: [0x9dff00, 0x00ffaa, 0xffee00] },
  { name: 'INFERNO',   skyTop: 0x4a0a00, skyBot: 0x140000, fog: 0x330500, lights: [0xff3b00, 0xffaa00, 0xff0066] },
  { name: 'GELO',      skyTop: 0x0a2a5e, skyBot: 0x000814, fog: 0x002244, lights: [0x66e0ff, 0xffffff, 0x4488ff] },
  { name: 'CHICLETE',  skyTop: 0x5e0a4a, skyBot: 0x14000f, fog: 0x4d0033, lights: [0xff8ad8, 0xffd1f0, 0xb36bff] },
];

// ---- ruído pseudo-3D barato (lombadas suaves p/ a batata) -------
function noise3(x, y, z) {
  return (Math.sin(x * 1.7 + y * 2.3) + Math.sin(y * 1.9 + z * 2.1) + Math.sin(z * 1.5 + x * 2.7)) / 3;
}
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

let renderer, scene, camera, controls, composer, bloom;
let hero, starfield, sky, portal, lights = [], orbiters = [], words = [], clickables = [];
const center = new THREE.Vector3(0, 0, 0);
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let dimIndex = 0;
let fpsAcc = 0, fpsFrames = 0;
let cb = { onPotatoClick: () => {}, onFps: () => {}, onDimension: () => {} };

// ============================================================
//  CONSTRUTORES DE OBJETOS ABSURDOS
// ============================================================

function spudMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color, roughness: 0.55, metalness: 0.15,
    emissive: new THREE.Color(color).multiplyScalar(0.18),
    flatShading: true,
  });
}

// a batata em si: icosaedro deformado por ruído + olhos + sorriso + coroa
function makePotato(scaleMul = 1, color = 0xc68a3a, withCrown = true) {
  const group = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(1.4, 12);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.multiplyScalar(1 + noise3(v.x * 1.3, v.y * 1.3, v.z * 1.3) * 0.16);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.scale(1.25, 1.0, 1.05);            // formato de batata
  geo.computeVertexNormals();
  const body = new THREE.Mesh(geo, spudMaterial(color));
  body.userData.spin = true;
  group.add(body);

  // olhos esbugalhados
  const eyeW = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, emissive: 0x222222 });
  const eyeB = new THREE.MeshStandardMaterial({ color: 0x05060a, roughness: 0.1 });
  for (const sx of [-1, 1]) {
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), eyeW);
    white.position.set(0.42 * sx, 0.32, 1.18);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), eyeB);
    pupil.position.set(0.42 * sx, 0.30, 1.36);
    group.add(white, pupil);
  }
  // sorrisão (meio toro)
  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.09, 10, 28, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x2a0a05, roughness: 0.5, emissive: 0x150300 })
  );
  mouth.rotation.z = Math.PI;            // vira p/ cima = sorriso
  mouth.position.set(0, -0.18, 1.18);
  group.add(mouth);

  // coroa real dourada
  if (withCrown) {
    const crown = new THREE.Group();
    const gold = new THREE.MeshStandardMaterial({ color: 0xffd34d, metalness: 0.9, roughness: 0.25, emissive: 0x4d3a00 });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.22, 24, 1, true), gold);
    crown.add(band);
    for (let i = 0; i < 8; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.34, 6), gold);
      const a = (i / 8) * Math.PI * 2;
      spike.position.set(Math.cos(a) * 0.52, 0.24, Math.sin(a) * 0.52);
      crown.add(spike);
    }
    crown.position.set(0, 1.45, 0.1);
    crown.rotation.x = -0.15;
    group.add(crown);
  }

  group.scale.setScalar(scaleMul);
  group.userData.clickable = true;
  group.traverse((o) => { if (o.isMesh) o.userData.owner = group; });
  return group;
}

function makeDuck() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xffe000, roughness: 0.4, emissive: 0x3a3000 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 18), mat); body.scale.set(1, 0.85, 1.15);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 18), mat); head.position.set(0, 0.45, 0.32);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.3, 8),
    new THREE.MeshStandardMaterial({ color: 0xff7b00, emissive: 0x3a1c00 }));
  beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.42, 0.62);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: 0x000000 }));
  const eye2 = eye.clone(); eye.position.set(0.13, 0.52, 0.55); eye2.position.set(-0.13, 0.52, 0.55);
  g.add(body, head, beak, eye, eye2);
  return g;
}

function makePizza() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 28),
    new THREE.MeshStandardMaterial({ color: 0xe8b35a, roughness: 0.8, emissive: 0x2a1c00 }));
  const cheese = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.04, 28),
    new THREE.MeshStandardMaterial({ color: 0xffcf52, roughness: 0.7, emissive: 0x3a2a00 }));
  cheese.position.y = 0.05; g.add(base, cheese);
  const pep = new THREE.MeshStandardMaterial({ color: 0xd11a1a, roughness: 0.5, emissive: 0x300000 });
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 12), pep);
    const a = (i / 6) * Math.PI * 2;
    p.position.set(Math.cos(a) * 0.32, 0.08, Math.sin(a) * 0.32); g.add(p);
  }
  return g;
}

function makeBanana() {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.5, -0.25, 0), new THREE.Vector3(0, 0.55, 0), new THREE.Vector3(0.5, -0.25, 0));
  const g = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.13, 12, false),
    new THREE.MeshStandardMaterial({ color: 0xffe23b, roughness: 0.4, emissive: 0x3a3200 }));
  const wrap = new THREE.Group(); wrap.add(g); return wrap;
}

function makeDisco() {
  const g = new THREE.Group();
  const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 2),
    new THREE.MeshStandardMaterial({ color: 0xcfd6ff, metalness: 1, roughness: 0.05, flatShading: true, emissive: 0x111133 }));
  g.add(ball); return g;
}

function makeDonut() {
  const g = new THREE.Group();
  const d = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.18, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0xff7ad1, roughness: 0.4, emissive: 0x3a0a2a }));
  g.add(d);
  const cols = [0x19f0ff, 0xffe600, 0xffffff, 0x9dff00];
  for (let i = 0; i < 14; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.13),
      new THREE.MeshStandardMaterial({ color: pick(cols), emissive: 0x222222 }));
    const a = rand(0, Math.PI * 2), r = 0.4;
    s.position.set(Math.cos(a) * r, 0.16, Math.sin(a) * r);
    s.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3)); g.add(s);
  }
  return g;
}

function makeUFO() {
  const g = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 12),
    new THREE.MeshStandardMaterial({ color: 0xb0b6c8, metalness: 0.8, roughness: 0.2, emissive: 0x111122 }));
  disc.scale.set(1, 0.3, 1);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x66ffd1, transparent: true, opacity: 0.7, emissive: 0x0a3a2a }));
  dome.position.y = 0.08;
  const lightRing = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xff2bd6, emissive: 0xff2bd6, emissiveIntensity: 2 }));
  lightRing.rotation.x = Math.PI / 2;
  g.add(disc, dome, lightRing); return g;
}

function makeMushroom() {
  const g = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.5, 14),
    new THREE.MeshStandardMaterial({ color: 0xf4ead2, roughness: 0.7, emissive: 0x201c14 }));
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xff3b3b, roughness: 0.5, emissive: 0x3a0000 }));
  cap.position.y = 0.25; cap.scale.y = 0.8;
  const dotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x333333 });
  for (let i = 0; i < 7; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), dotMat);
    const a = rand(0, Math.PI * 2), r = rand(0.05, 0.32);
    d.position.set(Math.cos(a) * r, 0.25 + Math.sqrt(0.42 * 0.42 - r * r) * 0.8 - 0.02, Math.sin(a) * r);
    g.add(d);
  }
  g.add(stem, cap); return g;
}

function makeSaturn() {
  const g = new THREE.Group();
  const planet = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16),
    new THREE.MeshStandardMaterial({ color: pick([0xff9933, 0x66ccff, 0xcc66ff]), roughness: 0.6, emissive: 0x221100 }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.07, 8, 40),
    new THREE.MeshStandardMaterial({ color: 0xffe0a0, emissive: 0x332200 }));
  ring.rotation.x = Math.PI / 2.3; g.add(planet, ring); return g;
}

const BUILDERS = [makeDuck, makePizza, makeBanana, makeDisco, makeDonut, makeUFO, makeMushroom, makeSaturn,
  () => makePotato(rand(0.35, 0.6), pick([0xc68a3a, 0xd89b4a, 0xb8742a]), false)];

// palavra flutuante (sprite via canvas)
function makeWord(text, color = '#19f0ff') {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.font = '900 130px Bungee, Arial Black, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = color; ctx.shadowBlur = 30;
  ctx.fillStyle = color; ctx.fillText(text, 256, 138);
  ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.strokeText(text, 256, 138);
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set(3, 1.5, 1);
  return sp;
}

// ============================================================
//  CENA / CÉU / ESTRELAS
// ============================================================

function buildSky() {
  const geo = new THREE.SphereGeometry(70, 32, 24);
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 3), 3));
  sky = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false }));
  scene.add(sky);
}
function paintSky(topHex, botHex) {
  const top = new THREE.Color(topHex), bot = new THREE.Color(botHex), tmp = new THREE.Color();
  const pos = sky.geometry.attributes.position, col = sky.geometry.attributes.color;
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) / 70 + 1) / 2;
    tmp.copy(bot).lerp(top, t); col.setXYZ(i, tmp.r, tmp.g, tmp.b);
  }
  col.needsUpdate = true;
}

function buildStars() {
  const N = 4500;
  const g = new THREE.BufferGeometry();
  const p = new Float32Array(N * 3), c = new Float32Array(N * 3);
  const palette = [new THREE.Color(0xff2bd6), new THREE.Color(0x19f0ff), new THREE.Color(0xffffff), new THREE.Color(0xffe600)];
  for (let i = 0; i < N; i++) {
    const r = rand(12, 65), th = rand(0, Math.PI * 2), ph = Math.acos(rand(-1, 1));
    p[i * 3] = r * Math.sin(ph) * Math.cos(th);
    p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    p[i * 3 + 2] = r * Math.cos(ph);
    const col = pick(palette); c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
  }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  starfield = new THREE.Points(g, new THREE.PointsMaterial({
    size: 0.35, vertexColors: true, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }));
  scene.add(starfield);
}

function applyDimension(i) {
  dimIndex = ((i % DIMENSIONS.length) + DIMENSIONS.length) % DIMENSIONS.length;
  const d = DIMENSIONS[dimIndex];
  paintSky(d.skyTop, d.skyBot);
  scene.fog.color.set(d.fog);
  lights.forEach((l, k) => l.color.set(d.lights[k % d.lights.length]));
  state.dimension = dimIndex;
  cb.onDimension(d.name);
}

// ============================================================
//  INICIALIZAÇÃO
// ============================================================

export function initWorld(canvas, callbacks = {}) {
  cb = { ...cb, ...callbacks };

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x14002e, 0.018);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.5, 9);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.06;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.7;
  controls.enablePan = false; controls.minDistance = 4; controls.maxDistance = 28;

  buildSky();
  buildStars();

  // luzes
  scene.add(new THREE.AmbientLight(0x404060, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 0.6); dir.position.set(5, 8, 5); scene.add(dir);
  for (let i = 0; i < 3; i++) {
    const l = new THREE.PointLight(0xffffff, 28, 40, 1.6);
    l.userData = { radius: rand(5, 8), speed: rand(0.3, 0.7), phase: i * 2.1, y: rand(-3, 4) };
    lights.push(l); scene.add(l);
  }

  // a heroína
  hero = makePotato(1.6, 0xd0913f, true);
  scene.add(hero); clickables.push(hero);

  // anel-portal toro-nó
  portal = new THREE.Mesh(new THREE.TorusKnotGeometry(4.2, 0.12, 160, 16, 2, 3),
    new THREE.MeshStandardMaterial({ color: 0xff2bd6, emissive: 0xff2bd6, emissiveIntensity: 1.6, metalness: 0.6, roughness: 0.3 }));
  scene.add(portal);

  // primeira leva de objetos orbitando
  spawnObjects(14);

  // palavras flutuantes
  const wordList = [['ABSURDO', '#19f0ff'], ['🥔', '#ffe600'], ['RAVE', '#ff2bd6'], ['?!', '#9dff00'],
    ['WOW', '#ff2bd6'], ['✨', '#19f0ff'], ['BATATA', '#ffe600'], ['SUPREMA', '#ff8ad8']];
  for (const [t, col] of wordList) {
    const sp = makeWord(t, col);
    const r = rand(6, 11), a = rand(0, Math.PI * 2);
    sp.position.set(Math.cos(a) * r, rand(-4, 5), Math.sin(a) * r);
    sp.userData = { baseY: sp.position.y, phase: rand(0, 6) };
    words.push(sp); scene.add(sp);
  }

  // pós-processamento (bloom!)
  const size = new THREE.Vector2(window.innerWidth, window.innerHeight);
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloom = new UnrealBloomPass(size, 0.6, 0.5, 0.8);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  applyDimension(0);

  window.addEventListener('resize', onResize);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('click', onClick);

  renderer.setAnimationLoop(animate);
  return { spawnObjects, cycleDimension, randomDimension, setChaos, popRandom };
}

// ============================================================
//  API
// ============================================================

export function spawnObjects(n = 8) {
  for (let i = 0; i < n && orbiters.length < 70; i++) {
    const obj = pick(BUILDERS)();
    const radius = rand(2.6, 7.5), incl = rand(-0.6, 0.6);
    obj.userData = {
      radius, incl, speed: rand(0.15, 0.6) * (Math.random() < 0.5 ? -1 : 1),
      phase: rand(0, Math.PI * 2), spin: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)),
      bob: rand(0.3, 1.2), bobAmp: rand(0.2, 0.6), pop: 0, base: rand(0.7, 1.25),
    };
    obj.scale.setScalar(obj.userData.base);
    obj.traverse((o) => { if (o.isMesh) o.userData.owner = obj; });
    clickables.push(obj);
    orbiters.push(obj); scene.add(obj);
  }
  addAbsurd(n * 0.6);
}

export function cycleDimension() { applyDimension(dimIndex + 1); addAbsurd(4); return DIMENSIONS[dimIndex].name; }
export function randomDimension() { applyDimension((Math.random() * DIMENSIONS.length) | 0); addAbsurd(4); return DIMENSIONS[dimIndex].name; }
export function setChaos(on) { state.chaos = on; controls.autoRotateSpeed = on ? 6 : 0.7; addAbsurd(on ? 10 : 0); }
export function popRandom() {
  if (orbiters.length) { const o = pick(orbiters); o.userData.pop = 1; }
}

// ============================================================
//  EVENTOS
// ============================================================

function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h); composer.setSize(w, h); bloom.setSize(w, h);
}

let downXY = { x: 0, y: 0 };
function onPointerDown(e) { downXY = { x: e.clientX, y: e.clientY }; }
function onClick(e) {
  // ignora se foi arraste (orbit)
  if (Math.hypot(e.clientX - downXY.x, e.clientY - downXY.y) > 6) return;
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(clickables, true);
  if (hits.length) {
    const owner = hits[0].object.userData.owner || hits[0].object;
    owner.userData.pop = 1.4;
    addAbsurd(1.5);
    cb.onPotatoClick(owner === hero);
  }
}

// ============================================================
//  LOOP DE ANIMAÇÃO
// ============================================================

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  const audio = state.audioLevel, bass = state.bass;
  const ultra = state.ultraMode, chaos = state.chaos;

  controls.update();

  // heroína: flutua, gira de leve, pulsa no grave
  if (hero) {
    hero.position.y = Math.sin(t * 0.9) * 0.25;
    hero.rotation.y = Math.sin(t * 0.3) * 0.5;
    hero.rotation.z = Math.sin(t * 0.5) * 0.08;
    const pop = hero.userData.pop || 0;
    const s = 1.6 * (1 + bass * 0.22 + pop * 0.3 + (ultra ? 0.15 : 0));
    hero.scale.setScalar(s);
    hero.userData.pop = pop * 0.88;
    hero.children.forEach((ch) => { if (ch.userData.spin) ch.rotation.y += dt * (0.2 + audio); });
  }

  // portal toro-nó
  if (portal) {
    portal.rotation.x += dt * 0.3;
    portal.rotation.y += dt * 0.5;
    portal.material.emissiveIntensity = 1.2 + audio * 3;
  }

  // orbitadores
  for (const o of orbiters) {
    const u = o.userData;
    const ang = t * u.speed + u.phase;
    const r = u.radius * (1 + audio * 0.12);
    o.position.set(Math.cos(ang) * r, Math.sin(t * u.bob + u.phase) * u.bobAmp + u.incl * u.radius, Math.sin(ang) * r);
    o.rotation.x += dt * u.spin.x * (chaos ? 4 : 1);
    o.rotation.y += dt * u.spin.y * (chaos ? 4 : 1);
    o.rotation.z += dt * u.spin.z * (chaos ? 4 : 1);
    const pop = u.pop || 0;
    o.scale.setScalar(u.base * (1 + bass * 0.15 + pop * 0.5));
    u.pop = pop * 0.85;
  }

  // luzes orbitando
  lights.forEach((l) => {
    const u = l.userData;
    l.position.set(Math.cos(t * u.speed + u.phase) * u.radius, u.y + Math.sin(t * u.speed) * 2, Math.sin(t * u.speed + u.phase) * u.radius);
    l.intensity = 28 * (1 + audio * 0.8);
  });

  // estrelas girando + palavras flutuando
  if (starfield) { starfield.rotation.y += dt * 0.02; starfield.rotation.x += dt * 0.005; }
  words.forEach((w) => {
    w.position.y = w.userData.baseY + Math.sin(t * 0.8 + w.userData.phase) * 0.5;
    w.material.rotation = Math.sin(t * 0.5 + w.userData.phase) * 0.1;
  });

  // câmera tremendo no caos
  if (chaos) {
    camera.position.x += (Math.random() - 0.5) * 0.15;
    camera.position.y += (Math.random() - 0.5) * 0.15;
  }

  // modo ultra / caos: rotaciona matiz do mundo via fog + bloom
  bloom.strength = 0.45 + audio * 1.0 + (ultra ? 0.5 : 0) + (chaos ? 0.35 : 0);
  if (ultra || chaos) {
    const hue = (t * 0.15) % 1;
    scene.fog.color.setHSL(hue, 0.7, 0.12);
  }

  composer.render();

  // fps
  fpsAcc += dt; fpsFrames++;
  if (fpsAcc >= 0.5) { cb.onFps(Math.round(fpsFrames / fpsAcc)); fpsAcc = 0; fpsFrames = 0; }
}
