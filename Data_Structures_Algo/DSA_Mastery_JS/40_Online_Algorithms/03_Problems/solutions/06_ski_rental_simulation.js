/**
 * 06. Ski Rental Simulation   (Original — Medium)
 *
 * PROBLEM
 * Renting skis costs 1 per day. Buying costs B (then every later day is free). You do not
 * know how many days d you will ski — each morning you only learn "I am skiing today".
 * A deterministic online strategy is fully described by `buyDay` k: rent on days 1..k-1,
 * buy on the morning of day k (if you are still skiing).
 *
 * Write:
 *   onlineCost(B, d, k)     cost paid by strategy k if the season lasts d days
 *   offlineCost(B, d)       cost of someone who KNEW d in advance: min(d, B)
 *   worstRatio(B, k)        max over every d >= 1 of onlineCost / offlineCost
 *   optimal(B)              the buyDay with the smallest worst-case ratio, and that ratio
 *
 * EXAMPLES
 * B = 10
 *   onlineCost(10, 3, 10)  = 3      rented 3 days, season ended before buy day
 *   onlineCost(10, 25, 10) = 19     rented 9 days + bought for 10
 *   offlineCost(10, 25)    = 10     would have bought on day 1
 *   optimal(10) -> { buyDay: 10, ratio: 1.9 }     ratio = 2 - 1/B
 * B = 1 -> { buyDay: 1, ratio: 1 }  (buy immediately, never worse than optimum)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - B is a positive integer, d >= 1.
 * - Deterministic strategies only (randomised strategies reach e/(e-1) ~ 1.58 in expectation).
 *
 * APPROACH 1 — Brute force (simulate every scenario)   O(B^2) time, O(1) space
 * Try every buyDay k in 1..3B and every season length d in 1..3B, compute the ratio, keep
 * the k with the smallest maximum. 3B is enough: the worst case for strategy k happens at
 * d = k (you just bought and then the season ends), and k > 2B is clearly bad.
 *
 * APPROACH 2 — Optimal (closed form, competitive analysis)   O(1)
 * For strategy k the adversary ends the season right after you buy: d = k.
 *   online = (k - 1) + B,   offline = min(k, B),   ratio(k) = (k - 1 + B) / min(k, B).
 *   k < B: ratio = 1 + (B - 1)/k  > 1 + (B - 1)/B     (bought too early)
 *   k > B: ratio = (k - 1 + B)/B  > (2B - 1)/B        (rented too long)
 *   k = B: ratio = (2B - 1)/B = 2 - 1/B               <- the break-even strategy
 * "Rent until the rent you paid would equal the price, then buy." You never pay more than
 * about twice the hindsight optimum, and no deterministic strategy does better.
 *
 * Dry run, B = 4:
 *   k  worst d  online  offline  ratio
 *   1  1        4       1        4.00
 *   2  2        5       2        2.50
 *   3  3        6       3        2.00
 *   4  4        7       4        1.75   <- best = 2 - 1/4
 *   5  5        8       4        2.00
 *
 * EDGE CASES
 * - B = 1 -> buy on day 1, ratio 1
 * - season shorter than buyDay -> you only paid rent, ratio 1
 */

function onlineCost(B, d, k) {
  return d < k ? d : (k - 1) + B;
}
function offlineCost(B, d) {
  return Math.min(d, B);
}
function worstRatio(B, k) {
  return (k - 1 + B) / Math.min(k, B);
}

function bruteForce(B) {
  let best = { buyDay: -1, ratio: Infinity };
  for (let k = 1; k <= 3 * B; k++) {
    let worst = 0;
    for (let d = 1; d <= 3 * B; d++) worst = Math.max(worst, onlineCost(B, d, k) / offlineCost(B, d));
    if (worst < best.ratio - 1e-12) best = { buyDay: k, ratio: worst };
  }
  return best;
}

function optimal(B) {
  if (!Number.isInteger(B) || B < 1) throw new RangeError('B must be a positive integer');
  return { buyDay: B, ratio: 2 - 1 / B };
}

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(onlineCost(10, 3, 10), 3);
assert.strictEqual(onlineCost(10, 25, 10), 19);
assert.strictEqual(offlineCost(10, 25), 10);
assert.deepStrictEqual(optimal(10), { buyDay: 10, ratio: 1.9 });
assert.deepStrictEqual(optimal(1), { buyDay: 1, ratio: 1 });
assert.strictEqual(worstRatio(4, 1), 4);
assert.strictEqual(worstRatio(4, 4), 1.75);
assert.throws(() => optimal(0));
for (let B = 1; B <= 30; B++) {
  const a = bruteForce(B), b = optimal(B);
  assert.strictEqual(a.buyDay, b.buyDay);
  assert.ok(Math.abs(a.ratio - b.ratio) < 1e-12);
  for (let k = 1; k <= 3 * B; k++) {
    let worst = 0;
    for (let d = 1; d <= 3 * B; d++) worst = Math.max(worst, onlineCost(B, d, k) / offlineCost(B, d));
    assert.ok(Math.abs(worst - worstRatio(B, k)) < 1e-12);
  }
}
// random seasons: break-even strategy is always within 2 - 1/B of hindsight
let s = 21;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 2000; t++) {
  const B = 1 + Math.floor(rnd() * 50), d = 1 + Math.floor(rnd() * 200);
  assert.ok(onlineCost(B, d, B) <= (2 - 1 / B) * offlineCost(B, d) + 1e-9);
}
console.log('✓ 06_ski_rental_simulation passed');

module.exports = { optimal, bruteForce, onlineCost, offlineCost, worstRatio };
