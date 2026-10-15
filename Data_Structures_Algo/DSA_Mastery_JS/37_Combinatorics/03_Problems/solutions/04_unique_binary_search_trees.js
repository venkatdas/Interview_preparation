/**
 * 04. Unique Binary Search Trees   (LeetCode 96 — Medium)
 *
 * PROBLEM
 * Given n, count how many structurally different binary search trees store exactly the
 * values 1..n.
 *
 * EXAMPLES
 * Input: n = 3   Output: 5
 * Input: n = 1   Output: 1
 * Input: n = 4   Output: 14
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 19 (answer for 19 is 1,767,263,190: fits in a JS number)
 * - n = 0? (the empty tree counts as 1 structure)
 *
 * APPROACH 1 — Brute force (DP over the root)   O(n^2) time, O(n) space
 * Choose root r. Values 1..r-1 form the left subtree (r-1 nodes), r+1..n the right (n-r nodes).
 * Shapes multiply: G(n) = sum over r of G(r-1) * G(n-r), with G(0) = 1.
 * This is exactly the Catalan recurrence.
 *
 * APPROACH 2 — Optimal (Catalan closed form)   O(n) time, O(1) space
 * G(n) = Catalan(n) = C(2n, n) / (n + 1). Use the ratio
 *   Cat(i+1) = Cat(i) * 2(2i+1) / (i+2)
 * which stays an integer at every step. Intermediate Cat(i) * 2(2i+1) for n <= 19 is
 * below 2^53, so plain numbers are exact; BigInt keeps it exact for any n.
 *
 * Dry run, n = 3:
 *   Cat0 = 1
 *   Cat1 = 1 * 2*1 / 2 = 1
 *   Cat2 = 1 * 2*3 / 3 = 2
 *   Cat3 = 2 * 2*5 / 4 = 5   -> 5
 *
 * EDGE CASES
 * - n = 0 -> 1, n = 1 -> 1
 * - large n -> use BigInt (Catalan grows like 4^n / n^1.5)
 */

function bruteForce(n) {
  const G = new Array(n + 1).fill(0);
  G[0] = 1;
  for (let nodes = 1; nodes <= n; nodes++) {
    for (let root = 1; root <= nodes; root++) G[nodes] += G[root - 1] * G[nodes - root];
  }
  return G[n];
}

function optimal(n) {
  let cat = 1n;
  for (let i = 0; i < n; i++) cat = (cat * BigInt(2 * (2 * i + 1))) / BigInt(i + 2);
  return Number(cat);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(0), 1);
  assert.strictEqual(solve(1), 1);
  assert.strictEqual(solve(3), 5);
  assert.strictEqual(solve(4), 14);
  assert.strictEqual(solve(19), 1767263190);
}
// structural check: actually build all BST shapes for small n
function countShapes(lo, hi) {
  if (lo > hi) return 1;
  let total = 0;
  for (let r = lo; r <= hi; r++) total += countShapes(lo, r - 1) * countShapes(r + 1, hi);
  return total;
}
for (let n = 0; n <= 10; n++) assert.strictEqual(optimal(n), countShapes(1, n));
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(4);
for (let t = 0; t < 50; t++) {
  const n = Math.floor(rand() * 20);
  assert.strictEqual(optimal(n), bruteForce(n));
}
console.log('✓ 04_unique_binary_search_trees passed');

module.exports = { optimal, bruteForce };
