/**
 * 12. Koko Eating Bananas   (LeetCode 875 — Medium)
 *
 * PROBLEM
 * There are n piles of bananas, piles[i] bananas each. Koko eats at speed k bananas
 * per hour: each hour she picks a pile and eats k from it (if the pile has fewer, she
 * finishes it and does not continue to another pile that hour). Find the MINIMUM
 * integer k so she can eat everything within h hours.
 *
 * EXAMPLES
 * Input: piles = [3,6,7,11], h = 8    Output: 4
 * Input: piles = [30,11,23,4,20], h = 5    Output: 30
 * Input: piles = [30,11,23,4,20], h = 6    Output: 23
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - h >= piles.length (always possible, since at worst one pile per hour)
 * - piles[i] up to 10^9 -> answer range is 1..max(piles)
 * - Hours per pile = ceil(piles[i] / k)
 *
 * APPROACH 1 — Brute force   O(n * max(piles))
 * Try k = 1, 2, 3, ... and return the first speed whose total hours <= h.
 *
 * APPROACH 2 — Optimal (binary search on the answer)   O(n log max(piles)) time, O(1) space
 * Predicate canFinish(k) = sum(ceil(pile / k)) <= h. It is monotonic: a faster speed
 * never needs more hours, so it looks like F F F T T T over k = 1..max. Find the first T.
 * lo = 1, hi = max(piles) (at speed max, every pile takes 1 hour, so hi is always feasible).
 *
 * Dry run piles=[3,6,7,11], h=8:
 *   lo=1 hi=11 mid=6: hours = 1+1+2+2 = 6 <= 8 -> hi=6
 *   lo=1 hi=6  mid=3: hours = 1+2+3+4 = 10 > 8 -> lo=4
 *   lo=4 hi=6  mid=5: hours = 1+2+2+3 = 8 <= 8 -> hi=5
 *   lo=4 hi=5  mid=4: hours = 1+2+2+3 = 8 <= 8 -> hi=4
 *   lo === hi === 4 -> 4
 *
 * EDGE CASES
 * - one pile: ceil(pile / h)
 * - h === piles.length -> must be max(piles)
 * - huge h -> answer 1
 */

function hoursNeeded(piles, speed) {
  let hours = 0;
  for (const pile of piles) hours += Math.ceil(pile / speed);
  return hours;
}

function bruteForce(piles, h) {
  const max = Math.max(...piles);
  for (let speed = 1; speed <= max; speed++) {
    if (hoursNeeded(piles, speed) <= h) return speed;
  }
  return max;
}

function optimal(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (hoursNeeded(piles, mid) <= h) hi = mid;   // mid works: try slower
    else lo = mid + 1;                            // too slow: need faster
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 6, 7, 11], 8), 4);
  assert.strictEqual(solve([30, 11, 23, 4, 20], 5), 30);
  assert.strictEqual(solve([30, 11, 23, 4, 20], 6), 23);
  assert.strictEqual(solve([1], 1), 1);
  assert.strictEqual(solve([10], 3), 4);
  assert.strictEqual(solve([1, 1, 1, 1], 100), 1);
  assert.strictEqual(solve([5, 5, 5], 3), 5);
}
assert.strictEqual(optimal([1000000000], 2), 500000000);
for (let trial = 0; trial < 100; trial++) {
  const piles = Array.from({ length: 1 + Math.floor(Math.random() * 6) }, () => 1 + Math.floor(Math.random() * 50));
  const h = piles.length + Math.floor(Math.random() * 20);
  assert.strictEqual(optimal(piles, h), bruteForce(piles, h));
}
console.log('✓ 12-koko-eating-bananas passed');

module.exports = { optimal, bruteForce };
