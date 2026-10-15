/**
 * 04. Vertical Columns   (Original — Medium)
 *
 * PROBLEM
 * Picture a binary tree (level-order array, null = missing) drawn on a grid: the root is
 * at (row 0, col 0); a left child is at (row + 1, col - 1); a right child at
 * (row + 1, col + 1). Return the values column by column from the leftmost column to the
 * rightmost. Inside one column list values top to bottom (by row); if two nodes share
 * both row and column, list the smaller value first.
 *
 * EXAMPLES
 * Input: [3, 9, 20, null, null, 15, 7]   Output: [[9], [3, 15], [20], [7]]
 * Input: [1, 2, 3, 4, 6, 5, 7]           Output: [[4], [2], [1, 5, 6], [3], [7]]
 *        Explanation: 5 and 6 share (row 2, col 0) -> 5 first
 * Input: []                              Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^4 nodes. Values may repeat.
 * - Same row + same column -> smaller value first (state this rule out loud; it is the trap).
 *
 * APPROACH 1 — Brute force   O(n * C + n log n) time, O(n) space
 * Collect (row, col, val) for every node. For each column from min to max, filter the
 * nodes in that column and sort them by (row, val).
 *
 * APPROACH 2 — Optimal (BFS with coordinates + hash map of columns + sort per column)   O(n log n) time, O(n) space
 * BFS visits nodes row by row, so pushing (row, val) into map[col] keeps rows in order
 * already; only same-row ties need sorting. Track min/max column to emit columns without
 * sorting the keys. Sort each column by (row, val) — cheap, and safe.
 *
 * Dry run on [1, 2, 3, 4, 6, 5, 7]:
 *   row 0: 1 at col 0
 *   row 1: 2 at -1, 3 at +1
 *   row 2: 4 at -2, 6 at 0, 5 at 0, 7 at +2
 *   col 0 holds (0,1), (2,6), (2,5) -> sorted (0,1), (2,5), (2,6) -> [1, 5, 6]
 *   answer [[4], [2], [1, 5, 6], [3], [7]]
 *
 * EDGE CASES
 * - empty tree -> []
 * - single node -> [[val]]
 * - a long left chain -> one value per column
 *
 * COMMON MISTAKES
 * - DFS without sorting by row: deeper nodes from the left subtree come first.
 * - Sorting only by value inside a column (destroys the top-to-bottom order).
 */

// Build a binary tree from a LeetCode-style level-order array (null = missing child).
function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1, head = 0;
  while (i < arr.length && head < queue.length) { // extra entries under missing parents are ignored
    const node = queue[head++];
    if (i < arr.length && arr[i] !== null) { node.left = { val: arr[i], left: null, right: null }; queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = { val: arr[i], left: null, right: null }; queue.push(node.right); }
    i++;
  }
  return root;
}

function bruteForce(arr) {
  const pts = [];
  (function walk(n, r, c) { if (!n) return; pts.push([r, c, n.val]); walk(n.left, r + 1, c - 1); walk(n.right, r + 1, c + 1); })(buildTree(arr), 0, 0);
  if (!pts.length) return [];
  const cols = pts.map((p) => p[1]);
  const out = [];
  for (let c = Math.min(...cols); c <= Math.max(...cols); c++) {
    const inCol = pts.filter((p) => p[1] === c).sort((a, b) => a[0] - b[0] || a[2] - b[2]);
    out.push(inCol.map((p) => p[2]));
  }
  return out;
}

function optimal(arr) {
  const root = buildTree(arr);
  if (!root) return [];
  const byCol = new Map();
  let minC = 0, maxC = 0;
  const queue = [[root, 0, 0]];
  for (let h = 0; h < queue.length; h++) {
    const [node, r, c] = queue[h];
    if (!byCol.has(c)) byCol.set(c, []);
    byCol.get(c).push([r, node.val]);
    minC = Math.min(minC, c); maxC = Math.max(maxC, c);
    if (node.left) queue.push([node.left, r + 1, c - 1]);
    if (node.right) queue.push([node.right, r + 1, c + 1]);
  }
  const out = [];
  for (let c = minC; c <= maxC; c++) out.push(byCol.get(c).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[1]));
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([3, 9, 20, null, null, 15, 7]), [[9], [3, 15], [20], [7]]);
  assert.deepStrictEqual(solve([1, 2, 3, 4, 6, 5, 7]), [[4], [2], [1, 5, 6], [3], [7]]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([8]), [[8]]);
  assert.deepStrictEqual(solve([1, 2, null, 3]), [[3], [2], [1]]);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(404);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 16);
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(i > 0 && rand() < 0.25 ? null : Math.floor(rand() * 10));
  assert.deepStrictEqual(optimal(arr), bruteForce(arr));
}
console.log('✓ set_04/04_vertical_columns passed');
module.exports = { optimal, bruteForce, buildTree };
