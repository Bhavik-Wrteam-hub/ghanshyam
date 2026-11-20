/* FAQ: the questions buyers ask, as an accordion that opens smoothly.
   The silica page uses the faq block; on another company's page the section
   carries data-source="company" and reads that company's own faq. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  GG.sections.faq = {
    render: function (root, C) {
      var co = GG.page.company;
      var own = root.getAttribute('data-source') === 'company';
      var f = own ? co && co.faq : C.faq;
      if (!f) return false;
      var D = C.division || {};
      var head = own ? { kicker: f.kicker || D.faqKicker, title: f.title, lede: f.lede || D.faqLede } : f;
      var c = C.facts.contact;
      var tel = 'tel:' + GG.txt(c.phone).replace(/[^+\d]/g, '');
      var cta = co ? co.cta.label : C.nav.cta.label;
      root.appendChild(h('div', { class: 'container faq__grid' },
        h('div', { class: 'faq__aside' },
          GG.head(head, 'faq-title'),
          h('div', { class: 'faq__help', 'data-reveal': '' },
            h('a', { class: 'faq__phone', href: tel, sample: c.phone }, GG.icon('phone'), h('span', { text: c.phone })),
            h('a', { class: 'btn', href: '#contact' }, h('span', { text: cta }), GG.icon('arrow-right', 'btn__arrow')))),
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
          /* a click mid-way reverses the movement from where it is now */
          var opening = !d.open || d.classList.contains('is-closing');
          var from = d.open ? body.getBoundingClientRect().height : 0;
          if (anim) { anim.onfinish = null; anim.cancel(); anim = null; }
          if (opening) {
            d.classList.remove('is-closing');
            d.open = true;
            anim = body.animate([{ height: from + 'px', opacity: from ? 1 : 0 }, { height: body.scrollHeight + 'px', opacity: 1 }],
              { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
            anim.onfinish = function () { anim = null; };
          } else {
            d.classList.add('is-closing');
            anim = body.animate([{ height: from + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
              { duration: 300, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
            anim.onfinish = function () { anim = null; d.open = false; d.classList.remove('is-closing'); };
          }
        });
      });
    }
  };
})();
