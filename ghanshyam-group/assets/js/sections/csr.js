/* RESPONSIBILITY (CSR): what the group puts back into the land, the water and
   the villages around its quarries. Each card leads with one number. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  GG.sections.csr = {
    render: function (root, C) {
      var d = C.csr;
      root.appendChild(h('div', { class: 'container' },
        GG.head(d, 'csr-title'),
        h('ul', { class: 'csr-grid', role: 'list', 'data-reveal': '' },
          d.items.map(function (raw) {
            var it = GG.deep(raw);
            return h('li', { class: 'csr-card', 'data-sample': GG.hasS(raw) ? '' : null },
              h('span', { class: 'csr-card__icon', 'aria-hidden': 'true' }, GG.icon(it.icon)),
              h('p', { class: 'csr-card__figure' },
                h('span', { class: 'csr-card__value', text: it.value }),
                h('span', { class: 'csr-card__unit', text: it.unit })),
              h('h3', { class: 'csr-card__title', text: it.title }),
              h('p', { class: 'csr-card__text', text: it.text }));
          }))));
    }
  };
})();
