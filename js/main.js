/* ============================================================
   TOSCANA ALTA GASTRONOMIA — main.js
   ============================================================ */
(function () {
  "use strict";

  /* -----------------------------------------------------------
     BUSINESS CONFIG — edite aqui os dados de contato
     ----------------------------------------------------------- */
  var CONFIG = {
    // Número do WhatsApp com código do país (55) + DDD + número, só dígitos.
    // ATENÇÃO: confirme o número de WhatsApp oficial e atualize abaixo.
    whatsapp: "551138493484",
    email: "vendas@toscanagastronomia.com.br"
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* -----------------------------------------------------------
     WhatsApp links — qualquer elemento com [data-wa] abre o chat
     ----------------------------------------------------------- */
  function waUrl(message) {
    var text = encodeURIComponent(message || "Olá! Vim pelo site da Toscana.");
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + text;
  }

  $$("[data-wa]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      window.open(waUrl(el.getAttribute("data-wa")), "_blank", "noopener");
    });
  });

  /* -----------------------------------------------------------
     "Receber catálogo" buttons -> rola até o formulário
     ----------------------------------------------------------- */
  $$("[data-form]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var form = $("#contato");
      if (form) form.scrollIntoView({ behavior: "smooth" });
      setTimeout(function () { var n = $("#nome"); if (n) n.focus(); }, 700);
    });
  });

  /* -----------------------------------------------------------
     Mobile nav
     ----------------------------------------------------------- */
  var navToggle = $("#navToggle");
  var nav = $("#nav");
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });
    $$(".nav__link, .nav__cta", nav).forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }

  /* -----------------------------------------------------------
     Header scrolled state
     ----------------------------------------------------------- */
  var header = $("#header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* -----------------------------------------------------------
     Reveal on scroll
     ----------------------------------------------------------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* -----------------------------------------------------------
     Lead form -> monta mensagem e abre WhatsApp
     ----------------------------------------------------------- */
  var form = $("#leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {
        nome: $("#nome").value.trim(),
        email: $("#email").value.trim(),
        telefone: $("#telefone").value.trim(),
        perfil: $("#perfil").value,
        mensagem: $("#mensagem").value.trim()
      };

      var msg =
        "Olá! Gostaria de receber o catálogo da Toscana.\n\n" +
        "• Nome: " + data.nome + "\n" +
        "• E-mail: " + data.email + "\n" +
        "• WhatsApp: " + data.telefone + "\n" +
        "• Perfil: " + data.perfil +
        (data.mensagem ? "\n• Interesse: " + data.mensagem : "");

      window.open(waUrl(msg), "_blank", "noopener");

      form.innerHTML =
        '<div class="lead is-sent">' +
        '<h3 class="lead__title">Obrigado, ' + escapeHtml(data.nome.split(" ")[0]) + '! ✦</h3>' +
        '<p style="color:var(--cream-dim);margin-bottom:18px;">Abrimos uma conversa no WhatsApp com seus dados. ' +
        'Se a janela não abriu, clique no botão abaixo.</p>' +
        '<a href="' + waUrl(msg) + '" target="_blank" rel="noopener" class="btn btn--gold btn--lg btn--block">Abrir WhatsApp</a>' +
        '</div>';
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* -----------------------------------------------------------
     Year + cookie notice (LGPD)
     ----------------------------------------------------------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var cookie = $("#cookie");
  var cookieOk = $("#cookieOk");
  try {
    if (cookie && !localStorage.getItem("toscana_cookie_ok")) {
      setTimeout(function () { cookie.hidden = false; }, 1200);
    }
    if (cookieOk) {
      cookieOk.addEventListener("click", function () {
        cookie.hidden = true;
        try { localStorage.setItem("toscana_cookie_ok", "1"); } catch (e) {}
      });
    }
  } catch (e) { if (cookie) cookie.hidden = true; }
})();
