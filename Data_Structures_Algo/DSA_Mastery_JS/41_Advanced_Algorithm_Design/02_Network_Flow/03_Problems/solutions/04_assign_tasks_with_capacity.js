/**
 * 04. Assign Tasks to Workers with Capacities   (Original — Medium)
 *
 * PROBLEM
 * There are T tasks and W workers. Worker w can take at most capacity[w] tasks.
 * allowed[i] lists the workers who are able to do task i. Each task needs exactly one
 * worker (or stays undone). Return the maximum number of tasks that can be done.
 *
 * EXAMPLES
 * capacity=[2,1], allowed=[[0],[0],[0,1],[1]]       -> 3  (worker 0 is full after 2)
 * capacity=[1,1,1], allowed=[[0,1,2],[0],[0]]       -> 2  (tasks 1 and 2 both need worker 0)
 * capacity=[0], allowed=[[0]]                       -> 0
 * capacity=[5], allowed=[[0],[0],[0]]               -> 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can capacity be 0? (yes)
 * - Is a task worth the same as any other? (yes; weighted tasks -> min-cost flow)
 * - Do we need the assignment? (count only; read flows on task->worker edges if needed)
 * - T, W up to 1000, total allowed pairs up to 2 * 10^4.
 *
 * APPROACH 1 — Brute force   O((W+1)^T) time, O(T + W) space
 * Task by task: leave it undone, or give it to an allowed worker with spare capacity.
 *
 * APPROACH 2 — Optimal (max flow with capacities)   O(V^2 * E) worst case with Dinic,
 * much faster in practice on these unit-ish graphs.
 *   source -> task i      capacity 1            (each task done at most once)
 *   task i -> worker w    capacity 1            (if w is allowed)
 *   worker w -> sink      capacity capacity[w]  (worker's limit)
 * Each unit of flow = one task done by one worker. Max flow = max tasks done.
 * Why not greedy? Greedy "give each task to any free worker" can block a later task
 * that only one worker can do. Flow's reverse edges undo such bad early choices.
 *
 * Dry run (example 1): tasks t0..t3, workers w0 (cap 2), w1 (cap 1)
 *   S->t0->w0->T  flow 1   (w0 used 1/2)
 *   S->t1->w0->T  flow 2   (w0 used 2/2)
 *   S->t2->w1->T  flow 3   (w1 used 1/1)
 *   S->t3->w1? w1->T full. Reroute t2? t2->w0 full too. No path. Answer 3.
 *
 * EDGE CASES
 * - no tasks / no workers -> 0
 * - task with empty allowed list
 * - capacity larger than the number of tasks
 */
const { Dinic, mulberry32 } = require('../../02_Implementations/max_flow');

function bruteForce(capacity, allowed) {
  const left = capacity.slice();
  function go(i) {
    if (i === allowed.length) return 0;
    let best = go(i + 1);
    for (const w of allowed[i]) {
      if (left[w] === 0) continue;
      left[w]--;
      best = Math.max(best, 1 + go(i + 1));
      left[w]++;
    }
    return best;
  }
  return go(0);
}

function optimal(capacity, allowed) {
  const T = allowed.length;
  const W = capacity.length;
  const S = T + W;
  const SINK = S + 1;
  const g = new Dinic(T + W + 2);
  for (let i = 0; i < T; i++) {
    g.addEdge(S, i, 1);
    for (const w of allowed[i]) g.addEdge(i, T + w, 1);
  }
  for (let w = 0; w < W; w++) g.addEdge(T + w, SINK, capacity[w]);
  return g.maxFlow(S, SINK);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 1], [[0], [0], [0, 1], [1]]), 3);
  assert.strictEqual(solve([1, 1, 1], [[0, 1, 2], [0], [0]]), 2);
  assert.strictEqual(solve([0], [[0]]), 0);
  assert.strictEqual(solve([5], [[0], [0], [0]]), 3);
  assert.strictEqual(solve([3], []), 0);
  assert.strictEqual(solve([], [[], []]), 0);
  // greedy trap: task 0 could take w0 or w1, task 1 only w0
  assert.strictEqual(solve([1, 1], [[0, 1], [0]]), 2);
}
const rnd = mulberry32(404);
for (let tr = 0; tr < 300; tr++) {
  const W = 1 + Math.floor(rnd() * 4);
  const T = Math.floor(rnd() * 7);
  const capacity = Array.from({ length: W }, () => Math.floor(rnd() * 3));
  const allowed = Array.from({ length: T }, () => [...Array(W).keys()].filter(() => rnd() < 0.5));
  assert.strictEqual(optimal(capacity, allowed), bruteForce(capacity, allowed));
}
console.log('✓ 04_assign_tasks_with_capacity passed');

module.exports = { optimal, bruteForce };
