// ponytail: Consumer loyalty view with sequential (+1) visit simulation and passive in-store validation screen
import { getState, setState, incrementVisit, resetVisits } from '../../state.js';
import { getIconSvg } from '../../components/Icon.js';
import { createFakeQR } from '../../components/FakeQR.js';

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
        <p>Muestra tu pantalla en caja en cada consumo. Al llegar a 3 visitas desbloquearás la tarjeta de sellos y tu carta exclusiva.</p>
        
        <div class="three-visits" aria-label="Progreso de 3 visitas">
          <i class="${state.visits >= 1 ? 'done' : ''}" title="Visita 1"></i>
          <i class="${state.visits >= 2 ? 'done' : ''}" title="Visita 2"></i>
          <i class="${state.visits >= 3 ? 'done' : ''}" title="Visita 3"></i>
        </div>

        <div class="demo-box" style="margin-top: 24px;">
          <div class="demo-box-text">
            <strong>Simulación para el Pitch</strong>
            <small>Avanza paso a paso para ver la transición a tarjeta activa.</small>
          </div>
          <div class="demo-actions-row">
            <button type="button" class="button button-primary" id="btn-add-visit">
              +1 Visita (${state.visits} &rarr; ${state.visits + 1})
            </button>
            <button type="button" class="button button-quiet" id="btn-reset-visits" title="Reiniciar a 0">
              ${getIconSvg('reset', 14)} 0
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-add-visit').addEventListener('click', () => {
      incrementVisit();
      const fresh = renderLoyaltyView();
      container.replaceWith(fresh);
    });

    container.querySelector('#btn-reset-visits').addEventListener('click', () => {
      resetVisits();
      const fresh = renderLoyaltyView();
      container.replaceWith(fresh);
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

    <!-- Barra de Simulación Secuencial -->
    <div class="demo-box">
      <div class="demo-box-text">
        <strong>Simular progreso en vivo</strong>
        <small>Total visitas: ${state.visits} · Sellos: ${state.stamps}/8</small>
      </div>
      <div class="demo-actions-row">
        <button type="button" class="button button-outline" id="btn-advance-visit">
          +1 Visita (${state.stamps < 8 ? `Sello ${state.stamps + 1}` : 'Max'})
        </button>
        <button type="button" class="button button-quiet" id="btn-reset-unlocked" title="Reiniciar a 0">
          ${getIconSvg('reset', 14)} Reiniciar
        </button>
      </div>
    </div>

    <!-- Pantalla pasiva de validación en caja (cuando no hay premio pendiente de canje) -->
    ${!state.code && state.stamps < 4 ? `
      <div class="passive-scan-panel">
        <div class="passive-scan-badge">
          ${getIconSvg('shop', 16)} Validación en mostrador
        </div>
        <h3>Muestra esta pantalla en caja para recibir tu sello</h3>
        <p>El personal escaneará tu código para sumar tu visita a la tarjeta.</p>
        <div class="passive-qr-holder" id="passive-stamp-qr"></div>
        <div class="passive-pin-chip">ID de cliente: TC-${state.userProfile?.avatar || 'ALEX'}-884</div>
      </div>
    ` : ''}

    ${state.stamps >= 4 && !state.code ? `
      <div class="claim-box">
        <span class="kicker">Premio disponible</span>
        <h3>Tu taco corre por la casa</h3>
        <p>Genera tu código de canje para mostrarlo al personal en caja. Válido durante tu visita.</p>
        <button type="button" class="button button-primary full-width-btn" id="claim-prize-btn">
          ${getIconSvg('ticket', 18)} Canjear premio en caja
        </button>
      </div>
    ` : ''}

    ${state.code ? `
      <!-- Pantalla pasiva de canje de premio -->
      <div class="passive-redemption-screen">
        <div class="passive-redemption-badge">
          ${getIconSvg('check', 18)} Listo para canjear en caja
        </div>
        <span class="kicker">Tacos El Cometa</span>
        <h2 class="code-display">${state.code}</h2>
        <div class="passive-qr-holder" id="passive-prize-qr"></div>
        <p class="passive-instruction-text">
          Muestra esta pantalla al taquero en caja para validar y recibir tu premio.
        </p>
        <small class="expiry-note">
          ${getIconSvg('clock', 14)} Válido por 09:42 min
        </small>
        <button type="button" class="button button-quiet cancel-claim-btn" id="btn-close-code">
          Cerrar pantalla
        </button>
      </div>
    ` : ''}
  `;

  // Attach QR codes
  const stampQrSlot = container.querySelector('#passive-stamp-qr');
  if (stampQrSlot) {
    stampQrSlot.appendChild(createFakeQR({ small: true }));
  }

  const prizeQrSlot = container.querySelector('#passive-prize-qr');
  if (prizeQrSlot) {
    prizeQrSlot.appendChild(createFakeQR({ small: false }));
  }

  // Event handlers
  container.querySelector('#btn-advance-visit')?.addEventListener('click', () => {
    incrementVisit();
    const fresh = renderLoyaltyView();
    container.replaceWith(fresh);
  });

  container.querySelector('#btn-reset-unlocked')?.addEventListener('click', () => {
    resetVisits();
    const fresh = renderLoyaltyView();
    container.replaceWith(fresh);
  });

  container.querySelector('#claim-prize-btn')?.addEventListener('click', () => {
    setState({ code: 'TC-345', codeExpires: Date.now() + 600000, validated: false });
    const fresh = renderLoyaltyView();
    container.replaceWith(fresh);
  });

  container.querySelector('#btn-close-code')?.addEventListener('click', () => {
    setState({ code: '', codeExpires: null });
    const fresh = renderLoyaltyView();
    container.replaceWith(fresh);
  });

  return container;
}
