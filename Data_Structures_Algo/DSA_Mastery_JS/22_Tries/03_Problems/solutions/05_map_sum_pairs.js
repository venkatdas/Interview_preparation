/**
 * 05. Map Sum Pairs   (LeetCode 677 — Medium)
 *
 * PROBLEM
 * Design a class MapSum with:
 *   insert(key, val) - set key to val (overwrites an existing key)
 *   sum(prefix)      - sum of values of all keys that start with prefix
 *
 * EXAMPLES
 * insert("apple", 3); sum("ap") -> 3
 * insert("app", 2);   sum("ap") -> 5
 * insert("apple", 5); sum("ap") -> 7   Explanation: apple overwritten 3 -> 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can a key be inserted twice? (yes -> overwrite, NOT add)
 * - Values can be negative? (assume yes; the delta approach handles it)
 * - Lowercase only? (yes)
 *
 * APPROACH 1 — Brute force (Map + scan)   insert O(1), sum O(n * L)
 * Keep a Map key -> value. sum loops over all keys and adds those with the prefix.
 *
 * APPROACH 2 — Optimal (Trie with prefix sums stored on nodes)   O(L) per op
 * Each trie node stores `sum` = total value of all keys passing through it.
 * On insert(key, val):
 *   delta = val - (old value of key, or 0)     <- handles overwrite
 *   walk the key's path and add delta to every node's sum
 *   remember the new value in a Map
 * sum(prefix): walk to the prefix node and return its sum (0 if path breaks).
 *
 * Dry run: insert("apple",3): delta=3, nodes a,p,p,l,e all get +3
 *          insert("app",2):   delta=2, nodes a,p,p get +2  -> node 'p'(3rd) sum=5
 *          insert("apple",5): delta=5-3=2, a,p,p,l,e get +2 -> node 'p'(3rd) sum=7
 *          sum("ap") -> node at 'p'(2nd) = 7
 *
 * EDGE CASES
 * - sum of a prefix that does not exist -> 0
 * - sum("") -> total of all values
 * - overwrite with same value -> delta 0, nothing changes
 */

class BruteForceMapSum {
  constructor() { this.map = new Map(); }
  insert(key, val) { this.map.set(key, val); }
  sum(prefix) {
    let total = 0;
    for (const [key, val] of this.map) if (key.startsWith(prefix)) total += val;
    return total;
  }
}

class MapSum {
  constructor() {
    this.root = { children: new Map(), sum: 0 };
    this.values = new Map(); // key -> current value, needed to compute the delta
  }

  insert(key, val) {
    const delta = val - (this.values.get(key) || 0);
    this.values.set(key, val);
    let node = this.root;
    node.sum += delta; // root holds the grand total, so sum('') works
    for (const ch of key) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), sum: 0 });
      node = node.children.get(ch);
      node.sum += delta; // every node on the path "contains" this key
    }
  }

  sum(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return 0;
    }
    return node.sum;
  }
}

function optimal() { return new MapSum(); }
function bruteForce() { return new BruteForceMapSum(); }

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const m = make();
  m.insert('apple', 3);
  assert.strictEqual(m.sum('ap'), 3);
  m.insert('app', 2);
  assert.strictEqual(m.sum('ap'), 5);
  m.insert('apple', 5);          // overwrite
  assert.strictEqual(m.sum('ap'), 7);
  assert.strictEqual(m.sum('apple'), 5);
  assert.strictEqual(m.sum('b'), 0);
  assert.strictEqual(m.sum(''), 7);
  m.insert('bat', -4);
  assert.strictEqual(m.sum(''), 3);
  assert.strictEqual(m.sum('ba'), -4);
}
console.log('✓ 05-map-sum-pairs passed');

module.exports = { optimal, bruteForce, MapSum };
