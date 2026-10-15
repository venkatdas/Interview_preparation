/**
 * 03. Reverse an Array Recursively   (Original — Easy)
 *
 * PROBLEM
 * Reverse an array IN PLACE using recursion (no loops, no built-in reverse).
 * Return the same array. Also write the version that returns a NEW reversed array
 * without touching the input, and compare their costs.
 *
 * EXAMPLES
 * Input: [1, 2, 3, 4, 5]   Output: [5, 4, 3, 2, 1]
 * Input: [1, 2]            Output: [2, 1]
 * Input: [7]               Output: [7]
 * Input: []                Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 2000 -> in-place recursion depth is n/2 = 1000, safe. (Measured: 10,000 elements
 *   already overflowed in one Node run, because frames with destructuring swaps are bigger
 *   than the tiny frames used to measure the ~10k limit. Frame size matters!)
 * - In place or new array? (in place for the optimal version)
 *
 * APPROACH 1 — Brute force (head + recurse on the rest, building new arrays)   O(n^2) time
 * reversed(arr) = arr.length === 0 ? [] : [...reversed(arr.slice(1)), arr[0]].
 * Every level copies the rest of the array (slice) and the result (spread) -> quadratic,
 * and depth is n (not n/2).
 *
 * APPROACH 2 — Optimal (swap the ends, recurse inward)   O(n) time, O(n) stack (n/2 frames)
 * rev(lo, hi): if lo >= hi stop; swap arr[lo], arr[hi]; rev(lo + 1, hi - 1).
 * This is the two-pointer loop written as recursion.
 *
 * Dry run [1,2,3,4,5]:
 *   rev(0,4) swap -> [5,2,3,4,1]
 *   rev(1,3) swap -> [5,4,3,2,1]
 *   rev(2,2) lo >= hi stop
 *
 * EDGE CASES
 * - empty and single element: base case immediately
 * - even length: lo and hi cross (lo > hi) rather than meet
 *
 * COMMON MISTAKES
 * - Base case lo === hi (misses the crossing case on even lengths -> swaps back).
 * - Creating new arrays per call and calling it "in place".
 */

function bruteForce(arr) {
  if (arr.length === 0) return [];
  return [...bruteForce(arr.slice(1)), arr[0]];
}

function optimal(arr) {
  function rev(lo, hi) {
    if (lo >= hi) return;
    [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
    rev(lo + 1, hi - 1);
  }
  rev(0, arr.length - 1);
  return arr;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5]), [5, 4, 3, 2, 1]);
  assert.deepStrictEqual(solve([1, 2]), [2, 1]);
  assert.deepStrictEqual(solve([7]), [7]);
  assert.deepStrictEqual(solve([]), []);
}
const mine = [1, 2, 3];
assert.strictEqual(optimal(mine), mine, 'in place returns same reference');
const src = [1, 2, 3];
bruteForce(src);
assert.deepStrictEqual(src, [1, 2, 3], 'brute force does not mutate');
// in-place handles 2000 elements (1000 frames)
const big = Array.from({ length: 2000 }, (_, i) => i);
optimal(big);
assert.strictEqual(big[0], 1999);
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(23);
for (let t = 0; t < 300; t++) {
  const a = Array.from({ length: Math.floor(rand() * 30) }, () => Math.floor(rand() * 10));
  assert.deepStrictEqual(optimal([...a]), bruteForce(a));
  assert.deepStrictEqual(optimal([...a]), [...a].reverse());
}
console.log('✓ 03_reverse_array_recursive passed');

module.exports = { optimal, bruteForce };
