/* =========================================================================
   AFSM — Afonso Silva e Muratori Advogados
   Interações: header ao rolar, menu mobile, reveal no scroll, parallax,
   acordeão das áreas de atuação e envio do formulário (Web3Forms).
   ========================================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Header: transparente sobre o hero, sólido escuro ao rolar
     --------------------------------------------------------------------- */
  var header = document.getElementById('header');

  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add('bg-ink/95', 'backdrop-blur-sm', 'border-white/10');
      header.classList.remove('border-transparent');
    } else {
      header.classList.remove('bg-ink/95', 'backdrop-blur-sm', 'border-white/10');
      header.classList.add('border-transparent');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---------------------------------------------------------------------
     Menu mobile
     --------------------------------------------------------------------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuBars = menuToggle.querySelectorAll('.menu-bar');

  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    mobileMenu.setAttribute('aria-hidden', String(!open));
    mobileMenu.classList.toggle('invisible', !open);
    mobileMenu.classList.toggle('opacity-0', !open);
    document.body.style.overflow = open ? 'hidden' : '';

    // Transforma as duas barras do hambúrguer em um "X"
    if (open) {
      menuBars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      menuBars[1].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      menuBars[0].style.transform = '';
      menuBars[1].style.transform = '';
    }
  }

  menuToggle.addEventListener('click', function () {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });

  /* ---------------------------------------------------------------------
     Reveal no scroll (IntersectionObserver)
     --------------------------------------------------------------------- */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------------------
     Parallax sutil no hero
     --------------------------------------------------------------------- */
  var heroImage = document.getElementById('hero-image');

  if (heroImage && !prefersReducedMotion) {
    var ticking = false;

    function updateParallax() {
      var offset = window.scrollY;
      if (offset < window.innerHeight) {
        heroImage.style.transform = 'translateY(' + offset * 0.18 + 'px)';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Acordeão — Áreas de Atuação
     --------------------------------------------------------------------- */
  document.querySelectorAll('.accordion-toggle').forEach(function (toggle) {
    var panel = document.getElementById(toggle.getAttribute('aria-controls'));

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  // Recalcula a altura de painéis abertos ao redimensionar a janela
  window.addEventListener('resize', function () {
    document.querySelectorAll('.accordion-toggle[aria-expanded="true"]').forEach(function (toggle) {
      var panel = document.getElementById(toggle.getAttribute('aria-controls'));
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });

  /* ---------------------------------------------------------------------
     Formulário de contato — Web3Forms (https://web3forms.com)
     Lembre-se de substituir SEU_ACCESS_KEY_AQUI no index.html.
     --------------------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var submitButton = document.getElementById('form-submit');
  var statusEl = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      submitButton.disabled = true;
      submitButton.textContent = 'Enviando…';
      statusEl.textContent = '';
      statusEl.className = 'min-h-[1.25rem] text-center text-sm font-light';

      var formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            statusEl.textContent = 'Mensagem enviada. Retornaremos em breve.';
            statusEl.classList.add('text-gold');
          } else {
            statusEl.textContent = 'Não foi possível enviar. Tente novamente ou escreva para muratori@afsm.adv.br.';
            statusEl.classList.add('text-red-400');
          }
        })
        .catch(function () {
          statusEl.textContent = 'Falha de conexão. Tente novamente ou escreva para muratori@afsm.adv.br.';
          statusEl.classList.add('text-red-400');
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.textContent = 'Enviar mensagem';
        });
    });
  }

  /* ---------------------------------------------------------------------
     Ano corrente no rodapé
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
