// ponytail: Main orchestrator for TacoCards Tijuana Mobile PWA.
import { getState, subscribe } from './state.js';
import { initRouter } from './router.js';

// Consumer views
import { renderMapView } from './views/consumer/MapView.js';
import { renderDetailView } from './views/consumer/DetailView.js';
import { renderScanView } from './views/consumer/ScanView.js';
import { renderAlbumView } from './views/consumer/AlbumView.js';
import { renderLoyaltyView } from './views/consumer/LoyaltyView.js';
import { renderProfileView } from './views/consumer/ProfileView.js';
import { createConsumerNav } from './views/consumer/ConsumerNav.js';

// Business views
import { renderDashboard } from './views/business/Dashboard.js';
import { renderRedeemPage } from './views/business/RedeemPage.js';
import { renderLoyaltyPage } from './views/business/LoyaltyPage.js';
import { renderQrPage } from './views/business/QrPage.js';
import { renderPlanPage } from './views/business/PlanPage.js';
import { createBusinessNav } from './views/business/BusinessNav.js';

function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration bypassed:', err);
    });
  }
}

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = '';
  const state = getState();

  const appContainer = document.createElement('div');
  appContainer.className = `mobile-pwa-root ${state.role}-mode`;

  if (state.role === 'consumer') {
    let viewElement;
    if (state.consumerView === 'map') viewElement = renderMapView();
    else if (state.consumerView === 'detail') viewElement = renderDetailView();
    else if (state.consumerView === 'scan') viewElement = renderScanView();
    else if (state.consumerView === 'album') viewElement = renderAlbumView();
    else if (state.consumerView === 'loyalty') viewElement = renderLoyaltyView();
    else viewElement = renderProfileView();

    appContainer.appendChild(viewElement);

    // Hide bottom nav in immersive views (detail and scan)
    const hideNav = ['detail', 'scan'].includes(state.consumerView);
    if (!hideNav) {
      appContainer.appendChild(createConsumerNav());
    }
  } else {
    let viewElement;
    if (state.businessView === 'dashboard') viewElement = renderDashboard();
    else if (state.businessView === 'redeem') viewElement = renderRedeemPage();
    else if (state.businessView === 'business-loyalty') viewElement = renderLoyaltyPage();
    else if (state.businessView === 'qr') viewElement = renderQrPage();
    else viewElement = renderPlanPage();

    appContainer.appendChild(viewElement);
    appContainer.appendChild(createBusinessNav());
  }

  root.appendChild(appContainer);
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  initRouter();
  subscribe(() => renderApp());
  renderApp();
});
