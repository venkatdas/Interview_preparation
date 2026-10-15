/**
 * 01. Range Minimum Queries, offline / static   (classic — Medium)
 *
 * PROBLEM
 * Given a static integer array nums (no updates) and a list of queries [l, r], return
 * the minimum of nums[l..r] for every query.
 *
 * EXAMPLES
 * Input: nums = [5, 2, 8, 6, 3, 1, 7], queries = [[0,6],[2,4],[3,3],[1,2]]
 * Output: [1, 3, 6, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Any updates between queries? (no -> sparse table; yes -> segment tree)
 * - How many queries vs array size? (q and n both up to 10^5 -> O(n*q) is too slow)
 * - Inclusive ranges, l <= r
 *
 * APPROACH 1 — Brute force   O(n) per query, O(n * q) total
 * Loop from l to r for every query.
 *
 * APPROACH 2 — Optimal (Sparse table)   O(n log n) build, O(1) per query, O(n log n) space
 * table[k][i] = min of the 2^k elements starting at i.
 * For [l, r] with length len, let k = floor(log2 len). The two blocks of length 2^k that
 * start at l and end at r cover the whole range (they overlap, which is fine for min).
 * answer = min(table[k][l], table[k][r - 2^k + 1]).
 *
 * Dry run: nums = [5, 2, 8, 6, 3, 1, 7]
 *   table[0] = [5, 2, 8, 6, 3, 1, 7]
 *   table[1] = [2, 2, 6, 3, 1, 1]            (pairs)
 *   table[2] = [2, 2, 1, 1]                  (blocks of 4)
 *   query(2, 4): len 3, k = 1 -> min(table[1][2], table[1][3]) = min(6, 3) = 3
 *   query(0, 6): len 7, k = 2 -> min(table[2][0], table[2][3]) = min(2, 1) = 1
 *
 * EDGE CASES
 * - l === r (k = 0, both blocks are the same element)
 * - whole array
 * - n = 1
 * - negative numbers
 */

function bruteForce(nums, queries) {
  return queries.map(([l, r]) => {
    let best = Infinity;
    for (let i = l; i <= r; i++) best = Math.min(best, nums[i]);
    return best;
  });
}

function optimal(nums, queries) {
  const n = nums.length;
  const log = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) log[i] = log[i >> 1] + 1;

  const table = [nums.slice()];
  for (let k = 1; (1 << k) <= n; k++) {
    const prev = table[k - 1];
    const half = 1 << (k - 1);
    const row = [];
    for (let i = 0; i + (1 << k) <= n; i++) row.push(Math.min(prev[i], prev[i + half]));
    table.push(row);
  }

  return queries.map(([l, r]) => {
    const k = log[r - l + 1];
    return Math.min(table[k][l], table[k][r - (1 << k) + 1]);
  });
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([5, 2, 8, 6, 3, 1, 7], [[0, 6], [2, 4], [3, 3], [1, 2]]), [1, 3, 6, 2]);
  assert.deepStrictEqual(solve([4], [[0, 0]]), [4]);
  assert.deepStrictEqual(solve([-1, -5, 3], [[0, 2], [0, 0], [2, 2]]), [-5, -1, 3]);
  assert.deepStrictEqual(solve([1, 1, 1, 1], [[1, 2]]), [1]);
  assert.deepStrictEqual(solve([9, 8, 7, 6, 5, 4, 3, 2], [[0, 7], [4, 7], [0, 3]]), [2, 2, 6]);
}
for (let trial = 0; trial < 50; trial++) {
  const n = 1 + Math.floor(Math.random() * 40);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 100) - 50);
  const queries = Array.from({ length: 30 }, () => {
    const l = Math.floor(Math.random() * n);
    return [l, l + Math.floor(Math.random() * (n - l))];
  });
  assert.deepStrictEqual(optimal(nums, queries), bruteForce(nums, queries));
}
console.log('✓ 01-range-min-queries-offline passed');

module.exports = { optimal, bruteForce };
