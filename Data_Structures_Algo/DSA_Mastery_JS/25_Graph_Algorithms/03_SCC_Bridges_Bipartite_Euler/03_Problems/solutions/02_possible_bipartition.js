/**
 * 02. Possible Bipartition   (LeetCode 886 — Medium)
 *
 * PROBLEM
 * n people labelled 1..n. dislikes[i] = [a, b] means a and b must NOT be in the same
 * group. Can you split everyone into two groups?
 *
 * EXAMPLES
 * Input: n = 4, dislikes = [[1,2],[1,3],[2,4]]         Output: true   ({1,4} and {2,3})
 * Input: n = 3, dislikes = [[1,2],[1,3],[2,3]]         Output: false  (triangle)
 * Input: n = 5, dislikes = [[1,2],[2,3],[3,4],[4,5],[1,5]]   Output: false (5-cycle)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1-indexed people? (yes)
 * - People with no dislikes? (go anywhere)
 *
 * It is exactly "is the dislike graph bipartite".
 *
 * APPROACH 1 — Alternative (union-find with "enemy" nodes)   O((n + d) * alpha)
 * Use a UnionFind of size 2n: node i and node i + n ("the group opposite to i").
 * For each dislike (a, b): if a and b are already in the same set -> false.
 * Otherwise union(a, b + n) and union(b, a + n): "a is with b's enemies, b with a's".
 * Shown as `unionFindVersion`.
 *
 * APPROACH 2 — Optimal (BFS 2-colouring)   O(n + d) time, O(n + d) space
 * Build an adjacency list over 1..n, then run the bipartite BFS from every uncoloured
 * person.
 *
 * Dry run n=4, [[1,2],[1,3],[2,4]]:
 *   color 1 = 0 -> 2 = 1, 3 = 1 -> from 2: 4 = 0. No conflicts -> true.
 *
 * EDGE CASES
 * - no dislikes -> true
 * - n = 1
 * - duplicate dislike pairs
 */

const { UnionFind } = require('../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find');

function unionFindVersion(n, dislikes) {
  const uf = new UnionFind(2 * (n + 1));            // i and i + (n + 1) = enemy of i
  const enemy = (i) => i + n + 1;
  for (const [a, b] of dislikes) {
    if (uf.connected(a, b)) return false;           // forced into the same group
    uf.union(a, enemy(b));
    uf.union(b, enemy(a));
  }
  return true;
}

function optimal(n, dislikes) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) { adj[a].push(b); adj[b].push(a); }
  const color = new Array(n + 1).fill(-1);
  for (let start = 1; start <= n; start++) {
    if (color[start] !== -1) continue;
    color[start] = 0;
    const queue = [start];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of adj[u]) {
        if (color[v] === -1) { color[v] = 1 - color[u]; queue.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [unionFindVersion, optimal]) {
  assert.strictEqual(solve(4, [[1, 2], [1, 3], [2, 4]]), true);
  assert.strictEqual(solve(3, [[1, 2], [1, 3], [2, 3]]), false);
  assert.strictEqual(solve(5, [[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]]), false);
  assert.strictEqual(solve(1, []), true);
  assert.strictEqual(solve(4, []), true);
  assert.strictEqual(solve(4, [[1, 2], [1, 2], [3, 4]]), true);
  assert.strictEqual(solve(6, [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]]), true); // even cycle
}
console.log('✓ 02-possible-bipartition passed');

module.exports = { optimal, unionFindVersion };
