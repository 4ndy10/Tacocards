// ponytail: QR display with embedded business/TacoCards center logo and physical point-of-sale kit page
import { createFakeQR } from '../../components/FakeQR.js';
import { getIconSvg } from '../../components/Icon.js';
import { getState, toggleTheme } from '../../state.js';

let kitOrdered = false;
let qrLogoMode = 'business'; // 'business' | 'tacocards'

export function renderQrPage() {
  const container = document.createElement('div');
  container.className = 'business-page qr-page';

  function render() {
    const state = getState();
    const isDark = state.theme === 'dark';
    const isBizLogo = qrLogoMode === 'business';

    container.innerHTML = `
      <div class="page-heading qr-page-heading">
        <div>
          <span class="biz-subtitle">Punto de contacto en mostrador</span>
          <h2>Mi código QR</h2>
          <p>Muéstralo en tu caja para que tus comensales verifiquen visitas y coleccionen tu carta.</p>
        </div>
        <button type="button" class="theme-toggle-btn" id="qr-theme-toggle" aria-label="Cambiar entre modo claro y oscuro">
          ${getIconSvg(isDark ? 'sun' : 'moon', 18)}
          <span>${isDark ? 'Claro' : 'Oscuro'}</span>
        </button>
      </div>

      <div class="business-qr-card">
        <div class="screen-brand">
          <i>TC</i>
          <span><strong>TacoCards</strong><small>TIJUANA</small></span>
        </div>

        <div class="qr-logo-selector" role="group" aria-label="Logotipo central del código QR">
          <button type="button" class="qr-logo-opt ${isBizLogo ? 'active' : ''}" data-logo-mode="business">
            ${getIconSvg('taco', 16)} Logo del Negocio (TEC)
          </button>
          <button type="button" class="qr-logo-opt ${!isBizLogo ? 'active' : ''}" data-logo-mode="tacocards">
            ${getIconSvg('spark', 16)} Logo TacoCards (TC)
          </button>
        </div>

        <div class="qr-canvas-mount"></div>
        <span class="qr-embedded-pill">
          ${getIconSvg('check', 14)}
          Emblema ${isBizLogo ? 'oficial de Tacos El Cometa' : 'oficial de TacoCards'} incrustado al centro
        </span>
        <h3>Tacos El Cometa</h3>
        <p class="qr-identifier">ID OFICIAL · TEC-ZR-0184</p>
        <small class="qr-zone">Zona Río · Paseo del Río 184</small>
      </div>

      <div class="kit-panel">
        <div class="kit-art">
          <div class="kit-badge">
            <span>${isBizLogo ? 'TEC' : 'TC'}</span>
            <small>ESCANEA AQUÍ</small>
          </div>
        </div>
        <span class="kicker">Kit físico de mostrador</span>
        <h3>Materiales para tu caja</h3>
        <p>Incluye 2 tent cards acrílicas para mesas, 4 stickers impermeables para caja y una guía para tu equipo de servicio.</p>

        ${kitOrdered ? `
          <div class="status-message success">
            ${getIconSvg('check', 20)}
            <div>
              <strong>Solicitud de kit recibida</strong>
              <small>Nos pondremos en contacto contigo para coordinar la entrega en Zona Río.</small>
            </div>
          </div>
        ` : `
          <button type="button" class="button button-primary full-width-btn" id="order-kit-btn">
            ${getIconSvg('gift', 20)} <span>Pedir kit de mostrador por $199 MXN</span>
          </button>
        `}
      </div>
    `;

    const mount = container.querySelector('.qr-canvas-mount');
    mount.appendChild(
      createFakeQR({
        small: false,
        logo: isBizLogo ? 'TEC' : 'TC',
        sublabel: isBizLogo ? 'COMETA' : 'TIJUANA',
        icon: isBizLogo ? 'taco' : 'spark',
        showLogo: true
      })
    );

    container.querySelector('#qr-theme-toggle')?.addEventListener('click', () => {
      toggleTheme();
    });

    container.querySelectorAll('[data-logo-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        qrLogoMode = btn.dataset.logoMode;
        render();
      });
    });

    const orderBtn = container.querySelector('#order-kit-btn');
    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        kitOrdered = true;
        render();
      });
    }
  }

  render();
  return container;
}
