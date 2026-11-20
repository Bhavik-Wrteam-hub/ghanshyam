/* OUR PRODUCTS: the strongest products of each company, grouped by company.
   Chips narrow the list to one company. Silica products take their name,
   code and photo from the silica grades and open that grade's spec sheet;
   the others pre-fill the sample form. A product without a photo yet shows
   a drawn stand-in in the colour of its material (placeholder() in
   site-content.js), in the same 4:3 frame, so the real photo drops in
   without moving anything. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  /* how wide a card draws its photo, so the browser picks the right file */
  var SIZES = '(max-width: 560px) 80vw, (max-width: 900px) 46vw, (max-width: 1100px) 31vw, 300px';

  /* ---- The stand-in picture: a heap of the material on pale stone ---------- */
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

  /* shared filters: grain inside each heap (black and white specks, blended
     soft-light so they shade the material's own colour), a soft contact shadow */
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

  /* ---- Data: silica products borrow from their grade ----------------------- */
  function resolve(prod, grades) {
    var p = GG.deep(prod), g = p.grade ? grades[p.grade] : null;
    if (g) {
      p.name = p.name || g.name;
      p.code = p.code || g.code;
      p.text = p.text || g.short;
      p.image = p.image || g.image;
    }
    return { data: p, sample: GG.hasS(prod) || !!(g && g.sample) };
  }

  /* ---- Pieces -------------------------------------------------------------- */
  function media(p, n) {
    var img = p.image || {};
    var box = h('div', { class: 'pr-card__media' });
    if (img.placeholder) {
      box.className += ' is-stand-in';
      box.setAttribute('data-sample', '');
      box.innerHTML = standIn(img.tone || '#E6E9E7', n);
    } else if (img.src) {
      box.appendChild(GG.img(img, { sizes: SIZES }));
    }
    return box;
  }

  function card(r, g, L) {
    var p = r.data;
    var link = p.grade
      ? h('a', { class: 'link pr-card__link', href: '#grade-panel', 'data-show-grade': p.grade },
          h('span', { text: L.specsLabel }), h('span', { class: 'sr-only', text: ': ' + p.name }), GG.icon('arrow-right'))
      : h('a', { class: 'link pr-card__link', href: '#contact', 'data-grade': g.id, 'data-product': p.name },
          h('span', { text: L.enquireLabel }), h('span', { class: 'sr-only', text: ': ' + p.name }), GG.icon('arrow-right'));
    return h('li', { class: 'pr-card', 'data-sample': r.sample ? '' : null },
      h('article', { class: 'pr-card__inner' },
        media(p, r.n),
        h('div', { class: 'pr-card__body' },
          p.code ? h('p', { class: 'pr-card__code mono', text: p.code }) : null,
          h('h4', { class: 'pr-card__name', text: p.name }),
          h('p', { class: 'pr-card__text', text: p.text }),
          h('div', { class: 'pr-card__foot' },
            h('p', { class: 'pr-card__spec', text: p.spec || '' }),
            link))));
  }

  function block(x, i, L) {
    var g = x.g, id = g.id;
    var head = h('header', { class: 'pr-group__head', 'data-reveal': '' },
      h('p', { class: 'pr-group__company mono' },
        h('span', { class: 'pr-group__index', text: String(i + 1).padStart(2, '0') }),
        h('span', { text: g.company }),
        g.flagship ? h('span', { class: 'pr-group__badge', text: L.flagshipLabel }) : null),
      h('h3', { class: 'pr-group__name', id: 'products-' + id + '-title', text: g.name }),
      h('p', { class: 'pr-group__text', text: g.text }),
      g.link ? h('a', { class: 'link pr-group__link', href: g.link.href }, h('span', { text: g.link.label }), GG.icon('arrow-right')) : null);
    return h('section', {
      class: 'pr-group', id: 'products-' + id, 'data-group': id,
      'aria-labelledby': 'products-' + id + '-title', style: { '--tint': 'var(--tint-' + id + ')' }
    },
      head,
      h('ul', { class: 'pr-grid', role: 'list', 'data-reveal': '' }, x.products.map(function (r) { return card(r, g, L); })));
  }

  function chip(id, label, count, tinted) {
    return h('button', {
      type: 'button', class: 'pr-chip', 'data-filter': id, 'aria-pressed': id === 'all' ? 'true' : 'false',
      'aria-controls': 'products-list', style: tinted ? { '--tint': 'var(--tint-' + id + ')' } : null
    },
      tinted ? h('span', { class: 'pr-chip__dot', 'aria-hidden': 'true' }) : null,
      h('span', { text: label }),
      h('span', { class: 'pr-chip__count', 'aria-hidden': 'true', text: String(count) }));
  }

  GG.sections.products = {
    render: function (root, C) {
      var d = C.products, grades = {};
      ((C.silica && C.silica.grades) || []).forEach(function (raw) {
        var g = GG.deep(raw);
        g.sample = GG.hasS(raw);
        grades[g.id] = g;
      });
      var n = 0, total = 0;
      var groups = d.groups.map(function (g) {
        var list = g.products.map(function (prod) { var r = resolve(prod, grades); r.n = n++; return r; });
        total += list.length;
        return { g: g, products: list };
      });

      var filter = h('div', { class: 'pr-filter-wrap' },
        h('div', { class: 'pr-filter', role: 'group', 'aria-label': GG.txt(d.filterLabel) },
          [chip('all', GG.txt(d.allLabel), total, false)].concat(groups.map(function (x) {
            return chip(x.g.id, GG.txt(x.g.name), x.products.length, true);
          }))));

      root.insertAdjacentHTML('afterbegin', DEFS);
      root.appendChild(h('div', { class: 'container' },
        GG.head(d, 'products-title'),
        filter,
        h('p', { class: 'sr-only', role: 'status', 'aria-live': 'polite' }),
        h('div', { class: 'pr-groups', id: 'products-list' }, groups.map(function (x, i) { return block(x, i, d); })),
        d.more ? h('p', { class: 'pr-more', 'data-reveal': '' },
          h('span', { text: d.more.text }),
          h('a', { class: 'link', href: d.more.link.href }, h('span', { text: d.more.link.label }), GG.icon('arrow-right'))) : null));
    },

    init: function (root, C) {
      var d = C.products;
      var chips = Array.prototype.slice.call(root.querySelectorAll('.pr-chip'));
      var groups = Array.prototype.slice.call(root.querySelectorAll('.pr-group'));
      var wrap = root.querySelector('.pr-filter-wrap');
      var list = root.querySelector('.pr-groups');
      var live = root.querySelector('[role="status"]');
      var current = 'all';

      function nameOf(id) {
        for (var i = 0; i < d.groups.length; i++) if (d.groups[i].id === id) return GG.txt(d.groups[i].name);
        return '';
      }

      function select(id) {
        if (id === current) return;
        current = id;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === id ? 'true' : 'false'); });
        var cards = [];
        groups.forEach(function (g) {
          var on = id === 'all' || g.getAttribute('data-group') === id;
          g.hidden = !on;
          if (!on) return;
          /* skip the scroll entrance: these arrive with their own animation */
          g.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in', 'settled'); });
          cards = cards.concat(Array.prototype.slice.call(g.querySelectorAll('.pr-card')));
        });
        live.textContent = id === 'all'
          ? GG.txt(d.showingAll, { count: cards.length })
          : GG.txt(d.showingOne, { count: cards.length, company: nameOf(id) });

        /* The list got shorter. If its start is now above the sticky chips, jump
           straight back to it, just under where the chips stick. Measure from
           the chips' sticky position, not their current box: when the list
           shrinks, the chips can leave the screen with it. A jump, not a long
           smooth scroll through content that has just changed; the cards'
           own entrance carries the motion. */
        var cs = getComputedStyle(wrap);
        if (cs.position === 'sticky') {
          var under = parseFloat(cs.top) + wrap.offsetHeight + 16;
          var top = list.getBoundingClientRect().top;
          if (top < under) window.scrollTo({ top: window.pageYOffset + top - under, behavior: 'instant' });
        }

        var M = GG.motion();
        if (M && M.animate && !GG.reduced()) {
          M.animate(cards, { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0)'] },
            { duration: 0.5, delay: M.stagger ? M.stagger(0.05) : 0, ease: [0.22, 1, 0.36, 1] });
        }
      }

      chips.forEach(function (c) {
        c.addEventListener('click', function () { select(c.getAttribute('data-filter')); });
      });

      /* silica cards open their grade in the Silica Sand section; the rest pre-fill the form */
      root.addEventListener('click', function (e) {
        var s = e.target.closest('[data-show-grade]');
        if (s) {
          document.dispatchEvent(new CustomEvent('gg:show-grade', { detail: { id: s.getAttribute('data-show-grade') } }));
          return;
        }
        var a = e.target.closest('[data-grade]');
        if (a) document.dispatchEvent(new CustomEvent('gg:grade', { detail: { id: a.getAttribute('data-grade'), product: a.getAttribute('data-product') } }));
      });
    }
  };
})();
