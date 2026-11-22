/* FOOTER and the privacy notice dialog. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;

  GG.sections.footer = {
    render: function (root, C) {
      var f = C.footer, c = C.facts.contact, co = C.facts.company;
      var page = GG.page.company;
      var tel = 'tel:' + GG.txt(c.phone).replace(/[^+\d]/g, '');
      var companies = GG.companies().map(function (x) { return { id: x.id, name: x.name, href: x.page, current: page && page.id === x.id }; });
      var cta = { label: page ? page.cta.label : C.nav.cta.label, href: '#contact' };

      root.appendChild(h('div', { class: 'container footer' },
        h('div', { class: 'footer__top' },
          h('p', { class: 'footer__statement', text: f.statement }),
          h('a', { class: 'btn', href: cta.href }, h('span', { text: cta.label }), GG.icon('arrow-right', 'btn__arrow'))),
        h('div', { class: 'footer__cols' },
          h('div', { class: 'footer__brand' },
            (function () {
              var a = h('a', { class: 'footer__logo', href: GG.home('#top'), 'aria-label': GG.txt(C.nav.homeLabel) });
              var logo = GG.logo({ label: GG.txt(co.logoLabel || 'GROUP') });
              logo.removeAttribute('role');
              logo.setAttribute('aria-hidden', 'true');
              a.appendChild(logo);
              return a;
            })(),
            h('p', { class: 'footer__legal-name', text: co.legalName })),
          h('nav', { class: 'footer__col', 'aria-labelledby': 'ft-companies' },
            h('h2', { class: 'footer__h mono', id: 'ft-companies', text: f.companiesTitle }),
            h('ul', { role: 'list' }, companies.map(function (x) {
              return h('li', null, h('a', { href: x.href, 'aria-current': x.current ? 'page' : null },
                h('span', { class: 'footer__dot', style: { background: 'var(--tint-' + x.id + ')' }, 'aria-hidden': 'true' }), h('span', { text: x.name })));
            }))),
          h('nav', { class: 'footer__col', 'aria-labelledby': 'ft-explore' },
            h('h2', { class: 'footer__h mono', id: 'ft-explore', text: f.exploreTitle }),
            h('ul', { role: 'list' }, f.explore.map(function (l) { return h('li', null, h('a', { href: GG.home(l.href), text: l.label })); }))),
          h('div', { class: 'footer__col' },
            h('h2', { class: 'footer__h mono', text: f.contactTitle }),
            h('ul', { role: 'list' },
              h('li', null, h('a', { href: tel, text: c.phone })),
              h('li', null, h('a', { href: 'mailto:' + GG.txt(c.email), text: c.email })),
              h('li', null, h('address', { sample: c.headOffice }, (GG.deep(c.headOffice) || []).slice(0, 2).map(function (l) { return h('span', null, l); })))))),
        h('div', { class: 'footer__bottom' },
          h('p', { text: f.copyright }),
          h('p', { text: f.registration }),
          h('button', { class: 'footer__linkbtn', type: 'button', 'data-open-privacy': '' }, GG.txt(f.privacyLabel)),
          h('a', { href: 'brand.html', text: f.brandLabel }),
          h('a', { class: 'footer__top-link', href: '#main' }, h('span', { text: f.backToTop }), GG.icon('arrow-up'))),
        h('div', { class: 'footer__giant', 'aria-hidden': 'true', html:
          '<svg viewBox="-1 450 1108 120" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" fill-rule="evenodd" d="' + GG.LOGO_PATHS.word + '"/></svg>' })));

      /* The WhatsApp button, fixed in the bottom right corner (footer.css). It goes on
         <body>, so no transformed ancestor can pin it. The chat opens with a message
         naming this page's company, ready to send. */
      var wb = C.whatsappButton, wa = GG.txt(c.whatsapp).replace(/[^\d]/g, '');
      if (wb && wa) {
        var text = GG.txt(wb.message, { name: page ? GG.txt(page.name) : GG.txt(co.groupName) });
        document.body.appendChild(h('a', {
          class: 'wa-fab', href: 'https://wa.me/' + wa + '?text=' + encodeURIComponent(text),
          target: '_blank', rel: 'noopener', 'aria-label': GG.txt(wb.label) + ' ' + GG.txt((C.ui || {}).opensInNewTab)
        },
          GG.icon('whatsapp', 'wa-fab__icon'),
          h('span', { class: 'wa-fab__label', 'aria-hidden': 'true', text: wb.label })));
      }
    },
    init: function (root) {
      var dlg = document.getElementById('privacy');
      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-open-privacy]') && dlg && dlg.showModal) dlg.showModal();
      });
    }
  };

  GG.sections.privacy = {
    render: function (root, C) {
      var p = C.privacy;
      root.appendChild(h('div', { class: 'privacy__inner', 'data-sample': GG.hasS(p.paragraphs) ? '' : null },
        h('div', { class: 'privacy__head' },
          h('h2', { class: 'h3', id: 'privacy-title', text: p.title }),
          h('button', { class: 'privacy__close', type: 'button', 'aria-label': GG.txt(p.closeLabel) }, GG.icon('close'))),
        (GG.deep(p.paragraphs) || []).map(function (t) { return h('p', { text: t }); })));
    },
    init: function (root) {
      root.querySelector('.privacy__close').addEventListener('click', function () { root.close(); });
      root.addEventListener('click', function (e) { if (e.target === root) root.close(); });
    }
  };
})();
