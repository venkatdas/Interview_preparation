/**
 * 03. Matrix and List Conversion   (Original — Easy)
 *
 * PROBLEM
 *   Part A (optimal / bruteForce): given an n x n adjacency matrix of 0/1 values
 *   (matrix[u][v] = 1 means an edge u -> v), return the adjacency list
 *   (neighbours ascending).
 *   Part B (listToMatrix): given an adjacency list with n vertices, return the
 *   n x n 0/1 matrix. Converting A then B must give back the original matrix.
 *
 * EXAMPLES
 *   [[0,1,1],[0,0,1],[0,0,0]] -> [[1,2],[2],[]]
 *   [[1],[0],[]]              -> [[0,1,0],[1,0,0],[0,0,0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 *   - Is the matrix square? (yes)  Values only 0/1? (yes)
 *   - Undirected graphs give a symmetric matrix; nothing special is needed.
 *
 * APPROACH 1 — Brute force   O(n^2 * E) time
 *   First collect every edge (u, v) where matrix[u][v] = 1 into one big list,
 *   then for each vertex u scan that whole list for edges that start at u.
 *
 * APPROACH 2 — Optimal (row scan)   O(n^2) time, O(n + E) extra space
 *   Row u of the matrix IS u's neighbour list in disguise: walk the row once and
 *   keep the column indices that hold 1. Columns are visited in order, so the
 *   lists come out sorted for free. The reverse direction writes 1 at
 *   matrix[u][v] for every v in adj[u].
 *   Dry run [[0,1,1],[0,0,1],[0,0,0]]:
 *     row 0: cols 1, 2 -> [1,2];  row 1: col 2 -> [2];  row 2: none -> []
 *
 * EDGE CASES
 *   n = 0 -> []; all zeros -> empty lists; diagonal 1 -> self loop.
 *   Note: an O(n^2) matrix is wasteful for sparse graphs with large n.
 */
function bruteForce(matrix) {
  const edges = [];
  matrix.forEach((row, u) => row.forEach((x, v) => { if (x === 1) edges.push([u, v]); }));
  return matrix.map((_, u) => edges.filter(([a]) => a === u).map(([, b]) => b));
}

function optimal(matrix) {
  return matrix.map((row) => {
    const list = [];
    for (let v = 0; v < row.length; v++) if (row[v] === 1) list.push(v);
    return list;
  });
}

function listToMatrix(adj) {
  const n = adj.length;
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let u = 0; u < n; u++) for (const v of adj[u]) matrix[u][v] = 1;
  return matrix;
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(optimal([[0, 1, 1], [0, 0, 1], [0, 0, 0]]), [[1, 2], [2], []]);
assert.deepStrictEqual(listToMatrix([[1], [0], []]), [[0, 1, 0], [1, 0, 0], [0, 0, 0]]);
assert.deepStrictEqual(optimal([]), []);
assert.deepStrictEqual(listToMatrix([]), []);
assert.deepStrictEqual(optimal([[1]]), [[0]]); // self loop
let seed = 3;
const rand = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
for (let t = 0; t < 200; t++) {
  const n = rand(7);
  const m = Array.from({ length: n }, () => Array.from({ length: n }, () => rand(3) === 0 ? 1 : 0));
  assert.deepStrictEqual(optimal(m), bruteForce(m));
  assert.deepStrictEqual(listToMatrix(optimal(m)), m); // round trip
}
console.log('✓ 03_matrix_list_conversion passed');
module.exports = { optimal, bruteForce, listToMatrix };
