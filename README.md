# AFSM — Afonso Silva e Muratori Advogados

Site institucional de página única (long-scroll) do escritório **Afonso Silva e Muratori Advogados**.

Site estático: **HTML5 + Tailwind CSS (via CDN) + JavaScript vanilla**. Sem build, sem dependências — basta abrir o `index.html` ou hospedar a pasta em qualquer serviço de sites estáticos.

## Estrutura

```
index.html        → todo o conteúdo e estilos do site
js/script.js      → interações (menu, reveal, acordeão, formulário)
assets/           → logo, favicon (e futuras fotos/imagens)
```

## Rodar localmente

Abra o `index.html` direto no navegador, ou sirva a pasta (recomendado):

```bash
# com Python
python3 -m http.server 8000
# ou com Node
npx serve .
```

Acesse `http://localhost:8000`.

## Ativar o formulário de contato (obrigatório antes de publicar)

O formulário usa o **[Web3Forms](https://web3forms.com)** (gratuito, sem backend):

1. Acesse https://web3forms.com e crie uma *access key* gratuita informando o e-mail que receberá as mensagens (ex.: `muratori@afsm.adv.br`).
2. No `index.html`, procure por `SEU_ACCESS_KEY_AQUI` e substitua pela sua chave.

Alternativa: [Formspree](https://formspree.io) — troque o `action` do formulário pela URL do seu form Formspree.

## Pendências marcadas no código (`<!-- TODO -->`)

Busque por `TODO` no `index.html` para encontrar todos os pontos:

- **Logo oficial** — o ambiente de desenvolvimento não tinha acesso ao CDN do site antigo. Baixe o logo em
  `https://cdn.b12.io/client_media/yl7MbBFx/11a69c04-5c0f-11ef-a227-0242ac110002-jpg-regular_image.jpeg`,
  salve em `assets/` e substitua o logo em texto do header/rodapé (há um placeholder em `assets/logo-afsm.svg`).
- **Imagens** — o hero e a seção "O Escritório" usam fotos temporárias do Unsplash (hotlink). Substituir por fotos próprias ou baixar imagens definitivas (sugestões de busca no Unsplash: *"são paulo skyline night"*, *"modern boardroom"*, *"glass skyscraper"*). Manter o tratamento monocromático (classe `img-mono`).
- **Fotos dos sócios** — ainda não existem; os cards usam placeholders com as iniciais. Usar retratos em tratamento monocromático, proporção 3:4.
- **Bio do Paulo Afonso Silva** — incompleta, confirmar com o escritório.
- **E-mail da Daniela Lima dos Santos Souza** — confirmar (o site antigo repete `muratori@afsm.adv.br`).
- **Horário de atendimento** — está "Segunda a sexta, das 9h às 18h" como sugestão; confirmar.
- **Número de inscrição da sociedade na OAB/SP** — completar a linha do rodapé.
- **Domínio final** — ajustar `og:url` e o `url` do JSON-LD.
- **Imagem Open Graph** — criar `assets/og-image.jpg` (1200×630) e apontar a tag `og:image`.
- **WhatsApp** — o botão flutuante foi omitido porque o telefone atual é fixo. Se o escritório adotar WhatsApp, adicionar o botão antes do `</body>` (há um comentário marcando o local).

## Editar textos e contatos

Todo o conteúdo está no `index.html`, organizado por seções comentadas
(`HERO`, `MANIFESTO`, `01 · O ESCRITÓRIO`, `02 · ÁREAS DE ATUAÇÃO`, `DIFERENCIAL`, `03 · EQUIPE`, `04 · CONTATO`, `FOOTER`).
Basta localizar a seção e editar o texto. Telefone, e-mail e endereço aparecem em **Contato**, no **rodapé** e no bloco **JSON-LD** do `<head>` — altere nos três lugares.

## Publicar

Qualquer host de site estático funciona:

- **GitHub Pages** — Settings → Pages → Deploy from branch (raiz do repositório).
- **Netlify / Vercel** — arraste a pasta ou conecte o repositório; sem comando de build, diretório de publicação = raiz.

## Paleta e tipografia

| Uso | Valor |
| --- | --- |
| Fundo escuro (base / grafite) | `#0A0B0D` / `#101216` |
| Seções claras (off-white) | `#F5F3EE` |
| Acento dourado champanhe | `#C6A15B` (em fundo claro: `#806030`) |
| Títulos | Fraunces (Google Fonts) |
| Corpo e rótulos | Inter (Google Fonts) |
