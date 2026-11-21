/* ==========================================================================
   THE HOMEPAGE'S OWN SECTIONS (index.html): the group, not one company.
     businesses  the Strata: five stacked layers, one per company. One layer
                 is open at a time, with the company's film, products and facts.
     range       every company's products, one tab per company
     apps        the industries each company supplies, one tab per company
     strength    who does what, quarry to customer, and the group in numbers
     values      vision, mission and values
     presence    the group's sites in Kutch, and where its materials go
   The first screen (the five branch films) is film.js. Words are in site-content.js
   (businesses, range, apps, strength, values, presence) and in THE FIVE
   BUSINESSES, so nothing is written twice.
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
  var S_MARK = { __sample: true, value: '' };
  function companyFacts(co, C, cls) {
    var rows = (GG.deep(co.facts) || []).concat([[GG.txt(C.division.since), GG.txt(co.since)]]);
    return GG.factList(rows, cls, GG.hasS(co.facts) || GG.fmt(co.since).sample ? S_MARK : null);
  }
  /* A business's full product list: its own, or the five silica grades */
  function productsOf(co, C) {
    if (co.products) return { items: GG.deep(co.products.items) || [], src: co.products.items };
    var grades = (C.silica && C.silica.grades) || [];
    return {
      items: grades.map(function (g) { var d = GG.deep(g); return { name: d.name, spec: d.code, text: d.short, image: d.image }; }),
      src: grades
    };
  }
  /* Where a company's own page lists its products (silica calls them grades) */
  function productsHref(co) { return co.page + (co.id === 'silica' ? '#silica' : '#products'); }
  /* Enquire links anywhere on the homepage pre-fill the enquiry form */
  function wireEnquire(root) {
    root.addEventListener('click', function (e) {
      var a = e.target.closest('[data-enquire]');
      if (a) document.dispatchEvent(new CustomEvent('gg:enquire', { detail: { company: a.getAttribute('data-enquire'), product: a.getAttribute('data-product') || null } }));
    });
  }
  /* A row of company tabs (Products, Applications) */
  function companyTabs(prefix, label, panelId) {
    return h('div', { class: 'ctabs', role: 'tablist', 'aria-label': label },
      GG.companies().map(function (co, i) {
        return h('button', {
          class: 'ctab', type: 'button', role: 'tab', id: prefix + '-tab-' + co.id,
          'aria-selected': i === 0 ? 'true' : 'false', 'aria-controls': panelId, tabindex: i === 0 ? '0' : '-1',
          style: { '--tint': tint(co.id) }
        }, h('span', { class: 'ctab__dot', 'aria-hidden': 'true' }), h('span', { text: co.short }));
      }));
  }
  /* Swap a tab panel's content with a short, calm cross-fade */
  function swap(panel, next, tabId) {
    panel.setAttribute('aria-labelledby', tabId);
    var M = GG.motion();
    if (!M || !M.animate || GG.reduced()) { panel.replaceChildren(next); return; }
    M.animate(panel, { opacity: [1, 0] }, { duration: 0.16, ease: [0.65, 0, 0.35, 1] }).then(function () {
      panel.replaceChildren(next);
      M.animate(panel, { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0)'] }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    });
  }

  /* ==========================================================================
     OUR BUSINESSES: the Strata. Five layers, like a quarry wall.
     ========================================================================== */
  GG.sections.businesses = {
    render: function (root, C) {
      var b = C.businesses, cos = GG.companies();

      var layers = cos.map(function (co, i) {
        var kp = keyProducts(co, C);
        var pid = 'stratum-' + co.id + '-panel', bid = 'stratum-' + co.id + '-btn';
        var film = co.film ? GG.deep(co.film) : null;
        var open = i === 0;
        return h('li', { class: 'stratum' + (open ? ' is-open' : ''), id: 'company-' + co.id, style: { '--tint': tint(co.id), '--layer': 'var(--stratum-' + (i + 1) + ')', '--i': i } },
          h('h3', { class: 'stratum__head' },
            h('button', { class: 'stratum__btn', type: 'button', id: bid, 'aria-expanded': open ? 'true' : 'false', 'aria-controls': pid },
              h('span', { class: 'stratum__index mono', text: pad(i + 1) }),
              h('span', { class: 'stratum__name', text: co.name }),
              h('span', { class: 'stratum__tag', text: co.tagline }),
              co.flagship ? h('span', { class: 'stratum__badge mono', text: b.flagship }) : null,
              h('span', { class: 'stratum__plus', 'aria-hidden': 'true' }))),
          h('div', { class: 'stratum__panel', id: pid, role: 'region', 'aria-labelledby': bid, inert: open ? null : true },
            h('div', { class: 'stratum__inner on-dark' },
              h('div', { class: 'stratum__body' },
                GG.logo({ label: GG.txt(co.logoLabel), name: GG.txt(co.name), layout: 'compact', cls: 'stratum__logo' }),
                h('p', { class: 'stratum__text', text: co.summary }),
                h('div', { class: 'stratum__makes' },
                  h('p', { class: 'stratum__plabel mono', text: b.productsLabel }),
                  h('ul', { class: 'stratum__products', role: 'list', sample: kp.src },
                    kp.list.map(function (p) { return h('li', { text: p }); }))),
                companyFacts(co, C, 'stratum__facts'),
                h('div', { class: 'stratum__actions' },
                  h('a', { class: 'btn btn--small', href: co.page },
                    h('span', { text: GG.txt(b.visit, { name: GG.txt(co.short) }) }), GG.icon('arrow-right', 'btn__arrow')),
                  h('a', { class: 'link', href: '#contact', 'data-enquire': co.id },
                    h('span', { text: b.enquire }), h('span', { class: 'sr-only', text: ': ' + GG.txt(co.name) })))),
              h('a', { class: 'stratum__media', href: co.page, tabindex: '-1', 'aria-hidden': 'true' },
                film ? GG.loop(film, { cls: 'stratum__video' }) : GG.img(co.image, { alt: '', sizes: '(max-width: 900px) 92vw, 640px' })))));
      });

      root.appendChild(h('div', { class: 'container' },
        h('div', { class: 'strata-head' }, GG.head(b, 'businesses-title'), h('span', { class: 'strata-rule', 'aria-hidden': 'true' })),
        h('ol', { class: 'strata', role: 'list' }, layers)));
    },

    init: function (root) {
      var layers = Array.prototype.slice.call(root.querySelectorAll('.stratum'));
      /* the layer just opened comes fully into view, under the menu bar. The open
         layer above it is about to collapse, so its height is taken off first. */
      function bringIntoView(i, above) {
        var bar = document.querySelector('.site-header');
        var barH = bar ? bar.offsetHeight : 0;
        var layer = layers[i], inner = layer.querySelector('.stratum__inner');
        var top = layer.getBoundingClientRect().top - above;
        var height = layer.querySelector('.stratum__btn').offsetHeight + inner.scrollHeight;
        if (top >= barH + 8 && top + height <= window.innerHeight - 8) return;
        window.scrollTo({ top: window.scrollY + top - barH - 12, behavior: GG.reduced() ? 'auto' : 'smooth' });
      }
      function open(i, focus, scroll) {
        var was = layers.findIndex(function (l) { return l.classList.contains('is-open'); });
        var above = was > -1 && was < i ? layers[was].querySelector('.stratum__inner').offsetHeight : 0;
        layers.forEach(function (l, k) {
          var on = k === i;
          l.classList.toggle('is-open', on);
          l.querySelector('.stratum__btn').setAttribute('aria-expanded', on ? 'true' : 'false');
          var panel = l.querySelector('.stratum__panel');
          if (on) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
        });
        if (focus) layers[i].querySelector('.stratum__btn').focus();
        if (scroll) bringIntoView(i, above);
        GG.refreshLoops(root);   /* the open layer's film plays, the others rest */
      }
      layers.forEach(function (l, i) {
        var btn = l.querySelector('.stratum__btn');
        btn.addEventListener('click', function () { if (!l.classList.contains('is-open')) open(i, false, true); });
        btn.addEventListener('keydown', function (e) {
          var n = layers.length, j = null;
          if (e.key === 'ArrowDown') j = (i + 1) % n;
          else if (e.key === 'ArrowUp') j = (i - 1 + n) % n;
          else if (e.key === 'Home') j = 0;
          else if (e.key === 'End') j = n - 1;
          if (j !== null) { e.preventDefault(); layers[j].querySelector('.stratum__btn').focus(); }
        });
      });
      /* a link to #company-kaolin (the menu, the footer) opens that layer */
      function fromHash() {
        var m = /^#company-(\w+)$/.exec(location.hash);
        if (!m) return;
        layers.forEach(function (l, i) { if (l.id === 'company-' + m[1]) open(i, false); });
      }
      addEventListener('hashchange', fromHash);
      fromHash();
      wireEnquire(root);
      GG.playLoops(root);
    }
  };

  /* ==========================================================================
     PRODUCT RANGE: every company's products, one tab per company
     ========================================================================== */
  function rangePanel(co, C) {
    var r = C.range, p = productsOf(co, C);
    return h('div', { class: 'range__set', style: { '--tint': tint(co.id) } },
      h('div', { class: 'range__top' },
        h('p', { class: 'range__co' },
          h('span', { class: 'range__name', text: co.name }),
          h('span', { class: 'range__tag', text: co.tagline })),
        h('a', { class: 'link range__all', href: productsHref(co) },
          h('span', { text: GG.txt(r.viewAll, { name: GG.txt(co.short) }) }), GG.icon('arrow-right'))),
      h('ul', { class: 'range__grid', role: 'list', sample: p.src },
        p.items.map(function (it) {
          var name = GG.txt(it.name);
          return h('li', { class: 'rcard' },
            h('a', { class: 'rcard__media', href: productsHref(co), tabindex: '-1', 'aria-hidden': 'true' },
              it.image && it.image.src ? GG.img(it.image, { alt: '', sizes: '(max-width: 600px) 78vw, (max-width: 1100px) 34vw, 300px' }) : null),
            h('div', { class: 'rcard__body' },
              it.spec ? h('p', { class: 'rcard__spec mono', text: it.spec }) : null,
              h('h3', { class: 'rcard__name', text: it.name }),
              h('p', { class: 'rcard__text', text: it.text }),
              h('a', { class: 'link rcard__link', href: '#contact', 'data-enquire': co.id, 'data-product': name },
                h('span', { text: r.enquire }), h('span', { class: 'sr-only', text: ': ' + name }), GG.icon('arrow-right'))));
        })));
  }

  GG.sections.range = {
    render: function (root, C) {
      var r = C.range, cos = GG.companies();
      root.appendChild(h('div', { class: 'container' },
        h('div', { class: 'range__head' },
          GG.head(r, 'range-title'),
          companyTabs('range', GG.txt(r.tabsLabel), 'range-panel')),
        h('div', { class: 'range__panel', id: 'range-panel', role: 'tabpanel', 'aria-labelledby': 'range-tab-' + cos[0].id, tabindex: '0' },
          rangePanel(cos[0], C))));
    },
    init: function (root, C) {
      var cos = GG.companies(), panel = root.querySelector('.range__panel');
      GG.tabs(Array.prototype.slice.call(root.querySelectorAll('.ctab')), function (i) {
        swap(panel, rangePanel(cos[i], C), 'range-tab-' + cos[i].id);
      });
      wireEnquire(root);
    }
  };

  /* ==========================================================================
     APPLICATIONS: the industries each company supplies
     ========================================================================== */
  function appsPanel(co) {
    var ind = co.industries || { items: [] };
    return h('div', { class: 'apps__set', style: { '--tint': tint(co.id) } },
      h('figure', { class: 'apps__media' },
        GG.img(co.image, { alt: '', sizes: '(max-width: 900px) 92vw, 420px' }),
        h('figcaption', { class: 'apps__caption mono' },
          h('span', { class: 'apps__dot', 'aria-hidden': 'true' }), h('span', { text: co.name }))),
      h('div', { class: 'apps__body' },
        h('h3', { class: 'apps__title', text: ind.title || co.name }),
        h('ul', { class: 'apps__grid', role: 'list' },
          ind.items.map(function (it) {
            return h('li', { class: 'app' },
              h('span', { class: 'app__icon', 'aria-hidden': 'true' }, GG.icon(it.icon)),
              h('span', { class: 'app__label', text: it.label }));
          })),
        h('a', { class: 'link apps__link', href: co.page + '#industries' },
          h('span', { text: co.name }), GG.icon('arrow-right'))));
  }

  GG.sections.apps = {
    render: function (root, C) {
      var a = C.apps, cos = GG.companies();
      root.appendChild(h('div', { class: 'container' },
        h('div', { class: 'apps__head' },
          GG.head(a, 'apps-title'),
          companyTabs('apps', GG.txt(a.tabsLabel), 'apps-panel')),
        h('div', { class: 'apps__panel', id: 'apps-panel', role: 'tabpanel', 'aria-labelledby': 'apps-tab-' + cos[0].id, tabindex: '0' },
          appsPanel(cos[0]))));
    },
    init: function (root) {
      var cos = GG.companies(), panel = root.querySelector('.apps__panel');
      GG.tabs(Array.prototype.slice.call(root.querySelectorAll('.ctab')), function (i) {
        swap(panel, appsPanel(cos[i]), 'apps-tab-' + cos[i].id);
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
