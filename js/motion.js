/**
 * CobbleVerse-flavoured motion: trainer cursor (pokéball + tiny aim nub) + reveal-on-scroll.
 * Respects prefers-reduced-motion and skips on coarse pointers.
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  function initReveals() {
    const els = document.querySelectorAll(
      ".hub-card, .landing-hero, .join-cta, .figure, .callout, .infobox, .article > h2"
    );
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", `${Math.min(i % 8, 7) * 45}ms`);
      io.observe(el);
    });
  }

  function initCursorTracer() {
    if (reduce || coarse) return;
    // Idempotent: bfcache / soft navigations must not stack multiple cursors
    if (document.querySelector(".cursor-fx")) return;

    document.documentElement.classList.add("custom-cursor");

    const root = document.createElement("div");
    root.className = "cursor-fx";
    root.setAttribute("aria-hidden", "true");
    document.body.appendChild(root);

    // Soft CobbleVerse energy ring — lags slightly behind the tip
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    root.appendChild(ring);

    const tip = document.createElement("div");
    tip.className = "cursor-tip";
    // Hot-spot = tiny tip nub at (1,1); pokéball is the main cursor body.
    tip.innerHTML = `
      <svg class="cursor-ball" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="phCursorBallTop" x1="4" y1="3" x2="20" y2="12" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff5a5a"/>
            <stop offset="0.55" stop-color="#e45757"/>
            <stop offset="1" stop-color="#c93b3b"/>
          </linearGradient>
          <linearGradient id="phCursorBallBot" x1="6" y1="12" x2="18" y2="22" gradientUnits="userSpaceOnUse">
            <stop stop-color="#f7fbf8"/>
            <stop offset="1" stop-color="#d7e8df"/>
          </linearGradient>
          <radialGradient id="phCursorBallShine" cx="0.32" cy="0.28" r="0.55">
            <stop stop-color="#fff" stop-opacity="0.5"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- tiny aim nub integrated on the NW rim -->
        <path class="tip-nub" d="M1.1 1.1 7.2 3.05 3.05 7.2Z"/>
        <path class="tip-nub-stroke" d="M1.1 1.1 7.2 3.05 3.05 7.2Z"/>
        <circle class="ball-outline" cx="13.2" cy="13.8" r="8.6"/>
        <path class="ball-top" d="M13.2 5.2a8.6 8.6 0 0 0-8.55 7.85h17.1A8.6 8.6 0 0 0 13.2 5.2z" fill="url(#phCursorBallTop)"/>
        <path class="ball-bot" d="M13.2 22.4a8.6 8.6 0 0 0 8.55-7.85H4.65A8.6 8.6 0 0 0 13.2 22.4z" fill="url(#phCursorBallBot)"/>
        <rect class="ball-band" x="4.5" y="12.5" width="17.4" height="2.55" rx="0.55"/>
        <circle class="ball-button-outer" cx="13.2" cy="13.8" r="3.05"/>
        <circle class="ball-button-inner" cx="13.2" cy="13.8" r="1.7"/>
        <circle class="ball-shine" cx="13.2" cy="13.8" r="8.6" fill="url(#phCursorBallShine)"/>
      </svg>
      <svg class="cursor-ibeam" width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
        <path d="M2.5 1.5h7M6 1.5v17M2.5 18.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
    root.appendChild(tip);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let visible = false;
    let raf = 0;
    let looping = false;

    const interactiveSel =
      "a, button, .hub-card, .join-btn, .join-btn-discord, .lang-btn, .figure-zoom, summary, .chip, label[for], .site-nav a, .navbox-links a, .toc-box a, .search-results a";
    const textSel =
      'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

    function tick() {
      // Ring eases behind the tip — feels alive without hurting aim
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      tip.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (looping) return;
      looping = true;
      raf = requestAnimationFrame(tick);
    }

    function stopLoop() {
      looping = false;
      cancelAnimationFrame(raf);
      raf = 0;
    }

    startLoop();

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!visible) {
          visible = true;
          rx = mx;
          ry = my;
          root.classList.add("is-on");
        }
        if (!looping) startLoop();
        const onText = !!e.target.closest(textSel);
        const onHot = !onText && !!e.target.closest(interactiveSel);
        root.classList.toggle("is-text", onText);
        root.classList.toggle("is-hot", onHot);
      },
      { passive: true }
    );

    window.addEventListener(
      "mousedown",
      () => root.classList.add("is-click"),
      { passive: true }
    );
    window.addEventListener(
      "mouseup",
      () => root.classList.remove("is-click"),
      { passive: true }
    );
    document.addEventListener("mouseleave", () => {
      visible = false;
      root.classList.remove("is-on", "is-hot", "is-text", "is-click");
    });
    document.addEventListener("mouseenter", () => {
      if (visible) root.classList.add("is-on");
    });

    // Browser Back often restores via bfcache: RAF was frozen and cursor:none stays on.
    window.addEventListener("pagehide", () => {
      stopLoop();
      visible = false;
      root.classList.remove("is-on", "is-hot", "is-text", "is-click");
    });
    window.addEventListener("pageshow", (e) => {
      document.documentElement.classList.add("custom-cursor");
      startLoop();
      // After bfcache restore, wait for the next real mouse move to re-show
      if (e.persisted) {
        visible = false;
        root.classList.remove("is-on", "is-hot", "is-text", "is-click");
      }
    });
    window.addEventListener(
      "focus",
      () => {
        if (!looping) startLoop();
      },
      { passive: true }
    );
  }

  function initPressFeedback() {
    document.addEventListener(
      "pointerdown",
      (e) => {
        const el = e.target.closest(
          ".hub-card, .join-btn, .join-btn-discord, .site-nav a, .lang-btn, .navbox-links a"
        );
        if (!el) return;
        el.classList.add("is-press");
      },
      { passive: true }
    );
    document.addEventListener(
      "pointerup",
      () => {
        document.querySelectorAll(".is-press").forEach((el) => el.classList.remove("is-press"));
      },
      { passive: true }
    );
    document.addEventListener(
      "pointercancel",
      () => {
        document.querySelectorAll(".is-press").forEach((el) => el.classList.remove("is-press"));
      },
      { passive: true }
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("motion-ready");
    initReveals();
    initCursorTracer();
    initPressFeedback();
  });
})();
