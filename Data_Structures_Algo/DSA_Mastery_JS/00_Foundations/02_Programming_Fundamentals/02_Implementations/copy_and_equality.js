/**
 * Copying and comparing values in JavaScript — the semantics every DSA solution relies on.
 *
 * 1. sameValueZero(a, b)  - the equality Map/Set/includes use (NaN equals NaN, +0 equals -0)
 * 2. shallowCopy(x)       - new outer container, children shared
 * 3. copyGrid(grid)       - the copy you actually need for 2D DP / BFS grids
 * 4. jsonClone(x)         - the JSON trick, and what it silently breaks
 * 5. deepClone(x)         - handles cycles, shared references, Map, Set, Date, arrays, objects
 * 6. deepEqual(a, b)      - structural equality for arrays, plain objects, Map, Set, Date
 * 7. keyOf(arr)           - turn an array into a string so it can be a Map/Set key
 */

// ---------- 1. SameValueZero ----------
// WHY: === says NaN !== NaN, which makes "find NaN" impossible. Map/Set fix that,
// but still treat +0 and -0 as the same key.
function sameValueZero(a, b) {
  return a === b || (a !== a && b !== b); // only NaN is not equal to itself
}

// ---------- 2. Shallow copy ----------
function shallowCopy(x) {
  if (Array.isArray(x)) return [...x];
  if (x instanceof Map) return new Map(x);
  if (x instanceof Set) return new Set(x);
  if (x !== null && typeof x === 'object') return { ...x };
  return x; // primitives are values already
}

// ---------- 3. Copy a 2D grid ----------
// WHY: [...grid] copies only the outer array; the rows are still shared.
function copyGrid(grid) {
  return grid.map(row => [...row]);
}

// ---------- 4. JSON clone (know its limits) ----------
function jsonClone(x) {
  return JSON.parse(JSON.stringify(x));
}

// ---------- 5. Deep clone ----------
// `seen` maps original object -> its copy. It solves two problems at once:
//   - cycles (a.self = a) would otherwise recurse forever
//   - shared references (two keys pointing at one object) stay shared in the copy
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value; // primitives + functions
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy); // register BEFORE recursing, or cycles loop forever
    for (const [k, v] of value) copy.set(deepClone(k, seen), deepClone(v, seen));
    return copy;
  }
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    for (const v of value) copy.add(deepClone(v, seen));
    return copy;
  }

  const copy = Array.isArray(value) ? new Array(value.length) : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) {
    if (Array.isArray(value) && key === 'length') continue;
    copy[key] = deepClone(value[key], seen);
  }
  return copy;
}

// ---------- 6. Deep equality ----------
// Primitives compare with SameValueZero (NaN equals NaN). Containers compare by structure.
function deepEqual(a, b, seen = new Map()) {
  if (sameValueZero(a, b)) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  // cycle guard: if we are already comparing a with b higher up, assume equal here
  if (seen.get(a) === b) return true;
  seen.set(a, b);

  if (a instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a) if (!b.has(k) || !deepEqual(v, b.get(k), seen)) return false;
    return true;
  }
  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false; // primitives / same references
    return true;
  }
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    if (!deepEqual(a[k], b[k], seen)) return false;
  }
  return true;
}

// ---------- 7. Array -> key ----------
// WHY: new Set([[1, 2], [1, 2]]).size === 2 because arrays compare by reference.
function keyOf(arr) {
  return arr.join(',');
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  // equality table
  assert.strictEqual(NaN === NaN, false);
  assert.strictEqual(sameValueZero(NaN, NaN), true);
  assert.strictEqual(sameValueZero(0, -0), true);
  assert.strictEqual(Object.is(0, -0), false);
  assert.strictEqual([1, 2] === [1, 2], false);
  assert.strictEqual([NaN].indexOf(NaN), -1);
  assert.strictEqual([NaN].includes(NaN), true);

  // aliasing vs copying
  const grid = [[0, 0], [0, 0]];
  const shallow = shallowCopy(grid);
  shallow[0][0] = 7;
  assert.strictEqual(grid[0][0], 7, 'shallow copy shares rows');
  const deepRows = copyGrid(grid);
  deepRows[0][0] = 9;
  assert.strictEqual(grid[0][0], 7, 'copyGrid copies rows');

  // the fill() trap
  const bad = new Array(3).fill([]);
  bad[0].push(1);
  assert.deepStrictEqual(bad, [[1], [1], [1]]);
  const good = Array.from({ length: 3 }, () => []);
  good[0].push(1);
  assert.deepStrictEqual(good, [[1], [], []]);

  // JSON clone limits
  const src = { d: new Date(0), n: NaN, u: undefined, m: new Map([[1, 2]]), inf: Infinity };
  const j = jsonClone(src);
  assert.strictEqual(typeof j.d, 'string');
  assert.strictEqual(j.n, null);
  assert.strictEqual('u' in j, false);
  assert.deepStrictEqual(j.m, {});
  assert.strictEqual(j.inf, null);
  const cyc = { name: 'a' }; cyc.self = cyc;
  assert.throws(() => jsonClone(cyc), TypeError);

  // structuredClone handles cycles and Maps
  const sc = structuredClone(cyc);
  assert.strictEqual(sc.self, sc);
  assert.notStrictEqual(sc, cyc);

  // deepClone
  const shared = [1, 2];
  const obj = { a: shared, b: shared, d: new Date(5), s: new Set([1, NaN]), m: new Map([['k', { x: 1 }]]) };
  obj.me = obj;
  const c = deepClone(obj);
  assert.notStrictEqual(c, obj);
  assert.strictEqual(c.me, c, 'cycle preserved');
  assert.strictEqual(c.a, c.b, 'shared reference preserved');
  assert.notStrictEqual(c.a, shared);
  assert.strictEqual(c.d.getTime(), 5);
  assert.ok(c.s.has(NaN));
  assert.notStrictEqual(c.m.get('k'), obj.m.get('k'));
  assert.ok(deepEqual(c, obj));

  // deepEqual
  assert.ok(deepEqual({ a: [1, { b: NaN }] }, { a: [1, { b: NaN }] }));
  assert.ok(!deepEqual({ a: 1 }, { a: 1, b: undefined }));
  assert.ok(!deepEqual([1, 2], { 0: 1, 1: 2 }));
  assert.ok(deepEqual(new Map([[1, [2]]]), new Map([[1, [2]]])));

  // random: deepClone(x) is always deepEqual to x and never shares containers
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const gen = d => {
    const r = rnd();
    if (d === 0 || r < 0.3) return [1, 'x', NaN, -0, null, true][Math.floor(rnd() * 6)];
    if (r < 0.65) return Array.from({ length: Math.floor(rnd() * 4) }, () => gen(d - 1));
    const o = {}; for (let i = 0; i < Math.floor(rnd() * 4); i++) o['k' + i] = gen(d - 1); return o;
  };
  for (let t = 0; t < 300; t++) {
    const x = gen(4);
    const y = deepClone(x);
    assert.ok(deepEqual(x, y));
    if (x !== null && typeof x === 'object') assert.notStrictEqual(x, y);
  }

  // keyOf
  const set = new Set([[1, 2], [1, 2]].map(keyOf));
  assert.strictEqual(set.size, 1);

  console.log('✓ copy_and_equality.js self-test passed');
}

module.exports = { sameValueZero, shallowCopy, copyGrid, jsonClone, deepClone, deepEqual, keyOf };
