/**
 * 09. Clone Graph   (LeetCode 133 — Medium)
 *
 * PROBLEM
 * Given a reference to a node of a connected undirected graph, return a DEEP copy of
 * the graph. Each node has `val` (unique) and `neighbors` (array of nodes).
 *
 * EXAMPLES
 * Input: adjacency [[2,4],[1,3],[2,4],[1,3]]  (node 1 links 2,4; node 2 links 1,3; ...)
 * Output: a new graph with the same shape; no node object is shared with the input.
 * Input: null  Output: null
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are values unique? (yes, 1..100 - lets us key a map by val)
 * - Can the graph have cycles? (yes - it is undirected, so every edge is a 2-cycle;
 *   this is why we need the map BEFORE recursing)
 * - Single node with no neighbours? (return a copy with empty neighbors)
 *
 * APPROACH 1 — Brute force (two passes: BFS to collect all nodes, then copy edges)
 *   O(V + E) time, O(V) space
 *   1. BFS from the given node, collecting every node into a list.
 *   2. Create a blank copy for every node (map val -> copy).
 *   3. Second pass: for every original node, for every neighbour, push the copy.
 * Clear but two passes.
 *
 * APPROACH 2 — Optimal (DFS with a Map old -> new)   O(V + E) time, O(V) space
 *   clone(node):
 *     if node already cloned -> return the existing copy   (handles cycles)
 *     create copy, STORE IT IN THE MAP NOW (before recursing!)
 *     for each neighbour: copy.neighbors.push(clone(neighbour))
 *     return copy
 *
 * Dry run on 1 - 2 (two nodes connected):
 *   clone(1): map {1: 1'}; neighbours [2] -> clone(2)
 *     clone(2): map {1: 1', 2: 2'}; neighbours [1] -> clone(1) is in map -> 1'
 *       2'.neighbors = [1']
 *     1'.neighbors = [2']
 *   If we stored 1' in the map AFTER recursing, clone(1) inside clone(2) would recurse
 *   again forever.
 *
 * EDGE CASES
 * - null input -> null
 * - single node, no neighbours
 * - must not share any object with the input (test checks identity)
 */

class Node {
  constructor(val, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

function bruteForce(node) {
  if (!node) return null;
  // pass 1: collect all nodes with BFS
  const all = [];
  const seen = new Set([node]);
  const queue = [node];
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    all.push(current);
    for (const next of current.neighbors) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  // pass 2: blank copies, then wire edges
  const copies = new Map(all.map((original) => [original, new Node(original.val)]));
  for (const original of all) {
    copies.get(original).neighbors = original.neighbors.map((nb) => copies.get(nb));
  }
  return copies.get(node);
}

function optimal(node) {
  if (!node) return null;
  const copies = new Map(); // original -> copy

  function clone(original) {
    if (copies.has(original)) return copies.get(original);
    const copy = new Node(original.val);
    copies.set(original, copy);                     // BEFORE recursing (cycles!)
    for (const neighbor of original.neighbors) {
      copy.neighbors.push(clone(neighbor));
    }
    return copy;
  }

  return clone(node);
}

// ---------- tests ----------
const assert = require('assert');

// helper: build a graph from an adjacency list (1-indexed like LeetCode) and back
function build(adjList) {
  const nodes = adjList.map((_, i) => new Node(i + 1));
  adjList.forEach((nbrs, i) => { nodes[i].neighbors = nbrs.map((v) => nodes[v - 1]); });
  return nodes[0];
}
function toAdjList(start) {
  if (!start) return [];
  const seen = new Map();
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur.val)) continue;
    seen.set(cur.val, cur.neighbors.map((n) => n.val));
    stack.push(...cur.neighbors);
  }
  return [...seen.keys()].sort((a, b) => a - b).map((v) => seen.get(v));
}
function collect(start) {
  const set = new Set();
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop();
    if (set.has(cur)) continue;
    set.add(cur);
    stack.push(...cur.neighbors);
  }
  return set;
}

for (const solve of [bruteForce, optimal]) {
  const input = [[2, 4], [1, 3], [2, 4], [1, 3]];
  const original = build(input);
  const copy = solve(original);
  assert.deepStrictEqual(toAdjList(copy), input);              // same shape
  assert.notStrictEqual(copy, original);                       // different object
  const originals = collect(original);
  for (const n of collect(copy)) assert.ok(!originals.has(n)); // no shared nodes

  assert.strictEqual(solve(null), null);
  const single = solve(new Node(1));
  assert.deepStrictEqual(toAdjList(single), [[]]);
  assert.deepStrictEqual(toAdjList(solve(build([[2], [1]]))), [[2], [1]]);
  assert.deepStrictEqual(toAdjList(solve(build([[2, 3], [1, 3], [1, 2]]))), [[2, 3], [1, 3], [1, 2]]);
}
console.log('✓ 09-clone-graph passed');

module.exports = { optimal, bruteForce, Node };
