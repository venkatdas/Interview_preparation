/**
 * 01. 4Sum II   (LeetCode 454 — Medium)
 *
 * PROBLEM
 * You get four integer arrays A, B, C, D, all of length n. Count the index tuples
 * (i, j, k, l) with A[i] + B[j] + C[k] + D[l] === 0.
 *
 * EXAMPLES
 * A=[1,2] B=[-2,-1] C=[-1,2] D=[0,2]  -> 2
 * A=[0] B=[0] C=[0] D=[0]              -> 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 200, so n^4 = 1.6e9 is too slow, n^2 = 40,000 is fine.
 * - Count index tuples, not distinct value tuples (duplicates count separately).
 * - Values can be negative.
 *
 * APPROACH 1 — Brute force   O(n^4) time, O(1) space
 * Four nested loops, count the zero sums.
 *
 * APPROACH 2 — Optimal (meet in the middle + hash)   O(n^2) time, O(n^2) space
 * Split the four arrays into two "halves": (A, B) and (C, D).
 * Enumerate all n^2 sums a + b into a frequency map. Then for every c + d,
 * the matching left sums are exactly -(c + d): add freq[-(c + d)].
 *
 * Dry run on the first example:
 *   A+B sums: 1-2=-1, 1-1=0, 2-2=0, 2-1=1  -> {-1:1, 0:2, 1:1}
 *   C+D sums: -1+0=-1 (need 1 -> 1), -1+2=1 (need -1 -> 1), 2+0=2 (need -2 -> 0), 2+2=4 (need -4 -> 0)
 *   total = 2
 *
 * EDGE CASES
 * - all zeros: every tuple counts -> n^4
 * - no solution -> 0
 */

function bruteForce(A, B, C, D) {
  let count = 0;
  for (const a of A) for (const b of B) for (const c of C) for (const d of D) {
    if (a + b + c + d === 0) count++;
  }
  return count;
}

function optimal(A, B, C, D) {
  const freq = new Map();
  for (const a of A) for (const b of B) freq.set(a + b, (freq.get(a + b) || 0) + 1);
  let count = 0;
  for (const c of C) for (const d of D) count += freq.get(-(c + d)) || 0;
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2], [-2, -1], [-1, 2], [0, 2]), 2);
  assert.strictEqual(solve([0], [0], [0], [0]), 1);
  assert.strictEqual(solve([0, 0], [0, 0], [0, 0], [0, 0]), 16);
  assert.strictEqual(solve([1], [1], [1], [1]), 0);
  assert.strictEqual(solve([], [], [], []), 0);
  assert.strictEqual(solve([-1, 1], [-1, 1], [-1, 1], [-1, 1]), 6);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1);
for (let t = 0; t < 100; t++) {
  const n = Math.floor(rand() * 7);
  const g = () => Array.from({ length: n }, () => Math.floor(rand() * 9) - 4);
  const [A, B, C, D] = [g(), g(), g(), g()];
  assert.strictEqual(optimal(A, B, C, D), bruteForce(A, B, C, D));
}
console.log('✓ 01_four_sum_ii passed');

module.exports = { optimal, bruteForce };
