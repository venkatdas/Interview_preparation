/**
 * 07. Insert Delete GetRandom O(1)   (LeetCode 380 — Medium)
 *
 * PROBLEM
 * Design a set of integers with three operations, each in average O(1) time:
 *   - insert(val): add val if absent; return true if it was added
 *   - remove(val): delete val if present; return true if it was removed
 *   - getRandom(): return a uniformly random element (set is non-empty when called)
 *
 * EXAMPLES
 * insert(1) -> true, remove(2) -> false, insert(2) -> true,
 * getRandom() -> 1 or 2 (each 1/2), remove(1) -> true, insert(2) -> false,
 * getRandom() -> 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates allowed? (no — that is LeetCode 381, a harder follow-up)
 * - Is getRandom ever called on an empty set? (no; we return undefined)
 *
 * APPROACH 1 — Brute force (Set + copy to array)   insert/remove O(1), getRandom O(n)
 * A JS Set gives O(1) insert/remove/has, but has no index access, so getRandom
 * must copy (or iterate) to a random position: O(n).
 *
 * APPROACH 2 — Optimal (array + Map value->index, swap-remove)   O(1) average for all, O(n) space
 * The array gives O(1) random access for getRandom. The Map gives O(1) lookup of
 * where a value lives. To remove from the middle of an array in O(1), MOVE the last
 * element into the hole, update its index in the Map, then pop.
 *
 * Dry run:
 *   insert 10, 20, 30  -> arr [10,20,30], idx {10:0, 20:1, 30:2}
 *   remove 10: hole at 0, last = 30 -> arr[0] = 30, idx[30] = 0, pop
 *              arr [30,20], idx {20:1, 30:0}
 *   getRandom: arr[floor(rng * 2)]
 *
 * EDGE CASES
 * - removing the LAST element: "move last into hole" moves it onto itself; delete AFTER updating
 * - removing an absent value -> false, no changes
 * - inserting an existing value -> false
 */
const { mulberry32, looksUniform } = require('../../02_Implementations/randomization');

class NaiveRandomizedSet {
  constructor(rng = Math.random) {
    this.set = new Set();
    this.rng = rng;
  }
  insert(val) {
    if (this.set.has(val)) return false;
    this.set.add(val);
    return true;
  }
  remove(val) {
    return this.set.delete(val);
  }
  getRandom() {
    const all = Array.from(this.set); // O(n)
    return all[Math.floor(this.rng() * all.length)];
  }
}

class RandomizedSet {
  constructor(rng = Math.random) {
    this.values = [];
    this.indexOf = new Map();
    this.rng = rng;
  }
  insert(val) {
    if (this.indexOf.has(val)) return false;
    this.indexOf.set(val, this.values.length);
    this.values.push(val);
    return true;
  }
  remove(val) {
    if (!this.indexOf.has(val)) return false;
    const hole = this.indexOf.get(val);
    const last = this.values[this.values.length - 1];
    this.values[hole] = last;         // move last element into the hole
    this.indexOf.set(last, hole);     // ...and record its new position
    this.values.pop();
    this.indexOf.delete(val);         // delete AFTER the set above (val may equal last)
    return true;
  }
  getRandom() {
    if (this.values.length === 0) return undefined;
    return this.values[Math.floor(this.rng() * this.values.length)];
  }
  size() {
    return this.values.length;
  }
}

// function-style wrappers: run a list of operations and return the outputs
function run(Cls, ops, args, rng) {
  const s = new Cls(rng);
  return ops.map((op, i) => s[op](...args[i]));
}
const bruteForce = (ops, args, rng) => run(NaiveRandomizedSet, ops, args, rng);
const optimal = (ops, args, rng) => run(RandomizedSet, ops, args, rng);

// ---------- tests ----------
const assert = require('assert');
const rng = mulberry32(380);
for (const Cls of [NaiveRandomizedSet, RandomizedSet]) {
  const s = new Cls(rng);
  assert.strictEqual(s.insert(1), true);
  assert.strictEqual(s.remove(2), false);
  assert.strictEqual(s.insert(2), true);
  assert.ok([1, 2].includes(s.getRandom()));
  assert.strictEqual(s.remove(1), true);
  assert.strictEqual(s.insert(2), false);
  assert.strictEqual(s.getRandom(), 2);
  assert.strictEqual(s.remove(2), true); // removing the only (= last) element
  assert.strictEqual(s.getRandom(), undefined);

  const u = new Cls(rng);
  [5, 6, 7, 8].forEach((v) => u.insert(v));
  u.remove(6);
  const counts = new Map();
  for (let t = 0; t < 30000; t++) {
    const v = u.getRandom();
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  assert.deepStrictEqual([...counts.keys()].sort(), [5, 7, 8]);
  assert.ok(looksUniform([...counts.values()]));
}

// randomized: same operation sequence -> same insert/remove answers and same contents
for (let t = 0; t < 200; t++) {
  const a = new RandomizedSet(rng);
  const b = new NaiveRandomizedSet(rng);
  for (let k = 0; k < 60; k++) {
    const v = Math.floor(rng() * 10) - 3;
    if (rng() < 0.55) assert.strictEqual(a.insert(v), b.insert(v));
    else assert.strictEqual(a.remove(v), b.remove(v));
    if (a.size() > 0) assert.ok(b.set.has(a.getRandom()));
  }
  assert.deepStrictEqual(a.values.slice().sort((x, y) => x - y), [...b.set].sort((x, y) => x - y));
}
console.log('✓ 07_insert_delete_getrandom passed');

module.exports = { RandomizedSet, NaiveRandomizedSet, optimal, bruteForce };
