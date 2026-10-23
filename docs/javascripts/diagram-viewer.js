/* ==========================================================================
   diagram-viewer.js — កម្មវិធីមើលដ្យាក្រាម Mermaid (Diagram Viewer)
   ផ្តល់៖ toolbar (zoom in/out, fit, reset, fullscreen), pan ដោយអូស,
   wheel zoom, pinch zoom, zoom %, keyboard access, fallback overlay។

   គោលការណ៍៖
   - គ្មាន dependency ខាងក្រៅ (vanilla JS) — ស្របនឹង MkDocs Material + RTD
   - មិនបំផ្លាញ SVG ដើម៖ ប្រើ CSS transform លើ element svg ប៉ុណ្ណោះ
   - ការពារ NaN / scale មិនសមហេតុផល (clamp 0.1–8, isFinite checks)
   - ការ init ម្តងទៀតមានសុវត្ថិភាព (dataset.dvReady guard)
   - គាំទ្រ Material "instant navigation" (document$) + MutationObserver
   - គោរព prefers-reduced-motion (គ្មាន transition លើ transform)
   ========================================================================== */
(function () {
  "use strict";

  var MIN_SCALE = 0.1;
  var MAX_SCALE = 8;

  var L = {
    zoomIn: "ពង្រីក",
    zoomOut: "បង្រួម",
    fit: "សម្របតាមអេក្រង់",
    reset: "កំណត់ឡើងវិញ",
    fullscreen: "ពេញអេក្រង់",
    exitFullscreen: "ចេញពីពេញអេក្រង់",
    hint: "អូសដើម្បីរំកិល · រមូរកណ្តុរដើម្បីពង្រីក/បង្រួម · ប្រើ «សម្របតាមអេក្រង់» ឬ «ពេញអេក្រង់» ដើម្បីពិនិត្យរចនាសម្ព័ន្ធ",
    viewerLabel: "កម្មវិធីមើលដ្យាក្រាម — ប្រើកណ្តុរ ឬក្តារចុច (+, −, 0 និងព្រួញទិស) ដើម្បីបង្វិលមើល"
  };

  /* ---------------------------------------------------------------- ឧបករណ៍ */
  function clampScale(s) {
    if (!isFinite(s)) return 1;
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
  }

  function naturalSize(svg) {
    var vb = svg.getAttribute("viewBox");
    if (vb) {
      var p = vb.split(/[\s,]+/).map(parseFloat);
      if (p.length === 4 && isFinite(p[2]) && isFinite(p[3]) && p[2] > 0 && p[3] > 0) {
        return { w: p[2], h: p[3] };
      }
    }
    var m = (svg.getAttribute("style") || "").match(/max-width:\s*([\d.]+)px/);
    var w = m ? parseFloat(m[1]) : 800;
    return { w: w || 800, h: (w || 800) * 0.6 };
  }

  /* ------------------------------------------------------- កម្មវិធីមើលមួយ */
  function buildViewer(holder) {
    var svg = holder.querySelector("svg");
    if (!svg || holder.dataset.dvReady) return;
    holder.dataset.dvReady = "1";

    var nat = naturalSize(svg);

    /* --- រចនាសម្ព័ន្ធ DOM: viewer > (toolbar, stage > holder > svg, hint) --- */
    var viewer = document.createElement("div");
    viewer.className = "dv-viewer";
    holder.parentNode.insertBefore(viewer, holder);

    var toolbar = document.createElement("div");
    toolbar.className = "dv-toolbar";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "ការគ្រប់គ្រងដ្យាក្រាម");

    function mkBtn(cls, text, label, fn) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dv-btn " + cls;
      b.textContent = text;
      b.setAttribute("aria-label", label);
      b.addEventListener("click", fn);
      /* កុំឱយការចុចប៊ូតុងចាប់ផ្តើម pan */
      b.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
      toolbar.appendChild(b);
      return b;
    }

    var btnOut = mkBtn("dv-zoom-out", "−", L.zoomOut, function () { zoomCenter(1 / 1.25); });
    var indicator = document.createElement("span");
    indicator.className = "dv-zoom-indicator";
    indicator.setAttribute("aria-live", "polite");
    indicator.textContent = "100%";
    toolbar.appendChild(indicator);
    var btnIn = mkBtn("dv-zoom-in", "+", L.zoomIn, function () { zoomCenter(1.25); });
    var btnFit = mkBtn("dv-fit", L.fit, L.fit, function () { setMode("fit"); });
    var btnReset = mkBtn("dv-reset", L.reset, L.reset, function () { setMode("default"); });
    var btnFs = mkBtn("dv-fullscreen", L.fullscreen, L.fullscreen, toggleFullscreen);

    var stage = document.createElement("div");
    stage.className = "dv-stage";
    stage.setAttribute("tabindex", "0");
    stage.setAttribute("role", "application");
    stage.setAttribute("aria-label", L.viewerLabel);
    stage.appendChild(holder);

    var hint = document.createElement("p");
    hint.className = "dv-hint";
    hint.textContent = L.hint;

    viewer.appendChild(toolbar);
    viewer.appendChild(stage);
    viewer.appendChild(hint);

    /* --- ស្ថានភាព transform --- */
    var scale = 1, tx = 0, ty = 0;
    var mode = "default";           /* default | fit | custom */
    var rafPending = false;
    var usingFallbackFs = false;
    var lastFocus = null;

    /* ដកការកំណត់ទទឹងចាស់ចេញ — viewer គ្រប់គ្រងទំហំដោយខ្លួនឯង */
    holder.classList.remove("mz-scroll", "mz-clickable");
    holder.style.width = "";
    svg.style.maxWidth = "none";
    svg.style.width = nat.w + "px";
    svg.style.height = nat.h + "px";
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.transformOrigin = "0 0";

    function stageSize() {
      var r = stage.getBoundingClientRect();
      var w = r.width || stage.clientWidth || 600;
      var h = r.height || stage.clientHeight || 400;
      return { w: w, h: h };
    }

    function apply() {
      if (rafPending) return;
      rafPending = true;
      window.requestAnimationFrame(function () {
        rafPending = false;
        svg.style.transform =
          "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
        updateZoomIndicator();
      });
    }

    function updateZoomIndicator() {
      indicator.textContent = Math.round(scale * 100) + "%";
    }

    function setMode(m) {
      mode = m;
      var s = stageSize();
      if (m === "fit") {
        scale = clampScale(Math.min(s.w / nat.w, s.h / nat.h) * 0.98);
        tx = (s.w - nat.w * scale) / 2;
        ty = (s.h - nat.h * scale) / 2;
      } else { /* default: ទំហំអានបាន 100% — កណ្តាលផ្តេកដើម្បីឱ្យឃើញ root ភ្លាម */
        scale = 1;
        tx = (s.w - nat.w * scale) / 2;   /* អវិជ្ជមានបើធំជាងធុង → កណ្តាល */
        ty = nat.h * scale <= s.h ? (s.h - nat.h * scale) / 2 : 0;
      }
      apply();
    }

    function zoomAtPoint(cx, cy, factor) {
      var ns = clampScale(scale * factor);
      if (!isFinite(ns)) return;
      var k = ns / scale;
      tx = cx - (cx - tx) * k;
      ty = cy - (cy - ty) * k;
      scale = ns;
      mode = "custom";
      apply();
    }

    function zoomCenter(factor) {
      var s = stageSize();
      zoomAtPoint(s.w / 2, s.h / 2, factor);
    }

    /* --- wheel zoom (តែក្នុង stage — មិនរារាំង scroll ទំព័រខាងក្រៅ) --- */
    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoomAtPoint(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });

    /* --- pan + pinch តាម pointer events (កណ្តុរ + touch) --- */
    var pointers = new Map();
    var pinchStartDist = 0, pinchStartScale = 1;

    function dist2p(a, b) {
      var dx = a.x - b.x, dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    stage.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest(".dv-toolbar")) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        pinchStartDist = dist2p(pts[0], pts[1]) || 1;
        pinchStartScale = scale;
      }
      stage.classList.add("dv-grabbing");
      if (stage.setPointerCapture) {
        try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
    });

    stage.addEventListener("pointermove", function (e) {
      if (!pointers.has(e.pointerId)) return;
      var prev = pointers.get(e.pointerId);
      var cur = { x: e.clientX, y: e.clientY };
      pointers.set(e.pointerId, cur);
      if (pointers.size === 1) {
        tx += cur.x - prev.x;
        ty += cur.y - prev.y;
        mode = "custom";
        apply();
      } else if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        var d = dist2p(pts[0], pts[1]) || 1;
        var r = stage.getBoundingClientRect();
        var mid = { x: (pts[0].x + pts[1].x) / 2 - r.left, y: (pts[0].y + pts[1].y) / 2 - r.top };
        var ns = clampScale(pinchStartScale * (d / pinchStartDist));
        var k = ns / scale;
        tx = mid.x - (mid.x - tx) * k;
        ty = mid.y - (mid.y - ty) * k;
        scale = ns;
        mode = "custom";
        apply();
      }
    });

    function releasePointer(e) {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) stage.classList.remove("dv-grabbing");
    }
    stage.addEventListener("pointerup", releasePointer);
    stage.addEventListener("pointercancel", releasePointer);

    /* --- ក្តារចុចលើ stage --- */
    stage.addEventListener("keydown", function (e) {
      var step = 48;
      switch (e.key) {
        case "ArrowLeft":  tx += step; mode = "custom"; apply(); e.preventDefault(); break;
        case "ArrowRight": tx -= step; mode = "custom"; apply(); e.preventDefault(); break;
        case "ArrowUp":    ty += step; mode = "custom"; apply(); e.preventDefault(); break;
        case "ArrowDown":  ty -= step; mode = "custom"; apply(); e.preventDefault(); break;
        case "+": case "=": zoomCenter(1.25); e.preventDefault(); break;
        case "-": case "_": zoomCenter(1 / 1.25); e.preventDefault(); break;
        case "0": setMode("default"); e.preventDefault(); break;
        case "f": case "F": toggleFullscreen(); e.preventDefault(); break;
        case "Escape": if (usingFallbackFs) exitFullscreen(); break;
      }
    });

    /* --- fullscreen: Fullscreen API + fallback overlay --- */
    function isRealFs() {
      return document.fullscreenElement === viewer;
    }

    function toggleFullscreen() {
      if (isRealFs() || usingFallbackFs) { exitFullscreen(); return; }
      lastFocus = document.activeElement;
      var p = null;
      if (viewer.requestFullscreen) {
        try { p = viewer.requestFullscreen(); } catch (err) { p = null; }
      }
      if (p && p.catch) {
        p.catch(function () { enterFallback(); });
      } else if (!viewer.requestFullscreen) {
        enterFallback();
      } else if (!p) {
        /* requestFullscreen ត្រឡប់ undefined (promise គ្មាន) — ពិនិត្យក្រោយមួយ tick */
        window.setTimeout(function () { if (!isRealFs()) enterFallback(); }, 120);
      }
    }

    function enterFallback() {
      usingFallbackFs = true;
      viewer.classList.add("dv-fallback-fs");
      document.body.classList.add("dv-lock-scroll");
      btnFs.textContent = L.exitFullscreen;
      btnFs.setAttribute("aria-label", L.exitFullscreen);
      setMode(mode === "custom" ? "custom" : "fit");
      btnFs.focus();
    }

    function exitFullscreen() {
      if (isRealFs() && document.exitFullscreen) {
        document.exitFullscreen();
        return; /* fullscreenchange នឹងបញ្ចប់ការសម្អាត */
      }
      if (usingFallbackFs) {
        usingFallbackFs = false;
        viewer.classList.remove("dv-fallback-fs");
        document.body.classList.remove("dv-lock-scroll");
        btnFs.textContent = L.fullscreen;
        btnFs.setAttribute("aria-label", L.fullscreen);
        setMode(mode === "custom" ? "custom" : "default");
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
    }

    document.addEventListener("fullscreenchange", function () {
      if (isRealFs()) {
        btnFs.textContent = L.exitFullscreen;
        btnFs.setAttribute("aria-label", L.exitFullscreen);
        setMode(mode === "custom" ? "custom" : "fit");
        btnFs.focus();
      } else {
        btnFs.textContent = L.fullscreen;
        btnFs.setAttribute("aria-label", L.fullscreen);
        setMode(mode === "custom" ? "custom" : "default");
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
    });

    /* --- resize / orientation: គណនាឡើងវិញបើមិនមែន custom --- */
    function onResize() {
      if (mode !== "custom") setMode(mode);
    }
    if (window.ResizeObserver) {
      new ResizeObserver(function () { onResize(); }).observe(stage);
    } else {
      window.addEventListener("resize", onResize);
    }
    window.addEventListener("orientationchange", onResize);

    /* បង្ហាញដំបូង */
    setMode("default");
  }

  /* ------------------------------------------------------------- ការស្កេន */
  function scan() {
    var holders = document.querySelectorAll(".mermaid");
    for (var i = 0; i < holders.length; i++) {
      if (holders[i].querySelector("svg")) buildViewer(holders[i]);
    }
  }

  function start() {
    scan();
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () { scan(); });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (typeof window.document$ !== "undefined" && window.document$.subscribe) {
    window.document$.subscribe(function () { scan(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
