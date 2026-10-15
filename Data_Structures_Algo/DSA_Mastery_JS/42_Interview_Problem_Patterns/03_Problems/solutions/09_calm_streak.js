/**
 * 09. Calm Streak   (Original — Hard)
 *
 * PROBLEM
 * readings[i] is a vibration sensor reading at minute i. A stretch of CONSECUTIVE minutes is
 * "calm" if its largest reading minus its smallest reading is at most d. Return the length of
 * the longest calm stretch (0 for no readings).
 *
 * EXAMPLES
 * readings = [8, 2, 4, 7], d = 4       -> 2   ([2,4] or [4,7])
 * readings = [10, 1, 2, 4, 7, 2], d = 5 -> 4  ([2,4,7,2])
 * readings = [4, 4, 4], d = 0          -> 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 10^5, readings can be negative, 0 <= d <= 10^9.
 * - "Consecutive" -> contiguous subarray.
 *
 * PATTERN: sliding window (longest valid) + monotonic deques for the window max and min.
 * Clues: "consecutive", "longest", condition on max - min of the window, n up to 10^5.
 * Validity is monotonic: shrinking a calm window keeps it calm.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each start, extend the end while tracking running max/min; stop when max - min > d.
 *
 * APPROACH 2 — Optimal (window + two monotonic deques)   O(n) time, O(n) space
 * maxQ holds indices with DECREASING readings (front = window max); minQ holds INCREASING
 * readings (front = window min). Add right to both (popping dominated elements from the back).
 * While reading[maxQ front] - reading[minQ front] > d, move left forward and drop fronts that
 * fell out of the window. Record right - left + 1.
 * Deques use a head index instead of shift(), which is O(n) in JS.
 *
 * Dry run on [8, 2, 4, 7], d = 4:
 *   r=0: max 8 min 8 ok           len 1
 *   r=1: max 8 min 2 -> 6 > 4, left=1, drop 8 from maxQ -> max 2 min 2  len 1
 *   r=2: max 4 min 2 ok           len 2
 *   r=3: max 7 min 2 -> 5 > 4, left=2, drop 2 from minQ -> max 7 min 4 ok  len 2
 *   answer 2
 *
 * EDGE CASES
 * - empty -> 0;  d = 0 -> longest run of equal values;  all equal -> n;  negatives.
 */

function bruteForce(readings, d) {
  let best = 0;
  for (let i = 0; i < readings.length; i++) {
    let hi = -Infinity;
    let lo = Infinity;
    for (let j = i; j < readings.length; j++) {
      hi = Math.max(hi, readings[j]);
      lo = Math.min(lo, readings[j]);
      if (hi - lo > d) break;
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

function optimal(readings, d) {
  const maxQ = []; let maxHead = 0; // indices, readings decreasing
  const minQ = []; let minHead = 0; // indices, readings increasing
  let left = 0;
  let best = 0;
  for (let right = 0; right < readings.length; right++) {
    const x = readings[right];
    while (maxQ.length > maxHead && readings[maxQ[maxQ.length - 1]] <= x) maxQ.pop();
    maxQ.push(right);
    while (minQ.length > minHead && readings[minQ[minQ.length - 1]] >= x) minQ.pop();
    minQ.push(right);
    while (readings[maxQ[maxHead]] - readings[minQ[minHead]] > d) {
      left++;                                            // shrink the window
      if (maxQ[maxHead] < left) maxHead++;               // front left the window
      if (minQ[minHead] < left) minHead++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([8, 2, 4, 7], 4), 2);
  assert.strictEqual(solve([10, 1, 2, 4, 7, 2], 5), 4);
  assert.strictEqual(solve([4, 4, 4], 0), 3);
  assert.strictEqual(solve([], 3), 0);
  assert.strictEqual(solve([-3, -1, -2, 5], 2), 3);
  assert.strictEqual(solve([1, 5, 1, 5], 3), 1);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(9);
for (let t = 0; t < 300; t++) {
  const arr = Array.from({ length: Math.floor(rand() * 20) }, () => Math.floor(rand() * 21) - 10);
  const d = Math.floor(rand() * 8);
  assert.strictEqual(optimal(arr, d), bruteForce(arr, d));
}
console.log('✓ 09_calm_streak passed');

module.exports = { optimal, bruteForce };
