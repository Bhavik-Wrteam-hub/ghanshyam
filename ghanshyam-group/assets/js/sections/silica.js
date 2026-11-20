/* SILICA SAND: the flagship showcase. Grade cards (tabs) open a detail panel
   with the grain picture (with a loupe), full specs and the sieve scale. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  /* Sieve scale: grain size in mm on a log axis, with standard mesh marks */
  var MIN = 0.005, MAX = 2;
  var MESH = [[20, 0.85], [40, 0.425], [60, 0.25], [100, 0.15], [200, 0.075], [400, 0.037]];
  function pos(mm) {
    var a = Math.log10(MIN), b = Math.log10(MAX);
    return GG.clamp((Math.log10(mm) - a) / (b - a), 0, 1);
  }
  function fmtMm(mm) {
    if (mm < 0.1) return Math.round(mm * 1000) + ' µm';
    return (Math.round(mm * 100) / 100).toFixed(2) + ' mm';
  }

  function specList(rows) {
    return h('dl', { class: 'spec' }, rows.map(function (r) {
      return h('div', { class: 'spec__row' }, h('dt', null, r[0]), h('dd', null, r[1]));
    }));
  }
  function chips(items) {
    return h('ul', { class: 'chips', role: 'list' }, items.map(function (t) { return h('li', { class: 'chip-tag' }, t); }));
  }

  function panelContent(g, L, sample) {
    var U = GG.content().ui || {};
    var to = ' ' + GG.txt(U.to || 'to') + ' ';
    var a = pos(g.sizeMin), b = pos(g.sizeMax);
    var scale = h('div', { class: 'sieve', role: 'img', 'aria-label': GG.txt(L.sizeScale) + ': ' + fmtMm(g.sizeMin) + to + fmtMm(g.sizeMax) },
      h('div', { class: 'sieve__head' },
        h('span', { class: 'mono' }, GG.txt(L.size)),
        h('span', { class: 'sieve__val' }, fmtMm(g.sizeMin) + to + fmtMm(g.sizeMax))),
      h('div', { class: 'sieve__track', 'aria-hidden': 'true' },
        h('span', { class: 'sieve__range', style: { '--a': a.toFixed(4), '--b': b.toFixed(4) } }),
        MESH.map(function (m) {
          return h('span', { class: 'sieve__tick', style: { '--x': pos(m[1]).toFixed(4) } }, h('span', null, m[0]));
        })),
      h('div', { class: 'sieve__axis mono', 'aria-hidden': 'true' }, h('span', { text: U.sieveFine }), h('span', { text: U.sieveMesh }), h('span', { text: U.sieveCoarse })));

    var body = h('div', { class: 'grade-panel__body' },
      h('div', { class: 'grade-panel__title' },
        h('p', { class: 'mono grade-panel__code' }, g.code),
        h('h3', { class: 'h3' }, g.name),
        h('p', { class: 'muted' }, g.short)),
      scale,
      h('div', { class: 'grade-panel__specs' },
        h('div', null, h('h4', { class: 'spec__title mono', text: L.chemistry }), specList(g.chemistry)),
        h('div', null, h('h4', { class: 'spec__title mono', text: L.physical }), specList(g.physical))),
      h('div', { class: 'grade-panel__lists' },
        h('div', null, h('h4', { class: 'spec__title mono', text: L.uses }), chips(g.uses)),
        h('div', null, h('h4', { class: 'spec__title mono', text: L.packing }), chips(g.packing))),
      h('p', { class: 'grade-panel__note', text: L.typical }),
      h('div', { class: 'btn-row' },
        h('a', { class: 'btn', href: '#contact', 'data-grade': g.id }, h('span', { text: L.cta }), GG.icon('arrow-right', 'btn__arrow')),
        h('a', { class: 'link', href: '#contact', 'data-grade': g.id, 'data-sheet': '' }, h('span', { text: L.sheet }))));

    var visual = h('div', { class: 'grade-panel__visual' },
      h('div', { class: 'loupe-frame' },
        GG.img(g.image, { cls: 'grade-panel__img', sizes: '(max-width: 960px) 92vw, 590px' }),
        h('span', { class: 'loupe', 'aria-hidden': 'true' }),
        h('span', { class: 'grade-panel__stamp mono', 'aria-hidden': 'true' }, g.code)));

    var wrap = h('div', { class: 'grade-panel__inner' }, visual, body);
    if (sample) wrap.setAttribute('data-sample', '');
    return wrap;
  }

  GG.sections.silica = {
    render: function (root, C) {
      var s = C.silica;
      var grades = s.grades.map(function (g) { return { data: GG.deep(g), sample: GG.hasS(g) }; });

      var tabs = h('div', { class: 'grade-cards', role: 'tablist', 'aria-label': GG.txt(s.pickerLabel) },
        grades.map(function (g, i) {
          var d = g.data;
          return h('button', {
            class: 'grade-card', type: 'button', role: 'tab', id: 'grade-tab-' + d.id,
            'aria-selected': i === 0 ? 'true' : 'false', 'aria-controls': 'grade-panel', tabindex: i === 0 ? '0' : '-1',
            'data-index': i, 'data-sample': g.sample ? '' : null
          },
            h('span', { class: 'grade-card__inner' },
              h('span', { class: 'grade-card__img' }, GG.img(d.image, { alt: '', sizes: '240px' })),
              h('span', { class: 'grade-card__code mono' }, d.code),
              h('span', { class: 'grade-card__name' }, d.name),
              h('span', { class: 'grade-card__short' }, d.short),
              h('span', { class: 'grade-card__bar', 'aria-hidden': 'true' },
                h('span', { style: { '--a': pos(d.sizeMin).toFixed(4), '--b': pos(d.sizeMax).toFixed(4) } }))));
        }));

      var panel = h('div', { class: 'grade-panel', id: 'grade-panel', role: 'tabpanel', 'aria-labelledby': 'grade-tab-' + grades[0].data.id, tabindex: '0' },
        panelContent(grades[0].data, s.labels, grades[0].sample));

      root.appendChild(h('div', { class: 'container' },
        GG.head(s, 'silica-title', { cls: 'silica__head' }),
        h('p', { class: 'silica__picker-label mono', 'data-reveal': '' }, h('span', { text: s.pickerLabel })),
        h('div', { 'data-reveal': '', class: 'grade-cards-wrap' }, tabs),
        panel));
      root._grades = grades;
    },

    init: function (root, C) {
      var s = C.silica;
      var grades = root._grades;
      var tabs = Array.prototype.slice.call(root.querySelectorAll('.grade-card'));
      var panel = root.querySelector('#grade-panel');
      var current = 0;

      function select(i, focus) {
        if (i === current) { if (focus) tabs[i].focus(); return; }
        tabs.forEach(function (t, j) {
          t.setAttribute('aria-selected', j === i ? 'true' : 'false');
          t.setAttribute('tabindex', j === i ? '0' : '-1');
        });
        if (focus) tabs[i].focus();
        current = i;
        panel.setAttribute('aria-labelledby', tabs[i].id);
        var next = panelContent(grades[i].data, s.labels, grades[i].sample);
        var old = panel.firstChild;
        var M = GG.motion();
        if (M && M.animate && !GG.reduced() && old) {
          M.animate(old, { opacity: [1, 0], transform: ['translateY(0)', 'translateY(-8px)'] }, { duration: 0.22, ease: [0.65, 0, 0.35, 1] })
            .then(function () {
              panel.replaceChildren(next);
              wireLoupe(next);
              M.animate(next.children, { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0)'] }, { duration: 0.55, delay: M.stagger ? M.stagger(0.08) : 0, ease: [0.22, 1, 0.36, 1] });
            });
        } else {
          panel.replaceChildren(next);
          wireLoupe(next);
        }
      }

      /* product cards elsewhere on the page open a grade's spec sheet here */
      document.addEventListener('gg:show-grade', function (e) {
        var id = e.detail && e.detail.id;
        for (var i = 0; i < grades.length; i++) if (grades[i].data.id === id) { select(i, false); break; }
      });

      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var k = e.key, n = tabs.length, j = null;
          if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % n;
          else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + n) % n;
          else if (k === 'Home') j = 0;
          else if (k === 'End') j = n - 1;
          if (j !== null) { e.preventDefault(); select(j, true); }
        });
        /* gentle tilt toward the pointer */
        var inner = t.querySelector('.grade-card__inner');
        t.addEventListener('pointermove', function (e) {
          if (GG.reduced() || e.pointerType !== 'mouse') return;
          var r = t.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          inner.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
          inner.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg');
        });
        t.addEventListener('pointerleave', function () {
          inner.style.setProperty('--rx', '0deg');
          inner.style.setProperty('--ry', '0deg');
        });
      });

      /* "Request this grade" pre-selects the grade in the sample form */
      root.addEventListener('click', function (e) {
        var a = e.target.closest('[data-grade]');
        if (!a) return;
        document.dispatchEvent(new CustomEvent('gg:grade', { detail: { id: a.getAttribute('data-grade'), sheet: a.hasAttribute('data-sheet') } }));
      });

      function wireLoupe(scope) {
        var frame = scope.querySelector('.loupe-frame');
        if (!frame) return;
        var img = frame.querySelector('img');
        var lens = frame.querySelector('.loupe');
        var R = 80, z = 2.4; /* lens radius (it is 160px wide) and magnification */
        /* the largest file (src), so the magnified view stays sharp */
        lens.style.backgroundImage = "url('" + img.getAttribute('src') + "')";
        frame.addEventListener('pointermove', function (e) {
          if (e.pointerType !== 'mouse') return;
          var r = frame.getBoundingClientRect();
          var x = e.clientX - r.left, y = e.clientY - r.top;
          /* where object-fit: cover really draws the photo, so the lens
             shows exactly the grains under the pointer at any frame shape */
          var nw = img.naturalWidth || +img.getAttribute('width');
          var nh = img.naturalHeight || +img.getAttribute('height');
          var s = Math.max(r.width / nw, r.height / nh), dw = nw * s, dh = nh * s;
          var pos = getComputedStyle(img).objectPosition.split(' ');
          var px = parseFloat(pos[0]), py = parseFloat(pos[1]);
          var ox = (r.width - dw) * (isNaN(px) ? 0.5 : px / 100);
          var oy = (r.height - dh) * (isNaN(py) ? 0.5 : py / 100);
          lens.style.transform = 'translate(' + (x - R) + 'px,' + (y - R) + 'px)';
          lens.style.backgroundSize = (dw * z) + 'px ' + (dh * z) + 'px';
          lens.style.backgroundPosition = (R - (x - ox) * z) + 'px ' + (R - (y - oy) * z) + 'px';
          frame.classList.add('is-looking');
        });
        frame.addEventListener('pointerleave', function () { frame.classList.remove('is-looking'); });
      }
      wireLoupe(panel);
      GG.pauseOffscreen([root]);
    }
  };
})();
