/**
 * 03. Pipeline Finish Time   (Original — Medium)
 *
 * PROBLEM
 * A build pipeline has n tasks (0..n-1); task i takes durations[i] minutes. deps lists
 * pairs [a, b]: task a must FINISH before task b can START. Any number of tasks can run
 * in parallel. Return the minimum total time to finish every task, or -1 if the
 * dependencies contain a cycle.
 *
 * EXAMPLES
 * Input: n = 4, durations = [3, 2, 5, 1], deps = [[0, 2], [1, 2], [2, 3]]   Output: 9   Explanation: 3 -> 5 -> 1
 * Input: n = 2, durations = [1, 1], deps = [[0, 1], [1, 0]]                 Output: -1
 * Input: n = 3, durations = [4, 2, 7], deps = []                           Output: 7
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5, deps up to 10^5. Durations positive integers.
 * - Unlimited workers? (yes — otherwise this becomes a scheduling problem)
 *
 * APPROACH 1 — Brute force   O(n * (n + E)) time, O(n) space
 * Relax repeatedly: finish[i] = durations[i] + max(finish[a]) over deps into i. Repeat n
 * rounds (like Bellman-Ford). If round n still changes something there is a cycle.
 *
 * APPROACH 2 — Optimal (Kahn's topological sort + DP on the DAG = longest path)   O(n + E) time, O(n + E) space
 * Process tasks in topological order. When a task is popped its earliest start is final,
 * so finish[i] = start[i] + durations[i]; push that start time to each successor:
 * start[next] = max(start[next], finish[i]). Answer = max finish. If fewer than n tasks
 * were popped, a cycle blocked them -> -1.
 *
 * Dry run on example 1:
 *   indegree [0,0,2,1]   queue [0,1]
 *   pop 0: finish 3 -> start[2]=3      pop 1: finish 2 -> start[2]=max(3,2)=3, indeg[2]=0 push
 *   pop 2: finish 3+5=8 -> start[3]=8  pop 3: finish 9
 *   answer 9
 *
 * EDGE CASES
 * - no deps -> max duration
 * - self-dependency [i, i] -> cycle -> -1
 * - disconnected chains -> the longest chain wins
 *
 * COMMON MISTAKES
 * - Summing all durations (ignores parallelism).
 * - Taking the min instead of the max over prerequisites.
 */

function bruteForce(n, durations, deps) {
  const finish = durations.slice();
  for (let round = 0; round <= n; round++) {
    let changed = false;
    for (const [a, b] of deps) {
      if (finish[a] + durations[b] > finish[b]) { finish[b] = finish[a] + durations[b]; changed = true; }
    }
    if (!changed) return n ? Math.max(...finish) : 0;
  }
  return -1; // still changing after n rounds -> a cycle keeps growing
}

function optimal(n, durations, deps) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of deps) { adj[a].push(b); indeg[b]++; }
  const start = new Array(n).fill(0);
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  let done = 0, best = 0;
  for (let h = 0; h < queue.length; h++) {
    const i = queue[h]; done++;
    const fin = start[i] + durations[i];
    best = Math.max(best, fin);
    for (const nx of adj[i]) {
      start[nx] = Math.max(start[nx], fin);
      if (--indeg[nx] === 0) queue.push(nx);
    }
  }
  return done === n ? best : -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4, [3, 2, 5, 1], [[0, 2], [1, 2], [2, 3]]), 9);
  assert.strictEqual(solve(2, [1, 1], [[0, 1], [1, 0]]), -1);
  assert.strictEqual(solve(3, [4, 2, 7], []), 7);
  assert.strictEqual(solve(1, [5], [[0, 0]]), -1);
  assert.strictEqual(solve(0, [], []), 0);
  assert.strictEqual(solve(3, [1, 1, 1], [[0, 1], [1, 2], [0, 2]]), 3);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(503);
for (let t = 0; t < 400; t++) {
  const n = 1 + Math.floor(rand() * 7);
  const durations = Array.from({ length: n }, () => 1 + Math.floor(rand() * 9));
  const deps = Array.from({ length: Math.floor(rand() * 9) }, () => {
    let a = Math.floor(rand() * n), b = Math.floor(rand() * n);
    if (rand() < 0.85 && a > b) [a, b] = [b, a]; // mostly forward edges -> mostly DAGs
    return [a, b];
  });
  assert.strictEqual(optimal(n, durations, deps), bruteForce(n, durations, deps));
}
console.log('✓ set_05/03_pipeline_finish_time passed');
module.exports = { optimal, bruteForce };
