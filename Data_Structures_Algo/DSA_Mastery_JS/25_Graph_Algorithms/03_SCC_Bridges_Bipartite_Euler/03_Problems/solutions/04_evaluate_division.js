/**
 * 04. Evaluate Division   (LeetCode 399 — Medium)
 *
 * PROBLEM
 * equations[i] = [A, B] with values[i] = A / B. Answer queries [C, D] = C / D using the
 * known ratios, or -1.0 if it cannot be determined (unknown variable or no connection).
 *
 * EXAMPLES
 * Input: equations = [["a","b"],["b","c"]], values = [2.0,3.0],
 *        queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
 * Output: [6.0, 0.5, -1.0, 1.0, -1.0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values are positive, no division by zero? (yes)
 * - A variable that never appears (even "x"/"x") -> -1
 * - Contradictory equations? (assume consistent)
 *
 * MODEL: a weighted DIRECTED graph. Edge A -> B with weight A/B, and B -> A with weight
 * B/A. The value of C / D is the PRODUCT of the weights along any path C -> D.
 *
 * APPROACH 1 — Alternative (weighted DFS per query)   O(Q * (V + E))
 * For each query, DFS from C to D multiplying weights. Simple and usually accepted.
 * Shown as `dfsVersion`.
 *
 * APPROACH 2 — Optimal (weighted union-find)   O((E + Q) * alpha) after building
 * Keep parent[x] and weight[x] = x / parent[x]. find(x) compresses the path and updates
 * weight[x] = x / root. union(a, b, ratio) attaches root(a) under root(b) with the weight
 * that makes a / b = ratio consistent:
 *   weight[rootA] = ratio * weight[b] / weight[a]
 * Query C / D: same root? -> weight[C] / weight[D]  (both are relative to the root).
 *
 * Dry run equations a/b=2, b/c=3:
 *   union(a,b,2): rootA = a, rootB = b -> parent[a] = b, weight[a] = 2
 *   union(b,c,3): rootB = b, rootC = c -> parent[b] = c, weight[b] = 3
 *   query a/c: find(a) compresses: weight[a] = 2 * 3 = 6, parent c; find(c) = c, weight 1
 *              -> 6 / 1 = 6.   query b/a: weight[b]=3, weight[a]=6 -> 3/6 = 0.5
 *
 * EDGE CASES
 * - query with unknown variable -> -1
 * - query x / x where x exists -> 1
 * - two disconnected groups -> -1 between them
 */

function dfsVersion(equations, values, queries) {
  const adj = new Map();
  const add = (a, b, w) => {
    if (!adj.has(a)) adj.set(a, []);
    adj.get(a).push([b, w]);
  };
  equations.forEach(([a, b], i) => { add(a, b, values[i]); add(b, a, 1 / values[i]); });

  function evaluate(start, target) {
    if (!adj.has(start) || !adj.has(target)) return -1;
    const visited = new Set([start]);
    const stack = [[start, 1]];
    while (stack.length) {
      const [node, product] = stack.pop();
      if (node === target) return product;
      for (const [next, w] of adj.get(node)) {
        if (!visited.has(next)) { visited.add(next); stack.push([next, product * w]); }
      }
    }
    return -1;
  }
  return queries.map(([c, d]) => evaluate(c, d));
}

function optimal(equations, values, queries) {
  const parent = new Map();
  const weight = new Map();                       // weight[x] = x / parent[x]

  function add(x) {
    if (!parent.has(x)) { parent.set(x, x); weight.set(x, 1); }
  }
  function find(x) {                              // returns root; makes weight[x] = x / root
    if (parent.get(x) !== x) {
      const p = parent.get(x);
      const root = find(p);
      weight.set(x, weight.get(x) * weight.get(p)); // x/p * p/root = x/root
      parent.set(x, root);
    }
    return parent.get(x);
  }
  function union(a, b, ratio) {                   // a / b = ratio
    add(a); add(b);
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return;
    parent.set(rootA, rootB);
    // rootA / rootB = (a / rootA)^-1 * (a / b) * (b / rootB)
    weight.set(rootA, ratio * weight.get(b) / weight.get(a));
  }

  equations.forEach(([a, b], i) => union(a, b, values[i]));

  return queries.map(([c, d]) => {
    if (!parent.has(c) || !parent.has(d)) return -1;
    if (find(c) !== find(d)) return -1;
    return weight.get(c) / weight.get(d);         // (c/root) / (d/root) = c/d
  });
}

// ---------- tests ----------
const assert = require('assert');
const close = (xs, ys) => xs.length === ys.length && xs.every((x, i) => Math.abs(x - ys[i]) < 1e-9);
for (const solve of [dfsVersion, optimal]) {
  assert.ok(close(
    solve([['a', 'b'], ['b', 'c']], [2.0, 3.0], [['a', 'c'], ['b', 'a'], ['a', 'e'], ['a', 'a'], ['x', 'x']]),
    [6.0, 0.5, -1.0, 1.0, -1.0],
  ));
  assert.ok(close(
    solve([['a', 'b'], ['b', 'c'], ['bc', 'cd']], [1.5, 2.5, 5.0], [['a', 'c'], ['c', 'b'], ['bc', 'cd'], ['cd', 'bc']]),
    [3.75, 0.4, 5.0, 0.2],
  ));
  assert.ok(close(solve([['a', 'b']], [0.5], [['a', 'b'], ['b', 'a'], ['a', 'c'], ['x', 'y']]), [0.5, 2.0, -1.0, -1.0]));
  assert.ok(close(solve([['x1', 'x2'], ['x2', 'x3'], ['x3', 'x4'], ['x4', 'x5']], [3, 4, 5, 6], [['x1', 'x5'], ['x5', 'x2']]), [360, 1 / 120]));
  assert.ok(close(solve([['a', 'b'], ['c', 'd']], [2, 3], [['a', 'd']]), [-1]));
}
console.log('✓ 04-evaluate-division passed');

module.exports = { optimal, dfsVersion };
