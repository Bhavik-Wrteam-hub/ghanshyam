/* TESTIMONIALS: one quote at a time on a dark band. Buttons, dots, arrow keys and swipe. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  /* Clients under the quotes: a slow running strip, a real logo when there is
     one, else a named slot with its icon. The strip is the list twice in a row
     and slides by exactly one list, so the loop has no seam; the second copy is
     hidden from screen readers and the keyboard. Short lists are repeated until
     each copy is long enough to fill a wide screen. Hover or focus pauses it,
     and "reduce motion" shows one still, wrapped list (testimonials.css). */
  var CLIENTS_MIN = 10;
  function clients(cl) {
    if (!cl) return null;
    var list = GG.deep(cl.items) || [];
    if (!list.length) return null;
    var reps = Math.ceil(CLIENTS_MIN / list.length);
    function item(c, hidden) {
      return h('li', { class: 'clients__item' + (c.logo ? ' has-logo' : ' is-stand-in'), 'aria-hidden': hidden ? 'true' : null },
        c.logo
          ? h('img', { src: c.logo, alt: hidden ? '' : c.name, loading: 'lazy', decoding: 'async' })
          : [
              c.icon ? h('span', { class: 'clients__icon', 'aria-hidden': 'true' }, GG.icon(c.icon)) : null,
              h('span', { class: 'clients__name' },
                h('span', { text: c.name }),
                c.place ? h('span', { class: 'clients__place', text: c.place }) : null)
            ]);
    }
    function copy(clone) {
      var items = [];
      for (var r = 0; r < reps; r++) list.forEach(function (c) { items.push(item(c, clone || r > 0)); });
      return h('ul', {
        class: 'clients__list', role: 'list',
        'aria-hidden': clone ? 'true' : null, inert: clone ? true : null,
        'data-sample': !clone && GG.hasS(cl.items) ? '' : null
      }, items);
    }
    return h('div', { class: 'clients', 'data-reveal': '' },
      h('p', { class: 'clients__title mono', text: cl.title }),
      h('div', { class: 'clients__run' },
        h('div', { class: 'clients__track', style: { '--n': list.length * reps } }, copy(false), copy(true))));
  }

  GG.sections.testimonials = {
    render: function (root, C) {
      var t = C.testimonials;
      var of = ' ' + GG.txt((C.ui || {}).of || 'of') + ' ';
      /* the homepage shows every quote; a company's page only its own */
      var page = GG.page.company;
      var items = (GG.deep(t.items) || []).filter(function (q) { return !page || q.company === page.id; });
      if (!items.length) return false;
      var sample = GG.hasS(t.items) ? '' : null;
      var grains = h('div', { class: 'testi__grains', 'aria-hidden': 'true' },
        Array.from({ length: 14 }, function (_, i) { return h('span', { style: { '--i': i } }); }));

      root.appendChild(grains);
      root.appendChild(h('div', { class: 'container testi' },
        GG.head(t, 'testimonials-title', { cls: 'testi__head' }),
        h('div', { class: 'testi__stage', 'aria-roledescription': 'carousel', 'aria-label': GG.txt(t.title) },
          items.map(function (q, i) {
            return h('figure', {
              class: 'testi__slide' + (i === 0 ? ' is-active' : ''), 'aria-roledescription': 'slide',
              'aria-label': (i + 1) + of + items.length, 'aria-hidden': i === 0 ? 'false' : 'true', 'data-sample': sample
            },
              h('blockquote', null, h('p', null, q.quote)),
              h('figcaption', null,
                h('span', { class: 'testi__role' }, q.role), h('span', { class: 'testi__org' }, q.org),
                !page && GG.company(q.company) ? h('span', { class: 'testi__co mono', style: { '--tint': 'var(--tint-' + q.company + ')' } },
                  h('span', { class: 'testi__co-dot', 'aria-hidden': 'true' }), h('span', { text: GG.company(q.company).name })) : null));
          })),
        items.length < 2 ? null : h('div', { class: 'testi__controls' },
          h('button', { class: 'testi__btn', type: 'button', 'aria-label': GG.txt(t.prevLabel), 'data-dir': '-1' }, GG.icon('arrow-left')),
          h('div', { class: 'testi__dots' }, items.map(function (_, i) {
            return h('button', { class: 'testi__dot', type: 'button', 'aria-label': (i + 1) + of + items.length, 'aria-current': i === 0 ? 'true' : null, 'data-i': i });
          })),
          h('button', { class: 'testi__btn', type: 'button', 'aria-label': GG.txt(t.nextLabel), 'data-dir': '1' }, GG.icon('arrow-right')),
          h('span', { class: 'testi__count mono', 'aria-live': 'polite' }, '01 / ' + String(items.length).padStart(2, '0'))),
        clients(t.clients)));
    },

    init: function (root) {
      var slides = Array.prototype.slice.call(root.querySelectorAll('.testi__slide'));
      var dots = Array.prototype.slice.call(root.querySelectorAll('.testi__dot'));
      var count = root.querySelector('.testi__count');
      var i = 0;
      GG.pauseOffscreen([root]);
      if (slides.length < 2) return;   /* one quote: nothing to move between */
      function go(n) {
        n = (n + slides.length) % slides.length;
        if (n === i) return;
        slides[i].classList.remove('is-active');
        slides[i].setAttribute('aria-hidden', 'true');
        dots[i].removeAttribute('aria-current');
        i = n;
        slides[i].classList.add('is-active');
        slides[i].setAttribute('aria-hidden', 'false');
        dots[i].setAttribute('aria-current', 'true');
        count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      }
      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-dir]');
        if (b) go(i + Number(b.getAttribute('data-dir')));
        var d = e.target.closest('.testi__dot');
        if (d) go(Number(d.getAttribute('data-i')));
      });
      var stage = root.querySelector('.testi__stage');
      stage.setAttribute('tabindex', '0');
      stage.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      });
      var x0 = null;
      stage.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
      stage.addEventListener('pointerup', function (e) {
        if (x0 === null) return;
        var dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
      });
    }
  };
})();
