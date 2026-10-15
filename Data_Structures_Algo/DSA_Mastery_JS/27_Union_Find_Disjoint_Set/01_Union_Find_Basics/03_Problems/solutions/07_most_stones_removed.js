/**
 * 07. Most Stones Removed with Same Row or Column   (LeetCode 947 — Medium)
 *
 * PROBLEM
 * Stones sit on integer grid points, at most one per point. A stone can be removed if
 * another stone shares its row OR its column. Return the maximum number of stones that
 * can be removed.
 *
 * EXAMPLES
 * Input: [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]   Output: 5
 * Input: [[0,0],[0,2],[1,1],[2,0],[2,2]]         Output: 3
 * Input: [[0,0]]                                 Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Coordinates up to 10^4 -> rows and columns can be used as node ids directly
 * - At most 1000 stones
 *
 * KEY INSIGHT: stones that share rows/columns form connected components. In any
 * component you can remove every stone except one (remove leaves first, like peeling
 * a tree). So:  answer = stones - number of components.
 *
 * APPROACH 1 — Brute force (DFS over stones, O(n^2) edges)   O(n^2) time
 * Treat each stone as a node; two stones are adjacent if same row or same column.
 * Count components with DFS by comparing every pair. 1000 stones -> 10^6 checks, fine.
 *
 * APPROACH 2 — Optimal (Union-Find on rows and columns)   O(n * alpha) time, O(n) space
 * Clever trick: do not union stones; union the stone's ROW with its COLUMN. Give columns
 * ids offset by 10001 so they never collide with row ids. Every stone merges its row set
 * and column set. Number of components = number of distinct roots among the row/column
 * ids that actually appear.
 *
 * Dry run on [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]:
 *   stone (0,0): union(row0, col0)   stone (0,1): union(row0, col1)
 *   stone (1,0): union(row1, col0)   stone (1,2): union(row1, col2)
 *   stone (2,1): union(row2, col1)   stone (2,2): union(row2, col2)
 *   everything is one component -> 6 - 1 = 5
 *
 * EDGE CASES
 * - one stone -> 0
 * - no two stones share anything -> 0
 * - all in one row -> n - 1
 */

const { UnionFindMap } = require('../../02_Implementations/union_find');

function bruteForce(stones) {
  const n = stones.length;
  const visited = new Array(n).fill(false);
  let components = 0;
  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    components++;
    const stack = [start];
    visited[start] = true;
    while (stack.length) {
      const i = stack.pop();
      for (let j = 0; j < n; j++) {
        if (visited[j]) continue;
        if (stones[i][0] === stones[j][0] || stones[i][1] === stones[j][1]) {
          visited[j] = true;
          stack.push(j);
        }
      }
    }
  }
  return n - components;
}

function optimal(stones) {
  const uf = new UnionFindMap();
  for (const [row, col] of stones) {
    uf.union(`r${row}`, `c${col}`);     // the stone glues its row to its column
  }
  return stones.length - uf.count();    // keep one stone per component
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [2, 2]]), 5);
  assert.strictEqual(solve([[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]]), 3);
  assert.strictEqual(solve([[0, 0]]), 0);
  assert.strictEqual(solve([[0, 0], [1, 1], [2, 2]]), 0);
  assert.strictEqual(solve([[0, 0], [0, 1], [0, 2]]), 2);
  assert.strictEqual(solve([[0, 1], [1, 0], [1, 1]]), 2);
}
console.log('✓ 07-most-stones-removed passed');

module.exports = { optimal, bruteForce };
