/**
 * 05. Split Array into K Parts Minimizing the Sum of Squares   (Original — Hard)
 *
 * PROBLEM
 * You are given an array of NON-NEGATIVE integers nums and an integer k (1 <= k <= n).
 * Cut nums into exactly k contiguous, non-empty parts. The cost of a part is the square of
 * its sum; the cost of a split is the total over all parts. Return the minimum cost.
 * (Think: k servers, each takes a contiguous batch of requests, and a server's load
 * penalty grows quadratically - you want the batches as balanced as possible.)
 *
 * EXAMPLES
 * nums = [1,2,3,4,5], k = 2   -> 117   ([1,2,3] [4,5]: 36 + 81)
 * nums = [1,2,3,4,5], k = 3   -> 77    ([1,2,3] [4] [5]: 36 + 16 + 25)
 * nums = [4,0,4,0],  k = 2    -> 32    ([4,0] [4,0]: 16 + 16)
 * nums = [7], k = 1           -> 49
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n <= 2000, 0 <= nums[i] <= 1000 (sums^2 fit easily in a double).
 * - Are values non-negative? (yes - this is what makes the D&C optimization valid)
 * - Must every part be non-empty? (yes)
 *
 * APPROACH 1 — Brute force DP   O(k·n^2) time, O(n) space
 * pre = prefix sums, cost(j, i) = (pre[i] - pre[j])^2 for the part nums[j..i-1].
 * dp[g][i] = min cost to cut the first i numbers into g parts
 *          = min over j in [g-1, i-1] of dp[g-1][j] + cost(j, i).
 * k = n = 2000 -> 8e9 steps: too slow.
 *
 * APPROACH 2 — Optimal (divide & conquer optimization)   O(k·n log n) time, O(n) space
 * Let opt(i) be the best j for dp[g][i]. For this cost opt(i) is MONOTONE: opt(i) <= opt(i+1).
 * (Intuition: if the prefix grows, the last part should not jump backwards and swallow
 * more; formally (a+b)^2 with a, b >= 0 satisfies the quadrangle inequality.)
 * So per layer: solve(lo, hi, optLo, optHi):
 *   mid = middle of [lo, hi]; try only j in [optLo, min(mid-1, optHi)] -> dp[mid], opt(mid)
 *   recurse left half with j-range [optLo, opt(mid)], right half with [opt(mid), optHi].
 * Every recursion depth scans O(n) candidates in total, and there are O(log n) depths.
 *
 * Dry run on nums = [1,2,3,4,5], k = 2 (pre = [0,1,3,6,10,15]), layer g = 2, i in [2,5]:
 *   solve(2,5, j in [1,4]) mid = 3: j=1 -> 1 + 25 = 26, j=2 -> 9 + 9 = 18  -> dp=18, opt=2
 *   solve(2,2, j in [1,2])  mid = 2: j=1 -> 1 + 4 = 5                      -> dp=5,  opt=1
 *   solve(4,5, j in [2,4])  mid = 4: j=2 -> 9+49=58, j=3 -> 36+16=52       -> dp=52, opt=3
 *   solve(5,5, j in [3,4])  mid = 5: j=3 -> 36+81=117, j=4 -> 100+25=125   -> dp=117
 *   answer dp[2][5] = 117
 *
 * EDGE CASES
 * - k = 1 -> (total)^2;  k = n -> sum of squares of each element
 * - zeros -> many ties for opt; ties are fine (keep the first best)
 */

function prefixSums(nums) {
  const pre = [0];
  for (const x of nums) pre.push(pre[pre.length - 1] + x);
  return pre;
}

function bruteForce(nums, k) {
  const n = nums.length;
  const pre = prefixSums(nums);
  let prev = new Array(n + 1).fill(Infinity);
  prev[0] = 0;
  for (let g = 1; g <= k; g++) {
    const cur = new Array(n + 1).fill(Infinity);
    for (let i = g; i <= n; i++) {
      for (let j = g - 1; j < i; j++) cur[i] = Math.min(cur[i], prev[j] + (pre[i] - pre[j]) ** 2);
    }
    prev = cur;
  }
  return prev[n];
}

function optimal(nums, k) {
  const n = nums.length;
  const pre = prefixSums(nums);
  const cost = (j, i) => (pre[i] - pre[j]) ** 2;
  let prev = new Array(n + 1).fill(Infinity);
  prev[0] = 0;
  for (let g = 1; g <= k; g++) {
    const cur = new Array(n + 1).fill(Infinity);
    const solve = (lo, hi, optLo, optHi) => {
      if (lo > hi) return;
      const mid = (lo + hi) >> 1;
      let best = Infinity;
      let bestJ = optLo;
      for (let j = optLo; j <= Math.min(mid - 1, optHi); j++) {
        const v = prev[j] + cost(j, mid);
        if (v < best) { best = v; bestJ = j; }
      }
      cur[mid] = best;
      solve(lo, mid - 1, optLo, bestJ);
      solve(mid + 1, hi, bestJ, optHi);
    };
    solve(g, n, g - 1, n - 1);
    prev = cur;
  }
  return prev[n];
}

// Exhaustive: try every set of k-1 cut positions (tiny n only).
function exhaustive(nums, k) {
  const n = nums.length;
  let best = Infinity;
  const go = (start, partsLeft, acc) => {
    if (partsLeft === 1) {
      let s = 0;
      for (let i = start; i < n; i++) s += nums[i];
      best = Math.min(best, acc + s * s);
      return;
    }
    let s = 0;
    for (let end = start; end <= n - partsLeft; end++) {
      s += nums[end];
      go(end + 1, partsLeft - 1, acc + s * s);
    }
  };
  go(0, k, 0);
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 4, 5], 2), 117);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 3), 77);
  assert.strictEqual(solve([4, 0, 4, 0], 2), 32);
  assert.strictEqual(solve([7], 1), 49);
  assert.strictEqual(solve([1, 2, 3], 3), 14);       // k = n
  assert.strictEqual(solve([0, 0, 0, 0], 2), 0);     // all zeros
  assert.strictEqual(solve([2, 2, 2], 1), 36);       // k = 1
}

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(5);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 9);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 15));
  const k = 1 + Math.floor(rand() * n);
  const want = exhaustive(nums, k);
  assert.strictEqual(bruteForce(nums, k), want);
  assert.strictEqual(optimal(nums, k), want);
}
for (let t = 0; t < 30; t++) {                     // bigger inputs: DP vs D&C only
  const n = 20 + Math.floor(rand() * 60);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 100));
  const k = 1 + Math.floor(rand() * n);
  assert.strictEqual(optimal(nums, k), bruteForce(nums, k));
}
console.log('✓ 05_split_array_min_sum_of_squares passed');

module.exports = { optimal, bruteForce };
