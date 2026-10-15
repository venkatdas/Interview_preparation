/**
 * 02. Course Schedule II   (LeetCode 210 — Medium)
 *
 * PROBLEM
 * Same setup as Course Schedule: [a, b] means b before a. Return ANY valid order in
 * which all courses can be taken, or [] if impossible.
 *
 * EXAMPLES
 * Input: 2, [[1,0]]                       Output: [0,1]
 * Input: 4, [[1,0],[2,0],[3,1],[3,2]]     Output: [0,1,2,3] or [0,2,1,3]
 * Input: 1, []                            Output: [0]
 * Input: 2, [[1,0],[0,1]]                 Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Any valid order accepted? (yes)
 * - Return [] on a cycle, not null? (yes)
 *
 * APPROACH 1 — Alternative (DFS post-order)   O(V + E) time, O(V) space
 * DFS with three colours; push a node when it FINISHES; reverse at the end. Return [] if
 * a gray node is revisited. Same complexity as Kahn, just the recursive flavour; shown as
 * `dfsVersion` because a slower "brute force" adds nothing here.
 *
 * APPROACH 2 — Optimal (Kahn's algorithm)   O(V + E) time, O(V + E) space
 * Exactly Course Schedule I, but keep the popped nodes in an `order` array and return it
 * (or [] if order.length < numCourses).
 *
 * Dry run 4, [[1,0],[2,0],[3,1],[3,2]]:
 *   indeg [0,1,1,2], queue [0]
 *   pop 0 -> order [0], push 1, 2
 *   pop 1 -> order [0,1]; pop 2 -> order [0,1,2], indeg[3] = 0 push 3
 *   pop 3 -> order [0,1,2,3]  length 4 -> return
 *
 * EDGE CASES
 * - no prerequisites -> [0, 1, ..., n-1]
 * - self loop -> []
 */

function dfsVersion(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) adj[prereq].push(course);
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Array(numCourses).fill(WHITE);
  const finished = [];

  function dfs(node) {                        // returns false on cycle
    color[node] = GRAY;
    for (const next of adj[node]) {
      if (color[next] === GRAY) return false;
      if (color[next] === WHITE && !dfs(next)) return false;
    }
    color[node] = BLACK;
    finished.push(node);
    return true;
  }

  for (let c = 0; c < numCourses; c++) {
    if (color[c] === WHITE && !dfs(c)) return [];
  }
  return finished.reverse();
}

function optimal(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    indegree[course]++;
  }
  const order = [];
  for (let c = 0; c < numCourses; c++) if (indegree[c] === 0) order.push(c);
  // `order` doubles as the queue: head walks it while we push to the end
  for (let head = 0; head < order.length; head++) {
    for (const next of adj[order[head]]) {
      if (--indegree[next] === 0) order.push(next);
    }
  }
  return order.length === numCourses ? order : [];
}

// ---------- tests ----------
const assert = require('assert');
function isValid(order, n, prereqs) {
  if (order.length !== n) return false;
  const pos = new Map(order.map((c, i) => [c, i]));
  return prereqs.every(([a, b]) => pos.get(b) < pos.get(a));
}
for (const solve of [dfsVersion, optimal]) {
  assert.deepStrictEqual(solve(2, [[1, 0]]), [0, 1]);
  const p = [[1, 0], [2, 0], [3, 1], [3, 2]];
  assert.ok(isValid(solve(4, p), 4, p));
  assert.deepStrictEqual(solve(1, []), [0]);
  assert.deepStrictEqual(solve(2, [[1, 0], [0, 1]]), []);
  assert.deepStrictEqual(solve(1, [[0, 0]]), []);
  assert.deepStrictEqual(solve(3, []).sort(), [0, 1, 2]);
  const q = [[1, 0], [2, 1], [3, 2], [4, 3]];
  assert.deepStrictEqual(solve(5, q), [0, 1, 2, 3, 4]);
}
console.log('✓ 02-course-schedule-ii passed');

module.exports = { optimal, dfsVersion };
