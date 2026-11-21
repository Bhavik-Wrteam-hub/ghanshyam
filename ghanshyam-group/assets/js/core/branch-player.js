/* ==========================================================================
   BRANCH PLAYER: five videos on one stage, one playing at a time.

   The page scrolls normally. Each branch has a step in the page, and the step
   crossing a line near the middle of the screen is the current branch. That is measured
   with IntersectionObserver, so mouse wheel, trackpad, keyboard and touch all
   behave the same and no scroll events are used.

   - Only the current branch plays. Leaving the stage, hiding the tab or
     pressing pause stops it.
   - Only the current branch and its two neighbours are loaded. The neighbours
     wait until the current video can play, and the rest stay unloaded.
   - "Reduce motion", data saver and very slow connections keep the poster.
   - If a video cannot play its poster stays. If the poster fails too, the
     group's still picture shows through.

   GG.BranchPlayer({
     root:   the section (receives .use-still)
     stage:  the sticky stage, watched to know the videos are on screen
     steps:  the step elements, each with data-i = its branch's number
     layers: the branch layers, each with data-base = its videos' path
     still:  the fallback <img>, and stillSrc: its address
     onChange(index): the current branch changed
   })
   returns { state(), setPaused(bool), isPaused(), destroy() }
   ========================================================================== */
(function () {
  'use strict';
  var GG = (window.GG = window.GG || {});

  var FADE = 850;                    /* keep in step with the fade in film.css */
  var PORTRAIT = matchMedia('(orientation: portrait)');
  var PAUSE_KEY = 'gg-films-paused';

  var probe = document.createElement('video');
  var webmWorks = !!probe.canPlayType('video/webm; codecs="vp9"');
  var apple = /Apple/.test(navigator.vendor || '');   /* Safari and every iOS browser */

  function connection() { return navigator.connection || {}; }
  function veryslow() { return /(^|-)2g$/.test(connection().effectiveType || ''); }
  function slow() { return /(^|-)[23]g$/.test(connection().effectiveType || ''); }

  /* Which cut suits this screen: tall for portrait, 720 for small or slow ones */
  function cut() {
    if (PORTRAIT.matches) return 'tall';
    var w = window.innerWidth, dpr = window.devicePixelRatio || 1;
    if (w <= 960 || slow() || w * dpr < 1360) return '720';
    return 'wide';
  }

  /* H.264 on Apple devices (their hardware decoder); WebM first elsewhere */
  function formats(base, size) {
    var mp4 = { src: base + '-' + size + '.mp4', type: 'video/mp4' };
    var webm = { src: base + '-' + size + '.webm', type: 'video/webm; codecs="vp9"' };
    return webmWorks && !apple ? [webm, mp4] : [mp4, webm];
  }

  GG.BranchPlayer = function (o) {
    var root = o.root, stage = o.stage, steps = o.steps;
    var onChange = o.onChange || function () {};

    var active = -1, inView = false, paused = false, held = false, running = false;
    var shown = null, stepIO = null, viewIO = null, resizeT = null, gesture = null;

    try { paused = sessionStorage.getItem(PAUSE_KEY) === '1'; } catch (e) { /* storage off: fine */ }

    var layers = o.layers.map(function (el) {
      var l = {
        el: el, base: el.getAttribute('data-base'),
        video: el.querySelector('video'), img: el.querySelector('img'),
        wide: el.querySelector('picture source'),
        size: null, ready: false, failed: false, resumeAt: 0, hasPoster: false
      };
      l.video.addEventListener('canplay', function () { if (layers[active] === l) play(); });
      /* the neighbours start only once this one can play to the end without waiting */
      l.video.addEventListener('canplaythrough', function () {
        l.ready = true;
        if (layers[active] === l) loadNeighbours();
      });
      l.video.addEventListener('loadedmetadata', function () {
        if (l.resumeAt) { l.video.currentTime = l.resumeAt % (l.video.duration || 1); l.resumeAt = 0; }
      });
      l.video.addEventListener('playing', function () {
        if (l.size) { l.el.classList.add('is-playing'); if (layers[active] === l) settle(l); }
      });
      l.video.addEventListener('error', function () { if (l.size) fail(l); });
      l.img.addEventListener('load', function () { l.hasPoster = true; if (layers[active] === l) settle(l); });
      l.img.addEventListener('error', function () {
        if (!l.img.getAttribute('src')) return;
        l.el.classList.add('no-poster');
        useStill();
        if (layers[active] === l) settle(l);
      });
      return l;
    });

    function useStill() {
      if (o.still && !o.still.getAttribute('src')) o.still.src = o.stillSrc;
      root.classList.add('use-still');
    }

    function streaming() {
      return !GG.reduced() && !connection().saveData && !veryslow();
    }

    /* ---- Posters ---------------------------------------------------------- */
    function showPoster(l) {
      if (l.img.getAttribute('src')) return;
      if (l.wide) l.wide.srcset = l.base + '-tall.webp';
      l.img.src = l.base + '.webp';
    }

    /* ---- Videos: attached when needed, released when far away ---------------- */
    function attach(l) {
      var size = cut();
      if (l.size === size) return;
      if (l.size) { l.resumeAt = l.video.currentTime || 0; clearSources(l); }
      l.size = size;
      l.ready = false;
      l.failed = false;
      l.el.classList.remove('is-failed');
      formats(l.base, size).forEach(function (f) {
        var s = document.createElement('source');
        s.src = f.src;
        s.type = f.type;
        s.addEventListener('error', function () { if (l.video.lastElementChild === s && l.size) fail(l); });
        l.video.appendChild(s);
      });
      l.video.preload = 'auto';
      l.video.load();
    }
    function clearSources(l) {
      l.video.pause();
      while (l.video.firstChild) l.video.removeChild(l.video.firstChild);
      l.video.removeAttribute('src');
      l.el.classList.remove('is-playing');
    }
    function release(l) {
      if (!l.size) return;
      clearSources(l);
      l.video.load();                /* frees the decoder and stops any download */
      l.size = null;
      l.ready = false;
      l.failed = false;
      l.resumeAt = 0;
      l.el.classList.remove('is-failed');
    }
    function fail(l) {
      l.failed = true;
      l.video.pause();
      l.el.classList.remove('is-playing');
      l.el.classList.add('is-failed');
      if (!l.hasPoster) useStill();
    }
    function loadNeighbours() {
      if (!streaming() || slow()) return;
      [active - 1, active + 1].forEach(function (i) { if (layers[i]) attach(layers[i]); });
    }

    /* ---- One video plays: the current branch, if it may ---------------------- */
    function play() {
      var cur = layers[active];
      layers.forEach(function (l) { if (l !== cur && !l.video.paused) l.video.pause(); });
      if (!cur) return;
      if (!inView || paused || held || document.hidden || !streaming() || cur.failed) {
        if (!cur.video.paused) cur.video.pause();
        return;
      }
      attach(cur);
      cur.video.muted = true;
      var p = cur.video.play();
      if (p && p.catch) p.catch(function (err) {
        /* autoplay refused (iPhone Low Power Mode): try again on the first touch */
        if (err && err.name === 'NotAllowedError') waitForGesture();
      });
    }
    function waitForGesture() {
      if (gesture) return;
      gesture = function () { clearGesture(); play(); };
      ['pointerdown', 'touchend', 'keydown'].forEach(function (t) {
        addEventListener(t, gesture, { passive: true });
      });
    }
    function clearGesture() {
      if (!gesture) return;
      ['pointerdown', 'touchend', 'keydown'].forEach(function (t) { removeEventListener(t, gesture); });
      gesture = null;
    }

    /* Everything follows from: which branch, on screen or not, allowed or not */
    function sync() {
      if (active < 0) return;
      var stream = streaming();
      layers.forEach(function (l, i) {
        var near = Math.abs(i - active) <= 1;
        if (near) showPoster(l);
        if (!stream || !near) release(l);
      });
      if (stream && inView) {
        var cur = layers[active];
        attach(cur);
        if (cur.ready) loadNeighbours();
      }
      play();
    }

    /* ---- The crossfade: the old picture stays until the new one is on screen -- */
    function settle(l) {
      if (shown === l) return;
      var leaving = shown;
      shown = l;
      clearTimeout(settle.t);
      settle.t = setTimeout(function () {
        layers.forEach(function (x) { if (x !== shown) x.el.classList.remove('is-leaving'); });
      }, FADE);
      if (leaving) leaving.el.classList.add('is-leaving');
    }
    function setActive(i) {
      if (i === active || !layers[i]) return;
      var prev = layers[active], next = layers[i];
      if (prev) {
        prev.el.classList.remove('is-active');
        prev.el.classList.add('is-leaving');
      }
      next.el.classList.remove('is-leaving');
      next.el.classList.add('is-active');
      active = i;
      onChange(i);
      sync();
      if (next.hasPoster || next.el.classList.contains('is-playing') || next.el.classList.contains('no-poster')) settle(next);
    }

    /* ---- Watching the page --------------------------------------------------- */
    function onStep(entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var at = steps.indexOf(e.target);
        steps.forEach(function (s, k) {
          s.classList.toggle('is-current', k === at);
          s.classList.toggle('is-past', k < at);
        });
        setActive(Number(e.target.getAttribute('data-i')));
      });
    }
    function onView(entries) {
      var e = entries[entries.length - 1];
      var now = e.isIntersecting && e.intersectionRatio >= 0.1;
      if (now !== inView) { inView = now; sync(); }
    }
    function reframe() {
      var size = cut();
      layers.forEach(function (l) { if (l.size && l.size !== size) attach(l); });
      play();
    }
    function onResize() { clearTimeout(resizeT); resizeT = setTimeout(reframe, 200); }

    function start() {
      if (running) return;
      running = true;
      /* a step becomes current as it crosses a line just below the middle, so a
         company's film starts as its card arrives */
      stepIO = new IntersectionObserver(onStep, { rootMargin: '-60% 0px -40% 0px' });
      steps.forEach(function (s) { stepIO.observe(s); });
      /* the top 90px is under the menu bar, so it does not count as on screen */
      viewIO = new IntersectionObserver(onView, { rootMargin: '-90px 0px 0px 0px', threshold: [0, 0.1, 0.5] });
      viewIO.observe(stage);
      document.addEventListener('visibilitychange', sync);
      GG.reducedMQ.addEventListener('change', sync);
      PORTRAIT.addEventListener('change', reframe);
      addEventListener('resize', onResize);
    }
    function stop() {
      if (!running) return;
      running = false;
      stepIO.disconnect();
      viewIO.disconnect();
      stepIO = viewIO = null;
      inView = false;
      clearTimeout(resizeT);
      clearGesture();
      document.removeEventListener('visibilitychange', sync);
      GG.reducedMQ.removeEventListener('change', sync);
      PORTRAIT.removeEventListener('change', reframe);
      removeEventListener('resize', onResize);
      layers.forEach(function (l) { if (!l.video.paused) l.video.pause(); });
    }
    /* leaving the page cleans up; coming back from the browser's back button resumes */
    function onHide() { stop(); }
    function onShow(e) { if (e.persisted) start(); }

    if (!('IntersectionObserver' in window)) {
      /* a very old browser: the group's still, and every caption simply scrolls */
      useStill();
      root.classList.add('no-observer');
      return { state: function () { return { active: -1, playing: [], loaded: [] }; }, setPaused: function () {}, setHeld: function () {}, isPaused: function () { return true; }, destroy: function () {} };
    }
    addEventListener('pagehide', onHide);
    addEventListener('pageshow', onShow);
    start();

    return {
      isPaused: function () { return paused; },
      setPaused: function (value) {
        paused = !!value;
        try { sessionStorage.setItem(PAUSE_KEY, paused ? '1' : '0'); } catch (e) { /* fine */ }
        play();
        document.dispatchEvent(new CustomEvent('gg:films-paused'));
      },
      /* another film on the page is on screen: rest until it is not */
      setHeld: function (value) {
        if (!!value === held) return;
        held = !!value;
        play();
      },
      state: function () {
        function which(test) { return layers.reduce(function (a, l, i) { if (test(l)) a.push(i); return a; }, []); }
        return {
          active: active, inView: inView, paused: paused, cut: cut(), running: running,
          playing: which(function (l) { return !l.video.paused; }),
          showing: which(function (l) { return l.el.classList.contains('is-playing'); }),
          loaded: which(function (l) { return !!l.size; }),
          posters: which(function (l) { return !!l.img.getAttribute('src'); }),
          failed: which(function (l) { return l.failed; }),
          still: root.classList.contains('use-still')
        };
      },
      destroy: function () {
        stop();
        removeEventListener('pagehide', onHide);
        removeEventListener('pageshow', onShow);
        layers.forEach(release);
      }
    };
  };

  /* ==========================================================================
     FRAME FILM: one video in its own picture frame (the About section).
     It loads as it comes near the screen and plays while at least half of it
     is on screen. While it does, the branch films above rest, so the page never
     plays two at once. It obeys the same pause button, "reduce motion" and data
     saver rules, and its poster stays if the video cannot play.

     GG.FrameFilm({ frame, video, base })   base + '-large' / '-small' .mp4 .webm
     returns { state(), destroy() }
     ========================================================================== */
  GG.FrameFilm = function (o) {
    var frame = o.frame, video = o.video, base = o.base;
    var near = false, inView = false, size = null, failed = false, running = false, resumeAt = 0;
    var nearIO = null, viewIO = null, resizeT = null, gesture = null;

    function hero() { return GG.filmPlayer || null; }
    function userPaused() { var h = hero(); return !!(h && h.isPaused()); }
    function allowed() { return !GG.reduced() && !connection().saveData && !veryslow(); }
    /* the smaller cut for phones, upright or sideways, and for slow connections */
    function pick() { return Math.min(window.innerWidth, window.innerHeight) <= 560 || slow() ? 'small' : 'large'; }

    function clear() {
      video.pause();
      while (video.firstChild) video.removeChild(video.firstChild);
      video.removeAttribute('src');
      frame.classList.remove('is-playing');
    }
    function attach() {
      var wanted = pick();
      if (size === wanted) return;
      if (size) { resumeAt = video.currentTime || 0; clear(); }
      size = wanted;
      failed = false;
      frame.classList.remove('is-failed');
      formats(base, wanted).forEach(function (f) {
        var s = document.createElement('source');
        s.src = f.src;
        s.type = f.type;
        s.addEventListener('error', function () { if (video.lastElementChild === s && size) fail(); });
        video.appendChild(s);
      });
      video.preload = 'auto';
      video.load();
    }
    function release() {
      if (!size) return;
      clear();
      video.load();
      size = null;
      resumeAt = 0;
    }
    function fail() {
      failed = true;
      video.pause();
      frame.classList.remove('is-playing');
      frame.classList.add('is-failed');
      update();
    }
    function clearGesture() {
      if (!gesture) return;
      ['pointerdown', 'touchend', 'keydown'].forEach(function (t) { removeEventListener(t, gesture); });
      gesture = null;
    }
    function update() {
      var ok = allowed();
      if (!ok) release();
      else if (near && !failed) attach();
      var h = hero();
      if (h && h.setHeld) h.setHeld(inView && ok && !failed);
      if (inView && ok && !failed && !userPaused() && !document.hidden) {
        attach();
        video.muted = true;
        var p = video.play();
        if (p && p.catch) p.catch(function (err) {
          if (!err || err.name !== 'NotAllowedError' || gesture) return;
          gesture = function () { clearGesture(); update(); };
          ['pointerdown', 'touchend', 'keydown'].forEach(function (t) { addEventListener(t, gesture, { passive: true }); });
        });
      } else if (!video.paused) {
        video.pause();
      }
    }

    video.addEventListener('playing', function () { if (size) frame.classList.add('is-playing'); });
    video.addEventListener('error', function () { if (size) fail(); });
    video.addEventListener('loadedmetadata', function () {
      if (resumeAt) { video.currentTime = resumeAt % (video.duration || 1); resumeAt = 0; }
    });

    function onNear(entries) {
      var now = entries[entries.length - 1].isIntersecting;
      if (now !== near) { near = now; update(); }
    }
    function onView(entries) {
      var e = entries[entries.length - 1];
      /* a frame taller than the screen counts as in view once it fills most of it */
      var room = e.rootBounds ? e.rootBounds.height : window.innerHeight;
      var need = Math.min(0.5, 0.8 * room / Math.max(1, e.boundingClientRect.height));
      var now = e.isIntersecting && e.intersectionRatio >= need;
      if (now !== inView) { inView = now; update(); }
    }
    function onResize() { clearTimeout(resizeT); resizeT = setTimeout(function () { if (size) update(); }, 200); }

    function start() {
      if (running) return;
      running = true;
      nearIO = new IntersectionObserver(onNear, { rootMargin: '500px 0px' });
      nearIO.observe(frame);
      viewIO = new IntersectionObserver(onView, { rootMargin: '-90px 0px 0px 0px', threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
      viewIO.observe(frame);
      document.addEventListener('visibilitychange', update);
      document.addEventListener('gg:films-paused', update);
      GG.reducedMQ.addEventListener('change', update);
      addEventListener('resize', onResize);
    }
    function stop() {
      if (!running) return;
      running = false;
      nearIO.disconnect();
      viewIO.disconnect();
      nearIO = viewIO = null;
      near = inView = false;
      clearTimeout(resizeT);
      clearGesture();
      document.removeEventListener('visibilitychange', update);
      document.removeEventListener('gg:films-paused', update);
      GG.reducedMQ.removeEventListener('change', update);
      removeEventListener('resize', onResize);
      if (!video.paused) video.pause();
      var h = hero();
      if (h && h.setHeld) h.setHeld(false);
    }
    function onHide() { stop(); }
    function onShow(e) { if (e.persisted) start(); }

    if ('IntersectionObserver' in window) {
      addEventListener('pagehide', onHide);
      addEventListener('pageshow', onShow);
      start();
    }
    return {
      state: function () {
        return { near: near, inView: inView, size: size, failed: failed, running: running,
          playing: !video.paused, showing: frame.classList.contains('is-playing') };
      },
      destroy: function () {
        stop();
        removeEventListener('pagehide', onHide);
        removeEventListener('pageshow', onShow);
        release();
      }
    };
  };
})();
