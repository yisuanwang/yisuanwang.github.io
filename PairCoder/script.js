// Tabbed galleries (scoped per .tabs group). Groups with data-auto="<ms>"
// rotate through their tabs automatically: paused on hover, stopped for good
// once the user clicks a tab.
document.querySelectorAll('.tabs').forEach(function (group) {
  var tabs = Array.prototype.slice.call(group.querySelectorAll('.tab'));
  var panels = group.nextElementSibling; // the .tab-panels right after
  if (!panels) return;

  function activate(tab) {
    tabs.forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    panels.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
    var target = panels.querySelector('#' + tab.dataset.tab);
    if (target) target.classList.add('active');
  }

  var interval = parseInt(group.dataset.auto, 10) || 0;
  var timer = null;
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
  function startAuto() {
    if (!interval) return;
    stopAuto();
    timer = setInterval(function () {
      var i = tabs.findIndex(function (t) { return t.classList.contains('active'); });
      activate(tabs[(i + 1) % tabs.length]);
    }, interval);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activate(tab);
      interval = 0;   // user took over — stop auto-rotation permanently
      stopAuto();
    });
  });

  if (interval) {
    group.addEventListener('mouseenter', stopAuto);
    group.addEventListener('mouseleave', startAuto);
    panels.addEventListener('mouseenter', stopAuto);
    panels.addEventListener('mouseleave', startAuto);
    startAuto();
  }
});

// Copy BibTeX
var copyBtn = document.getElementById('copyBib');
if (copyBtn) {
  copyBtn.addEventListener('click', function () {
    var text = document.querySelector('pre.bib code').innerText;
    navigator.clipboard.writeText(text).then(function () {
      copyBtn.textContent = 'Copied ✓';
      copyBtn.classList.add('done');
      setTimeout(function () {
        copyBtn.textContent = 'Copy BibTeX';
        copyBtn.classList.remove('done');
      }, 1800);
    });
  });
}

// Active nav link on scroll
var sections = document.querySelectorAll('section[id], header[id]');
var navlinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', function () {
  var pos = window.scrollY + 120;
  sections.forEach(function (sec) {
    var link = document.querySelector('.nav-links a[href="#' + sec.id + '"]');
    if (!link) return;
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      navlinks.forEach(function (l) { l.style.color = ''; });
      link.style.color = 'var(--brand)';
    }
  });
});
