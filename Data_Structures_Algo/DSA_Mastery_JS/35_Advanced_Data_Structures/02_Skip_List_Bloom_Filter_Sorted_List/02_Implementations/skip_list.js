/**
 * Skip List in JavaScript: a sorted linked list with "express lanes".
 *
 * A plain sorted linked list needs O(n) to search. A skip list stacks extra lists on top:
 * level 0 contains every node; each node is also lifted to level 1 with probability 1/2,
 * to level 2 with probability 1/4, and so on. Higher levels skip over many nodes, so a
 * search drops down level by level like a binary search: expected O(log n).
 *
 *   level 2:  HEAD ----------------------> 30 --------------------------> NULL
 *   level 1:  HEAD --------> 10 ---------> 30 ---------> 50 ------------> NULL
 *   level 0:  HEAD -> 5 ---> 10 -> 20 ---> 30 -> 40 ---> 50 -> 60 ------> NULL
 *
 * search(40): start at HEAD, top level. Move right while next < 40, else drop down.
 *   level 2: next is 30 < 40 -> move to 30; next is NULL -> drop
 *   level 1: at 30, next is 50 >= 40 -> drop
 *   level 0: at 30, next is 40 == 40 -> found
 *
 * insert(x): walk the same path, remembering the last node visited on EVERY level
 * (the "update" array); pick a random level for the new node; splice it in after
 * update[level] on each level up to that height.
 * delete(x): same walk; unlink on every level where update[level].next is the node.
 *
 * Redis sorted sets, LevelDB memtables and Java's ConcurrentSkipListMap use skip lists.
 */

class SkipNode {
  constructor(value, level) {
    this.value = value;
    this.next = new Array(level + 1).fill(null);   // next[i] = next node on level i
  }
}

class SkipList {
  constructor({ maxLevel = 16, probability = 0.5 } = {}) {
    this.maxLevel = maxLevel;
    this.probability = probability;
    this.head = new SkipNode(null, maxLevel);
    this.level = 0;          // highest level currently in use
    this.size = 0;
  }

  #randomLevel() {
    let level = 0;
    while (Math.random() < this.probability && level < this.maxLevel) level++;
    return level;
  }

  // returns the last node with value < target on every level
  #findPredecessors(target) {
    const update = new Array(this.maxLevel + 1);
    let node = this.head;
    for (let i = this.level; i >= 0; i--) {
      while (node.next[i] !== null && node.next[i].value < target) node = node.next[i];
      update[i] = node;
    }
    return update;
  }

  search(target) {
    const update = this.#findPredecessors(target);
    const candidate = update[0].next[0];
    return candidate !== null && candidate.value === target;
  }

  insert(value) {
    const update = this.#findPredecessors(value);
    const level = this.#randomLevel();
    if (level > this.level) {
      for (let i = this.level + 1; i <= level; i++) update[i] = this.head;
      this.level = level;
    }
    const node = new SkipNode(value, level);
    for (let i = 0; i <= level; i++) {
      node.next[i] = update[i].next[i];
      update[i].next[i] = node;
    }
    this.size++;
  }

  // removes one occurrence; returns true if something was removed
  delete(value) {
    const update = this.#findPredecessors(value);
    const node = update[0].next[0];
    if (node === null || node.value !== value) return false;
    for (let i = 0; i <= this.level; i++) {
      if (update[i].next[i] !== node) break;      // node is not present above this level
      update[i].next[i] = node.next[i];
    }
    while (this.level > 0 && this.head.next[this.level] === null) this.level--;
    this.size--;
    return true;
  }

  toArray() {
    const out = [];
    for (let node = this.head.next[0]; node !== null; node = node.next[0]) out.push(node.value);
    return out;
  }
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

for (let trial = 0; trial < 30; trial++) {
  const list = new SkipList();
  const ref = [];                               // sorted array reference
  for (let op = 0; op < 300; op++) {
    const x = randomInt(0, 40);
    const r = Math.random();
    if (r < 0.5) {
      list.insert(x);
      ref.push(x);
      ref.sort((a, b) => a - b);
    } else if (r < 0.75) {
      const i = ref.indexOf(x);
      assert.strictEqual(list.delete(x), i !== -1);
      if (i !== -1) ref.splice(i, 1);
    } else {
      assert.strictEqual(list.search(x), ref.includes(x));
    }
    assert.strictEqual(list.size, ref.length);
  }
  assert.deepStrictEqual(list.toArray(), ref);
}

const sl = new SkipList();
[30, 10, 50, 20, 40].forEach((v) => sl.insert(v));
assert.deepStrictEqual(sl.toArray(), [10, 20, 30, 40, 50]);
assert.strictEqual(sl.search(40), true);
assert.strictEqual(sl.search(45), false);
assert.strictEqual(sl.delete(45), false);
assert.strictEqual(sl.delete(10), true);
assert.deepStrictEqual(sl.toArray(), [20, 30, 40, 50]);

console.log('✓ skip-list.js self-test passed');

module.exports = { SkipList };
