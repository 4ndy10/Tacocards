// ponytail: Local Detail View with trading card preview and fidelity progress
import { getState } from '../../state.js';
import { locals, cardDetails, rarityLabel } from '../../data/mockData.js';
import { navigateTo } from '../../router.js';
import { getIconSvg } from '../../components/Icon.js';
import { createTradingCard } from '../../components/TradingCard.js';
import { createButton } from '../../components/Button.js';

export function renderDetailView() {
  const state = getState();
  const local = locals.find(l => l.id === state.selectedLocalId) || locals[0];
  const details = cardDetails[local.id] || { blurb: '', address: '' };

  const container = document.createElement('div');
  container.className = 'phone-view detail-view';

  container.innerHTML = `
    <div class="detail-photo">
      <img src="${local.photo}" alt="Platillo destacado de ${local.name}">
      <button type="button" class="circle-button back-btn" aria-label="Regresar al mapa">
        ${getIconSvg('back', 20)}
      </button>
      <span class="open-badge">Abierto ahora · 12:00–00:00</span>
    </div>

    <div class="detail-copy">
      <span class="kicker">${local.type} · ${local.zone}</span>
      <h2>${local.name}</h2>
      <p class="detail-blurb">${details.blurb}</p>

      <div class="local-facts">
        <span>${getIconSvg('clock', 14)} ${local.schedule}</span>
        <span>${getIconSvg('map', 14)} 1.2 km · 8 min</span>
      </div>

      <div class="address-line">
        ${getIconSvg('map', 14)}
        <span>${details.address}</span>
      </div>

      <section class="menu-highlights">
        <h3>Especialidad de la casa</h3>
        <div class="highlight-pills">
          <span>${local.dish.replace('Especialidad: ', '')} <strong>$48</strong></span>
          <span>Orden de tacos <strong>$132</strong></span>
          <span>Agua fresca <strong>$35</strong></span>
        </div>
      </section>

      <div class="detail-card-section">
        <div class="card-embed-slot"></div>
        <div class="detail-card-meta">
          <span class="rarity-chip">${rarityLabel[local.rarity]}</span>
          <h3>${local.dish.replace('Especialidad: ', '')}</h3>
          <p>Toca la carta para girarla y leer su historia.</p>
        </div>
      </div>

      ${state.visits < 3 ? `
        <div class="visit-meter">
          <div class="visit-meter-head">
            <span>Progreso de fidelidad</span>
            <strong>Visita ${state.visits}/3</strong>
          </div>
          <div class="meter-bar">
            <span style="width: ${(state.visits / 3) * 100}%"></span>
          </div>
          <small>Una visita más desbloquea la tarjeta exclusiva de este local.</small>
        </div>
      ` : `
        <div class="detail-stamps">
          <div class="detail-stamps-head">
            <span>Fidelidad desbloqueada</span>
            <strong>${state.stamps} de 8 sellos</strong>
          </div>
          <div class="stamps-mini-row">
            ${Array.from({ length: 8 }, (_, i) => `
              <i class="${i < state.stamps ? 'done' : ''}">${i < state.stamps ? getIconSvg('star', 12) : i + 1}</i>
            `).join('')}
          </div>
          <small>Premios en sellos 4 y 8.</small>
        </div>
      `}
    </div>

    <div class="phone-sticky"></div>
  `;

  // Attach card
  const cardSlot = container.querySelector('.card-embed-slot');
  cardSlot.appendChild(createTradingCard({
    local,
    compact: true,
    preview: false
  }));

  // Attach Scan button
  const stickySlot = container.querySelector('.phone-sticky');
  stickySlot.appendChild(createButton({
    text: 'Escanear QR en el local',
    icon: 'scan',
    variant: 'primary',
    className: 'full-width-btn',
    onClick: () => navigateTo('scan')
  }));

  // Back button
  container.querySelector('.back-btn').addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('map');
    }
  });

  return container;
}
