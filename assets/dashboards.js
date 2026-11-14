// Dashboards ilustrativos — todos os dados são fictícios.
(function () {
  if (!window.Chart) return;
  const NAVY = '#0b2a55', TEAL = '#7aa6b2', GREY = '#cfcfcf', STEEL = '#4b6f96';
  const months = ['Mai', 'Jun', 'Jul'];
  const built = {};

  function base(light, extra) {
    const c = light ? '#3a4352' : '#c9cfda';
    return Object.assign({
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: c, boxWidth: 10, boxHeight: 10, font: { size: 11 } } },
        tooltip: { enabled: true }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: c, font: { size: 11 } } },
        y: { display: false, beginAtZero: true, grace: '12%' }
      }
    }, extra || {});
  }
  const labels = {
    id: 'valueLabels',
    afterDatasetsDraw(chart, _a, opts) {
      if (!opts || !opts.on) return;
      const { ctx } = chart;
      ctx.save();
      ctx.font = '600 10px Inter, system-ui, sans-serif';
      ctx.fillStyle = opts.color || '#1d2433';
      ctx.textAlign = 'center';
      chart.data.datasets.forEach((ds, i) => {
        const meta = chart.getDatasetMeta(i);
        if (meta.type !== 'bar' || meta.hidden) return;
        meta.data.forEach((el, j) => {
          const v = ds.data[j];
          const txt = opts.fmt ? opts.fmt(v) : v.toLocaleString('pt-BR');
          if (chart.options.indexAxis === 'y') { ctx.textAlign = 'left'; ctx.fillText(txt, el.x + 4, el.y + 3); }
          else ctx.fillText(txt, el.x, el.y - 4);
        });
      });
      ctx.restore();
    }
  };
  Chart.register(labels);
  Chart.register({ id: 'pctLabels', afterDatasetsDraw(chart) {
    const { ctx } = chart; ctx.save(); ctx.font = '600 10px Inter, system-ui, sans-serif'; ctx.fillStyle = '#1d2433'; ctx.textAlign = 'center';
    chart.data.datasets.forEach((ds, i) => { if (!ds.pctLabels) return;
      chart.getDatasetMeta(i).data.forEach((el, j) => ctx.fillText(ds.data[j].toFixed(1).replace('.', ',') + '%', el.x, el.y - 8)); });
    ctx.restore(); } });

  function oc(id, opened, closed, light = true) {
    return new Chart(document.getElementById(id), {
      type: 'bar',
      data: { labels: months, datasets: [
        { label: 'Abertos', data: opened, backgroundColor: TEAL, borderRadius: 2 },
        { label: 'Fechados', data: closed, backgroundColor: NAVY, borderRadius: 2 }] },
      options: base(light, { plugins: Object.assign(base(light).plugins, { valueLabels: { on: true } }) })
    });
  }
  function donut(id, lab, data, colors, light = true, center) {
    return new Chart(document.getElementById(id), {
      type: 'doughnut',
      data: { labels: lab, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: light ? '#fff' : '#22242c' }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, cutout: '58%',
        plugins: { legend: { position: 'right', labels: { color: light ? '#3a4352' : '#c9cfda', boxWidth: 10, font: { size: 11 } } },
          centerText: { text: center, color: light ? '#1d2433' : '#fff' } }
      },
      plugins: [{
        id: 'centerText',
        afterDraw(ch, _a, o) {
          if (!o || !o.text) return;
          const { ctx, chartArea: a } = ch; const m = ch.getDatasetMeta(0).data[0];
          if (!m) return;
          ctx.save(); ctx.fillStyle = o.color; ctx.textAlign = 'center';
          ctx.font = '700 15px Inter, system-ui, sans-serif'; ctx.fillText(o.text[0], m.x, m.y + 2);
          ctx.font = '11px Inter, system-ui, sans-serif'; ctx.fillText(o.text[1], m.x, m.y + 16);
          ctx.restore();
        }
      }]
    });
  }

  const builders = {
    d1() {
      oc('c1a', [84, 97, 212], [12, 6, 9]);
      new Chart(document.getElementById('c1b'), {
        data: { labels: months, datasets: [
          { type: 'line', label: '% resolução', data: [68.1, 66.9, 70.4], yAxisID: 'p', borderColor: '#d64545', backgroundColor: '#d64545', pointRadius: 3, tension: .3, pctLabels: true },
          { type: 'bar', label: 'Resolvidos', data: [5480, 6110, 6390], backgroundColor: NAVY, yAxisID: 'y' }] },
        options: base(true, {
          plugins: Object.assign(base(true).plugins, { valueLabels: { on: true, fmt: v => (v / 1000).toFixed(2).replace('.', ',') + ' mil' } }),
          scales: { x: base(true).scales.x, y: { display: false, beginAtZero: true, grace: '85%' }, p: { display: false, min: 20, max: 74 } }
        })
      });
      new Chart(document.getElementById('c1c'), {
        type: 'bar', data: { labels: months, datasets: [{ label: 'Interações', data: [8120, 9340, 9410], backgroundColor: NAVY }] },
        options: base(true, { plugins: Object.assign(base(true).plugins, { legend: { display: false }, valueLabels: { on: true, fmt: v => (v / 1000).toFixed(2).replace('.', ',') + ' mil' } }) })
      });
      oc('c1d', [540, 662, 571], [402, 431, 318]);
      oc('c1e', [1610, 1488, 1602], [1452, 1377, 1561]);
      oc('c1f', [7, 4, 9], [2, 3, 6]);
      oc('c1g', [2910, 3620, 3388], [2864, 3441, 3452]);
    },
    d2() {
      donut('c2a', ['Em uso', 'Em estoque', 'Manutenção'], [4920, 3250, 29], [NAVY, '#7b8fd6', '#cfd36a'], true, ['8.199', 'Total']);
      donut('c2b', ['1–4 anos', '5–6 anos', '7–9 anos', '10+ anos'], [2510, 402, 1880, 3407], ['#2e9a3a', '#d8c13a', '#e23b3b', '#8a1212'], true, ['8.199', 'Total']);
      new Chart(document.getElementById('c2c'), {
        type: 'bar', data: { labels: months, datasets: [
          { label: 'Leasing', data: [142.5, 142.5, 142.5], backgroundColor: TEAL },
          { label: 'Contrato', data: [188.0, 188.0, 188.0], backgroundColor: GREY },
          { label: 'Hora extra', data: [18.4, 27.9, 14.2], backgroundColor: STEEL }] },
        options: base(true, { plugins: Object.assign(base(true).plugins, { valueLabels: { on: true, fmt: v => 'R$' + v.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) } }) })
      });
      donut('c2d', ['Concluído', 'Em andamento', 'Não concluído'], [918, 0, 54], [NAVY, '#d8c13a', '#e23b3b'], true, ['972', 'Total']);
      oc('c2e', [104, 98, 66], [109, 87, 51]);
      oc('c2f', [1140, 1392, 1518], [1187, 1305, 1466]);
    },
    d3() {
      const dk = false;
      donut('c3a', ['Média', 'Alta', 'Baixa', 'Crítica'], [478, 82, 61, 21], ['#8b2cf5', '#5b5bd6', '#e8e85a', '#c36cf0'], dk, ['642', 'chamados']);
      new Chart(document.getElementById('c3b'), {
        type: 'bar',
        data: { labels: ['Analista A', 'Analista B', 'Analista C', 'Analista D', 'Analista E', 'Analista F', 'Analista G', 'Analista H'],
          datasets: [{ label: 'Abertos', data: [21, 17, 15, 14, 12, 9, 6, 4], backgroundColor: '#b9bcc4', borderRadius: 2 }] },
        options: base(dk, { indexAxis: 'y',
          plugins: Object.assign(base(dk).plugins, { legend: { display: false }, valueLabels: { on: true, color: '#e7eaf0' } }),
          scales: { x: { display: false, beginAtZero: true, grace: '10%' }, y: { grid: { display: false }, ticks: { color: '#c9cfda', font: { size: 11 } } } } })
      });
      const ml = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];
      const mv = [58, 61, 96, 64, 49, 55, 52, 44, 47];
      new Chart(document.getElementById('c3c'), {
        type: 'bar', data: { labels: ml, datasets: [{ label: 'Chamados', data: mv, backgroundColor: mv.map(v => v === 96 ? '#8b2cf5' : '#b9bcc4') }] },
        options: base(dk, { plugins: Object.assign(base(dk).plugins, { legend: { display: false }, valueLabels: { on: true, color: '#e7eaf0' } }) })
      });
      const yl = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      new Chart(document.getElementById('c3d'), {
        type: 'line', data: { labels: yl, datasets: [
          { label: 'Este ano', data: [58, 61, 96, 64, 49, 55, 52, 44, 47, null, null, null], borderColor: '#8b2cf5', backgroundColor: '#8b2cf5', tension: .35, pointRadius: 3 },
          { label: 'Ano anterior', data: [70, 66, 72, 69, 63, 58, 61, 57, 66, 74, 81, 69], borderColor: '#e7eaf0', backgroundColor: '#e7eaf0', tension: .35, pointRadius: 3 }] },
        options: base(dk, { scales: { x: base(dk).scales.x, y: { display: false, beginAtZero: false } } })
      });
      document.querySelectorAll('.waffle').forEach(w => {
        if (w.childElementCount) return;
        const p = +w.dataset.p;
        for (let i = 0; i < 100; i++) { const d = document.createElement('i'); if (i >= 100 - p) d.className = 'on'; w.appendChild(d); }
      });
    }
  };

  function show(id) {
    document.querySelectorAll('.report').forEach(r => { r.hidden = r.id !== id; });
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    if (!built[id]) { builders[id](); built[id] = true; }
  }
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => show(t.dataset.tab)));
  show('d1');
  window.__showDash = show;
})();
