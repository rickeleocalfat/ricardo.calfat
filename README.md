# 🥔 BATATA CÓSMICA SUPREMA 🥔

> O site mais absurdo do multiverso. Uma experiência 3D interativa onde você
> adora uma batata coroada e interdimensional flutuando no espaço, cercada por
> patos de borracha, pizzas inteiras, discotecas voadoras e MUITO bloom neon.

Feito com **Three.js** puro (vendorizado, sem CDN), **Web Audio API** (trilha de
rave gerada em tempo real, zero arquivos de áudio) e zero responsabilidade.

---

## 🚀 Onde acessar

Você tem três caminhos para entrar na dimensão da batata:

### 1) GitHub Pages (link público — recomendado)
Já existe um workflow que publica o site automaticamente. Para ligar (só uma vez):

1. No GitHub, vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Faça/aguarde um push nesta branch — o workflow `Deploy Batata Cósmica` roda sozinho.
4. O link aparece em **Actions → (último run) → deploy → page_url**, normalmente:

   ```
   https://rickeleocalfat.github.io/ricardo.calfat/
   ```

### 2) Localmente (mais rápido pra testar)
O site usa ES Modules, então **não funciona abrindo o `index.html` direto** (`file://`).
Rode um servidor estático simples:

```bash
# dentro da pasta do projeto
python3 -m http.server 8000
# depois abra no navegador:
#   http://localhost:8000
```

Ou com Node:

```bash
npx serve .
```

### 3) Qualquer host estático
É só HTML/CSS/JS estático. Suba a pasta inteira (incluindo `vendor/`) em
Netlify, Vercel, Cloudflare Pages, etc.

> ⚠️ Precisa de WebGL no navegador (qualquer navegador moderno tem). Use som? Clique
> em **MODO RAVE** — o áudio só inicia após um clique (política de autoplay).

---

## 🎮 O que dá pra fazer

| Ação | O que acontece |
|------|----------------|
| 🖱️ **Arrastar** | Orbita a câmera em volta da Batata Suprema |
| 🖱️ **Clicar nos objetos** | Dá um "boop" (eles incham) e sobe o absurdo |
| 🔊 **MODO RAVE** | Liga a trilha techno gerada ao vivo; o 3D reage à batida |
| 🥔 **INVOCAR BATATAS** | Spawna mais objetos absurdos em órbita |
| 🍕 **CHUVA DE PIZZA** | Exatamente o que diz |
| 🌀 **TROCAR DIMENSÃO** | Muda a paleta/atmosfera (6 dimensões) |
| 💥 **TREMER REALIDADE** | Treme a tela inteira |
| ☢ **CAOS TOTAL** | Acelera tudo, vira arco-íris e enlouquece |
| ⌨️ **Código Konami** | `↑ ↑ ↓ ↓ ← → ← → B A` → **MODO ULTRA** 🌈 |

O **NÍVEL DE ABSURDO** (barra à esquerda) só sobe. Chegue a 100%. 🏆

---

## 🧱 Estrutura

```
index.html              # página + importmap apontando p/ o three vendorizado
css/style.css           # estilo vaporwave/glitch
js/
  main.js               # orquestra mundo + áudio + interface
  world.js              # cena Three.js: batata, órbitas, bloom, dimensões
  audio.js              # techno sintetizado (kick/snare/hat/baixo/arpejo) + analyser
  ui.js                 # botões, rastro de cursor, chuva, tremor, Konami
  state.js              # estado compartilhado (rave, absurdo, áudio, dimensão)
vendor/three/           # Three.js r160 vendorizado (build + addons usados)
.github/workflows/      # deploy automático no GitHub Pages
```

## 🛠️ Tecnologia
- **Three.js r160** (renderização 3D, `EffectComposer` + `UnrealBloomPass` para o glow).
- **Web Audio API** — toda a música é sintetizada no navegador; um `AnalyserNode`
  alimenta o brilho e a escala dos objetos em tempo real (visual reativo à batida).
- HTML/CSS/JS puro, sem build, sem framework, sem dependências externas em runtime.

## 📜 Licença
Código deste projeto sob a licença do repositório (ver `LICENSE`).
Three.js incluído em `vendor/three/` sob a licença MIT (ver `vendor/three/LICENSE`).

---

*Feito com 🥔 e zero responsabilidade. A batata observa.*
