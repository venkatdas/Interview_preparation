/**
 * 05. Mandatory Roads Network   (Original — Medium)
 *
 * PROBLEM
 * A region has n towns (0..n-1). Some roads are MANDATORY (the council already promised
 * to build them) and some are OPTIONAL. Each road is [u, v, cost]. Choose a set of roads
 * that includes every mandatory road and connects all towns, with the minimum total cost.
 * Return that cost, or -1 if even using every road the towns cannot all be connected.
 *
 * EXAMPLES
 * Input: n = 4, mandatory = [[0, 1, 9]], optional = [[1, 2, 1], [0, 2, 2], [2, 3, 4], [0, 3, 3]]
 * Output: 13   Explanation: 9 (mandatory) + 1 + 3
 * Input: n = 3, mandatory = [], optional = [[0, 1, 1]]   Output: -1
 * Input: n = 1, mandatory = [], optional = []            Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^4, roads up to 10^5, costs >= 0.
 * - Mandatory roads may form a cycle? (yes — still all must be paid)
 *
 * APPROACH 1 — Brute force   O(2^m * (n + m)) time
 * Try every subset of optional roads; add all mandatory roads; if the result connects all
 * towns, keep the cheapest total.
 *
 * APPROACH 2 — Optimal (union-find seeded with mandatory roads + greedy Kruskal)   O(m log m) time, O(n) space
 * Pay for and union every mandatory road first. Then run Kruskal on the optional roads
 * sorted by cost: take a road only if it joins two different components. The usual MST
 * exchange argument still holds once the mandatory components are treated as single
 * "super towns". Finally check that one component remains.
 *
 * Dry run on example 1:
 *   mandatory: union(0,1) total 9          components {0,1} {2} {3}
 *   optional sorted: (1,2,1) join -> 10    (0,2,2) same comp skip
 *                    (0,3,3) join -> 13    (2,3,4) skip
 *   one component -> 13
 *
 * EDGE CASES
 * - n = 1 -> cost of mandatory roads only (0 if none)
 * - disconnected even with every road -> -1
 * - optional cost 0 roads -> always fine to take
 *
 * COMMON MISTAKES
 * - Skipping a mandatory road because it forms a cycle (it must still be paid).
 * - Forgetting the final connectivity check.
 */

function makeDsu(n) {
  const p = Array.from({ length: n }, (_, i) => i);
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  let comps = n;
  return { find, union(a, b) { a = find(a); b = find(b); if (a === b) return false; p[a] = b; comps--; return true; }, get comps() { return comps; } };
}

function bruteForce(n, mandatory, optional) {
  const m = optional.length;
  let best = Infinity;
  for (let mask = 0; mask < (1 << m); mask++) {
    const dsu = makeDsu(n);
    let total = 0;
    for (const [u, v, w] of mandatory) { dsu.union(u, v); total += w; }
    for (let i = 0; i < m; i++) if (mask & (1 << i)) { const [u, v, w] = optional[i]; dsu.union(u, v); total += w; }
    if (dsu.comps === 1) best = Math.min(best, total);
  }
  return best === Infinity ? -1 : best;
}

function optimal(n, mandatory, optional) {
  const dsu = makeDsu(n);
  let total = 0;
  for (const [u, v, w] of mandatory) { dsu.union(u, v); total += w; }
  for (const [u, v, w] of optional.slice().sort((a, b) => a[2] - b[2])) if (dsu.union(u, v)) total += w;
  return dsu.comps === 1 ? total : -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4, [[0, 1, 9]], [[1, 2, 1], [0, 2, 2], [2, 3, 4], [0, 3, 3]]), 13);
  assert.strictEqual(solve(3, [], [[0, 1, 1]]), -1);
  assert.strictEqual(solve(1, [], []), 0);
  assert.strictEqual(solve(2, [[0, 1, 5], [0, 1, 6]], [[0, 1, 1]]), 11);
  assert.strictEqual(solve(3, [], [[0, 1, 4], [1, 2, 4], [0, 2, 1]]), 5);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(505);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 5);
  const e = () => [Math.floor(rand() * n), Math.floor(rand() * n), Math.floor(rand() * 10)];
  const mandatory = Array.from({ length: Math.floor(rand() * 3) }, e);
  const optional = Array.from({ length: Math.floor(rand() * 8) }, e);
  assert.strictEqual(optimal(n, mandatory, optional), bruteForce(n, mandatory, optional));
}
console.log('✓ set_05/05_mandatory_roads_mst passed');
module.exports = { optimal, bruteForce };
