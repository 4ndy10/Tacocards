// ponytail: Renders deterministic 9x9 QR grid with embedded center logo badge
import { getIconSvg } from './Icon.js';

export function createFakeQR({
  small = false,
  logo = 'TC',
  sublabel = '',
  icon = 'taco',
  showLogo = true
} = {}) {
  const container = document.createElement('div');
  container.className = `fake-qr ${small ? 'small' : ''}`.trim();

  // Deterministic QR pattern with finder corners and reserved center (cell 40)
  const filled = [
    0, 1, 2, 3, 5, 6, 7, 8,
    9, 11, 13, 15, 17,
    18, 19, 20, 22, 24, 25, 26,
    27, 29, 33, 35,
    36, 37, 43, 44,
    45, 47, 51, 53,
    54, 55, 56, 58, 60, 62,
    63, 65, 67, 69, 71,
    72, 73, 74, 76, 78, 79, 80
  ];

  for (let i = 0; i < 81; i++) {
    const bit = document.createElement('i');
    if (filled.includes(i)) bit.className = 'on';
    container.appendChild(bit);
  }

  if (showLogo) {
    const badge = document.createElement('div');
    badge.className = 'qr-center-logo';
    badge.setAttribute('aria-label', `Logo ${logo}`);
    badge.innerHTML = `
      ${!small && icon ? `<span class="qr-logo-icon">${getIconSvg(icon, 14)}</span>` : ''}
      <strong class="qr-logo-text">${logo}</strong>
      ${!small && sublabel ? `<small class="qr-logo-sub">${sublabel}</small>` : ''}
    `;
    container.appendChild(badge);
  }

  return container;
}
