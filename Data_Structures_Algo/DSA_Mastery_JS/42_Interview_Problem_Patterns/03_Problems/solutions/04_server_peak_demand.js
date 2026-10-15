/**
 * 04. Server Peak Demand   (Original — Medium)
 *
 * PROBLEM
 * jobs[i] = [start, end, cpu]: a job uses `cpu` cores during the half-open time range
 * [start, end). Return the largest total number of cores in use at any single moment.
 *
 * EXAMPLES
 * jobs = [[0, 10, 2], [5, 15, 3], [10, 20, 1]]  -> 5   (time 5..10 uses 2 + 3)
 * jobs = [[1, 3, 4], [3, 5, 4]]                 -> 4   (one ends exactly when the other starts)
 * jobs = []                                     -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 10^5, 0 <= start < end <= 10^9, 1 <= cpu <= 10^4.
 * - Half-open: a job ending at t does not overlap a job starting at t.
 * - Times up to 10^9 -> cannot allocate an array indexed by time.
 *
 * PATTERN: sweep line over events (intervals). Clues: "at any moment", "maximum concurrent",
 * intervals with large coordinates.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * The maximum is reached at some job's start time. For each start time s, sum cpu of all jobs
 * with start <= s < end.
 *
 * APPROACH 2 — Optimal (sweep line)   O(n log n) time, O(n) space
 * Create events (start, +cpu) and (end, -cpu). Sort by time; at equal times put the negative
 * (ending) events first, because of half-open ranges. Walk the events with a running total and
 * record the maximum.
 *
 * Dry run on [[0,10,2],[5,15,3],[10,20,1]]:
 *   events: (0,+2) (5,+3) (10,-2) (10,+1) (15,-3) (20,-1)
 *   running: 2, 5, 3, 4, 1, 0  -> max 5
 *
 * EDGE CASES
 * - no jobs -> 0;  back-to-back jobs do not stack;  identical jobs stack fully.
 */

function bruteForce(jobs) {
  let best = 0;
  for (const [s] of jobs) {
    let total = 0;
    for (const [a, b, cpu] of jobs) if (a <= s && s < b) total += cpu;
    best = Math.max(best, total);
  }
  return best;
}

function optimal(jobs) {
  const events = [];
  for (const [s, e, cpu] of jobs) { events.push([s, cpu]); events.push([e, -cpu]); }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]); // ends (negative) before starts at the same time
  let running = 0;
  let best = 0;
  for (const [, delta] of events) {
    running += delta;
    best = Math.max(best, running);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 10, 2], [5, 15, 3], [10, 20, 1]]), 5);
  assert.strictEqual(solve([[1, 3, 4], [3, 5, 4]]), 4);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[0, 5, 1], [0, 5, 1], [0, 5, 1]]), 3);
  assert.strictEqual(solve([[0, 1000000000, 7]]), 7);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(4);
for (let t = 0; t < 300; t++) {
  const jobs = Array.from({ length: Math.floor(rand() * 10) }, () => {
    const s = Math.floor(rand() * 20);
    return [s, s + 1 + Math.floor(rand() * 8), 1 + Math.floor(rand() * 5)];
  });
  assert.strictEqual(optimal(jobs), bruteForce(jobs));
}
console.log('✓ 04_server_peak_demand passed');

module.exports = { optimal, bruteForce };
