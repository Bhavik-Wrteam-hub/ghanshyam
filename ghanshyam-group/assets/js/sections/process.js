/* PROCESS (silica page): seven steps. As you scroll, sand runs down the line
   beside the list (core/sand-stream.js); the step in the middle of the screen
   lights up, and the panel beside the list shows that step's clip or photo
   with its number. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h, pad = GG.pad;

  /* sand tones that read on the light page */
  var LIGHT_SAND = ['#B99A66', '#A88A5A', '#CDB283', '#94784C', '#D9C49A'];

  function frame(m, i) {
    var v = GG.deep(m);
    if (!v) return null;
    var el = v.video
      ? h('video', { muted: true, loop: true, playsinline: true, preload: 'none', 'data-poster': v.poster, 'data-src': v.video, tabindex: '-1' })
      : GG.img(v, { alt: '', sizes: '(max-width: 900px) 0px, 520px' });
    if (v.video) el.muted = true;
    return h('span', { class: 'process__frame' + (i === 0 ? ' is-on' : ''), 'data-i': i }, el);
  }

  GG.sections.process = {
    render: function (root, C) {
      var p = C.process;
      var total = p.steps.length;
      var hasMedia = p.steps.some(function (s) { return s.media; });
      root.appendChild(h('div', { class: 'container process__grid' },
        h('div', { class: 'process__aside' },
          GG.head(p, 'process-title'),
          h('figure', { class: 'process__media' + (hasMedia ? '' : ' is-plain'), 'aria-hidden': 'true' },
            p.steps.map(function (s, i) { return frame(s.media, i); }),
            h('figcaption', { class: 'process__counter' },
              h('span', { class: 'mono process__counter-label', text: p.stepLabel }),
              h('span', { class: 'process__counter-num' }, '01'),
              h('span', { class: 'process__counter-total' }, '/ ' + pad(total)),
              h('span', { class: 'process__counter-title', text: p.steps[0].title })))),
        h('div', { class: 'process__track' },
          h('ol', { class: 'process__steps', role: 'list' },
            h('li', { class: 'process__line', 'aria-hidden': 'true' }, h('span')),
            p.steps.map(function (s, i) {
              return h('li', { class: 'step' + (i === 0 ? ' is-active' : ''), 'data-reveal': '' },
                h('div', { class: 'step__marker' }, GG.icon(s.icon)),
                h('div', { class: 'step__body' },
                  h('p', { class: 'step__num mono' }, GG.txt(p.stepLabel) + ' ' + pad(i + 1)),
                  h('h3', { class: 'step__title', text: s.title }),
                  h('p', { class: 'step__text', text: s.text })));
            })))));
    },

    init: function (root, C) {
      var p = C.process;
      var steps = Array.prototype.slice.call(root.querySelectorAll('.step'));
      var num = root.querySelector('.process__counter-num');
      var title = root.querySelector('.process__counter-title');
      var media = root.querySelector('.process__media');
      var frames = Array.prototype.slice.call(root.querySelectorAll('.process__frame'));
      var saver = navigator.connection && navigator.connection.saveData;
      var mediaOnScreen = false, cur = 0;

      /* the panel shows the active step's clip; only that one plays, only on screen */
      function showMedia(i) {
        frames.forEach(function (f) {
          var on = Number(f.getAttribute('data-i')) === i;
          f.classList.toggle('is-on', on);
          var v = f.querySelector('video');
          if (!v) return;
          /* the preview picture loads only for the step on show and the next one */
          var near = Number(f.getAttribute('data-i')) - i;
          if (mediaOnScreen && (near === 0 || near === 1) && !v.getAttribute('poster')) v.setAttribute('poster', v.getAttribute('data-poster'));
          if (on && mediaOnScreen && !GG.reduced() && !saver) {
            if (!v.getAttribute('src')) v.src = v.getAttribute('data-src');
            var pr = v.play();
            if (pr && pr.catch) pr.catch(function () {});
          } else if (!v.paused) v.pause();
        });
      }

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var i = steps.indexOf(e.target);
            cur = i;
            steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); s.classList.toggle('is-done', j < i); });
            var t = pad(i + 1);
            if (num.textContent !== t) num.textContent = t;
            GG.setText(title, p.steps[i].title);
            showMedia(i);
          });
        }, { rootMargin: '-48% 0px -48% 0px' });
        steps.forEach(function (s) { io.observe(s); });
        new IntersectionObserver(function (en) {
          mediaOnScreen = en[0].isIntersecting && getComputedStyle(media).display !== 'none';
          showMedia(cur);
        }, { rootMargin: '100px 0px' }).observe(media);
      }
      GG.reducedMQ.addEventListener('change', function () { showMedia(cur); });

      /* sand down the line, lighting each step's marker as it arrives */
      var markers = steps.map(function (s) { return s.querySelector('.step__marker'); });
      GG.SandStream({
        track: root.querySelector('.process__track'),
        line: root.querySelector('.process__line'),
        fill: root.querySelector('.process__line span'),
        stops: markers,
        colors: LIGHT_SAND,
        glow: '150,120,72',
        glowAlpha: 0.45
      });
      GG.pauseOffscreen([root]);
    }
  };
})();
