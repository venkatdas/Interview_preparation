/**
 * 04. Reverse a Directed Graph   (Original — Medium)
 *
 * PROBLEM
 *   A directed graph is given as an adjacency list adj (vertices 0..n-1,
 *   adj[u] lists every v with an edge u -> v). Return the REVERSED graph
 *   (also called the transpose): every edge u -> v becomes v -> u.
 *   Neighbour lists in the answer must be sorted ascending; repeated edges stay repeated.
 *
 * EXAMPLES
 *   [[1,2],[2],[]]  -> [[],[0],[0,1]]
 *   [[1],[0]]       -> [[1],[0]]        (a 2-cycle is its own reverse)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 *   - Modify the input or return a new graph? (return new; do not mutate)
 *   - Self loops? (u -> u stays u -> u)
 *
 * WHY IT MATTERS
 *   "Who can reach target t?" is "who does t reach in the reversed graph?".
 *   Kosaraju's SCC algorithm and many "reverse BFS from the goal" tricks use it.
 *
 * APPROACH 1 — Brute force   O(n * (n + E)) time
 *   For each vertex v, scan every list adj[u] and collect u each time v appears.
 *
 * APPROACH 2 — Optimal (one pass over edges)   O(n + E) time, O(n + E) space
 *   Create n empty lists. For every u and every v in adj[u], push u into rev[v].
 *   Because u increases in the outer loop, each rev[v] comes out already sorted,
 *   so no sort is needed.
 *   Dry run [[1,2],[2],[]]:
 *     u=0: 0->1 => rev[1]=[0];  0->2 => rev[2]=[0]
 *     u=1: 1->2 => rev[2]=[0,1]
 *     -> [[],[0],[0,1]]
 *
 * EDGE CASES
 *   empty graph -> []; vertices with no edges keep empty lists; reversing twice
 *   gives back the original (with sorted lists).
 */
function bruteForce(adj) {
  const n = adj.length;
  const rev = [];
  for (let v = 0; v < n; v++) {
    const list = [];
    for (let u = 0; u < n; u++) for (const w of adj[u]) if (w === v) list.push(u);
    rev.push(list);
  }
  return rev;
}

function optimal(adj) {
  const rev = Array.from({ length: adj.length }, () => []);
  for (let u = 0; u < adj.length; u++) {
    for (const v of adj[u]) rev[v].push(u); // u increases, so each list stays sorted
  }
  return rev;
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(optimal([[1, 2], [2], []]), [[], [0], [0, 1]]);
assert.deepStrictEqual(optimal([[1], [0]]), [[1], [0]]);
assert.deepStrictEqual(optimal([]), []);
assert.deepStrictEqual(optimal([[0]]), [[0]]);              // self loop
assert.deepStrictEqual(optimal([[1, 1], []]), [[], [0, 0]]); // repeated edge stays repeated
const input = [[1], []];
optimal(input);
assert.deepStrictEqual(input, [[1], []]);                    // input not mutated
let seed = 5;
const rand = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
for (let t = 0; t < 200; t++) {
  const n = rand(8);
  const adj = Array.from({ length: n }, () => Array.from({ length: rand(4) }, () => rand(n)).sort((a, b) => a - b));
  assert.deepStrictEqual(optimal(adj), bruteForce(adj));
  assert.deepStrictEqual(optimal(optimal(adj)), adj); // reverse twice = original
}
console.log('✓ 04_reverse_directed_graph passed');
module.exports = { optimal, bruteForce };
