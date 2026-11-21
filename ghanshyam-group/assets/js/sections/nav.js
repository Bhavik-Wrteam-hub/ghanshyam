/* NAV: the group's logo, the menu (with the Businesses panel that shows all
   five companies), the page's one call to action, and the phone menu.
   The same menu sits on every page: links to the homepage's sections work
   from any page, and on a company's page its own button replaces the
   group's. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  function brand(C, cls) {
    var a = h('a', { class: 'brand ' + (cls || ''), href: GG.page.isHome ? '#top' : 'index.html', 'aria-label': GG.txt(C.nav.homeLabel) });
    var logo = GG.logo({ label: GG.txt(C.facts.company.logoLabel || 'GROUP'), layout: 'compact', cls: 'brand__logo' });
    logo.removeAttribute('role');               /* the link already carries the name */
    logo.setAttribute('aria-hidden', 'true');
    a.appendChild(logo);
    return a;
  }
  GG.brand = brand;

  /* The page's main button: the group's, or the company's own */
  function cta(C) {
    var co = GG.page.company;
    return { label: co ? co.cta.label : C.nav.cta.label, href: '#contact' };
  }

  GG.sections.nav = {
    render: function (root, C) {
      var n = C.nav, P = GG.page, D = C.division || {};
      var cos = GG.companies();
      var main = cta(C);
      var skip = document.querySelector('.skip');
      if (skip) GG.setText(skip, n.skipLink);

      /* The Businesses panel (desktop). It sits right after its button, so the
         keyboard moves from "Businesses" straight into the five companies. */
      var menu = h('div', { class: 'biz-menu', id: 'biz-menu', hidden: true },
        h('div', { class: 'biz-menu__inner container' },
          h('p', { class: 'biz-menu__title kicker', text: n.businessesTitle }),
          h('ul', { class: 'biz-menu__list', role: 'list' },
            cos.map(function (co) {
              return h('li', null,
                h('a', {
                  class: 'biz-card', href: co.page, style: { '--tint': 'var(--tint-' + co.id + ')' },
                  'aria-current': P.id === co.id ? 'page' : null
                },
                  h('span', { class: 'biz-card__img' }, GG.img(co.image, { alt: '', sizes: '230px' })),
                  h('span', { class: 'biz-card__name' }, h('span', { class: 'biz-card__dot', 'aria-hidden': 'true' }), h('span', { text: co.name })),
                  h('span', { class: 'biz-card__tag', text: co.tagline }),
                  h('span', { class: 'biz-card__since mono', text: GG.txt(D.since) + ' ' + GG.txt(co.since), sample: co.since })));
            })),
          h('a', { class: 'link biz-menu__all', href: GG.home(n.businessesAll.href) },
            h('span', { text: n.businessesAll.label }), GG.icon('arrow-right'))));

      var links = h('ul', { class: 'nav__links', role: 'list' },
        n.links.map(function (l) {
          if (l.menu) {
            return h('li', { class: 'nav__item-biz' },
              h('button', {
                class: 'nav__link nav__biz' + (P.isHome ? '' : ' is-current'), type: 'button',
                'aria-expanded': 'false', 'aria-controls': 'biz-menu'
              }, h('span', { text: l.label }), GG.icon('chevron', 'nav__chev')),
              menu);
          }
          return h('li', null, h('a', { class: 'nav__link', href: GG.home(l.href), text: l.label }));
        }));

      var toggle = h('button', { class: 'nav__toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'nav-sheet' },
        GG.icon('menu'), h('span', { class: 'nav__toggle-label', text: n.menuOpen }));

      /* The phone menu: the five businesses first, then the other links */
      var c = C.facts.contact;
      var plain = n.links.filter(function (l) { return !l.menu; });
      var sheet = h('div', { class: 'nav__sheet', id: 'nav-sheet', hidden: true },
        h('div', { class: 'nav__sheet-inner container' },
          h('div', { class: 'nav__sheet-biz' },
            h('p', { class: 'kicker', text: n.businessesTitle }),
            h('ul', { class: 'nav__sheet-cos', role: 'list' },
              cos.map(function (co, i) {
                return h('li', { style: { '--i': i, '--tint': 'var(--tint-' + co.id + ')' } },
                  h('a', { href: co.page, 'aria-current': P.id === co.id ? 'page' : null },
                    h('span', { class: 'nav__sheet-dot', 'aria-hidden': 'true' }),
                    h('span', { class: 'nav__sheet-co' }, h('span', { text: co.name }), h('span', { class: 'nav__sheet-tag', text: co.tagline })),
                    GG.icon('arrow-right')));
              }))),
          h('ul', { class: 'nav__sheet-links', role: 'list' },
            plain.map(function (l, i) {
              return h('li', { style: { '--i': i + cos.length } }, h('a', { href: GG.home(l.href), text: l.label }));
            }).concat([h('li', { style: { '--i': plain.length + cos.length } }, h('a', { class: 'nav__sheet-cta', href: main.href, text: main.label }))])),
          h('div', { class: 'nav__sheet-foot' },
            h('a', { class: 'nav__sheet-contact', href: 'tel:' + GG.txt(c.phone).replace(/[^+\d]/g, ''), sample: c.phone }, GG.icon('phone'), h('span', { text: c.phone })),
            h('a', { class: 'nav__sheet-contact', href: 'mailto:' + GG.txt(c.email), sample: c.email }, GG.icon('mail'), h('span', { text: c.email })))));

      root.appendChild(h('nav', { class: 'nav container', 'aria-label': 'Main' },
        brand(C),
        links,
        h('a', { class: 'btn btn--small nav__cta', href: main.href }, h('span', { text: main.label }), GG.icon('arrow-right', 'btn__arrow')),
        toggle));
      root.appendChild(sheet);
    },

    init: function (root, C) {
      var n = C.nav;
      /* The logo draws itself once per visit, on the first page opened */
      var firstPage = true;
      try { firstPage = !sessionStorage.getItem('gg-logo-drawn'); sessionStorage.setItem('gg-logo-drawn', '1'); } catch (e) { /* storage off: still fine */ }
      if (firstPage) GG.drawLogo(root.querySelector('.brand__logo'));

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

      /* ---- The Businesses panel ------------------------------------------- */
      var bizBtn = root.querySelector('.nav__biz');
      var menu = root.querySelector('#biz-menu');
      var bizItem = bizBtn && bizBtn.parentNode;
      var openT = null, closeT = null, hideT = null;
      function bizOpen() { return bizBtn && bizBtn.getAttribute('aria-expanded') === 'true'; }
      function setBiz(open, focusBack) {
        if (!bizBtn || open === bizOpen()) return;
        clearTimeout(openT); clearTimeout(closeT); clearTimeout(hideT);
        bizBtn.setAttribute('aria-expanded', String(open));
        root.classList.toggle('biz-open', open);
        if (open) {
          menu.hidden = false;
          requestAnimationFrame(function () { menu.classList.add('is-open'); });
        } else {
          menu.classList.remove('is-open');
          hideT = setTimeout(function () { if (!bizOpen()) menu.hidden = true; }, 320);
          if (focusBack) bizBtn.focus();
        }
      }
      if (bizBtn) {
        bizBtn.addEventListener('click', function () { setBiz(!bizOpen()); });
        /* a mouse resting on Businesses opens it; leaving the button and the
           panel (both inside bizItem) closes it */
        bizItem.addEventListener('pointerenter', function (e) {
          if (e.pointerType !== 'mouse') return;
          clearTimeout(closeT);
          if (!bizOpen()) openT = setTimeout(function () { setBiz(true); }, 140);
        });
        bizItem.addEventListener('pointerleave', function (e) {
          if (e.pointerType !== 'mouse') return;
          clearTimeout(openT);
          closeT = setTimeout(function () { setBiz(false); }, 260);
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && bizOpen()) setBiz(false, bizItem.contains(document.activeElement));
        });
        document.addEventListener('pointerdown', function (e) {
          if (bizOpen() && !bizItem.contains(e.target)) setBiz(false);
        });
        bizItem.addEventListener('focusout', function (e) {
          var to = e.relatedTarget;
          if (bizOpen() && to && !bizItem.contains(to)) setBiz(false);
        });
        menu.addEventListener('click', function (e) { if (e.target.closest('a')) setBiz(false); });
      }

      /* ---- Phone menu ---------------------------------------------------------- */
      var toggle = root.querySelector('.nav__toggle');
      var label = root.querySelector('.nav__toggle-label');
      var sheet = root.querySelector('#nav-sheet');
      var lastFocus = null;
      function sheetOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }
      function setOpen(open) {
        if (open === sheetOpen()) return;
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
      toggle.addEventListener('click', function () { setOpen(!sheetOpen()); });
      sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sheetOpen()) setOpen(false);
        if (e.key === 'Tab' && root.classList.contains('menu-open')) {
          /* keep focus inside the open menu */
          var f = [toggle].concat(Array.prototype.slice.call(sheet.querySelectorAll('a')));
          var i = f.indexOf(document.activeElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
      });
      matchMedia('(min-width: 1100px)').addEventListener('change', function (e) {
        if (e.matches) setOpen(false); else setBiz(false);
      });

      /* ---- Highlight the homepage section in view ------------------------------ */
      if (!GG.page.isHome || !('IntersectionObserver' in window)) return;
      var map = {};
      root.querySelectorAll('a.nav__link').forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
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
  };
})();
