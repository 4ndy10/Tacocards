// ponytail: Merchant Loyalty configuration page
import { getState } from '../../state.js';
import { getIconSvg } from '../../components/Icon.js';
import { navigateTo } from '../../router.js';

let isProgramActive = true;
let prizes = ['1 taco de asada', '1 orden clásica'];

export function renderLoyaltyPage() {
  const state = getState();
  const isFree = state.plan === 'free';
  const container = document.createElement('div');
  container.className = 'business-page narrow-page';

  container.innerHTML = `
    <div class="page-heading">
      <span class="biz-subtitle">Programa exclusivo del negocio</span>
      <h2>Fidelidad y Recompensas</h2>
      <p>Configura los incentivos que tu local ofrece para asegurar clientes recurrentes.</p>
    </div>

    ${isFree ? `
      <div class="upgrade-banner" id="loyalty-plan-cta">
        ${getIconSvg('lock', 16)}
        <span>Programa de fidelidad disponible en Plan Destacado</span>
      </div>
    ` : ''}

    <div class="loyalty-config-panel ${isFree ? 'feature-preview-locked' : ''}">
      <div class="program-toggle-row">
        <div class="toggle-info">
          <span class="status-indicator ${isProgramActive ? 'on' : ''}">
            ${getIconSvg(isProgramActive ? 'check' : 'clock', 14)}
          </span>
          <div>
            <strong>Programa ${isProgramActive ? 'activo' : 'pausado'}</strong>
            <small>${isProgramActive ? 'Los clientes acumulan sellos con sus consumos' : 'No se otorgan sellos nuevos'}</small>
          </div>
        </div>
        <button type="button" class="switch-btn ${isProgramActive ? 'active' : ''}" id="toggle-program-btn" aria-label="Alternar programa">
          <i></i>
        </button>
      </div>

      <div class="program-rules-cards">
        <div class="rule-card">
          ${getIconSvg('qr', 20)}
          <strong>1 sello por visita</strong>
          <small>Validada en tu mostrador</small>
        </div>
        <div class="rule-card">
          ${getIconSvg('lock', 20)}
          <strong>Desbloqueo en visita 3</strong>
          <small>Exclusivo para tu taquería</small>
        </div>
      </div>

      <h3 class="section-title">Premios configurados</h3>
      <div class="prizes-stack">
        ${prizes.map((prize, idx) => `
          <div class="prize-editor-card">
            <div class="prize-badge">
              ${getIconSvg(idx === 0 ? 'gift' : 'crown', 16)}
              <span>Sello ${idx === 0 ? '4' : '8'}</span>
            </div>
            <div class="prize-input-wrap">
              <label>Premio para el cliente</label>
              <input type="text" class="prize-input" value="${prize}" data-prize-idx="${idx}">
            </div>
            <div class="prize-cost">
              <small>Costo aprox.</small>
              <strong>${idx === 0 ? '$24' : '$78'}</strong>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="business-coupon-card">
        ${getIconSvg('ticket', 20)}
        <div class="coupon-details">
          <strong>Cupón activo en Pase Taquero</strong>
          <small>2×1 en agua fresca · 34 clientes alcanzados en Zona Río</small>
        </div>
        <button type="button" class="button button-outline mini-btn">Editar</button>
      </div>

      <div class="business-tip-box">
        ${getIconSvg('spark', 18)}
        <p><strong>Consejo de rentabilidad:</strong> Mantén el costo del premio por debajo del 18% del ticket promedio para maximizar tu margen neto.</p>
      </div>

      ${isFree ? `
        <div class="plan-lock-overlay">
          ${getIconSvg('lock', 24)}
          <span>Disponible en Plan Destacado</span>
        </div>
      ` : ''}
    </div>
  `;

  const toggleBtn = container.querySelector('#toggle-program-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isProgramActive = !isProgramActive;
      renderLoyaltyPage();
    });
  }

  container.querySelectorAll('.prize-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.prizeIdx);
      prizes[idx] = e.target.value;
    });
  });

  const cta = container.querySelector('#loyalty-plan-cta');
  if (cta) {
    cta.addEventListener('click', () => navigateTo('plan'));
  }

  return container;
}
