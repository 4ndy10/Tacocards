// ponytail: Simulated interactive camera viewfinder with confetti card reveal
import { getState, setState } from '../../state.js';
import { locals, photos } from '../../data/mockData.js';
import { navigateTo } from '../../router.js';
import { getIconSvg } from '../../components/Icon.js';
import { createTradingCard } from '../../components/TradingCard.js';
import { createButton } from '../../components/Button.js';

export function renderScanView() {
  const state = getState();
  const local = locals.find(l => l.id === state.selectedLocalId) || locals[0];

  let revealed = false;
  const container = document.createElement('div');
  container.className = 'phone-view scan-view';

  function render() {
    container.className = `phone-view scan-view ${revealed ? 'revealed' : ''}`;
    container.innerHTML = `
      <div class="scan-top">
        <button type="button" class="circle-button scan-back-btn" aria-label="Regresar">
          ${getIconSvg('back', 20)}
        </button>
        <div>
          <span>${local.name}</span>
          <h2>${revealed ? '¡Carta obtenida!' : 'Escanear QR'}</h2>
        </div>
      </div>

      ${!revealed ? `
        <div class="camera-view">
          <img src="${photos.street}" alt="Vista simulada de la cámara" loading="lazy">
          <div class="scan-frame" aria-hidden="true">
            <i></i><span></span><span></span><span></span><span></span>
          </div>
          <p>Alinea el código QR del mostrador</p>
        </div>

        <div class="scan-actions">
          <span class="location-status">
            ${getIconSvg('check', 14)}
            <span>Ubicación GPS verificada · En el local</span>
          </span>
          <h3>Simulación de lectura en caja</h3>
          <div class="scan-btn-slot"></div>
        </div>
      ` : `
        <div class="reveal-area">
          <div class="confetti" aria-hidden="true">
            ${Array.from({ length: 24 }, (_, i) => `<i style="--n: ${i}"></i>`).join('')}
          </div>
          <span class="kicker">Tercera visita verificada</span>
          <h2>¡Tu colección crece!</h2>

          <div class="reveal-card-slot"></div>

          <div class="earned">
            ${getIconSvg('spark', 18)}
            <strong>+120 pts</strong>
            <span>Tarjeta de fidelidad desbloqueada</span>
          </div>

          <div class="reveal-btn-slot"></div>
        </div>
      `}
    `;

    // Back button
    container.querySelector('.scan-back-btn').addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigateTo('detail');
      }
    });

    if (!revealed) {
      const scanBtnSlot = container.querySelector('.scan-btn-slot');
      scanBtnSlot.appendChild(createButton({
        text: 'Simular escaneo de QR',
        icon: 'qr',
        variant: 'primary',
        className: 'full-width-btn',
        onClick: () => {
          revealed = true;
          render();
        }
      }));
    } else {
      const cardSlot = container.querySelector('.reveal-card-slot');
      cardSlot.appendChild(createTradingCard({
        local,
        compact: false,
        preview: false
      }));

      const revealBtnSlot = container.querySelector('.reveal-btn-slot');
      revealBtnSlot.appendChild(createButton({
        text: 'Guardar y abrir fidelidad',
        icon: 'gift',
        variant: 'primary',
        className: 'full-width-btn',
        onClick: () => {
          setState({
            visits: 3,
            stamps: Math.max(1, state.stamps),
            consumerView: 'loyalty'
          });
          navigateTo('loyalty');
        }
      }));
    }
  }

  render();
  return container;
}
