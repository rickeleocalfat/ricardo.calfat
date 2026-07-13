# Site institucional — Afonso Silva e Muratori Advogados (AFSM)

Site de página única (single-page), estático e sem etapa de build: **HTML + Tailwind CSS (via CDN) + JavaScript puro**. Basta hospedar os arquivos em qualquer serviço de site estático.

## Estrutura

```
index.html          → toda a estrutura e os textos do site
js/script.js        → menu, abas, acordeões e envio do formulário
assets/             → logo, favicon e imagens
README.md           → este guia
```

## Como visualizar localmente

Abra o arquivo `index.html` diretamente no navegador (duplo clique) — é suficiente para ver o site.

Se preferir um servidor local (recomendado para testar o formulário):

```bash
npx serve .
# ou
python3 -m http.server 8000
```

e acesse `http://localhost:8000`.

## ⚠️ Ativar o formulário de contato (obrigatório antes de publicar)

O formulário usa o [Web3Forms](https://web3forms.com) (gratuito, sem cadastro complexo):

1. Acesse **https://web3forms.com** e informe o e-mail que vai **receber** as mensagens (ex.: `muratori@afsm.adv.br`).
2. Você receberá uma **Access Key** nesse e-mail.
3. No `index.html`, procure por `SEU_ACCESS_KEY_AQUI` e substitua pela sua chave:

```html
<input type="hidden" name="access_key" value="SEU_ACCESS_KEY_AQUI">
```

Enquanto a chave não for configurada, o site exibe um aviso ao tentar enviar o formulário.

> Alternativa: [Formspree](https://formspree.io) — crie um formulário lá, troque o atributo `action` do `<form>` pelo endpoint fornecido e remova o campo `access_key`.

## Onde editar cada coisa (tudo no `index.html`)

Os pontos editáveis estão marcados com comentários `✏️ EDITAR` e as pendências com `TODO: substituir`. Use a busca do editor (Ctrl+F):

| O quê | Como encontrar |
|---|---|
| Textos institucionais | comentários `✏️ EDITAR` nas seções |
| Telefone | buscar `2124-3763` (aparece no texto e no link `tel:+551121243763`) |
| E-mails | buscar `@afsm.adv.br` |
| Horário de atendimento | buscar `Segunda a sexta` (há também o horário no JSON-LD do `<head>`) |
| Access Key do formulário | buscar `SEU_ACCESS_KEY_AQUI` |
| Título/descrição no Google | `<title>` e `meta name="description"` no `<head>` |
| Domínio do site (SEO) | buscar `afsm.adv.br` no `<head>` (canonical, Open Graph e JSON-LD) |

## Pendências de conteúdo (marcadas com `TODO: substituir` no código)

- [ ] **Logo definitivo** — o site usa um logo tipográfico provisório. O logo do site antigo está em `https://cdn.b12.io/client_media/yl7MbBFx/11a69c04-5c0f-11ef-a227-0242ac110002-jpg-regular_image.jpeg`; baixe-o, salve como `assets/logo-afsm.jpg` e troque o bloco do logo no cabeçalho (instruções no comentário do próprio `index.html`).
- [ ] **Fotos dos sócios** — hoje são placeholders com iniciais. Salve as fotos em `assets/equipe/` e troque cada placeholder pelo `<img>` indicado no comentário de cada card (mantenha o `loading="lazy"` e o `alt`).
- [ ] **Bio do Paulo Afonso Silva** — texto incompleto; confirmar o restante.
- [ ] **E-mail da Daniela Lima dos Santos Souza** — o site antigo repetia `muratori@afsm.adv.br`, provavelmente por engano; confirmar antes de publicar.
- [ ] **Horário de atendimento** — está "Segunda a sexta, das 9h às 18h" como sugestão; confirmar.
- [ ] **Número de registro da sociedade na OAB/SP** — incluir na última linha do rodapé.
- [ ] **Domínio definitivo** — o `<head>` usa `https://www.afsm.adv.br/` como referência; ajustar se o domínio for outro.
- [ ] **Access Key do Web3Forms** — ver seção acima.

## Botão de WhatsApp (opcional, quando houver número)

O botão flutuante foi **omitido** porque não há número de WhatsApp confirmado. Quando houver, cole este bloco no `index.html`, logo antes de `<script src="js/script.js">` (troque `5511999999999` pelo número com DDI+DDD, só dígitos):

```html
<a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer"
   aria-label="Conversar pelo WhatsApp (abre em nova janela)"
   class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105">
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
</a>
```

## Como publicar

### GitHub Pages
1. No repositório, vá em **Settings → Pages**.
2. Em *Source*, escolha **Deploy from a branch**, selecione a branch principal e a pasta `/ (root)`.
3. O site ficará disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

### Netlify
1. Acesse [netlify.com](https://www.netlify.com) → **Add new site → Import an existing project** e conecte o repositório (ou simplesmente arraste a pasta do site em *Deploys*).
2. Não há comando de build: deixe *Build command* vazio e *Publish directory* = raiz.

Em ambos, é possível apontar um domínio próprio (ex.: `afsm.adv.br`) nas configurações de domínio do serviço.
