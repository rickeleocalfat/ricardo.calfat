# Toscana Alta Gastronomia — Site Institucional & de Vendas

Landing page de alta conversão para a **Toscana Alta Gastronomia**, importadora e
distribuidora de ingredientes premium (trufas, azeites, caviar, queijos, massas e vinhos)
desde 2000.

O site foi construído para **vender**: leva o visitante, de forma fluida, do interesse ao
contato — com CTAs de WhatsApp em todos os pontos-chave, formulário de captura de leads e
gatilhos de confiança.

## ✨ Destaques de conversão

- **Botão flutuante de WhatsApp** sempre visível (canal nº 1 de vendas no Brasil).
- **Mensagens de WhatsApp pré-preenchidas** por categoria de produto — o cliente já chega
  dizendo exatamente o que quer.
- **Formulário de captura de leads** que monta a mensagem e abre o WhatsApp automaticamente.
- **Provas sociais**: 20+ anos, marcas consagradas, "fornecedor de restaurantes estrelados",
  depoimentos e selos de confiança.
- **Seções segmentadas por público** (restaurantes, hotéis, chefs, varejo, presentes, PF).
- **SEO completo**: title/description, Open Graph, Twitter Cards e dados estruturados
  (Schema.org `Store`) para aparecer melhor no Google.
- **100% responsivo** e otimizado para celular.
- **Sem dependências de build** — HTML/CSS/JS puro, abre direto no navegador.

## 📁 Estrutura

```
.
├── index.html          # Página principal (todas as seções)
├── css/styles.css      # Estilos (tema "alta gastronomia": preto, dourado, creme)
├── js/main.js          # Interações: WhatsApp, menu, formulário, animações
├── assets/favicon.svg  # Ícone do site
└── README.md
```

## 🚀 Como visualizar localmente

É um site estático. Basta abrir o `index.html` no navegador, ou subir um servidor local:

```bash
# Python
python3 -m http.server 8000
# depois acesse http://localhost:8000

# ou Node
npx serve .
```

## 🌐 Como publicar (grátis)

- **GitHub Pages**: Settings → Pages → Branch `main` (ou a branch do projeto) → `/root`.
- **Netlify / Vercel / Cloudflare Pages**: arraste a pasta ou conecte o repositório. Sem build.
- **Domínio próprio**: aponte `toscanagastronomia.com.br` para a hospedagem escolhida.

## ⚙️ Personalização rápida

1. **Telefone / WhatsApp / e-mail** — edite o objeto `CONFIG` no topo de `js/main.js`:
   ```js
   var CONFIG = {
     whatsapp: "551138493484",            // 55 + DDD + número (só dígitos)
     email: "vendas@toscanagastronomia.com.br"
   };
   ```
   > ⚠️ Confirme o **número de WhatsApp oficial** da empresa antes de publicar — o valor
   > atual usa o telefone divulgado `(11) 3849-3484`.

2. **Textos e produtos** — todo o conteúdo está em `index.html`, em português e fácil de editar.

3. **Imagens reais** — as fotos em `assets/` (hero, galeria, destaque e logotipo) foram
   extraídas do **catálogo oficial Toscana 2023**. Para trocar qualquer uma, basta substituir
   o arquivo correspondente em `assets/` mantendo o mesmo nome.

4. **Preços** — os valores exibidos (ex.: azeite trufado) vêm do catálogo 2023 e devem ser
   revisados/atualizados conforme a tabela vigente antes de publicar.

5. **Cores** — ajuste as variáveis no início de `css/styles.css` (`--gold`, `--terra`, `--green`, etc.).

## 📊 Próximos passos sugeridos (para vender ainda mais)

- Conectar o formulário também a um e-mail/CRM (ex.: Formspree, RD Station) além do WhatsApp.
- Adicionar **mais fotos** (equipe, loja/ambiente) e atualizar a galeria conforme novos lançamentos.
- Instalar **Google Analytics / Meta Pixel** para medir e remarketing.
- Criar páginas de produto/categoria para ranquear em mais buscas no Google.
- Ativar **Google Meu Negócio** e linkar avaliações reais de clientes.

---

> Observação: os depoimentos incluídos são ilustrativos e devem ser substituídos por
> avaliações reais de clientes antes da publicação definitiva.
