/* ==========================================================================
   CORE HELPERS shared by every section.
   Plain scripts (no modules, no build step), so the site also opens by
   double-clicking index.html.
   ========================================================================== */
(function () {
  'use strict';
  var GG = (window.GG = window.GG || {});
  GG.sections = GG.sections || {};

  /* ---- Sample-data helpers -------------------------------------------------
     Values wrapped in S( ) inside site-content.js arrive as
     { __sample: true, value: ... }. These helpers unwrap them and remember
     that they were samples, so review mode can outline them. */
  function isS(x) { return !!x && typeof x === 'object' && x.__sample === true; }
  function raw(x) { return isS(x) ? x.value : x; }
  function deep(x) {
    x = raw(x);
    if (Array.isArray(x)) return x.map(deep);
    if (x && typeof x === 'object') {
      var o = {};
      Object.keys(x).forEach(function (k) { o[k] = deep(x[k]); });
      return o;
    }
    return x;
  }
  function hasS(x) {
    if (isS(x)) return true;
    if (Array.isArray(x)) return x.some(hasS);
    if (x && typeof x === 'object') return Object.keys(x).some(function (k) { return hasS(x[k]); });
    return false;
  }
  GG.isS = isS; GG.raw = raw; GG.deep = deep; GG.hasS = hasS;

  /* ---- Facts and {tokens} --------------------------------------------------- */
  function content() { return window.SITE_CONTENT || {}; }
  GG.content = content;

  GG.fact = function (path) {
    var facts = content().facts || {};
    if (path === 'year') return String(new Date().getFullYear());
    if (path === 'company.years') {
      var f = (facts.company || {}).founded;
      var n = new Date().getFullYear() - parseInt(raw(f), 10);
      if (!isFinite(n)) return undefined;
      return isS(f) ? { __sample: true, value: String(n) } : String(n);
    }
    var cur = facts;
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      cur = raw(cur);
      if (cur == null || typeof cur !== 'object') return undefined;
      // keep the sample wrapper of the final value so callers can detect it
      cur = cur[parts[i]];
    }
    return cur;
  };

  /* Replace {tokens} with facts. Returns { text, sample }. */
  GG.fmt = function (value, extra) {
    if (value && typeof value === 'object' && !isS(value) && 'text' in value && 'sample' in value) return value;
    var sample = isS(value);
    var str = raw(value);
    if (str == null) return { text: '', sample: sample };
    str = String(str);
    var text = str.replace(/\{([a-zA-Z0-9_.]+)\}/g, function (m, key) {
      var v;
      if (extra && Object.prototype.hasOwnProperty.call(extra, key)) v = extra[key];
      else v = GG.fact(key);
      if (v === undefined) return m;
      if (hasS(v)) sample = true;
      var r = deep(v);
      return Array.isArray(r) ? r.join(', ') : String(r);
    });
    return { text: text, sample: sample };
  };
  GG.txt = function (v, extra) { return GG.fmt(v, extra).text; };

  /* ---- DOM builder ---------------------------------------------------------- */
  function setText(el, v, extra) {
    var r = GG.fmt(v, extra);
    el.textContent = r.text;
    if (r.sample) el.setAttribute('data-sample', '');
    return el;
  }
  GG.setText = setText;
  GG.markSample = function (el, v) { if (hasS(v)) el.setAttribute('data-sample', ''); return el; };

  GG.h = function (tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') setText(el, v);
        else if (k === 'html') el.innerHTML = v; /* trusted markup only (icons) */
        else if (k === 'sample') { if (hasS(v)) el.setAttribute('data-sample', ''); }
        else if (k === 'style' && typeof v === 'object') Object.keys(v).forEach(function (p) { el.style.setProperty(p, v[p]); });
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  };
  function append(el, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(el, k); }); return; }
    el.appendChild(typeof kid === 'string' || typeof kid === 'number' ? document.createTextNode(String(kid)) : kid);
  }
  GG.append = append;

  /* ---- Icons ---------------------------------------------------------------- */
  GG.icon = function (name, cls) {
    var span = document.createElement('span');
    var inner = (GG.ICONS || {})[name] || '';
    span.innerHTML = '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + '</svg>';
    return span.firstChild;
  };

  /* ---- Images ----------------------------------------------------------------
     value: { src, alt, srcset, width, height, focus } as made by photo() in
     site-content.js (a plain { src, alt } works too).
     opts.sizes: how wide the frame draws the image, so the browser can pick
     the right file from srcset. opts.alt overrides the description, for
     example '' when the image only decorates a labelled control. */
  GG.img = function (value, opts) {
    opts = opts || {};
    var v = deep(value) || {};
    var img = GG.h('img', {
      loading: opts.eager ? 'eager' : 'lazy',
      decoding: 'async',
      sizes: v.srcset ? (opts.sizes || '100vw') : null,
      srcset: v.srcset || null,
      src: v.src,
      alt: opts.alt != null ? opts.alt : (v.alt || ''),
      width: v.width || opts.width || 800,
      height: v.height || opts.height || 600,
      class: opts.cls || null,
      sample: value
    });
    if (v.focus) img.style.objectPosition = v.focus;
    return img;
  };

  /* ---- Section head (kicker, title, lede) ----------------------------------- */
  GG.head = function (data, id, opts) {
    opts = opts || {};
    return GG.h('div', { class: 'section-head ' + (opts.cls || ''), 'data-reveal': '' },
      data.kicker ? GG.h('p', { class: 'kicker', text: data.kicker }) : null,
      GG.h(opts.level || 'h2', { class: 'h2', id: id, text: data.title }),
      data.lede ? GG.h('p', { class: 'lede', text: data.lede }) : null
    );
  };

  /* ---- Numbers ---------------------------------------------------------------- */
  GG.num = function (n) {
    var x = Number(String(n).replace(/,/g, ''));
    return isFinite(x) ? x.toLocaleString('en-IN') : String(n);
  };

  /* ---- Motion preferences and the Motion library ---------------------------- */
  GG.reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  GG.reduced = function () { return GG.reducedMQ.matches; };
  GG.motion = function () { return window.Motion || null; };
  var motionWaiters = [];
  GG.whenMotion = function (fn) {
    if (window.Motion) fn(window.Motion);
    else motionWaiters.push(fn);
  };
  GG.onMotionLoaded = function () {
    var list = motionWaiters.slice();
    motionWaiters.length = 0;
    list.forEach(function (fn) { try { fn(window.Motion); } catch (e) { console.error(e); } });
  };

  /* ---- Seeded random (identical "random" offsets on every load) ------------ */
  GG.rng = function (seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  };

  GG.clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };
  GG.smoothstep = function (p, e0, e1) {
    var t = GG.clamp((p - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  /* ---- Entrances: [data-reveal] gets .in when it scrolls into view --------- */
  GG.reveal = function (root) {
    var els = (root || document).querySelectorAll('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in', 'settled'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('in');
        io.unobserve(el);
        var n = Math.min(el.children.length, 8);
        setTimeout(function () { el.classList.add('settled'); }, 760 + n * 90 + 120);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  };

  /* ---- Living elements: pause when their section is off-screen ------------- */
  GG.pauseOffscreen = function (els) {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('offscreen', !e.isIntersecting); });
    }, { rootMargin: '10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  };
  document.addEventListener('visibilitychange', function () {
    document.body && document.body.classList.toggle('paused', document.hidden);
  });

  /* ---- Count-up numbers -------------------------------------------------------- */
  GG.countUp = function (el, to, opts) {
    opts = opts || {};
    var target = Number(String(to).replace(/,/g, ''));
    var suffix = opts.suffix || '';
    if (!isFinite(target) || GG.reduced()) { el.textContent = GG.num(to) + suffix; return; }
    var dur = opts.duration || 1.6;
    var M = GG.motion();
    if (M && M.animate) {
      M.animate(0, target, {
        duration: dur,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: function (v) { el.textContent = GG.num(Math.round(v)) + suffix; }
      });
      return;
    }
    var t0 = performance.now();
    (function step(now) {
      var t = Math.min(1, (now - t0) / (dur * 1000));
      var e = 1 - Math.pow(1 - t, 3);
      el.textContent = GG.num(Math.round(target * e)) + suffix;
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  };

  /* ---- Split a line into word and character spans for scroll entrances ---- */
  GG.split = function (el, text, seed) {
    var r = GG.rng(seed || 7);
    el.textContent = '';
    el.appendChild(GG.h('span', { class: 'sr-only' }, text));
    var vis = GG.h('span', { class: 'split', 'aria-hidden': 'true' });
    var words = text.split(/\s+/).filter(Boolean);
    var total = text.replace(/\s+/g, '').length;
    var ci = 0;
    words.forEach(function (w, wi) {
      var wEl = GG.h('span', { class: 'w' });
      wEl.style.setProperty('--wi', wi);
      wEl.style.setProperty('--wth', (wi / Math.max(1, words.length)) * 0.5);
      Array.from(w).forEach(function (ch) {
        var c = GG.h('span', { class: 'c' }, ch);
        c.style.setProperty('--th', (r() * 0.5).toFixed(3));
        c.style.setProperty('--ord', ((ci / Math.max(1, total)) * 0.55 + r() * 0.05).toFixed(3));
        c.style.setProperty('--jx', ((r() - 0.5) * 120).toFixed(1) + 'px');
        c.style.setProperty('--jy', ((r() - 0.5) * 90).toFixed(1) + 'px');
        c.style.setProperty('--jr', ((r() - 0.5) * 50).toFixed(1) + 'deg');
        wEl.appendChild(c);
        ci++;
      });
      vis.appendChild(wEl);
      if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    el.appendChild(vis);
    return el;
  };
})();
