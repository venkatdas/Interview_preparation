/**
 * 07. Vertical Order Traversal of a Binary Tree   (LeetCode 987 — Hard)
 *
 * PROBLEM
 * Give the root position (row 0, col 0). A node at (row, col) has its left child at
 * (row+1, col-1) and right child at (row+1, col+1). Return the values column by column
 * (left to right). Inside a column, order by row (top to bottom); nodes with the SAME
 * row and column are ordered by value.
 *
 * EXAMPLES
 * Input: [3,9,20,null,null,15,7]   Output: [[9],[3,15],[20],[7]]
 * Input: [1,2,3,4,5,6,7]           Output: [[4],[2],[1,5,6],[3],[7]]
 *        Explanation: 5 and 6 are both at (2, 0); 5 < 6 so 5 comes first
 * Input: [1,2,3,4,6,5,7]           Output: [[4],[2],[1,5,6],[3],[7]]   (same cell, sorted by value)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Tie-break for the same (row, col): by value? (yes; LeetCode 314 "Vertical Order"
 *   instead orders ties left-to-right, which is a BFS without sorting)
 * - Empty tree -> []
 *
 * APPROACH 1 — Brute force (collect triples, sort everything, group)   O(n log n) time, O(n) space
 * DFS collecting (col, row, val) for every node. Sort by col, then row, then val.
 * Group consecutive equal cols. One big sort does all the ordering at once.
 *
 * APPROACH 2 — Optimal (BFS into a Map col -> cells, sort only within columns)   O(n log n) worst, O(n) space
 * BFS visits rows in order, so inside a column the rows already arrive sorted. Only
 * nodes sharing a (row, col) cell need sorting by value. Keep a Map col -> array of
 * {row, val}; track minCol/maxCol to output columns in order without sorting the keys.
 * Worst case is still O(n log n) (all nodes in one cell), but usually close to O(n).
 *
 * Dry run on [1,2,3,4,5,6,7]:
 *   BFS: (1: r0 c0) (2: r1 c-1) (3: r1 c1) (4: r2 c-2) (5: r2 c0) (6: r2 c0) (7: r2 c2)
 *   col -2: [4]   col -1: [2]   col 0: [1, 5, 6]   col 1: [3]   col 2: [7]
 *   cell (r2, c0) holds 5, 6 -> sort by value -> 5, 6
 *
 * EDGE CASES
 * - empty -> []
 * - all nodes in one column (a zigzag path)
 * - same cell with values that need reordering: [1,2,3,4,6,5,7] -> 5 before 6
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  const cells = [];
  (function dfs(node, row, col) {
    if (!node) return;
    cells.push({ col, row, val: node.val });
    dfs(node.left, row + 1, col - 1);
    dfs(node.right, row + 1, col + 1);
  })(root, 0, 0);
  cells.sort((a, b) => a.col - b.col || a.row - b.row || a.val - b.val);
  const result = [];
  for (let i = 0; i < cells.length; i++) {
    if (i === 0 || cells[i].col !== cells[i - 1].col) result.push([]);
    result[result.length - 1].push(cells[i].val);
  }
  return result;
}

function optimal(root) {
  if (!root) return [];
  const columns = new Map();              // col -> [{row, val}] in BFS (row) order
  let minCol = 0, maxCol = 0;
  const queue = [[root, 0, 0]];
  while (queue.length) {
    const [node, row, col] = queue.shift();
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col).push({ row, val: node.val });
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left) queue.push([node.left, row + 1, col - 1]);
    if (node.right) queue.push([node.right, row + 1, col + 1]);
  }
  const result = [];
  for (let col = minCol; col <= maxCol; col++) {
    const cells = columns.get(col);
    cells.sort((a, b) => a.row - b.row || a.val - b.val); // rows already sorted; this fixes same-cell ties
    result.push(cells.map((cell) => cell.val));
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(buildTree([3, 9, 20, null, null, 15, 7])), [[9], [3, 15], [20], [7]]);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, 4, 5, 6, 7])), [[4], [2], [1, 5, 6], [3], [7]]);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, 4, 6, 5, 7])), [[4], [2], [1, 5, 6], [3], [7]]);
  assert.deepStrictEqual(solve(buildTree([])), []);
  assert.deepStrictEqual(solve(buildTree([1])), [[1]]);
  assert.deepStrictEqual(solve(buildTree([1, 2, null, null, 3, 4])), [[2, 4], [1, 3]]);  // zigzag: 3 is back at col 0, 4 at col -1
  assert.deepStrictEqual(solve(buildTree([3, 1, 4, 0, 2, 2])), [[0], [1], [3, 2, 2], [4]]);
}
console.log('✓ 07-vertical-order-traversal passed');

module.exports = { optimal, bruteForce };
