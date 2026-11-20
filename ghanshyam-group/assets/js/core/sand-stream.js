/* ==========================================================================
   SAND STREAM: sand that runs down a line as the visitor scrolls.

   The line belongs to a tall element (the track). The stream's head follows
   the scroll: it sits 62% of the way down the screen, so the sand always
   leads the reader. Grains fall from the top of the screen to the head and
   spill where they land. When the head reaches a stop (a year on the
   timeline), the stop lights up and throws a small burst of grains.

   One canvas sticks to the screen inside the track, so only what is visible
   is drawn, and nothing runs while the track is off screen or the tab is
   hidden. "Reduce motion" shows the finished line with every stop lit.

   GG.SandStream({
     track:   element the line runs through (position: relative)
     line:    the faint line (absolutely positioned; its centre is the stream)
     fill:    the solid line inside it, grown with scaleY to the head
     stops:   elements on the line; the last one is where the stream ends
     onReach: function (index, reached) called as the head passes a stop
     colors:  grain colours (the default suits dark backgrounds)
     glow:    'r,g,b' of the stream's glow; glowAlpha to soften it on light backgrounds
   })
   ========================================================================== */
(function () {
  'use strict';
  var GG = (window.GG = window.GG || {});

  var ANCHOR = 0.62;     /* where the head sits, as a share of the screen height */
  var RATE = 160;        /* grains per second entering the visible stream */
  var COLORS = ['#F3E8CF', '#E6D3A8', '#D8BF8C', '#FFF7E6', '#C9AE7C'];

  GG.SandStream = function (opts) {
    var track = opts.track, line = opts.line, fill = opts.fill;
    var stops = opts.stops || [], onReach = opts.onReach || function () {};
    var colors = opts.colors || COLORS, glow = opts.glow || '243,232,207', glowA = opts.glowAlpha == null ? 1 : opts.glowAlpha;
    var canvas = document.createElement('canvas');
    canvas.className = 'sand-stream';
    canvas.setAttribute('aria-hidden', 'true');
    track.insertBefore(canvas, track.firstChild);
    var ctx = canvas.getContext('2d');
    var rnd = GG.rng(1996);

    var W = 1, Hc = 1, dpr = 1, lineX = 0, end = 1;
    var stopY = [], reached = stops.map(function () { return false; });
    var head = 0, grains = [], spills = [];
    var raf = null, last = 0, spawnAcc = 0, onScreen = false, lastOffset = null, t = 0;

    function measure() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, track.clientWidth);
      Hc = Math.max(1, window.innerHeight);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(Hc * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var tr = track.getBoundingClientRect();
      var lr = line.getBoundingClientRect();
      lineX = lr.left + lr.width / 2 - tr.left;
      stopY = stops.map(function (s) { var r = s.getBoundingClientRect(); return r.top + r.height / 2 - tr.top; });
      end = Math.max(1, stopY.length ? stopY[stopY.length - 1] : track.offsetHeight);
      line.style.top = '0px';
      line.style.height = end + 'px';
    }

    function grain(y) {
      return {
        y: y, vy: 160 + rnd() * 200,
        dx: (rnd() + rnd() + rnd() - 1.5) * 4.6,            /* the stream is a few pixels wide */
        ph: rnd() * 6.283, sw: 0.6 + rnd() * 1.6,
        s: 1.3 + rnd() * rnd() * 2.8, c: colors[(rnd() * colors.length) | 0], a: 0.7 + rnd() * 0.3
      };
    }
    function spill(x, y, power) {
      var ang = rnd() * Math.PI;                            /* upwards half-circle */
      var sp = (30 + rnd() * 110) * (power || 1);
      spills.push({
        x: x, y: y, vx: Math.cos(ang) * sp, vy: -Math.sin(ang) * sp * 0.8,
        life: 0.5 + rnd() * 0.7, max: 1.2, s: 1 + rnd() * 1.8, c: colors[(rnd() * colors.length) | 0]
      });
      spills[spills.length - 1].max = spills[spills.length - 1].life;
    }

    function setStops(on) {
      for (var i = 0; i < stopY.length; i++) {
        var r = on === undefined ? head >= stopY[i] - 1 : on;
        if (r !== reached[i]) {
          reached[i] = r;
          stops[i].classList.toggle('is-lit', r);
          onReach(i, r);
          if (r && on === undefined) for (var k = 0; k < 26; k++) spill(lineX, stopY[i], 1.5);
        }
      }
    }

    function frame(now) {
      raf = null;
      var dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      t += dt;
      var tr = track.getBoundingClientRect();
      var offset = canvas.getBoundingClientRect().top - tr.top;     /* the canvas's top, in track units */
      var target = GG.clamp(window.innerHeight * ANCHOR - tr.top, 0, end);
      head += (target - head) * (1 - Math.exp(-dt / 0.16));
      if (Math.abs(target - head) < 0.4) head = target;
      fill.style.transform = 'scaleY(' + (head / end).toFixed(4) + ')';
      setStops();

      /* a jump (fast scroll, a link): fill the newly visible stream at once */
      var visTop = Math.max(0, offset - 12), visBottom = offset + Hc + 12;
      if (lastOffset === null || Math.abs(offset - lastOffset) > Hc * 0.5) {
        grains.length = 0;
        for (var y = visTop; y < Math.min(head, visBottom); y += 4) if (rnd() < 0.8) grains.push(grain(y));
      }
      lastOffset = offset;

      /* new grains enter at the top of the screen, while the stream reaches it */
      if (head > visTop) {
        spawnAcc += dt * RATE;
        while (spawnAcc >= 1) { spawnAcc -= 1; grains.push(grain(visTop - rnd() * 16)); }
      } else spawnAcc = 0;

      ctx.clearRect(0, 0, W, Hc);
      var headOnScreen = head > offset - 20 && head < offset + Hc + 20;

      /* the glow of the stream, then the grains */
      var top = Math.max(0, visTop) - offset, bottom = Math.min(head, visBottom) - offset;
      if (bottom > top) {
        var g = ctx.createLinearGradient(0, top, 0, bottom);
        g.addColorStop(0, 'rgba(' + glow + ',' + (0.06 * glowA) + ')');
        g.addColorStop(1, 'rgba(' + glow + ',' + (0.3 * glowA) + ')');
        ctx.fillStyle = g;
        ctx.fillRect(lineX - 7, top, 14, bottom - top);
      }
      for (var i = grains.length - 1; i >= 0; i--) {
        var q = grains[i];
        q.vy += 90 * dt;
        q.y += q.vy * dt;
        if (q.y >= head) {
          if (headOnScreen && rnd() < 0.7) spill(lineX + q.dx, head, 0.85);
          grains.splice(i, 1);
          continue;
        }
        if (q.y > visBottom || q.y < visTop - 40) { grains.splice(i, 1); continue; }
        var x = lineX + q.dx + Math.sin(t * 3 * q.sw + q.ph) * q.sw;
        ctx.globalAlpha = q.a;
        ctx.fillStyle = q.c;
        ctx.fillRect(x - q.s / 2, q.y - offset - q.s, q.s, q.s * 1.9);
      }
      for (i = spills.length - 1; i >= 0; i--) {
        var p = spills[i];
        p.life -= dt;
        if (p.life <= 0) { spills.splice(i, 1); continue; }
        p.vy += 520 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.9;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x - p.s / 2, p.y - offset - p.s / 2, p.s, p.s);
      }
      /* a soft light where the sand lands */
      if (headOnScreen && head < end - 0.5) {
        var hy = head - offset;
        var rg = ctx.createRadialGradient(lineX, hy, 0, lineX, hy, 34);
        rg.addColorStop(0, 'rgba(' + glow + ',' + (0.6 * glowA) + ')');
        rg.addColorStop(1, 'rgba(' + glow + ',0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = rg;
        ctx.fillRect(lineX - 34, hy - 34, 68, 68);
      }
      ctx.globalAlpha = 1;
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
      else last = 0;
    }

    function start() {
      if (GG.reduced()) return finish();
      canvas.style.display = '';
      if (raf === null && onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    }
    /* "reduce motion": the whole line, every stop lit, no grains */
    function finish() {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      canvas.style.display = 'none';
      head = end;
      fill.style.transform = 'scaleY(1)';
      setStops(true);
    }

    measure();
    if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); lastOffset = null; start(); }).observe(track);
    addEventListener('resize', function () { measure(); lastOffset = null; });
    addEventListener('load', measure);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
    GG.reducedMQ.addEventListener('change', function (e) {
      if (e.matches) finish();
      else { setStops(false); head = 0; start(); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        onScreen = en[0].isIntersecting;
        if (onScreen) start();
      }, { rootMargin: '120px 0px' }).observe(track);
    } else { onScreen = true; }
    if (GG.reduced()) finish(); else start();
    return { measure: measure };
  };
})();
