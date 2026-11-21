/* ==========================================================================
   THE LOGO: one builder for every lockup.
   The G with its gold wave, the GHANSHYAM wordmark and the tagline are the same
   for every branch. Only the label changes: GROUP, SILICA SAND, KAOLIN,
   MINERALS, PROCESSORS, FARM HOUSE.

   Logo colours (tokens.css):
     the G, GHANSHYAM, label   Emerald #0B7453   (--logo-ink, --logo-label)
     the wave, rules, peaks    Gold    #D9A21F   (--logo-wave)
   On dark surfaces the reversed set is used automatically.

   GG.logo({ label: 'SILICA SAND', layout, name: 'accessible name' })
     layout 'stacked'     the primary logo: G, name, label, tagline
            'compact'     the same order without the tagline, for slim bars
            'horizontal'  the G beside the name and label
   GG.mark({ cls })   the G mark on its own
   GG.seal({ cls })   the monogram seal: the mark in its reversed colours on a
                      deep emerald disc, ringed by the quarry's five layers
   GG.drawLogo(el)    the one-time drawn reveal; it ends on the exact logo
   ========================================================================== */
(function () {
  'use strict';
  var GG = (window.GG = window.GG || {});

  var TAGLINE = 'PURE BY <em>NATURE.</em> PERFECT BY <em>CHOICE.</em>';
  var MARK_BOX = '0 0 1000 1000', WORD_BOX = '-1 450 1108 120';

  /* The G, drawn as true circles and smooth curves in a 1000 unit square.
     BODY: its top arc, bar and hook, and bottom bowl. WAVE: the gold sand wave. */
  var BODY = 'M943.5 291.8A490.0 490.0 0 0 0 33.8 650.7C45.0 639.2 54.8 626.4 67.6 616.1C80.2 605.9 95.1 596.8 109.9 589.1C124.8 581.5 141.6 575.0 156.7 570.3C172.4 565.5 187.2 564.1 202.4 561.0A303.8 303.8 0 0 1 721.2 291.8ZM563.7 446.1L987.0 446.1A490.0 490.0 0 0 1 832.8 859.7C812.4 851.6 791.4 845.0 771.5 835.4C751.8 825.8 733.5 815.0 714.0 802.3C695.2 789.9 675.6 774.4 656.4 760.4A303.8 303.8 0 0 0 783.1 610.2L475.5 610.2ZM51.2 696.8C81.2 689.5 110.4 678.8 141.0 675.1C171.4 671.4 202.7 669.0 234.4 674.2C265.1 679.3 288.2 683.6 328.2 705.0C361.6 722.9 404.1 753.0 446.5 782.2C486.6 809.8 532.1 847.4 574.5 874.2C618.3 901.9 661.5 921.5 705.0 945.1A490.0 490.0 0 0 1 51.2 696.8Z';
  var WAVE = 'M28.6 684.2C47.7 664.6 63.5 641.5 85.9 625.4C108.0 609.6 135.4 595.9 161.9 588.2C188.5 580.5 215.9 576.3 245.2 579.4C273.2 582.4 296.9 586.1 333.4 604.9C364.3 620.7 401.9 645.9 441.2 674.4C477.5 700.9 519.8 737.3 558.8 767.5C598.2 798.0 638.2 832.3 676.4 856.7C716.8 882.6 747.9 899.8 794.0 916.5C837.0 932.1 892.0 942.0 941.0 954.7C892.0 953.1 836.7 956.1 794.0 949.8C747.3 943.0 714.1 929.7 676.4 912.6C639.0 895.6 605.1 872.2 568.6 847.9C533.2 824.3 495.3 793.8 460.8 769.5C425.0 744.3 388.2 717.4 357.9 699.9C323.4 680.0 297.5 670.6 269.7 662.7C240.1 654.3 214.2 652.9 186.4 652.9C158.6 652.9 129.0 657.6 103.1 662.7C76.2 667.9 53.4 677.1 28.6 684.2Z';
  var WORD = 'M53.1 451L55 450.6L65 450.6L73 451.7L84 454.9L92 458.8L98 462.7L104 467.7L105.7 470L105.4 471L89 487.7L88 487.9L82 482.6L77 479.5L70 476.7L63 475.5L55 475.6L50 476.8L42 480.5L37.4 484L33.6 488L28.7 497L26.4 506L26.4 512L27.6 519L29.8 525L32.5 530L38 536.3L44 540.3L51 543.1L57 544.3L63 544.4L69 543.4L75 541.4L82 537.2L85.5 534L85.8 524L85 523.1L58 522.8L57.5 522L57.5 508L57.6 502L58 500.8L112 500.6L112.7 501L112.9 502L112.6 539L112.2 541L110.3 544L106.4 549L102.5 553L99 556.2L93 560.4L88 563.1L80 566.3L71 568.4L65 569.1L54 569.1L43 567.2L32 563.2L25 559.4L21 556.4L16.1 552L13 548.6L6.7 540L3.8 534L1.6 528L-0.4 518L-0.6 505L0.7 495L3.8 486L5.6 482L9.8 475L12 472.3L18 465.8L22 462.5L26 459.7L30 457.6L36 454.8L42 452.8L47 451.6ZM558.4 451L562 450.5L569 450.6L578 451.7L583 453L591 455.7L597 458.6L606.5 465L606.5 466L595.3 483L593 485.4L588 481.8L580 477.7L574 475.9L567 474.8L562 475L558 475.6L555 476.7L551.6 479L549.6 482L549.7 487L551 489.3L554.4 492L557 493.3L563 495.2L574 497.7L585 500.8L596 505.6L600.7 509L605 513.3L607.4 517L609.2 521L611 529L611.2 536L609.4 544L607.2 549L605.4 552L601 557.1L594 562.3L585 566.4L577 568.3L569 569.2L560 569.2L547 567.3L537 564.1L529 560.3L523 556.3L518.7 553L518.1 552L532 531.8L540 537.3L546 540.4L554 543.4L558 544.3L562 544.6L572 544.3L576 543.1L579 541.4L582.1 538L583.2 534L582.4 531L581 528.7L578 526.5L571 523.9L556 520.4L546 517.3L537 513.3L532 510.1L527.7 506L525.7 503L523.7 499L521.8 493L521.3 488L521.7 480L523.6 473L527.7 466L534 459.6L540 455.9L548 452.7ZM131.7 453L134 452.4L158 452.4L159.4 453L159.3 496L160 496.7L166 496.8L212 496.8L213 496.4L213.3 453L214 452.4L234 452.4L240 452.4L240.8 453L240.7 567L240 567.5L224 567.5L214 567.5L213.4 567L213.3 523L212.2 522L160 521.9L159.4 523L159.4 567L158 567.6L132 567.4L131.6 567ZM305.7 453L308 452.4L334 452.4L334.9 453L374.3 544L383.4 566L383.7 567L383 567.5L355 567.5L354.4 567L349.8 556L346 546.2L345 545.5L342 545.5L295 545.6L291.8 552L286.2 566L285 567.5L257 567.6L256.4 567L295.2 478ZM397.8 453L399 452.4L402 452.4L423 452.4L425 452.9L466.8 509L475 519.5L475.4 519L475.4 516L475.5 453L476 452.5L500 452.4L502 452.4L502.6 453L502.6 567L502 567.5L483 567.5L477 567.5L476.3 567L426 499.8L425 500L424.9 567L424 567.5L401 567.6L399 567.5L397.8 567ZM628.3 453L629 452.4L650 452.4L655 452.4L655.7 453L655.7 496L657 496.7L666 496.8L702 496.7L702.7 496L702.8 495L702.8 453L704 452.4L729 452.4L730.3 453L730 567.2L704 567.6L702.8 567L702.8 523L702 521.9L657 522L656 522.4L655.7 567L655 567.5L629 567.6L628.2 567ZM746.1 453L747 452.5L777 452.4L801.6 493L803 493.8L828 452.6L858 452.4L859.4 453L816.7 520L816.3 521L816 567.3L790 567.5L789.1 567L789 521ZM892.3 453L893 452.4L898 452.4L919 452.4L920.2 453L959.3 546L967.4 566L967.7 567L967 567.6L939 567.3L930.5 546L930 545.6L922 545.4L882 545.4L880.8 546L872 567.4L844 567.6L843.2 567ZM981.3 453L982 452.4L994 452.4L1010 452.5L1010.9 453L1043 509.9L1044 509.7L1044.5 509L1076 452.9L1077 452.4L1106 452.5L1106.4 453L1106.3 567L1105 567.5L1080 567.5L1078.8 567L1078.7 505L1078.6 502L1078 501.6L1050.2 549L1041 549.3L1037 549.3L1035.9 548L1009.2 502L1008.4 502L1008.2 567L1007 567.5L994 567.6L982 567.5L981.4 567ZM319.6 485L320 484.4L321.2 486L332.2 512L335.9 522L335 522.4L309 522.5L305 522.4L304.5 522ZM905.8 486L906.2 486L911.3 498L919.3 518L920.5 522L920 522.4L917 522.4L891 522.3L890.7 522L891 521L898.7 502Z';
  /* the small gold peak inside each A of GHANSHYAM */
  var PEAKS = 'M320.1 491.5L331.6 519H308.6ZM905.6 491.5L917.1 519H894.1Z';
  GG.LOGO_PATHS = { body: BODY, wave: WAVE, word: WORD, peaks: PEAKS, mark: BODY + WAVE };

  function path(cls, d) { return '<path class="' + cls + '" fill-rule="evenodd" d="' + d + '"/>'; }
  function svg(cls, viewBox, inner) {
    return '<svg class="' + cls + '" viewBox="' + viewBox + '" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  /* each mark carries its own soft gradients, so it is safe anywhere on a page */
  var uid = 0;
  function stop(at, token) { return '<stop offset="' + at + '" style="stop-color:var(' + token + ')"/>'; }
  function markParts() {
    var id = 'gg-logo-' + (++uid);
    return '<defs>' +
      '<linearGradient id="' + id + '-g" x1="0" y1="0" x2="1" y2="1">' + stop(0, '--logo-ink-light') + stop(0.55, '--logo-ink') + stop(1, '--logo-ink-deep') + '</linearGradient>' +
      '<linearGradient id="' + id + '-w" x1="0" y1="0" x2="1" y2="0.5">' + stop(0, '--logo-wave-deep') + stop(0.42, '--logo-wave-light') + stop(1, '--logo-wave') + '</linearGradient>' +
      '</defs>' +
      '<path class="logo__body" fill-rule="evenodd" fill="url(#' + id + '-g)" d="' + BODY + '"/>' +
      '<path class="logo__wave" fill="url(#' + id + '-w)" d="' + WAVE + '"/>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  GG.logo = function (opts) {
    opts = opts || {};
    var label = esc(opts.label || 'GROUP');
    var name = esc(opts.name || ('GHANSHYAM ' + (opts.label || 'GROUP')));
    var layout = opts.layout === 'horizontal' ? 'h' : opts.layout === 'compact' ? 'compact' : 'stacked';
    var mark = svg('logo__mark', MARK_BOX, markParts());
    var word = svg('logo__word', WORD_BOX, path('logo__ink', WORD) + path('logo__peak', PEAKS));
    var labelRow = '<span class="logo__label" aria-hidden="true"><i></i><b>' + label + '</b><i></i></span>';
    var tag = layout === 'stacked' ? '<span class="logo__tag" aria-hidden="true">' + TAGLINE + '</span>' : '';
    var inner = layout === 'h' ? mark + '<span class="logo__text">' + word + labelRow + '</span>' : mark + word + labelRow + tag;
    var wrap = document.createElement('span');
    wrap.innerHTML = '<span class="logo logo--' + layout + ' ' + (opts.cls || '') + '" role="img" aria-label="' + name + '">' + inner + '</span>';
    return wrap.firstChild;
  };

  /* The mark on its own (small marks next to names) */
  GG.mark = function (opts) {
    opts = opts || {};
    var wrap = document.createElement('span');
    wrap.innerHTML = svg('mark ' + (opts.cls || ''), MARK_BOX, markParts());
    return wrap.firstChild;
  };

  /* The monogram seal: the same mark, reversed, on a disc inside the five-layer ring */
  function arc(i) {
    var R = 88, gap = 9, a0 = -90 - 36 + gap / 2 + i * 72, a1 = a0 + 72 - gap;
    function pt(deg) { var r = deg * Math.PI / 180; return (100 + R * Math.cos(r)).toFixed(2) + ' ' + (100 + R * Math.sin(r)).toFixed(2); }
    return '<path d="M' + pt(a0) + 'A' + R + ' ' + R + ' 0 0 1 ' + pt(a1) + '" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--stratum-' + (i + 1) + ')"/>';
  }
  GG.seal = function (opts) {
    opts = opts || {};
    var wrap = document.createElement('span');
    var ring = [0, 1, 2, 3, 4].map(arc).join('');
    wrap.innerHTML = '<svg class="seal ' + (opts.cls || '') + '" viewBox="0 0 200 200" aria-hidden="true" focusable="false">' +
      '<circle cx="100" cy="100" r="100" style="fill:var(--logo-ink-deep)"/>' + ring +
      '<svg x="48" y="48" width="104" height="104" viewBox="' + MARK_BOX + '">' +
      '<path fill-rule="evenodd" style="fill:var(--logo-ink-rev)" d="' + BODY + '"/>' +
      '<path style="fill:var(--logo-wave-rev)" d="' + WAVE + '"/></svg></svg>';
    return wrap.firstChild;
  };

  /* The one-time reveal: the G is traced, fills, the wordmark wipes in, the
     label settles. When it ends the class is removed, so what stays on screen
     is the logo itself. Never runs under "reduce motion". */
  GG.drawLogo = function (el) {
    if (!el || (GG.reduced && GG.reduced())) return;
    var paths = el.querySelectorAll('path');
    paths.forEach(function (p) { p.setAttribute('pathLength', '1'); });
    el.classList.add('logo--draw');
    setTimeout(function () {
      el.classList.remove('logo--draw');
      paths.forEach(function (p) { p.removeAttribute('pathLength'); });
    }, 1700);
  };
})();
