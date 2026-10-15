/**
 * 01. Dependent Nested Loops   (Original — Easy)
 *
 * PROBLEM
 * Analyze this function. Give (a) the EXACT number of times the innermost line runs
 * as a formula in n, (b) a tight Θ bound, (c) the space used. Then confirm the growth
 * empirically with a step counter.
 *
 *   function pairProductSum(a) {            // n = a.length
 *     let total = 0;
 *     for (let i = 0; i < a.length; i++)
 *       for (let j = i + 1; j < a.length; j++)
 *         total += a[i] * a[j];             // <- count this line
 *     return total;
 *   }
 *
 * Part 2: write an equivalent function that does Θ(n) work.
 *
 * EXAMPLES
 * n = 0 -> 0 steps;  n = 1 -> 0;  n = 2 -> 1;  n = 4 -> 6;  n = 1000 -> 499500
 * pairProductSum([1, 2, 3]) = 1*2 + 1*3 + 2*3 = 11
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - What is n? (the array length)
 * - Count only the innermost line? (yes; the other lines add lower-order terms)
 *
 * APPROACH 1 — Brute force (run the code and count)   Θ(n²) time
 * bruteForce(n) runs the loops literally and returns the step count. This is the
 * ground truth we test the formula against.
 *
 * APPROACH 2 — Optimal (closed form)   Θ(1) to evaluate
 * For a fixed i the inner loop runs (n - 1 - i) times. Sum over i = 0..n-1:
 *   (n-1) + (n-2) + ... + 1 + 0 = n(n-1)/2
 * n(n-1)/2 = n²/2 - n/2 -> Θ(n²): it is O(n²) (c = 1/2) and Ω(n²) (c = 1/4 for n >= 2).
 * Space: Θ(1) extra (two counters and the total).
 * Part 2: Σ_{i<j} a_i a_j = ((Σ a)² - Σ a²) / 2, or a running prefix sum:
 *   for each j: total += a[j] * prefix; prefix += a[j]   -> Θ(n).
 *
 * EMPIRICAL CHECK
 * steps(2n) / steps(n) = 2n(2n-1) / (n(n-1)) -> 4 as n grows (the quadratic signature).
 *
 * EDGE CASES
 * - n = 0 and n = 1 -> 0 steps (the inner loop never starts)
 * - the formula must be exact for every n, not just large n
 * - n = 0 in JS: 0 * (0 - 1) / 2 is -0 (a fun Programming Fundamentals reminder)
 *
 * COMMON MISTAKES
 * - Answering n² "because two loops" without the 1/2 (fine for Θ, wrong for the exact count).
 * - Thinking j starting at i + 1 makes it Θ(n log n). It only halves the work.
 */
const { doublingRatio, mulberry32 } = require('../../02_Implementations/growth');

function bruteForce(n) {
  let steps = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) steps++;
  return steps;
}

function optimal(n) {
  // n = 0 would give 0 * -1 / 2 = -0, and assert.strictEqual (Object.is) treats -0 !== 0
  return n < 2 ? 0 : (n * (n - 1)) / 2;
}

function pairProductSumSlow(a) {
  let total = 0;
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) total += a[i] * a[j];
  return total;
}
function pairProductSumFast(a) {
  let total = 0, prefix = 0;
  for (const x of a) { total += x * prefix; prefix += x; }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, s] of [[0, 0], [1, 0], [2, 1], [4, 6], [1000, 499500]]) {
  assert.strictEqual(bruteForce(n), s);
  assert.strictEqual(optimal(n), s);
}
for (let n = 0; n <= 300; n++) assert.strictEqual(optimal(n), bruteForce(n));
const ratio = doublingRatio(bruteForce, 2000);
assert.ok(Math.abs(ratio - 4) < 0.01, `ratio ${ratio}`);
assert.strictEqual(pairProductSumSlow([1, 2, 3]), 11);
const rand = mulberry32(401);
for (let t = 0; t < 300; t++) {
  const a = Array.from({ length: Math.floor(rand() * 40) }, () => Math.floor(rand() * 21) - 10);
  assert.strictEqual(pairProductSumFast(a), pairProductSumSlow(a));
}
console.log('✓ 01_dependent_nested_loops passed');

module.exports = { optimal, bruteForce, pairProductSumSlow, pairProductSumFast };
