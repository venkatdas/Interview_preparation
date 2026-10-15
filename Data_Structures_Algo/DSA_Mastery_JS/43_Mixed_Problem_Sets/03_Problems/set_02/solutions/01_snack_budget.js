/**
 * 01. Snack Budget   (Original — Easy)
 *
 * PROBLEM
 * A vending machine has snacks with prices `prices` (one of each). For every budget in
 * `budgets`, answer independently: what is the largest NUMBER of different snacks you
 * can buy without the total going over the budget? Return an array of answers.
 *
 * EXAMPLES
 * Input: prices = [4, 2, 7, 1], budgets = [3, 10, 0]   Output: [2, 3, 0]
 *        Explanation: budget 3 buys 1+2; budget 10 buys 1+2+4; budget 0 buys nothing
 * Input: prices = [], budgets = [5]                    Output: [0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Prices are positive integers? (yes) Budgets are non-negative.
 * - Up to 10^5 prices and 10^5 budgets, so O(n) per budget is too slow.
 * - Should I return answers in the original budget order? (yes)
 *
 * APPROACH 1 — Brute force   O(q * n log n) time, O(n) space
 * For each budget, sort the prices and buy from the cheapest until the next one does not fit.
 *
 * APPROACH 2 — Optimal (sort + prefix sums + binary search)   O((n + q) log n) time, O(n) space
 * Greedy insight: to maximize the COUNT you always take the cheapest snacks first.
 * Sort once and build prefix sums pre[i] = cost of the i cheapest snacks (non-decreasing).
 * The answer for budget B is the largest i with pre[i] <= B, found by binary search
 * (upper bound of B in pre, minus one).
 *
 * Dry run on prices = [4, 2, 7, 1]:
 *   sorted = [1, 2, 4, 7]   pre = [0, 1, 3, 7, 14]
 *   B=3  : largest i with pre[i] <= 3  -> i=2
 *   B=10 : largest i with pre[i] <= 10 -> i=3
 *   B=0  : i=0
 *   answer [2, 3, 0]
 *
 * EDGE CASES
 * - no prices                  -> all zeros
 * - budget huge                -> n
 * - budget exactly equals a prefix sum -> that prefix is allowed (<=)
 *
 * COMMON MISTAKES
 * - Sorting inside the query loop (back to brute force speed).
 * - Off-by-one in the binary search: return the count, not the index into sorted prices.
 * - Sorting numbers without a comparator.
 */

function bruteForce(prices, budgets) {
  return budgets.map((b) => {
    const sorted = prices.slice().sort((x, y) => x - y);
    let count = 0, spent = 0;
    for (const p of sorted) { if (spent + p > b) break; spent += p; count++; }
    return count;
  });
}

function optimal(prices, budgets) {
  const sorted = prices.slice().sort((x, y) => x - y);
  const pre = [0];
  for (const p of sorted) pre.push(pre[pre.length - 1] + p);
  return budgets.map((b) => {
    // find the first index whose prefix sum is > b; the answer is that index - 1
    let lo = 0, hi = pre.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (pre[mid] <= b) lo = mid + 1; else hi = mid;
    }
    return lo - 1;
  });
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([4, 2, 7, 1], [3, 10, 0]), [2, 3, 0]);
  assert.deepStrictEqual(solve([], [5]), [0]);
  assert.deepStrictEqual(solve([5], []), []);
  assert.deepStrictEqual(solve([3, 3, 3], [9, 8, 100]), [3, 2, 3]);
  assert.deepStrictEqual(solve([1], [1]), [1]);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(201);
for (let t = 0; t < 300; t++) {
  const prices = Array.from({ length: Math.floor(rand() * 8) }, () => 1 + Math.floor(rand() * 9));
  const budgets = Array.from({ length: Math.floor(rand() * 5) }, () => Math.floor(rand() * 30));
  assert.deepStrictEqual(optimal(prices, budgets), bruteForce(prices, budgets));
}
console.log('✓ set_02/01_snack_budget passed');
module.exports = { optimal, bruteForce };
