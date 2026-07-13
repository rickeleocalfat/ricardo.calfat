# Site institucional — Afonso Silva e Muratori Advogados (AFSM)

Site estático de página única (single-page), construído com HTML5 semântico,
[Tailwind CSS via CDN](https://tailwindcss.com) e JavaScript puro. Não há build
nem dependências para instalar.

## Estrutura

```
index.html        → toda a estrutura e o conteúdo do site
js/script.js      → menu, abas, accordion, animações e envio do formulário
assets/           → logo, favicon e demais imagens
README.md         → este arquivo
```

## Como rodar localmente

Basta abrir o `index.html` no navegador (duplo clique funciona). Para um
servidor local (recomendado para testar o formulário):

```bash
# com Python instalado
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## ⚠️ Ativar o formulário de contato (obrigatório)

O formulário usa o serviço gratuito [Web3Forms](https://web3forms.com):

1. Acesse **web3forms.com** e informe o e-mail que receberá as mensagens
   (ex.: `muratori@afsm.adv.br`). Você receberá uma **access key** gratuita.
2. Abra o `index.html`, procure por `SEU_ACCESS_KEY_AQUI` e substitua pela
   chave recebida.

Enquanto a chave não for configurada, o formulário exibirá um aviso em vez de
enviar. Alternativa equivalente: [Formspree](https://formspree.io) — nesse
caso, troque o `action` do formulário pela URL fornecida por eles.

## Onde editar textos e dados

Tudo fica no `index.html`, com comentários `<!-- ... -->` indicando os pontos
editáveis:

| O que | Onde procurar no `index.html` |
|---|---|
| Textos institucionais | Seções `O ESCRITÓRIO` e `DIFERENCIAL` |
| Serviços das áreas | Seção `ÁREAS DE ATUAÇÃO` (itens do accordion) |
| Sócios (nome, bio, e-mail) | Seção `EQUIPE` |
| Telefone, e-mail, endereço, horário | Seção `CONTATO` e rodapé |
| Título e descrição para o Google | `<title>` e `<meta name="description">` no `<head>` |

## Pendências marcadas com `TODO` no código

Procure por `TODO` no `index.html` e nos arquivos de `assets/`:

- **Logo**: `assets/logo-afsm.svg` é um placeholder. Substituir pelo logo
  oficial (o original está no site antigo, hospedado no B12 — o download foi
  bloqueado pela rede durante a geração deste projeto).
- **Fotos dos sócios**: hoje são círculos com iniciais; substituir por fotos.
- **E-mail da Daniela Lima dos Santos Souza**: confirmar (o site antigo
  repetia `muratori@afsm.adv.br` como placeholder).
- **Bio do Paulo Afonso Silva**: confirmar o restante (está incompleta).
- **Horário de atendimento**: está "Segunda a sexta, das 9h às 18h" — confirmar.
- **Registro OAB da sociedade**: linha pronta no rodapé, comentada, aguardando o nº.
- **Domínio final**: substituir `SEU-DOMINIO.com.br` nas meta tags Open Graph
  e no JSON-LD do `<head>`.
- **WhatsApp**: o botão flutuante está pronto e comentado no fim do
  `index.html`; basta descomentar e informar o número, se houver.

## Como publicar

### GitHub Pages (gratuito)

1. No repositório, vá em **Settings → Pages**.
2. Em "Source", escolha **Deploy from a branch**, selecione a branch principal
   e a pasta `/ (root)`. Salve.
3. O site ficará disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

### Netlify (gratuito)

1. Crie uma conta em [netlify.com](https://netlify.com).
2. Arraste a pasta do projeto para o painel ("Deploy manually"), ou conecte o
   repositório do GitHub para publicar automaticamente a cada alteração.

### Vercel

Mesma ideia do Netlify: importe o repositório em
[vercel.com](https://vercel.com) — nenhuma configuração de build é necessária.
