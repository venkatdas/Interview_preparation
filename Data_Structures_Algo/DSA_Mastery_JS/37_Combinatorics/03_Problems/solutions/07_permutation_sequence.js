/**
 * 07. Permutation Sequence   (LeetCode 60 — Hard)
 *
 * PROBLEM
 * List all n! permutations of the digits 1..n in lexicographic order. Return the k-th one
 * (1-indexed) as a string.
 *
 * EXAMPLES
 * Input: n = 3, k = 3   Output: "213"   (123, 132, 213, 231, 312, 321)
 * Input: n = 4, k = 9   Output: "2314"
 * Input: n = 3, k = 1   Output: "123"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 9, 1 <= k <= n!
 * - Is k 1-indexed? (yes -> subtract 1 first)
 *
 * APPROACH 1 — Brute force   O(k * n) time, O(n) space
 * Start from "12...n" and apply next-permutation k-1 times. Up to 9! = 362880 steps.
 *
 * APPROACH 2 — Optimal (factorial number system)   O(n^2) time, O(n) space
 * With n digits left, each choice of the FIRST digit owns a block of (n-1)! permutations.
 * So the first digit's index in the remaining pool is floor(k / (n-1)!) (k 0-indexed),
 * then k %= (n-1)! and repeat on the rest. Removing from the pool is O(n) -> O(n^2) total.
 *
 * Dry run, n = 4, k = 9 -> k0 = 8, pool = [1,2,3,4]
 *   block 3! = 6: idx = 8/6 = 1 -> take 2, k0 = 2, pool [1,3,4]
 *   block 2! = 2: idx = 2/2 = 1 -> take 3, k0 = 0, pool [1,4]
 *   block 1! = 1: idx = 0       -> take 1, pool [4]
 *   block 0! = 1: idx = 0       -> take 4          -> "2314"
 *
 * EDGE CASES
 * - k = 1 -> ascending digits; k = n! -> descending digits
 * - n = 1 -> "1"
 * - forgetting k-1 gives an off-by-one at every block boundary
 */

function nextPermutation(arr) {
  let i = arr.length - 2;
  while (i >= 0 && arr[i] >= arr[i + 1]) i--;
  if (i >= 0) {
    let j = arr.length - 1;
    while (arr[j] <= arr[i]) j--;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  for (let l = i + 1, r = arr.length - 1; l < r; l++, r--) [arr[l], arr[r]] = [arr[r], arr[l]];
}

function bruteForce(n, k) {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let step = 1; step < k; step++) nextPermutation(arr);
  return arr.join('');
}

function optimal(n, k) {
  const fact = [1];
  for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
  const pool = Array.from({ length: n }, (_, i) => i + 1);
  let rank = k - 1; // 0-indexed
  let out = '';
  for (let left = n; left >= 1; left--) {
    const block = fact[left - 1];
    const idx = Math.floor(rank / block);
    out += pool.splice(idx, 1)[0];
    rank %= block;
  }
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(3, 3), '213');
  assert.strictEqual(solve(4, 9), '2314');
  assert.strictEqual(solve(3, 1), '123');
  assert.strictEqual(solve(3, 6), '321');
  assert.strictEqual(solve(1, 1), '1');
  assert.strictEqual(solve(9, 362880), '987654321');
}
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(7);
for (let t = 0; t < 100; t++) {
  const n = 1 + Math.floor(rand() * 7);
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  const k = 1 + Math.floor(rand() * f);
  assert.strictEqual(optimal(n, k), bruteForce(n, k));
}
console.log('✓ 07_permutation_sequence passed');

module.exports = { optimal, bruteForce };
