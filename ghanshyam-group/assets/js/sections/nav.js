/* NAV: brand, section links, the one call to action, and the phone menu. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  function brand(C, cls) {
    var a = h('a', { class: 'brand ' + (cls || ''), href: '#top', 'aria-label': GG.txt(C.nav.homeLabel) });
    var logo = GG.logo({ label: GG.txt(C.facts.company.logoLabel || 'GROUP'), layout: 'horizontal', cls: 'brand__logo' });
    logo.removeAttribute('role');               /* the link already carries the name */
    logo.setAttribute('aria-hidden', 'true');
    a.appendChild(logo);
    return a;
  }
  GG.brand = brand;

  GG.sections.nav = {
    render: function (root, C) {
      var n = C.nav;
      var skip = document.querySelector('.skip');
      if (skip) GG.setText(skip, n.skipLink);

      var links = h('ul', { class: 'nav__links', role: 'list' },
        n.links.map(function (l) {
          return h('li', null, h('a', { class: 'nav__link', href: l.href, text: l.label }));
        }));

      var toggle = h('button', { class: 'nav__toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'nav-sheet' },
        GG.icon('menu'), h('span', { class: 'nav__toggle-label', text: n.menuOpen }));

      var c = C.facts.contact;
      var sheet = h('div', { class: 'nav__sheet', id: 'nav-sheet', hidden: true },
        h('div', { class: 'nav__sheet-inner container' },
          h('ul', { class: 'nav__sheet-links', role: 'list' },
            n.links.concat([n.cta]).map(function (l, i) {
              return h('li', { style: { '--i': i } }, h('a', { href: l.href, text: l.label }));
            })),
          h('div', { class: 'nav__sheet-foot' },
            h('a', { class: 'nav__sheet-contact', href: 'tel:' + GG.txt(c.phone).replace(/[^+\d]/g, ''), sample: c.phone }, GG.icon('phone'), h('span', { text: c.phone })),
            h('a', { class: 'nav__sheet-contact', href: 'mailto:' + GG.txt(c.email), sample: c.email }, GG.icon('mail'), h('span', { text: c.email })))));

      root.appendChild(h('nav', { class: 'nav container', 'aria-label': 'Main' },
        brand(C),
        links,
        h('a', { class: 'btn btn--small nav__cta', href: n.cta.href }, h('span', { text: n.cta.label }), GG.icon('arrow-right', 'btn__arrow')),
        toggle));
      root.appendChild(sheet);
    },

    init: function (root, C) {
      var n = C.nav;
      /* Solid background once the page moves */
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          root.classList.toggle('is-scrolled', window.scrollY > 24);
        });
      }
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      /* Phone menu */
      var toggle = root.querySelector('.nav__toggle');
      var label = root.querySelector('.nav__toggle-label');
      var sheet = root.querySelector('#nav-sheet');
      var lastFocus = null;
      function setOpen(open) {
        toggle.setAttribute('aria-expanded', String(open));
        GG.setText(label, open ? n.menuClose : n.menuOpen);
        toggle.replaceChild(GG.icon(open ? 'close' : 'menu'), toggle.querySelector('svg'));
        root.classList.toggle('menu-open', open);
        document.documentElement.classList.toggle('lock-scroll', open);
        if (open) {
          sheet.hidden = false;
          lastFocus = document.activeElement;
          requestAnimationFrame(function () { sheet.classList.add('is-open'); });
          var first = sheet.querySelector('a');
          if (first) setTimeout(function () { first.focus(); }, 60);
        } else {
          sheet.classList.remove('is-open');
          setTimeout(function () { if (!sheet.classList.contains('is-open')) sheet.hidden = true; }, 400);
          if (lastFocus && lastFocus.focus) lastFocus.focus();
        }
      }
      toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
      sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
        if (e.key === 'Tab' && root.classList.contains('menu-open')) {
          /* keep focus inside the open menu */
          var f = [toggle].concat(Array.prototype.slice.call(sheet.querySelectorAll('a')));
          var i = f.indexOf(document.activeElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
      });
      matchMedia('(min-width: 1100px)').addEventListener('change', function (e) { if (e.matches) setOpen(false); });

      /* Highlight the section in view */
      var map = {};
      root.querySelectorAll('.nav__link').forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            var a = map[e.target.id];
            if (!a) return;
            if (e.isIntersecting) {
              Object.keys(map).forEach(function (k) { map[k].removeAttribute('aria-current'); });
              a.setAttribute('aria-current', 'true');
            } else if (a.getAttribute('aria-current')) {
              a.removeAttribute('aria-current');
            }
          });
        }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
      }
    }
  };
})();
