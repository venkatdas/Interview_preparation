/**
 * 04. Optimize Water Distribution in a Village   (LeetCode 1168 — Hard)
 *
 * PROBLEM
 * n houses 1..n. You can supply water to house i either by building a WELL at cost
 * wells[i-1], or by laying a PIPE between two houses: pipes[j] = [house1, house2, cost]
 * (undirected). A house with water can pass it on through pipes. Return the minimum total
 * cost to give every house water.
 *
 * EXAMPLES
 * Input: n = 3, wells = [1,2,2], pipes = [[1,2,1],[2,3,1]]   Output: 3
 * Explanation: well at house 1 (1), pipe 1-2 (1), pipe 2-3 (1).
 * Input: n = 2, wells = [1,1], pipes = [[1,2,1],[1,2,2]]     Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can every house get a well? (yes, so a solution always exists)
 * - Can there be several wells? (yes - each well starts its own supply)
 *
 * THE TRICK: add a VIRTUAL house 0 that is "the water source". Building a well at house
 * i is the same as laying a pipe 0 - i with cost wells[i-1]. Now every house must be
 * connected to the component containing 0 as cheaply as possible = MST on n + 1 nodes.
 *
 * APPROACH 1 — Brute force (choose which houses get wells, MST the rest)   exponential
 * Try every subset of houses to receive wells, then connect everything to them via
 * cheapest pipes (Kruskal with the well houses pre-unioned to a virtual node). 2^n
 * subsets - only for tiny n, but it shows WHY the virtual node is equivalent.
 *
 * APPROACH 2 — Optimal (virtual node + Kruskal)   O((n + p) log(n + p))
 *   1. edges = pipes + [0, i, wells[i-1]] for every house i.
 *   2. Kruskal on n + 1 nodes; the answer is the MST weight.
 *
 * Dry run n=3, wells [1,2,2], pipes [[1,2,1],[2,3,1]]:
 *   edges: (0,1,1) (0,2,2) (0,3,2) (1,2,1) (2,3,1)   sorted by cost
 *   take (0,1,1) take (1,2,1) take (2,3,1) -> 3 edges = n, done. total 3
 *
 * EDGE CASES
 * - no pipes -> sum of all wells
 * - pipes very cheap -> one well + pipes
 * - duplicate pipes with different costs
 */

const { UnionFind } = require('../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find');

function kruskalWeight(nodeCount, edges, preUnions = []) {
  const uf = new UnionFind(nodeCount);
  let total = 0;
  let used = 0;
  for (const [a, b] of preUnions) if (uf.union(a, b)) used++;
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  for (const [u, v, w] of sorted) {
    if (!uf.union(u, v)) continue;
    total += w;
    if (++used === nodeCount - 1) break;
  }
  return used === nodeCount - 1 ? total : Infinity;
}

function bruteForce(n, wells, pipes) {
  let best = Infinity;
  for (let mask = 1; mask < 1 << n; mask++) {          // at least one well
    let wellCost = 0;
    const preUnions = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) { wellCost += wells[i]; preUnions.push([0, i + 1]); }
    }
    const pipeCost = kruskalWeight(n + 1, pipes, preUnions);
    best = Math.min(best, wellCost + pipeCost);
  }
  return best;
}

function optimal(n, wells, pipes) {
  const edges = [...pipes];
  for (let house = 1; house <= n; house++) {
    edges.push([0, house, wells[house - 1]]);     // a well = pipe from the virtual source
  }
  return kruskalWeight(n + 1, edges);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(3, [1, 2, 2], [[1, 2, 1], [2, 3, 1]]), 3);
  assert.strictEqual(solve(2, [1, 1], [[1, 2, 1], [1, 2, 2]]), 2);
  assert.strictEqual(solve(1, [5], []), 5);
  assert.strictEqual(solve(3, [4, 4, 4], []), 12);
  assert.strictEqual(solve(3, [10, 1, 10], [[1, 2, 2], [2, 3, 2]]), 5);
  assert.strictEqual(solve(4, [1, 1, 1, 1], [[1, 2, 100], [3, 4, 100]]), 4);
}
console.log('✓ 04-optimize-water-distribution passed');

module.exports = { optimal, bruteForce };
