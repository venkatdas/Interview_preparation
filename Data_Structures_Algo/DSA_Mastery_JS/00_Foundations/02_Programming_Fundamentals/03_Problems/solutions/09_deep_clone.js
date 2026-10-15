/**
 * 09. Deep Clone with Cycles   (Original — Hard)
 *
 * PROBLEM
 * Write deepClone(value) that returns a fully independent copy of value. It must:
 *   - copy arrays, plain objects, Map, Set and Date (Map keys/values and Set members are cloned too)
 *   - return primitives and functions as-is
 *   - preserve CYCLES (if obj.self === obj, then copy.self === copy)
 *   - preserve SHARED references (if obj.a === obj.b, then copy.a === copy.b, and both differ from obj.a)
 *   - keep values the JSON trick loses: undefined, NaN, Infinity, -0, Dates, Maps, Sets
 * After cloning, mutating the copy at any depth must never affect the original.
 *
 * EXAMPLES
 * Input:  { a: [1, { b: 2 }] }               Output: equal structure, copy.a !== input.a
 * Input:  o = { name: 'x' }; o.self = o       Output: c where c.self === c and c !== o
 * Input:  s = [1]; { p: s, q: s }             Output: c where c.p === c.q and c.p !== s
 * Input:  { d: new Date(0), m: new Map([[1, { z: 1 }]]) }   Output: real Date and Map, inner object copied
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Which types must be supported? (primitives, arrays, plain objects, Map, Set, Date)
 * - Class instances / prototypes? (keep the prototype)
 * - Symbol keys, getters, non-enumerable props? (out of scope: own enumerable string keys)
 * - Can I use structuredClone? (not in the interview; we will use it only as a test oracle)
 *
 * APPROACH 1 — Brute force (JSON round trip)   O(N) time, O(N) space
 * JSON.parse(JSON.stringify(value)). One line, and fine for pure JSON data, but it
 * throws on cycles, turns shared references into separate copies, drops undefined,
 * turns NaN/Infinity into null, Dates into strings, Maps/Sets into {}. It is the
 * baseline we test against on JSON-safe random inputs.
 *
 * APPROACH 2 — Optimal (recursive clone with a WeakMap of visited objects)   O(N) time, O(N) space
 * seen: WeakMap original -> copy.
 *   1. primitive or function -> return it
 *   2. seen.has(value) -> return seen.get(value)   (handles cycles AND sharing)
 *   3. create the empty copy of the right kind, and register seen.set(value, copy)
 *      BEFORE cloning children, so a child that points back finds the copy
 *   4. fill the copy by cloning each child with the same seen map
 * WeakMap (not Map) so the bookkeeping does not keep objects alive after we are done.
 *
 * Dry run o = { name: 'x' }; o.self = o:
 *   clone(o): not seen -> copy = {}, seen {o -> copy}
 *     key name: 'x' primitive -> copy.name = 'x'
 *     key self: clone(o) -> seen has o -> return copy -> copy.self = copy
 *   result copy, copy.self === copy
 *
 * EDGE CASES
 * - cycles through arrays, Maps or Sets (register before recursing in EVERY branch)
 * - -0 and NaN inside arrays (primitives returned as-is: preserved)
 * - Date: copy the time value, do not share the Date object
 * - Object with a custom prototype: Object.create(Object.getPrototypeOf(value))
 *
 * COMMON MISTAKES
 * - Registering in `seen` AFTER cloning children -> infinite recursion on cycles.
 * - Treating Date / Map / Set as plain objects (Object.keys(new Map()) is []).
 * - typeof null === 'object' -> crash on Object.keys(null).
 * - Using JSON for anything with Dates or undefined.
 */

function bruteForce(value) {
  return JSON.parse(JSON.stringify(value));
}

function optimal(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) {
    const d = new Date(value.getTime());
    seen.set(value, d);
    return d;
  }
  if (value instanceof Map) {
    const m = new Map();
    seen.set(value, m);
    for (const [k, v] of value) m.set(optimal(k, seen), optimal(v, seen));
    return m;
  }
  if (value instanceof Set) {
    const s = new Set();
    seen.set(value, s);
    for (const v of value) s.add(optimal(v, seen));
    return s;
  }
  const copy = Array.isArray(value) ? new Array(value.length) : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Object.keys(value)) copy[key] = optimal(value[key], seen);
  return copy;
}

// ---------- tests ----------
const assert = require('assert');

const nested = { a: [1, { b: 2 }] };
const c1 = optimal(nested);
assert.deepStrictEqual(c1, nested);
assert.notStrictEqual(c1.a, nested.a);
c1.a[1].b = 99;
assert.strictEqual(nested.a[1].b, 2, 'original untouched');

const o = { name: 'x' }; o.self = o;
const c2 = optimal(o);
assert.strictEqual(c2.self, c2);
assert.notStrictEqual(c2, o);
assert.throws(() => bruteForce(o), TypeError, 'JSON cannot handle cycles');

const s = [1];
const c3 = optimal({ p: s, q: s });
assert.strictEqual(c3.p, c3.q);
assert.notStrictEqual(c3.p, s);
const j3 = bruteForce({ p: s, q: s });
assert.notStrictEqual(j3.p, j3.q, 'JSON splits shared references');

const rich = { d: new Date(0), m: new Map([[1, { z: 1 }]]), set: new Set([NaN]), u: undefined, inf: Infinity, nz: -0 };
const c4 = optimal(rich);
assert.ok(c4.d instanceof Date && c4.d.getTime() === 0 && c4.d !== rich.d);
assert.ok(c4.m instanceof Map && c4.m.get(1).z === 1 && c4.m.get(1) !== rich.m.get(1));
assert.ok(c4.set.has(NaN));
assert.ok('u' in c4 && c4.u === undefined);
assert.strictEqual(c4.inf, Infinity);
assert.ok(Object.is(c4.nz, -0));

// cycle through a Map
const m = new Map(); m.set('me', m);
const c5 = optimal(m);
assert.strictEqual(c5.get('me'), c5);

// prototype preserved
class Point { constructor(x) { this.x = x; } norm() { return Math.abs(this.x); } }
const c6 = optimal(new Point(-3));
assert.ok(c6 instanceof Point && c6.norm() === 3);

// random JSON-safe values: optimal agrees with the JSON oracle and structuredClone
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(9);
const gen = d => {
  const r = rand();
  if (d === 0 || r < 0.35) return [1, 'x', null, true, 2.5][Math.floor(rand() * 5)];
  if (r < 0.65) return Array.from({ length: Math.floor(rand() * 4) }, () => gen(d - 1));
  const obj = {}; for (let i = 0; i < Math.floor(rand() * 4); i++) obj['k' + i] = gen(d - 1); return obj;
};
for (let t = 0; t < 300; t++) {
  const x = gen(4);
  assert.deepStrictEqual(optimal(x), bruteForce(x));
  assert.deepStrictEqual(optimal(x), structuredClone(x));
}
console.log('✓ 09_deep_clone passed');

module.exports = { optimal, bruteForce };
