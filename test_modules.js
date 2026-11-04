// ponytail: One runnable assert-based check for core logic (state, data, calculations, icons, visits)
import assert from 'node:assert';
import { locals, goldenLocal, rarityLabel, cardDetails, couponsData } from './js/data/mockData.js';
import { getIconSvg } from './js/components/Icon.js';
import { getState, setState, incrementVisit, resetVisits, updateVolatileProfile } from './js/state.js';

// 1. Data Integrity Checks
assert.strictEqual(locals.length, 6, 'Should have 6 standard locals');
assert.strictEqual(goldenLocal.id, 7, 'Golden local should have id 7');
assert.strictEqual(goldenLocal.rarity, 'legendaria', 'Golden card must be legendaria');
assert.ok(couponsData.length >= 3, 'Should have at least 3 coupons');

// Check coordinates, arts, and pins
locals.forEach(loc => {
  assert.ok(loc.coords && typeof loc.coords.x === 'number', `Local ${loc.id} must have valid coords.x`);
  assert.ok(loc.coords && typeof loc.coords.y === 'number', `Local ${loc.id} must have valid coords.y`);
  assert.ok(rarityLabel[loc.rarity], `Rarity label must exist for ${loc.rarity}`);
  assert.ok(cardDetails[loc.id], `Card details must exist for local ${loc.id}`);
});

// 2. Icon SVGs test (Semantic culinary icons)
['taco', 'fish', 'goat', 'dessert', 'cutlery'].forEach(name => {
  const svg = getIconSvg(name, 18);
  assert.ok(svg.includes('<svg') && svg.includes('</svg>'), `Icon ${name} must produce valid SVG`);
});

// 3. Volatile Profile & Sequential Visits Test
const initialState = getState();
assert.strictEqual(initialState.userProfile.name, 'Usuario no registrado', 'Default volatile name must be unregistered');
assert.strictEqual(initialState.userProfile.avatar, 'TC', 'Default volatile avatar must be TC');

// Test updating volatile profile in RAM
updateVolatileProfile({ name: 'Alex Rivera', avatar: 'AR', isRegistered: true });
const updatedState = getState();
assert.strictEqual(updatedState.userProfile.name, 'Alex Rivera', 'Volatile profile name should update in memory');
assert.strictEqual(updatedState.userProfile.avatar, 'AR', 'Volatile avatar should update in memory');

// Test sequential visits
resetVisits();
assert.strictEqual(getState().visits, 0, 'Visits reset to 0');
assert.strictEqual(getState().stamps, 0, 'Stamps reset to 0');

incrementVisit();
assert.strictEqual(getState().visits, 1, 'Visits should increment to 1');
assert.strictEqual(getState().stamps, 0, 'Stamps should remain 0 before 3rd visit');

incrementVisit();
assert.strictEqual(getState().visits, 2, 'Visits should increment to 2');
assert.strictEqual(getState().stamps, 0, 'Stamps should remain 0');

incrementVisit();
assert.strictEqual(getState().visits, 3, 'Visits should increment to 3');
assert.strictEqual(getState().stamps, 1, 'Visit 3 unlocks stamp 1');

incrementVisit();
assert.strictEqual(getState().visits, 4, 'Visits should increment to 4');
assert.strictEqual(getState().stamps, 2, 'Visit 4 gives stamp 2');

// 4. Delivery savings math test
function calculateDeliveryFee(orders) {
  return Math.round(orders * 176 * 0.30 * 1.16);
}

const feeAt100 = calculateDeliveryFee(100);
assert.strictEqual(feeAt100, 6125, 'Fee at 100 orders should match formula calculation');
const savingsAt100 = feeAt100 - 249;
assert.strictEqual(savingsAt100, 5876, 'Savings at 100 orders should be $5,876');

console.log('✅ All TacoCards Phase 4 logic checks passed successfully.');
