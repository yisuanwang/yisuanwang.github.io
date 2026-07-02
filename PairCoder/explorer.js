/* Interactive explorer over the full main-results table (PC_DATA from data.js). */
(function () {
  if (typeof PC_DATA === 'undefined') return;
  var canvas = document.getElementById('pcChart');
  if (!canvas || typeof Chart === 'undefined') {
    if (canvas) canvas.closest('.explorer').innerHTML =
      '<p style="color:#43586a">Interactive chart needs an internet connection to load Chart.js. The full numbers are in the table above and in the paper.</p>';
    return;
  }

  var C_SINGLE = '#c2cedd', C_SINGLE_B = '#aab8c9';
  var C_PAIR = '#1f6feb', C_PAIR_B = '#1450b0';
  var models = PC_DATA.models;
  var benches = PC_DATA.benchmarks;

  var selBench = document.getElementById('sel-bench');
  var selMetric = document.getElementById('sel-metric');
  var selModel = document.getElementById('sel-model');
  var lblBench = document.getElementById('lbl-bench');
  var lblMetric = document.getElementById('lbl-metric');
  var lblModel = document.getElementById('lbl-model');
  var note = document.getElementById('ex-note');
  var segBtns = document.querySelectorAll('.seg-btn');
  var selectors = document.getElementById('ex-selectors');
  var legend = document.getElementById('ex-legend');
  var tableBox = document.getElementById('ex-table');
  var chartBox = document.getElementById('ex-chart');
  var mode = 'table';
  var chart = null;
  var curDown = false;

  var C_IMP = '#2e9e4f', C_IMP_B = '#1f7a3a';
  var C_REG = '#d64545', C_REG_B = '#b5302f';
  var C_TIE = '#9fb1c4', C_TIE_B = '#8195aa';

  // --- populate benchmark select grouped by family ---
  var fam = {};
  benches.forEach(function (b, i) {
    (fam[b.family] = fam[b.family] || []).push({ name: b.name, i: i });
  });
  Object.keys(fam).forEach(function (f) {
    var og = document.createElement('optgroup'); og.label = f;
    fam[f].forEach(function (o) {
      var opt = document.createElement('option'); opt.value = o.i; opt.textContent = o.name; og.appendChild(opt);
    });
    selBench.appendChild(og);
  });
  // model select
  models.forEach(function (m, i) {
    var opt = document.createElement('option'); opt.value = i; opt.textContent = m; selModel.appendChild(opt);
  });

  function fmt(v, down) { return v == null ? 'n/a' : v.toFixed(3); }

  function populateMetric() {
    var b = benches[+selBench.value];
    selMetric.innerHTML = '';
    b.metrics.forEach(function (m, j) {
      var opt = document.createElement('option'); opt.value = j;
      opt.textContent = m.name + (m.dir === 'down' ? ' ↓' : ' ↑');
      selMetric.appendChild(opt);
    });
  }

  function deltaStr(s, p, down) {
    if (s == null || p == null) return '';
    var d = p - s, better = down ? d < 0 : d > 0, eq = Math.abs(d) < 1e-9;
    var sign = d > 0 ? '+' : '';
    var tag = eq ? 'tie' : (better ? 'better' : 'worse');
    return '  (Δ ' + sign + d.toFixed(3) + ', ' + tag + ')';
  }

  function pairColors(single, pair, down) {
    var fill = [], border = [];
    pair.forEach(function (p, i) {
      var s = single[i];
      if (s == null || p == null) { fill.push(C_PAIR); border.push(C_PAIR_B); return; }
      var d = p - s;
      if (Math.abs(d) < 1e-9) { fill.push(C_TIE); border.push(C_TIE_B); }
      else if (down ? d < 0 : d > 0) { fill.push(C_IMP); border.push(C_IMP_B); }
      else { fill.push(C_REG); border.push(C_REG_B); }
    });
    return { fill: fill, border: border };
  }

  // draw the improvement delta (▲/▼ signed) above each PairCoder bar
  var deltaPlugin = {
    id: 'deltaLabels',
    afterDatasetsDraw: function (c) {
      var meta = c.getDatasetMeta(1); if (!meta) return;
      var single = c.data.datasets[0].data, pair = c.data.datasets[1].data;
      var ctx = c.ctx; ctx.save();
      ctx.font = '700 10px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
      meta.data.forEach(function (bar, i) {
        var s = single[i], p = pair[i];
        if (s == null || p == null) return;
        var d = p - s; if (Math.abs(d) < 1e-9) return;
        var better = curDown ? d < 0 : d > 0;
        ctx.fillStyle = better ? C_IMP_B : C_REG_B;
        ctx.fillText((better ? '▲' : '▼') + (d > 0 ? '+' : '') + d.toFixed(2), bar.x, bar.y - 5);
      });
      ctx.restore();
    }
  };

  function build(labels, single, pair, down, titleNote) {
    if (chart) chart.destroy();
    curDown = down;
    var pc = pairColors(single, pair, down);
    chart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Single model', data: single, backgroundColor: C_SINGLE, borderColor: C_SINGLE_B, borderWidth: 1, borderRadius: 4 },
          { label: 'PairCoder', data: pair, backgroundColor: pc.fill, borderColor: pc.border, borderWidth: 1, borderRadius: 4 }
        ]
      },
      plugins: [deltaPlugin],
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterBody: function (items) {
                var i = items[0].dataIndex;
                var s = single[i], p = pair[i];
                return 'Single ' + fmt(s) + '  →  PairCoder ' + fmt(p) + deltaStr(s, p, down);
              }
            },
            titleFont: { family: 'Inter' }, bodyFont: { family: 'JetBrains Mono', size: 11 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grace: '14%',
            title: { display: !!titleNote, text: titleNote || '', font: { family: 'Inter', size: 12 } },
            grid: { color: '#eef2f7' }, ticks: { font: { family: 'JetBrains Mono', size: 11 } }
          },
          x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, maxRotation: 40, minRotation: 0 } }
        }
      }
    });
  }

  function renderBench() {
    var b = benches[+selBench.value];
    var m = b.metrics[+selMetric.value];
    var labels = [], single = [], pair = [];
    m.cells.forEach(function (c, k) {
      if (c == null) return;            // vision benchmark on a text-only model
      labels.push(models[k]); single.push(c[0]); pair.push(c[1]);
    });
    var down = m.dir === 'down';
    build(labels, single, pair, down, m.name + (down ? ' (lower is better)' : ''));
    var skipped = m.cells.filter(function (c) { return c == null; }).length;
    note.innerHTML = '<strong>' + b.name + '</strong> &middot; ' + m.name +
      (down ? ' (lower is better).' : ' (higher is better).') +
      ' Each model has two bars: single generation (gray) and PairCoder. <strong>PairCoder bars are ' +
      '<span style="color:#1f7a3a">green when PairCoder improves</span></strong>, red when it regresses, gray on a tie, ' +
      'with the signed delta drawn above the bar.' +
      (skipped ? ' ' + skipped + ' text-only model(s) omitted (this benchmark needs image input).' : '') +
      ' Visual metrics are aggregates that score non-rendering generations as 0.';
  }

  function renderModel() {
    var mi = +selModel.value;
    var labels = [], single = [], pair = [];
    benches.forEach(function (b) {
      var m = b.metrics[0];               // primary metric (all rates / pass@1, range 0-1)
      if (m.dir === 'down') return;       // skip distance metrics to keep one 0-1 axis
      var c = m.cells[mi];
      if (c == null) return;
      labels.push(b.name); single.push(c[0]); pair.push(c[1]);
    });
    build(labels, single, pair, false, 'primary metric (higher is better)');
    note.innerHTML = '<strong>' + models[mi] + '</strong> across every applicable benchmark, on its primary metric ' +
      '(pass@1 / execution / compile / render rate). Gray bar = single model; PairCoder bar is ' +
      '<strong><span style="color:#1f7a3a">green where PairCoder improves</span></strong>, red where it regresses, ' +
      'with the signed delta above each bar. Vision benchmarks appear only for vision-capable models.';
  }

  function cls(s, p, down) {
    if (s == null || p == null) return 'na';
    var d = p - s;
    if (Math.abs(d) < 1e-9) return 'tie';
    return (down ? d < 0 : d > 0) ? 'imp' : 'reg';
  }

  function renderTable() {
    var h = '<table class="pc-grid"><thead><tr><th class="b">Benchmark</th><th class="m">Metric</th>';
    models.forEach(function (m) { h += '<th>' + m + '</th>'; });
    h += '</tr></thead><tbody>';
    var lastFam = null;
    benches.forEach(function (b) {
      if (b.family !== lastFam) {
        h += '<tr class="fam"><td colspan="9">' + b.family + '</td></tr>';
        lastFam = b.family;
      }
      b.metrics.forEach(function (m, j) {
        h += '<tr>';
        if (j === 0) h += '<td class="b" rowspan="' + b.metrics.length + '">' + b.name + '</td>';
        h += '<td class="m">' + m.name + (m.dir === 'down' ? ' ↓' : ' ↑') + '</td>';
        m.cells.forEach(function (c) {
          var k = cls(c ? c[0] : null, c ? c[1] : null, m.dir === 'down');
          if (c == null) { h += '<td class="cell na">–</td>'; return; }
          var d = c[1] - c[0], sign = d > 0 ? '+' : '';
          var better = (m.dir === 'down' ? d < 0 : d > 0);
          var s = c[0].toFixed(3), p = c[1].toFixed(3);
          var inner = better ? s + '→<b>' + p + '</b>' : '<b>' + s + '</b>→' + p;
          if (Math.abs(d) < 1e-9) inner = s + '→' + p;
          h += '<td class="cell ' + k + '" title="Δ ' + sign + d.toFixed(3) + '">' + inner + '</td>';
        });
        h += '</tr>';
      });
    });
    h += '</tbody></table>';
    tableBox.innerHTML = h;
    note.innerHTML = 'Every cell is <em>single model → PairCoder</em> on each benchmark&rsquo;s official metric. ' +
      'Bold marks the better arm. Green = PairCoder improves, red = regresses, gray = tie, &ldquo;–&rdquo; = not applicable ' +
      '(vision benchmarks need image input, so text-only models are excluded). Visual metrics are aggregates that score ' +
      'non-rendering generations as 0. Hover any cell for the delta; scroll sideways on narrow screens.';
  }

  function render() {
    if (mode === 'table') return renderTable();
    return mode === 'bench' ? renderBench() : renderModel();
  }

  // --- events ---
  selBench.addEventListener('change', function () { populateMetric(); render(); });
  selMetric.addEventListener('change', render);
  selModel.addEventListener('change', render);
  segBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      segBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      mode = btn.dataset.mode;
      var tableMode = mode === 'table';
      var benchMode = mode === 'bench';
      selectors.hidden = tableMode;
      legend.hidden = !tableMode;
      tableBox.hidden = !tableMode;
      chartBox.hidden = tableMode;
      if (!tableMode) {
        lblBench.hidden = !benchMode; lblMetric.hidden = !benchMode; lblModel.hidden = benchMode;
      }
      render();
    });
  });

  // --- init ---
  selBench.value = benches.findIndex(function (b) { return b.name === '3DCodeBench'; });
  populateMetric();
  render();
})();
