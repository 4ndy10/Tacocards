// ponytail: Minimal observable reactive store with localStorage persistence.
// Fits in under 80 lines, zero dependencies, bulletproof for pitch demo.

const STORAGE_KEY = 'tacocards_state_v1';

const DEFAULT_STATE = {
  role: 'consumer', // 'consumer' | 'business'
  plan: 'free',     // 'free' | 'premium'
  consumerView: 'map',
  businessView: 'dashboard',
  selectedLocalId: 1,
  visits: 2,
  stamps: 1,
  code: '',
  codeExpires: null,
  validated: false,
  unlockedCardIds: [1, 2, 3, 4],
  lightboxCardId: null,
  lightboxFlipped: false
};

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Could not read from localStorage, using defaults', e);
  }
  return { ...DEFAULT_STATE };
}

let currentState = loadInitialState();
const listeners = new Set();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

export function getState() {
  return currentState;
}

export function setState(updates) {
  currentState = { ...currentState, ...updates };
  saveState();
  listeners.forEach((fn) => fn(currentState));
}

export function resetDemoState() {
  currentState = { ...DEFAULT_STATE };
  saveState();
  listeners.forEach((fn) => fn(currentState));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
