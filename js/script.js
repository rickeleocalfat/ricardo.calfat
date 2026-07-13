/* ══════════════════════════════════════════════════════════════════════
   AFONSO SILVA E MURATORI ADVOGADOS — comportamento da página
   Sem dependências externas (JavaScript puro).
   Em geral não é preciso editar este arquivo; os textos, e-mails e a
   Access Key do formulário são editados diretamente no index.html.
═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Sinaliza que o JS carregou (ativa as animações de aparição do CSS)
  document.documentElement.classList.add('js');

  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Ano automático no rodapé ─────────────────────────────────────── */
  const ano = document.getElementById('ano-atual');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ── Cabeçalho fixo: ganha fundo sólido ao rolar ──────────────────── */
  const cabecalho = document.getElementById('cabecalho');
  const CLASSES_ROLADO = ['bg-navy-900/95', 'backdrop-blur', 'border-b', 'border-white/10', 'shadow-lg', 'shadow-black/20'];

  function atualizarCabecalho() {
    if (!cabecalho) return;
    if (window.scrollY > 10) {
      cabecalho.classList.add(...CLASSES_ROLADO);
    } else {
      cabecalho.classList.remove(...CLASSES_ROLADO);
    }
  }
  atualizarCabecalho();
  window.addEventListener('scroll', atualizarCabecalho, { passive: true });

  /* ── Menu móvel (hambúrguer) ──────────────────────────────────────── */
  const btnMenu = document.getElementById('btn-menu');
  const menuMobile = document.getElementById('menu-mobile');
  const iconeAbrir = document.getElementById('icone-abrir');
  const iconeFechar = document.getElementById('icone-fechar');

  function alternarMenu(abrir) {
    if (!btnMenu || !menuMobile) return;
    const estaAberto = abrir !== undefined ? abrir : menuMobile.classList.contains('hidden');
    menuMobile.classList.toggle('hidden', !estaAberto);
    iconeAbrir.classList.toggle('hidden', estaAberto);
    iconeFechar.classList.toggle('hidden', !estaAberto);
    btnMenu.setAttribute('aria-expanded', String(estaAberto));
    btnMenu.setAttribute('aria-label', estaAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    // Com o menu aberto, o cabeçalho precisa de fundo sólido mesmo no topo da página
    if (estaAberto) {
      cabecalho.classList.add(...CLASSES_ROLADO);
    } else {
      atualizarCabecalho();
    }
  }

  if (btnMenu && menuMobile) {
    btnMenu.addEventListener('click', function () { alternarMenu(); });

    // Fecha ao clicar em qualquer link do menu
    menuMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { alternarMenu(false); });
    });

    // Fecha com a tecla Esc e devolve o foco ao botão
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menuMobile.classList.contains('hidden')) {
        alternarMenu(false);
        btnMenu.focus();
      }
    });

    // Fecha automaticamente se a janela for alargada até o layout de desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) alternarMenu(false);
    });
  }

  /* ── Destaque do item ativo do menu conforme a rolagem ────────────── */
  const linksMenu = document.querySelectorAll('.nav-link[data-spy]');

  function marcarLinkAtivo(id) {
    linksMenu.forEach(function (link) {
      const ativo = link.getAttribute('data-spy') === id;
      link.classList.toggle('text-bronze-200', ativo);
      link.classList.toggle('text-white/80', !ativo);
      if (ativo) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window && linksMenu.length) {
    const observadorSecoes = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          marcarLinkAtivo(entrada.target.getAttribute('data-section'));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('[data-section]').forEach(function (secao) {
      observadorSecoes.observe(secao);
    });
  }

  /* ── Abas das Áreas de Atuação ────────────────────────────────────── */
  const listaAbas = document.querySelector('[role="tablist"]');

  if (listaAbas) {
    const abas = Array.from(listaAbas.querySelectorAll('[role="tab"]'));

    function ativarAba(aba) {
      abas.forEach(function (outra) {
        const ativa = outra === aba;
        outra.setAttribute('aria-selected', String(ativa));
        outra.tabIndex = ativa ? 0 : -1;
        outra.classList.toggle('border-bronze', ativa);
        outra.classList.toggle('text-ink', ativa);
        outra.classList.toggle('border-transparent', !ativa);
        outra.classList.toggle('text-neutral-500', !ativa);
        const painel = document.getElementById(outra.getAttribute('aria-controls'));
        if (painel) painel.hidden = !ativa;
      });
      aba.focus();
    }

    abas.forEach(function (aba, indice) {
      aba.addEventListener('click', function () { ativarAba(aba); });
      aba.addEventListener('keydown', function (e) {
        let destino = null;
        if (e.key === 'ArrowRight') destino = abas[(indice + 1) % abas.length];
        if (e.key === 'ArrowLeft') destino = abas[(indice - 1 + abas.length) % abas.length];
        if (e.key === 'Home') destino = abas[0];
        if (e.key === 'End') destino = abas[abas.length - 1];
        if (destino) {
          e.preventDefault();
          ativarAba(destino);
        }
      });
    });
  }

  /* ── Acordeões (lista de serviços) ────────────────────────────────── */
  document.querySelectorAll('.acc-item').forEach(function (item) {
    const gatilho = item.querySelector('.acc-trigger');
    if (!gatilho) return;

    // Estado inicial definido pelo aria-expanded escrito no HTML
    item.classList.toggle('acc-open', gatilho.getAttribute('aria-expanded') === 'true');

    gatilho.addEventListener('click', function () {
      const abrir = gatilho.getAttribute('aria-expanded') !== 'true';
      gatilho.setAttribute('aria-expanded', String(abrir));
      item.classList.toggle('acc-open', abrir);
    });
  });

  /* ── Aparição suave das seções ao rolar ───────────────────────────── */
  const elementosReveal = document.querySelectorAll('.reveal');

  if (reduzirMovimento || !('IntersectionObserver' in window)) {
    elementosReveal.forEach(function (el) { el.classList.add('revealed'); });
  } else {
    const observadorReveal = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('revealed');
          obs.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });
    elementosReveal.forEach(function (el) { observadorReveal.observe(el); });
  }

  /* ── Formulário de contato (Web3Forms) ────────────────────────────── */
  const formulario = document.getElementById('form-contato');
  const status = document.getElementById('form-status');
  const btnEnviar = document.getElementById('btn-enviar');

  function mostrarStatus(mensagem, tipo) {
    if (!status) return;
    status.textContent = mensagem;
    status.classList.remove('hidden', 'text-green-700', 'text-red-700');
    status.classList.add(tipo === 'sucesso' ? 'text-green-700' : 'text-red-700');
  }

  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validação nativa do navegador (campos obrigatórios, e-mail e LGPD)
      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
      }

      const chave = formulario.querySelector('[name="access_key"]');
      if (!chave || chave.value === 'SEU_ACCESS_KEY_AQUI') {
        // Chave ainda não configurada — orienta quem estiver montando o site
        mostrarStatus('O formulário ainda não foi ativado: falta configurar a Access Key do Web3Forms (instruções no README.md).', 'erro');
        return;
      }

      const rotuloOriginal = btnEnviar.innerHTML;
      btnEnviar.disabled = true;
      btnEnviar.textContent = 'Enviando…';

      const dados = Object.fromEntries(new FormData(formulario));

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(dados)
      })
        .then(function (resposta) { return resposta.json(); })
        .then(function (resultado) {
          if (resultado.success) {
            mostrarStatus('Mensagem enviada com sucesso. Retornaremos o contato em breve — obrigado!', 'sucesso');
            formulario.reset();
          } else {
            mostrarStatus('Não foi possível enviar sua mensagem. Tente novamente ou escreva para muratori@afsm.adv.br.', 'erro');
          }
        })
        .catch(function () {
          mostrarStatus('Falha de conexão ao enviar. Verifique sua internet e tente novamente, ou escreva para muratori@afsm.adv.br.', 'erro');
        })
        .finally(function () {
          btnEnviar.disabled = false;
          btnEnviar.innerHTML = rotuloOriginal;
        });
    });
  }
})();
