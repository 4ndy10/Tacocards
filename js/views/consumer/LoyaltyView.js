// ponytail: Loyalty stamp card with locked state, 8 stamps, and redemption code generation
import { getState, setState } from '../../state.js';
import { getIconSvg } from '../../components/Icon.js';
import { createButton } from '../../components/Button.js';
import { navigateTo } from '../../router.js';

export function renderLoyaltyView() {
  const state = getState();
  const container = document.createElement('div');
  container.className = 'phone-view standard-view';

  if (state.visits < 3) {
    container.innerHTML = `
      <header class="phone-heading">
        <div>
          <span>Tus lugares de siempre</span>
          <h2>Fidelidad</h2>
        </div>
      </header>

      <div class="locked-loyalty">
        <div class="locked-circle">
          ${getIconSvg('lock', 38)}
        </div>
        <span class="kicker">Tacos El Cometa</span>
        <h2>Visita ${state.visits}/3</h2>
        <p>Escanea el QR una vez más en el local para abrir la tarjeta exclusiva de sellos y recompensas.</p>
        <div class="three-visits">
          <i class="${state.visits >= 1 ? 'done' : ''}"></i>
          <i class="${state.visits >= 2 ? 'done' : ''}"></i>
          <i class="${state.visits >= 3 ? 'done' : ''}"></i>
        </div>

        <div class="demo-box" style="margin-top: 24px;">
          <div class="demo-box-text">
            <strong>Atajo de Demostración</strong>
            <small>Completa las 3 visitas para ver la tarjeta.</small>
          </div>
          <button type="button" class="button button-outline" id="simulate-third-visit">
            Desbloquear ahora
          </button>
        </div>
      </div>
    `;

    container.querySelector('#simulate-third-visit').addEventListener('click', () => {
      setState({ visits: 3, stamps: 1 });
      renderLoyaltyView();
    });

    return container;
  }

  // Unlocked state (>= 3 visits)
  container.innerHTML = `
    <header class="phone-heading">
      <div>
        <span>Recompensas por volver</span>
        <h2>Fidelidad</h2>
      </div>
    </header>

    <div class="unlocked-note">
      ${getIconSvg('spark', 18)}
      <div>
        <strong>Tarjeta de cliente frecuente activa</strong>
        <small>Tacos El Cometa · Paseo del Río 184</small>
      </div>
    </div>

    <div class="stamp-card">
      <div class="stamp-head">
        <div>
          <span>Tacos El Cometa</span>
          <h3>Tu sabor de siempre</h3>
        </div>
        <div class="screen-brand"><i>TC</i><span><strong>TacoCards</strong></span></div>
      </div>

      <div class="stamp-grid">
        ${Array.from({ length: 8 }, (_, i) => {
          const n = i + 1;
          const isDone = n <= state.stamps;
          const isPrize = n === 4 || n === 8;
          return `
            <div class="stamp-slot ${isDone ? 'done' : ''} ${isPrize ? 'prize' : ''}">
              ${isDone ? getIconSvg('star', 18) : `<span>${n}</span>`}
              ${n === 4 ? '<small class="stamp-badge">Taco</small>' : ''}
              ${n === 8 ? '<small class="stamp-badge">Orden</small>' : ''}
            </div>
          `;
        }).join('')}
      </div>

      <div class="stamp-prizes">
        <span>
          ${getIconSvg('gift', 16)}
          <small>Sello 4</small>
          <strong>1 taco de asada</strong>
        </span>
        <span>
          ${getIconSvg('crown', 16)}
          <small>Sello 8</small>
          <strong>1 orden clásica</strong>
        </span>
      </div>
      <p class="stamp-disclaimer">Un sello por visita con consumo. Los premios los cubre el negocio.</p>
    </div>

    ${state.stamps < 4 ? `
      <div class="demo-box">
        <div class="demo-box-text">
          <strong>Modo demostración</strong>
          <small>Avanza los sellos para probar el canje en caja.</small>
        </div>
        <button type="button" class="button button-outline" id="advance-stamps-btn">
          Simular sello 4
        </button>
      </div>
    ` : ''}

    ${state.stamps >= 4 && !state.code ? `
      <div class="claim-box">
        <span class="kicker">Premio disponible</span>
        <h3>Tu taco corre por la casa</h3>
        <p>Genera un código de 6 caracteres y muéstralo al taquero en caja. Expira en 10 minutos.</p>
        <button type="button" class="button button-primary full-width-btn" id="claim-prize-btn">
          ${getIconSvg('ticket', 18)} Canjear premio en caja
        </button>
      </div>
    ` : ''}

    ${state.code ? `
      <div class="code-box">
        <div class="code-icon-circle">
          ${getIconSvg('check', 24)}
        </div>
        <span class="kicker">Código listo para validar</span>
        <h2 class="code-display">${state.code}</h2>
        <p>Pasa a la vista <strong>Locatario &gt; Canjes</strong> para simular la validación en caja.</p>
        <small class="expiry-note">
          ${getIconSvg('clock', 14)} Expira en 09:42 min
        </small>
        <div class="code-actions">
          <button type="button" class="button button-outline" id="switch-to-merchant">
            ${getIconSvg('shop', 16)} Abrir caja del Locatario
          </button>
        </div>
      </div>
    ` : ''}
  `;

  const advanceBtn = container.querySelector('#advance-stamps-btn');
  if (advanceBtn) {
    advanceBtn.addEventListener('click', () => {
      setState({ stamps: 4 });
      renderLoyaltyView();
    });
  }

  const claimBtn = container.querySelector('#claim-prize-btn');
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      setState({ code: 'TC-345', codeExpires: Date.now() + 600000, validated: false });
      renderLoyaltyView();
    });
  }

  const switchMerchantBtn = container.querySelector('#switch-to-merchant');
  if (switchMerchantBtn) {
    switchMerchantBtn.addEventListener('click', () => {
      setState({ role: 'business', businessView: 'redeem' });
    });
  }

  return container;
}
