/* ==========================================================================
   HERO: the scroll journey.
   Two drivers share one caption system:
   - "pour": a drawn sand pour on <canvas> (used until the generated video exists)
   - "video": the scroll-scrubbed hero video (set hero.video.src in site-content.js)
   Phones, portrait tablets, short landscape phones and reduced motion get a
   composed still hero instead (the five gates below).
   ========================================================================== */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h, clamp = GG.clamp, smooth = GG.smoothstep;

  /* The five static-hero gates. One list drives both behaviour and styling:
     JS toggles .hero--static from these, and the CSS keys off that class. */
  var GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  var MQLS = GATES.map(function (q) { return matchMedia(q); });

  /* Caption bands in scroll progress (starting points, flick-tested). */
  var RANGES = [[0, 0.22], [0.25, 0.48], [0.51, 0.74], [0.78, 1]];
  var ENTRANCES = ['rise', 'drift', 'scatter', 'settle'];
  var SIDES = ['left', 'right', 'left', 'settle'];

  /* ---------------------------------------------------------------------------
     The pour valve: decides when sand falls, and how hard.
     - First view: it opens, pours while the starting heap forms, then closes,
       so the last grains land just as the heap settles.
     - Scrolling: it opens the moment the page moves (harder when faster). When
       scrolling stops it lingers for about a second, thinning out, then closes.
       The stream's tail falls and lands, loose grains roll to rest, and the
       render loop goes to sleep (about 2.5 s after the last scroll).
     - The end of the journey (the lot is complete): it stays shut.
     Both renderers (the WebGL scene and the drawn fallback) obey it.
     ------------------------------------------------------------------------ */
  function PourValve() {
    var FALL = 0.9;           /* seconds for grains to fall from the top to the heap (slow motion) */
    var INTRO = 5.0;          /* the opening pour, start to settled heap */
    var INTRO_OPEN = 3.8;     /* the opening pour runs this long, then the valve closes */
    var FROM = 0.3;           /* the heap starts at 30% of its size and builds */
    var OPEN_TAU = 0.16;      /* how fast it opens, seconds */
    var CLOSE_TAU = 0.2;      /* how fast it closes once the linger ends, seconds */
    var LINGER = 0.95;        /* after the last scroll, it keeps pouring this long... */
    var LINGER_THIN = 0.55;   /* ...thinning to 45% of its flow by the end */
    var introStart = -1, flow = 0, lastTarget = null, lastMove = -1, speed = 0;
    function base(p) { return 0.05 + 0.95 * clamp(p / 0.96, 0, 1); }
    function introK(t) {
      if (introStart < 0) return 0;
      var k = clamp((t - introStart - FALL) / (INTRO - FALL), 0, 1);
      return k * k * (3 - 2 * k);
    }
    return {
      start: function (t) { if (introStart < 0) introStart = t; },
      base: base,
      volume: function (p, t) { return base(p) * (FROM + (1 - FROM) * introK(t)); },
      /* p: the eased journey position; target: where the scroll actually is */
      step: function (p, target, dt, t) {
        if (lastTarget === null) lastTarget = target;
        var moved = Math.abs(target - lastTarget);
        lastTarget = target;
        if (moved > 1e-5) lastMove = t;
        if (dt > 0) speed += (moved / dt - speed) * (1 - Math.exp(-dt / 0.15));   /* journey per second, smoothed */
        var since = lastMove >= 0 ? t - lastMove : 1e9;
        var want = since < LINGER ? clamp(0.45 + speed * 2.2, 0, 1) * (1 - LINGER_THIN * since / LINGER) : 0;
        if (introStart >= 0 && t - introStart < INTRO_OPEN) want = Math.max(want, 0.9);
        want *= 1 - smooth(p, 0.94, 0.985);
        if (dt > 0) flow += (want - flow) * (1 - Math.exp(-dt / (want > flow ? OPEN_TAU : CLOSE_TAU)));
        if (want === 0 && flow < 0.03) flow = 0;   /* close cleanly: no late dribble */
        return flow;
      },
      flow: function () { return flow; },
      busy: function (t) { return flow > 0 || (introStart >= 0 && t - introStart < INTRO); }
    };
  }

  /* ---------------------------------------------------------------------------
     The drawn pour (fallback). Volume grows with scroll; grains fall in real time.
     Angle of repose for dry silica sand: about 32 degrees.
     ------------------------------------------------------------------------ */
  function Pour(canvas) {
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1, tex = null;
    var parts = [], rollers = [];
    var TAN = Math.tan(32 * Math.PI / 180);
    var TOP = 64;          /* the stream emerges just below the nav */
    var FADE = 90;         /* over this many pixels it fades in */
    var rand = GG.rng(1996);
    var spawnAcc = 0;

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTexture();
    }
    function buildTexture() {
      tex = document.createElement('canvas');
      tex.width = Math.max(1, Math.round(W * dpr));
      tex.height = Math.max(1, Math.round(H * dpr));
      var t = tex.getContext('2d');
      t.setTransform(dpr, 0, 0, dpr, 0, 0);
      var r = GG.rng(3);
      var n = Math.round(W * H / 55);
      for (var i = 0; i < n; i++) {
        var x = r() * W, y = H * 0.25 + r() * H * 0.75, s = 0.5 + r() * 1.3;
        var v = r();
        t.fillStyle = v < 0.45 ? 'rgba(255,255,255,.9)' : (v < 0.8 ? 'rgba(150,163,159,.55)' : 'rgba(110,124,121,.45)');
        t.fillRect(x, y, s, s);
      }
    }
    function geo(v, hf) {
      var floorY = H * 0.86;
      var hMax = Math.min(H * (hf || 0.34), W * 0.44 * TAN);
      var ht = hMax * Math.cbrt(v);
      return { cx: W / 2, floorY: floorY, h: ht, r: ht / TAN, apexY: floorY - ht, v: v };
    }
    function conePath(g) {
      var tip = Math.max(2, g.r * 0.06);
      ctx.beginPath();
      ctx.moveTo(g.cx - g.r, g.floorY);
      ctx.lineTo(g.cx - tip, g.apexY + tip * 0.55);
      ctx.quadraticCurveTo(g.cx, g.apexY - tip * 0.3, g.cx + tip, g.apexY + tip * 0.55);
      ctx.lineTo(g.cx + g.r, g.floorY);
      ctx.quadraticCurveTo(g.cx, g.floorY + g.r * 0.07, g.cx - g.r, g.floorY);
      ctx.closePath();
    }

    function drawCone(g) {
      if (g.h < 1) return;
      /* contact shadow */
      var sg = ctx.createRadialGradient(g.cx + g.r * 0.08, g.floorY + 4, 0, g.cx + g.r * 0.08, g.floorY + 4, g.r * 1.3);
      sg.addColorStop(0, 'rgba(18,35,28,.20)');
      sg.addColorStop(1, 'rgba(18,35,28,0)');
      ctx.save();
      ctx.translate(0, g.floorY);
      ctx.scale(1, 0.14);
      ctx.translate(0, -g.floorY);
      ctx.fillStyle = sg;
      ctx.fillRect(g.cx - g.r * 1.5, g.floorY - g.r * 1.4, g.r * 3, g.r * 2.8);
      ctx.restore();

      /* body: lit from the upper left */
      var lg = ctx.createLinearGradient(g.cx - g.r, 0, g.cx + g.r, 0);
      lg.addColorStop(0, '#FDFEFD');
      lg.addColorStop(0.42, '#F1F4F2');
      lg.addColorStop(0.6, '#DCE2DF');
      lg.addColorStop(1, '#BAC4C0');
      conePath(g);
      ctx.fillStyle = lg;
      ctx.fill();
      /* grain texture, clipped to the cone */
      ctx.save();
      conePath(g);
      ctx.clip();
      ctx.globalAlpha = 0.75;
      ctx.drawImage(tex, 0, 0, W, H);
      ctx.globalAlpha = 1;
      var vg = ctx.createLinearGradient(0, g.apexY, 0, g.floorY);
      vg.addColorStop(0, 'rgba(255,255,255,.35)');
      vg.addColorStop(1, 'rgba(18,35,28,.05)');
      ctx.fillStyle = vg;
      ctx.fillRect(g.cx - g.r, g.apexY - 4, g.r * 2, g.h + 12);
      ctx.restore();
      /* rim light on the lit edge */
      ctx.strokeStyle = 'rgba(255,255,255,.75)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(g.cx - g.r * 0.98, g.floorY - 1);
      ctx.lineTo(g.cx - Math.max(2, g.r * 0.06), g.apexY + 2);
      ctx.stroke();
    }

    function step(dt, v, flow) {
      var g = geo(v);
      var sc = H / 900;
      /* spawn falling grains: as many as the valve lets through */
      spawnAcc += dt * 950 * flow;
      while (spawnAcc >= 1) {
        spawnAcc -= 1;
        parts.push({ x: g.cx + (rand() - 0.5) * 2.4, y: TOP - rand() * 30, vy: (120 + rand() * 60) * sc, drift: (rand() - 0.5), c: rand() });
      }
      /* gravity tuned so a grain takes about 0.9 s from the top to the heap */
      var grav = 2 * Math.max(10, Math.max(40, g.apexY - TOP) - 150 * sc * 0.9) / (0.9 * 0.9);
      for (var i = parts.length - 1; i >= 0; i--) {
        var q = parts[i];
        q.vy += grav * dt;
        q.y += q.vy * dt;
        q.x += q.drift * dt * (6 + q.y * 0.012);
        if (q.y >= g.apexY - 1) {
          parts.splice(i, 1);
          if (rand() < 0.16 && rollers.length < 90) {
            rollers.push({ side: rand() < 0.5 ? -1 : 1, s: 0, v: 0.95 + rand() * 0.9, j: (rand() - 0.5) * 6, c: rand() });
          }
        }
      }
      for (var j = rollers.length - 1; j >= 0; j--) {
        var r = rollers[j];
        r.s += r.v * dt;
        if (r.s >= 1) rollers.splice(j, 1);
      }
      return g;
    }

    function drawGrains(g) {
      /* a faint continuous core makes the stream read as one pour */
      if (parts.length > 20) {
        var cg = ctx.createLinearGradient(0, TOP, 0, g.apexY);
        cg.addColorStop(0, 'rgba(120,133,130,0)');
        cg.addColorStop(Math.min(0.9, FADE * 1.6 / Math.max(1, g.apexY - TOP)), 'rgba(120,133,130,.22)');
        cg.addColorStop(1, 'rgba(120,133,130,.32)');
        ctx.fillStyle = cg;
        ctx.fillRect(g.cx - 1.3, TOP, 2.6, Math.max(0, g.apexY - TOP));
      }
      for (var i = 0; i < parts.length; i++) {
        var q = parts[i];
        if (q.y < TOP) continue;
        ctx.globalAlpha = Math.min(1, (q.y - TOP) / FADE);
        ctx.fillStyle = q.c < 0.35 ? '#FFFFFF' : (q.c < 0.75 ? '#9AA6A3' : '#6F7C7A');
        var s = q.c < 0.35 ? 1.85 : 1.5;
        ctx.fillRect(q.x - s / 2, q.y, s, s * 1.8);
      }
      ctx.globalAlpha = 1;
      for (var j = 0; j < rollers.length; j++) {
        var r = rollers[j];
        var x = g.cx + r.side * (r.s * g.r) + r.j * r.s;
        var y = g.apexY + r.s * g.h - 1.5;
        ctx.globalAlpha = 1 - r.s;
        ctx.fillStyle = r.c < 0.5 ? '#8E9B98' : '#FFFFFF';
        ctx.fillRect(x, y, 1.85, 1.85);
      }
      ctx.globalAlpha = 1;
    }

    return {
      resize: resize,
      frame: function (v, flow, dt) {
        var g = step(dt, v, flow);
        ctx.clearRect(0, 0, W, H);
        drawCone(g);
        drawGrains(g);
        return g;
      },
      still: function (hf) {
        parts.length = 0; rollers.length = 0;
        ctx.clearRect(0, 0, W, H);
        drawCone(geo(1, hf));
      },
      alive: function () { return parts.length > 0 || rollers.length > 0; },
      stats: function () { return { falling: parts.length + rollers.length }; }
    };
  }

  /* ---------------------------------------------------------------------------
     Render
     ------------------------------------------------------------------------ */
  function ctaRow(C, cls) {
    var hc = C.hero;
    return h('div', { class: 'btn-row ' + (cls || '') },
      h('a', { class: 'btn', href: hc.ctaPrimary.href }, h('span', { text: hc.ctaPrimary.label }), GG.icon('arrow-right', 'btn__arrow')),
      h('a', { class: 'btn btn--ghost', href: hc.ctaSecondary.href, text: hc.ctaSecondary.label }));
  }

  GG.sections.hero = {
    render: function (root, C) {
      var hc = C.hero;
      /* the scroll timing is tuned for exactly four bands: extra ones are left out */
      if (hc.bands.length > RANGES.length) console.warn('[hero] only the first ' + RANGES.length + ' bands are shown; the scroll timing is tuned for ' + RANGES.length + '.');
      var list = hc.bands.slice(0, RANGES.length);
      var bands = list.map(function (b, i) {
        var titleText = GG.fmt(b.title);
        var title = h('p', { class: 'band__title', 'aria-hidden': i === 0 ? 'true' : null });
        GG.split(title, titleText.text, 11 + i * 7);
        if (titleText.sample) title.setAttribute('data-sample', '');
        var el = h('div', {
          class: 'band band--' + SIDES[i] + ' band--' + ENTRANCES[i],
          'data-band': i
        },
          b.kicker ? h('p', { class: 'band__kicker kicker', text: b.kicker }) : null,
          title,
          b.text ? h('p', { class: 'band__text', text: b.text }) : null,
          i === list.length - 1 ? ctaRow(C, 'band__ctas') : null);
        return el;
      });

      var hud = hc.hud;
      var truck = String(hud.truckTonnes);
      var stage = h('div', { class: 'hero__stage' },
        h('div', { class: 'hero__poster', 'aria-hidden': 'true' }),
        h('canvas', { class: 'hero__canvas', 'aria-hidden': 'true' }),
        h('video', { class: 'hero__video', muted: true, playsinline: true, preload: 'none', 'aria-hidden': 'true', tabindex: '-1' }),
        h('div', { class: 'hero__scrim', 'aria-hidden': 'true' }),
        h('div', { class: 'hero__bands' },
          /* the page's one heading: it stays readable however far the film has played */
          h('h1', { class: 'sr-only', id: 'hero-title', text: list[0].title }),
          bands),
        h('div', { class: 'hero__static' },
          h('p', { class: 'kicker', text: hc.static.kicker }),
          h('h1', { class: 'hero__static-title', id: 'hero-title-static', text: hc.static.title }),
          h('p', { class: 'hero__static-text', text: hc.static.text }),
          ctaRow(C)),
        h('div', { class: 'hero__hud chip', 'aria-hidden': 'true' },
          h('span', { class: 'hud__lot', text: hud.lot }),
          h('span', { class: 'hud__sep' }, '·'),
          h('span', { class: 'hud__val' }, '0.0 t'),
          h('span', { class: 'hud__label' }, GG.txt(hud.poured) + ' ' + GG.txt(hud.ofTruck, { truck: truck }))),
        h('div', { class: 'hero__cue', 'aria-hidden': 'true' },
          h('span', { text: hc.scrollCue }), h('span', { class: 'cue__line' }, h('span', { class: 'cue__grain' }))),
        h('div', { class: 'hero__ring', role: 'status', 'aria-label': GG.txt(hc.loadingLabel) },
          h('span', { html: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="3"/><circle class="ring__fill" cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="126" style="stroke-dashoffset:var(--ld,126)"/></svg>' })));
      root.appendChild(h('div', { class: 'hero__track' }, stage));
    },

    init: function (root, C) {
      var hc = C.hero;
      var stage = root.querySelector('.hero__stage');
      var canvas = root.querySelector('.hero__canvas');
      var video = root.querySelector('.hero__video');
      var poster = root.querySelector('.hero__poster');
      var ring = root.querySelector('.hero__ring');
      var hudVal = root.querySelector('.hud__val');
      var hudLabel = root.querySelector('.hud__label');
      var cue = root.querySelector('.hero__cue');
      var vcfg = GG.deep(hc.video) || {};
      var useVideo = !!vcfg.src;
      /* The realistic WebGL sand scene, with the drawn pour as the fallback. */
      var pour = makeRenderer();
      function fallbackRenderer() {
        /* a canvas holds one kind of context: start from a fresh element */
        var fresh = canvas.cloneNode(false);
        canvas.replaceWith(fresh);
        canvas = fresh;
        stage.classList.remove('is-webgl');
        return Pour(canvas);
      }
      function makeRenderer() {
        if (GG.SandScene) {
          try {
            var scene = GG.SandScene(canvas, {
              onLost: function () { pour = fallbackRenderer(); pour.resize(); if (scrubOn) kick(); else drawStill(); }
            });
            if (scene) { stage.classList.add('is-webgl'); return scene; }
          } catch (err) {
            console.warn('[hero] realistic sand scene unavailable, using the drawn pour:', err);
          }
        }
        return fallbackRenderer();
      }
      var truckT = Number(hc.hud.truckTonnes) || 25;
      var doneText = GG.txt(hc.hud.done);
      var labelText = GG.txt(hc.hud.poured) + ' ' + GG.txt(hc.hud.ofTruck, { truck: String(truckT) });

      var bands = Array.prototype.map.call(root.querySelectorAll('.band'), function (el, i) {
        return { el: el, range: RANGES[i], op: -1, k: -1, ramp: parseFloat(el.getAttribute('data-ramp')) || 0 };
      });

      var target = 0, shown = 0, rafId = null, lastTick = 0;
      var scrubOn = false, onScreen = true;
      var loadStart = 0, loadK = 0;
      var rangeVh = 400;
      var lastHud = '', lastHudAt = 0, cueOn = true;
      var videoReady = false;
      var valve = PourValve();
      var heapV = valve.base(0);

      function progress() {
        var rect = root.getBoundingClientRect();
        var span = rect.height - window.innerHeight;
        return span > 0 ? clamp(-rect.top / span, 0, 1) : 0;
      }
      function measure() {
        rangeVh = Math.max(50, (root.offsetHeight - window.innerHeight) / window.innerHeight * 100);
      }

      /* Captions: opacity plateaus with eased edges, --k drives each entrance */
      function updateCaptions(p) {
        var last = bands.length - 1;
        var edge = 20 / rangeVh;             /* about 20vh of scroll for every ramp */
        bands.forEach(function (b, i) {
          var a = b.range[0], z = b.range[1];
          var f = Math.min(edge, (z - a) / 3);
          var op;
          if (i === 0) op = 1 - smooth(p, z - f, z);
          else if (i === last) op = smooth(p, a, a + f);
          else op = smooth(p, a, a + f) * (1 - smooth(p, z - f, z));
          var ramp = b.ramp || Math.min(edge, (z - a) * 0.35);
          var k = clamp((p - a) / ramp, 0, 1);
          if (i === 0) k = Math.max(k, loadK);
          if (Math.abs(op - b.op) > 0.004 || (op === 0) !== (b.op === 0) || (op === 1) !== (b.op === 1)) {
            b.el.style.opacity = op.toFixed(3);
            b.el.classList.toggle('is-off', op < 0.02);
            b.el.classList.toggle('is-live', op > 0.6);
            b.op = op;
          }
          if (Math.abs(k - b.k) > 0.008 || (k === 1 && b.k !== 1) || (k === 0 && b.k !== 0)) {
            b.el.style.setProperty('--k', k.toFixed(3));
            b.k = k;
          }
        });
      }

      function updateHud(p, now) {
        if (now - lastHudAt < 100) return;
        var txt = p >= 0.985 ? doneText : (truckT * heapV).toFixed(1) + ' t';
        if (txt !== lastHud) {
          lastHud = txt;
          lastHudAt = now;
          hudVal.textContent = txt;
          hudLabel.style.display = p >= 0.985 ? 'none' : '';
        }
        var showCue = p < 0.03;
        if (showCue !== cueOn) { cueOn = showCue; cue.classList.toggle('is-hidden', !showCue); }
      }

      /* ---- Video driver: gated seeks (never overlap), Blob fetch ------------ */
      var seekBusy = false, pendingTime = null;
      function requestSeek(t) {
        if (!video.duration) return;
        if (seekBusy) { pendingTime = t; return; }
        seekBusy = true;
        video.currentTime = t;
      }
      video.addEventListener('seeked', function () {
        seekBusy = false;
        if (pendingTime !== null) { var t = pendingTime; pendingTime = null; requestSeek(t); }
      });
      video.addEventListener('error', function () { seekBusy = false; pendingTime = null; failVideo(); });

      var heroStarted = false;
      function initHeroOnce() {
        if (heroStarted || !useVideo) return;
        heroStarted = true;
        stage.classList.add('has-video');
        if (vcfg.poster) poster.style.backgroundImage = "url('" + vcfg.poster + "')";
        var started = false;
        function startBlob() { if (started) return; started = true; loadBlob().catch(failVideo); }
        if (vcfg.poster) {
          var pi = new Image();
          pi.onload = startBlob; pi.onerror = startBlob;
          pi.src = vcfg.poster;
        }
        setTimeout(startBlob, vcfg.poster ? 4000 : 0);
      }
      function loadBlob() {
        if (location.protocol === 'file:') return Promise.reject(new Error('file:// cannot fetch video'));
        stage.classList.add('is-loading');
        var ctrl = new AbortController();
        var watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
        return fetch(vcfg.src, { priority: 'low', signal: ctrl.signal }).then(function (res) {
          if (!res.ok || !res.body) throw new Error('video ' + res.status);
          var total = Number(res.headers.get('Content-Length')) || Number(vcfg.bytes) || 8e6;
          var reader = res.body.getReader();
          var chunks = [], got = 0, lastRing = 0;
          function pump() {
            return reader.read().then(function (r) {
              if (r.done) return;
              clearTimeout(watchdog);
              watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
              chunks.push(r.value);
              got += r.value.length;
              var frac = Math.min(1, got / total);
              var now = performance.now();
              if (now - lastRing > 100 || frac === 1) {
                lastRing = now;
                ring.style.setProperty('--ld', Math.round(126 * (1 - frac)));
              }
              return pump();
            });
          }
          return pump().then(function () {
            clearTimeout(watchdog);
            ring.style.setProperty('--ld', 0);
            video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
            video.load();
            video.addEventListener('canplay', function () {
              videoReady = true;
              stage.classList.remove('is-loading');
              stage.classList.add('video-ready');
              requestSeek(progress() * video.duration);
            }, { once: true });
          });
        });
      }
      function failVideo() {
        /* The page stays complete: fall back to the drawn pour. */
        useVideo = false;
        videoReady = false;
        stage.classList.remove('is-loading', 'has-video', 'video-ready');
        stage.classList.add('video-failed');
        kick();
      }

      /* ---- The drive loop: eases toward the scroll target, rests when done -- */
      function tick(now) {
        var dt = Math.min(100, now - (lastTick || now));
        lastTick = now;
        if (loadK < 1) {
          if (!loadStart) loadStart = now;
          var t = clamp((now - loadStart) / 1100, 0, 1);
          loadK = 1 - Math.pow(1 - t, 3);
        }
        shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt / 16.667));
        var converged = Math.abs(target - shown) < 0.0005;
        if (converged) shown = target;
        var tSec = now / 1000;
        if (useVideo) {
          heapV = valve.base(shown);
          if (videoReady) requestSeek(shown * video.duration);
        } else {
          valve.start(tSec);
          var flow = valve.step(shown, target, dt / 1000, tSec);
          heapV = valve.volume(shown, tSec);
          pour.frame(heapV, flow, dt / 1000);
        }
        updateCaptions(shown);
        updateHud(shown, now);
        /* keep running while the scroll eases, the pour flows, or grains are still landing */
        var alive = !converged || loadK < 1 || (!useVideo && (valve.busy(tSec) || pour.alive()));
        if (alive && onScreen && scrubOn && !document.hidden) rafId = requestAnimationFrame(tick);
        else { rafId = null; lastTick = 0; }
      }
      function kick() {
        if (rafId === null && onScreen && scrubOn && !document.hidden) rafId = requestAnimationFrame(tick);
      }
      function onScroll() { target = progress(); kick(); }

      /* ---- Static versus scrub, decided live from the five gates ------------- */
      function setLabel(isStatic) {
        root.setAttribute('aria-labelledby', isStatic ? 'hero-title-static' : 'hero-title');
      }
      function drawStill() {
        pour.resize();
        if (vcfg.ending && useVideo) {
          poster.style.backgroundImage = "url('" + vcfg.ending + "')";
          stage.classList.add('has-still');
        } else {
          pour.still(0.27);
        }
      }
      function enableScrub() {
        if (scrubOn) return;
        scrubOn = true;
        root.classList.remove('hero--static');
        setLabel(false);
        measure();
        pour.resize();
        initHeroOnce();
        addEventListener('scroll', onScroll, { passive: true });
        bands.forEach(function (b) { b.op = -1; b.k = -1; });
        target = shown = progress();
        updateCaptions(shown);
        onScroll();
      }
      function disableScrub() {
        if (!scrubOn && root.classList.contains('hero--static')) return;
        scrubOn = false;
        removeEventListener('scroll', onScroll);
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        root.classList.add('hero--static');
        setLabel(true);
        requestAnimationFrame(drawStill);
      }
      function applyHeroMode() {
        if (MQLS.some(function (m) { return m.matches; })) disableScrub();
        else enableScrub();
      }
      MQLS.forEach(function (m) { m.addEventListener('change', applyHeroMode); });

      var resizeT = null;
      addEventListener('resize', function () {
        clearTimeout(resizeT);
        resizeT = setTimeout(function () {
          measure();
          if (scrubOn) { pour.resize(); target = progress(); kick(); }
          else drawStill();
        }, 120);
      });
      document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
          if (onScreen) kick();
        }).observe(root);
      }

      GG.heroState = function () {
        return { flow: +valve.flow().toFixed(3), running: rafId !== null, volume: +heapV.toFixed(4), falling: pour.stats ? pour.stats().falling : -1 };
      };

      applyHeroMode();
    }
  };
})();
