// ponytail: Mobile map view with semantic SVG pins, discovery carousel, in-place DOM updates, and premium routes
import { getState, setState } from '../../state.js';
import { locals, rarityLabel } from '../../data/mockData.js';
import { navigateTo } from '../../router.js';
import { getIconSvg } from '../../components/Icon.js';
import { initDevModalTrigger } from '../../components/DevModal.js';

let activeCategory = 'Todos';
let showRoutesUpsell = false;
let routesActive = false;

function getLocalFoodIcon(loc) {
  if (loc.art && ['taco', 'fish', 'goat', 'dessert', 'cutlery'].includes(loc.art)) {
    return loc.art;
  }
  const t = (loc.type || '').toLowerCase();
  if (t.includes('taquer')) return 'taco';
  if (t.includes('marisc')) return 'fish';
  if (t.includes('birri')) return 'goat';
  if (t.includes('reposter') || t.includes('postr') || t.includes('churr')) return 'dessert';
  return 'cutlery';
}

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

  let selectedLocal = locals.find(l => l.id === state.selectedLocalId) || filteredLocals[0] || locals[0];

  function buildPlaceCardHtml(local) {
    return `
      <img src="${local.photo}" alt="${local.name}" loading="lazy">
      <div class="map-place-info">
        <span class="open">Abierto · a 8 min</span>
        <h3>${local.name}</h3>
        <p>${local.type} · ${local.zone}</p>
        <small class="rarity-hint">
          ${getIconSvg('spark', 13)}
          <span>Carta ${rarityLabel[local.rarity].toLowerCase()} disponible</span>
        </small>
      </div>
      <div class="map-place-arrow">
        ${getIconSvg('arrow', 18)}
      </div>
    `;
  }

  const userGreetingName = state.userProfile?.name && state.userProfile.name !== 'Usuario no registrado'
    ? state.userProfile.name.split(' ')[0]
    : 'Alex';

  container.innerHTML = `
    <header class="consumer-greeting">
      <div class="greeting-brand-row">
        <span>¡Hola, ${userGreetingName}!</span>
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
      <div class="tijuana-map ${activeCategory !== 'Todos' ? 'filtered' : ''} ${routesActive ? 'routes-visible' : ''}">
        <span class="zone rio">Zona Río</span>
        <span class="zone centro">Centro</span>
        <span class="zone rev">Av. Revolución</span>
        <i class="road r1"></i>
        <i class="road r2"></i>
        <i class="road r3"></i>

        ${/* Premium route SVG layer */ ''}
        <svg class="routes-svg-layer ${routesActive || (state.plan === 'premium') ? 'active' : ''}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="22,68 35,32 50,40 72,68 80,24" class="route-line-bg" />
          <polyline points="22,68 35,32 50,40 72,68 80,24" class="route-line-pulse" />
        </svg>

        <div id="pins-container">
          ${filteredLocals.map(loc => `
            <button type="button" 
                    class="map-pin ${loc.pin} ${selectedLocal.id === loc.id ? 'selected' : ''} ${state.plan === 'premium' && loc.id === 1 ? 'featured' : ''}"
                    style="left: ${loc.coords.x}%; top: ${loc.coords.y}%;"
                    data-pin-id="${loc.id}"
                    aria-label="${loc.name}">
              ${getIconSvg(getLocalFoodIcon(loc), 18)}
            </button>
          `).join('')}
        </div>
      </div>

      <button type="button" class="routes-button ${state.plan === 'free' ? 'locked-feature' : (routesActive ? 'route-on' : '')}">
        ${state.plan === 'free' ? getIconSvg('lock', 14) : getIconSvg('map', 15)}
        <span>${routesActive ? 'Ruta activa' : 'Rutas por colonia'}</span>
        ${state.plan === 'free' ? '<small>Con el Pase</small>' : ''}
      </button>

      <div class="map-place" id="map-place-card" data-current-id="${selectedLocal.id}">
        ${buildPlaceCardHtml(selectedLocal)}
      </div>
    </div>

    <!-- Módulo: Lugares para descubrir -->
    <section class="discover-section" aria-label="Lugares para descubrir">
      <div class="discover-header">
        <h4>Lugares para descubrir</h4>
        <small>${filteredLocals.length} locales encontrados</small>
      </div>
      <div class="discover-carousel" id="discover-carousel" role="region" aria-label="Carrusel de recomendaciones">
        ${filteredLocals.map(loc => `
          <article class="discover-card ${selectedLocal.id === loc.id ? 'active' : ''}" data-card-id="${loc.id}">
            <img src="${loc.photo}" alt="${loc.name}" loading="lazy">
            <div class="discover-card-body">
              <div class="discover-card-head">
                <h5>${loc.name}</h5>
                <span class="rarity-badge ${loc.rarity}">${rarityLabel[loc.rarity]}</span>
              </div>
              <p class="discover-type">${loc.type}</p>
              <div class="discover-footer">
                <span class="discover-zone">${loc.zone}</span>
                <span class="discover-cta">Ver carta &rarr;</span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <!-- Modal Upsell Pase Taquero para Rutas por Colonia -->
    <div id="routes-upsell-modal" class="routes-modal-backdrop ${showRoutesUpsell ? 'visible' : ''}">
      <div class="routes-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="upsell-title">
        <button type="button" class="routes-modal-close" aria-label="Cerrar">&times;</button>
        <div class="routes-modal-badge">${getIconSvg('crown', 20)} Pase Taquero</div>
        <h3 id="upsell-title">Rutas temáticas por colonia</h3>
        <p>Recorre las mejores taquerías y birrierías de Tijuana siguiendo itinerarios optimizados por Zona Río, Centro y La Revu.</p>
        <ul class="routes-perks">
          <li>${getIconSvg('check', 14)} Mapas de ruta guiada paso a paso</li>
          <li>${getIconSvg('check', 14)} Desbloqueo de cartas secretas en paradas de ruta</li>
          <li>${getIconSvg('check', 14)} Multiplicador de puntos x2 en cada visita</li>
        </ul>
        <div class="routes-price-box">
          <strong>$39 MXN</strong>
          <span>al mes · Cancela cuando quieras</span>
        </div>
        <button type="button" class="button button-primary full-width-btn" id="routes-go-premium-btn">
          Obtener Pase Taquero
        </button>
      </div>
    </div>
  `;

  // Attach dev trigger to brand logo
  const logoTrigger = container.querySelector('#brand-logo-trigger');
  initDevModalTrigger(logoTrigger);

  // In-place selection updater (instant DOM reactivity without tearing down tree)
  function selectLocalInPlace(localId) {
    const local = locals.find(l => l.id === localId);
    if (!local) return;
    selectedLocal = local;

    // Silent state update to maintain state without triggering full re-render
    setState({ selectedLocalId: localId }, false);

    // Update pins
    container.querySelectorAll('.map-pin').forEach(pin => {
      const isCurrent = Number(pin.dataset.pinId) === localId;
      pin.classList.toggle('selected', isCurrent);
    });

    // Update place card
    const placeCard = container.querySelector('#map-place-card');
    if (placeCard) {
      placeCard.dataset.currentId = localId;
      placeCard.innerHTML = buildPlaceCardHtml(local);
    }

    // Update discovery carousel cards
    container.querySelectorAll('.discover-card').forEach(card => {
      const isCurrent = Number(card.dataset.cardId) === localId;
      card.classList.toggle('active', isCurrent);
      if (isCurrent) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  }

  // Pin clicks
  container.querySelector('#pins-container').addEventListener('click', (e) => {
    const pin = e.target.closest('.map-pin');
    if (!pin) return;
    const pinId = Number(pin.dataset.pinId);
    if (selectedLocal.id === pinId) {
      navigateTo('detail', { localId: pinId });
    } else {
      selectLocalInPlace(pinId);
    }
  });

  // Discovery carousel clicks
  container.querySelector('#discover-carousel').addEventListener('click', (e) => {
    const card = e.target.closest('.discover-card');
    if (!card) return;
    const cardId = Number(card.dataset.cardId);
    if (selectedLocal.id === cardId) {
      navigateTo('detail', { localId: cardId });
    } else {
      selectLocalInPlace(cardId);
    }
  });

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
        setState({ selectedLocalId: newFiltered[0].id }, false);
      }
      // Re-render map view for category change
      const fresh = renderMapView();
      container.replaceWith(fresh);
    });
  });

  // Place card click -> navigate to detail
  container.querySelector('#map-place-card').addEventListener('click', () => {
    navigateTo('detail', { localId: selectedLocal.id });
  });

  // Routes button click
  const routesBtn = container.querySelector('.routes-button');
  const upsellModal = container.querySelector('#routes-upsell-modal');

  routesBtn.addEventListener('click', () => {
    if (state.plan === 'free') {
      upsellModal.classList.add('visible');
    } else {
      routesActive = !routesActive;
      const routesSvg = container.querySelector('.routes-svg-layer');
      const tijuanaMap = container.querySelector('.tijuana-map');
      if (routesSvg) routesSvg.classList.toggle('active', routesActive);
      if (tijuanaMap) tijuanaMap.classList.toggle('routes-visible', routesActive);
      routesBtn.classList.toggle('route-on', routesActive);
      routesBtn.querySelector('span').textContent = routesActive ? 'Ruta activa' : 'Rutas por colonia';
    }
  });

  // Upsell modal close & CTA
  upsellModal.querySelector('.routes-modal-close').addEventListener('click', () => {
    upsellModal.classList.remove('visible');
  });

  upsellModal.addEventListener('click', (e) => {
    if (e.target === upsellModal) upsellModal.classList.remove('visible');
  });

  container.querySelector('#routes-go-premium-btn').addEventListener('click', () => {
    upsellModal.classList.remove('visible');
    navigateTo('profile');
  });

  return container;
}
