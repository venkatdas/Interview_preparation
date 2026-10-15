/**
 * 06. Deep Equal   (Original — Medium)
 *
 * PROBLEM
 * Write deepEqual(a, b) that returns true when a and b have the same structure and
 * values. Rules:
 *   - primitives: equal if SameValueZero equal (NaN equals NaN, 0 equals -0, 1 !== '1')
 *   - arrays: same length and equal elements in the same order
 *   - plain objects: same set of own keys (order does NOT matter) and equal values;
 *     { a: undefined } is NOT equal to {} (the key is missing on one side)
 *   - an array is never equal to an object
 * Inputs contain only primitives, arrays and plain objects (no cycles).
 *
 * EXAMPLES
 * Input: { a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }  Output: true
 * Input: { x: 1, y: 2 }, { y: 2, x: 1 }              Output: true   (key order ignored)
 * Input: [1, 2], { 0: 1, 1: 2 }                      Output: false
 * Input: { a: undefined }, {}                         Output: false
 * Input: NaN, NaN                                     Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can there be cycles? (not in this version; see the implementation file for a cycle-safe one)
 * - Should key order matter? (no)
 * - How should NaN and -0 compare? (SameValueZero)
 *
 * APPROACH 1 — Brute force (canonical serialisation)   O(N log N) time, O(N) space
 * Convert each value to a canonical string: objects with SORTED keys, arrays in
 * order, and primitives tagged with their type (so 1 and '1' differ and NaN, undefined
 * survive, which JSON.stringify would lose). Compare the two strings.
 * Correct for this input domain, but it always builds two full strings, even when
 * the first element already differs.
 *
 * APPROACH 2 — Optimal (parallel recursive walk)   O(N) time, O(depth) space
 * Walk both values together and return false at the FIRST difference:
 *   1. SameValueZero equal -> true
 *   2. either is not an object (or is null) -> false
 *   3. Array.isArray differs -> false
 *   4. arrays: compare lengths, then each index
 *   5. objects: compare key counts, check every key of a exists in b (hasOwnProperty), recurse
 *
 * Dry run {x:[1,2]} vs {x:[1,3]}:
 *   objects, 1 key each, 'x' in both -> recurse [1,2] vs [1,3]
 *   arrays length 2 = 2 -> 1 vs 1 ok -> 2 vs 3 differ -> false (stop)
 *
 * EDGE CASES
 * - null vs {}            -> false (typeof null === 'object' trap)
 * - undefined-valued key vs missing key -> false
 * - [] vs {}              -> false
 * - sparse vs undefined   -> out of scope (inputs are dense)
 *
 * COMMON MISTAKES
 * - JSON.stringify(a) === JSON.stringify(b): key order matters, undefined disappears, NaN becomes null.
 * - Checking only a's keys exist in b (b may have extra keys) -> compare counts too.
 * - Using === for primitives (NaN fails).
 */

function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v !== null && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  if (typeof v === 'number') return 'n:' + (v === 0 ? '0' : String(v)); // -0 -> 0, NaN -> 'NaN'
  if (typeof v === 'string') return 's:' + JSON.stringify(v);
  return typeof v + ':' + String(v); // boolean, undefined, null(object:null)
}

function bruteForce(a, b) {
  return canon(a) === canon(b);
}

function optimal(a, b) {
  if (a === b || (a !== a && b !== b)) return true; // SameValueZero
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!optimal(a[i], b[i])) return false;
    return true;
  }
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  for (const k of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    if (!optimal(a[k], b[k])) return false;
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }), true);
  assert.strictEqual(solve({ x: 1, y: 2 }, { y: 2, x: 1 }), true);
  assert.strictEqual(solve([1, 2], { 0: 1, 1: 2 }), false);
  assert.strictEqual(solve({ a: undefined }, {}), false);
  assert.strictEqual(solve(NaN, NaN), true);
  assert.strictEqual(solve(0, -0), true);
  assert.strictEqual(solve(1, '1'), false);
  assert.strictEqual(solve(null, {}), false);
  assert.strictEqual(solve([], {}), false);
}
// why the JSON trick is not enough
assert.notStrictEqual(JSON.stringify({ x: 1, y: 2 }), JSON.stringify({ y: 2, x: 1 }));
assert.strictEqual(JSON.stringify({ a: undefined }), JSON.stringify({}));

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(6);
const prims = [0, -0, 1, '1', NaN, null, undefined, true, 'a'];
const gen = d => {
  const r = rand();
  if (d === 0 || r < 0.4) return prims[Math.floor(rand() * prims.length)];
  if (r < 0.7) return Array.from({ length: Math.floor(rand() * 3) }, () => gen(d - 1));
  const o = {}; for (let i = 0; i < Math.floor(rand() * 3); i++) o['k' + Math.floor(rand() * 3)] = gen(d - 1); return o;
};
let equalSeen = 0;
for (let t = 0; t < 2000; t++) {
  const a = gen(3), b = rand() < 0.3 ? structuredClone(a) : gen(3);
  const expected = bruteForce(a, b);
  assert.strictEqual(optimal(a, b), expected);
  if (expected) equalSeen++;
}
assert.ok(equalSeen > 100, 'random test exercised the "equal" branch');
console.log('✓ 06_deep_equal passed');

module.exports = { optimal, bruteForce };
