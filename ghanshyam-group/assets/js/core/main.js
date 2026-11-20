/* ==========================================================================
   START: render every section from site-content.js, then wire behaviour.
   Each section script registers GG.sections.<name> = { render, init, enhance }.
   ========================================================================== */
(function () {
  'use strict';
  var GG = window.GG;
  var C = window.SITE_CONTENT;
  if (!GG || !C) { document.body.classList.add('is-ready'); return; }

  /* Title and description from the content file */
  if (C.meta) {
    document.title = GG.txt(C.meta.title);
    var md = document.querySelector('meta[name="description"]');
    if (md && C.meta.description) md.setAttribute('content', GG.txt(C.meta.description));
  }

  var mounts = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));

  function each(phase, extra) {
    mounts.forEach(function (el) {
      var s = GG.sections[el.getAttribute('data-section')];
      if (!s || typeof s[phase] !== 'function') return;
      try { s[phase](el, C, extra); }
      catch (err) { console.error('[' + el.getAttribute('data-section') + '] ' + phase + ' failed', err); }
    });
  }

  each('render');
  each('init');
  GG.reveal(document);

  /* Review mode: index.html?review outlines every SAMPLE value */
  if (/[?&]review\b/.test(location.search)) {
    document.documentElement.classList.add('review-mode');
    var count = document.querySelectorAll('[data-sample]').length;
    document.body.appendChild(GG.h('div', { class: 'review-badge', role: 'status' },
      'Review mode: ' + count + ' places on this page use sample data (dashed orange outline). Edit them in site-content.js.'));
  }

  requestAnimationFrame(function () { document.body.classList.add('is-ready'); });

  /* Motion-powered enhancements run once the library arrives (or never, safely) */
  GG.whenMotion(function (M) { each('enhance', M); });
})();
