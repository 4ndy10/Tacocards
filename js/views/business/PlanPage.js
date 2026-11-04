// ponytail: Merchant subscription plan comparison and delivery commission savings calculator
import { getState, setState } from '../../state.js';
import { getIconSvg } from '../../components/Icon.js';
import { navigateTo } from '../../router.js';

let ordersCount = 100;

export function renderPlanPage() {
  const state = getState();
  const isFree = state.plan === 'free';
  const container = document.createElement('div');
  container.className = 'business-page plan-page';

  function calculateDeliveryFee(orders) {
    // Average ticket $176 * 30% commission * 1.16 IVA
    return Math.round(orders * 176 * 0.30 * 1.16);
  }

  function render() {
    const deliveryFee = calculateDeliveryFee(ordersCount);
    const savings = Math.max(0, deliveryFee - 249);

    container.innerHTML = `
      <div class="page-heading">
        <span class="biz-subtitle">Rentabilidad para tu negocio</span>
        <h2>Planes y Ahorro</h2>
        <p>Compara el costo fijo mensual de TacoCards frente al 30% de comisión de las plataformas de delivery.</p>
      </div>

      <div class="plan-cards-stack">
        <!-- Plan Gratis -->
        <article class="plan-tier-card ${isFree ? 'current-plan' : ''}">
          <div class="tier-header">
            ${isFree ? '<span class="tier-badge current">PLAN ACTUAL</span>' : ''}
            <h3>Plan Gratuito</h3>
            <div class="tier-price"><strong>$0</strong> <span>MXN/mes</span></div>
          </div>
          <p>Presencia básica en el mapa y cartas coleccionables para tus comensales.</p>
          <ul class="tier-features">
            <li>${getIconSvg('check', 14)} Perfil oficial de negocio en el mapa</li>
            <li>${getIconSvg('check', 14)} Código QR de visitas para caja</li>
            <li>${getIconSvg('check', 14)} 1 métrica de visitas acumuladas</li>
          </ul>
        </article>

        <!-- Plan Destacado -->
        <article class="plan-tier-card featured-tier ${!isFree ? 'current-plan' : ''}">
          <div class="tier-header">
            <span class="tier-badge ${!isFree ? 'current' : 'recommended'}">
              ${!isFree ? 'PLAN ACTUAL' : 'RECOMENDADO'}
            </span>
            <h3>Plan Destacado</h3>
            <div class="tier-price"><strong>$249</strong> <span>MXN/mes</span></div>
          </div>
          <p>Fidelización completa, canjes directos en mostrador y analítica de clientes.</p>
          <ul class="tier-features">
            <li>${getIconSvg('check', 14)} Programa de sellos y recompensas exclusivas</li>
            <li>${getIconSvg('check', 14)} Cupones promocionales en el Pase Taquero</li>
            <li>${getIconSvg('check', 14)} Dashboard completo con retención de clientes</li>
            <li>${getIconSvg('check', 14)} Pin destacado y rutas preferenciales en el mapa</li>
          </ul>
          <button type="button" class="button button-primary full-width-btn" id="activate-destacado-btn">
            ${!isFree ? 'Plan Destacado Activo' : 'Subir a Destacado · $249/mes'}
          </button>
        </article>
      </div>

      <div class="plan-calculator-card">
        <div class="calc-header">
          <span>Calculadora de ahorro</span>
          <div class="calc-value"><strong>${ordersCount}</strong> pedidos mensuales</div>
        </div>
        <input type="range" 
               id="orders-range" 
               class="calc-slider" 
               min="20" 
               max="200" 
               step="10" 
               value="${ordersCount}" 
               aria-label="Pedidos mensuales">
        <small class="calc-formula">Cálculo basado en ticket promedio de $176 con 30% comisión + IVA.</small>

        <div class="calc-comparison-row">
          <div class="calc-cost-box bad">
            <small>Apps de Delivery</small>
            <strong>$${deliveryFee.toLocaleString('es-MX')}</strong>
            <span>al mes en comisiones</span>
          </div>
          <div class="calc-cost-box good">
            <small>TacoCards Fijo</small>
            <strong>$249</strong>
            <span>al mes sin comisiones</span>
          </div>
        </div>

        <div class="calc-savings-note">
          ${getIconSvg('trend', 20)}
          <div>
            <strong>Ahorras hasta $${savings.toLocaleString('es-MX')} MXN/mes</strong>
            <small>Con solo 2 visitas extra al mes, tu suscripción se paga completamente sola.</small>
          </div>
        </div>
      </div>

      <div class="plan-actions-footer">
        <button type="button" class="button button-outline full-width-btn" id="see-roi-btn">
          ${getIconSvg('chart', 16)} Ver desglose en Métricas
        </button>
      </div>
    `;

    const slider = container.querySelector('#orders-range');
    slider.addEventListener('input', (e) => {
      ordersCount = Number(e.target.value);
      render();
    });

    const activateBtn = container.querySelector('#activate-destacado-btn');
    if (activateBtn && isFree) {
      activateBtn.addEventListener('click', () => {
        setState({ plan: 'premium' });
        render();
      });
    }

    container.querySelector('#see-roi-btn').addEventListener('click', () => {
      navigateTo('dashboard');
    });
  }

  render();
  return container;
}
