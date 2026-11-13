(function () {
  // Paste the Apps Script Web App URL here (see apps-script/README.md).
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyCijGiCyyLuGVvm45oJZDMvshhbN6r60zndLB5xOsW_NYUPOp3bGZWYSNd3mAl67_SBQ/exec';
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
    var ref = document.getElementById('payRef');
    if (ref) {
      var nm = (form.elements['last'].value + ' ' + form.elements['first'].value).trim();
      var pr = program.options[program.selectedIndex];
      ref.textContent = nm + (pr && pr.getAttribute('data-key') ? ' — ' + pr.text.split(' · ')[0] : '');
    }
    form.hidden = true; done.hidden = false;
    window.scrollTo({ top: done.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }

  var copyBtn = document.getElementById('copyAcct');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var text = document.getElementById('payAcct').textContent.trim();
    function ok() {
      copyBtn.textContent = 'Хууллаа ✓'; copyBtn.classList.add('done');
      setTimeout(function () { copyBtn.textContent = 'Хуулах'; copyBtn.classList.remove('done'); }, 2200);
    }
    function legacy() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, legacy); else legacy();
  });

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

    function fail(code, detail) {
      try { console.error('[register]', code, detail || ''); } catch (x) {}
      btn.disabled = false;
      setStatus('Илгээж чадсангүй (код: ' + code + '). Дахин оролдох эсвэл 7220-4455 руу залгана уу.', true);
    }

    fetch(ENDPOINT, { method: 'POST', body: d })
      .then(function (r) {
        return r.text().then(function (t) {
          if (t.trim() === 'ok') return finish();
          fail('script-' + r.status, t.slice(0, 200));
        });
      })
      .catch(function (err) { fail('network', err && err.message); });
  });
})();
