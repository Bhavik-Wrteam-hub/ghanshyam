/* OUR JOURNEY: the growth timeline, told down one line.
   - As the visitor scrolls, a stream of sand runs down the line
     (core/sand-stream.js) and lights each year as it reaches it.
   - The years alternate left and right. Big moments carry a photo or a
     looping clip beside them; the smaller steps are text only.
   - The year a company began says so, with how many companies the group
     had then, and links to that company's page.
   - The line ends at "Today": the group as it stands, with all five
     companies.
   Words and media: journey in site-content.js. */
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

  function yearOf(v) { return parseInt(GG.txt(v), 10); }
  function tint(id) { return 'var(--tint-' + id + ')'; }

  /* a photo, or a short looping clip (it plays only while on screen) */
  function media(m, cls) {
    if (!m) return null;
    if (m.video) {
      var v = h('video', { class: 'jt-media__video', muted: true, loop: true, playsinline: true, preload: 'none', poster: m.poster, 'data-src': m.video, tabindex: '-1' });
      v.muted = true;
      return h('figure', { class: 'jt-media ' + (cls || ''), role: 'img', 'aria-label': GG.txt(m.alt) }, v);
    }
    return h('figure', { class: 'jt-media ' + (cls || '') },
      GG.img(m, { cls: 'jt-media__img', sizes: '(max-width: 900px) 90vw, 540px' }));
  }

  /* one year on the line */
  function row(ms, i, j, total) {
    var co = GG.company(ms.company);
    var year = parseInt(ms.year, 10);
    var isNew = !!co && yearOf(co.since) === year;
    var count = GG.companies().filter(function (c) { return yearOf(c.since) <= year; }).length;
    var card = h('article', { class: 'jt-card' },
      h('p', { class: 'jt-card__year' }, ms.year),
      h('p', { class: 'jt-card__co' },
        h('span', { class: 'jt-card__dot', 'aria-hidden': 'true' }),
        h('span', null, co ? GG.txt(co.name) : '')),
      isNew ? h('p', { class: 'jt-card__new' },
        h('span', { class: 'jt-card__badge mono', text: j.newCompany }),
        h('span', { class: 'jt-strata', 'aria-hidden': 'true' },
          GG.companies().map(function (c, k) { return h('span', { class: k < count ? 'is-on' : null }); })),
        h('span', { class: 'jt-card__count', text: GG.txt(j.growthCount, { count: String(count), total: String(total) }) })) : null,
      h('h3', { class: 'jt-card__title' }, ms.title),
      h('p', { class: 'jt-card__text' }, ms.text),
      isNew ? h('a', { class: 'link jt-card__link', href: co.page },
        h('span', { text: GG.txt(j.visit, { name: GG.txt(co.short) }) }), GG.icon('arrow-right')) : null);
    return h('li', {
      class: 'jt-row ' + (i % 2 ? 'is-right' : 'is-left') + (ms.media ? ' has-media' : ' is-beat') + (isNew ? ' is-founding' : ''),
      style: { '--tint': tint(ms.company) }
    },
      card,
      h('span', { class: 'jt-node', 'aria-hidden': 'true' }),
      ms.media ? media(ms.media)
        /* a smaller step: a short headline faces its card across the line */
        : ms.theme ? h('p', { class: 'jt-theme' }, h('span', { class: 'jt-theme__year mono', 'aria-hidden': 'true' }, ms.year), h('span', null, ms.theme)) : null);
  }

  GG.sections.journey = {
    render: function (root, C) {
      var j = C.journey;
      /* years and words may hold {tokens}, such as {kaolin.since} */
      var list = (GG.deep(j.milestones) || []).map(function (m) {
        return { year: GG.txt(m.year), company: m.company, title: GG.txt(m.title), text: GG.txt(m.text), media: m.media, theme: m.theme ? GG.txt(m.theme) : '' };
      });
      var total = GG.companies().length;
      var t = j.today;

      var today = t ? h('div', { class: 'jt-today' },
        h('span', { class: 'jt-node jt-node--end', 'aria-hidden': 'true' }),
        h('div', { class: 'jt-today__card' },
          h('div', { class: 'jt-today__copy' },
            h('p', { class: 'kicker', text: t.label }),
            h('h3', { class: 'jt-today__title', text: t.title }),
            h('p', { class: 'jt-today__text', text: t.text }),
            h('ul', { class: 'jt-today__cos', role: 'list' },
              GG.companies().map(function (co) {
                return h('li', { style: { '--tint': tint(co.id) } },
                  h('a', { href: co.page }, h('span', { class: 'jt-card__dot', 'aria-hidden': 'true' }), h('span', { text: co.short })));
              }))),
          media(t.media, 'jt-media--wide'))) : null;

      root.appendChild(h('div', { class: 'container' },
        GG.head(j, 'journey-title', { cls: 'jt-head' }),
        h('div', { class: 'jt', 'data-sample': GG.hasS(j.milestones) ? '' : null },
          h('span', { class: 'jt__line', 'aria-hidden': 'true' }, h('span', { class: 'jt__fill' })),
          h('ol', { class: 'jt__rows', role: 'list' }, list.map(function (ms, i) { return row(ms, i, j, total); })),
          today),
        achievements(j.achievements)));
    },

    init: function (root) {
      var track = root.querySelector('.jt');
      var rows = Array.prototype.slice.call(root.querySelectorAll('.jt-row, .jt-today'));
      var nodes = Array.prototype.slice.call(root.querySelectorAll('.jt-node'));

      /* each year arrives as it scrolls in: its card from its own side */
      if ('IntersectionObserver' in window && !GG.reduced()) {
        var io = new IntersectionObserver(function (en) {
          en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
        rows.forEach(function (r) { io.observe(r); });
      } else rows.forEach(function (r) { r.classList.add('is-in'); });
      GG.reducedMQ.addEventListener('change', function (e) { if (e.matches) rows.forEach(function (r) { r.classList.add('is-in'); }); });

      /* the sand: the stream lights a year as it reaches it */
      GG.SandStream({
        track: track,
        line: root.querySelector('.jt__line'),
        fill: root.querySelector('.jt__fill'),
        stops: nodes,
        onReach: function (i, on) { rows[i].classList.toggle('is-lit', on); }
      });

      /* the clips play only while on screen; "reduce motion" and data saver keep the still */
      var vids = Array.prototype.slice.call(root.querySelectorAll('video[data-src]'));
      var saver = navigator.connection && navigator.connection.saveData;
      function allowed() { return !GG.reduced() && !saver; }
      if ('IntersectionObserver' in window) {
        var vio = new IntersectionObserver(function (en) {
          en.forEach(function (e) {
            var v = e.target;
            if (e.isIntersecting && allowed()) {
              if (!v.getAttribute('src')) { v.src = v.getAttribute('data-src'); }
              var p = v.play();
              if (p && p.catch) p.catch(function () {});
            } else if (!v.paused) v.pause();
          });
        }, { rootMargin: '150px 0px' });
        vids.forEach(function (v) { vio.observe(v); });
      }
      GG.reducedMQ.addEventListener('change', function (e) { if (e.matches) vids.forEach(function (v) { v.pause(); }); });
      GG.pauseOffscreen([root]);
    }
  };
})();
