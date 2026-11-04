// ponytail: Vanilla JS History API router for mobile-first PWA navigation
import { getState, setState } from './state.js';

let isNavigatingFromPopState = false;

export function initRouter() {
  window.addEventListener('popstate', (event) => {
    isNavigatingFromPopState = true;
    const state = getState();
    const historyState = event.state;

    if (historyState) {
      if (historyState.role && historyState.role !== state.role) {
        setState({ role: historyState.role });
      }

      if (state.role === 'consumer') {
        const nextView = historyState.view || 'map';
        const updates = { consumerView: nextView };
        if (historyState.localId) updates.selectedLocalId = historyState.localId;
        setState(updates);
      } else {
        const nextView = historyState.view || 'dashboard';
        setState({ businessView: nextView });
      }
    } else {
      // Return to default view if popped back to initial state
      if (state.role === 'consumer') {
        setState({ consumerView: 'map' });
      } else {
        setState({ businessView: 'dashboard' });
      }
    }
    isNavigatingFromPopState = false;
  });

  // Set initial state in History API
  const current = getState();
  const initialView = current.role === 'consumer' ? current.consumerView : current.businessView;
  history.replaceState({ role: current.role, view: initialView }, '', window.location.hash || '#/' + initialView);
}

export function navigateTo(view, params = {}) {
  const state = getState();

  if (state.role === 'consumer') {
    const updates = { consumerView: view, ...params };
    if (params.localId) updates.selectedLocalId = params.localId;
    setState(updates);

    if (!isNavigatingFromPopState) {
      const hash = view === 'detail' && params.localId ? `#/local/${params.localId}` : `#/${view}`;
      history.pushState({ role: 'consumer', view, ...params }, '', hash);
    }
  } else {
    setState({ businessView: view, ...params });

    if (!isNavigatingFromPopState) {
      history.pushState({ role: 'business', view, ...params }, '', `#/${view}`);
    }
  }
}
