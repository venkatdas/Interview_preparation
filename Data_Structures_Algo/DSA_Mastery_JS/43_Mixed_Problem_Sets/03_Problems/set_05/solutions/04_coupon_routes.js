/**
 * 04. Coupon Routes   (Original — Hard)
 *
 * PROBLEM
 * A country has n cities (0..n-1) and two-way roads [u, v, toll]. You travel from src to
 * dst and own k coupons. A coupon used on a road halves its toll (rounded down:
 * Math.floor(toll / 2)); at most one coupon per road crossing. Return the minimum total
 * toll, or -1 if dst is unreachable.
 *
 * EXAMPLES
 * Input: n = 3, roads = [[0, 1, 10], [1, 2, 10], [0, 2, 25]], src = 0, dst = 2, k = 1   Output: 12   Explanation: 0-2 with coupon
 * Input: same roads, k = 2   Output: 10   Explanation: 5 + 5
 * Input: n = 2, roads = [], src = 0, dst = 1, k = 3   Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^4, roads up to 10^5, k up to 10. Tolls non-negative integers.
 * - src === dst -> 0.
 *
 * APPROACH 1 — Brute force   O(n * k * E * n * k) time (Bellman-Ford style), O(n * k) space
 * dist[node][used]. Relax every road in both directions, with and without a coupon, until
 * nothing changes.
 *
 * APPROACH 2 — Optimal (Dijkstra on an expanded state graph (city, coupons used))   O(E * k * log(n * k)) time, O(n * k) space
 * Each state (city, used) has edges to (next, used) at cost toll and to (next, used + 1)
 * at cost floor(toll / 2) when used < k. All costs are non-negative, so Dijkstra applies.
 * The answer is the smallest dist[dst][used] over all used (the first time dst pops).
 *
 * Dry run on example 1 (k = 1):
 *   pop (0,0) d=0: push (1,0)=10, (1,1)=5, (2,0)=25, (2,1)=12
 *   pop (1,1) d=5: push (2,1)=min(12, 5+10=15) -> stays 12
 *   pop (1,0) d=10: (2,0)=20, (2,1)=min(12, 15) -> 12
 *   pop (2,1) d=12 -> dst reached, answer 12
 *
 * EDGE CASES
 * - src === dst -> 0
 * - k = 0 -> plain Dijkstra
 * - unreachable -> -1
 *
 * COMMON MISTAKES
 * - Keeping only dist[city]: a path that saved coupons may be worse now but better later.
 * - Forgetting roads are two-way.
 */

// Minimal binary min-heap on arrays whose first element is the priority.
class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[i], a[p]] = [a[p], a[i]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } } return top; }
}

function bruteForce(n, roads, src, dst, k) {
  const dist = Array.from({ length: n }, () => new Array(k + 1).fill(Infinity));
  dist[src][0] = 0;
  let changed = true;
  while (changed) {
    changed = false;
    for (const [u, v, w] of roads) for (const [a, b] of [[u, v], [v, u]]) for (let c = 0; c <= k; c++) {
      if (dist[a][c] === Infinity) continue;
      if (dist[a][c] + w < dist[b][c]) { dist[b][c] = dist[a][c] + w; changed = true; }
      if (c < k && dist[a][c] + Math.floor(w / 2) < dist[b][c + 1]) { dist[b][c + 1] = dist[a][c] + Math.floor(w / 2); changed = true; }
    }
  }
  const best = Math.min(...dist[dst]);
  return best === Infinity ? -1 : best;
}

function optimal(n, roads, src, dst, k) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of roads) { adj[u].push([v, w]); adj[v].push([u, w]); }
  const dist = Array.from({ length: n }, () => new Array(k + 1).fill(Infinity));
  dist[src][0] = 0;
  const heap = new MinHeap();
  heap.push([0, src, 0]);
  while (heap.size) {
    const [d, city, used] = heap.pop();
    if (d > dist[city][used]) continue; // stale entry
    if (city === dst) return d; // first pop of dst is optimal
    for (const [nx, w] of adj[city]) {
      if (d + w < dist[nx][used]) { dist[nx][used] = d + w; heap.push([d + w, nx, used]); }
      const half = d + Math.floor(w / 2);
      if (used < k && half < dist[nx][used + 1]) { dist[nx][used + 1] = half; heap.push([half, nx, used + 1]); }
    }
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
const roads = [[0, 1, 10], [1, 2, 10], [0, 2, 25]];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(3, roads, 0, 2, 1), 12);
  assert.strictEqual(solve(3, roads, 0, 2, 2), 10);
  assert.strictEqual(solve(3, roads, 0, 2, 0), 20);
  assert.strictEqual(solve(2, [], 0, 1, 3), -1);
  assert.strictEqual(solve(2, [], 1, 1, 0), 0);
  assert.strictEqual(solve(2, [[0, 1, 7]], 1, 0, 1), 3);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(504);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 6);
  const rs = Array.from({ length: Math.floor(rand() * 9) }, () => [Math.floor(rand() * n), Math.floor(rand() * n), Math.floor(rand() * 20)]);
  const src = Math.floor(rand() * n), dst = Math.floor(rand() * n), k = Math.floor(rand() * 3);
  assert.strictEqual(optimal(n, rs, src, dst, k), bruteForce(n, rs, src, dst, k));
}
console.log('✓ set_05/04_coupon_routes passed');
module.exports = { optimal, bruteForce };
