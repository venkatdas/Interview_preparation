/**
 * 01. Edge List to Adjacency List   (Original — Easy)
 *
 * PROBLEM
 *   You get n (vertices are 0..n-1), a list of edges [u, v] and a flag `directed`.
 *   Return the adjacency list: adj[u] = the neighbours of u, sorted ascending.
 *   Undirected edges appear in both lists. Duplicate edges are kept once.
 *   A self loop [u, u] appears once in adj[u].
 *
 * EXAMPLES
 *   n = 4, edges = [[0,1],[0,2],[2,1]], directed = false -> [[1,2],[0,2],[0,1],[]]
 *   n = 3, edges = [[0,1],[1,2]],       directed = true  -> [[1],[2],[]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 *   - Are vertices 0-based and all in range? (yes)
 *   - Can edges repeat? (yes -> keep one)  Self loops? (yes -> listed once)
 *   - Must neighbours be sorted? (yes, makes output deterministic)
 *
 * APPROACH 1 — Brute force   O(n^2 + E) time, O(n^2) space
 *   Fill an n x n boolean matrix, then for each row scan all n columns and collect
 *   the true ones. Simple, but n^2 work even for a sparse graph.
 *
 * APPROACH 2 — Optimal (Set per vertex)   O(n + E log E) time, O(n + E) space
 *   One Set per vertex removes duplicates. Add v to u's set (and u to v's set when
 *   undirected). Convert each Set to a sorted array at the end.
 *   Dry run n = 4, [[0,1],[0,2],[2,1]] undirected:
 *     [0,1] -> s0 {1}     s1 {0}
 *     [0,2] -> s0 {1,2}   s2 {0}
 *     [2,1] -> s2 {0,1}   s1 {0,2}
 *     sorted -> [[1,2],[0,2],[0,1],[]]
 *
 * EDGE CASES
 *   n = 0 -> []; no edges -> n empty lists; isolated vertices keep empty lists.
 */
function bruteForce(n, edges, directed = false) {
  const m = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const [u, v] of edges) {
    m[u][v] = true;
    if (!directed) m[v][u] = true;
  }
  return m.map((row) => row.flatMap((has, v) => (has ? [v] : [])));
}

function optimal(n, edges, directed = false) {
  const sets = Array.from({ length: n }, () => new Set());
  for (const [u, v] of edges) {
    sets[u].add(v);
    if (!directed) sets[v].add(u);
  }
  return sets.map((s) => [...s].sort((a, b) => a - b));
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(optimal(4, [[0, 1], [0, 2], [2, 1]]), [[1, 2], [0, 2], [0, 1], []]);
assert.deepStrictEqual(optimal(3, [[0, 1], [1, 2]], true), [[1], [2], []]);
assert.deepStrictEqual(optimal(0, []), []);
assert.deepStrictEqual(optimal(2, []), [[], []]);
assert.deepStrictEqual(optimal(2, [[0, 1], [1, 0], [0, 1]]), [[1], [0]]); // duplicates
assert.deepStrictEqual(optimal(2, [[1, 1]]), [[], [1]]);                   // self loop
let seed = 7;
const rand = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
for (let t = 0; t < 200; t++) {
  const n = 1 + rand(8);
  const edges = Array.from({ length: rand(15) }, () => [rand(n), rand(n)]);
  const directed = rand(2) === 1;
  assert.deepStrictEqual(optimal(n, edges, directed), bruteForce(n, edges, directed));
}
console.log('✓ 01_edge_list_to_adjacency_list passed');
module.exports = { optimal, bruteForce };
