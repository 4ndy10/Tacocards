// ponytail: User profile with Taquero Pass subscription, achievements, and Reset Demo button
import { getState, setState, resetDemoState } from '../../state.js';
import { getIconSvg } from '../../components/Icon.js';
import { createButton } from '../../components/Button.js';

export function renderProfileView() {
  const state = getState();
  const container = document.createElement('div');
  container.className = 'phone-view standard-view';

  let showUpgradeSheet = false;

  function render() {
    container.innerHTML = `
      <header class="phone-heading">
        <div>
          <span>Coleccionista fronterizo</span>
          <h2>Mi perfil</h2>
        </div>
      </header>

      <div class="profile-card">
        <div class="avatar ${state.plan === 'premium' ? 'premium' : ''}">
          AR
          <span class="avatar-level">7</span>
          ${state.plan === 'premium' ? `<i class="crown-badge">${getIconSvg('crown', 12)}</i>` : ''}
        </div>
        <h2>Alex Rivera</h2>
        <p>Explorando Tijuana desde enero de 2026</p>
        <div class="profile-stats">
          <div><strong>18</strong><span>Cartas</span></div>
          <div><strong>12</strong><span>Locales</span></div>
          <div><strong>7</strong><span>Nivel</span></div>
        </div>
      </div>

      <div class="taquero-pass ${state.plan === 'premium' ? 'active-pass' : ''}">
        <span class="pass-kicker">
          ${getIconSvg('crown', 16)}
          ${state.plan === 'premium' ? 'Pase Taquero Activo' : 'Pase Taquero · $39/mes'}
        </span>
        <h2>${state.plan === 'premium' ? 'Renueva el 1 de diciembre' : 'Más Tijuana en cada salida'}</h2>
        <p>${state.plan === 'premium' ? 'Taco de Oro, cupones mensuales y rutas por colonia están activos.' : 'Desbloquea el Taco de Oro legendario, cupones exclusivos y rutas gastronómicas por colonia.'}</p>
        <ul class="pass-perks">
          <li>${getIconSvg('check', 14)} Carta legendaria Taco de Oro (#001/200)</li>
          <li>${getIconSvg('check', 14)} Cupones mensuales en negocios independientes</li>
          <li>${getIconSvg('check', 14)} Rutas temáticas por colonia (Río, Centro, Revu)</li>
        </ul>
        <div class="pass-footer">
          ${state.plan === 'free' ? '<strong>$39 <small>MXN/mes</small></strong>' : '<strong>Plan Premium</strong>'}
          <button type="button" class="button ${state.plan === 'premium' ? 'button-outline' : 'button-primary'}" id="pass-cta-btn">
            ${state.plan === 'premium' ? 'Pase Activo' : 'Obtener Pase'}
          </button>
        </div>
      </div>

      <h3 class="section-title">Logros recientes</h3>
      <div class="achievements-grid">
        <div class="achievement-card">
          ${getIconSvg('map', 22)}
          <strong>Río Explorer</strong>
          <small>5 locales visitados</small>
        </div>
        <div class="achievement-card">
          ${getIconSvg('spark', 22)}
          <strong>Buen Ojo</strong>
          <small>1 carta épica obtenida</small>
        </div>
        <div class="achievement-card muted">
          ${getIconSvg('lock', 22)}
          <strong>Noctámbulo</strong>
          <small>Visita después de 22 h</small>
        </div>
      </div>

      <div class="reset-demo-section">
        <button type="button" class="button button-quiet reset-demo-btn" id="reset-demo-btn">
          ${getIconSvg('reset', 16)} Resetear Demo para el Pitch
        </button>
        <small class="reset-hint">Restaura visitas (2), sellos (1) y cartas iniciales.</small>
      </div>

      ${showUpgradeSheet ? `
        <div class="upgrade-sheet-backdrop" id="upgrade-backdrop">
          <div class="upgrade-sheet" role="dialog" aria-modal="true">
            <i class="sheet-handle" aria-hidden="true"></i>
            <span class="kicker">Pase Taquero</span>
            <h2>Desbloquea otra forma de recorrer Tijuana</h2>
            <ul class="upgrade-perks">
              <li>${getIconSvg('crown', 16)} Taco de Oro legendario garantizado</li>
              <li>${getIconSvg('ticket', 16)} Cupones 2x1 y descuentos en locales de barrio</li>
              <li>${getIconSvg('map', 16)} Rutas por colonia sin límites</li>
            </ul>
            <div class="upgrade-price">
              <strong>$39</strong>
              <span>MXN al mes<br><small>Cancela cuando quieras sin compromiso</small></span>
            </div>
            <button type="button" class="button button-primary full-width-btn" id="confirm-upgrade-btn">
              Activar Pase Taquero · $39/mes
            </button>
          </div>
        </div>
      ` : ''}
    `;

    // Hook events
    const passCta = container.querySelector('#pass-cta-btn');
    if (passCta && state.plan === 'free') {
      passCta.addEventListener('click', () => {
        showUpgradeSheet = true;
        render();
      });
    }

    const resetBtn = container.querySelector('#reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('¿Restablecer datos de la demo a sus valores originales?')) {
          resetDemoState();
          renderProfileView();
        }
      });
    }

    if (showUpgradeSheet) {
      const backdrop = container.querySelector('#upgrade-backdrop');
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          showUpgradeSheet = false;
          render();
        }
      });

      const confirmBtn = container.querySelector('#confirm-upgrade-btn');
      confirmBtn.addEventListener('click', () => {
        setState({ plan: 'premium' });
        showUpgradeSheet = false;
        renderProfileView();
      });
    }
  }

  render();
  return container;
}
