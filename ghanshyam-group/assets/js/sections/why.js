/* WHY US: the short answer for a buyer in a hurry. Four reasons, each one a
   card that links to the section further down that proves it. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  GG.sections.why = {
    render: function (root, C) {
      var d = C.why;
      root.appendChild(h('div', { class: 'container why' },
        GG.head(d, 'why-title', { cls: 'why__head' }),
        h('ol', { class: 'why__list', role: 'list', 'data-reveal': '' },
          d.items.map(function (it, i) {
            return h('li', { class: 'why-card', 'data-sample': GG.hasS(it) ? '' : null },
              h('span', { class: 'why-card__top', 'aria-hidden': 'true' },
                h('span', { class: 'why-card__icon' }, GG.icon(it.icon)),
                h('span', { class: 'why-card__num mono', text: String(i + 1).padStart(2, '0') })),
              h('h3', { class: 'why-card__title', text: it.title }),
              h('p', { class: 'why-card__text', text: it.text }),
              it.link ? h('a', { class: 'link why-card__link', href: it.link.href },
                h('span', { text: it.link.label }), GG.icon('arrow-right')) : null);
          }))));
    }
  };
})();
