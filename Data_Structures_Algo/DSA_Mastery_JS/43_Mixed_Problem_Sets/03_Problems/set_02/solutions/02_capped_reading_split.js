/**
 * 02. Capped Reading Split   (Original — Medium)
 *
 * PROBLEM
 * A book has chapters with page counts `pages` (in order). You must split the chapters
 * into AT MOST k reading days. Each day reads a contiguous block of chapters, and no day
 * may contain more than `cap` chapters. Minimize the largest number of pages read on
 * any single day. Return that minimum, or -1 if no valid split exists.
 *
 * EXAMPLES
 * Input: pages = [7, 2, 5, 10, 8], k = 2, cap = 5   Output: 18   Explanation: [7,2,5] | [10,8]
 * Input: pages = [7, 2, 5, 10, 8], k = 3, cap = 2   Output: 15   Explanation: [7,2] | [5,10] | [8]
 * Input: pages = [7, 2, 5, 10, 8], k = 2, cap = 2   Output: -1   Explanation: 5 chapters need at least 3 days
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= pages.length <= 10^4, pages[i] >= 1, 1 <= k, 1 <= cap.
 * - If pages.length > k * cap the split is impossible -> -1.
 * - Can a day be empty? (not needed: using fewer days is allowed)
 *
 * APPROACH 1 — Brute force   O(n^2 * k) time, O(n * k) space
 * DP: best[d][i] = minimum possible max-day for the first i chapters using d days,
 * trying every legal size (1..cap) for the last day.
 *
 * APPROACH 2 — Optimal (binary search on the answer + greedy check)   O(n log(sum)) time, O(1) space
 * If a max-day limit X works, any larger X also works (monotonic) -> binary search X in
 * [max(pages), sum(pages)]. To check X, greedily pack chapters into the current day while
 * both "pages <= X" and "chapters <= cap" hold; otherwise start a new day. Greedy packing
 * uses the fewest days possible, so X is feasible iff days <= k.
 *
 * Dry run on pages = [7, 2, 5, 10, 8], k = 2, cap = 5:
 *   lo=10, hi=32
 *   X=21: [7,2,5] (14, +10 would be 24) | [10,8] -> 2 days ok  -> hi=21
 *   X=15: [7,2,5] | [10] | [8] -> 3 days      -> lo=16
 *   X=18: [7,2,5] | [10,8] -> 2 days ok       -> hi=18
 *   X=16: [7,2,5] | [10] | [8] -> 3           -> lo=17
 *   X=17: 3 days                              -> lo=18
 *   answer 18
 *
 * EDGE CASES
 * - n > k * cap                      -> -1
 * - k >= n and cap >= 1              -> max(pages) (one chapter per day)
 * - single chapter                   -> that chapter
 *
 * COMMON MISTAKES
 * - Forgetting the cap inside the greedy check (the classic version has no cap).
 * - Starting lo at 0 or 1 instead of max(pages): the check then has to handle a chapter
 *   that never fits.
 */

function bruteForce(pages, k, cap) {
  const n = pages.length;
  if (n > k * cap) return -1;
  const pre = [0];
  for (const p of pages) pre.push(pre[pre.length - 1] + p);
  // best[d][i]: first i chapters in exactly up-to-d days
  let best = new Array(n + 1).fill(Infinity);
  best[0] = 0;
  let answer = Infinity;
  for (let d = 1; d <= k; d++) {
    const next = new Array(n + 1).fill(Infinity);
    next[0] = 0;
    for (let i = 1; i <= n; i++)
      for (let size = 1; size <= cap && size <= i; size++)
        next[i] = Math.min(next[i], Math.max(best[i - size], pre[i] - pre[i - size]));
    best = next;
    answer = Math.min(answer, best[n]);
  }
  return answer;
}

function daysNeeded(pages, cap, limit) {
  let days = 1, load = 0, count = 0;
  for (const p of pages) {
    if (load + p > limit || count === cap) { days++; load = 0; count = 0; }
    load += p; count++;
  }
  return days;
}

function optimal(pages, k, cap) {
  if (pages.length > k * cap) return -1;
  let lo = Math.max(...pages), hi = pages.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (daysNeeded(pages, cap, mid) <= k) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([7, 2, 5, 10, 8], 2, 5), 18);
  assert.strictEqual(solve([7, 2, 5, 10, 8], 3, 2), 15);
  assert.strictEqual(solve([7, 2, 5, 10, 8], 2, 2), -1);
  assert.strictEqual(solve([4], 1, 1), 4);
  assert.strictEqual(solve([1, 1, 1, 1], 4, 1), 1);
  assert.strictEqual(solve([1, 1, 1, 1], 2, 3), 2);
  assert.strictEqual(solve([1, 1, 1, 1], 1, 4), 4);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(202);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 8);
  const pages = Array.from({ length: n }, () => 1 + Math.floor(rand() * 10));
  const k = 1 + Math.floor(rand() * 4), cap = 1 + Math.floor(rand() * 4);
  assert.strictEqual(optimal(pages, k, cap), bruteForce(pages, k, cap));
}
console.log('✓ set_02/02_capped_reading_split passed');
module.exports = { optimal, bruteForce };
