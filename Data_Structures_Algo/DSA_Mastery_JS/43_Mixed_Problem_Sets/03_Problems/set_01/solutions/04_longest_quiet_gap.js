/**
 * 04. Longest Quiet Gap   (Original — Easy)
 *
 * PROBLEM
 * Two servers each log the times (integers) at which they sent an alert. Each log is
 * already sorted in non-decreasing order. Looking at both logs together as one
 * timeline, return the longest gap between two consecutive alerts.
 * If the combined timeline has fewer than 2 alerts, return 0.
 *
 * EXAMPLES
 * Input: a = [1, 10], b = [4, 5]          Output: 5   Explanation: timeline 1,4,5,10 -> gaps 3,1,5
 * Input: a = [], b = [7]                  Output: 0
 * Input: a = [2, 2, 3], b = []            Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Both inputs sorted? (yes) Can they contain equal times? (yes, gap 0)
 * - Up to 10^5 entries each. Can I mutate the inputs? (prefer not)
 *
 * APPROACH 1 — Brute force   O((n + m) log(n + m)) time, O(n + m) space
 * Concatenate, sort, scan neighbouring pairs.
 *
 * APPROACH 2 — Optimal (two-pointer merge + running max)   O(n + m) time, O(1) space
 * Walk both arrays with pointers i and j like the merge step of merge sort. Each step
 * takes the smaller head; compare it with the previous timestamp taken and update the
 * best gap. No merged array is ever built.
 *
 * Dry run on a = [1, 10], b = [4, 5]:
 *   take a[0]=1   prev=null           prev=1
 *   take b[0]=4   gap 3   best=3      prev=4
 *   take b[1]=5   gap 1   best=3      prev=5
 *   take a[1]=10  gap 5   best=5      prev=10
 *   answer 5
 *
 * EDGE CASES
 * - both empty / one alert total   -> 0
 * - one list empty                 -> just the gaps inside the other
 * - duplicates                     -> gap 0 does not break anything
 *
 * COMMON MISTAKES
 * - Computing the best gap inside each array separately: misses gaps that span both.
 * - Using `a.concat(b).sort()` without a comparator: JS sorts numbers as strings.
 */

function bruteForce(a, b) {
  const all = a.concat(b).sort((x, y) => x - y);
  let best = 0;
  for (let i = 1; i < all.length; i++) best = Math.max(best, all[i] - all[i - 1]);
  return best;
}

function optimal(a, b) {
  let i = 0, j = 0, prev = null, best = 0;
  while (i < a.length || j < b.length) {
    let cur;
    if (j >= b.length || (i < a.length && a[i] <= b[j])) cur = a[i++];
    else cur = b[j++];
    if (prev !== null) best = Math.max(best, cur - prev);
    prev = cur;
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 10], [4, 5]), 5);
  assert.strictEqual(solve([], [7]), 0);
  assert.strictEqual(solve([2, 2, 3], []), 1);
  assert.strictEqual(solve([], []), 0);
  assert.strictEqual(solve([1, 2, 3], [100]), 97);
  assert.strictEqual(solve([-5, 0], [-20]), 15);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(104);
const sortedArr = (n) => Array.from({ length: n }, () => Math.floor(rand() * 50) - 10).sort((x, y) => x - y);
for (let t = 0; t < 300; t++) {
  const a = sortedArr(Math.floor(rand() * 8));
  const b = sortedArr(Math.floor(rand() * 8));
  assert.strictEqual(optimal(a, b), bruteForce(a, b));
}
console.log('✓ set_01/04_longest_quiet_gap passed');
module.exports = { optimal, bruteForce };
