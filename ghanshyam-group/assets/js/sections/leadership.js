/* LEADERSHIP: the people behind the group, one card each. A portrait is
   optional: until one exists (image: photo(...) in site-content.js), the card
   shows the person's initials on the group's colours, with the G mark behind
   them, in the same square frame, so a photo drops in without moving anything. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  /* "R. G. Patel" -> "RP", "Dr. N. Shah" -> "NS" */
  function initials(name) {
    var parts = String(name).replace(/^(dr|mr|mrs|ms|shri|smt)\.?\s+/i, '').split(/[\s.]+/).filter(Boolean);
    if (!parts.length) return '';
    var first = parts[0].charAt(0), last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  GG.sections.leadership = {
    render: function (root, C) {
      var d = C.leadership;
      root.appendChild(h('div', { class: 'container' },
        GG.head(d, 'leadership-title'),
        h('ul', { class: 'team', role: 'list', 'data-reveal': '' },
          d.people.map(function (raw) {
            var p = GG.deep(raw);
            var hasPhoto = !!(p.image && p.image.src);
            return h('li', { class: 'person', 'data-sample': GG.hasS(raw) ? '' : null },
              h('div', { class: 'person__portrait' + (hasPhoto ? '' : ' is-stand-in') },
                hasPhoto
                  ? GG.img(p.image, { sizes: '(max-width: 600px) 72vw, (max-width: 1100px) 45vw, 290px' })
                  : [
                      GG.mark ? GG.mark({ cls: 'person__mark' }) : null,
                      h('span', { class: 'person__initials', 'aria-hidden': 'true', text: initials(p.name) })
                    ]),
              h('div', { class: 'person__body' },
                h('h3', { class: 'person__name', text: p.name }),
                h('p', { class: 'person__role', text: p.role }),
                h('p', { class: 'person__text', text: p.text })));
          }))));
    }
  };
})();
