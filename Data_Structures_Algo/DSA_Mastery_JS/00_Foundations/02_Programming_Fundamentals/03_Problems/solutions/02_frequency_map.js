/**
 * 02. Frequency Map   (Original — Easy)
 *
 * PROBLEM
 * Given an array of primitive values (numbers, strings, booleans, null, undefined),
 * return an array of [value, count] pairs, one per distinct value, in the order each
 * value first appears. Two values count as the same when they are SameValueZero equal:
 * NaN matches NaN, and 0 matches -0. The number 1 and the string '1' are different.
 *
 * EXAMPLES
 * Input:  ['a', 'b', 'a', 'c', 'b', 'a']   Output: [['a', 3], ['b', 2], ['c', 1]]
 * Input:  [1, '1', 1]                      Output: [[1, 2], ['1', 1]]
 * Input:  [NaN, 0, NaN, -0]                Output: [[NaN, 2], [0, 2]]
 * Input:  []                               Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 1e5 values -> O(n^2) is too slow in the worst case.
 * - Is order required? (yes: first appearance)
 * - Should 1 and '1' merge? (no)  Should NaN merge with NaN? (yes)
 *
 * APPROACH 1 — Brute force   O(n * d) time (d = distinct values), O(d) space
 * Keep a list of [value, count] pairs. For each element, scan the list with a
 * SameValueZero comparison (=== alone would never match NaN). Increment or append.
 *
 * APPROACH 2 — Optimal (Map)   O(n) time, O(d) space
 * A Map already uses SameValueZero for keys AND remembers insertion order, so
 * map.set(x, (map.get(x) ?? 0) + 1) does everything. Return [...map] (entries).
 * A plain object would be wrong: its keys are strings, so 1 and '1' would merge
 * and NaN would become the key 'NaN' (which also matches the string 'NaN').
 *
 * Dry run on ['a','b','a']:
 *   'a' -> Map{a:1}
 *   'b' -> Map{a:1, b:1}
 *   'a' -> Map{a:2, b:1}
 *   result [['a',2],['b',1]]
 *
 * EDGE CASES
 * - empty array          -> []
 * - NaN values           -> merged into one entry
 * - -0 then 0            -> one entry, key is the FIRST one seen (Map normalises -0 to +0)
 * - undefined and null   -> two different keys
 *
 * COMMON MISTAKES
 * - Using an object {} as the counter (string keys merge 1 and '1').
 * - Using indexOf to find the existing entry (indexOf uses ===, never finds NaN).
 * - Writing map.get(x) + 1 for a new key (undefined + 1 is NaN).
 */

const sameValueZero = (a, b) => a === b || (a !== a && b !== b);

function bruteForce(values) {
  const pairs = [];
  for (const v of values) {
    let found = false;
    for (const p of pairs) {
      if (sameValueZero(p[0], v)) { p[1]++; found = true; break; }
    }
    if (!found) pairs.push([v === 0 ? 0 : v, 1]); // normalise -0 like Map does
  }
  return pairs;
}

function optimal(values) {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(['a', 'b', 'a', 'c', 'b', 'a']), [['a', 3], ['b', 2], ['c', 1]]);
  assert.deepStrictEqual(solve([1, '1', 1]), [[1, 2], ['1', 1]]);
  assert.deepStrictEqual(solve([NaN, 0, NaN, -0]), [[NaN, 2], [0, 2]]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([null, undefined, null]), [[null, 2], [undefined, 1]]);
  assert.deepStrictEqual(solve(['NaN', NaN]), [['NaN', 1], [NaN, 1]]);
}
// the object-counter bug, demonstrated
const objCount = {};
for (const v of [1, '1']) objCount[v] = (objCount[v] || 0) + 1;
assert.strictEqual(objCount['1'], 2, 'plain objects merge 1 and "1"');

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(2);
const pool = [0, -0, 1, '1', NaN, 'a', null, undefined, true, 'true'];
for (let t = 0; t < 300; t++) {
  const arr = Array.from({ length: Math.floor(rand() * 30) }, () => pool[Math.floor(rand() * pool.length)]);
  assert.deepStrictEqual(optimal(arr), bruteForce(arr));
}
console.log('✓ 02_frequency_map passed');

module.exports = { optimal, bruteForce };
