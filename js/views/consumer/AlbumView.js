// ponytail: Album view with collection cards, coupons tab and full-screen card lightbox
import { getState, setState } from '../../state.js';
import { locals, goldenLocal, rarityLabel, couponsData } from '../../data/mockData.js';
import { getIconSvg } from '../../components/Icon.js';
import { createTradingCard } from '../../components/TradingCard.js';
import { createButton } from '../../components/Button.js';

let activeTab = 'cards'; // 'cards' | 'coupons'
let activeRarityFilter = 'Todas';

export function renderAlbumView() {
  const state = getState();
  const allCards = [...locals, goldenLocal];

  const filteredCards = allCards.filter(c => {
    if (activeRarityFilter === 'Todas') return true;
    return rarityLabel[c.rarity] === activeRarityFilter;
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

      <div class="map-filters album-filter" role="tablist" aria-label="Filtro de rareza">
        ${['Todas', 'Común', 'Rara', 'Épica', 'Legendaria'].map(r => `
          <button type="button" class="filter-chip ${activeRarityFilter === r ? 'active' : ''}" data-rarity="${r}">
            ${r}
          </button>
        `).join('')}
      </div>

      <div class="album-grid">
        ${filteredCards.map(c => `
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
      <div class="coupons-view ${state.plan === 'free' ? 'feature-locked' : ''}">
        <div class="coupon-list">
          ${couponsData.map(cp => `
            <article class="coupon-item">
              <span class="coupon-discount">${cp.discount}</span>
              <div class="coupon-info">
                <strong>${cp.title}</strong>
                <small>${cp.subtitle}</small>
              </div>
            </article>
          `).join('')}
        </div>

        ${state.plan === 'free' ? `
          <div class="locked-message">
            ${getIconSvg('lock', 32)}
            <strong>Cupones exclusivos</strong>
            <small>Disponibles con el Pase Taquero de $39/mes</small>
            <button type="button" class="upgrade-btn-inline" id="go-pass-btn">Obtener Pase</button>
          </div>
        ` : ''}
      </div>
    `}

    <div id="lightbox-mount"></div>
  `;

  // Mount compact cards into slots
  if (activeTab === 'cards') {
    filteredCards.forEach(cardData => {
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
        renderAlbumView();
      });
    });
  }

  // Tabs click
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      renderAlbumView();
    });
  });

  // Upgrade CTA in coupons
  const goPassBtn = container.querySelector('#go-pass-btn');
  if (goPassBtn) {
    goPassBtn.addEventListener('click', () => {
      setState({ consumerView: 'profile' });
    });
  }

  return container;
}

function openCardLightbox(local, container) {
  const mount = container.querySelector('#lightbox-mount');
  if (!mount) return;

  let flipped = false;
  let shared = false;

  const lightbox = document.createElement('div');
  lightbox.className = 'card-lightbox';

  function renderModal() {
    lightbox.innerHTML = `
      <div class="card-modal">
        <button type="button" class="lightbox-close" aria-label="Cerrar">×</button>
        <div class="lightbox-card-slot"></div>
        <div class="lightbox-actions">
          <button type="button" class="button button-primary" id="lightbox-flip-btn">
            ${getIconSvg(flipped ? 'back' : 'card', 16)} ${flipped ? 'Ver frente' : 'Girar carta'}
          </button>
          <button type="button" class="button button-outline" id="lightbox-share-btn">
            ${getIconSvg('arrow', 16)} ${shared ? '¡Enlace copiado!' : 'Compartir'}
          </button>
        </div>
      </div>
    `;

    const cardSlot = lightbox.querySelector('.lightbox-card-slot');
    cardSlot.appendChild(createTradingCard({
      local,
      compact: false,
      forcedFlipped: flipped,
      onActivate: () => {
        flipped = !flipped;
        renderModal();
      }
    }));

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.remove());
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.remove();
    });

    lightbox.querySelector('#lightbox-flip-btn').addEventListener('click', () => {
      flipped = !flipped;
      renderModal();
    });

    lightbox.querySelector('#lightbox-share-btn').addEventListener('click', async () => {
      const shareData = {
        title: `${local.name} · TacoCards Tijuana`,
        text: `Descubre la historia de ${local.name} y colecciona su carta en TacoCards Tijuana.`,
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) { /* ignore cancel */ }
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      }
      shared = true;
      lightbox.querySelector('#lightbox-share-btn').innerHTML = `${getIconSvg('check', 16)} ¡Enlace copiado!`;
    });
  }

  renderModal();
  mount.appendChild(lightbox);
}
