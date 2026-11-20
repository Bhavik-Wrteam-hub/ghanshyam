/* ==========================================================================
   A COMPANY'S OWN PAGE (silica-sand.html, kaolin.html, minerals.html,
   processors.html, farm-house.html).
   Every company page is built from the same sections, filled from that
   company's entry under THE FIVE BUSINESSES in site-content.js. The page's
   <body data-company="kaolin"> says which company it is.
     dhero       its first screen: breadcrumb, its own logo, its line, its photo
     dlocal      the bar under it, with links to the page's sections
     doverview   about the company
     dproducts   its products: photos, or drawn stand-ins until photos exist
     dprocess    how it's made, along a line that draws itself as you scroll
     dapps       the industries it supplies
     dothers     the group's other four companies
   ========================================================================== */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h, pad = GG.pad;

  function company() { return GG.page && GG.page.company; }
  function tint(id) { return 'var(--tint-' + id + ')'; }
  function indexOf(c) { return GG.companies().indexOf(c); }

  /* A company's facts, then the year it began */
  function factRows(c, D) { return (GG.deep(c.facts) || []).concat([[GG.txt(D.since), GG.txt(c.since)]]); }
  function factSample(c) { return GG.hasS(c.facts) || GG.fmt(c.since).sample ? { __sample: true, value: '' } : null; }

  function crumbs(c, D) {
    return h('nav', { class: 'crumbs mono', 'aria-label': GG.txt(D.breadcrumb) },
      h('ol', { role: 'list' },
        h('li', null, h('a', { href: 'index.html', text: D.home })),
        h('li', null, h('a', { href: 'index.html#businesses', text: D.businesses })),
        h('li', null, h('span', { 'aria-current': 'page', text: c.short }))));
  }

  /* ==========================================================================
     THE FIRST SCREEN
     ========================================================================== */
  GG.sections.dhero = {
    render: function (root, C) {
      var c = company();
      if (!c) return false;
      var D = C.division, hero = c.hero || {};
      root.style.setProperty('--tint', tint(c.id));

      /* the heading names the company for screen readers and search engines;
         the eye reads the company's logo and its line */
      var line = GG.fmt(hero.title || c.tagline);
      var vis = h('span', { class: 'dh__line' });
      GG.split(vis, line.text, 13);
      var title = h('h1', { class: 'dh__title', id: 'dhero-title', 'data-sample': line.sample ? '' : null },
        h('span', { class: 'sr-only', text: GG.txt(c.name) + ': ' }), vis);
      var logo = GG.logo({ label: GG.txt(c.logoLabel), name: GG.txt(c.name), cls: 'dh__logo' });
      logo.removeAttribute('role');
      logo.setAttribute('aria-hidden', 'true');

      var dust = h('span', { class: 'dh__dust', 'aria-hidden': 'true' },
        [0, 1, 2, 3, 4, 5].map(function (i) { return h('span', { style: { '--i': i } }); }));

      root.appendChild(h('div', { class: 'container dh' },
        h('div', { class: 'dh__copy' },
          crumbs(c, D),
          logo,
          title,
          h('p', { class: 'dh__text', text: hero.text || c.summary }),
          h('div', { class: 'btn-row dh__ctas' },
            h('a', { class: 'btn', href: '#contact' }, h('span', { text: c.cta.label }), GG.icon('arrow-right', 'btn__arrow')),
            h('a', { class: 'btn btn--ghost', href: '#products', text: D.productsCta })),
          GG.factList(factRows(c, D), 'dh__facts', factSample(c))),
        h('div', { class: 'dh__media' },
          h('div', { class: 'dh__frame' },
            GG.img(c.image, { eager: true, cls: 'dh__img', sizes: '(max-width: 960px) 100vw, 640px' }),
            dust),
          h('p', { class: 'dh__part mono' }, GG.mark({ cls: 'dh__mark' }), h('span', { text: D.partOf })))));
    },

    init: function (root) {
      if (GG.reduced()) { root.classList.add('is-in'); return; }
      requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(function () { root.classList.add('is-in'); }, 100); }); });
      GG.reducedMQ.addEventListener('change', function (e) { if (e.matches) root.classList.add('is-in'); });
      GG.pauseOffscreen([root]);
    },

    /* the photo drifts slowly inside its frame as the page moves */
    enhance: function (root, C, M) {
      if (GG.reduced() || !M.scroll || !M.animate) return;
      var img = root.querySelector('.dh__img'), frame = root.querySelector('.dh__frame');
      if (!img || !frame) return;
      M.scroll(M.animate(img, { transform: ['translateY(-3%) scale(1.1)', 'translateY(5%) scale(1.1)'] }, { ease: 'linear' }),
        { target: frame, offset: ['start end', 'end start'] });
    }
  };

  /* ==========================================================================
     THE PAGE'S OWN BAR: the company's name, links to its sections, its button.
     It sticks under the menu. Each section that should appear in it carries
     data-local="..." in the page (the words are in division.local).
     ========================================================================== */
  GG.sections.dlocal = {
    render: function (root, C) {
      var c = company();
      if (!c) return false;
      var D = C.division;
      root.style.setProperty('--tint', tint(c.id));
      root.setAttribute('aria-label', GG.txt(D.localLabel));
      root.appendChild(h('div', { class: 'container dl' },
        h('a', { class: 'dl__brand', href: '#top' },
          h('span', { class: 'dl__dot', 'aria-hidden': 'true' }), h('span', { class: 'dl__name', text: c.name })),
        h('ul', { class: 'dl__links', role: 'list' }),
        h('a', { class: 'btn btn--small dl__cta', href: '#contact' }, h('span', { text: c.cta.label }), GG.icon('arrow-right', 'btn__arrow'))));
    },

    init: function (root, C) {
      var L = C.division.local;
      var list = root.querySelector('.dl__links');
      var targets = Array.prototype.slice.call(document.querySelectorAll('[data-local]'));
      var map = {};
      targets.forEach(function (el) {
        var a = h('a', { class: 'dl__link', href: '#' + el.id, text: L[el.getAttribute('data-local')] || el.id });
        map[el.id] = a;
        list.appendChild(h('li', null, a));
      });

      /* a soft shadow once the bar sticks */
      var stuck = null, ticking = false;
      function check() {
        ticking = false;
        var s = root.getBoundingClientRect().top <= parseFloat(getComputedStyle(root).top) + 0.5;
        if (s !== stuck) { stuck = s; root.classList.toggle('is-stuck', s); }
      }
      addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
      check();

      /* the section in view lights its link, and the row keeps it in sight */
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var a = map[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            Object.keys(map).forEach(function (k) { map[k].removeAttribute('aria-current'); });
            a.setAttribute('aria-current', 'true');
            if (list.scrollWidth > list.clientWidth) {
              list.scrollTo({ left: a.offsetLeft - list.clientWidth / 2 + a.clientWidth / 2, behavior: GG.reduced() ? 'auto' : 'smooth' });
            }
          } else if (a.getAttribute('aria-current')) {
            a.removeAttribute('aria-current');   /* past the section: no stale highlight */
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      targets.forEach(function (el) { io.observe(el); });
    }
  };

  /* ==========================================================================
     ABOUT THE COMPANY. On the silica page (data-variant="intro") it also
     carries the company's logo and facts, because the sand pour comes first.
     ========================================================================== */
  GG.sections.doverview = {
    render: function (root, C) {
      var c = company();
      if (!c || !c.overview) return false;
      var D = C.division, o = c.overview;
      var intro = root.getAttribute('data-variant') === 'intro';
      var body = GG.deep(o.body) || [];
      var points = GG.deep(o.points) || [];
      root.style.setProperty('--tint', tint(c.id));

      var head = h('div', { class: 'dov__head', 'data-reveal': '' },
        intro ? crumbs(c, D) : null,
        intro ? GG.logo({ label: GG.txt(c.logoLabel), name: GG.txt(c.name), cls: 'dov__logo' }) : null,
        h('p', { class: 'kicker', text: o.kicker || D.overviewKicker }),
        h('h2', { class: 'h2 dov__title', id: 'overview-title', text: o.title }));

      var side = h('div', { class: 'dov__side', 'data-reveal': '' },
        h('div', { class: 'dov__body', sample: o.body }, body.map(function (p) { return h('p', { text: p }); })),
        intro ? GG.factList(factRows(c, D), 'dh__facts', factSample(c)) : null,
        intro ? h('p', { class: 'dh__part mono' }, GG.mark({ cls: 'dh__mark' }), h('span', { text: D.partOf })) : null);

      root.appendChild(h('div', { class: 'container' },
        h('div', { class: 'dov' + (intro ? ' dov--intro' : '') }, head, side),
        points.length ? h('ul', { class: 'dov__points', role: 'list', 'data-reveal': '', sample: o.points },
          points.map(function (pt) {
            return h('li', { class: 'dov-point' },
              h('span', { class: 'dov-point__icon', 'aria-hidden': 'true' }, GG.icon(pt.icon)),
              h('h3', { class: 'dov-point__title', text: pt.title }),
              h('p', { class: 'dov-point__text', text: pt.text }));
          })) : null));
    }
  };

  /* ==========================================================================
     PRODUCTS
     ========================================================================== */
  /* how wide a card draws its photo, so the browser picks the right file */
  var SIZES = '(max-width: 560px) 80vw, (max-width: 900px) 46vw, (max-width: 1100px) 31vw, 290px';

  /* The stand-in picture: a heap of the material on pale stone, in the
     material's own colour, until the real photo exists */
  function rgb(c) { c = c.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(c.substr(i, 2), 16); }); }
  function mix(a, b, t) {
    var x = rgb(a), y = rgb(b);
    return '#' + x.map(function (v, i) {
      var m = Math.round(v + (y[i] - v) * t);
      return (m < 16 ? '0' : '') + m.toString(16);
    }).join('');
  }
  /* small seeded random, so every stand-in differs but never changes */
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  /* shared filters: grain inside each heap, a soft contact shadow */
  var DEFS = '<svg class="pr-defs" width="0" height="0" aria-hidden="true" focusable="false">' +
    '<filter id="pr-grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3.4 0 0 0 -2" result="dark"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -3.4 0 0 0 1.35" result="lite"/>' +
      '<feMerge result="m"><feMergeNode in="dark"/><feMergeNode in="lite"/></feMerge>' +
      '<feComposite in="m" in2="SourceGraphic" operator="in"/>' +
    '</filter>' +
    '<filter id="pr-soft" x="-30%" y="-300%" width="160%" height="700%"><feGaussianBlur stdDeviation="6"/></filter>' +
  '</svg>';

  function standIn(tone, n) {
    var r = rng(n * 7919 + 101);
    var cx = 194 + r() * 12, top = 76 + r() * 22, half = 98 + r() * 24, base = 246;
    var lit = mix(tone, '#FFFFFF', 0.42), shade = mix(tone, '#15222C', 0.32);
    var id = 'pr-ph' + n;
    var k = (base - top) * 0.32;
    var f = function (v) { return v.toFixed(1); };
    var heap = 'M' + f(cx - half) + ' ' + base +
      ' C' + f(cx - half * 0.6) + ' ' + f(base - k) + ' ' + f(cx - 16) + ' ' + f(top + 4) + ' ' + f(cx) + ' ' + f(top) +
      ' C' + f(cx + 16) + ' ' + f(top + 4) + ' ' + f(cx + half * 0.6) + ' ' + f(base - k) + ' ' + f(cx + half) + ' ' + base +
      ' C' + f(cx + half * 0.55) + ' ' + (base + 9) + ' ' + f(cx - half * 0.55) + ' ' + (base + 9) + ' ' + f(cx - half) + ' ' + base + 'Z';
    var grains = '';
    for (var i = 0; i < 18; i++) {
      var gx = cx + (r() * 2 - 1) * half * 1.45, gy = base - 4 + r() * 24, gr = 0.9 + r() * 1.6, pick = r();
      if (Math.abs(gx - cx) < half * 0.9 && gy < base + 7) continue;   /* not inside the heap */
      grains += '<circle cx="' + f(gx) + '" cy="' + f(gy) + '" r="' + f(gr) + '" fill="' + (pick > 0.5 ? tone : lit) + '"/>';
    }
    return '<svg class="pr-ph" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<linearGradient id="' + id + 'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F5F4"/><stop offset="1" stop-color="#E4E9E7"/></linearGradient>' +
        '<linearGradient id="' + id + 't" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DEE4E1"/><stop offset="1" stop-color="#D1D8D5"/></linearGradient>' +
        '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0.05" stop-color="' + lit + '"/><stop offset="0.5" stop-color="' + tone + '"/><stop offset="1" stop-color="' + shade + '"/></linearGradient>' +
      '</defs>' +
      '<rect width="400" height="198" fill="url(#' + id + 'w)"/>' +
      '<rect y="198" width="400" height="102" fill="url(#' + id + 't)"/>' +
      '<ellipse cx="' + f(cx + 26) + '" cy="' + (base + 3) + '" rx="' + f(half * 1.2) + '" ry="11" fill="#15222C" opacity=".16" filter="url(#pr-soft)"/>' +
      '<path d="' + heap + '" fill="url(#' + id + 'h)"/>' +
      '<path d="' + heap + '" fill="#000" filter="url(#pr-grain)" style="mix-blend-mode:soft-light"/>' +
      grains +
    '</svg>';
  }

  function media(img, n) {
    var v = img || {};
    var box = h('div', { class: 'pr-card__media' });
    if (v.placeholder) {
      box.className += ' is-stand-in';
      box.setAttribute('data-sample', '');
      box.innerHTML = standIn(v.tone || '#E6E9E7', n);
    } else if (v.src) {
      box.appendChild(GG.img(v, { sizes: SIZES }));
    }
    return box;
  }

  /* the harvest months, for farm produce */
  function season(months, D) {
    var on = {};
    months.forEach(function (m) { on[m] = true; });
    var names = D.months || [];
    var label = GG.txt(D.season) + ': ' + months.map(function (m) { return names[m - 1]; }).join(', ');
    return h('div', { class: 'season', role: 'img', 'aria-label': label },
      h('span', { class: 'season__label mono', 'aria-hidden': 'true', text: D.season }),
      h('span', { class: 'season__months', 'aria-hidden': 'true' },
        names.map(function (name, k) { return h('span', { class: 'season__m' + (on[k + 1] ? ' is-on' : '') }, name.charAt(0)); })));
  }

  function card(it, n, c, D, sample) {
    var name = GG.txt(it.name);
    return h('li', { class: 'pr-card', 'data-sample': sample ? '' : null },
      h('article', { class: 'pr-card__inner' },
        media(it.image, n),
        h('div', { class: 'pr-card__body' },
          h('h3', { class: 'pr-card__name', text: it.name }),
          h('p', { class: 'pr-card__text', text: it.text }),
          it.season ? season(it.season, D) : null,
          h('div', { class: 'pr-card__foot' },
            h('p', { class: 'pr-card__spec', text: it.spec || '' }),
            h('a', { class: 'link pr-card__link', href: '#contact', 'data-enquire': c.id, 'data-product': name },
              h('span', { text: D.enquire }), h('span', { class: 'sr-only', text: ': ' + name }), GG.icon('arrow-right'))))));
  }

  GG.sections.dproducts = {
    render: function (root, C) {
      var c = company();
      if (!c || !c.products) return false;
      var D = C.division, p = c.products;
      var items = GG.deep(p.items) || [];
      var base = indexOf(c) * 10;
      root.style.setProperty('--tint', tint(c.id));
      root.insertAdjacentHTML('afterbegin', DEFS);
      root.appendChild(h('div', { class: 'container' },
        GG.head({ kicker: p.kicker || D.productsKicker, title: p.title, lede: p.lede }, 'products-title'),
        h('ul', { class: 'pr-grid', role: 'list', 'data-reveal': '', style: { '--n': items.length } },
          items.map(function (it, i) { return card(it, base + i, c, D, GG.hasS(p.items)); }))));
    },

    /* "Enquire" fills the form at the end of the page with the product */
    init: function (root) {
      root.addEventListener('click', function (e) {
        var a = e.target.closest('[data-enquire]');
        if (a) document.dispatchEvent(new CustomEvent('gg:enquire', { detail: { company: a.getAttribute('data-enquire'), product: a.getAttribute('data-product') } }));
      });
    }
  };

  /* ==========================================================================
     HOW IT'S MADE
     ========================================================================== */
  GG.sections.dprocess = {
    render: function (root, C) {
      var c = company();
      if (!c || !c.process) return false;
      var D = C.division, steps = GG.deep(c.process.steps) || [];
      root.style.setProperty('--tint', tint(c.id));
      root.appendChild(h('div', { class: 'container' },
        GG.head({ kicker: D.processKicker, title: c.process.title, lede: c.process.lede }, 'process-title'),
        h('div', { class: 'dps', style: { '--n': steps.length } },
          h('span', { class: 'dps__line', 'aria-hidden': 'true' }, h('span', { class: 'dps__fill' })),
          h('ol', { class: 'dps__steps', role: 'list', sample: c.process.steps },
            steps.map(function (s, i) {
              return h('li', { class: 'dps__step', style: { '--i': i } },
                h('span', { class: 'dps__node', 'aria-hidden': 'true' }, GG.icon(s.icon)),
                h('p', { class: 'dps__num mono', text: GG.txt(C.process.stepLabel) + ' ' + pad(i + 1) }),
                h('h3', { class: 'dps__title', text: s.title }),
                h('p', { class: 'dps__text', text: s.text }));
            })))));
    },
    init: function (root) {
      var phone = matchMedia('(max-width: 800px)');
      GG.scrollLine({
        track: root.querySelector('.dps'),
        fill: root.querySelector('.dps__fill'),
        steps: Array.prototype.slice.call(root.querySelectorAll('.dps__step')),
        vertical: function () { return phone.matches; }
      });
      GG.pauseOffscreen([root]);
    }
  };

  /* ==========================================================================
     INDUSTRIES IT SUPPLIES
     ========================================================================== */
  GG.sections.dapps = {
    render: function (root, C) {
      var c = company();
      if (!c || !c.industries) return false;
      var D = C.division, ind = c.industries;
      root.style.setProperty('--tint', tint(c.id));
      root.appendChild(h('div', { class: 'container dapps' },
        h('div', { class: 'dapps__head', 'data-reveal': '' },
          h('p', { class: 'kicker', text: ind.kicker || D.industriesKicker }),
          h('h2', { class: 'h2', id: 'industries-title', text: ind.title }),
          ind.lede ? h('p', { class: 'lede', text: ind.lede }) : null),
        h('ul', { class: 'dapps__list', role: 'list', 'data-reveal': '' },
          ind.items.map(function (it, i) {
            return h('li', { class: 'dapps__item', style: { '--i': i } },
              h('span', { class: 'dapps__icon', 'aria-hidden': 'true' }, GG.icon(it.icon)),
              h('span', { class: 'dapps__label', text: it.label }));
          }))));
      GG.pauseOffscreen([root]);
    }
  };

  /* ==========================================================================
     THE GROUP'S OTHER COMPANIES
     ========================================================================== */
  GG.sections.dothers = {
    render: function (root, C) {
      var c = company();
      if (!c) return false;
      var O = C.division.others;
      var others = GG.companies().filter(function (x) { return x.id !== c.id; });
      root.appendChild(h('div', { class: 'container' },
        h('div', { class: 'dot__top' },
          GG.head({ kicker: O.kicker, title: O.title, lede: O.lede }, 'others-title', { cls: 'dot__head' }),
          h('a', { class: 'link dot__back', href: 'index.html' }, GG.icon('arrow-left'), h('span', { text: O.back }))),
        h('ul', { class: 'dot__list', role: 'list', 'data-reveal': '' },
          others.map(function (x) {
            return h('li', { class: 'dot-card', style: { '--tint': tint(x.id) } },
              h('a', { class: 'dot-card__link', href: x.page, 'aria-label': GG.txt(x.name) + ': ' + GG.txt(x.tagline) },
                h('span', { class: 'dot-card__media' }, GG.img(x.image, { alt: '', sizes: '(max-width: 640px) 80vw, (max-width: 1100px) 45vw, 290px' })),
                h('span', { class: 'dot-card__body', 'aria-hidden': 'true' },
                  h('span', { class: 'dot-card__name' }, h('span', { class: 'dot-card__dot' }), h('span', { text: x.name })),
                  h('span', { class: 'dot-card__tag', text: x.tagline }),
                  h('span', { class: 'dot-card__visit' }, h('span', { text: O.visit }), GG.icon('arrow-right')))));
          }))));
    }
  };
})();
