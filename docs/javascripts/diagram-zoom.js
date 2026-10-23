/* ==========================================================================
   diagram-zoom.js — ពង្រីកដ្យាក្រាម Mermaid ពេញអេក្រង់ + zoom/pan
   (Fullscreen zoom & pan for Mermaid diagrams)

   មុខងារ៖
   1. ចុចលើដ្យាក្រាមណាមួយ → បើក overlay ពេញអេក្រង់
   2. ក្នុង overlay៖ រមូរកណ្តុរ = zoom (នៅត្រង់ទីតាំង cursor), អូស = pan,
      ប៊ូតុង + / − / សមនឹងអេក្រង់ / ✕, ក្តារចុច Esc = បិទ
   3. ដ្យាក្រាមធំជាងទទឹងទំព័រ → បង្ហាញតាមទំហំពិត + scroll ផ្តេក (មិនបង្រួមអក្សរ)

   គ្មាន dependency ខាងក្រៅ — ដំណើរការលើ Read the Docs និង offline។
   គាំទ្រ Material "instant navigation" តាម document$ (RxJS subject)។
   ========================================================================== */
(function () {
  "use strict";

  var HINT =
    "រមូរកណ្តុរ៖ ពង្រីក/បង្រួម · អូស៖ រំកិល · Esc ឬ ✕ ៖ បិទ";

  /* --- ជំនួយ: វាស់ទំហំធម្មជាតិរបស់ SVG (ពី inline max-width ឬ viewBox) --- */
  function naturalSize(svg) {
    var vb = svg.getAttribute("viewBox");
    if (vb) {
      var p = vb.split(/[\s,]+/).map(parseFloat);
      if (p.length === 4 && p[2] > 0 && p[3] > 0) return { w: p[2], h: p[3] };
    }
    var style = svg.getAttribute("style") || "";
    var m = style.match(/max-width:\s*([\d.]+)px/);
    var w = m ? parseFloat(m[1]) : 800;
    return { w: w, h: w * 0.6 };
  }

  /* --- ភ្ជាប់មុខងារទៅដ្យាក្រាមមួយ --- */
  function enhance(holder) {
    var svg = holder.querySelector("svg");
    if (!svg || holder.getAttribute("data-zoom-ready")) return;
    holder.setAttribute("data-zoom-ready", "1");

    var nat = naturalSize(svg);

    /* បើដ្យាក្រាមធំជាងធុង → បង្ហាញទំហំពិត ឱ្យអ្នកអាន scroll ផ្តេកបាន */
    if (holder.clientWidth && nat.w > holder.clientWidth + 8) {
      holder.classList.add("mz-scroll");
      svg.style.maxWidth = "none";
      svg.style.width = nat.w + "px";
      svg.style.height = "auto";
    }

    holder.classList.add("mz-clickable");
    holder.setAttribute("title", "ចុចដើម្បីពង្រីកពេញអេក្រង់");
    holder.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest("a")) return;
      openOverlay(svg, nat);
    });
  }

  /* --- បើក overlay ពេញអេក្រង់ ជាមួយ zoom/pan --- */
  function openOverlay(svg, nat) {
    var overlay = document.createElement("div");
    overlay.className = "mz-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "ដ្យាក្រាមពង្រីកពេញអេក្រង់");

    /* របារឧបករណ៍ (ប៊ូតុងអក្សរធម្មតា គ្មាន icon font) */
    var bar = document.createElement("div");
    bar.className = "mz-toolbar";

    function mkBtn(text, label, fn) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.setAttribute("aria-label", label);
      b.addEventListener("click", fn);
      bar.appendChild(b);
      return b;
    }

    var stage = document.createElement("div");
    stage.className = "mz-stage";

    var clone = svg.cloneNode(true);
    clone.removeAttribute("style");
    clone.style.width = nat.w + "px";
    clone.style.height = nat.h + "px";
    stage.appendChild(clone);

    var closeBtn = mkBtn("✕", "បិទ (Esc)", close);
    mkBtn("−", "បង្រួម", function () { zoomCenter(1 / 1.25); });
    mkBtn("+", "ពង្រីក", function () { zoomCenter(1.25); });
    mkBtn("សមនឹងអេក្រង់", "កំណត់ឱ្យសមអេក្រង់", fit);

    var hintWrap = document.createElement("div");
    hintWrap.className = "mz-hintwrap";
    var hint = document.createElement("span");
    hint.className = "mz-hint";
    hint.textContent = HINT;
    hintWrap.appendChild(hint);

    overlay.appendChild(bar);
    overlay.appendChild(stage);
    overlay.appendChild(hintWrap);
    document.body.appendChild(overlay);

    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /* --- ស្ថានភាព transform --- */
    var scale = 1, tx = 0, ty = 0;

    function apply() {
      clone.style.transform =
        "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    }

    function stageSize() {
      var r = stage.getBoundingClientRect();
      if (!r.width || !r.height) {
        return { w: window.innerWidth, h: window.innerHeight - 90 };
      }
      return { w: r.width, h: r.height };
    }

    function fit() {
      var s = stageSize();
      scale = Math.min(s.w / nat.w, s.h / nat.h) * 0.96;
      scale = Math.max(0.05, Math.min(scale, 8));
      tx = (s.w - nat.w * scale) / 2;
      ty = (s.h - nat.h * scale) / 2;
      apply();
    }

    function zoomAt(cx, cy, factor) {
      var ns = scale * factor;
      ns = Math.max(0.05, Math.min(ns, 12));
      var k = ns / scale;
      tx = cx - (cx - tx) * k;
      ty = cy - (cy - ty) * k;
      scale = ns;
      apply();
    }

    function zoomCenter(factor) {
      var s = stageSize();
      zoomAt(s.w / 2, s.h / 2, factor);
    }

    /* រមូរកណ្តុរ = zoom នៅត្រង់ cursor */
    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });

    /* អូស = pan (pointer events → គាំទ្រទាំងកណ្តុរ និង touch) */
    var dragging = false, startX = 0, startY = 0;
    stage.addEventListener("pointerdown", function (e) {
      dragging = true;
      startX = e.clientX - tx;
      startY = e.clientY - ty;
      if (stage.setPointerCapture) {
        try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
    });
    stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      tx = e.clientX - startX;
      ty = e.clientY - startY;
      apply();
    });
    function stopDrag() { dragging = false; }
    stage.addEventListener("pointerup", stopDrag);
    stage.addEventListener("pointercancel", stopDrag);

    /* ក្តារចុច: Esc = បិទ, +/− = zoom */
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "+" || e.key === "=") zoomCenter(1.25);
      else if (e.key === "-" || e.key === "_") zoomCenter(1 / 1.25);
    }
    document.addEventListener("keydown", onKey);

    function close() {
      document.removeEventListener("keydown", onKey);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.body.style.overflow = prevOverflow;
    }
    closeBtn.focus();
    fit();
  }

  /* --- ស្កេនរកដ្យាក្រាមទាំងអស់ (រួមទាំងដែល render យឺតៗ) --- */
  function scan() {
    var holders = document.querySelectorAll(".mermaid");
    for (var i = 0; i < holders.length; i++) enhance(holders[i]);
  }

  function start() {
    scan();
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () { scan(); });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  /* Material "instant navigation" — ស្កេនឡើងវិញពេលប្តូរទំព័រ */
  if (typeof window.document$ !== "undefined" && window.document$.subscribe) {
    window.document$.subscribe(function () { scan(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
