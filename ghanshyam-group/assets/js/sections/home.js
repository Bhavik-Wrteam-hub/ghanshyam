/* ==========================================================================
   THE HOMEPAGE'S OWN SECTIONS (index.html): the group, not one company.
     ghero       the first screen: the group's line beside five tall photo
                 panels, one per business, like layers in a quarry wall
     businesses  one stacking card per company, each leading to its page
     strength    who does what, quarry to customer, and the group in numbers
     values      vision, mission and values
     presence    the group's sites in Kutch, and where its materials go
   Their words are in site-content.js (groupHero, businesses, strength,
   values, presence) and in THE FIVE BUSINESSES.
   ========================================================================== */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h, pad = GG.pad;

  function tint(id) {
    if (id === 'group') return 'var(--text-primary)';
    if (id === 'port') return 'var(--text-secondary)';
    return 'var(--tint-' + id + ')';
  }

  /* The short product list of a business: its own, or the silica grades */
  function keyProducts(co, C) {
    if (co.keyProducts) return { list: GG.deep(co.keyProducts), src: co.keyProducts };
    var grades = (C.silica && C.silica.grades) || [];
    return { list: grades.map(function (g) { return GG.deep(g).name; }), src: grades };
  }
  /* A business's facts, then the year it began */
  function companyFacts(co, C, cls) {
    var rows = (GG.deep(co.facts) || []).concat([[GG.txt(C.division.since), GG.txt(co.since)]]);
    return GG.factList(rows, cls, GG.hasS(co.facts) || GG.fmt(co.since).sample ? S_MARK : null);
  }
  var S_MARK = { __sample: true, value: '' };

  /* ==========================================================================
     GROUP HERO
     ========================================================================== */
  GG.sections.ghero = {
    render: function (root, C) {
      var g = C.groupHero, cos = GG.companies();
      var titleText = GG.fmt(g.title);
      var title = h('h1', { class: 'gh__title', id: 'ghero-title' });
      GG.split(title, titleText.text, 5);
      if (titleText.sample) title.setAttribute('data-sample', '');

      var copy = h('div', { class: 'gh__copy' },
        h('p', { class: 'kicker gh__kicker', text: g.kicker }),
        title,
        h('p', { class: 'gh__text', text: g.text }),
        h('div', { class: 'btn-row gh__ctas' },
          h('a', { class: 'btn', href: g.ctaPrimary.href }, h('span', { text: g.ctaPrimary.label }), GG.icon('arrow-right', 'btn__arrow')),
          h('a', { class: 'btn btn--ghost', href: g.ctaSecondary.href, text: g.ctaSecondary.label })),
        h('ul', { class: 'gh__proof mono', role: 'list' },
          g.proof.map(function (p) { return h('li', { text: p }); })));

      var layers = h('ul', { class: 'gh__layers', role: 'list', 'aria-label': GG.txt(g.layersLabel) },
        cos.map(function (co, i) {
          return h('li', { class: 'gh-layer', style: { '--tint': tint(co.id), '--i': i } },
            h('a', { class: 'gh-layer__link', href: co.page, 'aria-label': GG.txt(co.name) + ': ' + GG.txt(co.tagline) },
              h('span', { class: 'gh-layer__media' },
                GG.img(co.image, { alt: '', eager: true, sizes: '(max-width: 999px) 100vw, 104vh' })),
              h('span', { class: 'gh-layer__shade', 'aria-hidden': 'true' }),
              h('span', { class: 'gh-layer__index mono', 'aria-hidden': 'true' }, pad(i + 1)),
              h('span', { class: 'gh-layer__name', 'aria-hidden': 'true', text: co.short }),
              h('span', { class: 'gh-layer__more', 'aria-hidden': 'true' },
                h('span', { class: 'gh-layer__company', text: co.name }),
                h('span', { class: 'gh-layer__tag', text: co.tagline }),
                h('span', { class: 'gh-layer__visit' }, h('span', { text: g.visit }), GG.icon('arrow-right')))));
        }));

      root.appendChild(h('div', { class: 'gh container' }, copy, layers));
    },

    init: function (root) {
      var wrap = root.querySelector('.gh__layers');
      var layers = Array.prototype.slice.call(root.querySelectorAll('.gh-layer'));
      var wide = matchMedia('(min-width: 1000px) and (pointer: fine)');
      var cur = -1, timer = null, handsOn = false;

      function set(i) {
        if (i === cur) return;
        cur = i;
        layers.forEach(function (l, k) { l.classList.toggle('is-open', k === i); });
        wrap.classList.toggle('has-open', i > -1);
      }
      function takeOver() { handsOn = true; clearTimeout(timer); }

      layers.forEach(function (l, i) {
        l.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && wide.matches) { takeOver(); set(i); } });
        l.addEventListener('focusin', function () { takeOver(); if (wide.matches) set(i); });
      });
      wrap.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') set(-1); });
      wrap.addEventListener('focusout', function (e) { if (!wrap.contains(e.relatedTarget)) set(-1); });
      wide.addEventListener('change', function () { if (!wide.matches) set(-1); });
      /* "reduce motion" switched on mid-visit: stop the pass, show the rest state */
      GG.reducedMQ.addEventListener('change', function (e) {
        if (e.matches) { takeOver(); set(-1); root.classList.add('is-in', 'is-settled'); }
      });

      /* The entrance: the layers rise like core samples drawn from the ground.
         Then one slow pass opens each business in turn, once, and rests. */
      function enter() {
        root.classList.add('is-in');
        setTimeout(function () { root.classList.add('is-settled'); }, 2200);
        if (GG.reduced() || !wide.matches) return;
        var i = -1;
        (function step() {
          if (handsOn || GG.reduced()) return;
          i++;
          if (i >= layers.length) { set(-1); return; }
          set(i);
          timer = setTimeout(step, 2600);
        })();
      }
      if (GG.reduced()) { root.classList.add('is-in', 'is-settled'); return; }
      /* wait for the page itself to fade in (main.js marks it ready) */
      requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(enter, 120); }); });
      GG.pauseOffscreen([root]);
    },

    /* Leaving the first screen, the layers drift up at slightly different speeds */
    enhance: function (root, C, M) {
      if (GG.reduced() || !M.scroll || !M.animate || !matchMedia('(min-width: 1000px)').matches) return;
      root.querySelectorAll('.gh-layer__link').forEach(function (el, i) {
        var lift = [26, 52, 38, 64, 44][i % 5];
        M.scroll(M.animate(el, { transform: ['translateY(0px)', 'translateY(-' + lift + 'px)'] }, { ease: 'linear' }),
          { target: root, offset: ['start start', 'end start'] });
      });
    }
  };

  /* ==========================================================================
     OUR BUSINESSES: the five companies as stacking cards
     ========================================================================== */
  GG.sections.businesses = {
    render: function (root, C) {
      var b = C.businesses, cos = GG.companies(), n = cos.length;

      var cards = cos.map(function (co, i) {
        var kp = keyProducts(co, C);
        var logo = GG.logo({ label: GG.txt(co.logoLabel), name: GG.txt(co.name), cls: 'co-logo' });
        return h('li', { class: 'co-card', style: { '--tint': tint(co.id), '--i': i }, id: 'company-' + co.id },
          h('article', { class: 'co-card__inner', 'aria-labelledby': 'company-' + co.id + '-name' },
            h('div', { class: 'co-card__body' },
              h('p', { class: 'co-card__index mono' },
                h('span', null, pad(i + 1) + ' / ' + pad(n)),
                co.flagship ? h('span', { class: 'co-card__badge', text: b.flagship }) : null),
              h('h3', { class: 'co-card__name', id: 'company-' + co.id + '-name' }, logo),
              h('p', { class: 'co-card__tagline', text: co.tagline }),
              h('p', { class: 'co-card__text', text: co.summary }),
              h('div', { class: 'co-card__makes' },
                h('p', { class: 'co-card__plabel mono', text: b.productsLabel }),
                h('ul', { class: 'co-card__products', role: 'list', sample: kp.src },
                  kp.list.map(function (p) { return h('li', { text: p }); }))),
              companyFacts(co, C, 'co-facts'),
              h('div', { class: 'co-card__actions' },
                h('a', { class: 'btn btn--small', href: co.page },
                  h('span', { text: GG.txt(b.visit, { name: GG.txt(co.short) }) }), GG.icon('arrow-right', 'btn__arrow')),
                h('a', { class: 'link', href: '#contact', 'data-enquire': co.id },
                  h('span', { text: b.enquire }), h('span', { class: 'sr-only', text: ': ' + GG.txt(co.name) })))),
            h('a', { class: 'co-card__media', href: co.page, tabindex: '-1', 'aria-hidden': 'true' },
              GG.img(co.image, { alt: '', sizes: '(max-width: 900px) 92vw, 600px' })),
            h('span', { class: 'co-card__veil', 'aria-hidden': 'true' })));
      });

      root.appendChild(h('div', { class: 'container' },
        GG.head(b, 'businesses-title'),
        h('ol', { class: 'co-stack', role: 'list' }, cards)));
    },

    init: function (root) {
      root.addEventListener('click', function (e) {
        var a = e.target.closest('[data-enquire]');
        if (a) document.dispatchEvent(new CustomEvent('gg:enquire', { detail: { company: a.getAttribute('data-enquire') } }));
      });
    },

    /* As each card is covered by the next, it settles back a little */
    enhance: function (root, C, M) {
      if (GG.reduced() || !M.scroll || !M.animate || !matchMedia('(min-width: 900px)').matches) return;
      var cards = Array.prototype.slice.call(root.querySelectorAll('.co-card'));
      cards.forEach(function (card, i) {
        var next = cards[i + 1];
        if (!next) return;
        /* Fade with a veil in the page colour, not with opacity: a
           see-through card would show the card stacked under it. */
        M.scroll(M.animate(card.querySelector('.co-card__inner'), { transform: ['scale(1)', 'scale(0.94)'] }, { ease: 'linear' }),
          { target: next, offset: ['start end', 'start 25%'] });
        M.scroll(M.animate(card.querySelector('.co-card__veil'), { opacity: [0, 0.45] }, { ease: 'linear' }),
          { target: next, offset: ['start end', 'start 25%'] });
      });
    }
  };

  /* ==========================================================================
     GROUP STRENGTH: the chain from quarry to customer, and the numbers
     ========================================================================== */
  GG.sections.strength = {
    render: function (root, C) {
      var s = C.strength;
      var stats = GG.deep(s.stats) || [];

      var chain = h('div', { class: 'chain' },
        h('span', { class: 'chain__line', 'aria-hidden': 'true' }, h('span', { class: 'chain__fill' })),
        h('ol', { class: 'chain__steps', role: 'list' },
          s.chain.map(function (st, i) {
            return h('li', { class: 'chain__step', style: { '--i': i } },
              h('span', { class: 'chain__node', 'aria-hidden': 'true' }, GG.icon(st.icon)),
              h('h3', { class: 'chain__title', text: st.title }),
              h('p', { class: 'chain__text', text: st.text }),
              h('p', { class: 'chain__by' },
                h('span', { class: 'sr-only', text: GG.txt(s.chainLabel) + ': ' }),
                st.by.map(function (id, k) {
                  var co = GG.company(id);
                  return h('span', { class: 'chain__co', style: { '--tint': tint(id) } },
                    h('span', { class: 'chain__dot', 'aria-hidden': 'true' }),
                    h('span', { text: co ? co.short : id }),
                    k < st.by.length - 1 ? h('span', { class: 'sr-only' }, ',') : null);
                })));
          })));

      var numbers = h('div', { class: 'gstats-wrap' },
        h('h3', { class: 'gstats__title mono', text: s.statsLabel }),
        h('dl', { class: 'gstats', 'data-reveal': '', sample: s.stats },
          stats.map(function (st) {
            var v = GG.fmt(st.value);
            return h('div', { class: 'gstat' },
              h('dt', { class: 'gstat__label', text: st.label }),
              h('dd', { class: 'gstat__value' },
                h('span', { class: 'gstat__num', 'data-to': v.text, 'data-suffix': st.suffix || '' }, GG.num(v.text) + (st.suffix || ''))));
          })));

      root.appendChild(h('div', { class: 'container' },
        GG.head(s, 'strength-title', { cls: 'strength__head' }),
        chain,
        numbers));
    },

    init: function (root) {
      var phone = matchMedia('(max-width: 900px)');
      GG.scrollLine({
        track: root.querySelector('.chain'),
        fill: root.querySelector('.chain__fill'),
        steps: Array.prototype.slice.call(root.querySelectorAll('.chain__step')),
        vertical: function () { return phone.matches; }
      });
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          var el = e.target;
          setTimeout(function () { GG.countUp(el, el.getAttribute('data-to'), { suffix: el.getAttribute('data-suffix') }); }, 200);
        });
      }, { threshold: 0.6 });
      root.querySelectorAll('.gstat__num').forEach(function (el) { io.observe(el); });
      GG.pauseOffscreen([root]);
    }
  };

  /* ==========================================================================
     VISION, MISSION AND VALUES
     ========================================================================== */
  GG.sections.values = {
    render: function (root, C) {
      var v = C.values;
      var items = GG.deep(v.items) || [];
      root.appendChild(h('div', { class: 'container vals' },
        h('div', { class: 'vals__top', 'data-reveal': '' },
          h('p', { class: 'kicker vals__kicker', text: v.kicker }),
          h('div', { class: 'vals__vision' },
            h('p', { class: 'vals__label mono', text: v.vision.label }),
            h('h2', { class: 'vals__statement', id: 'values-title', text: v.vision.text })),
          h('div', { class: 'vals__mission' },
            h('p', { class: 'vals__label mono', text: v.mission.label }),
            h('p', { class: 'vals__mission-text', text: v.mission.text }))),
        h('h3', { class: 'vals__title mono', text: v.valuesTitle }),
        h('ul', { class: 'vals__list', role: 'list', 'data-reveal': '', sample: v.items },
          items.map(function (it, i) {
            return h('li', { class: 'val' },
              h('span', { class: 'val__top', 'aria-hidden': 'true' },
                h('span', { class: 'val__icon' }, GG.icon(it.icon)),
                h('span', { class: 'val__num mono', text: pad(i + 1) })),
              h('h4', { class: 'val__title', text: it.title }),
              h('p', { class: 'val__text', text: it.text }));
          }))));
    }
  };

  /* ==========================================================================
     WHERE WE WORK: the map of the group's sites, and its markets
     ========================================================================== */
  GG.sections.presence = {
    render: function (root, C) {
      var p = C.presence;
      var sites = GG.deep(p.sites) || [];

      function list(title, items, note, cls) {
        return h('div', { class: 'pmk ' + (cls || '') },
          h('h3', { class: 'pmk__title mono', text: title }),
          h('ul', { class: 'pmk__chips', role: 'list', sample: items },
            (GG.deep(items) || []).map(function (t) { return h('li', { class: 'chip-tag', text: t }); })),
          note ? h('p', { class: 'pmk__note', text: note }) : null);
      }

      var map = h('figure', { class: 'pmap', 'data-reveal': '' },
        h('div', { class: 'pmap__frame' },
          GG.img(p.map, { width: 800, height: 600, cls: 'pmap__img' }),
          sites.map(function (s, i) {
            return h('span', {
              class: 'pmap__pin' + (s.company === 'port' ? ' is-port' : '') + (s.company === 'group' ? ' is-home' : ''),
              style: { left: s.x + '%', top: s.y + '%', '--tint': tint(s.company), '--i': i }, 'aria-hidden': 'true'
            }, String(i + 1));
          })),
        h('figcaption', { class: 'pmap__legend' },
          h('ol', { class: 'pmap__list', role: 'list', sample: p.sites },
            sites.map(function (s, i) {
              return h('li', { style: { '--tint': tint(s.company) } },
                h('span', { class: 'pmap__key', 'aria-hidden': 'true' }, String(i + 1)),
                h('span', { class: 'pmap__site' }, h('strong', { text: s.label }), h('span', { text: s.place })));
            }))));

      var markets = h('div', { class: 'presence__markets', 'data-reveal': '' },
        list(p.indiaTitle, p.states, null),
        list(p.exportTitle, p.countries, p.exportNote),
        h('div', { class: 'pmk' },
          h('h3', { class: 'pmk__title mono', text: p.industriesTitle }),
          h('ul', { class: 'pmk__inds', role: 'list' },
            p.industries.map(function (it) {
              return h('li', null, h('span', { class: 'pmk__icon', 'aria-hidden': 'true' }, GG.icon(it.icon)), h('span', { text: it.label }));
            }))));

      root.appendChild(h('div', { class: 'container' },
        GG.head(p, 'presence-title'),
        h('div', { class: 'presence__grid' }, map, markets)));
      GG.pauseOffscreen([root]);
    }
  };
})();
