/* QUALITY: four proof points and the one interactive moment, a sieve test the
   visitor performs by pressing and holding. Grain positions are a pure
   function of progress, so releasing early eases everything back up. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h, clamp = GG.clamp;
  var HOLD_SECONDS = 2.4;
  var RELEASE_SECONDS = 1.1;

  function Sieve(canvas) {
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1;
    var grains = [];
    var rand = GG.rng(2017);

    function layout() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function Y() { return { top: H * 0.34, mid: H * 0.64, pan: H * 0.92 }; }
    function mound(n, i, base, r, cx, spread) {
      var hm = Math.sqrt(n) * r * 1.15;
      var wm = Math.min(W * 0.5, hm * spread);
      var v = Math.pow(rand(), 1.4);
      return { x: cx + (rand() * 2 - 1) * (1 - v) * wm / 2, y: base - r - v * hm };
    }
    function build() {
      rand = GG.rng(2017);
      grains = [];
      var s = Math.max(0.75, Math.min(1.25, W / 520));
      var y = Y(), cx = W * 0.3;
      var spec = [], coarse = [], fines = [];
      var N = 170;
      for (var i = 0; i < N; i++) {
        var kind = i < 7 ? 'coarse' : (i < 14 ? 'fines' : 'spec');
        var r = (kind === 'coarse' ? 4.6 : kind === 'fines' ? 1.5 : 2.7) * s;
        var g = { kind: kind, r: r, c: rand(), d: rand() };
        (kind === 'coarse' ? coarse : kind === 'fines' ? fines : spec).push(g);
        grains.push(g);
      }
      /* start: everything heaped on the top sieve */
      grains.forEach(function (g, i) { var p = mound(N, i, y.top, 2.7 * s, cx, 3.4); g.x0 = p.x; g.y0 = p.y; });
      /* end positions */
      coarse.forEach(function (g, i) { var p = mound(coarse.length * 3, i, y.top, g.r, cx, 4); g.x1 = p.x; g.y1 = p.y; g.x2 = g.x1; g.y2 = g.y1; });
      spec.concat(fines).forEach(function (g, i) { var p = mound(spec.length + fines.length, i, y.mid, 2.7 * s, cx, 3.4); g.x1 = p.x; g.y1 = p.y; });
      spec.forEach(function (g) { g.x2 = g.x1; g.y2 = g.y1; });
      fines.forEach(function (g, i) { var p = mound(fines.length * 3, i, y.pan, g.r, cx, 5); g.x2 = p.x; g.y2 = p.y; });
      /* each grain falls on its own schedule */
      grains.forEach(function (g) {
        g.a = 0.02 + g.d * 0.36;     /* through the top sieve */
        g.b = 0.5 + g.d * 0.32;      /* through the bottom sieve (fines only) */
      });
    }
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function fall(t) { return t * t; } /* gravity-like */

    function drawMesh(y, fine, shake) {
      ctx.save();
      ctx.translate(shake, 0);
      ctx.strokeStyle = 'rgba(21,34,44,.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(W * 0.04, y); ctx.lineTo(W * 0.56, y); ctx.stroke();
      ctx.strokeStyle = 'rgba(21,34,44,.22)';
      ctx.lineWidth = 1;
      var step = fine ? 4 : 8;
      ctx.beginPath();
      for (var x = W * 0.04; x <= W * 0.56; x += step) { ctx.moveTo(x, y - 2); ctx.lineTo(x, y + 3); }
      ctx.stroke();
      /* frame posts */
      ctx.fillStyle = 'rgba(21,34,44,.55)';
      ctx.fillRect(W * 0.04 - 3, y - 14, 3, 20);
      ctx.fillRect(W * 0.56, y - 14, 3, 20);
      ctx.restore();
    }

    return {
      layout: layout,
      draw: function (p, shake) {
        if (!W) layout();
        ctx.clearRect(0, 0, W, H);
        var y = Y();
        drawMesh(y.top, false, shake);
        drawMesh(y.mid, true, shake * 0.8);
        /* pan */
        ctx.fillStyle = 'rgba(21,34,44,.08)';
        ctx.strokeStyle = 'rgba(21,34,44,.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(W * 0.04, y.pan - 12); ctx.lineTo(W * 0.06, y.pan + 2); ctx.lineTo(W * 0.54, y.pan + 2); ctx.lineTo(W * 0.56, y.pan - 12);
        ctx.stroke();

        var list = grains.map(function (g) {
          var x, yy;
          var t1 = ease(clamp((p - g.a) / 0.22, 0, 1));
          if (g.kind === 'coarse') { x = g.x0 + (g.x1 - g.x0) * ease(clamp(p / 0.5, 0, 1)); yy = g.y0 + (g.y1 - g.y0) * ease(clamp(p / 0.5, 0, 1)); }
          else {
            x = g.x0 + (g.x1 - g.x0) * t1;
            yy = g.y0 + (g.y1 - g.y0) * fall(t1);
            if (g.kind === 'fines') {
              var t2 = ease(clamp((p - g.b) / 0.2, 0, 1));
              x = x + (g.x2 - g.x1) * t2;
              yy = yy + (g.y2 - g.y1) * fall(t2);
            }
          }
          var onTop = g.kind === 'coarse' || p < g.a + 0.05;
          return { g: g, x: x + shake * (onTop ? 1 : 0.8), y: yy };
        });
        list.sort(function (a, b) { return a.y - b.y; });
        list.forEach(function (it) {
          var g = it.g;
          ctx.fillStyle = g.kind === 'coarse' ? (g.c < 0.5 ? '#8E8576' : '#A39A88') : g.kind === 'fines' ? '#B8C2BF' : (g.c < 0.33 ? '#9AA6A3' : g.c < 0.75 ? '#B3BDBA' : '#C9D1CE');
          ctx.beginPath();
          ctx.arc(it.x, it.y, g.r, 0, Math.PI * 2);
          ctx.fill();
          if (g.r > 2) {
            ctx.fillStyle = 'rgba(255,255,255,.75)';
            ctx.fillRect(it.x - g.r * 0.45, it.y - g.r * 0.5, Math.max(1, g.r * 0.4), Math.max(1, g.r * 0.35));
          }
        });
      }
    };
  }

  GG.sections.quality = {
    render: function (root, C) {
      var q = C.quality, sv = q.sieve;
      var res = GG.deep(sv.results) || {};
      var resSample = GG.hasS(sv.results) ? '' : null;
      var rows = [['coarse', sv.layers.coarse, res.coarse], ['spec', sv.layers.spec, res.spec], ['fines', sv.layers.fines, res.fines]];

      var instrument = h('div', { class: 'sieve-card', 'data-reveal': '' },
        h('div', { class: 'sieve-card__head' },
          h('h3', { class: 'h3', text: sv.title }),
          h('p', { class: 'muted', text: sv.intro })),
        h('div', { class: 'sieve-card__stage' },
          h('canvas', { class: 'sieve-card__canvas', 'aria-hidden': 'true' }),
          h('dl', { class: 'sieve-results' },
            rows.map(function (r, i) {
              return h('div', { class: 'sieve-results__row sieve-results__row--' + r[0], style: { '--i': i } },
                h('dt', { class: 'mono', text: r[1] }),
                h('dd', { 'data-sample': resSample }, (r[2] != null ? r[2].toFixed(1) : '') + '%'));
            }))),
        h('div', { class: 'sieve-card__foot' },
          h('button', { class: 'hold', type: 'button', 'aria-describedby': 'sieve-hint' },
            h('span', { class: 'hold__ring', 'aria-hidden': 'true', html: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="2.5"/><circle class="hold__fill" cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="132" stroke-dashoffset="132" stroke-linecap="round"/></svg>' },
            ),
            GG.icon('hold', 'hold__icon'),
            h('span', { class: 'hold__label', text: sv.holdLabel })),
          h('p', { class: 'sieve-card__hint', id: 'sieve-hint', text: sv.keyboardHint }),
          h('div', { class: 'sieve-verdict', role: 'status', 'aria-live': 'polite' },
            h('p', { class: 'sieve-verdict__title' }, GG.icon('check'), h('span', { text: sv.doneTitle })),
            h('p', { class: 'sieve-verdict__text muted', text: sv.doneText }),
            h('button', { class: 'link sieve-verdict__again', type: 'button' }, GG.icon('refresh'), h('span', { text: sv.reset })))));

      var pillars = h('ul', { class: 'pillars', role: 'list', 'data-reveal': '' },
        q.pillars.map(function (p) {
          return h('li', { class: 'pillar' },
            h('span', { class: 'pillar__icon' }, GG.icon(p.icon)),
            h('h3', { class: 'pillar__title', text: p.title }),
            h('p', { class: 'pillar__text', text: p.text }));
        }));

      root.appendChild(h('div', { class: 'container' },
        GG.head(q, 'quality-title'),
        h('div', { class: 'quality__grid' }, instrument, pillars)));
    },

    init: function (root) {
      var card = root.querySelector('.sieve-card');
      var canvas = root.querySelector('.sieve-card__canvas');
      var btn = root.querySelector('.hold');
      var fill = root.querySelector('.hold__fill');
      var again = root.querySelector('.sieve-verdict__again');
      var label = root.querySelector('.hold__label');
      var C = GG.content(), sv = C.quality.sieve;
      var sieve = Sieve(canvas);
      var p = 0, holding = false, done = false, raf = null, last = 0, t0 = 0, lastFill = -1;

      function render(now) {
        var shake = holding && !done && !GG.reduced() ? Math.sin(now / 26) * 2.2 + Math.sin(now / 9) * 0.8 : 0;
        sieve.draw(p, shake);
        var off = Math.round(132 * (1 - p));
        if (off !== lastFill) { lastFill = off; fill.style.strokeDashoffset = off; }
      }
      function loop(now) {
        var dt = Math.min(0.05, (now - (last || now)) / 1000);
        last = now;
        if (holding && !done) p = Math.min(1, p + dt / HOLD_SECONDS);
        else if (!done) p = Math.max(0, p - dt / RELEASE_SECONDS);
        render(now);
        if (p >= 1 && !done) finish();
        if ((holding && !done) || (!done && p > 0)) raf = requestAnimationFrame(loop);
        else { raf = null; last = 0; }
      }
      function kick() { if (raf === null) raf = requestAnimationFrame(loop); }
      function start(e) {
        if (done) return;
        if (e && e.type === 'pointerdown') { btn.setPointerCapture && btn.setPointerCapture(e.pointerId); e.preventDefault(); }
        holding = true;
        card.classList.add('is-holding');
        GG.setText(label, sv.holdingLabel);
        kick();
      }
      function stop() {
        if (!holding) return;
        holding = false;
        card.classList.remove('is-holding');
        if (!done) GG.setText(label, sv.holdLabel);
        kick();
      }
      function finish() {
        done = true;
        holding = false;
        p = 1;
        card.classList.remove('is-holding');
        card.classList.add('is-done');
        render(performance.now());
      }
      function reset() {
        done = false;
        card.classList.remove('is-done');
        GG.setText(label, sv.holdLabel);
        if (GG.reduced()) { finish(); return; }
        /* ease back to the start */
        var from = p, s = performance.now();
        (function back(now) {
          var t = Math.min(1, (now - s) / 900);
          p = from * (1 - (1 - Math.pow(1 - t, 3)));
          render(now);
          if (t < 1) requestAnimationFrame(back);
          else btn.focus();
        })(s);
      }

      btn.addEventListener('pointerdown', start);
      btn.addEventListener('pointerup', stop);
      btn.addEventListener('pointercancel', stop);
      btn.addEventListener('lostpointercapture', stop);
      btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      btn.addEventListener('keydown', function (e) {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); }
        else if (e.key === ' ' || e.key === 'Enter') e.preventDefault();
      });
      btn.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') stop(); });
      btn.addEventListener('blur', stop);
      again.addEventListener('click', reset);

      function relayout() { sieve.layout(); render(performance.now()); }
      var rt;
      addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(relayout, 150); });

      function applyReduced() { if (GG.reduced()) finish(); }
      GG.reducedMQ.addEventListener('change', applyReduced);

      /* first paint when it scrolls near */
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (en) {
          if (en[0].isIntersecting) { io.disconnect(); relayout(); applyReduced(); }
        }, { rootMargin: '200px' });
        io.observe(canvas);
      } else { relayout(); applyReduced(); }
      GG.pauseOffscreen([root]);
    }
  };
})();
