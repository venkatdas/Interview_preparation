/**
 * 05. Union-Find Step Budget   (Original — Hard)
 *
 * PROBLEM
 * There are n servers (0..n-1). Process a list of operations:
 *   ['link', a, b]   connect the networks of a and b
 *   ['same', a, b]   output true if a and b are in the same network
 * Return { answers, steps } where steps counts parent pointers followed during finds.
 * Your implementation must stay within a budget of 8·(n + number of operations) steps
 * for EVERY input, including an adversary who links servers into one long chain and
 * then queries the far end repeatedly.
 *
 * EXAMPLES
 * n = 4, ops: link 0 1, link 2 3, same 0 3, link 1 2, same 0 3
 *   answers [false, true]
 * n = 1, ops: same 0 0   answers [true]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e5, operations up to 2e5.
 * - link of already-connected servers is a no-op.
 *
 * APPROACH 1 — Brute force (quick-union, no rank, no compression)   O(n) per op worst case
 * parent[root(a)] = root(b). Linking 0-1, 1-2, 2-3, ... in the right order builds a chain
 * of height n; each `same` on the bottom element walks n pointers -> Θ(n·m) total.
 *
 * APPROACH 2 — Optimal (union by rank + path compression)   O(α(n)) amortized per op
 * Union by rank keeps trees shallow (height <= log n). Path compression re-points every
 * node on a find path straight to the root, so the long walk is paid once and later
 * finds on those nodes cost 1. Tarjan's potential argument gives O((n + m)·α(n)) total,
 * α <= 4 in practice, which is why a budget of 8·(n + m) is never exceeded.
 *
 * Dry run (example 1, optimal):
 *   link 0 1 -> parent[1] = 0 (rank 0 = 1)        link 2 3 -> parent[3] = 2
 *   same 0 3 -> roots 0 and 2 -> false             link 1 2 -> roots 0, 2 equal rank -> parent[2] = 0
 *   same 0 3 -> find(3): 3 -> 2 -> 0 (compress 3 -> 0) -> true
 *
 * EDGE CASES
 * - self-link and repeated links
 * - same(a, a) -> true
 * - chain-building adversary (brute force explodes, optimal stays linear)
 *
 * COMMON MISTAKES
 * - Path compression without union by rank is already good amortized (O(log n)), but rank alone
 *   is not "compression": you need both for α(n).
 * - Comparing a and b instead of find(a) and find(b).
 * - Forgetting to increment rank only when the two ranks are equal.
 */
const { UnionFind, mulberry32 } = require('../../02_Implementations/amortized_algorithms');

function solve(n, ops, opts) {
  const uf = new UnionFind(n, opts);
  const answers = [];
  for (const [op, a, b] of ops) {
    if (op === 'link') uf.union(a, b);
    else answers.push(uf.connected(a, b));
  }
  return { answers, steps: uf.steps };
}

const bruteForce = (n, ops) => solve(n, ops, { rank: false, compress: false });
const optimal = (n, ops) => solve(n, ops, { rank: true, compress: true });

// ---------- tests ----------
const assert = require('assert');
const ex = [['link', 0, 1], ['link', 2, 3], ['same', 0, 3], ['link', 1, 2], ['same', 0, 3]];
for (const s of [bruteForce, optimal]) {
  assert.deepStrictEqual(s(4, ex).answers, [false, true]);
  assert.deepStrictEqual(s(1, [['same', 0, 0]]).answers, [true]);
  assert.deepStrictEqual(s(3, [['link', 1, 1], ['link', 0, 2], ['link', 2, 0], ['same', 0, 2], ['same', 0, 1]]).answers, [true, false]);
}
// adversary: chain then hammer the deepest node
const n = 20000;
const adv = [];
for (let i = 1; i < n; i++) adv.push(['link', i - 1, i]);
for (let q = 0; q < 20000; q++) adv.push(['same', 0, n - 1]);
const o = optimal(n, adv), b = bruteForce(n, adv);
assert.deepStrictEqual(o.answers, b.answers);
assert.ok(o.steps <= 8 * (n + adv.length), `optimal steps ${o.steps}`);
assert.ok(b.steps > 100 * o.steps, `brute ${b.steps} vs optimal ${o.steps}`);

const rand = mulberry32(515);
for (let t = 0; t < 100; t++) {
  const m = 2 + Math.floor(rand() * 50);
  const ops = Array.from({ length: 200 }, () => [rand() < 0.5 ? 'link' : 'same', Math.floor(rand() * m), Math.floor(rand() * m)]);
  const x = optimal(m, ops), y = bruteForce(m, ops);
  assert.deepStrictEqual(x.answers, y.answers);
  assert.ok(x.steps <= 8 * (m + ops.length));
}
console.log('✓ 05_union_find_step_budget passed');

module.exports = { optimal, bruteForce };
