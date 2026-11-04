// ponytail: Mobile map view with responsive pin positioning and place card preview
import { getState, setState } from '../../state.js';
import { locals, rarityLabel } from '../../data/mockData.js';
import { navigateTo } from '../../router.js';
import { getIconSvg } from '../../components/Icon.js';
import { initDevModalTrigger } from '../../components/DevModal.js';

let activeCategory = 'Todos';

export function renderMapView() {
  const state = getState();
  const container = document.createElement('div');
  container.className = 'phone-view map-view';

  // Filter locals based on category
  const filteredLocals = locals.filter(loc => {
    if (activeCategory === 'Todos') return true;
    if (activeCategory === 'Tacos') return loc.type.toLowerCase().includes('taquer');
    if (activeCategory === 'Birria') return loc.type.toLowerCase().includes('birri');
    if (activeCategory === 'Mariscos') return loc.type.toLowerCase().includes('marisc');
    if (activeCategory === 'Postres') return loc.type.toLowerCase().includes('reposter');
    return true;
  });

  const selectedLocal = locals.find(l => l.id === state.selectedLocalId) || filteredLocals[0] || locals[0];

  container.innerHTML = `
    <header class="consumer-greeting">
      <div class="greeting-brand-row">
        <span>¡Hola, Alex!</span>
        <div class="screen-brand" id="brand-logo-trigger" title="Triple toque para menú de pitch">
          <i>TC</i>
          <span><strong>TacoCards</strong><small>TIJUANA</small></span>
        </div>
      </div>
      <h2>¿Qué se te antoja hoy?</h2>
      <div class="map-filters" role="tablist" aria-label="Filtros de comida">
        ${['Todos', 'Tacos', 'Birria', 'Mariscos', 'Postres'].map(cat => `
          <button type="button" class="filter-chip ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>
    </header>

    <div class="map-canvas">
      <div class="tijuana-map ${activeCategory !== 'Todos' ? 'filtered' : ''}">
        <span class="zone rio">Zona Río</span>
        <span class="zone centro">Centro</span>
        <span class="zone rev">Av. Revolución</span>
        <i class="road r1"></i>
        <i class="road r2"></i>
        <i class="road r3"></i>

        ${state.plan === 'premium' ? `
          <div class="premium-route" aria-hidden="true">
            <i></i><i></i><i></i><i></i>
          </div>
        ` : ''}

        ${filteredLocals.map(loc => `
          <button type="button" 
                  class="map-pin ${loc.pin} ${selectedLocal.id === loc.id ? 'selected' : ''} ${state.plan === 'premium' && loc.id === 1 ? 'featured' : ''}"
                  style="left: ${loc.coords.x}%; top: ${loc.coords.y}%;"
                  data-pin-id="${loc.id}"
                  aria-label="${loc.name}">
            ${getIconSvg(loc.type.includes('Postres') ? 'star' : 'map', 16)}
          </button>
        `).join('')}
      </div>

      <button type="button" class="routes-button ${state.plan === 'free' ? 'locked-feature' : ''}">
        ${state.plan === 'free' ? getIconSvg('lock', 14) : ''}
        ${getIconSvg('map', 15)}
        <span>Rutas por colonia</span>
        ${state.plan === 'free' ? '<small>Con el Pase</small>' : ''}
      </button>

      <div class="map-place" id="map-place-card">
        <img src="${selectedLocal.photo}" alt="${selectedLocal.name}" loading="lazy">
        <div class="map-place-info">
          <span class="open">Abierto · a 8 min</span>
          <h3>${selectedLocal.name}</h3>
          <p>${selectedLocal.type} · ${selectedLocal.zone}</p>
          <small class="rarity-hint">
            ${getIconSvg('spark', 13)}
            <span>Carta ${rarityLabel[selectedLocal.rarity].toLowerCase()} disponible</span>
          </small>
        </div>
        <div class="map-place-arrow">
          ${getIconSvg('arrow', 18)}
        </div>
      </div>
    </div>
  `;

  // Attach dev trigger to brand logo
  const logoTrigger = container.querySelector('#brand-logo-trigger');
  initDevModalTrigger(logoTrigger);

  // Category chip clicks
  container.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      const newFiltered = locals.filter(loc => {
        if (activeCategory === 'Todos') return true;
        if (activeCategory === 'Tacos') return loc.type.toLowerCase().includes('taquer');
        if (activeCategory === 'Birria') return loc.type.toLowerCase().includes('birri');
        if (activeCategory === 'Mariscos') return loc.type.toLowerCase().includes('marisc');
        if (activeCategory === 'Postres') return loc.type.toLowerCase().includes('reposter');
        return true;
      });
      if (newFiltered.length && !newFiltered.some(l => l.id === selectedLocal.id)) {
        setState({ selectedLocalId: newFiltered[0].id });
      } else {
        renderMapView();
      }
    });
  });

  // Pin clicks
  container.querySelectorAll('.map-pin').forEach(btn => {
    btn.addEventListener('click', () => {
      const pinId = Number(btn.dataset.pinId);
      if (selectedLocal.id === pinId) {
        navigateTo('detail', { localId: pinId });
      } else {
        setState({ selectedLocalId: pinId });
      }
    });
  });

  // Place card click -> navigate to detail
  container.querySelector('#map-place-card').addEventListener('click', () => {
    navigateTo('detail', { localId: selectedLocal.id });
  });

  // Route button
  container.querySelector('.routes-button').addEventListener('click', () => {
    if (state.plan === 'free') {
      navigateTo('profile');
    }
  });

  return container;
}
