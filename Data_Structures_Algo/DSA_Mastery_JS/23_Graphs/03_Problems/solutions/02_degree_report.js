/**
 * 02. Degree Report   (Original — Easy)
 *
 * PROBLEM
 *   A directed graph has vertices 0..n-1 and edges [u, v] meaning u -> v.
 *   Return { inDegree, outDegree, sources, sinks } where
 *     inDegree[v]  = number of edges pointing INTO v
 *     outDegree[v] = number of edges leaving v
 *     sources      = vertices with inDegree 0 (ascending)
 *     sinks        = vertices with outDegree 0 (ascending)
 *   Every edge counts, including repeated edges and self loops.
 *
 * EXAMPLES
 *   n = 4, edges = [[0,1],[0,2],[1,2]]
 *   -> inDegree [0,1,2,0], outDegree [2,1,0,0], sources [0,3], sinks [2,3]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 *   - Directed? (yes)  Isolated vertex? (it is both a source and a sink)
 *   - Self loop [v, v]? (adds 1 to both inDegree[v] and outDegree[v])
 *
 * APPROACH 1 — Brute force   O(n * E) time, O(n) space
 *   For every vertex, scan the whole edge list and count how often it appears
 *   as a start and as an end.
 *
 * APPROACH 2 — Optimal (one pass)   O(n + E) time, O(n) space
 *   Each edge [u, v] adds one to outDegree[u] and one to inDegree[v]. One pass
 *   over the edges, one pass over the vertices to collect sources and sinks.
 *   Dry run n = 4, [[0,1],[0,2],[1,2]]:
 *     [0,1] out[0]=1 in[1]=1;  [0,2] out[0]=2 in[2]=1;  [1,2] out[1]=1 in[2]=2
 *     sources: in = 0 -> 0, 3;  sinks: out = 0 -> 2, 3
 *
 * EDGE CASES
 *   n = 0 -> all empty; no edges -> every vertex is a source and a sink.
 *   Topological sort (Kahn) starts from exactly these sources.
 */
function bruteForce(n, edges) {
  const inDegree = [], outDegree = [];
  for (let v = 0; v < n; v++) {
    let i = 0, o = 0;
    for (const [a, b] of edges) { if (a === v) o++; if (b === v) i++; }
    inDegree.push(i); outDegree.push(o);
  }
  return finish(inDegree, outDegree);
}

function optimal(n, edges) {
  const inDegree = new Array(n).fill(0);
  const outDegree = new Array(n).fill(0);
  for (const [u, v] of edges) {
    outDegree[u]++;
    inDegree[v]++;
  }
  return finish(inDegree, outDegree);
}

function finish(inDegree, outDegree) {
  const sources = [], sinks = [];
  for (let v = 0; v < inDegree.length; v++) {
    if (inDegree[v] === 0) sources.push(v);
    if (outDegree[v] === 0) sinks.push(v);
  }
  return { inDegree, outDegree, sources, sinks };
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(optimal(4, [[0, 1], [0, 2], [1, 2]]),
  { inDegree: [0, 1, 2, 0], outDegree: [2, 1, 0, 0], sources: [0, 3], sinks: [2, 3] });
assert.deepStrictEqual(optimal(0, []), { inDegree: [], outDegree: [], sources: [], sinks: [] });
assert.deepStrictEqual(optimal(2, []).sources, [0, 1]);
assert.deepStrictEqual(optimal(1, [[0, 0]]), { inDegree: [1], outDegree: [1], sources: [], sinks: [] });
assert.deepStrictEqual(optimal(2, [[0, 1], [0, 1]]).inDegree, [0, 2]); // repeated edge counts twice
assert.deepStrictEqual(optimal(3, [[0, 1], [1, 2], [2, 0]]).sources, []); // cycle: no source
let seed = 11;
const rand = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
for (let t = 0; t < 200; t++) {
  const n = 1 + rand(8);
  const edges = Array.from({ length: rand(15) }, () => [rand(n), rand(n)]);
  assert.deepStrictEqual(optimal(n, edges), bruteForce(n, edges));
}
console.log('✓ 02_degree_report passed');
module.exports = { optimal, bruteForce };
