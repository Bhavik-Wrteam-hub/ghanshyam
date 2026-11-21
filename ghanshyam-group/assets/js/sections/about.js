/* ABOUT: the group's story, the founder's line, its film and the four numbers.
   The film plays through GG.FrameFilm (core/branch-player.js). Words and film:
   about in site-content.js. Without a film, the section shows about.image. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  /* The film's frame: a poster, the video over it once it plays, and its pause button */
  function filmFrame(a, C) {
    var film = GG.deep(a.film), labels = C.groupHero.film;
    var video = h('video', {
      class: 'about__video', muted: true, loop: true, playsinline: true, preload: 'none',
      disablepictureinpicture: true, disableremoteplayback: true, tabindex: '-1', 'aria-hidden': 'true'
    });
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    var poster = h('img', {
      class: 'about__poster', alt: GG.txt(film.alt), width: '1080', height: '1320', loading: 'lazy', decoding: 'async',
      src: film.base + '.webp', srcset: film.base + '-small.webp 720w, ' + film.base + '.webp 1080w',
      sizes: '(max-width: 960px) 100vw, 620px'
    });
    var still = GG.deep(a.image);
    poster.addEventListener('error', function () {
      if (!still || poster.getAttribute('src') === still.src) return;
      poster.removeAttribute('srcset');
      poster.src = still.src;
    });
    return h('div', {
      class: 'about__frame has-film', sample: a.film, 'data-base': film.base,
      style: { '--focus': film.focus || '50% 50%', '--focus-small': film.focusSmall || film.focus || '50% 50%' }
    },
      poster, video,
      h('button', { class: 'about__pause', type: 'button', 'aria-pressed': 'false', 'aria-label': GG.txt(labels.pauseLabel) }, GG.icon('pause')));
  }

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
          a.film ? filmFrame(a, C)
            : h('div', { class: 'about__frame' }, GG.img(a.image, { width: 900, height: 1100, cls: 'about__img', sizes: '(max-width: 960px) 100vw, 620px' }), dust))));

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

    init: function (root, C) {
      var filmEl = root.querySelector('.about__frame.has-film');
      if (filmEl) {
        var labels = C.groupHero.film, btn = filmEl.querySelector('.about__pause');
        var showPause = function () {
          var isPaused = !!(GG.filmPlayer && GG.filmPlayer.isPaused());
          btn.setAttribute('aria-pressed', String(isPaused));
          btn.setAttribute('aria-label', GG.txt(isPaused ? labels.playLabel : labels.pauseLabel));
          btn.replaceChildren(GG.icon(isPaused ? 'play' : 'pause'));
        };
        btn.addEventListener('click', function () { if (GG.filmPlayer) GG.filmPlayer.setPaused(!GG.filmPlayer.isPaused()); });
        document.addEventListener('gg:films-paused', showPause);   /* one pause for every film */
        showPause();
        GG.aboutFilm = GG.FrameFilm({ frame: filmEl, video: filmEl.querySelector('video'), base: filmEl.getAttribute('data-base') });
      }
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
