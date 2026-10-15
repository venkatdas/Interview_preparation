/**
 * 05. Parallel Courses   (LeetCode 1136 — Medium)
 *
 * PROBLEM
 * n courses labelled 1..n. relations[i] = [prev, next] means prev must be taken before
 * next. In one semester you can take ANY number of courses as long as their prerequisites
 * were taken in earlier semesters. Return the minimum number of semesters to finish all
 * courses, or -1 if impossible (cycle).
 *
 * EXAMPLES
 * Input: n = 3, relations = [[1,3],[2,3]]         Output: 2   (sem 1: 1 and 2; sem 2: 3)
 * Input: n = 3, relations = [[1,2],[2,3],[3,1]]   Output: -1  (cycle)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1-indexed labels? (yes - convert to 0-indexed or allocate n + 1)
 * - Unlimited courses per semester? (yes)
 *
 * The answer is the number of LEVELS in Kahn's algorithm = length of the longest path
 * in the DAG (in nodes).
 *
 * APPROACH 1 — Alternative (DFS + memo: longest path ending at each node)   O(V + E)
 * depth(node) = 1 + max(depth(prereq)) over prerequisites; memoise. Detect cycles with
 * a gray marker. Answer = max depth. Shown as `dfsVersion`.
 *
 * APPROACH 2 — Optimal (Kahn's algorithm, level by level)   O(V + E) time, O(V + E)
 *   1. in-degree + adjacency.
 *   2. queue = all in-degree-0 courses (semester 1).
 *   3. Each outer iteration processes the whole current queue = one semester.
 *   4. Count semesters; if processed < n -> -1.
 *
 * Dry run n=3, [[1,3],[2,3]]:
 *   indeg [_,0,0,1]  level 1: [1,2] -> indeg[3]=0 -> level 2: [3]  -> 2 semesters
 *
 * EDGE CASES
 * - no relations -> 1 semester
 * - a chain of n courses -> n semesters
 * - cycle -> -1
 */

function dfsVersion(n, relations) {
  const prereqs = Array.from({ length: n + 1 }, () => []);
  for (const [prev, next] of relations) prereqs[next].push(prev);
  const depth = new Array(n + 1).fill(0);     // 0 = not computed
  const onPath = new Array(n + 1).fill(false);
  let cycle = false;

  function longest(course) {
    if (depth[course]) return depth[course];
    if (onPath[course]) { cycle = true; return 0; }
    onPath[course] = true;
    let best = 0;
    for (const p of prereqs[course]) best = Math.max(best, longest(p));
    onPath[course] = false;
    depth[course] = best + 1;
    return depth[course];
  }

  let answer = 0;
  for (let course = 1; course <= n; course++) {
    answer = Math.max(answer, longest(course));
    if (cycle) return -1;
  }
  return answer;
}

function optimal(n, relations) {
  const adj = Array.from({ length: n + 1 }, () => []);
  const indegree = new Array(n + 1).fill(0);
  for (const [prev, next] of relations) {
    adj[prev].push(next);
    indegree[next]++;
  }

  let queue = [];
  for (let course = 1; course <= n; course++) if (indegree[course] === 0) queue.push(course);

  let semesters = 0;
  let taken = 0;
  while (queue.length) {
    semesters++;                              // one level = one semester
    const nextQueue = [];
    for (const course of queue) {
      taken++;
      for (const next of adj[course]) {
        if (--indegree[next] === 0) nextQueue.push(next);
      }
    }
    queue = nextQueue;
  }
  return taken === n ? semesters : -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [dfsVersion, optimal]) {
  assert.strictEqual(solve(3, [[1, 3], [2, 3]]), 2);
  assert.strictEqual(solve(3, [[1, 2], [2, 3], [3, 1]]), -1);
  assert.strictEqual(solve(1, []), 1);
  assert.strictEqual(solve(4, []), 1);
  assert.strictEqual(solve(4, [[1, 2], [2, 3], [3, 4]]), 4);
  assert.strictEqual(solve(5, [[2, 1], [3, 1], [4, 1], [1, 5]]), 3);
}
console.log('✓ 05-parallel-courses passed');

module.exports = { optimal, dfsVersion };
