/**
 * 15. Time Based Key-Value Store   (LeetCode 981 — Medium)
 *
 * PROBLEM
 * Design a store with:
 *   set(key, value, timestamp)  - store value for key at the given timestamp
 *   get(key, timestamp)         - return the value set with the LARGEST timestamp <= the
 *                                 given one, or "" if none
 * Timestamps passed to set are strictly increasing per key.
 *
 * EXAMPLES
 * set("foo","bar",1); get("foo",1) -> "bar"; get("foo",3) -> "bar"
 * set("foo","bar2",4); get("foo",4) -> "bar2"; get("foo",5) -> "bar2"; get("foo",0) -> ""
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are timestamps strictly increasing per key? (yes -> the list per key is already sorted)
 * - Up to 2 * 10^5 calls -> get must be O(log n)
 * - Can get ask for a key never set? (yes -> "")
 *
 * APPROACH 1 — Brute force   O(n) per get
 * Store a list of [timestamp, value] per key; on get, scan the whole list and keep
 * the latest entry with timestamp <= query.
 *
 * APPROACH 2 — Optimal (upper bound on the timestamps)   O(1) set, O(log n) get
 * Because timestamps arrive increasing, each key's list is sorted. get = "the LAST
 * entry with timestamp <= t" = upperBound(t) - 1. Binary search for the first index
 * whose timestamp is > t; the previous index is the answer (if it exists).
 *
 * Dry run foo: [[1,"bar"],[4,"bar2"]], get(foo, 3):
 *   l=0 r=2 mid=1 ts 4 <= 3? no -> r=1
 *   l=0 r=1 mid=0 ts 1 <= 3? yes -> l=1
 *   upperBound = 1 -> index 0 -> "bar"
 * get(foo, 0): upperBound = 0 -> no previous index -> ""
 *
 * EDGE CASES
 * - key missing -> ""
 * - query before the first timestamp -> ""
 * - query exactly equal to a stored timestamp -> that value
 * - query after the last -> last value
 */

class TimeMapBrute {
  constructor() { this.store = new Map(); }
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key).push([timestamp, value]);
  }
  get(key, timestamp) {
    const entries = this.store.get(key) || [];
    let answer = '';
    for (const [ts, value] of entries) if (ts <= timestamp) answer = value;  // list is increasing
    return answer;
  }
}

class TimeMap {
  constructor() {
    this.store = new Map();     // key -> { timestamps: number[], values: string[] }
  }

  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, { timestamps: [], values: [] });
    const entry = this.store.get(key);
    entry.timestamps.push(timestamp);   // increasing order guaranteed by the problem
    entry.values.push(value);
  }

  get(key, timestamp) {
    const entry = this.store.get(key);
    if (!entry) return '';
    const { timestamps, values } = entry;
    // upperBound: first index with timestamps[i] > timestamp
    let left = 0, right = timestamps.length;
    while (left < right) {
      const mid = left + ((right - left) >> 1);
      if (timestamps[mid] <= timestamp) left = mid + 1;
      else right = mid;
    }
    return left === 0 ? '' : values[left - 1];   // nothing at or before `timestamp`
  }
}

// wrappers so the tests can treat both the same way
function bruteForce() { return new TimeMapBrute(); }
function optimal() { return new TimeMap(); }

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const tm = make();
  tm.set('foo', 'bar', 1);
  assert.strictEqual(tm.get('foo', 1), 'bar');
  assert.strictEqual(tm.get('foo', 3), 'bar');
  tm.set('foo', 'bar2', 4);
  assert.strictEqual(tm.get('foo', 4), 'bar2');
  assert.strictEqual(tm.get('foo', 5), 'bar2');
  assert.strictEqual(tm.get('foo', 0), '');
  assert.strictEqual(tm.get('missing', 10), '');
  tm.set('love', 'high', 10);
  tm.set('love', 'low', 20);
  assert.strictEqual(tm.get('love', 5), '');
  assert.strictEqual(tm.get('love', 10), 'high');
  assert.strictEqual(tm.get('love', 15), 'high');
  assert.strictEqual(tm.get('love', 20), 'low');
  assert.strictEqual(tm.get('love', 25), 'low');
}
// cross-check on random operations
const a = bruteForce(), b = optimal();
let ts = 0;
for (let i = 0; i < 500; i++) {
  const key = 'k' + Math.floor(Math.random() * 3);
  if (Math.random() < 0.5) { ts++; a.set(key, 'v' + ts, ts); b.set(key, 'v' + ts, ts); }
  else { const q = Math.floor(Math.random() * (ts + 2)); assert.strictEqual(b.get(key, q), a.get(key, q)); }
}
console.log('✓ 15-time-based-key-value-store passed');

module.exports = { optimal, bruteForce, TimeMap };
