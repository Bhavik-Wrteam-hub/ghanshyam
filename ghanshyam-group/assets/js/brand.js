/* Brand guidelines page: draws every lockup with the website's own logo
   builder, lists the logo files, shows colour swatches read live from
   tokens.css (with contrast), and the icon set. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;
  var css = getComputedStyle(document.documentElement);
  function token(name) { return css.getPropertyValue(name).trim(); }

  var BRANCHES = [
    ['group', 'GROUP', 'GHANSHYAM GROUP'],
    ['silica-sand', 'SILICA SAND', 'Ghanshyam Silica Sand'],
    ['kaolin', 'KAOLIN', 'Ghanshyam Kaolin'],
    ['minerals', 'MINERALS', 'Ghanshyam Minerals'],
    ['processors', 'PROCESSORS', 'Ghanshyam Processors'],
    ['farm-house', 'FARM HOUSE', 'Ghanshyam Farm House']
  ];

  /* logos placed in the markup */
  document.querySelectorAll('[data-logo]').forEach(function (el) {
    var logo = GG.logo({ label: el.getAttribute('data-logo'), layout: el.getAttribute('data-layout') || 'stacked' });
    if (el.getAttribute('data-size')) logo.style.setProperty('--lw', el.getAttribute('data-size') + 'px');
    if (el.tagName === 'A') { logo.removeAttribute('role'); logo.setAttribute('aria-hidden', 'true'); }
    el.appendChild(logo);
  });

  /* the family, light and reversed */
  function family(target, dark) {
    BRANCHES.forEach(function (b) {
      var logo = GG.logo({ label: b[1], name: b[2] });
      logo.style.setProperty('--lw', '200px');
      target.appendChild(h('li', { class: 'bg-family__item' }, logo));
    });
  }
  family(document.querySelector('[data-family]'));
  family(document.querySelector('[data-family-dark]'), true);

  /* downloads */
  var dl = document.querySelector('[data-downloads]');
  var files = BRANCHES.map(function (b) { return ['ghanshyam-' + b[0], b[2]]; })
    .concat([['ghanshyam-group-horizontal', 'Group, horizontal'], ['ghanshyam-mark', 'The mark on its own']]);
  files.forEach(function (f) {
    var base = 'assets/img/brand/' + f[0];
    dl.appendChild(h('li', { class: 'bg-dl' },
      h('span', { class: 'bg-dl__name' }, f[1]),
      h('span', { class: 'bg-dl__links' },
        h('a', { class: 'link', href: base + '.svg', download: '' }, 'SVG'),
        h('a', { class: 'link', href: base + '.png', download: '' }, 'PNG'),
        h('a', { class: 'link', href: base + '-white.svg', download: '' }, 'SVG, reversed'),
        h('a', { class: 'link', href: base + '-white.png', download: '' }, 'PNG, reversed'))));
  });

  /* the don'ts, drawn from the real logo */
  var donts = [
    ['Recolour any part', function (l) { l.style.setProperty('--logo-ink', '#7E5F4A'); l.style.setProperty('--logo-wave', '#C2410C'); }],
    ['Stretch or squash it', function (l) { l.style.transform = 'scaleX(1.35)'; }],
    ['Rotate it', function (l) { l.style.transform = 'rotate(-12deg)'; }],
    ['Change the label typeface', function (l) { l.querySelector('.logo__label b').style.cssText = 'font-family:Georgia,serif;font-style:italic;letter-spacing:0.05em;margin-right:0'; }],
    ['Add shadows or effects', function (l) { l.style.filter = 'drop-shadow(4px 6px 3px rgba(0,0,0,.45))'; }],
    ['Place it on busy imagery', null, true]
  ];
  var dt = document.querySelector('[data-donts]');
  donts.forEach(function (d) {
    var logo = GG.logo({ label: 'SILICA SAND' });
    logo.style.setProperty('--lw', '120px');
    logo.removeAttribute('role');
    logo.setAttribute('aria-hidden', 'true');
    if (d[1]) d[1](logo);
    dt.appendChild(h('li', null, h('span', { class: 'bg-dont__art' + (d[2] ? ' bg-dont__art--busy' : '') }, logo), h('span', null, d[0])));
  });

  /* contrast helper */
  function lum(hex) {
    hex = hex.replace('#', '');
    var rgb = [0, 2, 4].map(function (i) { return parseInt(hex.substr(i, 2), 16) / 255; });
    var f = function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  }
  function ratio(a, b) {
    var x = lum(a), y = lum(b);
    return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(1);
  }
  function swatch(name, varName, role, against, againstName) {
    var hex = token(varName);
    return h('li', { class: 'bg-swatch' },
      h('span', { class: 'bg-swatch__chip', style: { background: hex } }),
      h('span', { class: 'bg-swatch__name' }, name),
      h('span', { class: 'bg-swatch__hex mono' }, hex.toUpperCase() + '  ' + varName),
      h('span', { class: 'bg-swatch__role' }, role),
      against ? h('span', { class: 'bg-swatch__ratio mono' }, ratio(hex, token(against)) + ':1 on ' + againstName) : null);
  }

  var lc = document.querySelector('[data-logo-colours]');
  [['Deep Slate', '--logo-ink', 'The G and the GHANSHYAM wordmark'],
   ['Glass Edge', '--logo-wave', 'The sand wave in the G'],
   ['Shale', '--logo-label', 'The label and its rules'],
   ['Quartz White', '--logo-ink-rev', 'Reversed: G, wordmark and label'],
   ['Glass Edge, lifted', '--logo-wave-rev', 'Reversed: the sand wave']]
    .forEach(function (s) { lc.appendChild(swatch(s[0], s[1], s[2])); });

  var sw = document.querySelector('[data-swatches]');
  [['Quartz White', '--canvas', 'Page background'],
   ['Silica Flour', '--panel', 'Cards and raised areas'],
   ['Deep Slate', '--text-primary', 'Headlines and body text', '--canvas', 'Quartz White'],
   ['Shale', '--text-secondary', 'Supporting text', '--canvas', 'Quartz White'],
   ['Glass Edge', '--accent', 'The main button, focus, rare emphasis', '--canvas', 'Quartz White'],
   ['Glass Edge, lifted', '--accent-on-dark', 'Accent on dark surfaces', '--slate-900', 'Deep Slate']]
    .forEach(function (s) { sw.appendChild(swatch(s[0], s[1], s[2], s[3], s[4])); });

  var tints = document.querySelector('[data-tints]');
  [['Silica Sand', '--tint-silica'], ['Kaolin', '--tint-kaolin'], ['Minerals', '--tint-minerals'], ['Processors', '--tint-processors'], ['Farm House', '--tint-farm']]
    .forEach(function (t) { tints.appendChild(swatch(t[0], t[1], 'Marker colour')); });

  /* icon set */
  var icons = document.querySelector('[data-icons]');
  Object.keys(GG.ICONS).forEach(function (name) {
    icons.appendChild(h('li', { class: 'bg-icon' }, GG.icon(name), h('span', { class: 'mono' }, name)));
  });

  requestAnimationFrame(function () { document.body.classList.add('is-ready'); });
})();
