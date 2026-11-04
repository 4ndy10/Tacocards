// ponytail: Cashier redemption page with sandbox validation against localStorage
import { getState, setState } from '../../state.js';
import { getIconSvg } from '../../components/Icon.js';
import { createButton } from '../../components/Button.js';
import { navigateTo } from '../../router.js';

export function renderRedeemPage() {
  const state = getState();
  const isFree = state.plan === 'free';
  const container = document.createElement('div');
  container.className = 'business-page narrow-page';

  let inputVal = state.code || '';
  let statusMessage = state.validated ? 'used' : 'idle'; // 'idle' | 'valid' | 'used' | 'invalid'

  function render() {
    container.innerHTML = `
      <div class="page-heading">
        <span class="biz-subtitle">Operación en mostrador</span>
        <h2>Validar canje</h2>
        <p>Escribe o escanea el código temporal que muestra el cliente en su pantalla.</p>
      </div>

      ${isFree ? `
        <div class="upgrade-banner" id="redeem-upgrade-cta">
          ${getIconSvg('lock', 16)}
          <span>Validación de premios disponible en Plan Destacado</span>
        </div>
      ` : ''}

      <div class="redeem-panel ${isFree ? 'feature-preview-locked' : ''}">
        <div class="scanner-graphic" aria-hidden="true">
          ${getIconSvg('scan', 48)}
        </div>

        <label for="business-code-input" class="redeem-input-label">Código del cliente</label>
        <div class="redeem-field-wrap">
          <input type="text" 
                 id="business-code-input" 
                 class="redeem-input" 
                 placeholder="TC-000" 
                 maxlength="6" 
                 value="${inputVal}"
                 autocomplete="off"
                 autocapitalize="characters">
        </div>

        <button type="button" class="button button-primary full-width-btn" id="validate-code-btn" ${!inputVal ? 'disabled' : ''}>
          ${getIconSvg('check', 18)} Validar código en caja
        </button>

        <div class="or-separator"><span>o</span></div>

        <button type="button" class="button button-outline full-width-btn" id="auto-fill-btn">
          ${getIconSvg('scan', 16)} Simular escaneo de pantalla
        </button>

        <div class="redeem-status-area">
          ${!state.code && statusMessage === 'idle' ? `
            <div class="status-message neutral">
              ${getIconSvg('person', 20)}
              <div>
                <strong>Aún no hay un código activo en la demo</strong>
                <small>Genera uno en Fidelidad (Consumidor) o con el Menú Demo (triple toque al logo).</small>
              </div>
            </div>
          ` : ''}

          ${statusMessage === 'valid' ? `
            <div class="status-message success">
              ${getIconSvg('check', 22)}
              <div>
                <strong>Código válido · Premio autorizado</strong>
                <small>Entrega 1 taco de asada a Alex Rivera. Este código quedó marcado como canjeado.</small>
              </div>
            </div>
          ` : ''}

          ${statusMessage === 'used' ? `
            <div class="status-message error">
              ${getIconSvg('clock', 22)}
              <div>
                <strong>Código ya canjeado</strong>
                <small>${state.code || 'TC-345'} fue utilizado hoy para 1 taco de asada.</small>
              </div>
            </div>
          ` : ''}

          ${statusMessage === 'invalid' ? `
            <div class="status-message error">
              ${getIconSvg('lock', 22)}
              <div>
                <strong>Código no válido o expirado</strong>
                <small>Verifica los 6 caracteres con el cliente o genera uno nuevo.</small>
              </div>
            </div>
          ` : ''}
        </div>

        ${isFree ? `
          <div class="plan-lock-overlay">
            ${getIconSvg('lock', 24)}
            <span>Disponible en Plan Destacado</span>
          </div>
        ` : ''}
      </div>
    `;

    const input = container.querySelector('#business-code-input');
    const validateBtn = container.querySelector('#validate-code-btn');

    input.addEventListener('input', (e) => {
      inputVal = e.target.value.toUpperCase();
      input.value = inputVal;
      validateBtn.disabled = !inputVal;
      if (statusMessage !== 'idle') {
        statusMessage = 'idle';
      }
    });

    validateBtn.addEventListener('click', () => {
      if (state.validated && inputVal === state.code) {
        statusMessage = 'used';
      } else if (state.code && inputVal === state.code.toUpperCase()) {
        statusMessage = 'valid';
        setState({ validated: true });
      } else {
        statusMessage = 'invalid';
      }
      render();
    });

    container.querySelector('#auto-fill-btn').addEventListener('click', () => {
      if (state.code) {
        inputVal = state.code;
        input.value = inputVal;
        validateBtn.disabled = false;
        validateBtn.click();
      } else {
        // Fallback demo code
        setState({ code: 'TC-345' });
        inputVal = 'TC-345';
        input.value = inputVal;
        validateBtn.disabled = false;
        validateBtn.click();
      }
    });

    const cta = container.querySelector('#redeem-upgrade-cta');
    if (cta) {
      cta.addEventListener('click', () => navigateTo('plan'));
    }
  }

  render();
  return container;
}
