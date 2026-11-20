/* INFRASTRUCTURE: the plant plan with numbered points, a matching list, and
   four numbers. Choosing a point on the plan highlights it in the list. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  GG.sections.infrastructure = {
    render: function (root, C) {
      var d = C.infrastructure;
      var spots = GG.deep(d.hotspots) || [];
      var stats = GG.deep(d.stats) || [];
      var sSample = GG.hasS(d.hotspots) ? '' : null;

      var map = h('div', { class: 'plant' },
        GG.img(d.image, { width: 1200, height: 800, cls: 'plant__img' }),
        spots.map(function (s, i) {
          return h('button', {
            class: 'spot', type: 'button', style: { left: s.x + '%', top: s.y + '%' },
            'aria-label': (i + 1) + '. ' + s.title, 'aria-controls': 'spot-item-' + i, 'aria-pressed': i === 0 ? 'true' : 'false', 'data-i': i
          }, h('span', { 'aria-hidden': 'true' }, String(i + 1)));
        }),
        h('div', { class: 'plant__pop', 'aria-hidden': 'true' }, h('p', { class: 'plant__pop-title' }), h('p', { class: 'plant__pop-text' })));

      var list = h('ol', { class: 'spot-list', role: 'list', 'data-sample': sSample },
        spots.map(function (s, i) {
          return h('li', { class: 'spot-item' + (i === 0 ? ' is-active' : ''), id: 'spot-item-' + i },
            h('button', { class: 'spot-item__btn', type: 'button', 'data-i': i },
              h('span', { class: 'spot-item__num mono' }, String(i + 1).padStart(2, '0')),
              h('span', { class: 'spot-item__title' }, s.title)),
            h('p', { class: 'spot-item__text' }, s.text));
        }));

      root.appendChild(h('div', { class: 'container' },
        GG.head(d, 'infrastructure-title'),
        h('div', { class: 'infra__grid', 'data-reveal': '' },
          h('div', { class: 'infra__map' }, map, h('p', { class: 'infra__hint mono', text: d.mapHint })),
          list),
        h('dl', { class: 'infra__stats', 'data-reveal': '', 'data-sample': GG.hasS(d.stats) ? '' : null },
          stats.map(function (s) {
            return h('div', { class: 'infra__stat' },
              h('dt', null, s.label),
              h('dd', null, h('span', { class: 'infra__stat-num' }, s.value), h('span', { class: 'infra__stat-unit' }, s.unit)));
          }))));
      root._spots = spots;
    },

    init: function (root) {
      var spots = root._spots;
      var btns = Array.prototype.slice.call(root.querySelectorAll('.spot'));
      var items = Array.prototype.slice.call(root.querySelectorAll('.spot-item'));
      var pop = root.querySelector('.plant__pop');
      var popT = pop.querySelector('.plant__pop-title');
      var popX = pop.querySelector('.plant__pop-text');
      var cur = 0;

      function show(i, fromMap) {
        cur = i;
        btns.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
        items.forEach(function (it, k) { it.classList.toggle('is-active', k === i); });
        var s = spots[i];
        popT.textContent = s.title;
        popX.textContent = s.text;
        pop.style.left = s.x + '%';
        pop.style.top = s.y + '%';
        pop.classList.toggle('is-left', s.x > 62);
        pop.classList.toggle('is-below', s.y < 30);
        pop.classList.remove('is-on');
        void pop.offsetWidth;
        pop.classList.add('is-on');
        if (fromMap && matchMedia('(max-width: 900px)').matches) {
          items[i].scrollIntoView({ behavior: GG.reduced() ? 'auto' : 'smooth', block: 'nearest' });
        }
      }
      btns.forEach(function (b, i) { b.addEventListener('click', function () { show(i, true); }); });
      root.querySelectorAll('.spot-item__btn').forEach(function (b, i) { b.addEventListener('click', function () { show(i, false); }); });
      show(0, false);
      GG.pauseOffscreen([root]);
    }
  };
})();
