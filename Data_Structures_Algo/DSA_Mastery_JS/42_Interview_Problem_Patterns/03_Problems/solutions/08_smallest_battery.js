/**
 * 08. Smallest Battery   (Original — Medium)
 *
 * PROBLEM
 * A delivery drone flies a fixed route made of segments; energy[i] is the energy segment i
 * needs. The drone starts with a full battery of capacity C. Between two segments it may land
 * at a charging pad and refill to full, at most `stops` times in total. A segment can never be
 * split. Return the smallest integer capacity C that lets the drone finish the route.
 *
 * EXAMPLES
 * energy = [4, 2, 3, 5, 1], stops = 2  -> 6   (fly [4,2] | [3] | [5,1])
 * energy = [4, 2, 3, 5, 1], stops = 0  -> 15  (no refills: needs the total)
 * energy = [7, 1, 1],       stops = 5  -> 7   (the biggest single segment is a lower bound)
 * energy = []                          -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 10^5, 1 <= energy[i] <= 10^4, 0 <= stops <= 10^5.
 * - Order is fixed (cannot reorder segments). Using fewer stops than allowed is fine.
 *
 * PATTERN: binary search on the answer (+ greedy feasibility check). Clues: "smallest capacity
 * such that ... is possible", feasibility is monotonic (a bigger battery never hurts).
 *
 * APPROACH 1 — Brute force   O(n^(stops+1)) time in the worst case
 * Try every way to cut the route into at most stops + 1 contiguous groups; the capacity
 * needed for a cutting is its largest group sum; take the minimum over all cuttings.
 *
 * APPROACH 2 — Optimal (binary search on C)   O(n log(sum)) time, O(1) space
 * canFly(C): fly greedily, refill only when the next segment does not fit; count refills.
 * Refilling as late as possible is never worse (exchange argument), so canFly is exact.
 * canFly is false...false true...true over C in [max(energy), sum(energy)]: search the first true.
 *
 * Dry run on [4,2,3,5,1], stops 2, range [5, 15]:
 *   mid 10: groups [4,2,3] [5,1] -> 1 refill  -> true,  hi = 10
 *   mid 7:  [4,2] [3] [5,1]      -> 2 refills -> true,  hi = 7
 *   mid 6:  [4,2] [3] [5,1]      -> 2 refills -> true,  hi = 6
 *   mid 5:  [4] [2,3] [5] [1]    -> 3 refills -> false, lo = 6  -> answer 6
 *
 * EDGE CASES
 * - empty route -> 0;  stops >= n - 1 -> max(energy);  stops = 0 -> sum(energy).
 */

function bruteForce(energy, stops) {
  if (energy.length === 0) return 0;
  let best = Infinity;
  // split(start, groupsLeft, worst): try every end for the group starting at `start`
  (function split(start, groupsLeft, worst) {
    if (start === energy.length) { best = Math.min(best, worst); return; }
    if (groupsLeft === 0) return;
    let sum = 0;
    for (let end = start; end < energy.length; end++) {
      sum += energy[end];
      split(end + 1, groupsLeft - 1, Math.max(worst, sum));
    }
  })(0, stops + 1, 0);
  return best;
}

function canFly(energy, stops, capacity) {
  let charge = capacity;
  let refills = 0;
  for (const e of energy) {
    if (e > capacity) return false;
    if (e > charge) { refills++; charge = capacity; } // refill as late as possible
    charge -= e;
  }
  return refills <= stops;
}

function optimal(energy, stops) {
  if (energy.length === 0) return 0;
  let lo = Math.max(...energy); // fine for n <= 10^5; use a loop for much larger arrays
  let hi = energy.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (canFly(energy, stops, mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([4, 2, 3, 5, 1], 2), 6);
  assert.strictEqual(solve([4, 2, 3, 5, 1], 0), 15);
  assert.strictEqual(solve([7, 1, 1], 5), 7);
  assert.strictEqual(solve([], 3), 0);
  assert.strictEqual(solve([3, 3, 3, 3], 1), 6);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(8);
for (let t = 0; t < 300; t++) {
  const energy = Array.from({ length: Math.floor(rand() * 8) }, () => 1 + Math.floor(rand() * 9));
  const stops = Math.floor(rand() * 5);
  assert.strictEqual(optimal(energy, stops), bruteForce(energy, stops));
}
console.log('✓ 08_smallest_battery passed');

module.exports = { optimal, bruteForce, canFly };
