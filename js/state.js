// ponytail: Minimal observable reactive store with localStorage persistence and volatile session profile.
// Fits in under 110 lines, zero dependencies, pitch-ready.

const STORAGE_KEY = 'tacocards_state_v1';

const DEFAULT_VOLATILE_PROFILE = {
  name: 'Usuario no registrado',
  avatar: 'TC',
  level: 1,
  isRegistered: false
};

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
  albumSortOrder: 'recent' // 'recent' | 'rarity' | 'name'
};

function loadInitialState() {
  let loaded = { ...DEFAULT_STATE };
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) loaded = { ...loaded, ...JSON.parse(raw) };
    }
  } catch (e) {
    // Ignore and use defaults
  }

  // Volatile profile strictly in RAM: resets to "Usuario no registrado" on page refresh
  return { ...loaded, userProfile: { ...DEFAULT_VOLATILE_PROFILE } };
}

let currentState = loadInitialState();
const listeners = new Set();

function saveState() {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      // We intentionally DO NOT persist userProfile to localStorage to keep it volatile for the pitch
      const { userProfile, ...persisted } = currentState;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }
  } catch (e) {
    // Ignore storage errors in restricted contexts
  }
}

export function getState() {
  return currentState;
}

export function setState(updates, notify = true) {
  currentState = { ...currentState, ...updates };
  saveState();
  if (notify) {
    listeners.forEach((fn) => fn(currentState));
  }
}

// Updates profile strictly in volatile RAM
export function updateVolatileProfile(profileUpdates) {
  const updatedProfile = { ...currentState.userProfile, ...profileUpdates };
  currentState = { ...currentState, userProfile: updatedProfile };
  listeners.forEach((fn) => fn(currentState));
}

// Sequential single-step visit increment (from 0 to 8+)
export function incrementVisit() {
  const newVisits = currentState.visits + 1;
  let newStamps = currentState.stamps;
  const newUnlocked = [...currentState.unlockedCardIds];

  if (newVisits >= 3) {
    // Unlocks loyalty stamp card upon 3rd visit
    if (!newUnlocked.includes(1)) newUnlocked.push(1);
    newStamps = Math.min(8, Math.max(1, newVisits - 2));
  } else {
    newStamps = 0;
  }

  setState({
    visits: newVisits,
    stamps: newStamps,
    unlockedCardIds: newUnlocked
  });
}

export function resetVisits() {
  setState({
    visits: 0,
    stamps: 0,
    code: '',
    codeExpires: null,
    validated: false
  });
}

export function resetDemoState() {
  currentState = {
    ...DEFAULT_STATE,
    userProfile: { ...DEFAULT_VOLATILE_PROFILE }
  };
  saveState();
  listeners.forEach((fn) => fn(currentState));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
