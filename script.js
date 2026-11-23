/* =========================================================
   HT CELULARES — script.js
   JavaScript puro, sem bibliotecas.

   >>> EDITE AQUI: todos os dados da empresa ficam neste bloco <<<
   Preencha com as informações oficiais do perfil do Google Maps.
   Campos vazios ("") mostram um texto neutro no site.
   ========================================================= */

const CONFIG = {
  // WhatsApp oficial, só números, com 55 + DDD. Ex.: "5511999999999"
  // Enquanto estiver vazio, os botões abrem o WhatsApp sem contato definido.
  whatsapp: "5511966734366",
  whatsappExibicao: "(11) 96673-4366",            // Como aparece escrito no site. Ex.: "(11) 99999-9999"
  whatsappMensagem: "Olá! Vim pelo site da HT Celulares e gostaria de solicitar um orçamento.",

  telefone: "(11) 96673-4366",
  endereco: "Rua Manoel da Nóbrega, 1266 – Centro, Diadema – SP, 09910-720",   // veio de diretório online: confirme no Google Maps
  resumoHorario: "",               // Ex.: "Segunda a sábado, em horário comercial"

  // Horários de funcionamento: [["Segunda a sexta", "09h às 18h"], ["Sábado", "09h às 13h"]]
  horarios: [],

  // Link oficial do Google Maps (botão "Como chegar" e "Ver no Google")
  mapsLink: "https://maps.app.goo.gl/cXijQSQQNwRm2Aic9",

  // Mapa incorporado. Para ficar 100% exato:
  // Google Maps > Compartilhar > Incorporar um mapa > copie só o endereço do src="..." e cole abaixo.
  mapaEmbed: "",
  mapaBusca: "HT Celulares, Rua Manoel da Nóbrega, 1266, Diadema SP"   // usado enquanto mapaEmbed estiver vazio
};

/* ---------------------------------------------------------
   AVALIAÇÕES — exatamente 5.
   Troque cada item por uma avaliação REAL do Google Maps:
   { nome: "Nome do cliente", estrelas: 5, texto: "Comentário original", provisorio: false }
   Itens com provisorio: true aparecem identificados como conteúdo provisório.
   --------------------------------------------------------- */
const REVIEWS = [
  { nome: "Nome do cliente", estrelas: 0, texto: "Cole aqui o comentário original da avaliação nº 1 do Google Maps.", provisorio: true },
  { nome: "Nome do cliente", estrelas: 0, texto: "Cole aqui o comentário original da avaliação nº 2 do Google Maps.", provisorio: true },
  { nome: "Nome do cliente", estrelas: 0, texto: "Cole aqui o comentário original da avaliação nº 3 do Google Maps.", provisorio: true },
  { nome: "Nome do cliente", estrelas: 0, texto: "Cole aqui o comentário original da avaliação nº 4 do Google Maps.", provisorio: true },
  { nome: "Nome do cliente", estrelas: 0, texto: "Cole aqui o comentário original da avaliação nº 5 do Google Maps.", provisorio: true }
];

/* =========================================================
   A PARTIR DAQUI NÃO PRECISA EDITAR
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Dados da empresa nos elementos ---------- */
  $$("[data-cfg]").forEach(el => {
    const value = CONFIG[el.dataset.cfg];
    if (value) el.textContent = value;
    else if (el.hasAttribute("data-hide-empty")) el.hidden = true;
  });

  // Horários
  const hoursEl = $("#hours");
  if (hoursEl && CONFIG.horarios.length) {
    hoursEl.innerHTML = "";
    CONFIG.horarios.forEach(([dia, hora]) => {
      const li = document.createElement("li");
      const a = document.createElement("span"); a.textContent = dia;
      const b = document.createElement("span"); b.textContent = hora;
      li.append(a, b);
      hoursEl.appendChild(li);
    });
  }

  // WhatsApp
  function waUrl(msg) {
    const text = encodeURIComponent(msg || CONFIG.whatsappMensagem);
    const num = (CONFIG.whatsapp || "").replace(/\D/g, "");
    return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
  }
  $$("[data-whatsapp]").forEach(a => {
    a.href = waUrl(a.dataset.msg);
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Google Maps
  $$("[data-maps]").forEach(a => { a.href = CONFIG.mapsLink; });
  const frame = $("#mapFrame");
  if (frame) {
    frame.src = CONFIG.mapaEmbed ||
      "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.mapaBusca) + "&output=embed";
  }

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const header = $("#header");
  const nav = $("#nav");
  const toggle = $("#menuToggle");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open && window.innerWidth <= 900 ? "hidden" : "";
  }
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- Rolagem suave com compensação do cabeçalho ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- Cabeçalho, barra de progresso e botão flutuante ---------- */
  const progress = $("#scrollProgress");
  const waFloat = $(".wa-float");
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    waFloat.classList.toggle("is-visible", y > 420);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Link ativo no menu ---------- */
  const links = $$(".nav__link");
  const sections = links.map(l => $(l.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Animações de entrada ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  /* ---------- Brilho que segue o mouse nos cards ---------- */
  $$(".glow-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Inclinação 3D da imagem do hero ---------- */
  const tilt = $("#tilt");
  if (tilt && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    const wrap = tilt.parentElement;
    wrap.addEventListener("pointermove", e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
      tilt.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
    });
    wrap.addEventListener("pointerleave", () => {
      tilt.style.setProperty("--rx", "0deg");
      tilt.style.setProperty("--ry", "0deg");
    });
  }

  /* ---------- Carrossel de avaliações ---------- */
  const track = $("#track");
  const viewport = $("#viewport");
  const dotsEl = $("#dots");
  const prev = $("#prev");
  const next = $("#next");
  const AUTOPLAY = true;          // false desliga a troca automática
  const AUTOPLAY_MS = 5500;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function stars(n, draft) {
    let out = `<div class="stars" role="img" aria-label="${draft ? "Estrelas a preencher" : n + " de 5 estrelas"}">`;
    for (let i = 1; i <= 5; i++) {
      out += `<svg class="icon${draft || i > n ? " off" : ""}"><use href="#i-star"/></svg>`;
    }
    return out + "</div>";
  }

  REVIEWS.forEach((r, i) => {
    const draft = !!r.provisorio;
    const initial = draft ? "?" : esc((r.nome || "?").trim().charAt(0).toUpperCase());
    const card = document.createElement("article");
    card.className = "review" + (draft ? " review--draft" : "");
    card.setAttribute("role", "group");
    card.setAttribute("aria-roledescription", "slide");
    card.setAttribute("aria-label", `Avaliação ${i + 1} de ${REVIEWS.length}`);
    card.innerHTML = `
      <div class="review__top">
        <span class="review__avatar" aria-hidden="true">${initial}</span>
        <div class="review__who">
          <div class="review__name">${esc(r.nome)}</div>
          <div class="review__meta">${draft ? "Avaliação no Google" : "Avaliou no Google"}</div>
        </div>
        <svg class="review__g" aria-label="Google"><use href="#i-google"/></svg>
      </div>
      ${stars(r.estrelas, draft)}
      ${draft ? '<span class="review__draft-tag">Conteúdo provisório</span>' : ""}
      <p class="review__text">${draft ? esc(r.texto) : "&ldquo;" + esc(r.texto) + "&rdquo;"}</p>`;
    track.appendChild(card);
  });

  let index = 0, perView = 3, timer = null, hovering = false;

  function getPerView() {
    const w = window.innerWidth;
    return w < 700 ? 1 : w < 1060 ? 2 : 3;
  }
  function maxIndex() { return Math.max(0, REVIEWS.length - perView); }

  function buildDots() {
    dotsEl.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Ir para a posição ${i + 1}`);
      b.addEventListener("click", () => { go(i); restart(); });
      dotsEl.appendChild(b);
    }
  }

  function render(animate = true) {
    track.classList.toggle("no-anim", !animate);
    const card = track.children[0];
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    track.style.transform = `translateX(${-index * step}px)`;
    $$("button", dotsEl).forEach((d, i) => d.setAttribute("aria-selected", String(i === index)));
    $$(".review", track).forEach((c, i) => {
      const visible = i >= index && i < index + perView;
      c.setAttribute("aria-hidden", String(!visible));
    });
  }

  function go(i) {
    const max = maxIndex();
    index = i > max ? 0 : i < 0 ? max : i;   // volta ao início/fim
    render();
  }

  function start() {
    if (!AUTOPLAY || reduceMotion || REVIEWS.length <= perView) return;
    stop();
    timer = setInterval(() => { if (!hovering && !document.hidden) go(index + 1); }, AUTOPLAY_MS);
  }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  prev.addEventListener("click", () => { go(index - 1); restart(); });
  next.addEventListener("click", () => { go(index + 1); restart(); });

  // pausa ao passar o mouse ou focar
  const carousel = $("#carousel");
  carousel.addEventListener("mouseenter", () => { hovering = true; });
  carousel.addEventListener("mouseleave", () => { hovering = false; });
  carousel.addEventListener("focusin", () => { hovering = true; });
  carousel.addEventListener("focusout", () => { hovering = false; });
  carousel.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { go(index - 1); restart(); }
    if (e.key === "ArrowRight") { go(index + 1); restart(); }
  });

  // arrastar / deslizar no celular e no mouse
  let startX = 0, dx = 0, dragging = false;
  viewport.addEventListener("pointerdown", e => {
    dragging = true; startX = e.clientX; dx = 0; hovering = true;
    viewport.classList.add("is-dragging");
  });
  window.addEventListener("pointermove", e => { if (dragging) dx = e.clientX - startX; });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
    hovering = viewport.matches(":hover");
    restart();
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  function layout() {
    const pv = getPerView();
    if (pv !== perView || !dotsEl.children.length) {
      perView = pv;
      track.style.setProperty("--per", pv);
      buildDots();
    }
    index = Math.min(index, maxIndex());
    render(false);
  }
  let rz;
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { layout(); start(); }, 120); });

  perView = getPerView();
  track.style.setProperty("--per", perView);
  buildDots();
  render(false);
  start();
})();
