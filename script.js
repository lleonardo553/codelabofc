/* ==========================================================================
   CodeLabOFC — script.js
   - Tema claro/escuro com persistência
   - Cabeçalho com borda ao rolar
   - Animações de entrada (reveal)
   - Ano automático no rodapé
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ----------------------------------------------------------------------
     1. TEMA (claro / escuro)
     ---------------------------------------------------------------------- */
  var THEME_KEY = "codelab-theme";
  var themeToggle = document.getElementById("theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      /* localStorage indisponível — ignora */
    }
  }

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "dark" ? "#0a0a0c" : "#ffffff");
    }

    if (themeToggle) {
      var label =
        theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
  }

  // Aplica o tema salvo ou o do sistema antes de qualquer interação
  applyTheme(getStoredTheme() || systemTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  }

  // Segue o sistema caso o usuário nunca tenha escolhido manualmente
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (typeof darkQuery.addEventListener === "function") {
    darkQuery.addEventListener("change", function (event) {
      if (!getStoredTheme()) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  }

  /* ----------------------------------------------------------------------
     2. CABEÇALHO — borda ao rolar
     ---------------------------------------------------------------------- */
  var header = document.getElementById("header");

  function handleScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  /* ----------------------------------------------------------------------
     3. REVEAL — animação de entrada ao scroll
     ---------------------------------------------------------------------- */
  var revealItems = document.querySelectorAll(".reveal");
  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var element = entry.target;
          var delay = parseInt(element.dataset.delay || "0", 10);

          element.style.transitionDelay = delay + "ms";
          element.classList.add("is-visible");

          obs.unobserve(element);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ----------------------------------------------------------------------
     4. RODAPÉ — ano atual
     ---------------------------------------------------------------------- */
  var yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();