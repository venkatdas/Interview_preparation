/**
 * 02. Subarrays with Sum in a Range   (Original — Medium)
 *
 * PROBLEM
 * Given an array of NON-NEGATIVE integers and two integers lo <= hi, count the
 * non-empty contiguous subarrays whose sum s satisfies lo <= s <= hi.
 *
 * EXAMPLES
 * Input: a = [1, 2, 3], lo = 3, hi = 5      Output: 3    [1,2]=3, [3]=3, [2,3]=5
 * Input: a = [0, 0], lo = 0, hi = 0         Output: 3    [0], [0], [0,0]
 * Input: a = [4], lo = 1, hi = 3            Output: 0
 * Input: a = [], lo = 0, hi = 10            Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e5, values 0..1e4. Non-negative matters (sums grow as the window grows).
 * - Empty subarray counts? (no)
 *
 * APPROACH 1 — Brute force (all subarrays, extended sums)   O(n²) time, O(1) space
 * For each start i, extend j = i..n-1 keeping a running sum (O(1) per subarray, not a
 * third loop). Count sums inside [lo, hi]. Because values are non-negative, we could even
 * break once the sum exceeds hi: a pruned brute force.
 *
 * APPROACH 2 — Optimal (count(<= hi) - count(<= lo - 1) with a sliding window)   O(n) time, O(1) space
 * atMost(T) = number of subarrays with sum <= T. With non-negative values, for each right
 * end r the valid left ends form a suffix [l, r] where l only moves right. Add (r - l + 1).
 * Answer = atMost(hi) - atMost(lo - 1).
 *
 * Dry run atMost(5) on [1,2,3]:
 *   r=0 sum=1 l=0 -> +1     r=1 sum=3 -> +2     r=2 sum=6 > 5 -> drop a[0], sum=5, l=1 -> +2   total 5
 *   atMost(2): r=0 +1; r=1 sum 3 > 2 drop -> sum 2, l=1 -> +1; r=2 sum 5 drop -> 3 drop -> 0, l=3 -> +0   total 2
 *   answer 5 - 2 = 3
 *
 * EDGE CASES
 * - zeros: many subarrays share a sum; the window handles them
 * - lo = 0: atMost(-1) = 0
 * - empty array -> 0
 *
 * COMMON MISTAKES
 * - Recomputing each subarray sum with a third loop (O(n³)).
 * - Using the sliding window with negative numbers (sums are no longer monotonic).
 * - Counting exact-range directly with one window (needs the at-most difference trick).
 */
const { compareWithOracle, randomIntArray, mulberry32 } = require('../../02_Implementations/test_harness');

function bruteForce(a, lo, hi) {
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    let sum = 0;
    for (let j = i; j < a.length; j++) {
      sum += a[j];
      if (sum > hi) break;              // non-negative values: it only grows from here
      if (sum >= lo) count++;
    }
  }
  return count;
}

function atMost(a, T) {
  if (T < 0) return 0;
  let l = 0, sum = 0, count = 0;
  for (let r = 0; r < a.length; r++) {
    sum += a[r];
    while (sum > T) sum -= a[l++];
    count += r - l + 1;
  }
  return count;
}

function optimal(a, lo, hi) {
  return atMost(a, hi) - atMost(a, lo - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3], 3, 5), 3);
  assert.strictEqual(solve([0, 0], 0, 0), 3);
  assert.strictEqual(solve([4], 1, 3), 0);
  assert.strictEqual(solve([], 0, 10), 0);
  assert.strictEqual(solve([2, 2, 2], 0, 100), 6);
}
const rand = mulberry32(602);
for (let t = 0; t < 30; t++) {
  const lo = Math.floor(rand() * 8), hi = lo + Math.floor(rand() * 8);
  const res = compareWithOracle(a => optimal(a, lo, hi), a => bruteForce(a, lo, hi), r => randomIntArray(r, 0, 10, 0, 5), { runs: 200, seed: 100 + t, valid: a => a.every(x => x >= 0) });
  assert.ok(res.ok, JSON.stringify(res));
}
console.log('✓ 02_subarrays_sum_in_range passed');

module.exports = { optimal, bruteForce };
