/**
 * 06. Divide in Two, Linear Merge   (Original — Medium)
 *
 * PROBLEM
 * Below is merge sort with a counter of ELEMENT WRITES during merging. Write the
 * recurrence for the number of writes W(n), solve it with the master theorem, and
 * find an exact closed form that works for every n (not only powers of two).
 * Also state the space complexity.
 *
 *   function sort(a) {
 *     if (a.length <= 1) return a;
 *     const mid = a.length >> 1;
 *     const L = sort(a.slice(0, mid)), R = sort(a.slice(mid));
 *     const out = []; let i = 0, j = 0;
 *     while (i < L.length || j < R.length) {       // each iteration writes one element
 *       writes++;
 *       if (j >= R.length || (i < L.length && L[i] <= R[j])) out.push(L[i++]); else out.push(R[j++]);
 *     }
 *     return out;
 *   }
 *
 * EXAMPLES
 * n = 1 -> 0 writes   n = 2 -> 2   n = 3 -> 5   n = 4 -> 8   n = 5 -> 12   n = 1024 -> 10240
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Count only merge writes (slices also copy n elements per level: same order, ignore them here).
 *
 * APPROACH 1 — Brute force (run merge sort and count)   Θ(n log n)
 * Run the code above and return the counter (and check the array is sorted).
 *
 * APPROACH 2 — Optimal (recurrence + closed form)   O(1)
 * Recurrence: W(n) = W(floor(n/2)) + W(ceil(n/2)) + n, W(1) = 0.
 * Master theorem: a = 2, b = 2, d = 1, log_2 2 = 1 = d -> case 2 -> Θ(n log n).
 * Recursion tree: every level writes n elements; there are ceil(log2 n) levels.
 * Exact for all n (let L = ceil(log2 n)):   W(n) = n·L - 2^L + n
 * Power of two n = 2^k: W = n·k - n + n = n·k = n log2 n.
 * Space: Θ(n) for the arrays alive at once (out + slices along one root-to-leaf path sum to ≤ 2n)
 * plus Θ(log n) recursion depth.
 *
 * EMPIRICAL CHECK
 * W(2n) / W(n) = 2(k+1)/k for n = 2^k -> 2.2 at n = 1024: "slightly more than 2" = n log n.
 *
 * EDGE CASES
 * - n = 0 or 1 -> 0 writes
 * - odd n: halves differ by one; the closed form still holds exactly
 *
 * COMMON MISTAKES
 * - Answering Θ(n) because "each level is linear" (forgetting the number of levels).
 * - Answering Θ(n log n) SPACE (arrays from finished calls are garbage, not alive simultaneously).
 */
const { masterTheorem, mulberry32 } = require('../../02_Implementations/growth');

function mergeSortCounting(a) {
  let writes = 0;
  function sort(arr) {
    if (arr.length <= 1) return arr;
    const mid = arr.length >> 1;
    const L = sort(arr.slice(0, mid)), R = sort(arr.slice(mid));
    const out = [];
    let i = 0, j = 0;
    while (i < L.length || j < R.length) {
      writes++;
      if (j >= R.length || (i < L.length && L[i] <= R[j])) out.push(L[i++]);
      else out.push(R[j++]);
    }
    return out;
  }
  return { sorted: sort(a), writes };
}

function bruteForce(n) {
  return mergeSortCounting(Array.from({ length: n }, (_, i) => (i * 7919) % (n + 3))).writes;
}

function optimal(n) {
  if (n <= 1) return 0;
  const L = Math.ceil(Math.log2(n) - 1e-12); // exact for integers n >= 2 at this size
  return n * L - 2 ** L + n;
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, w] of [[0, 0], [1, 0], [2, 2], [3, 5], [4, 8], [5, 12], [1024, 10240]]) {
  assert.strictEqual(bruteForce(n), w, `brute ${n}`);
  assert.strictEqual(optimal(n), w, `optimal ${n}`);
}
for (let n = 0; n <= 2000; n++) assert.strictEqual(optimal(n), bruteForce(n), `n=${n}`);
assert.strictEqual(masterTheorem(2, 2, 1).bound, 'Theta(n log n)');
assert.ok(Math.abs(bruteForce(2048) / bruteForce(1024) - 2.2) < 1e-9);
const rand = mulberry32(406);
for (let t = 0; t < 100; t++) {
  const a = Array.from({ length: Math.floor(rand() * 200) }, () => Math.floor(rand() * 50));
  const { sorted, writes } = mergeSortCounting(a);
  assert.deepStrictEqual(sorted, [...a].sort((x, y) => x - y));
  assert.strictEqual(writes, optimal(a.length));
}
console.log('✓ 06_divide_two_linear_merge passed');

module.exports = { optimal, bruteForce, mergeSortCounting };
