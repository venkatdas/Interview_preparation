/**
 * 05. Project Selection with Prerequisites   (Original — Hard)
 *
 * PROBLEM
 * You may start any subset of n projects. profit[i] is what project i earns (it may be
 * negative: a pure cost, like buying a machine). requires = [[a, b], ...] means "if you
 * do project a you MUST also do project b". Return the maximum total profit
 * (doing nothing gives 0).
 *
 * EXAMPLES
 * profit=[10,-4,-3], requires=[[0,1],[0,2]]          -> 3   (10 - 4 - 3)
 * profit=[5,-8],     requires=[[0,1]]                -> 0   (not worth it, do nothing)
 * profit=[6,6,-10],  requires=[[0,2],[1,2]]          -> 2   (the cost is shared)
 * profit=[4,-1,2],   requires=[[1,2]]                -> 6   (do 0 and 2; skip 1)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can requirements form cycles? (yes; then those projects are all-or-nothing, still fine)
 * - Are requirements transitive? (yes: a needs b, b needs c -> a needs c)
 * - Profits as integers within ±10^6, n up to 500.
 *
 * APPROACH 1 — Brute force   O(2^n * (n + R)) time, O(n) space
 * Try every subset; keep it only if it is CLOSED (every chosen a has its b chosen).
 * Return the best sum.
 *
 * APPROACH 2 — Optimal (min cut, "project selection" / maximum closure)   O(V^2 * E)
 * Build:
 *   source -> i  with capacity profit[i]   if profit[i] > 0
 *   i -> sink    with capacity -profit[i]  if profit[i] < 0
 *   a -> b       with capacity Infinity    for each "a requires b"
 * Read a cut (S side = chosen projects) as a decision:
 *   - a positive project on the T side cuts source->i: we LOSE its profit
 *   - a negative project on the S side cuts i->sink: we PAY its cost
 *   - an infinite edge a->b can never be cut, so a in S forces b in S (rule respected)
 * Cut value = profit lost + cost paid. So
 *     answer = (sum of positive profits) - (min cut) = (sum of positives) - (max flow).
 *
 * Dry run (example 1): positives sum = 10
 *   edges: S->0 (10), 1->T (4), 2->T (3), 0->1 (inf), 0->2 (inf)
 *   augment S->0->1->T by 4, S->0->2->T by 3 -> max flow 7
 *   answer = 10 - 7 = 3
 *
 * EDGE CASES
 * - all profits negative -> 0 (choose nothing)
 * - all profits positive, no requirements -> sum of all
 * - cycle of requirements
 */
const { Dinic, mulberry32 } = require('../../02_Implementations/max_flow');

function bruteForce(profit, requires) {
  const n = profit.length;
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    if (!requires.every(([a, b]) => !(mask >> a & 1) || (mask >> b & 1))) continue;
    let sum = 0;
    for (let i = 0; i < n; i++) if (mask >> i & 1) sum += profit[i];
    best = Math.max(best, sum);
  }
  return best;
}

function optimal(profit, requires) {
  const n = profit.length;
  const S = n;
  const T = n + 1;
  const g = new Dinic(n + 2);
  let positive = 0;
  for (let i = 0; i < n; i++) {
    if (profit[i] > 0) { g.addEdge(S, i, profit[i]); positive += profit[i]; }
    else if (profit[i] < 0) g.addEdge(i, T, -profit[i]);
  }
  for (const [a, b] of requires) g.addEdge(a, b, Infinity);
  return positive - g.maxFlow(S, T);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([10, -4, -3], [[0, 1], [0, 2]]), 3);
  assert.strictEqual(solve([5, -8], [[0, 1]]), 0);
  assert.strictEqual(solve([6, 6, -10], [[0, 2], [1, 2]]), 2);
  assert.strictEqual(solve([4, -1, 2], [[1, 2]]), 6);
  assert.strictEqual(solve([-1, -2], []), 0);
  assert.strictEqual(solve([], []), 0);
  assert.strictEqual(solve([3, -1, -1], [[0, 1], [1, 2], [2, 0]]), 1); // cycle
  assert.strictEqual(solve([0, 7], [[1, 0]]), 7);
}
const rnd = mulberry32(505);
for (let tr = 0; tr < 300; tr++) {
  const n = Math.floor(rnd() * 9);
  const profit = Array.from({ length: n }, () => Math.floor(rnd() * 21) - 10);
  const requires = [];
  if (n > 0) for (let k = Math.floor(rnd() * 2 * n); k > 0; k--) requires.push([Math.floor(rnd() * n), Math.floor(rnd() * n)]);
  assert.strictEqual(optimal(profit, requires), bruteForce(profit, requires));
}
console.log('✓ 05_project_selection passed');

module.exports = { optimal, bruteForce };
