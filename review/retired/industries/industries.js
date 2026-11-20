/* INDUSTRIES: a bento grid. Glass leads with the large tile. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  GG.sections.industries = {
    render: function (root, C) {
      var d = C.industries;
      var tiles = d.items.map(function (it, i) {
        var size = i === 0 ? 'tile--hero' : (i >= d.items.length - 2 ? 'tile--wide' : '');
        return h('li', { class: 'tile ' + size },
          i === 0 ? h('div', { class: 'tile__glass', 'aria-hidden': 'true' }, h('span'), h('span'), h('span'), h('i')) : null,
          h('span', { class: 'tile__icon' }, GG.icon(it.icon)),
          h('div', { class: 'tile__body' },
            h('h3', { class: 'tile__title', text: it.title }),
            h('p', { class: 'tile__text', text: it.text }),
            h('p', { class: 'tile__grade' }, h('span', { class: 'mono', text: d.gradeLabel }), h('span', { text: it.grade }))));
      });
      root.appendChild(h('div', { class: 'container' },
        GG.head(d, 'industries-title'),
        h('ul', { class: 'bento', role: 'list', 'data-reveal': '' }, tiles)));
    },
    init: function (root) { GG.pauseOffscreen([root]); }
  };
})();
