// ponytail: Consumer bottom navigation bar with accessible touch targets
import { getState } from '../../state.js';
import { navigateTo } from '../../router.js';
import { getIconSvg } from '../../components/Icon.js';

export function createConsumerNav() {
  const state = getState();
  const nav = document.createElement('nav');
  nav.className = 'consumer-nav';
  nav.setAttribute('aria-label', 'Navegación principal');

  const items = [
    { id: 'map', label: 'Mapa', icon: 'map' },
    { id: 'album', label: 'Álbum', icon: 'album' },
    { id: 'loyalty', label: 'Fidelidad', icon: 'card' },
    { id: 'profile', label: 'Perfil', icon: 'person' }
  ];

  items.forEach(({ id, label, icon }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `nav-tab ${state.consumerView === id ? 'active' : ''}`;
    btn.innerHTML = `${getIconSvg(icon, 20)}<span>${label}</span>`;
    btn.addEventListener('click', () => {
      navigateTo(id);
    });
    nav.appendChild(btn);
  });

  return nav;
}
