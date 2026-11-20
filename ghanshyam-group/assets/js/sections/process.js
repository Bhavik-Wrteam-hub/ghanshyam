/* PROCESS: seven steps. A line draws down the list as you scroll, and the
   step in the middle of the screen lights up. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  GG.sections.process = {
    render: function (root, C) {
      var p = C.process;
      var total = p.steps.length;
      root.appendChild(h('div', { class: 'container process__grid' },
        h('div', { class: 'process__aside' },
          GG.head(p, 'process-title'),
          h('div', { class: 'process__counter', 'aria-hidden': 'true' },
            h('span', { class: 'mono process__counter-label', text: p.stepLabel }),
            h('span', { class: 'process__counter-num' }, '01'),
            h('span', { class: 'process__counter-total' }, '/ ' + pad(total)))),
        h('ol', { class: 'process__steps', role: 'list' },
          h('li', { class: 'process__line', 'aria-hidden': 'true' }, h('span')),
          p.steps.map(function (s, i) {
            return h('li', { class: 'step' + (i === 0 ? ' is-active' : ''), 'data-reveal': '' },
              h('div', { class: 'step__marker' }, GG.icon(s.icon)),
              h('div', { class: 'step__body' },
                h('p', { class: 'step__num mono' }, GG.txt(p.stepLabel) + ' ' + pad(i + 1)),
                h('h3', { class: 'step__title', text: s.title }),
                h('p', { class: 'step__text', text: s.text })));
          }))));
    },

    init: function (root) {
      var steps = Array.prototype.slice.call(root.querySelectorAll('.step'));
      var num = root.querySelector('.process__counter-num');
      var list = root.querySelector('.process__steps');
      var line = root.querySelector('.process__line span');

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var i = steps.indexOf(e.target);
            steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); s.classList.toggle('is-done', j < i); });
            var t = pad(i + 1);
            if (num.textContent !== t) num.textContent = t;
          });
        }, { rootMargin: '-48% 0px -48% 0px' });
        steps.forEach(function (s) { io.observe(s); });
      }

      /* the drawing line: scaled by progress through the list, delta-gated */
      var last = -1, ticking = false;
      function update() {
        ticking = false;
        var r = list.getBoundingClientRect();
        var mid = window.innerHeight * 0.5;
        var p = GG.clamp((mid - r.top) / Math.max(1, r.height), 0, 1);
        if (GG.reduced()) p = 1;
        if (Math.abs(p - last) > 0.002) { last = p; line.style.transform = 'scaleY(' + p.toFixed(4) + ')'; }
      }
      addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      GG.reducedMQ.addEventListener('change', update);
      update();
      GG.pauseOffscreen([root]);
    }
  };
})();
