/* CONTACT: the sample request form (the one call to action), direct
   channels, addresses and the map. Client-side validation, honest success
   state: in demo mode it says that nothing was sent. */
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
      label, input, h('p', { class: 'field__err', id: 'f-' + id + '-err', 'aria-live': 'polite' }));
  }

  GG.sections.contact = {
    render: function (root, C) {
      var k = C.contact, F = k.form.fields, c = C.facts.contact;
      var grades = C.silica.grades.map(GG.deep);
      var options = [
        h('option', { value: '', disabled: true, selected: true, text: F.grade.placeholder }),
        h('optgroup', { label: GG.txt(F.grade.silicaGroup) },
          grades.map(function (g) { return h('option', { value: g.id }, g.name + ' (' + g.code + ')'); })),
        h('optgroup', { label: GG.txt(F.grade.otherGroup) },
          C.group.companies.map(function (co) { return h('option', { value: co.id }, GG.txt(co.name)); })),
        h('option', { value: 'unsure', text: F.grade.other })
      ];

      var form = h('form', { class: 'rq-form', novalidate: true, action: k.form.endpoint || '#', method: 'post' },
        h('div', { class: 'rq-form__summary', role: 'alert', tabindex: '-1', hidden: true }),
        h('div', { class: 'rq-form__grid' },
          field('name', F.name, 'text', true),
          field('company', F.company, 'text', true),
          field('email', F.email, 'email', true),
          field('phone', F.phone, 'tel', false),
          field('grade', F.grade, 'select', true, options),
          field('volume', F.volume, 'text', false),
          field('message', F.message, 'textarea', false)),
        h('input', { type: 'text', name: '_gotcha', class: 'rq-form__trap', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' }),
        h('div', { class: 'rq-form__foot' },
          h('button', { class: 'btn rq-form__submit', type: 'submit' }, h('span', { class: 'rq-form__submit-label', text: k.form.submit }), GG.icon('arrow-right', 'btn__arrow')),
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

      root.appendChild(h('div', { class: 'container contact__grid' },
        GG.head(k, 'contact-title', { cls: 'contact__head' }),
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
                }))),
            h('figure', { class: 'contact__map' },
              GG.img(k.map, { width: 800, height: 600 }),
              h('figcaption', null, h('a', { class: 'link', href: mapHref, target: '_blank', rel: 'noopener' }, GG.icon('pin'), h('span', { text: k.mapLink }), h('span', { class: 'sr-only' }, ' ' + GG.txt((C.ui || {}).opensInNewTab))))))),
        h('div', { class: 'contact__formwrap', 'data-reveal': '' },
          h('div', { class: 'rq-card' }, form, success))));
    },

    init: function (root, C) {
      var k = C.contact, E = k.form.errors;
      var form = root.querySelector('.rq-form');
      var success = root.querySelector('.rq-success');
      var summary = root.querySelector('.rq-form__summary');
      var submit = root.querySelector('.rq-form__submit');
      var submitLabel = root.querySelector('.rq-form__submit-label');
      var endpoint = GG.txt(k.form.endpoint).trim();
      var tried = false;

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
        if (['name', 'company', 'email', 'grade'].indexOf(name) > -1 && !v) return setErr(name, GG.txt(E.required));
        if (name === 'email' && v && !EMAIL.test(v)) return setErr(name, GG.txt(E.email));
        if (name === 'phone' && v && !PHONE.test(v)) return setErr(name, GG.txt(E.phone));
        return setErr(name, '');
      }
      var names = ['name', 'company', 'email', 'phone', 'grade', 'volume', 'message'];
      names.forEach(function (n) {
        var el = form.elements[n];
        el.addEventListener('blur', function () { if (tried || el.value) check(n); });
        el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) check(n); });
        el.addEventListener('change', function () { if (tried) check(n); });
      });

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
          .finally(function () { submit.disabled = false; GG.setText(submitLabel, k.form.submit); });
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
        names.forEach(function (n) { setErr(n, ''); });
        success.hidden = true;
        form.hidden = false;
        form.elements.name.focus();
      });

      /* "Request this grade" buttons elsewhere on the page pre-fill the form */
      document.addEventListener('gg:grade', function (e) {
        var id = e.detail && e.detail.id;
        var sel = form.elements.grade;
        if (id && sel.querySelector('option[value="' + id + '"]')) {
          sel.value = id;
          if (tried) check('grade');
          var host = sel.closest('.field');
          host.classList.remove('flash'); void host.offsetWidth; host.classList.add('flash');
        }
        if (e.detail && e.detail.sheet && !form.elements.message.value) {
          var opt = sel.options[sel.selectedIndex];
          form.elements.message.value = GG.txt((C.ui || {}).specSheetMessage, { grade: opt && opt.value ? opt.textContent : '' });
        }
        /* product cards name the product they came from */
        if (e.detail && e.detail.product && !form.elements.message.value) {
          form.elements.message.value = GG.txt((C.ui || {}).productMessage, { product: e.detail.product });
        }
      });
    }
  };
})();
