/* ==========================================================================
   AFSM Advogados — scripts do site
   Funcionalidades: menu fixo/mobile, abas das áreas de atuação, accordion,
   destaque do link ativo, animação de entrada e envio do formulário.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. Header fixo: fundo sólido ao rolar a página
     ------------------------------------------------------------------ */
  var header = document.getElementById('site-header');

  function atualizarHeader() {
    if (window.scrollY > 10) {
      header.classList.add('bg-navy', 'shadow-lg', 'shadow-black/20');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.add('bg-transparent');
      header.classList.remove('bg-navy', 'shadow-lg', 'shadow-black/20');
    }
  }

  window.addEventListener('scroll', atualizarHeader, { passive: true });
  atualizarHeader();

  /* ------------------------------------------------------------------
     2. Menu mobile (hambúrguer)
     ------------------------------------------------------------------ */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var iconOpen = document.getElementById('icon-open');
  var iconClose = document.getElementById('icon-close');

  function fecharMenu() {
    mobileMenu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  function abrirMenu() {
    mobileMenu.classList.remove('hidden');
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
    // Garante fundo sólido quando o menu está aberto no topo da página
    header.classList.add('bg-navy');
    header.classList.remove('bg-transparent');
  }

  menuToggle.addEventListener('click', function () {
    var aberto = menuToggle.getAttribute('aria-expanded') === 'true';
    if (aberto) {
      fecharMenu();
      atualizarHeader();
    } else {
      abrirMenu();
    }
  });

  // Fecha o menu ao clicar em um link
  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      fecharMenu();
      atualizarHeader();
    });
  });

  // Fecha o menu com a tecla Esc
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      fecharMenu();
      atualizarHeader();
      menuToggle.focus();
    }
  });

  /* ------------------------------------------------------------------
     3. Abas das Áreas de Atuação (Tributário / Civil e Empresarial)
     ------------------------------------------------------------------ */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.area-tab'));

  var estiloAtivo = ['bg-navy', 'text-white', 'border-navy'];
  var estiloInativo = ['bg-transparent', 'text-navy', 'border-navy/20', 'hover:border-navy/50'];

  function ativarAba(tab) {
    tabs.forEach(function (t) {
      var painel = document.getElementById(t.getAttribute('aria-controls'));
      var ativa = t === tab;

      t.setAttribute('aria-selected', ativa ? 'true' : 'false');
      t.setAttribute('tabindex', ativa ? '0' : '-1');
      painel.classList.toggle('hidden', !ativa);

      if (ativa) {
        t.classList.add.apply(t.classList, estiloAtivo);
        t.classList.remove.apply(t.classList, estiloInativo);
      } else {
        t.classList.remove.apply(t.classList, estiloAtivo);
        t.classList.add.apply(t.classList, estiloInativo);
      }
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      ativarAba(tab);
    });

    // Navegação por setas do teclado entre as abas
    tab.addEventListener('keydown', function (e) {
      var novoIndice = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') novoIndice = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') novoIndice = (i - 1 + tabs.length) % tabs.length;
      if (novoIndice !== null) {
        e.preventDefault();
        ativarAba(tabs[novoIndice]);
        tabs[novoIndice].focus();
      }
    });
  });

  /* ------------------------------------------------------------------
     4. Accordion dos serviços
     ------------------------------------------------------------------ */
  document.querySelectorAll('.accordion-trigger').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var item = botao.closest('.accordion-item');
      var painel = item.querySelector('.accordion-panel');
      var icone = botao.querySelector('.accordion-icon');
      var aberto = botao.getAttribute('aria-expanded') === 'true';

      if (aberto) {
        botao.setAttribute('aria-expanded', 'false');
        painel.style.maxHeight = '0px';
        if (icone) icone.style.transform = '';
      } else {
        botao.setAttribute('aria-expanded', 'true');
        painel.style.maxHeight = painel.scrollHeight + 'px';
        if (icone) icone.style.transform = 'rotate(45deg)';
      }
    });
  });

  /* ------------------------------------------------------------------
     5. Destaque do link ativo no menu conforme a seção visível
     ------------------------------------------------------------------ */
  var secoes = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && secoes.length) {
    var observerNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          navLinks.forEach(function (link) {
            var ativo = link.getAttribute('data-section') === entrada.target.id;
            link.classList.toggle('text-bronze', ativo);
            link.classList.toggle('text-white/80', !ativo);
            if (ativo) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    secoes.forEach(function (secao) {
      observerNav.observe(secao);
    });
  }

  /* ------------------------------------------------------------------
     6. Animação sutil de entrada das seções (.reveal)
     ------------------------------------------------------------------ */
  var elementosReveal = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && elementosReveal.length) {
    var observerReveal = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('revealed');
          observerReveal.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15 });

    elementosReveal.forEach(function (el) {
      observerReveal.observe(el);
    });
  } else {
    // Fallback: exibe tudo se o navegador não suportar IntersectionObserver
    elementosReveal.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ------------------------------------------------------------------
     7. Envio do formulário de contato (Web3Forms)
        A access key é configurada no index.html (campo hidden "access_key").
     ------------------------------------------------------------------ */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  function mostrarStatus(mensagem, sucesso) {
    status.textContent = mensagem;
    status.classList.remove('hidden', 'text-green-700', 'text-red-700');
    status.classList.add(sucesso ? 'text-green-700' : 'text-red-700');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validação nativa dos campos obrigatórios
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var accessKey = form.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === 'SEU_ACCESS_KEY_AQUI') {
        mostrarStatus(
          'O formulário ainda não foi configurado. Obtenha uma access key gratuita em web3forms.com ' +
          'e substitua o valor de "access_key" no index.html.',
          false
        );
        return;
      }

      var botao = form.querySelector('button[type="submit"]');
      var textoOriginal = botao.textContent;
      botao.disabled = true;
      botao.textContent = 'Enviando…';
      status.classList.add('hidden');

      var dados = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: dados,
        headers: { Accept: 'application/json' }
      })
        .then(function (resposta) {
          return resposta.json();
        })
        .then(function (json) {
          if (json.success) {
            mostrarStatus('Mensagem enviada com sucesso! Entraremos em contato em breve.', true);
            form.reset();
          } else {
            mostrarStatus('Não foi possível enviar a mensagem. Tente novamente ou utilize o e-mail muratori@afsm.adv.br.', false);
          }
        })
        .catch(function () {
          mostrarStatus('Falha de conexão ao enviar a mensagem. Tente novamente ou utilize o e-mail muratori@afsm.adv.br.', false);
        })
        .finally(function () {
          botao.disabled = false;
          botao.textContent = textoOriginal;
        });
    });
  }

  /* ------------------------------------------------------------------
     8. Ano atual no rodapé
     ------------------------------------------------------------------ */
  var ano = document.getElementById('ano-atual');
  if (ano) {
    ano.textContent = String(new Date().getFullYear());
  }
})();
