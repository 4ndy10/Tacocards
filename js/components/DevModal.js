// ponytail: Secret pitch demo modal triggered by triple-tapping the logo.
import { getState, setState, resetDemoState } from '../state.js';
import { getIconSvg } from './Icon.js';

let modalElement = null;

export function initDevModalTrigger(logoElement) {
  if (!logoElement) return;

  let clickCount = 0;
  let timer = null;

  logoElement.addEventListener('click', (e) => {
    e.stopPropagation();
    clickCount++;
    if (clickCount === 1) {
      timer = setTimeout(() => {
        clickCount = 0;
      }, 700);
    } else if (clickCount >= 3) {
      clearTimeout(timer);
      clickCount = 0;
      openDevModal();
    }
  });
}

export function openDevModal() {
  if (modalElement) {
    modalElement.remove();
  }

  const state = getState();
  modalElement = document.createElement('div');
  modalElement.className = 'dev-modal-backdrop';

  modalElement.innerHTML = `
    <div class="dev-modal-content" role="dialog" aria-modal="true" aria-labelledby="dev-modal-title">
      <div class="dev-modal-header">
        <div>
          <span class="dev-badge">Pitch Control</span>
          <h2 id="dev-modal-title">Menú de Demostración</h2>
        </div>
        <button type="button" class="dev-close-btn" aria-label="Cerrar modal">×</button>
      </div>

      <div class="dev-section">
        <label>Rol Activo</label>
        <div class="dev-btn-group">
          <button type="button" class="dev-opt ${state.role === 'consumer' ? 'active' : ''}" data-role="consumer">
            ${getIconSvg('person', 16)} Consumidor
          </button>
          <button type="button" class="dev-opt ${state.role === 'business' ? 'active' : ''}" data-role="business">
            ${getIconSvg('shop', 16)} Locatario
          </button>
        </div>
      </div>

      <div class="dev-section">
        <label>Nivel de Plan</label>
        <div class="dev-btn-group">
          <button type="button" class="dev-opt ${state.plan === 'free' ? 'active' : ''}" data-plan="free">
            Gratis
          </button>
          <button type="button" class="dev-opt ${state.plan === 'premium' ? 'active' : ''}" data-plan="premium">
            ${getIconSvg('crown', 14)} Pase / Destacado
          </button>
        </div>
      </div>

      <div class="dev-section">
        <label>Accesos Rápidos para el Pitch</label>
        <div class="dev-actions-grid">
          <button type="button" class="dev-action-btn" id="dev-unlock-loyalty">
            ${getIconSvg('spark', 14)} Desbloquear Fidelidad (3 visitas)
          </button>
          <button type="button" class="dev-action-btn" id="dev-make-code">
            ${getIconSvg('ticket', 14)} Generar Código TC-345
          </button>
          <button type="button" class="dev-action-btn danger" id="dev-reset-demo">
            ${getIconSvg('reset', 14)} Resetear Demo (Estado Inicial)
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalElement);

  // Event handlers
  modalElement.querySelector('.dev-close-btn').addEventListener('click', closeDevModal);
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) closeDevModal();
  });

  modalElement.querySelectorAll('[data-role]').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      setState({ role });
      closeDevModal();
    });
  });

  modalElement.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      setState({ plan });
      closeDevModal();
    });
  });

  modalElement.querySelector('#dev-unlock-loyalty').addEventListener('click', () => {
    setState({ visits: 3, stamps: 1, consumerView: 'loyalty' });
    closeDevModal();
  });

  modalElement.querySelector('#dev-make-code').addEventListener('click', () => {
    setState({ visits: 3, stamps: 4, code: 'TC-345', consumerView: 'loyalty' });
    closeDevModal();
  });

  modalElement.querySelector('#dev-reset-demo').addEventListener('click', () => {
    resetDemoState();
    closeDevModal();
  });
}

export function closeDevModal() {
  if (modalElement) {
    modalElement.remove();
    modalElement = null;
  }
}
