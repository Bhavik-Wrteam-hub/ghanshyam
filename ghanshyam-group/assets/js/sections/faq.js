/* FAQ: the questions buyers ask, as an accordion that opens smoothly. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  GG.sections.faq = {
    render: function (root, C) {
      var f = C.faq, c = C.facts.contact;
      var tel = 'tel:' + GG.txt(c.phone).replace(/[^+\d]/g, '');
      root.appendChild(h('div', { class: 'container faq__grid' },
        h('div', { class: 'faq__aside' },
          GG.head(f, 'faq-title'),
          h('div', { class: 'faq__help', 'data-reveal': '' },
            h('a', { class: 'faq__phone', href: tel, sample: c.phone }, GG.icon('phone'), h('span', { text: c.phone })),
            h('a', { class: 'btn', href: C.nav.cta.href }, h('span', { text: C.nav.cta.label }), GG.icon('arrow-right', 'btn__arrow')))),
        h('div', { class: 'faq__list', 'data-reveal': '' },
          f.items.map(function (it) {
            return h('details', { class: 'qa' },
              h('summary', { class: 'qa__q' }, h('span', { text: it.q }), h('span', { class: 'qa__icon', 'aria-hidden': 'true' })),
              h('div', { class: 'qa__a' }, h('p', { text: it.a })));
          }))));
    },

    init: function (root) {
      root.querySelectorAll('.qa').forEach(function (d) {
        var summary = d.querySelector('summary');
        var body = d.querySelector('.qa__a');
        var anim = null;
        summary.addEventListener('click', function (e) {
          if (GG.reduced() || !body.animate) return;
          e.preventDefault();
          if (anim) anim.cancel();
          if (!d.open) {
            d.open = true;
            var hgt = body.scrollHeight;
            d.classList.add('is-opening');
            anim = body.animate([{ height: '0px', opacity: 0 }, { height: hgt + 'px', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
            anim.onfinish = function () { anim = null; d.classList.remove('is-opening'); };
          } else {
            d.classList.add('is-closing');
            anim = body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
            anim.onfinish = function () { anim = null; d.open = false; d.classList.remove('is-closing'); };
          }
        });
      });
    }
  };
})();
