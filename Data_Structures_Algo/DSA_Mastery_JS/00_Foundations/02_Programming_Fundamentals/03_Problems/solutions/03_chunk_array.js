/**
 * 03. Chunk an Array   (Original — Easy)
 *
 * PROBLEM
 * Given an array and a positive integer size, split the array into consecutive
 * groups of `size` elements. The last group holds whatever is left (it may be
 * shorter). Do not modify the input array.
 *
 * EXAMPLES
 * Input: [1, 2, 3, 4, 5], size = 2   Output: [[1, 2], [3, 4], [5]]
 * Input: [1, 2, 3, 4],    size = 2   Output: [[1, 2], [3, 4]]       (no empty last chunk!)
 * Input: [1, 2],          size = 5   Output: [[1, 2]]
 * Input: [],              size = 3   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - size < 1 or not an integer? (throw a RangeError)
 * - May I mutate the input (e.g. splice)? (no)
 * - Should chunks be copies or views? (copies, new arrays)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Walk element by element. Keep a "current" chunk; push each element into it, and
 * when it reaches `size`, push it into the result and start a new one. After the
 * loop, push the leftover chunk ONLY if it is non-empty.
 *
 * APPROACH 2 — Optimal (step loop + slice)   O(n) time, O(n) space
 * Step the start index by size: for (let i = 0; i < n; i += size) out.push(arr.slice(i, i + size)).
 * slice clamps its end to n, so the last partial chunk needs no special case,
 * and the loop condition i < n guarantees no empty chunk is produced.
 * Number of chunks = ceil(n / size).
 *
 * Dry run [1,2,3,4,5], size 2:
 *   i=0 -> slice(0,2) [1,2]
 *   i=2 -> slice(2,4) [3,4]
 *   i=4 -> slice(4,6) [5]      (end clamped to 5)
 *   i=6 -> 6 < 5 false, stop
 *
 * EDGE CASES
 * - n divisible by size   -> no trailing empty chunk
 * - size > n              -> a single chunk with everything
 * - empty array           -> []
 * - size 0 / negative / 1.5 -> RangeError (size 0 would loop forever!)
 *
 * COMMON MISTAKES
 * - i <= n in the loop condition -> extra empty chunk when n % size === 0.
 * - Using splice on the input (mutates the caller's data).
 * - Not validating size: i += 0 is an infinite loop.
 */

function validate(size) {
  if (!Number.isInteger(size) || size < 1) throw new RangeError('size must be a positive integer');
}

function bruteForce(arr, size) {
  validate(size);
  const out = [];
  let cur = [];
  for (const x of arr) {
    cur.push(x);
    if (cur.length === size) { out.push(cur); cur = []; }
  }
  if (cur.length > 0) out.push(cur);
  return out;
}

function optimal(arr, size) {
  validate(size);
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.deepStrictEqual(solve([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
  assert.deepStrictEqual(solve([1, 2], 5), [[1, 2]]);
  assert.deepStrictEqual(solve([], 3), []);
  assert.deepStrictEqual(solve([7], 1), [[7]]);
  assert.throws(() => solve([1], 0), RangeError);
  assert.throws(() => solve([1], 1.5), RangeError);
  const input = [1, 2, 3];
  solve(input, 2);
  assert.deepStrictEqual(input, [1, 2, 3], 'input not mutated');
}
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(3);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 25), size = 1 + Math.floor(rand() * 8);
  const arr = Array.from({ length: n }, (_, i) => i);
  const got = optimal(arr, size);
  assert.deepStrictEqual(got, bruteForce(arr, size));
  assert.strictEqual(got.length, Math.ceil(n / size));
  assert.deepStrictEqual(got.flat(), arr);
}
console.log('✓ 03_chunk_array passed');

module.exports = { optimal, bruteForce };
