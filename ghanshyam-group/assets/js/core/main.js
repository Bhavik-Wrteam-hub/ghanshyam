/* ==========================================================================
   START: render every section from site-content.js, then wire behaviour.
   Each section script registers GG.sections.<name> = { render, init, enhance }.

   Every page uses this same file. <body data-company="kaolin"> marks a
   company's own page; without it the page is the group's homepage.
   A section's render() may return false to say "nothing to show here", and
   its empty <section> is then taken out of the page.
   ========================================================================== */
(function () {
  'use strict';
  var GG = window.GG;
  var C = window.SITE_CONTENT;

  /* A typo in site-content.js (a missing comma, quote or bracket) stops that
     file from loading. Say so plainly instead of showing an empty page. */
  if (!GG || !C) {
    document.body.classList.add('is-ready');
    var main = document.getElementById('main') || document.body;
    var box = document.createElement('div');
    box.className = 'load-error';
    box.setAttribute('role', 'alert');
    box.innerHTML = '<strong>This page could not load its content.</strong>' +
      '<span>If site-content.js was just edited, a comma, quote or bracket may be missing near the change. ' +
      'The browser console (right-click the page, Inspect, Console) shows the line number.</span>';
    main.insertBefore(box, main.firstChild);
    return;
  }

  /* Which page is this? */
  var id = document.body.getAttribute('data-company');
  var company = id ? GG.company(id) : null;
  if (id && !company) console.error('[page] data-company="' + id + '" has no entry under companies in site-content.js');
  GG.page = { isHome: !company, id: company ? company.id : 'group', company: company };

  /* Title and description from the content file */
  var meta = company ? company.meta : C.meta;
  if (meta) {
    document.title = GG.txt(meta.title);
    var md = document.querySelector('meta[name="description"]');
    if (md && meta.description) md.setAttribute('content', GG.txt(meta.description));
  }

  var mounts = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));

  function each(phase, extra) {
    mounts = mounts.filter(function (el) {
      var name = el.getAttribute('data-section');
      var s = GG.sections[name];
      if (!s || typeof s[phase] !== 'function') return true;
      try {
        if (s[phase](el, C, extra) === false && phase === 'render') { el.remove(); return false; }
      } catch (err) {
        console.error('[' + name + '] ' + phase + ' failed', err);
      }
      return true;
    });
  }

  each('render');
  each('init');
  GG.reveal(document);

  /* Review mode: any page with ?review outlines every SAMPLE value */
  if (/[?&]review\b/.test(location.search)) {
    document.documentElement.classList.add('review-mode');
    var count = document.querySelectorAll('[data-sample]').length;
    document.body.appendChild(GG.h('div', { class: 'review-badge', role: 'status' },
      'Review mode: ' + count + ' places on this page use sample data (dashed orange outline). Edit them in site-content.js.'));
  }

  /* Arriving from another page with an #address: land on it once the page is built */
  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) requestAnimationFrame(function () { target.scrollIntoView(); });
  }

  requestAnimationFrame(function () { document.body.classList.add('is-ready'); });

  /* A row of cards you swipe on a phone can also be reached and moved by keyboard */
  function swipeRows() {
    document.querySelectorAll('.team, .clients__list').forEach(function (el) {
      if (el.scrollWidth > el.clientWidth + 1) el.setAttribute('tabindex', '0');
      else el.removeAttribute('tabindex');
    });
  }
  swipeRows();
  var swipeT = null;
  addEventListener('resize', function () { clearTimeout(swipeT); swipeT = setTimeout(swipeRows, 200); });

  /* Motion-powered enhancements run once the library arrives (or never, safely) */
  GG.whenMotion(function (M) { each('enhance', M); });
})();
