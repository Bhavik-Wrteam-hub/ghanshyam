/* ==========================================================================
   FILM: the homepage's first screen (index.html). One film per company.

   The stage stays on screen while the page scrolls past it. The group's opening
   comes first, then one card per company. Scrolling alone moves through them:
   each card rises and lands on the last one while its company's film fades in
   and plays, on desktop and phone alike. core/branch-player.js decides what
   loads and plays.

   Words: groupHero and each company's entry in site-content.js.
   Films: groupHero.film.branches, built by tools/branch-films.sh.
   ========================================================================== */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h, pad = GG.pad;

  function ctas(g) {
    return h('div', { class: 'btn-row fintro__ctas' },
      h('a', { class: 'btn', href: g.ctaPrimary.href }, h('span', { text: g.ctaPrimary.label }), GG.icon('arrow-right', 'btn__arrow')),
      h('a', { class: 'btn btn--ghost', href: g.ctaSecondary.href, text: g.ctaSecondary.label }));
  }

  /* One branch's picture and video, stacked. The video stays empty until needed. */
  function layer(film) {
    var video = h('video', {
      class: 'bfilm__video', muted: true, loop: true, playsinline: true, preload: 'none',
      disablepictureinpicture: true, disableremoteplayback: true, tabindex: '-1', 'aria-hidden': 'true'
    });
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    return h('div', {
      class: 'bfilm', 'data-base': 'assets/video/branches/' + film.file,
      style: { '--focus': film.focus || '50% 50%' }
    },
      h('picture', null,
        h('source', { media: '(orientation: portrait)' }),
        h('img', { class: 'bfilm__poster', alt: '', width: '1920', height: '1080', decoding: 'async' })),
      video);
  }

  GG.sections.film = {
    render: function (root, C) {
      var g = C.groupHero, f = g.film;
      var films = (GG.deep(f.branches) || []).filter(function (b) { return GG.company(b.company); });
      var isPlaceholder = GG.hasS(f.branches);
      var visit = C.businesses.visit;

      var proof = h('ul', { class: 'fintro__proof mono', role: 'list' }, g.proof.map(function (p) { return h('li', { text: p }); }));
      /* phones fit the facts on one line, sizing the type from their length (film.css) */
      proof.style.setProperty('--proof-chars', String(proof.textContent.length));
      proof.style.setProperty('--proof-items', String(proof.children.length));

      var intro = h('div', { class: 'fstep fstep--intro', 'data-i': '0' },
        h('div', { class: 'container fstep__inner' },
          h('div', { class: 'fintro' },
            h('p', { class: 'kicker', text: g.kicker }),
            h('h1', { class: 'fintro__title', id: 'film-title', text: g.title }),
            h('p', { class: 'fintro__text', text: g.text }),
            ctas(g),
            proof)),
        h('div', { class: 'film__cue container', 'aria-hidden': 'true' },
          h('span', { text: f.scrollCue }), h('span', { class: 'film__cue-line' }, h('span', { class: 'film__cue-grain' }))));

      var steps = films.map(function (b, i) {
        var co = GG.company(b.company);
        return h('article', {
          class: 'fstep', id: 'film-' + co.id, 'data-i': String(i), 'aria-labelledby': 'film-' + co.id + '-name',
          style: { '--tint': 'var(--tint-' + co.id + ')' }
        },
          h('div', { class: 'container fstep__inner' },
            h('div', { class: 'fcard', 'data-sample': isPlaceholder ? '' : null },
              h('p', { class: 'fcard__index mono' },
                h('span', { class: 'fcard__dot', 'aria-hidden': 'true' }),
                h('span', { text: pad(i + 1) }), h('span', { class: 'fcard__of', text: '/ ' + pad(films.length) }),
                isPlaceholder ? h('span', { class: 'fcard__flag', text: f.placeholderNote }) : null),
              h('h2', { class: 'fcard__name', id: 'film-' + co.id + '-name', text: co.name }),
              h('p', { class: 'fcard__tag', text: co.tagline }),
              h('p', { class: 'fcard__text', text: co.summary }),
              h('a', { class: 'btn fcard__link', href: co.page },
                h('span', { text: GG.txt(visit, { name: GG.txt(co.short) }) }),
                h('span', { class: 'fcard__go' }, GG.icon('arrow-right', 'btn__arrow'))))));
      });

      root.appendChild(h('div', { class: 'film__stage', 'aria-hidden': 'true' },
        h('img', { class: 'film__still', alt: '', width: '1600', height: '900', decoding: 'async' }),
        films.map(layer),
        h('div', { class: 'film__scrim' })));
      /* the pause button comes first, so the keyboard reaches it before the cards */
      root.appendChild(h('div', { class: 'film__controls' },
        h('button', { class: 'film__pause', type: 'button', 'aria-pressed': 'false', 'aria-label': GG.txt(f.pauseLabel) }, GG.icon('pause'))));
      root.appendChild(h('div', { class: 'film__steps' }, intro, steps));
    },

    init: function (root, C) {
      var f = C.groupHero.film;
      var pause = root.querySelector('.film__pause');
      var player = GG.BranchPlayer({
        root: root,
        stage: root.querySelector('.film__stage'),
        steps: Array.prototype.slice.call(root.querySelectorAll('.fstep')),
        layers: Array.prototype.slice.call(root.querySelectorAll('.bfilm')),
        still: root.querySelector('.film__still'),
        stillSrc: GG.txt(f.still)
      });

      /* The keyboard can reach a card lying under the stack: bring its company forward */
      root.addEventListener('focusin', function (e) {
        var step = e.target.closest('.fstep');
        if (!step || step.classList.contains('is-current') || !e.target.matches(':focus-visible')) return;
        var box = step.getBoundingClientRect();
        window.scrollTo({
          top: box.top + window.scrollY + box.height / 2 - window.innerHeight / 2,
          behavior: GG.reduced() ? 'auto' : 'smooth'
        });
      });

      /* Phones have no pause button on this screen (film.css). A pause left from
         earlier in the visit would freeze the films here with no way to restart
         them, so it is cleared. The About film's button still pauses every film. */
      if (getComputedStyle(pause.parentNode).display === 'none' && player.isPaused()) player.setPaused(false);

      function showPause() {
        var isPaused = player.isPaused();
        pause.setAttribute('aria-pressed', String(isPaused));
        pause.setAttribute('aria-label', GG.txt(isPaused ? f.playLabel : f.pauseLabel));
        pause.replaceChildren(GG.icon(isPaused ? 'play' : 'pause'));
      }
      pause.addEventListener('click', function () { player.setPaused(!player.isPaused()); });
      document.addEventListener('gg:films-paused', showPause);   /* one pause for every film */
      showPause();

      /* test probe: which film is current, and what is loaded and playing */
      GG.filmState = player.state;
      GG.filmPlayer = player;
    }
  };
})();
