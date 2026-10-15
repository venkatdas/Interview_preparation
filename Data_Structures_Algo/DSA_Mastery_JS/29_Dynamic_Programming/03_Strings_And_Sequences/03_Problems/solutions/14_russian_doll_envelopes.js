/**
 * 14. Russian Doll Envelopes   (LeetCode 354 — Hard)
 *
 * PROBLEM
 * You are given envelopes[i] = [width, height]. Envelope A fits inside B only if
 * A's width AND height are both strictly smaller. Return the maximum number of
 * envelopes you can nest one inside another (no rotation).
 *
 * EXAMPLES
 * Input: [[5,4],[6,4],[6,7],[2,3]]   Output: 3   Explanation: [2,3] -> [5,4] -> [6,7]
 * Input: [[1,1],[1,1],[1,1]]         Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strictly smaller in both dimensions? (yes; equal width does NOT fit)
 * - Can we rotate envelopes? (no)
 * - Empty input? (0)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Sort by width. Then it is LIS with a "fits" comparison: take / skip each envelope,
 * tracking the last one taken.
 *
 * APPROACH 2 — DP: 2D LIS   O(n^2) time, O(n) space
 * Sort by width ascending. Now a chain only needs to go left-to-right in the sorted
 * array AND satisfy strict width and height.
 * STATE      dp[i] = longest chain ending with envelope i
 * RECURRENCE dp[i] = 1 + max(dp[j]) for j < i with w[j] < w[i] and h[j] < h[i]
 * BASE CASES dp[i] = 1
 * ANSWER     max(dp)
 *
 * Sorted [[2,3],[5,4],[6,4],[6,7]]:
 *   i    : 0      1      2      3
 *   env  : [2,3]  [5,4]  [6,4]  [6,7]
 *   dp   : 1      2      2      3      ([6,7] fits [5,4] (dp 2) -> 3; not [6,4]: same width)
 *
 * APPROACH 3 — Sort trick + LIS O(n log n)   O(n log n) time, O(n) space
 * Sort by width ASC, and for equal widths by height DESC. Then run plain LIS on
 * heights only. Why height DESC for ties? Two envelopes with the same width must
 * never both be chosen; with heights descending, the second one is NOT greater than
 * the first, so LIS can never pick both. Width is then handled by the sort order.
 *
 * Sorted: [2,3] [5,4] [6,7] [6,4]  -> heights [3, 4, 7, 4]
 *   3 -> tails [3];  4 -> [3,4];  7 -> [3,4,7];  4 -> replaces 7 -> [3,4,4]  length 3
 *
 * EDGE CASES
 * - [] -> 0
 * - all identical -> 1
 * - same width, growing height -> 1 (width must be strictly smaller)
 */

function fits(inner, outer) {
  return inner[0] < outer[0] && inner[1] < outer[1];
}

function sortByWidth(envelopes) {
  return [...envelopes].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function bruteForce(envelopes) {
  const sorted = sortByWidth(envelopes);
  function longest(index, lastTaken) {
    if (index === sorted.length) return 0;
    const skip = longest(index + 1, lastTaken);
    let take = 0;
    if (lastTaken === null || fits(lastTaken, sorted[index])) {
      take = 1 + longest(index + 1, sorted[index]);
    }
    return Math.max(skip, take);
  }
  return longest(0, null);
}

function memo(envelopes) {
  const sorted = sortByWidth(envelopes);
  const cache = new Map(); // key (index, lastIndex)
  function longest(index, lastIndex) {
    if (index === sorted.length) return 0;
    const key = index + ',' + lastIndex;
    if (cache.has(key)) return cache.get(key);
    const skip = longest(index + 1, lastIndex);
    let take = 0;
    if (lastIndex === -1 || fits(sorted[lastIndex], sorted[index])) {
      take = 1 + longest(index + 1, index);
    }
    const result = Math.max(skip, take);
    cache.set(key, result);
    return result;
  }
  return longest(0, -1);
}

function tabulation(envelopes) {
  if (envelopes.length === 0) return 0;
  const sorted = sortByWidth(envelopes);
  const dp = new Array(sorted.length).fill(1);
  let best = 1;
  for (let i = 1; i < sorted.length; i++) {
    for (let j = 0; j < i; j++) {
      if (fits(sorted[j], sorted[i])) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}

function optimized(envelopes) {
  // width asc, height DESC on ties, then LIS on heights
  const sorted = [...envelopes].sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const tails = [];
  for (const [, height] of sorted) {
    let low = 0;
    let high = tails.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (tails[mid] < height) low = mid + 1;
      else high = mid;
    }
    tails[low] = height;
  }
  return tails.length;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([[5, 4], [6, 4], [6, 7], [2, 3]]), 3);
  assert.strictEqual(solve([[1, 1], [1, 1], [1, 1]]), 1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[3, 3]]), 1);
  assert.strictEqual(solve([[1, 2], [1, 3], [1, 4]]), 1);
  assert.strictEqual(solve([[1, 1], [2, 2], [3, 3], [4, 4]]), 4);
  assert.strictEqual(solve([[4, 5], [4, 6], [6, 7], [2, 3], [1, 1]]), 4);
}
console.log('✓ 14-russian-doll-envelopes passed');

module.exports = { bruteForce, memo, tabulation, optimized };
