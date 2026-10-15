/**
 * 04. Design Hit Counter   (LeetCode 362 — Medium)
 *
 * PROBLEM
 * Count hits in the past 5 minutes. hit(t) records a hit at second t; getHits(t) returns the
 * number of hits in the window (t - 300, t], i.e. the last 300 seconds including t.
 * Timestamps passed to both methods are non-decreasing; several hits may share a timestamp.
 *
 * EXAMPLES
 * hit(1) hit(2) hit(3)
 * getHits(4)   -> 3
 * hit(300)
 * getHits(300) -> 4
 * getHits(301) -> 3     the hit at 1 is now older than 300 seconds
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-decreasing timestamps? (yes)  - Many hits per second? (follow-up: yes, millions)
 * - Window boundary: hit at t-300 is OUT, hit at t-299 is IN.
 *
 * APPROACH 1 — Brute force   O(n) per getHits, O(n) space
 * Store every timestamp; getHits counts those with ts > t - 300.
 *
 * APPROACH 2 — Optimal for the follow-up (circular buckets)   O(300) per getHits, O(300) space
 * Use 300 buckets indexed by t % 300, each storing (time, count). On hit(t): if bucket
 * holds an older time, reset it to (t, 1), else increment. On getHits(t): sum counts of
 * buckets whose time > t - 300. Memory is constant no matter how many hits arrive.
 * (A deque of (time, count) pairs is the other good answer: O(1) amortised, O(300) memory.)
 *
 * Dry run (only touched buckets shown):
 *   hit(1)   b[1]  = (1,1)
 *   hit(2)   b[2]  = (2,1)
 *   hit(3)   b[3]  = (3,1)
 *   getHits(4): buckets with time > -296 -> 3
 *   hit(300) b[0]  = (300,1)
 *   getHits(301): time > 1 -> b[2], b[3], b[0] -> 3   (b[1] has time 1, excluded)
 *
 * EDGE CASES
 * - getHits before any hit -> 0
 * - many hits on the same second -> bucket count grows
 * - long gap (> 300 s) -> stale buckets ignored by the time check
 */

function bruteForce() {
  const hits = [];
  return {
    hit(t) { hits.push(t); },
    getHits(t) { return hits.filter(h => h > t - 300).length; },
  };
}

function optimal(windowSize = 300) {
  const times = new Array(windowSize).fill(-Infinity);
  const counts = new Array(windowSize).fill(0);
  return {
    hit(t) {
      const i = t % windowSize;
      if (times[i] !== t) { times[i] = t; counts[i] = 1; }   // bucket belonged to an old second
      else counts[i]++;
    },
    getHits(t) {
      let total = 0;
      for (let i = 0; i < windowSize; i++) if (times[i] > t - windowSize) total += counts[i];
      return total;
    },
  };
}

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const h = make();
  h.hit(1); h.hit(2); h.hit(3);
  assert.strictEqual(h.getHits(4), 3);
  h.hit(300);
  assert.strictEqual(h.getHits(300), 4);
  assert.strictEqual(h.getHits(301), 3);
  const e = make();
  assert.strictEqual(e.getHits(5), 0);
  e.hit(10); e.hit(10); e.hit(10);
  assert.strictEqual(e.getHits(10), 3);
  assert.strictEqual(e.getHits(309), 3);
  assert.strictEqual(e.getHits(310), 0);
  e.hit(1000);
  assert.strictEqual(e.getHits(1000), 1);
}
let s = 5;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let trial = 0; trial < 30; trial++) {
  const a = bruteForce(), b = optimal();
  let t = 1;
  for (let i = 0; i < 300; i++) {
    t += Math.floor(rnd() * 20);
    if (rnd() < 0.6) { a.hit(t); b.hit(t); }
    else assert.strictEqual(a.getHits(t), b.getHits(t));
  }
}
console.log('✓ 04_design_hit_counter passed');

module.exports = { optimal, bruteForce };
