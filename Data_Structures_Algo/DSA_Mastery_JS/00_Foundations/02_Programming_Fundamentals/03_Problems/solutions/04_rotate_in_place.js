/**
 * 04. Rotate in Place   (Original — Medium)
 *
 * PROBLEM
 * Rotate an array to the RIGHT by k steps, IN PLACE: the function must modify the
 * array it receives (the caller's variable sees the change) and use O(1) extra space.
 * Return the same array reference. k can be larger than the length, and can be
 * negative (negative k means rotate left by |k|).
 *
 * EXAMPLES
 * Input: [1, 2, 3, 4, 5], k = 2    Output: [4, 5, 1, 2, 3]
 * Input: [1, 2, 3],       k = 4    Output: [3, 1, 2]        (4 % 3 = 1)
 * Input: [1, 2, 3, 4],    k = -1   Output: [2, 3, 4, 1]     (left by 1)
 * Input: [],              k = 3    Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e5, k up to 1e9 -> moving one step at a time k times is far too slow.
 * - Must it be in place? (yes: arr = [...] inside the function does NOT change the caller's array)
 * - What does negative k mean? (rotate left)
 *
 * APPROACH 1 — Brute force   O(n * (k mod n)) time, O(1) space
 * Normalise k, then k times: pop the last element and unshift it to the front.
 * Correct and in place, but each unshift shifts every element.
 *
 * APPROACH 2 — Optimal (triple reverse)   O(n) time, O(1) space
 * Normalise k = ((k % n) + n) % n (handles negative k and k >= n).
 * Rotating right by k moves the last k elements to the front, keeping each block's order.
 *   reverse the whole array        -> last block is now first, but both blocks are backwards
 *   reverse the first k elements   -> fix the first block's order
 *   reverse the remaining n - k    -> fix the second block's order
 *
 * Dry run [1,2,3,4,5], k = 2:
 *   reverse all [0,4]   -> [5,4,3,2,1]
 *   reverse [0,1]       -> [4,5,3,2,1]
 *   reverse [2,4]       -> [4,5,1,2,3]
 *
 * EDGE CASES
 * - n = 0          -> return immediately (k % 0 is NaN!)
 * - k = 0 or k = n -> unchanged
 * - k negative     -> ((k % n) + n) % n, because -1 % 5 is -1 in JS, not 4
 *
 * COMMON MISTAKES
 * - arr = arr.slice(-k).concat(...) inside the function: only rebinds the local name; the caller sees nothing.
 * - Forgetting k % n (reverse ranges go out of bounds).
 * - Trusting % to be non-negative.
 */

function normalise(k, n) {
  return ((k % n) + n) % n;
}

function bruteForce(arr, k) {
  const n = arr.length;
  if (n === 0) return arr;
  k = normalise(k, n);
  for (let step = 0; step < k; step++) arr.unshift(arr.pop());
  return arr;
}

function reverse(arr, lo, hi) {
  // inclusive bounds [lo, hi]; swap ends and walk inward
  while (lo < hi) {
    [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
    lo++; hi--;
  }
}

function optimal(arr, k) {
  const n = arr.length;
  if (n === 0) return arr;
  k = normalise(k, n);
  if (k === 0) return arr;
  reverse(arr, 0, n - 1);
  reverse(arr, 0, k - 1);
  reverse(arr, k, n - 1);
  return arr;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5], 2), [4, 5, 1, 2, 3]);
  assert.deepStrictEqual(solve([1, 2, 3], 4), [3, 1, 2]);
  assert.deepStrictEqual(solve([1, 2, 3, 4], -1), [2, 3, 4, 1]);
  assert.deepStrictEqual(solve([], 3), []);
  assert.deepStrictEqual(solve([9], 100), [9]);
  const mine = [1, 2, 3];
  const ret = solve(mine, 1);
  assert.strictEqual(ret, mine, 'same reference returned');
  assert.deepStrictEqual(mine, [3, 1, 2], 'caller sees the change');
}
// the "rebinding is not mutation" bug
function wrongRotate(arr, k) { arr = arr.slice(-k).concat(arr.slice(0, -k)); return arr; }
const caller = [1, 2, 3];
wrongRotate(caller, 1);
assert.deepStrictEqual(caller, [1, 2, 3], 'rebinding a parameter does not change the caller');

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(4);
for (let t = 0; t < 400; t++) {
  const n = Math.floor(rand() * 12), k = Math.floor(rand() * 40) - 20;
  const base = Array.from({ length: n }, () => Math.floor(rand() * 10));
  assert.deepStrictEqual(optimal([...base], k), bruteForce([...base], k));
}
console.log('✓ 04_rotate_in_place passed');

module.exports = { optimal, bruteForce };
