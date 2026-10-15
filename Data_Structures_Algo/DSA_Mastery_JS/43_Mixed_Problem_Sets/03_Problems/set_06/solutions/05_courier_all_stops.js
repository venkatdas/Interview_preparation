/**
 * 05. Courier All Stops   (Original — Hard)
 *
 * PROBLEM
 * A city has n junctions (0..n-1) and two-way streets [u, v, minutes]. A courier starts at
 * junction `start` and must visit every junction listed in `stops` (up to 12 distinct
 * junctions, any order, passing through other junctions is allowed). The courier does not
 * need to come back. Return the minimum total minutes, or -1 if some stop is unreachable.
 *
 * EXAMPLES
 * Input: n = 4, streets = [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 10]], start = 0, stops = [3, 1]
 * Output: 3   Explanation: 0 -> 1 -> 2 -> 3 (stop 1 on the way)
 * Input: n = 3, streets = [[0, 1, 4]], start = 0, stops = [2]   Output: -1
 * Input: n = 2, streets = [], start = 1, stops = []             Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^4, streets up to 5 * 10^4, at most 12 stops.
 * - Can start itself be a stop? (yes, then it is visited at time 0)
 *
 * APPROACH 1 — Brute force   O(s! * s + (s + 1) * E log n) time
 * Dijkstra from start and from every stop to get pairwise distances, then try every order
 * of the stops (permutations) and sum the legs.
 *
 * APPROACH 2 — Optimal (Dijkstra from each key point + Held-Karp DP over bitmasks)   O((s + 1) * E log n + 2^s * s^2) time, O(2^s * s) space
 * Same distance table, but instead of every order: dp[mask][last] = cheapest way to start
 * at `start`, visit exactly the stops in mask, and end at stop `last`.
 * dp[{i}][i] = dist(start, i); dp[mask | {j}][j] = min(dp[mask][i] + dist(i, j)).
 * Answer = min over last of dp[full][last]. Orders that share a prefix set and end point
 * are merged, which is why 2^s * s^2 beats s!.
 *
 * Dry run on example 1 (stops s0=3, s1=1):
 *   dist(start=0, 3)=3, dist(0, 1)=1, dist(3, 1)=2
 *   dp[{s0}][s0]=3, dp[{s1}][s1]=1
 *   dp[{s0,s1}][s1] = 3 + 2 = 5;  dp[{s0,s1}][s0] = 1 + 2 = 3
 *   answer min(5, 3) = 3
 *
 * EDGE CASES
 * - no stops -> 0
 * - duplicate stops or start in stops -> dedupe; cost 0 legs are fine
 * - any unreachable stop -> -1
 *
 * COMMON MISTAKES
 * - Running BFS on a weighted graph.
 * - Using dp over ALL n junctions as a bitmask (2^n is far too big): only the stops matter.
 */

// Minimal binary min-heap on arrays whose first element is the priority.
class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[i], a[p]] = [a[p], a[i]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } } return top; }
}

function dijkstra(adj, src) {
  const dist = new Array(adj.length).fill(Infinity);
  dist[src] = 0;
  const heap = new MinHeap();
  heap.push([0, src]);
  while (heap.size) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) if (d + w < dist[v]) { dist[v] = d + w; heap.push([d + w, v]); }
  }
  return dist;
}

function table(n, streets, start, stops) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of streets) { adj[u].push([v, w]); adj[v].push([u, w]); }
  const keys = [...new Set(stops)];
  const fromStart = dijkstra(adj, start);
  const fromKey = keys.map((k) => dijkstra(adj, k));
  return { keys, fromStart, fromKey };
}

function bruteForce(n, streets, start, stops) {
  const { keys, fromStart, fromKey } = table(n, streets, start, stops);
  if (keys.some((k) => fromStart[k] === Infinity)) return -1;
  const s = keys.length;
  let best = s === 0 ? 0 : Infinity;
  const used = new Array(s).fill(false);
  (function go(last, count, sum) {
    if (count === s) { best = Math.min(best, sum); return; }
    for (let j = 0; j < s; j++) {
      if (used[j]) continue;
      used[j] = true;
      go(j, count + 1, sum + (last === -1 ? fromStart[keys[j]] : fromKey[last][keys[j]]));
      used[j] = false;
    }
  })(-1, 0, 0);
  return best;
}

function optimal(n, streets, start, stops) {
  const { keys, fromStart, fromKey } = table(n, streets, start, stops);
  const s = keys.length;
  if (s === 0) return 0;
  if (keys.some((k) => fromStart[k] === Infinity)) return -1;
  const full = (1 << s) - 1;
  const dp = Array.from({ length: 1 << s }, () => new Array(s).fill(Infinity));
  for (let i = 0; i < s; i++) dp[1 << i][i] = fromStart[keys[i]];
  for (let mask = 1; mask <= full; mask++) {
    for (let i = 0; i < s; i++) {
      const cur = dp[mask][i];
      if (cur === Infinity) continue;
      for (let j = 0; j < s; j++) {
        if (mask & (1 << j)) continue;
        const nm = mask | (1 << j);
        const c = cur + fromKey[i][keys[j]];
        if (c < dp[nm][j]) dp[nm][j] = c;
      }
    }
  }
  return Math.min(...dp[full]);
}

// ---------- tests ----------
const assert = require('assert');
const city = [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 10]];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4, city, 0, [3, 1]), 3);
  assert.strictEqual(solve(3, [[0, 1, 4]], 0, [2]), -1);
  assert.strictEqual(solve(2, [], 1, []), 0);
  assert.strictEqual(solve(4, city, 0, [0]), 0);
  assert.strictEqual(solve(4, city, 1, [0, 2]), 3); // 1->2->1->0 = 1+1+1
  assert.strictEqual(solve(4, city, 1, [3, 3]), 2);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(605);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 7);
  const streets = Array.from({ length: Math.floor(rand() * 12) }, () => [Math.floor(rand() * n), Math.floor(rand() * n), 1 + Math.floor(rand() * 9)]);
  const stops = Array.from({ length: Math.floor(rand() * 5) }, () => Math.floor(rand() * n));
  const start = Math.floor(rand() * n);
  assert.strictEqual(optimal(n, streets, start, stops), bruteForce(n, streets, start, stops));
}
console.log('✓ set_06/05_courier_all_stops passed');
module.exports = { optimal, bruteForce };
