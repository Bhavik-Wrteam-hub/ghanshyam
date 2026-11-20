/* CONTACT: the enquiry form at the end of every page, the direct channels
   and the addresses.
   - On the homepage it is the group's form: the visitor picks a company and
     a product, and the enquiry says which company it is for.
   - On a company's page it is that company's form: its own products, its
     own title and its own button.
   Client-side validation, honest success state: in demo mode it says that
   nothing was sent. */
(function () {
  'use strict';
  var GG = window.GG, h = GG.h;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^\+?[\d\s\-()]{8,20}$/;

  function field(id, def, type, required, extra) {
    var F = def;
    var label = h('label', { class: 'field__label', for: 'f-' + id },
      h('span', { text: F.label }),
      F.optional ? h('span', { class: 'field__opt', text: F.optional }) : null);
    var input;
    if (type === 'textarea') {
      input = h('textarea', { id: 'f-' + id, name: id, rows: 4, placeholder: GG.txt(F.placeholder) });
    } else if (type === 'select') {
      input = h('select', { id: 'f-' + id, name: id }, extra);
    } else {
      input = h('input', { id: 'f-' + id, name: id, type: type, placeholder: GG.txt(F.placeholder), autocomplete: F.autocomplete || null });
    }
    if (required) { input.setAttribute('required', ''); input.setAttribute('aria-required', 'true'); }
    input.setAttribute('aria-describedby', 'f-' + id + '-err');
    return h('div', { class: 'field field--' + id },
      label, input, h('p', { class: 'field__err', id: 'f-' + id + '-err' }));
  }

  /* What a visitor can ask a company for: the silica grades, or its products */
  function productsOf(co, C) {
    if (co.id === 'silica' && C.silica) {
      return C.silica.grades.map(function (g) { var d = GG.deep(g); return { name: d.name, label: d.name + ' (' + d.code + ')' }; });
    }
    var items = (co.products ? GG.deep(co.products.items) : GG.deep(co.keyProducts)) || [];
    return items.map(function (it) {
      var n = typeof it === 'string' ? it : GG.txt(it.name);
      return { name: n, label: n };
    });
  }

  GG.sections.contact = {
    render: function (root, C) {
      var co = GG.page.company;
      var k = C.contact, F = k.form.fields, c = C.facts.contact;
      var head = co
        ? { kicker: co.cta.label, title: co.contact.title, lede: co.contact.lede }
        : { kicker: k.kicker, title: k.title, lede: k.lede };

      /* the list of products, one group per company. Each value reads plainly
         in the sales inbox: "Ghanshyam Kaolin: Paper grade kaolin" */
      var options = [h('option', { value: '', disabled: true, selected: true, text: F.interest.placeholder })];
      (co ? [co] : GG.companies()).forEach(function (x) {
        var name = GG.txt(x.name), choose = GG.txt(F.interest.choose);
        options.push(h('optgroup', { label: name },
          [h('option', { value: name + ': ' + choose, 'data-company': x.id, 'data-product': '' }, choose)]
            .concat(productsOf(x, C).map(function (p) {
              return h('option', { value: name + ': ' + p.label, 'data-company': x.id, 'data-product': p.name }, p.label);
            }))));
      });
      if (!co) {
        options.push(h('option', { value: GG.txt(F.interest.unsure), 'data-company': '' }, GG.txt(F.interest.unsure)));
        options.push(h('option', { value: GG.txt(F.interest.other), 'data-company': '' }, GG.txt(F.interest.other)));
      }

      var form = h('form', { class: 'rq-form', novalidate: true, action: k.form.endpoint || '#', method: 'post' },
        h('div', { class: 'rq-form__summary', role: 'alert', tabindex: '-1', hidden: true }),
        h('div', { class: 'rq-form__grid' },
          field('name', F.name, 'text', true),
          field('company', F.company, 'text', true),
          field('email', F.email, 'email', true),
          field('phone', F.phone, 'tel', false),
          field('interest', F.interest, 'select', true, options),
          field('volume', F.volume, 'text', false),
          field('message', F.message, 'textarea', false)),
        /* which company the enquiry is for, so the right team answers it */
        h('input', { type: 'hidden', name: 'business', value: GG.txt(co ? co.name : C.facts.company.groupName) }),
        h('input', { type: 'text', name: '_gotcha', class: 'rq-form__trap', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' }),
        h('div', { class: 'rq-form__foot' },
          h('button', { class: 'btn rq-form__submit', type: 'submit' },
            h('span', { class: 'rq-form__submit-label', text: co ? co.cta.submit : k.form.submit }), GG.icon('arrow-right', 'btn__arrow')),
          h('p', { class: 'rq-form__privacy', text: k.form.privacy })));

      var success = h('div', { class: 'rq-success', hidden: true, tabindex: '-1', role: 'status' },
        h('span', { class: 'rq-success__icon' }, GG.icon('check')),
        h('h3', { class: 'rq-success__title', text: k.form.success.title }),
        h('p', { class: 'rq-success__text' }),
        h('p', { class: 'rq-success__demo mono', hidden: true, text: k.form.success.demo }),
        h('button', { class: 'link rq-success__again', type: 'button' }, GG.icon('refresh'), h('span', { text: k.form.success.again })));

      var tel = GG.txt(c.phone).replace(/[^+\d]/g, '');
      var wa = GG.txt(c.whatsapp).replace(/[^\d]/g, '');
      var channel = function (icon, label, value, href, sampleSrc) {
        var inner = [h('span', { class: 'ch__icon' }, GG.icon(icon)), h('span', { class: 'ch__text' }, h('span', { class: 'ch__label mono', text: label }), h('span', { class: 'ch__value', text: value }))];
        return h('li', null, href ? h('a', { class: 'ch', href: href, sample: sampleSrc }, inner) : h('div', { class: 'ch', sample: sampleSrc }, inner));
      };

      var mapHref = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(GG.txt(c.mapQuery));
      var mapLink = h('a', { class: 'link', href: mapHref, target: '_blank', rel: 'noopener' },
        GG.icon('pin'), h('span', { text: k.mapLink }), h('span', { class: 'sr-only' }, ' ' + GG.txt((C.ui || {}).opensInNewTab)));
      var map = co && co.contact && co.contact.map;

      root.appendChild(h('div', { class: 'container contact__grid' },
        GG.head(head, 'contact-title', { cls: 'contact__head' }),
        h('div', { class: 'contact__info' },
          h('div', { 'data-reveal': '', class: 'contact__blocks' },
            h('div', null,
              h('h3', { class: 'contact__h mono', text: k.channelsTitle }),
              h('ul', { class: 'channels', role: 'list' },
                channel('phone', GG.txt(k.channels.phone), c.phone, 'tel:' + tel, c.phone),
                channel('whatsapp', GG.txt(k.channels.whatsapp), c.whatsapp, 'https://wa.me/' + wa, c.whatsapp),
                channel('mail', GG.txt(k.channels.email), c.email, 'mailto:' + GG.txt(c.email), c.email),
                channel('clock', GG.txt(k.channels.hours), c.hours, null, c.hours))),
            h('div', null,
              h('h3', { class: 'contact__h mono', text: k.officesTitle }),
              h('div', { class: 'offices' },
                k.offices.map(function (o) {
                  var lines = GG.fact(o.fact);
                  return h('address', { class: 'office', sample: lines },
                    h('span', { class: 'office__title', text: o.title }),
                    (GG.deep(lines) || []).map(function (l) { return h('span', null, l); }));
                })),
              map ? null : h('p', { class: 'contact__maplink' }, mapLink)),
            map ? h('figure', { class: 'contact__map' }, GG.img(map, { width: 800, height: 600 }), h('figcaption', null, mapLink)) : null)),
        h('div', { class: 'contact__formwrap', 'data-reveal': '' },
          h('div', { class: 'rq-card' }, form, success))));
    },

    init: function (root, C) {
      var co = GG.page.company;
      var k = C.contact, E = k.form.errors;
      var form = root.querySelector('.rq-form');
      var success = root.querySelector('.rq-success');
      var summary = root.querySelector('.rq-form__summary');
      var submit = root.querySelector('.rq-form__submit');
      var submitLabel = root.querySelector('.rq-form__submit-label');
      var submitText = co ? co.cta.submit : k.form.submit;
      var endpoint = GG.txt(k.form.endpoint).trim();
      var sel = form.elements.interest;
      var biz = form.elements.business;
      var message = form.elements.message;
      var defaultBiz = biz.value;
      var tried = false;
      var autoMsg = null;   /* words the page wrote into the message itself: only these are ever replaced */

      function setErr(name, msg) {
        var input = form.elements[name];
        var err = root.querySelector('#f-' + name + '-err');
        var wrap = input.closest('.field');
        if (msg) {
          input.setAttribute('aria-invalid', 'true');
          wrap.classList.add('has-error');
          err.textContent = msg;
        } else {
          input.removeAttribute('aria-invalid');
          wrap.classList.remove('has-error');
          err.textContent = '';
        }
        return !msg;
      }
      function check(name) {
        var v = (form.elements[name].value || '').trim();
        if (['name', 'company', 'email', 'interest'].indexOf(name) > -1 && !v) return setErr(name, GG.txt(E.required));
        if (name === 'email' && v && !EMAIL.test(v)) return setErr(name, GG.txt(E.email));
        if (name === 'phone' && v && !PHONE.test(v)) return setErr(name, GG.txt(E.phone));
        return setErr(name, '');
      }
      var names = ['name', 'company', 'email', 'phone', 'interest', 'volume', 'message'];
      names.forEach(function (n) {
        var el = form.elements[n];
        el.addEventListener('blur', function () { if (tried || el.value) check(n); });
        el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) check(n); });
        el.addEventListener('change', function () { if (tried) check(n); });
      });

      /* ---- which company and product ------------------------------------------ */
      function chosen() { return sel.options[sel.selectedIndex]; }
      function syncBusiness() {
        var o = chosen();
        var x = o && o.getAttribute('data-company') ? GG.company(o.getAttribute('data-company')) : null;
        biz.value = x ? GG.txt(x.name) : defaultBiz;
      }
      function productText(product) { return GG.txt((C.ui || {}).productMessage, { product: product }); }
      function fillMessage(text) {
        if (!message.value || message.value === autoMsg) { message.value = text; autoMsg = text; }
      }
      function clearAutoMessage() {
        if (autoMsg && message.value === autoMsg) message.value = '';
        autoMsg = null;
      }
      /* the visitor changes the product: our own words follow, theirs stay */
      sel.addEventListener('change', function () {
        syncBusiness();
        if (autoMsg && message.value === autoMsg) {
          var p = chosen() && chosen().getAttribute('data-product');
          if (p) fillMessage(productText(p)); else clearAutoMessage();
        }
      });
      function pick(companyId, product) {
        var o = null;
        Array.prototype.forEach.call(sel.options, function (x) {
          if (!o && x.getAttribute('data-company') === companyId && (x.getAttribute('data-product') || '') === (product || '')) o = x;
        });
        if (!o) return null;
        if (o.value !== sel.value) clearAutoMessage();
        sel.value = o.value;
        syncBusiness();
        if (tried) check('interest');
        var host = sel.closest('.field');
        host.classList.remove('flash'); void host.offsetWidth; host.classList.add('flash');
        return o;
      }

      /* "Enquire" on a company card or a product card */
      document.addEventListener('gg:enquire', function (e) {
        var d = e.detail || {};
        var o = pick(d.company, d.product || '');
        if (o && d.product) fillMessage(productText(d.product));
      });
      /* the silica grade panel: "Request this grade" and "Ask for the full spec sheet" */
      document.addEventListener('gg:grade', function (e) {
        var d = e.detail || {};
        var g = null;
        ((C.silica && C.silica.grades) || []).forEach(function (x) { var v = GG.deep(x); if (v.id === d.id) g = v; });
        if (!g) return;
        var o = pick('silica', g.name);
        if (o && d.sheet) fillMessage(GG.txt((C.ui || {}).specSheetMessage, { grade: o.textContent }));
      });

      /* ---- sending ------------------------------------------------------------------ */
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        tried = true;
        var bad = names.filter(function (n) { return !check(n); });
        if (bad.length) {
          summary.hidden = false;
          summary.textContent = GG.txt(E.summary);
          form.elements[bad[0]].focus();
          return;
        }
        summary.hidden = true;
        if (form.elements._gotcha.value) return; /* a bot filled the hidden field */
        var name = form.elements.name.value.trim().split(' ')[0];

        if (!endpoint) { done(name, true); return; }
        submit.disabled = true;
        GG.setText(submitLabel, k.form.sending);
        fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); done(name, false); })
          .catch(function () {
            summary.hidden = false;
            summary.textContent = GG.txt(E.network);
            summary.focus();
          })
          .finally(function () { submit.disabled = false; GG.setText(submitLabel, submitText); });
      });

      function done(name, demo) {
        GG.setText(success.querySelector('.rq-success__text'), k.form.success.text, { name: name });
        success.querySelector('.rq-success__demo').hidden = !demo;
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }
      root.querySelector('.rq-success__again').addEventListener('click', function () {
        form.reset();
        tried = false;
        autoMsg = null;
        syncBusiness();
        names.forEach(function (n) { setErr(n, ''); });
        success.hidden = true;
        form.hidden = false;
        form.elements.name.focus();
      });
    }
  };
})();
