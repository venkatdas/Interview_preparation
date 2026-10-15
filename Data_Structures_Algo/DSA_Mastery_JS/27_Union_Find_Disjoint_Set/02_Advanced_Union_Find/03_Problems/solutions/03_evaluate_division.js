/**
 * 03. Evaluate Division   (LeetCode 399 — Medium)
 *
 * PROBLEM
 * You are given equations like a / b = 2.0 (as pairs ["a","b"] and values [2.0]).
 * Answer queries ["x","y"] = x / y. Return -1.0 when the answer cannot be determined
 * (unknown variable or no chain of equations connecting them).
 *
 * EXAMPLES
 * equations = [["a","b"],["b","c"]], values = [2.0, 3.0]
 * queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
 * Output: [6.0, 0.5, -1.0, 1.0, -1.0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - No division by zero and no contradictions in the input
 * - A variable only "exists" if it appears in some equation ("x","x" -> -1)
 * - Up to 20 equations / queries in the original, but think O(n) per query anyway
 *
 * APPROACH 1 — Brute force (graph + DFS per query)   O(q * (V + E)) time
 * Edge a -> b with weight 2 and b -> a with weight 1/2. For x / y, DFS from x to y
 * multiplying edge weights along the path. Clear and good enough; most interviewers accept it.
 *
 * APPROACH 2 — Optimal (Weighted union-find)   O((n + q) * alpha(n)) time
 * Each variable stores a weight to its parent meaning value[x] = weight[x] * value[parent].
 * find(x) compresses the path and multiplies weights, so afterwards weight[x] = x / root.
 * union(a, b, k) for a / b = k: ra = find(a), rb = find(b); attach ra under rb with
 *   weight[ra] = k * weight[b] / weight[a]   (derived from a = w(a)*ra, b = w(b)*rb, a = k*b)
 * query(x, y): if both exist and share a root -> weight[x] / weight[y], else -1.
 *
 * Dry run: a/b = 2, b/c = 3
 *   union(a,b,2): roots a, b; parent[a] = b, weight[a] = 2 * 1 / 1 = 2      (a = 2b)
 *   union(b,c,3): roots b, c; parent[b] = c, weight[b] = 3 * 1 / 1 = 3      (b = 3c)
 *   query(a,c): find(a): parent a -> b -> c; weight[a] = 2 * 3 = 6, parent[a] = c
 *               find(c) = c; answer weight[a] / weight[c] = 6 / 1 = 6
 *   query(b,a): weight[b] / weight[a] = 3 / 6 = 0.5
 *
 * EDGE CASES
 * - x / x for a known x -> 1.0; for an unknown x -> -1.0
 * - variables in different components -> -1.0
 * - chains in reverse direction (b / a) -> reciprocal
 */

function bruteForce(equations, values, queries) {
  const graph = new Map();
  function addEdge(from, to, w) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push([to, w]);
  }
  equations.forEach(([a, b], i) => {
    addEdge(a, b, values[i]);
    addEdge(b, a, 1 / values[i]);
  });

  function dfs(node, target, product, seen) {
    if (node === target) return product;
    seen.add(node);
    for (const [next, w] of graph.get(node)) {
      if (seen.has(next)) continue;
      const result = dfs(next, target, product * w, seen);
      if (result !== -1) return result;
    }
    return -1;
  }

  return queries.map(([x, y]) => {
    if (!graph.has(x) || !graph.has(y)) return -1;
    return dfs(x, y, 1, new Set());
  });
}

function optimal(equations, values, queries) {
  const parent = new Map();
  const weight = new Map();   // weight[x] = value[x] / value[parent[x]]

  function add(x) {
    if (!parent.has(x)) {
      parent.set(x, x);
      weight.set(x, 1);
    }
  }

  function find(x) {
    if (parent.get(x) === x) return x;
    const p = parent.get(x);
    const root = find(p);                                  // p now points to root with w(p) = p / root
    weight.set(x, weight.get(x) * weight.get(p));          // x / root = (x / p) * (p / root)
    parent.set(x, root);
    return root;
  }

  equations.forEach(([a, b], i) => {
    add(a);
    add(b);
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    parent.set(ra, rb);
    weight.set(ra, (values[i] * weight.get(b)) / weight.get(a));
  });

  return queries.map(([x, y]) => {
    if (!parent.has(x) || !parent.has(y)) return -1;
    if (find(x) !== find(y)) return -1;
    return weight.get(x) / weight.get(y);
  });
}

// ---------- tests ----------
const assert = require('assert');
function close(a, b) {
  assert.strictEqual(a.length, b.length);
  for (let i = 0; i < a.length; i++) assert.ok(Math.abs(a[i] - b[i]) < 1e-9, `${a[i]} vs ${b[i]}`);
}
for (const solve of [bruteForce, optimal]) {
  close(
    solve([['a', 'b'], ['b', 'c']], [2, 3], [['a', 'c'], ['b', 'a'], ['a', 'e'], ['a', 'a'], ['x', 'x']]),
    [6, 0.5, -1, 1, -1]
  );
  close(
    solve([['a', 'b'], ['b', 'c'], ['bc', 'cd']], [1.5, 2.5, 5], [['a', 'c'], ['c', 'b'], ['bc', 'cd'], ['cd', 'bc']]),
    [3.75, 0.4, 5, 0.2]
  );
  close(solve([['a', 'b']], [0.5], [['a', 'b'], ['b', 'a'], ['a', 'c'], ['x', 'y']]), [0.5, 2, -1, -1]);
  close(solve([], [], [['a', 'a']]), [-1]);
}
// random consistent systems: hidden values, random equations, compare all pairs
for (let trial = 0; trial < 50; trial++) {
  const names = ['p', 'q', 'r', 's', 't', 'u'];
  const hidden = names.map(() => 1 + Math.floor(Math.random() * 9));
  const equations = [];
  const values = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.floor(Math.random() * 6);
    const b = Math.floor(Math.random() * 6);
    equations.push([names[a], names[b]]);
    values.push(hidden[a] / hidden[b]);
  }
  const queries = [];
  for (const a of names) for (const b of names) queries.push([a, b]);
  queries.push(['zz', 'p']);
  close(optimal(equations, values, queries), bruteForce(equations, values, queries));
}
console.log('✓ 03-evaluate-division passed');

module.exports = { optimal, bruteForce };
