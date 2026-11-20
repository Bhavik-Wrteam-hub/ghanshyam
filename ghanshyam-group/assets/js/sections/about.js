/* ABOUT: the group's story, the founder's line, and the four numbers. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  GG.sections.about = {
    render: function (root, C) {
      var a = C.about;
      var q = GG.deep(a.quote) || {};

      var dust = h('div', { class: 'about__dust', 'aria-hidden': 'true' },
        [0, 1, 2, 3, 4, 5].map(function (i) { return h('span', { style: { '--i': i } }); }));

      root.appendChild(h('div', { class: 'container about__grid' },
        h('div', { class: 'about__copy' },
          GG.head(a, 'about-title'),
          h('div', { class: 'about__body', 'data-reveal': '' }, a.body.map(function (p) { return h('p', { text: p }); })),
          h('figure', { class: 'about__quote', 'data-reveal': '', sample: a.quote },
            h('blockquote', null, h('p', { text: q.text })),
            h('figcaption', null,
              GG.mark({ cls: 'about__quote-mark' }),
              h('span', null, h('span', { class: 'about__quote-name' }, q.name), h('span', { class: 'about__quote-role' }, q.role))))),
        h('div', { class: 'about__media', 'data-reveal': '' },
          h('div', { class: 'about__frame' }, GG.img(a.image, { width: 900, height: 1100, cls: 'about__img', sizes: '(max-width: 960px) 100vw, 620px' }), dust))));

      /* the numbers row is optional (the group's numbers live in GROUP STRENGTH) */
      if (a.metrics) root.appendChild(h('div', { class: 'container' },
        h('dl', { class: 'about__metrics', 'data-reveal': '' },
          a.metrics.map(function (m) {
            var v = GG.fmt(m.value);
            return h('div', { class: 'metric' },
              h('dt', { class: 'metric__label', text: m.label }),
              h('dd', { class: 'metric__value' },
                h('span', { class: 'metric__num', 'data-to': v.text, 'data-suffix': m.suffix || '', 'data-sample': v.sample ? '' : null }, GG.num(v.text) + (m.suffix || ''))));
          }))));

      /* mission and vision */
      var pu = a.purpose;
      if (pu) {
        root.appendChild(h('div', { class: 'container' },
          h('div', { class: 'purpose', 'data-reveal': '' },
            h('h3', { class: 'purpose__title kicker', text: pu.title }),
            pu.items.map(function (it, i) {
              return h('div', { class: 'purpose__item', 'data-sample': GG.hasS(it.text) ? '' : null },
                h('p', { class: 'purpose__label mono' },
                  h('span', { class: 'purpose__num', text: String(i + 1).padStart(2, '0') }),
                  h('span', { text: it.label })),
                h('p', { class: 'purpose__text', text: it.text }));
            }))));
      }
    },

    init: function (root) {
      var nums = root.querySelectorAll('.metric__num');
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          var el = e.target;
          setTimeout(function () { GG.countUp(el, el.getAttribute('data-to'), { suffix: el.getAttribute('data-suffix') }); }, 250);
        });
      }, { threshold: 0.6 });
      nums.forEach(function (n) { io.observe(n); });
      GG.pauseOffscreen([root]);
    },

    enhance: function (root, C, M) {
      if (GG.reduced() || !M.scroll || !M.animate) return;
      var img = root.querySelector('.about__img');
      var frame = root.querySelector('.about__frame');
      if (!img || !frame) return;
      M.scroll(
        M.animate(img, { transform: ['translateY(-5%) scale(1.12)', 'translateY(5%) scale(1.12)'] }, { ease: 'linear' }),
        { target: frame, offset: ['start end', 'end start'] }
      );
    }
  };
})();
