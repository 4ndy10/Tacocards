// ponytail: Trading card with 3D gyro tilt and tap-to-flip.
import { rarityLabel, cardDetails } from '../data/mockData.js';
import { getIconSvg } from './Icon.js';
import { createFakeQR } from './FakeQR.js';

// Setup shared gyroscope listener once for performance
let gyroActive = false;
let currentTilt = { rx: 0, ry: 0, mx: 50, my: 50 };

function initGyroscope() {
  if (gyroActive || typeof window === 'undefined') return;
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
      if (event.gamma !== null && event.beta !== null) {
        // gamma: left-to-right tilt [-90, 90]
        // beta: front-to-back tilt [-180, 180], normal hold angle ~45deg
        const ry = Math.max(-18, Math.min(18, event.gamma * 0.4));
        const rx = Math.max(-18, Math.min(18, (event.beta - 45) * 0.4));
        currentTilt.rx = rx;
        currentTilt.ry = ry;
        currentTilt.mx = 50 + ry * 2.2;
        currentTilt.my = 50 + rx * 2.2;

        document.querySelectorAll('.collectible:not(.locked)').forEach((card) => {
          card.style.setProperty('--rx', `${rx}deg`);
          card.style.setProperty('--ry', `${ry}deg`);
          card.style.setProperty('--mx', `${currentTilt.mx}%`);
          card.style.setProperty('--my', `${currentTilt.my}%`);
        });
      }
    }, { passive: true });
    gyroActive = true;
  }
}

export function createTradingCard({
  local,
  locked = false,
  compact = false,
  preview = false,
  forcedFlipped = null,
  onActivate = null
}) {
  initGyroscope();

  const details = cardDetails[local.id] || { blurb: '', address: '' };
  const card = document.createElement('button');
  card.type = 'button';
  card.className = `collectible ${local.rarity} ${compact ? 'compact' : ''} ${locked ? 'locked' : ''}`.trim();
  card.setAttribute('aria-label', locked ? 'Carta bloqueada' : `Carta ${local.name}. Toca para voltear`);

  let isFlipped = forcedFlipped !== null ? forcedFlipped : false;
  if (isFlipped) card.classList.add('flipped');

  // Pointer move fallback for non-gyro devices or desktop
  const handlePointerMove = (e) => {
    if (locked) return;
    const box = card.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
    card.style.setProperty('--rx', `${(0.5 - y) * 12}deg`);
    card.style.setProperty('--ry', `${(x - 0.5) * 14}deg`);
  };

  const handlePointerLeave = () => {
    if (locked) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  card.addEventListener('pointermove', handlePointerMove);
  card.addEventListener('pointerleave', handlePointerLeave);

  card.addEventListener('click', () => {
    if (locked) return;
    if (onActivate) {
      onActivate(local);
    } else if (!preview) {
      isFlipped = !isFlipped;
      card.classList.toggle('flipped', isFlipped);
    }
  });

  const frontHtml = `
    <div class="card-face card-front">
      <div class="foil"></div>
      <div class="card-title-band">
        <h3>${locked ? 'Negocio por descubrir' : local.name}</h3>
        <span class="rarity-badge">${rarityLabel[local.rarity]}</span>
      </div>
      <div class="illustration">
        <img src="${local.photo}" alt="${locked ? 'Carta bloqueada' : local.dish}" loading="lazy">
        ${locked ? `<div class="locked-art">${getIconSvg('lock', 34)}<span>?</span></div>` : ''}
      </div>
      <div class="card-band">
        <div class="card-location">
          <span>${local.type}</span>
          <span>${local.zone}</span>
        </div>
        <p class="card-blurb">${locked ? 'Descúbrelo en el mapa para revelar su historia.' : details.blurb}</p>
        <div class="card-stats">
          <div>${getIconSvg('flame', 13)}<span>Sabor</span><strong>${locked ? '—' : local.stats[0]}</strong></div>
          <div>${getIconSvg('star', 13)}<span>Fama</span><strong>${locked ? '—' : local.stats[1]}</strong></div>
          <div>${getIconSvg('people', 13)}<span>Visitas</span><strong>${locked ? '—' : local.stats[2]}</strong></div>
        </div>
      </div>
      <div class="card-footer">
        <span>${local.number}</span>
        <span>TacoCards Tijuana</span>
      </div>
    </div>
  `;

  const ownerInitials = local.owner.split(' ').map(w => w[0]).join('').slice(0, 2);

  const backHtml = `
    <div class="card-face card-back">
      <div class="back-identity">
        <span>${local.number}</span>
        <span>${rarityLabel[local.rarity]}</span>
      </div>
      <span class="back-kicker">Detrás del negocio</span>
      <h3>${local.name}</h3>
      <div class="owner-chip">
        <span class="owner-avatar">${ownerInitials}</span>
        <div>
          <strong>${local.owner}</strong>
          <small>${local.since} · ${local.zone}</small>
        </div>
      </div>
      <p class="owner-story">“${local.history}”</p>
      <div class="back-hours">
        ${getIconSvg('clock', 14)}
        <span>${local.schedule}</span>
      </div>
      <div class="mini-card-map">
        ${getIconSvg('map', 14)}
        <span>${details.address}</span>
      </div>
      <div class="back-action">
        <div class="back-qr-slot"></div>
        <span>
          <strong>Visita este local</strong>
          <small>Escanea en su mostrador para sumar visitas y cartas.</small>
        </span>
      </div>
    </div>
  `;

  card.innerHTML = `<div class="card-tilt">${frontHtml}${backHtml}</div>`;

  // Attach small QR to back
  const backQrSlot = card.querySelector('.back-qr-slot');
  if (backQrSlot) {
    backQrSlot.appendChild(createFakeQR({ small: true }));
  }

  return card;
}
