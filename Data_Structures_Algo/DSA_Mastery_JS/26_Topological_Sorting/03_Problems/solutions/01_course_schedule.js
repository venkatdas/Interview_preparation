/**
 * 01. Course Schedule   (LeetCode 207 — Medium)
 *
 * PROBLEM
 * There are numCourses courses 0..numCourses-1. prerequisites[i] = [a, b] means you must
 * take course b BEFORE course a. Can you finish all courses?
 *
 * EXAMPLES
 * Input: numCourses = 2, prerequisites = [[1,0]]         Output: true   (0 then 1)
 * Input: numCourses = 2, prerequisites = [[1,0],[0,1]]   Output: false  (cycle)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Direction of the pair? ([a, b] = b -> a, "b before a")
 * - Duplicate prerequisites? (possible, harmless)
 * - Courses with no prerequisites? (yes, they are free)
 *
 * "Can all be finished" = "is the prerequisite graph a DAG" = "no cycle".
 *
 * APPROACH 1 — Brute force (DFS from every node looking for a cycle, no memo)
 *   O(V * (V + E)) time
 * For each course run a DFS with a path set; if the path revisits a node -> cycle. Without
 * remembering finished (black) nodes we redo work for every start.
 *
 * APPROACH 2 — Optimal (Kahn's algorithm)   O(V + E) time, O(V + E) space
 *   1. Build adjacency b -> a and in-degree of every course.
 *   2. Queue every course with in-degree 0.
 *   3. Pop, count it, decrement neighbours' in-degree, push those that hit 0.
 *   4. finished count === numCourses -> true.
 *
 * Dry run numCourses=4, prereqs [[1,0],[2,0],[3,1],[3,2]]:
 *   adj 0:[1,2] 1:[3] 2:[3]    indeg [0,1,1,2]
 *   queue [0] -> pop 0, count 1, indeg [_,0,0,2] push 1,2
 *   pop 1, count 2, indeg[3]=1;  pop 2, count 3, indeg[3]=0 push 3
 *   pop 3, count 4 === 4 -> true
 *
 * EDGE CASES
 * - no prerequisites -> true
 * - self prerequisite [[0,0]] -> false
 * - numCourses = 1
 */

const { buildAdjList } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(numCourses, prerequisites) {
  const adj = buildAdjList(numCourses, prerequisites.map(([a, b]) => [b, a]), true);

  function hasCycleFrom(node, onPath) {
    if (onPath.has(node)) return true;
    onPath.add(node);
    for (const next of adj[node]) {
      if (hasCycleFrom(next, onPath)) return true;
    }
    onPath.delete(node);                 // backtrack (no "finished" memo = slow)
    return false;
  }

  for (let course = 0; course < numCourses; course++) {
    if (hasCycleFrom(course, new Set())) return false;
  }
  return true;
}

function optimal(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);            // prereq -> course
    indegree[course]++;
  }

  const queue = [];
  for (let c = 0; c < numCourses; c++) if (indegree[c] === 0) queue.push(c);

  let finished = 0;
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    finished++;
    for (const next of adj[current]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }
  return finished === numCourses;        // leftover courses are stuck in a cycle
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(2, [[1, 0]]), true);
  assert.strictEqual(solve(2, [[1, 0], [0, 1]]), false);
  assert.strictEqual(solve(4, [[1, 0], [2, 0], [3, 1], [3, 2]]), true);
  assert.strictEqual(solve(1, []), true);
  assert.strictEqual(solve(1, [[0, 0]]), false);
  assert.strictEqual(solve(3, [[1, 0], [2, 1], [0, 2]]), false);
  assert.strictEqual(solve(5, [[1, 4], [2, 4], [3, 1], [3, 2]]), true);
}
console.log('✓ 01-course-schedule passed');

module.exports = { optimal, bruteForce };
