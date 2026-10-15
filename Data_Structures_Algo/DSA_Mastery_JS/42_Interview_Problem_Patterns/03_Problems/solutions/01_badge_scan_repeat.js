/**
 * 01. Badge Scan Repeat   (Original — Easy)
 *
 * PROBLEM
 * An office door logs badge scans in order: scans[i] is a badge id (a string).
 * A "tailgating alert" happens when the same badge is scanned again within at most k
 * positions of its previous scan (j - i <= k). Return the index j of the FIRST scan that
 * triggers an alert, or -1 if none does.
 *
 * EXAMPLES
 * scans = ["a7", "b2", "a7", "c1"], k = 2   -> 2   (a7 at 0 and 2, distance 2 <= 2)
 * scans = ["a7", "b2", "c1", "a7"], k = 2   -> -1  (distance 3 > 2)
 * scans = ["x", "y", "y"], k = 1            -> 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= scans.length <= 10^5, 0 <= k <= 10^5. Empty log -> -1. k = 0 -> never an alert.
 * - Are ids case-sensitive? (yes, compare exactly)
 *
 * PATTERN: hash map (last-seen index). Clues: "same value again", "within k positions",
 * unsorted input, n up to 10^5 -> O(n) with a map.
 *
 * APPROACH 1 — Brute force   O(n * k) time, O(1) space
 * For every j, look back at the previous k scans and compare.
 *
 * APPROACH 2 — Optimal (hash map of last index)   O(n) time, O(n) space
 * Walk left to right. lastSeen.get(id) is the most recent earlier index of this badge.
 * If it exists and j - last <= k, j is the answer (the first j to satisfy it, since we scan
 * in order). Otherwise update lastSeen to j. Only the LAST occurrence matters: an older one is
 * even farther away.
 *
 * Dry run on ["a7", "b2", "a7", "c1"], k = 2:
 *   j=0 a7: not seen          lastSeen {a7:0}
 *   j=1 b2: not seen          lastSeen {a7:0, b2:1}
 *   j=2 a7: last 0, 2-0=2<=2  -> return 2
 *
 * EDGE CASES
 * - empty array -> -1;  k = 0 -> -1;  repeated id far apart then close -> the close one counts.
 */

function bruteForce(scans, k) {
  for (let j = 0; j < scans.length; j++) {
    for (let i = Math.max(0, j - k); i < j; i++) {
      if (scans[i] === scans[j]) return j;
    }
  }
  return -1;
}

function optimal(scans, k) {
  const lastSeen = new Map(); // Map, not {}: ids like "constructor" stay safe
  for (let j = 0; j < scans.length; j++) {
    const id = scans[j];
    if (lastSeen.has(id) && j - lastSeen.get(id) <= k) return j;
    lastSeen.set(id, j);
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(['a7', 'b2', 'a7', 'c1'], 2), 2);
  assert.strictEqual(solve(['a7', 'b2', 'c1', 'a7'], 2), -1);
  assert.strictEqual(solve(['x', 'y', 'y'], 1), 2);
  assert.strictEqual(solve([], 3), -1);
  assert.strictEqual(solve(['a', 'a'], 0), -1);
  assert.strictEqual(solve(['a', 'b', 'c', 'a', 'a'], 2), 4);
  assert.strictEqual(solve(['constructor', 'constructor'], 1), 1);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 15);
  const scans = Array.from({ length: n }, () => 'id' + Math.floor(rand() * 6));
  const k = Math.floor(rand() * 6);
  assert.strictEqual(optimal(scans, k), bruteForce(scans, k));
}
console.log('✓ 01_badge_scan_repeat passed');

module.exports = { optimal, bruteForce };
