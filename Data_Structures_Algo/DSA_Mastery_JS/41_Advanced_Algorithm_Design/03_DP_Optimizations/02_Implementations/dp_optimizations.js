/**
 * DP optimizations in JavaScript (Advanced).
 *
 * Every function here comes in a pair: the slow, obviously-correct DP and the optimized
 * version. The self-test compares them on hundreds of random inputs, which is exactly how
 * you should convince yourself an optimization is correct.
 *
 *  1. countWaysWindow           prefix-sum transition        O(n·w)   -> O(n)
 *  2. windowMaxDP               monotonic deque transition   O(n·k)   -> O(n)
 *  3. lengthOfLIS               binary search (patience)     O(n^2)   -> O(n log n)
 *  4. weightedIntervalScheduling  binary search on ends      O(n^2)   -> O(n log n)
 *  5. divideAndConquerDP        D&C optimization             O(k·n^2) -> O(k·n log n)
 *  6. knuthOptimalMerge         Knuth optimization           O(n^3)   -> O(n^2)
 *  7. MonotoneCHT / LiChaoTree  convex hull trick            O(n^2)   -> O(n) / O(n log C)
 *  8. bitsetSubsetSum           bitset speed-up              O(n·S) booleans -> O(n·S/64) words
 *     minCostAssignment         bitmask DP                   O(n!)    -> O(2^n · n)
 *  9. knapsack01                space optimization           O(n·W) memory -> O(W)
 */
'use strict';

const MOD = 1_000_000_007;

function assertIntArray(a, name) {
  if (!Array.isArray(a) || a.some((x) => !Number.isFinite(x))) {
    throw new TypeError(`${name} must be an array of finite numbers`);
  }
}

// ---------- 1. Prefix-sum transition ----------
// dp[i] = number of ways to stand on step i. From step j you may jump any distance in
// [lo, hi], so dp[i] = dp[i-hi] + ... + dp[i-lo]: a SUM OVER A CONTIGUOUS RANGE of
// earlier states. A running prefix sum of dp answers that range sum in O(1).
function countWaysWindowBrute(target, lo, hi, blocked = []) {
  const bad = new Set(blocked);
  if (bad.has(0)) return 0;
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= target; i++) {
    if (bad.has(i)) continue;
    for (let d = lo; d <= hi; d++) if (i - d >= 0) dp[i] = (dp[i] + dp[i - d]) % MOD;
  }
  return dp[target];
}

function countWaysWindow(target, lo, hi, blocked = []) {
  if (!Number.isInteger(target) || target < 0) throw new RangeError('target must be an integer >= 0');
  if (!(Number.isInteger(lo) && Number.isInteger(hi) && 1 <= lo && lo <= hi)) {
    throw new RangeError('need integers 1 <= lo <= hi');
  }
  const bad = new Set(blocked);
  if (bad.has(0)) return 0;
  const dp = new Array(target + 1).fill(0);
  const pre = new Array(target + 2).fill(0); // pre[i] = dp[0] + ... + dp[i-1]
  dp[0] = 1;
  pre[1] = 1;
  for (let i = 1; i <= target; i++) {
    const right = i - lo;             // newest state we may jump from
    const left = Math.max(0, i - hi); // oldest state we may jump from
    if (!bad.has(i) && right >= 0) dp[i] = (pre[right + 1] - pre[left] + MOD) % MOD;
    pre[i + 1] = (pre[i] + dp[i]) % MOD;
  }
  return dp[target];
}

// ---------- 2. Monotonic deque transition ----------
// dp[i] = nums[i] + max(dp[i-k .. i-1])  (a MAX over a SLIDING window of earlier states).
// With restart = true the chain may also start fresh at i: dp[i] = nums[i] + max(0, best).
// The deque keeps indices whose dp values are DECREASING, so the front is the window max.
// Why can we throw an index away? If j < j' and dp[j] <= dp[j'], then j leaves the window
// sooner AND is no better, so j can never be the answer again.
function windowMaxDPBrute(nums, k, restart = false) {
  const dp = new Array(nums.length);
  for (let i = 0; i < nums.length; i++) {
    let best = -Infinity;
    for (let j = Math.max(0, i - k); j < i; j++) best = Math.max(best, dp[j]);
    if (restart) best = Math.max(best, 0);
    dp[i] = nums[i] + (best === -Infinity ? 0 : best);
  }
  return dp;
}

function windowMaxDP(nums, k, restart = false) {
  assertIntArray(nums, 'nums');
  if (!Number.isInteger(k) || k < 1) throw new RangeError('k must be an integer >= 1');
  const n = nums.length;
  const dp = new Array(n);
  const dq = new Array(n); // indices, a ring-free array with head/tail pointers (O(1) shift)
  let head = 0;
  let tail = 0;
  for (let i = 0; i < n; i++) {
    while (head < tail && dq[head] < i - k) head++;       // drop indices outside the window
    let best = head < tail ? dp[dq[head]] : -Infinity;
    if (restart) best = Math.max(best, 0);
    dp[i] = nums[i] + (best === -Infinity ? 0 : best);
    while (head < tail && dp[dq[tail - 1]] <= dp[i]) tail--; // dominated: older and not better
    dq[tail++] = i;
  }
  return dp;
}

// ---------- 3. LIS with binary search (patience sorting) ----------
// tails[len-1] = the smallest possible tail of an increasing subsequence of length len.
// tails is always sorted, so each new number finds its place by binary search.
function lengthOfLISBrute(nums) {
  const dp = new Array(nums.length).fill(1);
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
  }
  return best;
}

function lengthOfLIS(nums) {
  assertIntArray(nums, 'nums');
  const tails = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {               // first index with tails[idx] >= x (lower bound)
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1; else hi = mid;
    }
    tails[lo] = x;                  // extend (lo === length) or improve an existing tail
  }
  return tails.length;
}

// ---------- 4. Weighted interval scheduling (binary search on sorted ends) ----------
// jobs = [[start, end, profit]]; a job ending at t is compatible with one starting at t.
// Sort by end. dp[i] = best using the first i jobs = max(skip: dp[i-1], take: p + dp[j])
// where j = number of jobs whose end <= start of job i (found by binary search).
function weightedIntervalSchedulingBrute(jobs) {
  const s = jobs.slice().sort((a, b) => a[1] - b[1]);
  const dp = new Array(s.length + 1).fill(0);
  for (let i = 1; i <= s.length; i++) {
    let take = s[i - 1][2];
    for (let j = i - 1; j >= 1; j--) {
      if (s[j - 1][1] <= s[i - 1][0]) { take += dp[j]; break; }
    }
    dp[i] = Math.max(dp[i - 1], take);
  }
  return dp[s.length];
}

function weightedIntervalScheduling(jobs) {
  if (!Array.isArray(jobs)) throw new TypeError('jobs must be an array');
  const s = jobs.slice().sort((a, b) => a[1] - b[1]);
  const ends = s.map((j) => j[1]);
  const dp = new Array(s.length + 1).fill(0);
  for (let i = 1; i <= s.length; i++) {
    const [start, , profit] = s[i - 1];
    let lo = 0;
    let hi = i - 1;                 // count of ends <= start among the first i-1 jobs
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ends[mid] <= start) lo = mid + 1; else hi = mid;
    }
    dp[i] = Math.max(dp[i - 1], profit + dp[lo]);
  }
  return dp[s.length];
}

// ---------- 5. Divide & conquer optimization ----------
// Split indices 0..n-1 into k contiguous non-empty groups; cost(l, r) prices the half-open
// group [l, r). dp[g][i] = min over j of dp[g-1][j] + cost(j, i).
// If opt(i) (the best j) never moves LEFT as i grows - true when cost satisfies the
// quadrangle inequality - we compute the middle i first, then the left half only searches
// j <= opt(mid) and the right half only j >= opt(mid). Each recursion level does O(n) work.
function divideAndConquerDPBrute(n, k, cost) {
  let prev = new Array(n + 1).fill(Infinity);
  prev[0] = 0;
  for (let g = 1; g <= k; g++) {
    const cur = new Array(n + 1).fill(Infinity);
    for (let i = g; i <= n; i++) {
      for (let j = g - 1; j < i; j++) cur[i] = Math.min(cur[i], prev[j] + cost(j, i));
    }
    prev = cur;
  }
  return prev[n];
}

function divideAndConquerDP(n, k, cost) {
  if (!(Number.isInteger(n) && Number.isInteger(k) && 1 <= k && k <= n)) {
    throw new RangeError('need integers 1 <= k <= n');
  }
  let prev = new Array(n + 1).fill(Infinity);
  prev[0] = 0;
  for (let g = 1; g <= k; g++) {
    const cur = new Array(n + 1).fill(Infinity);
    // compute cur[i] for i in [lo, hi], knowing the best j lies in [optLo, optHi]
    const solve = (lo, hi, optLo, optHi) => {
      if (lo > hi) return;
      const mid = (lo + hi) >> 1;
      let bestVal = Infinity;
      let bestJ = optLo;
      for (let j = optLo; j <= Math.min(mid - 1, optHi); j++) {
        const v = prev[j] + cost(j, mid);
        if (v < bestVal) { bestVal = v; bestJ = j; }
      }
      cur[mid] = bestVal;
      solve(lo, mid - 1, optLo, bestJ);
      solve(mid + 1, hi, bestJ, optHi);
    };
    solve(g, n, g - 1, n - 1);
    prev = cur;
  }
  return prev[n];
}

// ---------- 6. Knuth optimization (optimal merge of adjacent piles, 2 at a time) ----------
// dp[i][j] = min over i <= m < j of dp[i][m] + dp[m+1][j] + sum(i..j).
// Knuth: opt[i][j-1] <= opt[i][j] <= opt[i+1][j], so each m loop is short and the
// total work telescopes to O(n^2).
function knuthOptimalMergeBrute(piles) {
  const n = piles.length;
  if (n <= 1) return 0;
  const pre = [0];
  for (const p of piles) pre.push(pre[pre.length - 1] + p);
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let m = i; m < j; m++) dp[i][j] = Math.min(dp[i][j], dp[i][m] + dp[m + 1][j]);
      dp[i][j] += pre[j + 1] - pre[i];
    }
  }
  return dp[0][n - 1];
}

function knuthOptimalMerge(piles) {
  assertIntArray(piles, 'piles');
  const n = piles.length;
  if (n <= 1) return 0;
  const pre = [0];
  for (const p of piles) pre.push(pre[pre.length - 1] + p);
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  const opt = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) opt[i][i] = i;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      const from = opt[i][j - 1];
      const to = Math.min(opt[i + 1][j], j - 1);
      for (let m = from; m <= to; m++) {
        const v = dp[i][m] + dp[m + 1][j];
        if (v < dp[i][j]) { dp[i][j] = v; opt[i][j] = m; }
      }
      dp[i][j] += pre[j + 1] - pre[i];
    }
  }
  return dp[0][n - 1];
}

// ---------- 7. Convex hull trick ----------
// Many DPs look like dp[j] = min_i (m_i * x_j + b_i) + extra(j): a minimum over LINES.
// MonotoneCHT: lines are added with DECREASING slopes and queried at INCREASING x, so the
// lower envelope is a deque and a pointer only moves forward: amortized O(1).
class MonotoneCHT {
  constructor() {
    this.m = [];
    this.b = [];
    this.ptr = 0;
  }

  // Is the middle line (index i2) never strictly below both neighbours?
  #useless(i1, i2, m3, b3) {
    const { m, b } = this;
    // intersection(l1, l3).x <= intersection(l1, l2).x  -> l2 is covered
    return (b3 - b[i1]) * (m[i1] - m[i2]) <= (b[i2] - b[i1]) * (m[i1] - m3);
  }

  addLine(slope, intercept) {
    const { m, b } = this;
    const last = m.length - 1;
    if (last >= 0 && slope > m[last]) throw new RangeError('slopes must be non-increasing');
    if (last >= 0 && slope === m[last]) {
      if (intercept >= b[last]) return;        // parallel and not lower: useless
      m.pop(); b.pop();
    }
    while (m.length >= 2 && this.#useless(m.length - 2, m.length - 1, slope, intercept)) {
      m.pop(); b.pop();
    }
    m.push(slope);
    b.push(intercept);
    this.ptr = Math.min(this.ptr, m.length - 1);
  }

  query(x) { // x must be non-decreasing across calls
    if (this.m.length === 0) throw new Error('query on empty hull');
    const { m, b } = this;
    while (this.ptr + 1 < m.length && m[this.ptr + 1] * x + b[this.ptr + 1] <= m[this.ptr] * x + b[this.ptr]) {
      this.ptr++;
    }
    return m[this.ptr] * x + b[this.ptr];
  }
}

// LiChaoTree: no order assumptions at all. A segment tree over integer x in [lo, hi];
// each node stores the line that is best at its midpoint, and the loser is pushed into
// the one half where it can still win. Insert and query are O(log(hi - lo)).
class LiChaoTree {
  constructor(lo, hi) {
    if (!(Number.isInteger(lo) && Number.isInteger(hi) && lo <= hi)) throw new RangeError('bad domain');
    this.lo = lo;
    this.hi = hi;
    this.root = null;
  }

  addLine(m, b) {
    let line = { m, b };
    let node = this.root;
    if (!node) { this.root = { line, left: null, right: null }; return; }
    let lo = this.lo;
    let hi = this.hi;
    for (;;) {
      const mid = Math.floor((lo + hi) / 2);
      const f = (l, x) => l.m * x + l.b;
      const newBetterLeft = f(line, lo) < f(node.line, lo);
      const newBetterMid = f(line, mid) < f(node.line, mid);
      if (newBetterMid) [node.line, line] = [line, node.line]; // node keeps the mid winner
      if (lo === hi) return;
      if (newBetterLeft !== newBetterMid) {  // loser can still win on the left half
        if (!node.left) { node.left = { line, left: null, right: null }; return; }
        node = node.left; hi = mid;
      } else {                                // otherwise only on the right half
        if (!node.right) { node.right = { line, left: null, right: null }; return; }
        node = node.right; lo = mid + 1;
      }
    }
  }

  query(x) {
    if (x < this.lo || x > this.hi) throw new RangeError('x outside domain');
    let best = Infinity;
    let node = this.root;
    let lo = this.lo;
    let hi = this.hi;
    while (node) {
      best = Math.min(best, node.line.m * x + node.line.b);
      const mid = Math.floor((lo + hi) / 2);
      if (x <= mid) { node = node.left; hi = mid; } else { node = node.right; lo = mid + 1; }
    }
    return best;
  }
}

// ---------- 8. Bitset and bitmask speed-ups ----------
// Subset sum: reachable sums form a bitset; adding a number a shifts the whole set by a.
// One BigInt shift-or processes ~64 sums per machine word instead of one per loop step.
function subsetSumBrute(nums, target) {
  const can = new Array(target + 1).fill(false);
  can[0] = true;
  for (const a of nums) for (let s = target; s >= a; s--) if (can[s - a]) can[s] = true;
  return can[target];
}

function bitsetSubsetSum(nums, target) {
  if (!Number.isInteger(target) || target < 0) throw new RangeError('target must be >= 0');
  const mask = (1n << BigInt(target + 1)) - 1n;   // keep only sums 0..target
  let bits = 1n;                                   // sum 0 is reachable
  for (const a of nums) bits = (bits | (bits << BigInt(a))) & mask;
  return ((bits >> BigInt(target)) & 1n) === 1n;
}

// Assignment: n workers, n jobs, cost[w][j]. dp[mask] = min cost when the jobs in mask are
// taken by workers 0..popcount(mask)-1. 2^n · n instead of n! permutations.
function minCostAssignmentBrute(cost) {
  const n = cost.length;
  let best = Infinity;
  const used = new Array(n).fill(false);
  const go = (w, acc) => {
    if (w === n) { best = Math.min(best, acc); return; }
    for (let j = 0; j < n; j++) {
      if (!used[j]) { used[j] = true; go(w + 1, acc + cost[w][j]); used[j] = false; }
    }
  };
  go(0, 0);
  return best;
}

function minCostAssignment(cost) {
  const n = cost.length;
  if (n > 20) throw new RangeError('bitmask DP is only practical for n <= 20');
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    if (dp[mask] === Infinity) continue;
    let w = 0;
    for (let t = mask; t; t &= t - 1) w++;         // popcount = next worker to assign
    if (w === n) continue;
    for (let j = 0; j < n; j++) {
      if (!(mask & (1 << j))) {
        const next = mask | (1 << j);
        dp[next] = Math.min(dp[next], dp[mask] + cost[w][j]);
      }
    }
  }
  return dp[(1 << n) - 1];
}

// ---------- 9. Space optimization recap: 0/1 knapsack ----------
// Row i only reads row i-1, so one array is enough - iterate capacity DOWNWARD so each
// item is used at most once (upward would reuse the item: that is unbounded knapsack).
function knapsack01Brute(weights, values, cap) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let c = 0; c <= cap; c++) {
      dp[i][c] = dp[i - 1][c];
      if (weights[i - 1] <= c) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - weights[i - 1]] + values[i - 1]);
    }
  }
  return dp[n][cap];
}

function knapsack01(weights, values, cap) {
  const dp = new Array(cap + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let c = cap; c >= weights[i]; c--) dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);
  }
  return dp[cap];
}

// Seeded PRNG so random failures are reproducible.
function mulberry32(seed) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

module.exports = {
  MOD,
  countWaysWindow, countWaysWindowBrute,
  windowMaxDP, windowMaxDPBrute,
  lengthOfLIS, lengthOfLISBrute,
  weightedIntervalScheduling, weightedIntervalSchedulingBrute,
  divideAndConquerDP, divideAndConquerDPBrute,
  knuthOptimalMerge, knuthOptimalMergeBrute,
  MonotoneCHT, LiChaoTree,
  bitsetSubsetSum, subsetSumBrute,
  minCostAssignment, minCostAssignmentBrute,
  knapsack01, knapsack01Brute,
  mulberry32,
};

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');
  const rand = mulberry32(2024);
  const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  const arr = (len, lo, hi) => Array.from({ length: len }, () => ri(lo, hi));

  // fixed examples
  assert.strictEqual(countWaysWindow(4, 1, 2), 5);                 // climbing stairs: fib
  assert.strictEqual(countWaysWindow(5, 2, 3, [4]), 2);            // 0-2-5 and 0-3-5
  assert.deepStrictEqual(windowMaxDP([1, -1, -2, 4, -7, 3], 2), [1, 0, -1, 4, -3, 7]);
  assert.strictEqual(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4);
  assert.strictEqual(weightedIntervalScheduling([[1, 3, 50], [2, 4, 10], [3, 5, 40], [3, 6, 70]]), 120);
  assert.strictEqual(knuthOptimalMerge([1, 2, 3]), 9);              // (1+2)=3, then 3+3=6
  assert.strictEqual(knuthOptimalMerge([]), 0);
  assert.strictEqual(bitsetSubsetSum([3, 34, 4, 12, 5, 2], 9), true);
  assert.strictEqual(bitsetSubsetSum([3, 34, 4, 12, 5, 2], 30), false);
  assert.strictEqual(minCostAssignment([[9, 2, 7], [6, 4, 3], [5, 8, 1]]), 2 + 6 + 1);
  assert.strictEqual(knapsack01([1, 3, 4, 5], [1, 4, 5, 7], 7), 9);
  assert.throws(() => windowMaxDP([1], 0), RangeError);

  for (let t = 0; t < 300; t++) {
    const target = ri(0, 30);
    const lo = ri(1, 4);
    const hi = lo + ri(0, 4);
    const blocked = arr(ri(0, 4), 1, 30);
    assert.strictEqual(countWaysWindow(target, lo, hi, blocked), countWaysWindowBrute(target, lo, hi, blocked));

    const nums = arr(ri(1, 25), -10, 10);
    const k = ri(1, 6);
    assert.deepStrictEqual(windowMaxDP(nums, k), windowMaxDPBrute(nums, k));
    assert.deepStrictEqual(windowMaxDP(nums, k, true), windowMaxDPBrute(nums, k, true));

    assert.strictEqual(lengthOfLIS(nums), lengthOfLISBrute(nums));

    const jobs = Array.from({ length: ri(0, 12) }, () => { const s = ri(0, 20); return [s, s + ri(1, 8), ri(1, 30)]; });
    assert.strictEqual(weightedIntervalScheduling(jobs), weightedIntervalSchedulingBrute(jobs));

    const a = arr(ri(1, 18), 0, 20);
    const pre = [0];
    for (const x of a) pre.push(pre[pre.length - 1] + x);
    const sq = (l, r) => (pre[r] - pre[l]) ** 2;
    const groups = ri(1, a.length);
    assert.strictEqual(divideAndConquerDP(a.length, groups, sq), divideAndConquerDPBrute(a.length, groups, sq));

    assert.strictEqual(knuthOptimalMerge(a), knuthOptimalMergeBrute(a));

    // CHT: random lines sorted by decreasing slope, queries sorted ascending
    const lines = Array.from({ length: ri(1, 15) }, () => [ri(-20, 20), ri(-50, 50)]).sort((p, q) => q[0] - p[0]);
    const cht = new MonotoneCHT();
    const lct = new LiChaoTree(-30, 30);
    for (const [m, b] of lines) { cht.addLine(m, b); lct.addLine(m, b); }
    const xs = arr(10, -30, 30).sort((p, q) => p - q);
    for (const x of xs) {
      const brute = Math.min(...lines.map(([m, b]) => m * x + b));
      assert.strictEqual(cht.query(x), brute);
      assert.strictEqual(lct.query(x), brute);
    }

    const ss = arr(ri(0, 10), 1, 15);
    const tgt = ri(0, 60);
    assert.strictEqual(bitsetSubsetSum(ss, tgt), subsetSumBrute(ss, tgt));

    const n = ri(1, 6);
    const cost = Array.from({ length: n }, () => arr(n, 0, 20));
    assert.strictEqual(minCostAssignment(cost), minCostAssignmentBrute(cost));

    const w = arr(ri(0, 8), 1, 10);
    const v = arr(w.length, 0, 20);
    const cap = ri(0, 30);
    assert.strictEqual(knapsack01(w, v, cap), knapsack01Brute(w, v, cap));
  }

  console.log('✓ dp_optimizations.js self-test passed');
}
