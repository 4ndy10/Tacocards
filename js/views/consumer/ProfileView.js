// ponytail: User profile with volatile in-memory session editing, animated 1.5s checkout simulation, and demo reset
import { getState, setState, updateVolatileProfile, resetDemoState } from '../../state.js';
import { getIconSvg } from '../../components/Icon.js';

export function renderProfileView() {
  const state = getState();
  const profile = state.userProfile || { name: 'Usuario no registrado', avatar: 'TC', level: 1, isRegistered: false };
  const container = document.createElement('div');
  container.className = 'phone-view standard-view';

  let showEditProfileModal = false;
  let checkoutStep = 'idle'; // 'idle' | 'processing' | 'success'

  function render() {
    container.innerHTML = `
      <header class="phone-heading">
        <div>
          <span>Coleccionista fronterizo</span>
          <h2>Mi perfil</h2>
        </div>
      </header>

      <div class="profile-card">
        <div class="avatar ${state.plan === 'premium' ? 'premium' : ''}">
          ${profile.avatar}
          <span class="avatar-level">${profile.level || 1}</span>
          ${state.plan === 'premium' ? `<i class="crown-badge">${getIconSvg('crown', 12)}</i>` : ''}
        </div>
        <h2>${profile.name}</h2>
        <p>${profile.isRegistered ? 'Sesión temporal en memoria' : 'Sesión de invitado (volátil)'}</p>
        
        <button type="button" class="profile-edit-btn" id="btn-open-edit-profile">
          ${getIconSvg('user', 14)} ${profile.isRegistered ? 'Modificar datos' : 'Personalizar nombre/avatar'}
        </button>

        <div class="profile-stats">
          <div><strong>${state.unlockedCardIds.length}</strong><span>Cartas</span></div>
          <div><strong>${state.visits}</strong><span>Visitas</span></div>
          <div><strong>${profile.level || 1}</strong><span>Nivel</span></div>
        </div>
      </div>

      <div class="taquero-pass ${state.plan === 'premium' ? 'active-pass' : ''}">
        <span class="pass-kicker">
          ${getIconSvg('crown', 16)}
          ${state.plan === 'premium' ? 'Pase Taquero Activo' : 'Pase Taquero · $39/mes'}
        </span>
        <h2>${state.plan === 'premium' ? 'Membresía Premium activa' : 'Más Tijuana en cada salida'}</h2>
        <p>${state.plan === 'premium' ? 'Taco de Oro legendario, cupones mensuales y rutas por colonia disponibles.' : 'Desbloquea el Taco de Oro legendario, cupones exclusivos y rutas gastronómicas por colonia.'}</p>
        <ul class="pass-perks">
          <li>${getIconSvg('check', 14)} Carta legendaria Taco de Oro (#001/200)</li>
          <li>${getIconSvg('check', 14)} Cupones 2×1 y descuentos en negocios de barrio</li>
          <li>${getIconSvg('check', 14)} Rutas temáticas por colonia sin límites</li>
        </ul>
        <div class="pass-footer">
          ${state.plan === 'free' ? '<strong>$39 <small>MXN/mes</small></strong>' : '<strong>Plan Premium</strong>'}
          <button type="button" class="button ${state.plan === 'premium' ? 'button-outline' : 'button-primary'}" id="pass-cta-btn">
            ${state.plan === 'premium' ? 'Pase Activo' : 'Obtener Pase'}
          </button>
        </div>
      </div>

      <h3 class="section-title">Logros recientes</h3>
      <div class="achievements-grid">
        <div class="achievement-card">
          ${getIconSvg('map', 22)}
          <strong>Río Explorer</strong>
          <small>5 locales visitados</small>
        </div>
        <div class="achievement-card">
          ${getIconSvg('spark', 22)}
          <strong>Buen Ojo</strong>
          <small>1 carta épica obtenida</small>
        </div>
        <div class="achievement-card ${state.plan === 'free' ? 'muted' : ''}">
          ${getIconSvg(state.plan === 'premium' ? 'crown' : 'lock', 22)}
          <strong>Taco Dorado</strong>
          <small>${state.plan === 'premium' ? 'Desbloqueado' : 'Con Pase Taquero'}</small>
        </div>
      </div>

      <div class="reset-demo-section">
        <button type="button" class="button button-quiet reset-demo-btn" id="reset-demo-btn">
          ${getIconSvg('reset', 16)} Resetear Demo para el Pitch
        </button>
        <small class="reset-hint">Restaura visitas (2), sellos (1) y cartas iniciales.</small>
      </div>

      <!-- Modal: Editar Perfil Volátil -->
      ${showEditProfileModal ? `
        <div class="upgrade-sheet-backdrop" id="edit-profile-backdrop">
          <div class="upgrade-sheet profile-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="modal-profile-title">
            <i class="sheet-handle" aria-hidden="true"></i>
            <span class="kicker">Perfil temporal en memoria</span>
            <h2 id="modal-profile-title">Personalizar sesión</h2>
            <p class="profile-modal-hint">Este cambio reside en memoria (RAM) durante la prueba y volverá a "Usuario no registrado" al refrescar la página.</p>
            
            <form id="profile-edit-form" class="profile-form">
              <label>
                <span>Tu nombre o alias</span>
                <input type="text" id="input-profile-name" value="${profile.name === 'Usuario no registrado' ? 'Alex Rivera' : profile.name}" required maxlength="30" />
              </label>
              <label>
                <span>Iniciales del Avatar (1-3 letras)</span>
                <input type="text" id="input-profile-avatar" value="${profile.avatar}" required maxlength="3" />
              </label>
              <div class="profile-modal-actions">
                <button type="button" class="button button-outline" id="btn-cancel-edit">Cancelar</button>
                <button type="submit" class="button button-primary">Guardar en memoria</button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}

      <!-- Modal: Checkout Pasarela de Pago -->
      ${checkoutStep !== 'idle' ? `
        <div class="checkout-modal-backdrop" id="checkout-backdrop">
          <div class="checkout-modal-card" role="dialog" aria-modal="true">
            ${checkoutStep === 'processing' ? `
              <div class="checkout-step-loading">
                <div class="checkout-spinner"></div>
                <h3>Procesando cobro seguro...</h3>
                <p>Conectando con pasarela bancaria</p>
                <span class="checkout-amount">$39.00 MXN</span>
              </div>
            ` : `
              <div class="checkout-step-success">
                <!-- Confetti elements -->
                <div class="confetti-container" aria-hidden="true">
                  <i class="confetti-c1"></i>
                  <i class="confetti-c2"></i>
                  <i class="confetti-c3"></i>
                  <i class="confetti-c4"></i>
                  <i class="confetti-c5"></i>
                  <i class="confetti-c6"></i>
                  <i class="confetti-c7"></i>
                </div>
                <div class="success-checkmark-circle">
                  ${getIconSvg('check', 36)}
                </div>
                <h3>¡Pago completado con éxito!</h3>
                <p>¡Bienvenido al Pase Taquero! Tu suscripción mensual está activa.</p>
                <div class="unlocked-perks-box">
                  <div>${getIconSvg('crown', 16)} Carta legendaria Taco de Oro agregada al álbum</div>
                  <div>${getIconSvg('map', 16)} Rutas gastronómicas por colonia activas</div>
                  <div>${getIconSvg('ticket', 16)} Cupones 2×1 y descuentos desbloqueados</div>
                </div>
                <button type="button" class="button button-primary full-width-btn" id="btn-finish-checkout">
                  ¡A explorar Tijuana!
                </button>
              </div>
            `}
          </div>
        </div>
      ` : ''}
    `;

    // Hook events
    const editBtn = container.querySelector('#btn-open-edit-profile');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        showEditProfileModal = true;
        render();
      });
    }

    if (showEditProfileModal) {
      const editBackdrop = container.querySelector('#edit-profile-backdrop');
      editBackdrop?.addEventListener('click', (e) => {
        if (e.target === editBackdrop) {
          showEditProfileModal = false;
          render();
        }
      });

      container.querySelector('#btn-cancel-edit')?.addEventListener('click', () => {
        showEditProfileModal = false;
        render();
      });

      const profileForm = container.querySelector('#profile-edit-form');
      profileForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = container.querySelector('#input-profile-name').value.trim() || 'Alex Rivera';
        const newAvatar = (container.querySelector('#input-profile-avatar').value.trim() || 'AR').toUpperCase().slice(0, 3);
        updateVolatileProfile({ name: newName, avatar: newAvatar, isRegistered: true });
        showEditProfileModal = false;
        render();
      });
    }

    const passCta = container.querySelector('#pass-cta-btn');
    if (passCta && state.plan === 'free') {
      passCta.addEventListener('click', () => {
        // Start simulated checkout with 1.5s spinner
        checkoutStep = 'processing';
        render();

        setTimeout(() => {
          checkoutStep = 'success';
          render();
        }, 1500);
      });
    }

    if (checkoutStep === 'success') {
      const finishBtn = container.querySelector('#btn-finish-checkout');
      finishBtn?.addEventListener('click', () => {
        // Unlock premium plan reactively
        setState({ plan: 'premium' });
        checkoutStep = 'idle';
        render();
      });
    }

    const resetBtn = container.querySelector('#reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('¿Restablecer datos de la demo a sus valores originales?')) {
          resetDemoState();
          render();
        }
      });
    }
  }

  render();
  return container;
}
