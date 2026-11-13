/**
 * Codercub registration -> Google Sheet (no Google Form involved)
 * Paste into Extensions > Apps Script of your Sheet. See README.md.
 */
var SHEET_NAME = 'Registrations';
var NOTIFY_EMAIL = '';   // optional: an e-mail address to notify on each new registration

var COLUMNS = [
  ['Огноо',            function () { return Utilities.formatDate(new Date(), 'Asia/Ulaanbaatar', 'yyyy-MM-dd HH:mm:ss'); }],
  ['Хөтөлбөр',         'program'],
  ['Овог',             'last'],
  ['Нэр',              'first'],
  ['Хүйс',             'gender'],
  ['Анги',             'grade'],
  ['Сургууль',         'school'],
  ['Байршил',          'place'],
  ['Утас',             'phone'],
  ['Эцэг эхийн и-мэйл','email'],
  ['Бусад асуулт',     'note'],
  ['Төлбөрийн нөхцөл зөвшөөрсөн', 'consent'],
  ['Статус',           function () { return 'Шинэ'; }]
];

// Stop cell values that start with = + - @ from being treated as formulas.
function clean_(v) {
  v = (v == null ? '' : String(v)).slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var p = (e && e.parameter) || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(COLUMNS.map(function (c) { return c[0]; }));
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    }
    sh.appendRow(COLUMNS.map(function (c) {
      return typeof c[1] === 'function' ? c[1](p) : clean_(p[c[1]]);
    }));
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'Шинэ бүртгэл: ' + clean_(p.program),
        clean_(p.last) + ' ' + clean_(p.first) + ', ' + clean_(p.grade) + '\n' + clean_(p.phone) + ' · ' + clean_(p.email));
    }
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return ContentService.createTextOutput('Codercub registration endpoint'); }
