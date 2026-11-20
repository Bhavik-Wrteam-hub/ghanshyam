/* OUR JOURNEY: an interactive growth timeline. A rail of years, a detail
   panel, and a "core sample" that stacks one layer per milestone. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  /* achievements under the timeline */
  function achievements(a) {
    if (!a) return null;
    var list = GG.deep(a.items) || [];
    return h('div', { class: 'jr-awards' },
      h('h3', { class: 'jr-awards__title kicker', text: a.title }),
      h('ul', { class: 'jr-awards__list', role: 'list', 'data-reveal': '', 'data-sample': GG.hasS(a.items) ? '' : null },
        list.map(function (it) {
          return h('li', { class: 'award' },
            h('span', { class: 'award__top' },
              h('span', { class: 'award__icon', 'aria-hidden': 'true' }, GG.icon(it.icon)),
              h('span', { class: 'award__year mono', text: it.year })),
            h('h4', { class: 'award__title', text: it.title }),
            h('p', { class: 'award__text', text: it.text }));
        })));
  }

  function companyNames(C) {
    var m = {};
    m[C.group.flagship.id] = GG.txt(C.group.flagship.name);
    C.group.companies.forEach(function (c) { m[c.id] = GG.txt(c.name); });
    return m;
  }

  function detail(ms, names) {
    return h('div', { class: 'jr-detail__inner', style: { '--tint': 'var(--tint-' + ms.company + ')' } },
      h('p', { class: 'jr-detail__year', 'aria-hidden': 'true' }, ms.year),
      h('p', { class: 'jr-detail__co' },
        GG.mark({ cls: 'jr-detail__mark', grain: 'var(--tint-' + ms.company + ')' }),
        h('span', null, names[ms.company] || '')),
      h('h3', { class: 'jr-detail__title' }, h('span', { class: 'sr-only' }, ms.year + ': '), ms.title),
      h('p', { class: 'jr-detail__text' }, ms.text));
  }

  GG.sections.journey = {
    render: function (root, C) {
      var j = C.journey;
      var list = GG.deep(j.milestones) || [];
      var sample = GG.hasS(j.milestones) ? '' : null;
      var names = companyNames(C);
      var last = list.length - 1;

      var rail = h('div', { class: 'jr-rail' },
        h('div', { class: 'jr-rail__track', 'aria-hidden': 'true' }, h('span', { class: 'jr-rail__fill' })),
        h('div', { class: 'jr-rail__years', role: 'tablist', 'aria-label': GG.txt(j.title) },
          list.map(function (m, i) {
            return h('button', {
              class: 'jr-year', type: 'button', role: 'tab', id: 'jr-tab-' + i,
              'aria-selected': i === last ? 'true' : 'false', 'aria-controls': 'jr-panel', tabindex: i === last ? '0' : '-1',
              style: { '--tint': 'var(--tint-' + m.company + ')' }, 'data-i': i, 'data-sample': sample
            }, h('span', { class: 'jr-year__dot', 'aria-hidden': 'true' }), h('span', { class: 'jr-year__label' }, m.year));
          })));

      var core = h('div', { class: 'jr-core', 'aria-hidden': 'true' },
        list.map(function (m, i) {
          return h('span', { class: 'jr-core__layer is-on', style: { '--tint': 'var(--tint-' + m.company + ')', '--i': i }, 'data-i': i },
            h('span', { class: 'jr-core__year mono' }, m.year));
        }).reverse());

      root.appendChild(h('div', { class: 'container' },
        h('div', { class: 'jr-top' },
          GG.head(j, 'journey-title'),
          h('div', { class: 'jr-nav' },
            h('button', { class: 'jr-nav__btn', type: 'button', 'data-dir': '-1' }, GG.icon('arrow-left'), h('span', { text: j.prevLabel })),
            h('button', { class: 'jr-nav__btn', type: 'button', 'data-dir': '1' }, h('span', { text: j.nextLabel }), GG.icon('arrow-right')))),
        h('div', { 'data-reveal': '' }, rail),
        h('div', { class: 'jr-body', 'data-reveal': '' },
          h('div', { class: 'jr-detail', id: 'jr-panel', role: 'tabpanel', 'aria-labelledby': 'jr-tab-' + last, tabindex: '0', 'data-sample': sample },
            detail(list[last], names)),
          core),
        achievements(j.achievements)));
      root._list = list;
      root._names = names;
    },

    init: function (root) {
      var list = root._list, names = root._names;
      var tabs = Array.prototype.slice.call(root.querySelectorAll('.jr-year'));
      var layers = Array.prototype.slice.call(root.querySelectorAll('.jr-core__layer'));
      var panel = root.querySelector('#jr-panel');
      var fill = root.querySelector('.jr-rail__fill');
      var prev = root.querySelector('[data-dir="-1"]');
      var next = root.querySelector('[data-dir="1"]');
      var yearsEl = root.querySelector('.jr-rail__years');
      var cur = list.length - 1;

      function paint(i) {
        var frac = list.length > 1 ? i / (list.length - 1) : 1;
        fill.style.transform = 'scaleX(' + frac.toFixed(4) + ')';
        tabs.forEach(function (t, k) {
          t.setAttribute('aria-selected', k === i ? 'true' : 'false');
          t.setAttribute('tabindex', k === i ? '0' : '-1');
          t.classList.toggle('is-past', k < i);
        });
        layers.forEach(function (l) { l.classList.toggle('is-on', Number(l.getAttribute('data-i')) <= i); l.classList.toggle('is-current', Number(l.getAttribute('data-i')) === i); });
        prev.disabled = i === 0;
        next.disabled = i === list.length - 1;
        panel.setAttribute('aria-labelledby', tabs[i].id);
        /* keep the chosen year in view on narrow screens */
        var t = tabs[i];
        var left = t.offsetLeft - yearsEl.clientWidth / 2 + t.clientWidth / 2;
        yearsEl.scrollTo({ left: left, behavior: GG.reduced() ? 'auto' : 'smooth' });
      }
      function select(i, focus) {
        i = GG.clamp(i, 0, list.length - 1);
        if (focus) tabs[i].focus({ preventScroll: true });
        if (i === cur) return;
        var dir = i > cur ? 1 : -1;
        cur = i;
        paint(i);
        var nextEl = detail(list[i], names);
        var M = GG.motion();
        var old = panel.firstChild;
        if (M && M.animate && !GG.reduced() && old) {
          M.animate(old, { opacity: [1, 0], transform: ['translateX(0)', 'translateX(' + (-24 * dir) + 'px)'] }, { duration: 0.2, ease: [0.65, 0, 0.35, 1] }).then(function () {
            panel.replaceChildren(nextEl);
            M.animate(nextEl.children, { opacity: [0, 1], transform: ['translateX(' + (28 * dir) + 'px)', 'translateX(0)'] }, { duration: 0.55, delay: M.stagger ? M.stagger(0.06) : 0, ease: [0.22, 1, 0.36, 1] });
          });
        } else {
          panel.replaceChildren(nextEl);
        }
      }

      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i); });
        t.addEventListener('keydown', function (e) {
          var j = null;
          if (e.key === 'ArrowRight') j = i + 1;
          if (e.key === 'ArrowLeft') j = i - 1;
          if (e.key === 'Home') j = 0;
          if (e.key === 'End') j = tabs.length - 1;
          if (j !== null) { e.preventDefault(); select(j, true); }
        });
      });
      prev.addEventListener('click', function () { select(cur - 1); });
      next.addEventListener('click', function () { select(cur + 1); });
      layers.forEach(function (l) {
        l.addEventListener('click', function () { select(Number(l.getAttribute('data-i'))); });
      });

      /* The first time the timeline scrolls into view, it plays from the start */
      var played = false;
      if ('IntersectionObserver' in window && !GG.reduced()) {
        cur = 0;
        paint(0);
        panel.replaceChildren(detail(list[0], names));
        var io = new IntersectionObserver(function (en) {
          if (!en[0].isIntersecting || played) return;
          played = true;
          io.disconnect();
          var i = 0;
          (function stepper() {
            if (i >= list.length - 1) return;
            setTimeout(function () { if (cur === i) { select(i + 1); i++; stepper(); } }, i === 0 ? 700 : 260);
          })();
        }, { threshold: 0.45 });
        io.observe(root.querySelector('.jr-body'));
      } else {
        paint(cur);
      }
      GG.pauseOffscreen([root]);
    }
  };
})();
