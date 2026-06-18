/* =================================================================
   Pé no Parque Restaurante — Interações da interface
   ================================================================= */
(function () {
  "use strict";

  const header   = document.querySelector(".site-header");
  const navToggle = document.getElementById("nav-toggle");
  const nav      = document.getElementById("main-nav");
  const backTop  = document.getElementById("back-to-top");
  const WHATSAPP = "551150513376"; // (11) 5051-3376

  /* ---------- Header muda ao rolar + botão voltar ao topo ---------- */
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    backTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);
  }

  function openNav() {
    nav.classList.add("open");
    navToggle.classList.add("open");
    backdrop.classList.add("show");
    document.body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
  }
  function closeNav() {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    backdrop.classList.remove("show");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    nav.classList.contains("open") ? closeNav() : openNav();
  });
  backdrop.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Revelar elementos ao rolar ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-head, .sobre-visual, .sobre-text, .feature-card, .menu-group, .gallery-item, .contato-info, .contato-form-wrap, .map-wrap, .menu-note"
  );
  revealTargets.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 4) * 0.07 + "s";
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Formulário de contato → WhatsApp ---------- */
  const form = document.getElementById("contato-form");
  const hint = document.getElementById("form-hint");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nome     = (form.nome.value || "").trim();
      const telefone = (form.telefone.value || "").trim();
      const pessoas  = (form.pessoas.value || "").trim();
      const mensagem = (form.mensagem.value || "").trim();

      if (!nome) {
        hint.textContent = "Por favor, informe seu nome. 🙂";
        form.nome.focus();
        return;
      }

      let texto = "Olá, Pé no Parque! 🌿%0A%0A";
      texto += "*Nome:* " + encodeURIComponent(nome) + "%0A";
      if (telefone) texto += "*Telefone:* " + encodeURIComponent(telefone) + "%0A";
      if (pessoas)  texto += "*Pessoas:* " + encodeURIComponent(pessoas) + "%0A";
      if (mensagem) texto += "*Mensagem:* " + encodeURIComponent(mensagem) + "%0A";

      const url = "https://wa.me/" + WHATSAPP + "?text=" + texto;
      window.open(url, "_blank", "noopener");

      hint.textContent = "Abrindo o WhatsApp… se não abrir, ligue para (11) 5051-3376. 📞";
      form.reset();
    });
  }

  /* ---------- Ano atual no rodapé ---------- */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
