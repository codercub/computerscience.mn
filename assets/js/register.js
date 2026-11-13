(function () {
  // Paste the Apps Script Web App URL here (see apps-script/README.md).
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycby7AMZ60HB1lFD7w1M7Lm6l6yFzE4YPN5Rwp5_aFqa11Ob4WUecBmJRIBDfUn9TbeYe/exec';
  var FIELDS = ['program','first','last','gender','phone','email','school','grade','place','note','consent'];

  var form = document.getElementById('regForm');
  if (!form) return;
  var btn = document.getElementById('regBtn');
  var statusEl = document.getElementById('regStatus');
  var done = document.getElementById('regDone');
  var program = document.getElementById('program');
  var hint = document.getElementById('progHint');

  var HINTS = {
    'cs1': 'CS1 — Carnegie Mellon-ийн суурь хөтөлбөр, 7–12-р ангийн сурагчдад. Өвлийн элсэлт: 2026.12.21 эхэлнэ.',
    'cpcs': 'CPCS нь CS1-ийг дүүргэсэн сурагчдад зориулагдсан.',
    'python-basics': 'Python Basics — Block coding-оос Python руу шилжих анхан шатны хөтөлбөр.',
    'block-coding': 'Block Coding — анхан шатны хөтөлбөр.',
    'future': 'Future Intelligence Lab — ахлах ангийн сурагчдад зориулсан жилийн AI хөтөлбөр.'
  };
  function showHint() {
    var o = program.options[program.selectedIndex];
    var t = o && HINTS[o.getAttribute('data-key')];
    hint.hidden = !t; hint.textContent = t || '';
  }
  program.addEventListener('change', showHint);

  var q = new URLSearchParams(location.search).get('program');
  if (q) {
    Array.prototype.forEach.call(program.options, function (o) {
      if (o.getAttribute('data-key') === q) program.value = o.value;
    });
  }
  showHint();

  function setStatus(msg, bad) {
    statusEl.textContent = msg || '';
    statusEl.className = 'reg-status' + (bad ? ' bad' : '');
  }

  function finish() {
    form.hidden = true; done.hidden = false;
    window.scrollTo({ top: done.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements['website'].value) return; // honeypot
    if (!form.checkValidity()) { form.reportValidity(); return; }

    btn.disabled = true; setStatus('Илгээж байна…');

    var d = new URLSearchParams();
    FIELDS.forEach(function (k) {
      var el = form.elements[k]; if (!el) return;
      d.append(k, el.type === 'checkbox' ? (el.checked ? 'yes' : '') : el.value.trim());
    });
    d.append('page', location.href);

    fetch(ENDPOINT, { method: 'POST', body: d })
      .then(function (r) { return r.text(); })
      .then(function (t) {
        if (t.trim() !== 'ok') throw new Error('bad response');
        finish();
      })
      .catch(function () {
        btn.disabled = false;
        setStatus('Илгээж чадсангүй. Дахин оролдох эсвэл 7220-4455 руу залгана уу.', true);
      });
  });
})();
