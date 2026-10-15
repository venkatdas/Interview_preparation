/**
 * 04. Time Based Key-Value Store   (LeetCode 981 — Medium)
 *
 * PROBLEM
 * Design TimeMap with
 *   - set(key, value, timestamp): store value for key at that time
 *   - get(key, timestamp): return the value with the LARGEST stored timestamp <= timestamp,
 *     or "" if there is none.
 * Timestamps passed to set for the same key are strictly increasing.
 *
 * EXAMPLES
 * set("foo", "bar", 1); get("foo", 1) -> "bar"; get("foo", 3) -> "bar"
 * set("foo", "bar2", 4); get("foo", 4) -> "bar2"; get("foo", 5) -> "bar2"; get("foo", 0) -> ""
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are timestamps strictly increasing per key? (yes -> the list is already sorted, no sort needed)
 * - Up to 2 * 10^5 calls -> O(n) get is too slow in the worst case
 * - Values are strings; "" means not found
 *
 * APPROACH 1 — Brute force   O(1) set, O(n) get
 * Map key -> array of [timestamp, value]. get scans the array for the last timestamp <= t.
 *
 * APPROACH 2 — Optimal (Map + binary search on the sorted timestamps)   O(1) set, O(log n) get
 * Because timestamps arrive in increasing order, each key's array is sorted for free.
 * get = find the rightmost index whose timestamp <= t (an "upper bound minus one").
 *
 * Dry run: foo -> [[1,"bar"],[4,"bar2"]]; get("foo", 3)
 *   lo=0, hi=1: mid=0, ts 1 <= 3 -> answer "bar", lo=1
 *   lo=1, hi=1: mid=1, ts 4 > 3 -> hi=0; stop -> "bar"
 * get("foo", 0): mid=0, ts 1 > 0 -> hi=-1 -> never found -> ""
 *
 * EDGE CASES
 * - key never set -> ""
 * - timestamp earlier than the first set -> ""
 * - timestamp exactly equal to a stored one -> that value
 * - timestamp later than everything -> last value
 */

class TimeMapBrute {
  constructor() {
    this.store = new Map();
  }
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key).push([timestamp, value]);
  }
  get(key, timestamp) {
    const list = this.store.get(key) || [];
    let answer = '';
    for (const [ts, value] of list) {
      if (ts <= timestamp) answer = value;
      else break;
    }
    return answer;
  }
}

class TimeMap {
  constructor() {
    this.store = new Map(); // key -> { times: [], values: [] }
  }
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, { times: [], values: [] });
    const entry = this.store.get(key);
    entry.times.push(timestamp);   // strictly increasing by the problem statement
    entry.values.push(value);
  }
  get(key, timestamp) {
    const entry = this.store.get(key);
    if (!entry) return '';
    let lo = 0;
    let hi = entry.times.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (entry.times[mid] <= timestamp) {
        found = mid;          // candidate; try to find a later one
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return found === -1 ? '' : entry.values[found];
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [TimeMapBrute, TimeMap]) {
  const tm = new Cls();
  tm.set('foo', 'bar', 1);
  assert.strictEqual(tm.get('foo', 1), 'bar');
  assert.strictEqual(tm.get('foo', 3), 'bar');
  tm.set('foo', 'bar2', 4);
  assert.strictEqual(tm.get('foo', 4), 'bar2');
  assert.strictEqual(tm.get('foo', 5), 'bar2');
  assert.strictEqual(tm.get('foo', 0), '');
  assert.strictEqual(tm.get('nope', 10), '');
}
for (let trial = 0; trial < 20; trial++) {
  const a = new TimeMapBrute();
  const b = new TimeMap();
  const nextTs = { k0: 1, k1: 1, k2: 1 };
  for (let op = 0; op < 200; op++) {
    const key = 'k' + Math.floor(Math.random() * 3);
    if (Math.random() < 0.5) {
      const ts = nextTs[key];
      nextTs[key] += 1 + Math.floor(Math.random() * 3);
      const value = 'v' + Math.floor(Math.random() * 100);
      a.set(key, value, ts);
      b.set(key, value, ts);
    } else {
      const ts = Math.floor(Math.random() * 40);
      assert.strictEqual(b.get(key, ts), a.get(key, ts));
    }
  }
}
console.log('✓ 04-time-based-key-value-store passed');

module.exports = { TimeMap, TimeMapBrute, optimal: TimeMap, bruteForce: TimeMapBrute };
