/**
 * 05. Capped XOR Queries   (Original — Hard)
 *
 * PROBLEM
 * You have an array of non-negative integers `nums`. Each query [x, m] asks: among the
 * numbers in nums that are <= m, which one gives the largest value of (x XOR number)?
 * Return that largest XOR, or -1 if no number in nums is <= m. Answer every query (in
 * the given order).
 *
 * EXAMPLES
 * Input: nums = [0, 1, 2, 3, 4], queries = [[3, 1], [1, 3], [5, 6]]   Output: [3, 3, 7]
 *        Explanation: x=3,m=1 -> best 3^0=3; x=1,m=3 -> 1^2=3; x=5,m=6 -> 5^2=7
 * Input: nums = [5, 9], queries = [[1, 4]]                            Output: [-1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^5 numbers and 10^5 queries; values < 2^30.
 * - Queries are known in advance? (yes, all queries are given up front)
 *
 * APPROACH 1 — Brute force   O(n * q) time, O(1) space
 * For each query scan all nums <= m and keep the best XOR.
 *
 * APPROACH 2 — Optimal (sort + offline queries + binary trie, greedy bit by bit)   O((n + q) * 30 + n log n + q log q) time, O(n * 30) space
 * Sort nums ascending and sort query indices by m. Sweep queries in increasing m; before
 * answering, insert every num <= m into a binary trie (bits 29 down to 0). Then the trie
 * holds exactly the allowed numbers. Max XOR with x is greedy: at each bit try to go to the
 * child with the OPPOSITE bit of x (that sets this bit of the result to 1, which beats any
 * choice for the lower bits); fall back to the same bit if missing.
 *
 * Dry run on nums = [0,1,2,3,4], queries sorted by m: [3,1], [1,3], [5,6]
 *   m=1: insert 0, 1        x=3 (011): want 1 at bit1? missing -> 0; bit0 want 0 -> 0 -> pick 000 -> 3
 *   m=3: insert 2, 3        x=1 (001): bit1 want 1 -> yes (2 or 3); bit0 want 0 -> 2 -> 1^2 = 3
 *   m=6: insert 4           x=5 (101): bit2 want 0 -> yes; bit1 want 1 -> yes; bit0 want 0 -> 010=2 -> 7
 *   answers in original order [3, 3, 7]
 *
 * EDGE CASES
 * - no number <= m -> -1 (trie still empty)
 * - x = 0 -> answer is the largest allowed number
 * - duplicates in nums -> harmless
 *
 * COMMON MISTAKES
 * - Answering queries in sorted order but returning them unsorted.
 * - Using 1 << 31 (negative in JS) — keep values below 2^30 or use >>> 0.
 */

function bruteForce(nums, queries) {
  return queries.map(([x, m]) => {
    let best = -1;
    for (const v of nums) if (v <= m) best = Math.max(best, x ^ v);
    return best;
  });
}

const BITS = 30;

function optimal(nums, queries) {
  const sorted = nums.slice().sort((a, b) => a - b);
  const order = queries.map((_, i) => i).sort((a, b) => queries[a][1] - queries[b][1]);
  const trie = [[0, 0]]; // node -> [child0, child1]; 0 means "no child" (root is never a child)
  const insert = (v) => {
    let node = 0;
    for (let b = BITS - 1; b >= 0; b--) {
      const bit = (v >> b) & 1;
      if (!trie[node][bit]) { trie.push([0, 0]); trie[node][bit] = trie.length - 1; }
      node = trie[node][bit];
    }
  };
  const ans = new Array(queries.length);
  let p = 0, inserted = 0;
  for (const qi of order) {
    const [x, m] = queries[qi];
    while (p < sorted.length && sorted[p] <= m) { insert(sorted[p++]); inserted++; }
    if (!inserted) { ans[qi] = -1; continue; }
    let node = 0, res = 0;
    for (let b = BITS - 1; b >= 0; b--) {
      const want = ((x >> b) & 1) ^ 1;
      if (trie[node][want]) { res |= 1 << b; node = trie[node][want]; }
      else node = trie[node][want ^ 1];
    }
    ans[qi] = res;
  }
  return ans;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([0, 1, 2, 3, 4], [[3, 1], [1, 3], [5, 6]]), [3, 3, 7]);
  assert.deepStrictEqual(solve([5, 9], [[1, 4]]), [-1]);
  assert.deepStrictEqual(solve([], [[1, 100]]), [-1]);
  assert.deepStrictEqual(solve([7, 7], [[0, 7]]), [7]);
  assert.deepStrictEqual(solve([536870911], [[0, 1073741823]]), [536870911]);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(405);
for (let t = 0; t < 300; t++) {
  const nums = Array.from({ length: Math.floor(rand() * 10) }, () => Math.floor(rand() * 64));
  const queries = Array.from({ length: Math.floor(rand() * 6) }, () => [Math.floor(rand() * 64), Math.floor(rand() * 70)]);
  assert.deepStrictEqual(optimal(nums, queries), bruteForce(nums, queries));
}
console.log('✓ set_04/05_capped_xor_queries passed');
module.exports = { optimal, bruteForce };
