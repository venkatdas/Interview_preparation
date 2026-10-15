/**
 * 08. Root-Dominated Recursion   (Original — Medium)
 *
 * PROBLEM
 * h(n) does a quadratic amount of work and then recurses on two halves:
 *
 *   function h(n) {
 *     for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) steps++;   // n² work
 *     if (n <= 1) return;
 *     h(Math.floor(n / 2)); h(Math.ceil(n / 2));
 *   }
 *
 * Write the recurrence, solve it with the master theorem, and compute the exact step
 * count for n = 1e9 (running the code is impossible: ~2e18 steps). Explain why the
 * recursion "does not matter" here.
 *
 * EXAMPLES
 * n = 1 -> 1   n = 2 -> 6   n = 3 -> 9 + 1 + 4 + 2·1 = 16   n = 4 -> 28   n = 1024 -> 2·1024² - 1024 = 2096128
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exact answer for n up to 1e9 must fit in a double exactly? (≈ 2e18 > 2^53: use BigInt)
 *
 * APPROACH 1 — Brute force (run it)   Θ(n²)
 * Run h with a counter (only feasible for small n).
 *
 * APPROACH 2 — Optimal (memoized recurrence on distinct sizes)   O(log n) time
 * W(n) = n² + W(floor(n/2)) + W(ceil(n/2)), W(0) = 0, W(1) = 1.
 * At each depth the sizes are only floor/ceil of n/2^i, so at most 2 distinct values per level:
 * memoizing on n gives O(log n) evaluations. BigInt keeps it exact.
 * Master theorem: a = 2, b = 2, d = 2; log2 2 = 1 < 2 -> case 3 (root dominates) -> Θ(n²).
 * Level i costs 2^i · (n/2^i)² = n² / 2^i: a geometric series 1 + 1/2 + 1/4 + ... < 2,
 * so W(n) < 2n², and the root alone is n² -> Θ(n²). For n = 2^k exactly: W = 2n² - n.
 *
 * EMPIRICAL CHECK
 * W(2n) / W(n) -> 4 (quadratic), same as the root alone.
 *
 * EDGE CASES
 * - n = 0 -> 0 work (the loops do not run; we stop at n <= 1 after the loops)
 * - odd n: floor and ceil differ; the memo still has only two sizes per level
 *
 * COMMON MISTAKES
 * - Writing Θ(n² log n) by analogy with merge sort (that is case 2, when every level costs the same).
 * - Forgetting that the result overflows 2^53 for large n.
 */
const { masterTheorem, mulberry32 } = require('../../02_Implementations/growth');

function bruteForce(n) {
  let steps = 0;
  (function h(m) {
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) steps++;
    if (m <= 1) return;
    h(Math.floor(m / 2)); h(Math.ceil(m / 2));
  })(n);
  return BigInt(steps);
}

function optimal(n, memo = new Map()) {
  if (n <= 1) return BigInt(n);           // W(0) = 0, W(1) = 1
  if (memo.has(n)) return memo.get(n);
  const big = BigInt(n);
  const v = big * big + optimal(Math.floor(n / 2), memo) + optimal(Math.ceil(n / 2), memo);
  memo.set(n, v);
  return v;
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, s] of [[0, 0n], [1, 1n], [2, 6n], [3, 16n], [4, 28n]]) {
  assert.strictEqual(bruteForce(n), s, `brute ${n}`);
  assert.strictEqual(optimal(n), s, `optimal ${n}`);
}
for (let n = 0; n <= 300; n++) assert.strictEqual(optimal(n), bruteForce(n));
for (let k = 0; k <= 30; k++) { const n = BigInt(2 ** k); assert.strictEqual(optimal(2 ** k), 2n * n * n - n); }
assert.strictEqual(masterTheorem(2, 2, 2).bound, 'Theta(n^2)');
const w = optimal(1e9);
assert.ok(w > 10n ** 18n && w < 2n * 10n ** 18n, 'between n² and 2n²');
const ratio = Number(bruteForce(512)) / Number(bruteForce(256));
assert.ok(Math.abs(ratio - 4) < 0.01);
const rand = mulberry32(408);
for (let t = 0; t < 50; t++) { const n = Math.floor(rand() * 400); assert.strictEqual(optimal(n), bruteForce(n)); }
console.log('✓ 08_root_dominated_recursion passed');

module.exports = { optimal, bruteForce };
