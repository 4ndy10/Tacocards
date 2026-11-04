// ponytail: Business bottom navigation bar with 5 accessible touch tabs
import { getState } from '../../state.js';
import { navigateTo } from '../../router.js';
import { getIconSvg } from '../../components/Icon.js';

export function createBusinessNav() {
  const state = getState();
  const nav = document.createElement('nav');
  nav.className = 'business-bottom-nav';
  nav.setAttribute('aria-label', 'Navegación de locatario');

  const items = [
    { id: 'dashboard', label: 'Métricas', icon: 'chart' },
    { id: 'redeem', label: 'Canjes', icon: 'ticket' },
    { id: 'business-loyalty', label: 'Fidelidad', icon: 'card' },
    { id: 'qr', label: 'Mi QR', icon: 'qr' },
    { id: 'plan', label: 'Plan', icon: 'wallet' }
  ];

  items.forEach(({ id, label, icon }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `biz-tab ${state.businessView === id ? 'active' : ''}`;
    btn.innerHTML = `${getIconSvg(icon, 18)}<span>${label}</span>`;
    btn.addEventListener('click', () => {
      navigateTo(id);
    });
    nav.appendChild(btn);
  });

  return nav;
}
