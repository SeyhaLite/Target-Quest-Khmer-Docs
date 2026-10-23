/* ==========================================================================
   diagram-viewer.js — កម្មវិធីមើលដ្យាក្រាម Mermaid (Diagram Viewer) v3

   បញ្ហាដែលដោះស្រាយ៖ Material for MkDocs 9.x render ដ្យាករាម Mermaid ក្នុង
   **closed Shadow DOM** ហើយជំនួស <pre.mermaid> ដោយ <div.mermaid> ដូច្នេះ
   CSS/JS ខាងក្រៅមិនអាចចូលទៅ SVG បានទេ។ ដំណោះស្រាយ៖
   1. រុំ pre.mermaid ក្នុង viewer scaffold មុនពេល Material init (defer order)
      → div.mermaid (shadow host) លេចឡើង *ខាងក្នុង* stage របស់យើង
   2. ចាប់ closed shadow root តាមរយៈការ wrap attachShadow (WeakMap)
      ដើម្បីអាន viewBox/ទំហំធមមជាតិប៉ុណ្ណោះ
   3. អនុវត្ត transform (pan/zoom) លើ **host element** ផ្ទាល់ — transform
      របស់ host មានឥទ្ធិពលលើ shadow content ដែរ → មិនចាំបាច់ចូល shadow

   មុខងារ៖ toolbar (−, %, +, សម្របតាមអេក្រង់, កំណត់ឡើងវិញ, ពេញអេក្រង់),
   wheel zoom នៅត្រង់ cursor, pan ដោយអូស (កណ្តុរ+touch), pinch zoom,
   ក្តារចុច (ព្រួញទិស/+/-/0/F/Esc), zoom % ផ្ទាល់, aria-live, focus-visible,
   fallback overlay ពេល Fullscreen API គ្មាន/បរាជ័យ, resize/fullscreenchange
   គណនាឡើងវិញ, ការពារ NaN, init ម្តងទៀតសុវត្ថិភាព។
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
    stageLabel: "កម្មវិធីមើលដ្យាក្រាម — ប្រើកណ្តុរ ឬកតារចុច (+, −, 0 និងព្រួញទិស) ដើម្បីបង្វិលមើល",
    loading: "កំពុងរង់ចាំដ្យាករាម…",
    failed: "ដ្យាករាមមិនអាចបង្ហាញបានទេ (បណ្តាញ ឬ JavaScript បរាជ័យ) — សូមមើលការពិពណ៌នាជាអត្ថបទនៅខាងក្រោម"
  };

  /* ---------------------------------------------- ចាប់ closed shadow roots */
  var shadows = new WeakMap();
  if (window.Element && Element.prototype.attachShadow) {
    var origAttach = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init) {
      var root = origAttach.call(this, init);
      shadows.set(this, root);
      return root;
    };
  }
  function shadowOf(el) { return el.shadowRoot || shadows.get(el) || null; }

  /* ------------------------------------------------------------ ឧបករណ៍ */
  function clampScale(s) {
    if (!isFinite(s)) return 1;
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
  }

  function naturalSize(svg) {
    var vb = svg && svg.getAttribute && svg.getAttribute("viewBox");
    if (vb) {
      var p = vb.split(/[\s,]+/).map(parseFloat);
      if (p.length === 4 && isFinite(p[2]) && isFinite(p[3]) && p[2] > 0 && p[3] > 0) {
        return { w: p[2], h: p[3] };
      }
    }
    var m = ((svg && svg.getAttribute && svg.getAttribute("style")) || "").match(/max-width:\s*([\d.]+)px/);
    var w = m ? parseFloat(m[1]) : 900;
    if (!isFinite(w) || w <= 0) w = 900;
    return { w: w, h: w * 0.5 };
  }

  /* ------------------------------------------- រចនាសម្ពន្ធម្មវិធីមើលមួយ */
  function makeViewer(stage0) {
    var v = {
      bound: false, host: null, nat: null,
      scale: 1, tx: 0, ty: 0, mode: "default",
      raf: false, fallbackFs: false, lastFocus: null
    };

    var viewer = document.createElement("div");
    viewer.className = "dv-viewer";

    var toolbar = document.createElement("div");
    toolbar.className = "dv-toolbar";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "ការគ្រប់គ្រងដ្យាករាម");

    function mkBtn(cls, text, label, fn) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dv-btn " + cls;
      b.textContent = text;
      b.setAttribute("aria-label", label);
      b.addEventListener("click", function (e) { e.stopPropagation(); if (v.bound) fn(); });
      b.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
      toolbar.appendChild(b);
      return b;
    }

    var btnOut = mkBtn("dv-zoom-out", "−", L.zoomOut, function () { zoomCenter(1 / 1.25); });
    var indicator = document.createElement("span");
    indicator.className = "dv-zoom-indicator";
    indicator.setAttribute("aria-live", "polite");
    indicator.textContent = "—";
    toolbar.appendChild(indicator);
    var btnIn = mkBtn("dv-zoom-in", "+", L.zoomIn, function () { zoomCenter(1.25); });
    var btnFit = mkBtn("dv-fit", L.fit, L.fit, function () { setMode("fit"); });
    var btnReset = mkBtn("dv-reset", L.reset, L.reset, function () { setMode("default"); });
    var btnFs = mkBtn("dv-fullscreen", L.fullscreen, L.fullscreen, toggleFullscreen);

    var stage = document.createElement("div");
    stage.className = "dv-stage";
    stage.setAttribute("tabindex", "0");
    stage.setAttribute("role", "application");
    stage.setAttribute("aria-label", L.stageLabel);

    var loading = document.createElement("p");
    loading.className = "dv-loading";
    loading.textContent = L.loading;
    stage.appendChild(loading);
    stage.appendChild(stage0);           /* pre.mermaid → នៅក្នុង stage */

    var hint = document.createElement("p");
    hint.className = "dv-hint";
    hint.textContent = L.hint;

    viewer.appendChild(toolbar);
    viewer.appendChild(stage);
    viewer.appendChild(hint);

    /* ------------------------------------------------------- transform */
    function apply() {
      if (!v.bound || v.raf) return;
      v.raf = true;
      window.requestAnimationFrame(function () {
        v.raf = false;
        if (!v.host) return;
        v.host.style.transform =
          "translate(" + v.tx + "px," + v.ty + "px) scale(" + v.scale + ")";
        indicator.textContent = Math.round(v.scale * 100) + "%";
      });
    }

    function stageSize() {
      var r = stage.getBoundingClientRect();
      return { w: r.width || stage.clientWidth || 600, h: r.height || stage.clientHeight || 400 };
    }

    function setMode(m) {
      if (!v.bound || !v.nat) return;
      v.mode = m;
      var s = stageSize();
      if (m === "fit") {
        v.scale = clampScale(Math.min(s.w / v.nat.w, s.h / v.nat.h) * 0.98);
        v.tx = (s.w - v.nat.w * v.scale) / 2;
        v.ty = (s.h - v.nat.h * v.scale) / 2;
      } else {
        v.scale = 1;                                  /* ទំហំអានបាន 100% */
        v.tx = (s.w - v.nat.w) / 2;                   /* កណ្តាលផ្តេក (root នៅកណ្តាល) */
        v.ty = v.nat.h <= s.h ? (s.h - v.nat.h) / 2 : 0;
      }
      apply();
    }

    function zoomAtPoint(cx, cy, factor) {
      if (!v.bound) return;
      var ns = clampScale(v.scale * factor);
      var k = ns / v.scale;
      v.tx = cx - (cx - v.tx) * k;
      v.ty = cy - (cy - v.ty) * k;
      v.scale = ns;
      v.mode = "custom";
      apply();
    }
    function zoomCenter(factor) {
      var s = stageSize();
      zoomAtPoint(s.w / 2, s.h / 2, factor);
    }

    /* ------------------------------------------------------- wheel zoom */
    stage.addEventListener("wheel", function (e) {
      if (!v.bound) return;
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoomAtPoint(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });

    /* ------------------------------------------- pan + pinch (pointer) */
    var pointers = new Map();
    var pinchDist0 = 0, pinchScale0 = 1;

    function pdist(a, b) {
      var dx = a.x - b.x, dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    stage.addEventListener("pointerdown", function (e) {
      if (!v.bound) return;
      if (e.target.closest && e.target.closest(".dv-toolbar")) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        pinchDist0 = pdist(pts[0], pts[1]) || 1;
        pinchScale0 = v.scale;
      }
      stage.classList.add("dv-grabbing");
      if (stage.setPointerCapture) {
        try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
    });

    stage.addEventListener("pointermove", function (e) {
      if (!v.bound || !pointers.has(e.pointerId)) return;
      var prev = pointers.get(e.pointerId);
      var cur = { x: e.clientX, y: e.clientY };
      pointers.set(e.pointerId, cur);
      if (pointers.size === 1) {
        v.tx += cur.x - prev.x;
        v.ty += cur.y - prev.y;
        v.mode = "custom";
        apply();
      } else if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        var d = pdist(pts[0], pts[1]) || 1;
        var r = stage.getBoundingClientRect();
        var mid = { x: (pts[0].x + pts[1].x) / 2 - r.left, y: (pts[0].y + pts[1].y) / 2 - r.top };
        var ns = clampScale(pinchScale0 * (d / pinchDist0));
        var k = ns / v.scale;
        v.tx = mid.x - (mid.x - v.tx) * k;
        v.ty = mid.y - (mid.y - v.ty) * k;
        v.scale = ns;
        v.mode = "custom";
        apply();
      }
    });

    function release(e) {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) stage.classList.remove("dv-grabbing");
    }
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);

    /* -------------------------------------------------------- ក្តារចុច */
    stage.addEventListener("keydown", function (e) {
      if (!v.bound) return;
      var step = 48;
      switch (e.key) {
        case "ArrowLeft":  v.tx += step; v.mode = "custom"; apply(); e.preventDefault(); break;
        case "ArrowRight": v.tx -= step; v.mode = "custom"; apply(); e.preventDefault(); break;
        case "ArrowUp":    v.ty += step; v.mode = "custom"; apply(); e.preventDefault(); break;
        case "ArrowDown":  v.ty -= step; v.mode = "custom"; apply(); e.preventDefault(); break;
        case "+": case "=": zoomCenter(1.25); e.preventDefault(); break;
        case "-": case "_": zoomCenter(1 / 1.25); e.preventDefault(); break;
        case "0": setMode("default"); e.preventDefault(); break;
        case "f": case "F": toggleFullscreen(); e.preventDefault(); break;
        case "Escape":
          if (v.fallbackFs) exitFullscreen();
          else if (isRealFs() && document.exitFullscreen) document.exitFullscreen();
          break;
      }
    });

    /* ------------------------------------- fullscreen + fallback overlay */
    function isRealFs() { return document.fullscreenElement === viewer; }

    function toggleFullscreen() {
      if (isRealFs() || v.fallbackFs) { exitFullscreen(); return; }
      v.lastFocus = document.activeElement;
      var p = null;
      if (viewer.requestFullscreen) {
        try { p = viewer.requestFullscreen(); } catch (err) { p = null; }
      }
      if (p && p.catch) {
        p.catch(function () { enterFallback(); });
        p.then && p.then(function () { /* fullscreenchange ដោះស្រាយ UI */ });
      } else if (!viewer.requestFullscreen) {
        enterFallback();
      } else {
        window.setTimeout(function () { if (!isRealFs() && !v.fallbackFs) enterFallback(); }, 150);
      }
    }

    function setFsUi(on) {
      btnFs.textContent = on ? L.exitFullscreen : L.fullscreen;
      btnFs.setAttribute("aria-label", on ? L.exitFullscreen : L.fullscreen);
    }

    function enterFallback() {
      v.fallbackFs = true;
      viewer.classList.add("dv-fallback-fs");
      document.body.classList.add("dv-lock-scroll");
      setFsUi(true);
      if (v.bound) setMode(v.mode === "custom" ? "custom" : "fit");
      btnFs.focus();
    }

    function exitFullscreen() {
      if (isRealFs() && document.exitFullscreen) { document.exitFullscreen(); return; }
      if (v.fallbackFs) {
        v.fallbackFs = false;
        viewer.classList.remove("dv-fallback-fs");
        document.body.classList.remove("dv-lock-scroll");
        setFsUi(false);
        if (v.bound) setMode(v.mode === "custom" ? "custom" : "default");
        if (v.lastFocus && v.lastFocus.focus) v.lastFocus.focus();
      }
    }

    document.addEventListener("fullscreenchange", function () {
      if (isRealFs()) {
        setFsUi(true);
        if (v.bound) setMode(v.mode === "custom" ? "custom" : "fit");
        btnFs.focus();
      } else if (!v.fallbackFs) {
        setFsUi(false);
        if (v.bound) setMode(v.mode === "custom" ? "custom" : "default");
        if (v.lastFocus && v.lastFocus.focus) v.lastFocus.focus();
      }
    });

    /* Esc កម្រិតឯកសារ (focus អាចនៅលើប៊ូតុង មិនមែន stage) */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (v.fallbackFs) exitFullscreen();
      else if (isRealFs() && document.exitFullscreen) document.exitFullscreen();
    });

    /* ------------------------------------------ resize / orientation */
    function onResize() { if (v.bound && v.mode !== "custom") setMode(v.mode); }
    if (window.ResizeObserver) {
      new ResizeObserver(function () { onResize(); }).observe(stage);
    } else {
      window.addEventListener("resize", onResize);
    }
    window.addEventListener("orientationchange", onResize);

    /* ------------------------------------------------------ bind host */
    v.tryBind = function () {
      if (v.bound) return true;
      var host = stage.querySelector(".mermaid");
      if (!host) return false;
      var root = shadowOf(host);
      var svg = (root && root.querySelector) ? root.querySelector("svg") : host.querySelector("svg");
      if (!svg) return false;
      v.host = host;
      v.nat = naturalSize(svg);
      host.classList.add("dv-host");
      host.style.width = v.nat.w + "px";   /* render នៅទំហំធមមជាតិក្នុង shadow */
      if (loading.parentNode) loading.parentNode.removeChild(loading);
      v.bound = true;
      viewer.setAttribute("data-dv-bound", "1");
      setMode("default");
      return true;
    };

    v.el = viewer;
    v.stageEl = stage;
    return v;
  }

  /* ------------------------------------------------------------- ស្កេន */
  var viewers = [];

  function scan() {
    /* រុំ pre.mermaid ដែលមិនទាន់មាន viewer (រត់មុន Material init ព្រោះ defer) */
    var pres = document.querySelectorAll("pre.mermaid");
    for (var i = 0; i < pres.length; i++) {
      var pre = pres[i];
      if (pre.dataset.dvWrapped) continue;
      pre.dataset.dvWrapped = "1";
      var parent = pre.parentNode;      /* ចងចាំទីតាំងដើមមុន pre ផ្លាស់ទី */
      var next = pre.nextSibling;
      var v = makeViewer(pre);          /* stage យក pre ចូលក្នុង */
      parent.insertBefore(v.el, next);  /* viewer ជំនួសកន្លែង pre ដើម */
      viewers.push(v);
    }
    /* ព្យាយាម bind ឡើងវិញ (រង់ចាំ Material render) */
    for (var j = 0; j < viewers.length; j++) viewers[j].tryBind();
  }

  function start() {
    scan();
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () { scan(); });
      mo.observe(document.body, { childList: true, subtree: true });
    }
    /* បើគ្មានការ render ក្នុង 12 វិនាទី → សារបរាជ័យសុភាព */
    window.setTimeout(function () {
      for (var k = 0; k < viewers.length; k++) {
        var v = viewers[k];
        if (!v.bound) {
          var ld = v.stageEl.querySelector(".dv-loading");
          if (ld) ld.textContent = L.failed;
        }
      }
    }, 12000);
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
