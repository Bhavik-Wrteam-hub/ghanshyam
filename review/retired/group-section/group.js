/* THE GROUP: Silica Sand leads as the flagship, then the other four companies
   arrive as stacking cards, each with its own grain colour in the mark. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  /* A branch logo: the shared header, with this company's label */
  function lockup(name, label) {
    return GG.logo({ label: label, name: name, cls: 'co-logo' });
  }
  function facts(list, sample) {
    return h('dl', { class: 'co-facts', 'data-sample': sample ? '' : null },
      list.map(function (f) { return h('div', null, h('dt', { class: 'mono' }, f[0]), h('dd', null, f[1])); }));
  }

  GG.sections.group = {
    render: function (root, C) {
      var g = C.group, fl = g.flagship;
      var flFacts = GG.deep(fl.facts);

      var flagship = h('article', { class: 'flagship', 'data-reveal': '', style: { '--tint': 'var(--tint-silica)' } },
        h('div', { class: 'flagship__media' }, GG.img(fl.image, { width: 1000, height: 750, sizes: '(max-width: 900px) 92vw, 610px' })),
        h('div', { class: 'flagship__body' },
          h('p', { class: 'flagship__badge mono', text: fl.badge }),
          h('h3', { class: 'flagship__name' }, lockup(GG.txt(fl.name), GG.txt(fl.logoLabel))),
          h('p', { class: 'flagship__text', text: fl.text }),
          facts(flFacts, GG.hasS(fl.facts)),
          h('a', { class: 'link', href: fl.link.href }, h('span', { text: fl.link.label }), GG.icon('arrow-right'))));

      var cards = g.companies.map(function (co, i) {
        var d = GG.deep(co);
        return h('li', { class: 'co-card', style: { '--tint': 'var(--tint-' + co.id + ')', '--i': i }, id: 'company-' + co.id },
          h('article', { class: 'co-card__inner', 'aria-labelledby': 'company-' + co.id + '-name' },
            h('div', { class: 'co-card__body' },
              h('p', { class: 'co-card__index mono' }, String(i + 2).padStart(2, '0') + ' / ' + String(g.companies.length + 1).padStart(2, '0')),
              h('h3', { class: 'co-card__name', id: 'company-' + co.id + '-name' }, lockup(d.name, d.logoLabel)),
              h('p', { class: 'co-card__tagline', text: co.tagline }),
              h('p', { class: 'co-card__text', text: co.text }),
              h('ul', { class: 'co-card__products', role: 'list', 'data-sample': GG.hasS(co.products) ? '' : null },
                d.products.map(function (p) { return h('li', null, p); })),
              facts(d.facts, GG.hasS(co.facts)),
              h('a', { class: 'link co-card__link', href: '#contact', 'data-grade': co.id }, h('span', { text: co.enquire }), GG.icon('arrow-right'))),
            h('div', { class: 'co-card__media' }, GG.img(co.image, { width: 800, height: 600, sizes: '(max-width: 900px) 92vw, 770px' })),
            h('span', { class: 'co-card__veil', 'aria-hidden': 'true' })));
      });

      root.appendChild(h('div', { class: 'container' },
        GG.head(g, 'group-title'),
        flagship,
        h('ol', { class: 'co-stack', role: 'list' }, cards)));
    },

    init: function (root) {
      root.addEventListener('click', function (e) {
        var a = e.target.closest('[data-grade]');
        if (a) document.dispatchEvent(new CustomEvent('gg:grade', { detail: { id: a.getAttribute('data-grade') } }));
      });
    },

    /* As each card is covered by the next, it settles back a little */
    enhance: function (root, C, M) {
      if (GG.reduced() || !M.scroll || !M.animate) return;
      var cards = Array.prototype.slice.call(root.querySelectorAll('.co-card'));
      var mq = matchMedia('(min-width: 900px)');
      if (!mq.matches) return;
      cards.forEach(function (card, i) {
        var next = cards[i + 1];
        if (!next) return;
        var inner = card.querySelector('.co-card__inner');
        var veil = card.querySelector('.co-card__veil');
        /* Fade with a veil in the page colour, not with opacity: a
           see-through card would show the card stacked under it. */
        M.scroll(M.animate(inner, { transform: ['scale(1)', 'scale(0.94)'] }, { ease: 'linear' }),
          { target: next, offset: ['start end', 'start 25%'] });
        M.scroll(M.animate(veil, { opacity: [0, 0.45] }, { ease: 'linear' }),
          { target: next, offset: ['start end', 'start 25%'] });
      });
    }
  };
})();
