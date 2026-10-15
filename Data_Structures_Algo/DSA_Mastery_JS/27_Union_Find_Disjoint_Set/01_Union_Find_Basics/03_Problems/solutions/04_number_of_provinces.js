/**
 * 04. Number of Provinces   (LeetCode 547 — Medium)
 *
 * PROBLEM
 * isConnected is an n x n adjacency MATRIX: isConnected[i][j] = 1 if city i and city j
 * are directly connected. A province is a group of directly or indirectly connected
 * cities. Return the number of provinces.
 *
 * EXAMPLES
 * Input: [[1,1,0],[1,1,0],[0,0,1]]   Output: 2
 * Input: [[1,0,0],[0,1,0],[0,0,1]]   Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Matrix is symmetric and diagonal is 1? (yes)
 * - n up to 200 -> O(n^2) is fine
 *
 * APPROACH 1 — Alternative (DFS on the matrix)   O(n^2) time, O(n) space
 * For each unvisited city, DFS: scanning row i gives the neighbours. Count starts.
 * Shown as `dfsVersion`.
 *
 * APPROACH 2 — Optimal (Union-Find)   O(n^2 * alpha(n)) time, O(n) space
 * For every pair i < j with isConnected[i][j] === 1, union(i, j). Answer = uf.count().
 * Only the upper triangle is needed because the matrix is symmetric.
 *
 * Dry run [[1,1,0],[1,1,0],[0,0,1]]:
 *   count 3. (0,1)=1 -> union -> count 2. (0,2)=0, (1,2)=0. answer 2.
 *
 * EDGE CASES
 * - n = 1 -> 1
 * - identity matrix -> n
 * - all ones -> 1
 */

const { UnionFind } = require('../../02_Implementations/union_find');

function dfsVersion(isConnected) {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);
  function dfs(city) {
    visited[city] = true;
    for (let other = 0; other < n; other++) {
      if (isConnected[city][other] === 1 && !visited[other]) dfs(other);
    }
  }
  let provinces = 0;
  for (let city = 0; city < n; city++) {
    if (!visited[city]) { provinces++; dfs(city); }
  }
  return provinces;
}

function optimal(isConnected) {
  const n = isConnected.length;
  const uf = new UnionFind(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {              // upper triangle only (symmetric)
      if (isConnected[i][j] === 1) uf.union(i, j);
    }
  }
  return uf.count();
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [dfsVersion, optimal]) {
  assert.strictEqual(solve([[1, 1, 0], [1, 1, 0], [0, 0, 1]]), 2);
  assert.strictEqual(solve([[1, 0, 0], [0, 1, 0], [0, 0, 1]]), 3);
  assert.strictEqual(solve([[1]]), 1);
  assert.strictEqual(solve([[1, 1], [1, 1]]), 1);
  assert.strictEqual(solve([[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]), 1);
  assert.strictEqual(solve([[1, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 1]]), 3);
}
console.log('✓ 04-number-of-provinces passed');

module.exports = { optimal, dfsVersion };
