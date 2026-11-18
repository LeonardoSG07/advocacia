/* ==========================================================
   SCRIPT.JS · Landing page para advogado
   Índice:
   1. Detecção de JavaScript
   2. Header: sombra ao rolar a página
   3. Animação de entrada dos elementos (reveal)
   4. FAQ em accordion
   5. Ano atual no rodapé
   ========================================================== */

/* Tudo dentro de uma função auto-executável (IIFE):
   evita criar variáveis globais e conflitos com outros scripts. */
(function () {
  "use strict";


  /* ========================================================
     1. DETECÇÃO DE JAVASCRIPT
     O HTML começa com a classe "no-js". Se este script rodar,
     a classe é removida. No CSS, ".no-js .reveal" mantém o
     conteúdo visível para quem está sem JavaScript.
     ======================================================== */
  document.documentElement.classList.remove("no-js");


  /* ========================================================
     2. HEADER: SOMBRA AO ROLAR
     Adiciona a classe "scrolled" quando a página desce mais de
     10px, ativando a borda e a sombra definidas no CSS.
     ======================================================== */
  var header = document.querySelector(".site-header");

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  }

  // passive: true melhora a fluidez da rolagem (o navegador não espera o script)
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // roda uma vez ao carregar, caso a página já abra rolada


  /* ========================================================
     3. ANIMAÇÃO DE ENTRADA (REVEAL)
     Quando um elemento ".reveal" entra na tela, recebe a classe
     "visible" e anima (fade + subida). Depois disso deixa de ser
     observado, então a animação acontece só uma vez.
     ======================================================== */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      // threshold: dispara com 15% do elemento visível
      // rootMargin: espera o elemento subir 40px antes de animar
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback para navegadores antigos: mostra tudo de uma vez
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }


  /* ========================================================
     4. FAQ EM ACCORDION
     Só uma pergunta fica aberta por vez. Os atributos ARIA
     (aria-expanded e aria-hidden) são atualizados para que
     leitores de tela entendam o estado de cada item.
     A animação de altura é feita no CSS.
     ======================================================== */
  var faqButtons = document.querySelectorAll(".faq-q");

  faqButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var isOpen = btn.getAttribute("aria-expanded") === "true";

      // Passo 1: fecha todas as perguntas
      faqButtons.forEach(function (other) {
        other.setAttribute("aria-expanded", "false");
        other.closest(".faq-item").classList.remove("open");
        var panel = document.getElementById(other.getAttribute("aria-controls"));
        if (panel) panel.setAttribute("aria-hidden", "true");
      });

      // Passo 2: se a pergunta clicada estava fechada, abre ela
      // (se já estava aberta, o passo 1 já a fechou)
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        item.classList.add("open");
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.setAttribute("aria-hidden", "false");
      }
    });
  });


  /* ========================================================
     5. ANO ATUAL NO RODAPÉ
     Atualiza o © automaticamente todo começo de ano.
     ======================================================== */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

})();
