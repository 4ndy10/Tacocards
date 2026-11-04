// ponytail: QR display and physical point-of-sale kit page
import { createFakeQR } from '../../components/FakeQR.js';
import { getIconSvg } from '../../components/Icon.js';

let kitOrdered = false;

export function renderQrPage() {
  const container = document.createElement('div');
  container.className = 'business-page qr-page';

  container.innerHTML = `
    <div class="page-heading">
      <span class="biz-subtitle">Punto de contacto en mostrador</span>
      <h2>Mi código QR</h2>
      <p>Muéstralo en tu caja para que tus comensales verifiquen visitas y coleccionen tu carta.</p>
    </div>

    <div class="business-qr-card">
      <div class="screen-brand">
        <i>TC</i>
        <span><strong>TacoCards</strong><small>TIJUANA</small></span>
      </div>
      <div class="qr-canvas-mount"></div>
      <h3>Tacos El Cometa</h3>
      <p class="qr-identifier">ID OFICIAL · TEC-ZR-0184</p>
      <small class="qr-zone">Zona Río · Paseo del Río 184</small>
    </div>

    <div class="kit-panel">
      <div class="kit-art">
        <div class="kit-badge">
          <span>TC</span>
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
          ${getIconSvg('gift', 18)} Pedir kit de mostrador por $199 MXN
        </button>
      `}
    </div>
  `;

  const mount = container.querySelector('.qr-canvas-mount');
  mount.appendChild(createFakeQR({ small: false }));

  const orderBtn = container.querySelector('#order-kit-btn');
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      kitOrdered = true;
      renderQrPage();
    });
  }

  return container;
}
