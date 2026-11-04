// ponytail: Album view with functional sorting, full-view 3D card lightbox, rich sharing, and coupons integration
import { getState, setState } from '../../state.js';
import { locals, goldenLocal, rarityLabel } from '../../data/mockData.js';
import { getIconSvg } from '../../components/Icon.js';
import { createTradingCard } from '../../components/TradingCard.js';
import { renderCouponsView } from './CouponsView.js';

let activeTab = 'cards'; // 'cards' | 'coupons'
let activeRarityFilter = 'Todas';

const rarityRank = {
  legendaria: 4,
  epica: 3,
  rara: 2,
  comun: 1
};

export function renderAlbumView() {
  const state = getState();
  const allCards = [...locals, goldenLocal];

  // 1. Filter by rarity
  let cards = allCards.filter(c => {
    if (activeRarityFilter === 'Todas') return true;
    return rarityLabel[c.rarity] === activeRarityFilter;
  });

  // 2. Sort according to state.albumSortOrder
  const sortOrder = state.albumSortOrder || 'recent';
  cards.sort((a, b) => {
    if (sortOrder === 'rarity') {
      const diff = (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0);
      return diff !== 0 ? diff : a.id - b.id;
    }
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    }
    // 'recent': unlocked cards first, then by id descending
    const aUnlocked = state.unlockedCardIds.includes(a.id);
    const bUnlocked = state.unlockedCardIds.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return b.id - a.id;
  });

  const container = document.createElement('div');
  container.className = 'phone-view standard-view';

  container.innerHTML = `
    <header class="phone-heading">
      <div>
        <span>Colección Tijuana 2026</span>
        <h2>Mi álbum</h2>
      </div>
      <span class="points-chip">1,480 pts</span>
    </header>

    <div class="album-tabs" role="tablist">
      <button type="button" class="tab-btn ${activeTab === 'cards' ? 'active' : ''}" data-tab="cards">
        Cartas
      </button>
      <button type="button" class="tab-btn ${activeTab === 'coupons' ? 'active' : ''}" data-tab="coupons">
        Cupones ${state.plan === 'free' ? getIconSvg('lock', 12) : ''}
      </button>
    </div>

    ${activeTab === 'cards' ? `
      <div class="album-progress">
        <div class="progress-ring">
          <strong>18</strong>
          <span>de 48</span>
        </div>
        <div class="progress-text">
          <span>Progreso total</span>
          <h3>37% completado</h3>
          <p>4 cartas nuevas esta semana</p>
        </div>
      </div>

      <div class="rarity-progress">
        <span>Común <strong>10/20</strong></span>
        <span>Rara <strong>5/14</strong></span>
        <span>Épica <strong>2/9</strong></span>
        <span>Legendaria <strong>1/5</strong></span>
      </div>

      <!-- Barra de Ordenamiento y Filtros -->
      <div class="album-controls-row">
        <div class="sort-selector-group">
          <label for="album-sort-select">Ordenar:</label>
          <select id="album-sort-select" class="album-sort-select">
            <option value="recent" ${sortOrder === 'recent' ? 'selected' : ''}>Más recientes</option>
            <option value="rarity" ${sortOrder === 'rarity' ? 'selected' : ''}>Rareza</option>
            <option value="name" ${sortOrder === 'name' ? 'selected' : ''}>Local (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="map-filters album-filter" role="tablist" aria-label="Filtro de rareza">
        ${['Todas', 'Común', 'Rara', 'Épica', 'Legendaria'].map(r => `
          <button type="button" class="filter-chip ${activeRarityFilter === r ? 'active' : ''}" data-rarity="${r}">
            ${r}
          </button>
        `).join('')}
      </div>

      <div class="album-grid">
        ${cards.map(c => `
          <div class="album-card-slot" id="card-slot-${c.id}">
            ${c.id === 7 && state.plan === 'free' ? `
              <span class="pass-label">
                ${getIconSvg('lock', 10)} Con el Pase
              </span>
            ` : ''}
          </div>
        `).join('')}
      </div>
    ` : `
      <div id="coupons-mount"></div>
    `}

    <div id="lightbox-mount"></div>
  `;

  // Mount cards or coupons
  if (activeTab === 'cards') {
    cards.forEach(cardData => {
      const slot = container.querySelector(`#card-slot-${cardData.id}`);
      if (slot) {
        const isLocked = cardData.id === 7 ? state.plan === 'free' : !state.unlockedCardIds.includes(cardData.id);
        const cardEl = createTradingCard({
          local: cardData,
          compact: true,
          preview: true,
          locked: isLocked,
          onActivate: () => openCardLightbox(cardData, container)
        });
        slot.prepend(cardEl);
      }
    });

    // Rarity chips click
    container.querySelectorAll('[data-rarity]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeRarityFilter = btn.dataset.rarity;
        const fresh = renderAlbumView();
        container.replaceWith(fresh);
      });
    });

    // Sort select change
    const sortSelect = container.querySelector('#album-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        setState({ albumSortOrder: e.target.value }, false);
        const fresh = renderAlbumView();
        container.replaceWith(fresh);
      });
    }
  } else {
    const couponsMount = container.querySelector('#coupons-mount');
    if (couponsMount) {
      couponsMount.appendChild(renderCouponsView());
    }
  }

  // Tabs click
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      const fresh = renderAlbumView();
      container.replaceWith(fresh);
    });
  });

  return container;
}

function openCardLightbox(local, container) {
  const mount = container.querySelector('#lightbox-mount');
  if (!mount) return;

  let isFlipped = false;
  let shared = false;

  const lightbox = document.createElement('div');
  lightbox.className = 'card-lightbox';

  lightbox.innerHTML = `
    <div class="card-modal" role="dialog" aria-modal="true" aria-label="Vista detallada de ${local.name}">
      <button type="button" class="lightbox-close" aria-label="Cerrar">&times;</button>
      <div class="lightbox-card-slot" id="lightbox-card-slot"></div>
      <div class="lightbox-actions">
        <button type="button" class="button button-primary" id="lightbox-flip-btn">
          ${getIconSvg('card', 16)} Girar carta
        </button>
        <button type="button" class="button button-outline" id="lightbox-share-btn">
          ${getIconSvg('arrow', 16)} Compartir
        </button>
      </div>
    </div>
  `;

  const cardSlot = lightbox.querySelector('#lightbox-card-slot');
  const cardEl = createTradingCard({
    local,
    compact: false,
    preview: false,
    onActivate: () => toggleFlip()
  });
  cardSlot.appendChild(cardEl);

  const flipBtn = lightbox.querySelector('#lightbox-flip-btn');
  const shareBtn = lightbox.querySelector('#lightbox-share-btn');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function toggleFlip() {
    isFlipped = !isFlipped;
    cardEl.classList.toggle('flipped', isFlipped);
    flipBtn.innerHTML = `${getIconSvg(isFlipped ? 'back' : 'card', 16)} ${isFlipped ? 'Ver frente' : 'Girar carta'}`;
  }

  flipBtn.addEventListener('click', toggleFlip);

  // Close handlers
  const closeLightbox = () => lightbox.remove();
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Rich text share
  shareBtn.addEventListener('click', async () => {
    const rarityText = rarityLabel[local.rarity] || 'Especial';
    const linkUrl = `${window.location.origin}${window.location.pathname}#/local/${local.id}`;
    const shareText = `¡Acabo de desbloquear la carta ${rarityText} de ${local.name} en TacoCards Tijuana! Mírala aquí: ${linkUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Carta ${rarityText} de ${local.name} · TacoCards Tijuana`,
          text: shareText,
          url: linkUrl
        });
      } catch (e) {
        // User dismissed native share sheet
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }

    shared = true;
    shareBtn.innerHTML = `${getIconSvg('check', 16)} ¡Copiado!`;
    setTimeout(() => {
      shareBtn.innerHTML = `${getIconSvg('arrow', 16)} Compartir`;
    }, 2500);
  });

  mount.appendChild(lightbox);
}
