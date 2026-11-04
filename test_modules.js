// ponytail: One runnable assert-based check for core logic (state, data, calculations)
import assert from 'node:assert';
import { locals, goldenLocal, rarityLabel, cardDetails } from './js/data/mockData.js';

// 1. Data Integrity Checks
assert.strictEqual(locals.length, 6, 'Should have 6 standard locals');
assert.strictEqual(goldenLocal.id, 7, 'Golden local should have id 7');
assert.strictEqual(goldenLocal.rarity, 'legendaria', 'Golden card must be legendaria');

// Check coordinates and pins
locals.forEach(loc => {
  assert.ok(loc.coords && typeof loc.coords.x === 'number', `Local ${loc.id} must have valid coords.x`);
  assert.ok(loc.coords && typeof loc.coords.y === 'number', `Local ${loc.id} must have valid coords.y`);
  assert.ok(rarityLabel[loc.rarity], `Rarity label must exist for ${loc.rarity}`);
  assert.ok(cardDetails[loc.id], `Card details must exist for local ${loc.id}`);
});

// 2. Delivery savings math test
function calculateDeliveryFee(orders) {
  return Math.round(orders * 176 * 0.30 * 1.16);
}

const feeAt100 = calculateDeliveryFee(100);
assert.strictEqual(feeAt100, 6125, 'Fee at 100 orders should match formula calculation');
const savingsAt100 = feeAt100 - 249;
assert.strictEqual(savingsAt100, 5876, 'Savings at 100 orders should be $5,876');

console.log('✅ All TacoCards logic checks passed successfully.');
