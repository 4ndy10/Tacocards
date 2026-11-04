// ponytail: Dedicated coupons view with free vs. premium plan validation and coupon redemption modal
import { getState } from '../../state.js';
import { couponsData } from '../../data/mockData.js';
import { getIconSvg } from '../../components/Icon.js';
import { createFakeQR } from '../../components/FakeQR.js';
import { navigateTo } from '../../router.js';

export function renderCouponsView() {
  const state = getState();
  const container = document.createElement('div');
  container.className = 'coupons-component';

  const isFree = state.plan === 'free';

  container.innerHTML = `
    <div class="coupons-view ${isFree ? 'feature-locked' : ''}">
      <div class="coupons-hero-bar">
        <div>
          <span class="coupons-kicker">${isFree ? 'Beneficio Premium' : 'Cupones del Mes'}</span>
          <h3>Ahorra en tus paradas</h3>
        </div>
        <span class="plan-status-pill ${isFree ? 'free' : 'premium'}">
          ${isFree ? 'Pase Requerido' : 'Pase Activo'}
        </span>
      </div>

      <div class="coupon-list">
        ${couponsData.map(cp => `
          <article class="coupon-item ${isFree ? 'coupon-blurred' : ''}" data-coupon-id="${cp.id}">
            <div class="coupon-tag-col">
              <span class="coupon-discount">${cp.discount}</span>
              <span class="coupon-type-tag">Válido hoy</span>
            </div>
            <div class="coupon-info">
              <strong>${cp.title}</strong>
              <small>${cp.subtitle}</small>
              <div class="coupon-meta">
                <span class="coupon-loc-name">${cp.subtitle.split('·')[0].trim()}</span>
                ${!isFree ? `
                  <button type="button" class="coupon-redeem-btn" data-coupon-id="${cp.id}">
                    Canjear
                  </button>
                ` : ''}
              </div>
            </div>
          </article>
        `).join('')}
      </div>

      ${isFree ? `
        <div class="locked-message">
          <div class="locked-icon-shield">
            ${getIconSvg('lock', 34)}
          </div>
          <strong>Cupones exclusivos de Tijuana</strong>
          <p>Disfruta de promociones 2×1 y descuentos en taquerías y reposterías con el Pase Taquero.</p>
          <div class="price-chip">$39 MXN / mes</div>
          <button type="button" class="upgrade-btn-inline" id="coupons-go-pass-btn">
            ${getIconSvg('crown', 16)} Obtener Pase Taquero
          </button>
        </div>
      ` : ''}

      <div id="coupon-modal-mount"></div>
    </div>
  `;

  // Free upsell redirect
  const goPassBtn = container.querySelector('#coupons-go-pass-btn');
  if (goPassBtn) {
    goPassBtn.addEventListener('click', () => {
      navigateTo('profile');
    });
  }

  // Redeem buttons for premium users
  if (!isFree) {
    container.querySelectorAll('.coupon-redeem-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const couponId = Number(btn.dataset.couponId);
        const coupon = couponsData.find(c => c.id === couponId);
        if (coupon) {
          openCouponRedeemModal(coupon, container);
        }
      });
    });
  }

  return container;
}

function openCouponRedeemModal(coupon, container) {
  const mount = container.querySelector('#coupon-modal-mount');
  if (!mount) return;

  const code = `TC-${coupon.id}${Math.floor(100 + Math.random() * 900)}`;

  const modal = document.createElement('div');
  modal.className = 'coupon-redeem-modal-backdrop';
  modal.innerHTML = `
    <div class="coupon-redeem-sheet" role="dialog" aria-modal="true">
      <button type="button" class="sheet-close-btn" aria-label="Cerrar">&times;</button>
      <div class="coupon-sheet-discount">${coupon.discount}</div>
      <h3>${coupon.title}</h3>
      <p class="coupon-sheet-sub">${coupon.subtitle}</p>

      <div class="coupon-qr-container">
        <div class="coupon-qr-wrapper" id="coupon-qr-slot"></div>
        <div class="coupon-code-string">${code}</div>
        <span class="coupon-timer">${getIconSvg('clock', 14)} Válido por 15:00 minutos</span>
      </div>

      <div class="passive-instruction-card">
        ${getIconSvg('shop', 18)}
        <p>Muestra esta pantalla al ordenar en el mostrador para validar tu beneficio.</p>
      </div>

      <button type="button" class="button button-outline full-width-btn" id="close-coupon-modal-btn">
        Listo
      </button>
    </div>
  `;

  const qrSlot = modal.querySelector('#coupon-qr-slot');
  qrSlot.appendChild(createFakeQR({ small: false }));

  const closeModal = () => modal.remove();
  modal.querySelector('.sheet-close-btn').addEventListener('click', closeModal);
  modal.querySelector('#close-coupon-modal-btn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  mount.appendChild(modal);
}
