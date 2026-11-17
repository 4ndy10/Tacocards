// ponytail: Mobile-first accessible business dashboard with interactive multi-KPI line chart and generous free-tier analytics
import { getState, toggleTheme } from '../../state.js';
import { businessKpis } from '../../data/mockData.js';
import { getIconSvg } from '../../components/Icon.js';
import { initDevModalTrigger } from '../../components/DevModal.js';
import { navigateTo } from '../../router.js';

let activePeriod = '7 días';
let selectedKpiIndices = [0, 1]; // Default overlaid KPIs on main line chart: Visitas con QR + Clientes únicos
let showPreviousBaseline = true;

const KPI_COLORS = ['#3db6aa', '#dcb45d', '#a477d6', '#df6b61', '#62bb7e'];
const DAYS_LABELS = ['Vie', 'Sáb', 'Dom', 'Lun', 'Mar', 'Mié', 'Jue'];
const PERIOD_MULTIPLIERS = {
  'Hoy': 0.25,
  '7 días': 1,
  '30 días': 4.1,
  'Año': 48
};

// Free plan unlocks the first 3 KPIs (Visitas con QR, Clientes únicos, Tasa de retorno) and the first 2 analytical charts
const FREE_UNLOCKED_KPI_COUNT = 3;

function createSparkline(values, color = '#3db6aa') {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const points = values.map((val, idx) => {
    const x = idx * 16;
    const y = Math.round(25 - ((val - min) / range) * 20);
    return `${x},${y}`;
  }).join(' ');
  return `
    <svg class="sparkline-svg" viewBox="0 0 100 30" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

function buildSmoothCurvePath(coords) {
  if (!coords.length) return '';
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const ctrlX1 = curr.x + (next.x - curr.x) * 0.42;
    const ctrlY1 = curr.y;
    const ctrlX2 = curr.x + (next.x - curr.x) * 0.58;
    const ctrlY2 = next.y;
    d += ` C ${ctrlX1.toFixed(1)} ${ctrlY1.toFixed(1)}, ${ctrlX2.toFixed(1)} ${ctrlY2.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  return d;
}

function formatKpiValueForPeriod(kpi, period) {
  const mult = PERIOD_MULTIPLIERS[period] || 1;
  if (mult === 1) return kpi.value;
  if (typeof kpi.value === 'number') {
    return Math.max(1, Math.round(kpi.value * mult));
  }
  if (String(kpi.value).startsWith('$')) {
    const num = Number(String(kpi.value).replace(/[^0-9.]/g, '')) || 0;
    return `$${Math.round(num * mult).toLocaleString('es-MX')}`;
  }
  return kpi.value;
}

export function renderDashboard() {
  const container = document.createElement('div');
  container.className = 'business-page dashboard-page';

  function render() {
    const state = getState();
    const isFree = state.plan === 'free';
    const isDark = state.theme === 'dark';

    // Ensure selected KPI indices only include unlocked KPIs when in free mode
    const validSelected = selectedKpiIndices.filter(idx => !isFree || idx < FREE_UNLOCKED_KPI_COUNT);
    if (validSelected.length === 0) validSelected.push(0);
    selectedKpiIndices = validSelected;

    // Compute SVG Line Chart coordinates (proportional 360x190 viewBox)
    const chartLeft = 38;
    const chartRight = 340;
    const chartTop = 24;
    const chartBottom = 148;
    const stepX = (chartRight - chartLeft) / (DAYS_LABELS.length - 1);

    const mult = PERIOD_MULTIPLIERS[activePeriod] || 1;
    const activeSeriesList = selectedKpiIndices.map(kpiIdx => {
      const kpi = businessKpis[kpiIdx];
      const scaledSeries = kpi.series.map(v => Math.max(1, Math.round(v * (kpiIdx === 2 ? 1 : mult))));
      return {
        idx: kpiIdx,
        kpi,
        color: KPI_COLORS[kpiIdx % KPI_COLORS.length],
        series: scaledSeries
      };
    });

    // Previous period baseline based on primary active KPI
    const primarySeries = activeSeriesList[0].series;
    const prevBaselineSeries = primarySeries.map((v, i) => Math.max(1, Math.round(v * (i % 2 === 0 ? 0.82 : 0.88))));

    const allPlottedValues = [
      ...activeSeriesList.flatMap(s => s.series),
      ...(showPreviousBaseline ? prevBaselineSeries : [])
    ];
    const maxVal = Math.max(...allPlottedValues, 10);
    const minVal = 0;
    const valRange = Math.max(maxVal - minVal, 1);

    const toCoords = (series) =>
      series.map((val, i) => ({
        x: Math.round(chartLeft + i * stepX),
        y: Math.round(chartBottom - ((val - minVal) / valRange) * (chartBottom - chartTop)),
        val
      }));

    const primaryCoords = toCoords(primarySeries);
    const primaryCurve = buildSmoothCurvePath(primaryCoords);
    const primaryArea = `${primaryCurve} L ${primaryCoords[primaryCoords.length - 1].x} ${chartBottom} L ${primaryCoords[0].x} ${chartBottom} Z`;
    const prevCoords = toCoords(prevBaselineSeries);
    const prevCurve = buildSmoothCurvePath(prevCoords);

    container.innerHTML = `
      <div class="dashboard-header">
        <div>
          <span class="biz-subtitle">
            ¡Hola, Tacos El Cometa! ${!isFree ? '<b class="featured-badge">Destacado</b>' : '<b class="free-tier-badge">Plan Gratuito Activo</b>'}
          </span>
          <h2>Resumen de Rendimiento</h2>
        </div>
        <div class="dashboard-header-actions">
          <button type="button" class="theme-toggle-btn" id="biz-theme-toggle" aria-label="Alternar entre Modo Claro y Modo Oscuro" title="Cambiar tema claro/oscuro">
            ${getIconSvg(isDark ? 'sun' : 'moon', 18)}
            <span>${isDark ? 'Claro' : 'Oscuro'}</span>
          </button>
          <div class="screen-brand" id="biz-logo-trigger" title="Triple toque para menú de pitch">
            <i>TC</i>
            <span><strong>TacoCards</strong><small>LOCATARIO</small></span>
          </div>
        </div>
      </div>

      <div class="slicer-container">
        <div class="slicer-segment" role="tablist" aria-label="Periodo de análisis">
          ${['Hoy', '7 días', '30 días', 'Año'].map(p => `
            <button type="button" class="segment-btn ${activePeriod === p ? 'active' : ''}" data-period="${p}">
              ${p}
            </button>
          `).join('')}
        </div>
      </div>

      ${isFree ? `
        <div class="upgrade-banner" id="biz-upgrade-banner">
          ${getIconSvg('spark', 18)}
          <span>Tienes <strong>3 métricas clave y 2 gráficas activas</strong> gratis · Toca para desbloquear Embudo, Canjes y ROI con Plan Destacado</span>
        </div>
      ` : ''}

      <div class="kpi-stack">
        ${businessKpis.map((kpi, idx) => {
          const locked = isFree && idx >= FREE_UNLOCKED_KPI_COUNT;
          const isFeaturedQr = idx === 0;
          const isOverlaid = selectedKpiIndices.includes(idx);
          const kpiColor = KPI_COLORS[idx % KPI_COLORS.length];
          const displayVal = formatKpiValueForPeriod(kpi, activePeriod);

          return `
            <article
              class="kpi-card ${isFeaturedQr ? 'kpi-featured-qr' : ''} ${locked ? 'kpi-locked' : 'kpi-interactive'} ${isOverlaid && !locked ? 'kpi-selected-overlay' : ''}"
              data-kpi-card="${idx}"
              style="--kpi-accent: ${kpiColor};"
              role="button"
              tabindex="0"
              aria-pressed="${isOverlaid && !locked}"
            >
              <div class="kpi-top">
                <span class="kpi-label">
                  <i class="kpi-color-dot" style="background:${kpiColor};"></i>
                  ${kpi.label}
                </span>
                ${isFeaturedQr ? `
                  <span class="qr-highlight-pill">${getIconSvg('qr', 13)} Conversión QR · Principal</span>
                ` : locked ? `
                  <span class="lock-pill">${getIconSvg('lock', 12)} Plan Destacado</span>
                ` : `
                  <span class="kpi-overlay-pill ${isOverlaid ? 'on' : ''}">
                    ${isOverlaid ? '✓ En gráfica' : '+ Comparar'}
                  </span>
                `}
              </div>
              <div class="kpi-value-row">
                <strong>${displayVal}</strong>
                <span class="delta-tag ${kpi.negative ? 'down' : 'up'}">
                  ${kpi.negative ? '▼' : '▲'} ${kpi.delta}
                </span>
              </div>
              <div class="kpi-bottom">
                <small>${isFeaturedQr ? 'Escaneos verificados en mostrador vs. periodo anterior' : 'vs. periodo anterior · Toca para superponer en gráfica'}</small>
                ${!locked ? createSparkline(kpi.series, kpiColor) : ''}
              </div>
            </article>
          `;
        }).join('')}
      </div>

      <section class="visual-stack">
        <!-- Chart 1: Gráfica de línea interactiva (Desbloqueada en Plan Gratuito) -->
        <article class="visual-card line-chart-card">
          <div class="visual-card-title">
            <div>
              <h3>Visitas por día e Impacto de KPIs</h3>
              <small>Selecciona uno o varios KPIs para superponer y comparar su tendencia (${activePeriod})</small>
            </div>
          </div>

          <!-- Interactive KPI Overlay Controls -->
          <div class="chart-kpi-controls" role="group" aria-label="Superponer KPIs en la gráfica">
            ${businessKpis.map((kpi, idx) => {
              const locked = isFree && idx >= FREE_UNLOCKED_KPI_COUNT;
              const active = selectedKpiIndices.includes(idx) && !locked;
              const color = KPI_COLORS[idx % KPI_COLORS.length];
              return `
                <button
                  type="button"
                  class="chart-kpi-chip ${active ? 'active' : ''} ${locked ? 'locked' : ''}"
                  data-toggle-kpi="${idx}"
                  style="--chip-color: ${color};"
                  aria-pressed="${active}"
                >
                  <i class="chip-dot" style="background: ${color};"></i>
                  <span>${kpi.label}</span>
                  ${locked ? getIconSvg('lock', 12) : ''}
                </button>
              `;
            }).join('')}
            <button
              type="button"
              class="chart-kpi-chip baseline-chip ${showPreviousBaseline ? 'active' : ''}"
              id="toggle-baseline-btn"
              aria-pressed="${showPreviousBaseline}"
            >
              <i class="chip-dash"></i>
              <span>Periodo anterior</span>
            </button>
          </div>

          <div class="line-chart-wrap">
            <svg viewBox="0 0 360 190" class="mobile-line-chart" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Gráfica de línea de visitas por día y KPIs superpuestos">
              <defs>
                <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="${activeSeriesList[0].color}" stop-opacity="0.32" />
                  <stop offset="100%" stop-color="${activeSeriesList[0].color}" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              <!-- Y-Axis Grid Lines & Labels -->
              <line x1="${chartLeft}" y1="${chartTop}" x2="${chartRight}" y2="${chartTop}" class="chart-grid-line" />
              <line x1="${chartLeft}" y1="${Math.round((chartTop + chartBottom) / 2)}" x2="${chartRight}" y2="${Math.round((chartTop + chartBottom) / 2)}" class="chart-grid-line" />
              <line x1="${chartLeft}" y1="${chartBottom}" x2="${chartRight}" y2="${chartBottom}" class="chart-grid-line base" />

              <text x="6" y="${chartTop + 4}" class="chart-axis-label">${maxVal}</text>
              <text x="6" y="${Math.round((chartTop + chartBottom) / 2) + 4}" class="chart-axis-label">${Math.round(maxVal / 2)}</text>
              <text x="6" y="${chartBottom + 4}" class="chart-axis-label">0</text>

              <!-- Area fill under primary selected series -->
              <path d="${primaryArea}" fill="url(#primaryAreaGrad)" />

              <!-- Optional Previous Period Baseline -->
              ${showPreviousBaseline ? `
                <path d="${prevCurve}" fill="none" class="chart-baseline-path" stroke-dasharray="5 5" stroke-width="2" />
              ` : ''}

              <!-- Overlaid KPI Line Series -->
              ${activeSeriesList.map((seriesObj, sIdx) => {
                const coords = toCoords(seriesObj.series);
                const curvePath = buildSmoothCurvePath(coords);
                return `
                  <g class="chart-series-group">
                    <path d="${curvePath}" fill="none" stroke="${seriesObj.color}" stroke-width="${sIdx === 0 ? '3.2' : '2.6'}" stroke-linecap="round" stroke-linejoin="round" />
                    ${coords.map((pt, ptIdx) => `
                      <circle cx="${pt.x}" cy="${pt.y}" r="${sIdx === 0 ? '4.8' : '4'}" class="chart-node" stroke="${seriesObj.color}" stroke-width="2.4" />
                      ${(sIdx === 0 || ptIdx === coords.length - 1 || ptIdx === 5) ? `
                        <text x="${pt.x}" y="${Math.max(13, pt.y - 9)}" text-anchor="middle" class="chart-point-val" fill="${seriesObj.color}">${pt.val}</text>
                      ` : ''}
                    `).join('')}
                  </g>
                `;
              }).join('')}

              <!-- X-Axis Day Labels aligned to points -->
              ${DAYS_LABELS.map((day, dIdx) => `
                <text x="${Math.round(chartLeft + dIdx * stepX)}" y="174" text-anchor="middle" class="chart-day-label">${day}</text>
              `).join('')}
            </svg>
          </div>

          <!-- Active Overlaid KPIs Impact Comparison Footer -->
          <div class="chart-impact-summary">
            ${activeSeriesList.map(({ kpi, color }) => `
              <div class="impact-summary-pill">
                <i style="background:${color};"></i>
                <span>${kpi.label}:</span>
                <strong>${formatKpiValueForPeriod(kpi, activePeriod)}</strong>
                <em class="${kpi.negative ? 'down' : 'up'}">${kpi.delta}</em>
              </div>
            `).join('')}
          </div>
        </article>

        <!-- Chart 2: Donut Clientes (Desbloqueada también en Plan Gratuito) -->
        <article class="visual-card">
          <div class="visual-card-title">
            <div>
              <h3>Retención de Clientes</h3>
              <small>Nuevos vs. Recurrentes (${activePeriod}) · Incluido en tu plan</small>
            </div>
            <span class="free-included-tag">Gratis</span>
          </div>
          <div class="donut-stack-wrap">
            <div class="donut-circle">
              <strong>${Math.max(1, Math.round(91 * mult))}</strong>
              <span>clientes</span>
            </div>
            <div class="donut-legend-col">
              <div class="donut-legend-item">
                <i class="color-dot return"></i>
                <div>
                  <strong>62% Recurrentes</strong>
                  <small>${Math.max(1, Math.round(56 * mult))} clientes vuelven al local</small>
                </div>
              </div>
              <div class="donut-legend-item">
                <i class="color-dot new"></i>
                <div>
                  <strong>38% Nuevos</strong>
                  <small>${Math.max(1, Math.round(35 * mult))} clientes por primera vez</small>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- Chart 3: Embudo de fidelización (Plan Destacado) -->
        <article class="visual-card ${isFree ? 'visual-locked' : ''}" ${isFree ? 'data-locked-upgrade="true"' : ''}>
          <div class="visual-card-title">
            <div>
              <h3>Embudo de Conversión</h3>
              <small>Comportamiento de la cohorte hacia premios (${activePeriod})</small>
            </div>
          </div>
          <div class="funnel-stack">
            ${[
              ['1ª visita', Math.max(1, Math.round(91 * mult)), '100%'],
              ['2ª visita', Math.max(1, Math.round(57 * mult)), '63%'],
              ['3ª visita (abre tarjeta)', Math.max(1, Math.round(31 * mult)), '34%'],
              ['Sello 4 (canje taco)', Math.max(1, Math.round(18 * mult)), '20%'],
              ['Sello 8 (canje orden)', Math.max(1, Math.round(7 * mult)), '8%']
            ].map(([step, count, percent]) => `
              <div class="funnel-row">
                <span class="funnel-label">${step}</span>
                <div class="funnel-bar-bg">
                  <div class="funnel-bar-fill" style="width: ${percent};"></div>
                </div>
                <strong class="funnel-num">${count}</strong>
                <small class="funnel-pct">${percent}</small>
              </div>
            `).join('')}
          </div>
          ${isFree ? `<div class="plan-lock-overlay">${getIconSvg('lock', 20)}<span>Disponible en Plan Destacado · Toca para ver</span></div>` : ''}
        </article>

        <!-- Chart 4: ROI del plan (Plan Destacado) -->
        <article class="visual-card ${isFree ? 'visual-locked' : ''}" ${isFree ? 'data-locked-upgrade="true"' : ''}>
          <div class="visual-card-title">
            <div>
              <h3>ROI Plan Destacado</h3>
              <small>Estimación de ahorro mensual</small>
            </div>
            <span class="roi-tag">9.3× ROI</span>
          </div>
          <div class="roi-stats-stack">
            <div class="roi-box">
              <span>Cuota fija</span>
              <strong>$249/mes</strong>
            </div>
            <div class="roi-box">
              <span>Ventas generadas</span>
              <strong class="green">+$2,320</strong>
            </div>
            <div class="roi-box">
              <span>Comisión apps reparto (30%)</span>
              <strong class="red">-$6,125</strong>
            </div>
          </div>
          <div class="roi-bottom-note">
            ${getIconSvg('trend', 18)}
            <strong>Ahorro estimado vs. apps: $5,876/mes</strong>
          </div>
          ${isFree ? `<div class="plan-lock-overlay">${getIconSvg('lock', 20)}<span>Disponible en Plan Destacado · Toca para ver</span></div>` : ''}
        </article>
      </section>
    `;

    // Attach dev modal trigger
    const logoTrigger = container.querySelector('#biz-logo-trigger');
    initDevModalTrigger(logoTrigger);

    // Theme toggle button
    container.querySelector('#biz-theme-toggle')?.addEventListener('click', () => {
      toggleTheme();
    });

    // Upgrade banner & locked cards navigation
    container.querySelector('#biz-upgrade-banner')?.addEventListener('click', () => {
      navigateTo('plan');
    });
    container.querySelectorAll('[data-locked-upgrade="true"]').forEach(card => {
      card.addEventListener('click', () => navigateTo('plan'));
    });

    // Period buttons
    container.querySelectorAll('.segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activePeriod = btn.dataset.period;
        render();
      });
    });

    // Toggle KPI overlay helper
    const handleToggleKpi = (idx) => {
      if (isFree && idx >= FREE_UNLOCKED_KPI_COUNT) {
        navigateTo('plan');
        return;
      }
      if (selectedKpiIndices.includes(idx)) {
        if (selectedKpiIndices.length > 1) {
          selectedKpiIndices = selectedKpiIndices.filter(i => i !== idx);
        }
      } else {
        selectedKpiIndices = [...selectedKpiIndices, idx];
      }
      render();
    };

    // Interactive KPI chips inside the line chart
    container.querySelectorAll('[data-toggle-kpi]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.toggleKpi);
        handleToggleKpi(idx);
      });
    });

    // Also allow clicking or pressing Enter/Space on KPI cards directly to toggle overlay on chart
    container.querySelectorAll('[data-kpi-card]').forEach(card => {
      const idx = Number(card.dataset.kpiCard);
      card.addEventListener('click', () => handleToggleKpi(idx));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggleKpi(idx);
        }
      });
    });

    // Toggle previous period baseline
    container.querySelector('#toggle-baseline-btn')?.addEventListener('click', () => {
      showPreviousBaseline = !showPreviousBaseline;
      render();
    });
  }

  render();
  return container;
}
