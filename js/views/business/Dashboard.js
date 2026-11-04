// ponytail: Mobile-first stacked vertical business dashboard with accessible touch targets (>=44px)
import { getState, setState } from '../../state.js';
import { businessKpis } from '../../data/mockData.js';
import { getIconSvg } from '../../components/Icon.js';
import { initDevModalTrigger } from '../../components/DevModal.js';
import { navigateTo } from '../../router.js';

let activePeriod = '7 días';

function createSparkline(values, negative = false) {
  const points = values.map((val, idx) => `${idx * 16},${28 - (val * 1.1)}`).join(' ');
  return `
    <svg class="sparkline-svg ${negative ? 'negative' : ''}" viewBox="0 0 100 30" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="${negative ? '#df6b61' : '#3db6aa'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

export function renderDashboard() {
  const state = getState();
  const isFree = state.plan === 'free';
  const container = document.createElement('div');
  container.className = 'business-page dashboard-page';

  container.innerHTML = `
    <div class="dashboard-header">
      <div>
        <span class="biz-subtitle">
          ¡Hola, Tacos El Cometa! ${!isFree ? '<b class="featured-badge">Destacado</b>' : ''}
        </span>
        <h2>Resumen de Rendimiento</h2>
      </div>
      <div class="screen-brand" id="biz-logo-trigger" title="Triple toque para menú de pitch">
        <i>TC</i>
        <span><strong>TacoCards</strong><small>LOCATARIO</small></span>
      </div>
    </div>

    <div class="slicer-container">
      <div class="slicer-segment" role="tablist" aria-label="Periodo">
        ${['Hoy', '7 días', '30 días', 'Año'].map(p => `
          <button type="button" class="segment-btn ${activePeriod === p ? 'active' : ''}" data-period="${p}">
            ${p}
          </button>
        `).join('')}
      </div>
    </div>

    ${isFree ? `
      <div class="upgrade-banner" id="biz-upgrade-banner">
        ${getIconSvg('lock', 16)}
        <span>Activa tu programa de fidelidad y analítica con Plan Destacado</span>
      </div>
    ` : ''}

    <div class="kpi-stack">
      ${businessKpis.map((kpi, idx) => {
        const locked = isFree && idx > 0;
        return `
          <article class="kpi-card ${locked ? 'kpi-locked' : ''}">
            <div class="kpi-top">
              <span class="kpi-label">${kpi.label}</span>
              ${locked ? `<span class="lock-pill">${getIconSvg('lock', 12)} Plan Destacado</span>` : ''}
            </div>
            <div class="kpi-value-row">
              <strong>${kpi.value}</strong>
              <span class="delta-tag ${kpi.negative ? 'down' : 'up'}">
                ${kpi.negative ? '▼' : '▲'} ${kpi.delta}
              </span>
            </div>
            <div class="kpi-bottom">
              <small>vs. periodo anterior</small>
              ${!locked ? createSparkline(kpi.series, kpi.negative) : ''}
            </div>
          </article>
        `;
      }).join('')}
    </div>

    <section class="visual-stack">
      <!-- Chart 1: Visitas por día -->
      <article class="visual-card ${isFree ? 'visual-locked' : ''}">
        <div class="visual-card-title">
          <div>
            <h3>Visitas por día</h3>
            <small>Semana actual vs anterior</small>
          </div>
          <div class="chart-legend">
            <span class="leg-current"><i></i> Actual</span>
            <span class="leg-prev"><i></i> Anterior</span>
          </div>
        </div>
        <div class="line-chart-wrap">
          <svg viewBox="0 0 340 130" class="mobile-line-chart" preserveAspectRatio="none">
            <line x1="10" y1="30" x2="330" y2="30" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <line x1="10" y1="70" x2="330" y2="70" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <line x1="10" y1="110" x2="330" y2="110" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <polyline points="20,95 70,82 120,88 170,62 220,74 270,55 320,60" fill="none" stroke="#6f6a65" stroke-dasharray="4 4" stroke-width="1.8" />
            <polyline points="20,88 70,68 120,80 170,45 220,60 270,24 320,38" fill="none" stroke="#3db6aa" stroke-width="2.5" />
            <circle cx="20" cy="88" r="4" fill="#140c07" stroke="#3db6aa" stroke-width="2" />
            <circle cx="70" cy="68" r="4" fill="#140c07" stroke="#3db6aa" stroke-width="2" />
            <circle cx="120" cy="80" r="4" fill="#140c07" stroke="#3db6aa" stroke-width="2" />
            <circle cx="170" cy="45" r="4" fill="#140c07" stroke="#3db6aa" stroke-width="2" />
            <circle cx="220" cy="60" r="4" fill="#140c07" stroke="#3db6aa" stroke-width="2" />
            <circle cx="270" cy="24" r="4" fill="#140c07" stroke="#3db6aa" stroke-width="2" />
            <circle cx="320" cy="38" r="4" fill="#140c07" stroke="#3db6aa" stroke-width="2" />
          </svg>
          <div class="chart-days-row">
            <span>Vie</span><span>Sáb</span><span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span>
          </div>
        </div>
        ${isFree ? `<div class="plan-lock-overlay">${getIconSvg('lock', 20)}<span>Disponible en Plan Destacado</span></div>` : ''}
      </article>

      <!-- Chart 2: Donut Clientes -->
      <article class="visual-card ${isFree ? 'visual-locked' : ''}">
        <div class="visual-card-title">
          <div>
            <h3>Retención de Clientes</h3>
            <small>Nuevos vs. Recurrentes</small>
          </div>
        </div>
        <div class="donut-stack-wrap">
          <div class="donut-circle">
            <strong>91</strong>
            <span>clientes</span>
          </div>
          <div class="donut-legend-col">
            <div class="donut-legend-item">
              <i class="color-dot return"></i>
              <div>
                <strong>62% Recurrentes</strong>
                <small>56 clientes vuelven al local</small>
              </div>
            </div>
            <div class="donut-legend-item">
              <i class="color-dot new"></i>
              <div>
                <strong>38% Nuevos</strong>
                <small>35 clientes por primera vez</small>
              </div>
            </div>
          </div>
        </div>
        ${isFree ? `<div class="plan-lock-overlay">${getIconSvg('lock', 20)}<span>Disponible en Plan Destacado</span></div>` : ''}
      </article>

      <!-- Chart 3: Embudo de fidelización -->
      <article class="visual-card ${isFree ? 'visual-locked' : ''}">
        <div class="visual-card-title">
          <div>
            <h3>Embudo de Conversión</h3>
            <small>Comportamiento de la cohorte</small>
          </div>
        </div>
        <div class="funnel-stack">
          ${[
            ['1ª visita', 91, '100%'],
            ['2ª visita', 57, '63%'],
            ['3ª visita (abre tarjeta)', 31, '34%'],
            ['Sello 4 (canje taco)', 18, '20%'],
            ['Sello 8 (canje orden)', 7, '8%']
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
        ${isFree ? `<div class="plan-lock-overlay">${getIconSvg('lock', 20)}<span>Disponible en Plan Destacado</span></div>` : ''}
      </article>

      <!-- ROI del plan -->
      <article class="visual-card ${isFree ? 'visual-locked' : ''}">
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
          ${getIconSvg('trend', 16)}
          <strong>Ahorro estimado vs. apps: $5,876/mes</strong>
        </div>
        ${isFree ? `<div class="plan-lock-overlay">${getIconSvg('lock', 20)}<span>Disponible en Plan Destacado</span></div>` : ''}
      </article>
    </section>
  `;

  // Attach dev modal trigger
  const logoTrigger = container.querySelector('#biz-logo-trigger');
  initDevModalTrigger(logoTrigger);

  // Upgrade banner
  const banner = container.querySelector('#biz-upgrade-banner');
  if (banner) {
    banner.addEventListener('click', () => {
      navigateTo('plan');
    });
  }

  // Period buttons
  container.querySelectorAll('.segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activePeriod = btn.dataset.period;
      renderDashboard();
    });
  });

  return container;
}
