/**
 * 04. Design Skiplist   (LeetCode 1206 — Hard)
 *
 * PROBLEM
 * Implement a Skiplist with search(target), add(num) and erase(num) (erase returns false
 * if num is absent; duplicates are allowed and erase removes one copy). Operations must
 * run in O(log n) on average, without using built-in sorted structures.
 *
 * EXAMPLES
 * add(1); add(2); add(3); search(0) -> false; add(4); search(1) -> true;
 * erase(0) -> false; erase(1) -> true; search(1) -> false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values 0..2*10^4, up to 5*10^4 calls
 * - Duplicates allowed? (yes)
 *
 * APPROACH 1 — Brute force (sorted array)   O(log n) search, O(n) add/erase
 * Binary search for the position; splice to insert/remove. Simple, and honestly fast in
 * JS for this input size, but it is not what the problem is testing.
 *
 * APPROACH 2 — Optimal (Skip list)   expected O(log n) for all three
 * A sorted linked list with extra "express" levels. Each node gets a random height
 * (coin flips, p = 1/2). Search walks from the top level: move right while next.value <
 * target, otherwise drop one level. Add walks the same path while recording the last node
 * visited on every level (predecessors), then links the new node in on levels 0..height.
 * Erase walks the path and unlinks the node on every level where the predecessor points to it.
 *
 * Dry run: add 1, 2, 3 (heights say 0, 1, 0), then search(2):
 *   level 1: HEAD -> 2 -> null
 *   level 0: HEAD -> 1 -> 2 -> 3 -> null
 *   search(2): level 1: HEAD.next = 2, not < 2 -> drop; level 0: HEAD.next = 1 < 2 -> move;
 *              next = 2, not < 2 -> stop; candidate = 2 -> true
 *
 * EDGE CASES
 * - erase on an empty list -> false
 * - duplicates: add(1) twice, erase(1) once -> search(1) still true
 * - search on an empty list -> false
 */

class SkiplistBrute {
  constructor() {
    this.items = [];
  }
  #lowerBound(x) {
    let lo = 0;
    let hi = this.items.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.items[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  search(target) {
    const i = this.#lowerBound(target);
    return i < this.items.length && this.items[i] === target;
  }
  add(num) {
    this.items.splice(this.#lowerBound(num), 0, num);
  }
  erase(num) {
    const i = this.#lowerBound(num);
    if (i < this.items.length && this.items[i] === num) {
      this.items.splice(i, 1);
      return true;
    }
    return false;
  }
}

class Skiplist {
  constructor() {
    this.MAX_LEVEL = 16;
    this.head = { value: -Infinity, next: new Array(this.MAX_LEVEL + 1).fill(null) };
    this.level = 0;
  }

  #randomLevel() {
    let lvl = 0;
    while (Math.random() < 0.5 && lvl < this.MAX_LEVEL) lvl++;
    return lvl;
  }

  // predecessors[i] = last node on level i with value < target
  #predecessors(target) {
    const preds = new Array(this.MAX_LEVEL + 1).fill(this.head);
    let node = this.head;
    for (let i = this.level; i >= 0; i--) {
      while (node.next[i] !== null && node.next[i].value < target) node = node.next[i];
      preds[i] = node;
    }
    return preds;
  }

  search(target) {
    const candidate = this.#predecessors(target)[0].next[0];
    return candidate !== null && candidate.value === target;
  }

  add(num) {
    const preds = this.#predecessors(num);
    const lvl = this.#randomLevel();
    if (lvl > this.level) this.level = lvl;      // preds above old level already point to head
    const node = { value: num, next: new Array(lvl + 1).fill(null) };
    for (let i = 0; i <= lvl; i++) {
      node.next[i] = preds[i].next[i];
      preds[i].next[i] = node;
    }
  }

  erase(num) {
    const preds = this.#predecessors(num);
    const node = preds[0].next[0];
    if (node === null || node.value !== num) return false;
    for (let i = 0; i <= this.level; i++) {
      if (preds[i].next[i] !== node) break;
      preds[i].next[i] = node.next[i];
    }
    while (this.level > 0 && this.head.next[this.level] === null) this.level--;
    return true;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [SkiplistBrute, Skiplist]) {
  const sl = new Cls();
  assert.strictEqual(sl.search(5), false);
  assert.strictEqual(sl.erase(5), false);
  sl.add(1);
  sl.add(2);
  sl.add(3);
  assert.strictEqual(sl.search(0), false);
  sl.add(4);
  assert.strictEqual(sl.search(1), true);
  assert.strictEqual(sl.erase(0), false);
  assert.strictEqual(sl.erase(1), true);
  assert.strictEqual(sl.search(1), false);
  sl.add(7);
  sl.add(7);
  assert.strictEqual(sl.erase(7), true);
  assert.strictEqual(sl.search(7), true);     // one copy remains
  assert.strictEqual(sl.erase(7), true);
  assert.strictEqual(sl.search(7), false);
}
for (let trial = 0; trial < 30; trial++) {
  const a = new SkiplistBrute();
  const b = new Skiplist();
  for (let op = 0; op < 300; op++) {
    const x = Math.floor(Math.random() * 30);
    const r = Math.random();
    if (r < 0.45) {
      a.add(x);
      b.add(x);
    } else if (r < 0.75) {
      assert.strictEqual(b.erase(x), a.erase(x));
    } else {
      assert.strictEqual(b.search(x), a.search(x));
    }
  }
}
console.log('✓ 04-design-skiplist passed');

module.exports = { Skiplist, SkiplistBrute, optimal: Skiplist, bruteForce: SkiplistBrute };
