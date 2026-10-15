/**
 * 01. Pairs with Sum Divisible by K   (Original — Easy)
 *
 * PROBLEM
 * Given an array of integers (may be negative) and a positive integer k, count the pairs
 * of indices i < j such that (a[i] + a[j]) is divisible by k.
 *
 * EXAMPLES
 * Input: a = [1, 2, 3, 4, 5], k = 3      Output: 4    pairs (1,2) (1,5) (2,4) (4,5)
 * Input: a = [3, 6, 9], k = 3            Output: 3    every pair
 * Input: a = [-1, 1, 4], k = 5           Output: 2    (-1,1) sums to 0, (1,4) sums to 5
 * Input: a = [7], k = 2                  Output: 0    no pairs
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e5 -> all pairs (5e9) is too slow; brute force is still our reference.
 * - Negative values? (yes: JS % keeps the sign, normalise with ((x % k) + k) % k)
 * - Pairs of indices or of values? (indices i < j; equal values at different indices count)
 *
 * APPROACH 1 — Brute force (all pairs)   O(n²) time, O(1) space
 * Enumerate i < j (inner loop starts at i + 1) and test (a[i] + a[j]) % k === 0.
 * The inner loop is the repeated work: for each j we re-scan all earlier i looking
 * for "a partner remainder".
 *
 * APPROACH 2 — Optimal (count remainders)   O(n + k) time, O(k) space
 * (a + b) % k === 0  <=>  r(a) + r(b) ≡ 0 (mod k)  <=>  r(b) = (k - r(a)) % k.
 * Walk once; for each x with remainder r, add count[(k - r) % k] (earlier partners), then count[r]++.
 *
 * Dry run [1,2,3,4,5], k=3 (remainders 1,2,0,1,2):
 *   x=1 r=1 need 2: +0   count{1:1}
 *   x=2 r=2 need 1: +1   count{1:1,2:1}
 *   x=3 r=0 need 0: +0   count{0:1,...}
 *   x=4 r=1 need 2: +1   total 2
 *   x=5 r=2 need 1: +2   total 4
 *
 * EDGE CASES
 * - n < 2 -> 0
 * - negative numbers (normalised remainder)
 * - k = 1 -> every pair: n(n-1)/2
 *
 * COMMON MISTAKES
 * - j starting at i (pairs an element with itself) or at 0 (double counts).
 * - Using x % k directly for negatives (-1 % 3 is -1, not 2).
 * - Adding count AFTER incrementing (counts x with itself when 2r ≡ 0).
 */
const { compareWithOracle, randomIntArray, mulberry32 } = require('../../02_Implementations/test_harness');

function bruteForce(a, k) {
  let count = 0;
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++)
      if ((a[i] + a[j]) % k === 0) count++;
  return count;
}

function optimal(a, k) {
  const count = new Array(k).fill(0);
  let pairs = 0;
  for (const x of a) {
    const r = ((x % k) + k) % k;
    pairs += count[(k - r) % k];
    count[r]++;
  }
  return pairs;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 4, 5], 3), 4);
  assert.strictEqual(solve([3, 6, 9], 3), 3);
  assert.strictEqual(solve([-1, 1, 4], 5), 2);
  assert.strictEqual(solve([7], 2), 0);
  assert.strictEqual(solve([], 4), 0);
  assert.strictEqual(solve([5, 5, 5, 5], 1), 6);
}
const rand = mulberry32(601);
for (let t = 0; t < 30; t++) {
  const k = 1 + Math.floor(rand() * 7);
  const res = compareWithOracle(a => optimal(a, k), a => bruteForce(a, k), r => randomIntArray(r, 0, 10, -10, 10), { runs: 200, seed: t + 1 });
  assert.ok(res.ok, JSON.stringify(res));
}
console.log('✓ 01_pairs_divisible_by_k passed');

module.exports = { optimal, bruteForce };
