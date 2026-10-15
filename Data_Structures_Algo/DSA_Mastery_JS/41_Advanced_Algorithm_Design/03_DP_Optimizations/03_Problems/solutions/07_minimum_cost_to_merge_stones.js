/**
 * 07. Minimum Cost to Merge Stones   (LeetCode 1000 — Hard)
 *
 * PROBLEM
 * There are n piles of stones in a row; pile i has stones[i] stones. One move merges
 * exactly K CONSECUTIVE piles into one pile, and costs the total number of stones in those
 * K piles. Return the minimum total cost to end with a single pile, or -1 if impossible.
 *
 * EXAMPLES
 * stones = [3,2,4,1], K = 2     -> 20   ([3,2]->5 (5), [4,1]->5 (5), [5,5]->10 (10))
 * stones = [3,2,4,1], K = 3     -> -1   (4 piles -> 2 piles -> stuck)
 * stones = [3,5,1,2,6], K = 3   -> 25   ([5,1,2]->8 (8), [3,8,6]->17 (17))
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 30, 2 <= K <= 30, 1 <= stones[i] <= 100.
 * - When is it possible? Each move removes K-1 piles, so we need (n-1) % (K-1) === 0.
 * - n = 1 -> already one pile, cost 0.
 *
 * APPROACH 1 — Brute force (try every merge order)   exponential time
 * Recursively try every window of K consecutive piles, merge it, recurse on the shorter
 * row; memoise on the row's contents. Only usable for tiny inputs.
 *
 * APPROACH 2 — Optimal (interval DP with a K-1 step)   O(n^3 / K) time, O(n^2) space
 * dp[i][j] = min cost to merge stones[i..j] into AS FEW piles as possible
 *            (that number is ((j - i) % (K - 1)) + 1 piles).
 *   dp[i][j] = min over m = i, i+K-1, i+2(K-1), ... < j of dp[i][m] + dp[m+1][j]
 *   (the left part [i..m] is collapsed to exactly ONE pile, which is why m jumps by K-1)
 *   if (j - i) % (K - 1) === 0 the K piles left can merge into one more time:
 *     dp[i][j] += sum(i..j)
 * Answer dp[0][n-1].
 *
 * KNUTH CONNECTION (K = 2)
 * With K = 2 the recurrence becomes the classic "optimal merge of adjacent piles":
 *   dp[i][j] = min over i <= m < j of dp[i][m] + dp[m+1][j] + sum(i..j).
 * Its cost satisfies the Knuth conditions, so opt[i][j-1] <= opt[i][j] <= opt[i+1][j] and
 * the m-loop can be restricted to that range: O(n^3) -> O(n^2). `knuthK2` below does
 * this and is cross-checked against `optimal`.
 *
 * Dry run on [3,2,4,1], K = 2 (pre = [0,3,5,9,10]):
 *   len 2: dp[0][1]=5, dp[1][2]=6, dp[2][3]=5
 *   len 3: dp[0][2] = min(dp[0][0]+dp[1][2], dp[0][1]+dp[2][2]) + 9 = min(6,5) + 9 = 14
 *          dp[1][3] = min(0+5, 6+0) + 7 = 12
 *   len 4: dp[0][3] = min(0+12, 5+5, 14+0) + 10 = 20
 *
 * EDGE CASES
 * - n = 1 -> 0
 * - (n-1) % (K-1) !== 0 -> -1
 * - K = n -> one merge of everything, cost = total
 */

function bruteForce(stones, K) {
  const memo = new Map();
  const go = (row) => {
    if (row.length === 1) return 0;
    if (row.length < K) return Infinity;
    const key = row.join(',');
    if (memo.has(key)) return memo.get(key);
    let best = Infinity;
    for (let i = 0; i + K <= row.length; i++) {
      let s = 0;
      for (let t = i; t < i + K; t++) s += row[t];
      const next = row.slice(0, i).concat([s], row.slice(i + K));
      best = Math.min(best, s + go(next));
    }
    memo.set(key, best);
    return best;
  };
  const ans = go(stones);
  return ans === Infinity ? -1 : ans;
}

function optimal(stones, K) {
  const n = stones.length;
  if ((n - 1) % (K - 1) !== 0) return -1;
  const pre = [0];
  for (const s of stones) pre.push(pre[pre.length - 1] + s);
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = K; len <= n; len++) {          // shorter ranges cannot merge: cost 0
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let m = i; m < j; m += K - 1) dp[i][j] = Math.min(dp[i][j], dp[i][m] + dp[m + 1][j]);
      if ((len - 1) % (K - 1) === 0) dp[i][j] += pre[j + 1] - pre[i];
    }
  }
  return dp[0][n - 1];
}

// K = 2 only: Knuth optimization, O(n^2).
function knuthK2(stones) {
  const n = stones.length;
  if (n <= 1) return 0;
  const pre = [0];
  for (const s of stones) pre.push(pre[pre.length - 1] + s);
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  const opt = Array.from({ length: n }, (_, i) => new Array(n).fill(i));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let m = opt[i][j - 1]; m <= Math.min(opt[i + 1][j], j - 1); m++) {
        const v = dp[i][m] + dp[m + 1][j];
        if (v < dp[i][j]) { dp[i][j] = v; opt[i][j] = m; }
      }
      dp[i][j] += pre[j + 1] - pre[i];
    }
  }
  return dp[0][n - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 2, 4, 1], 2), 20);
  assert.strictEqual(solve([3, 2, 4, 1], 3), -1);
  assert.strictEqual(solve([3, 5, 1, 2, 6], 3), 25);
  assert.strictEqual(solve([7], 3), 0);                  // n = 1
  assert.strictEqual(solve([1, 2, 3], 3), 6);            // K = n
  assert.strictEqual(solve([1, 1, 1, 1], 4), 4);
}
assert.strictEqual(knuthK2([3, 2, 4, 1]), 20);
assert.strictEqual(knuthK2([5]), 0);

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1000);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 7);
  const stones = Array.from({ length: n }, () => 1 + Math.floor(rand() * 20));
  const K = 2 + Math.floor(rand() * 3);
  assert.strictEqual(optimal(stones, K), bruteForce(stones, K));
}
for (let t = 0; t < 100; t++) {
  const n = 1 + Math.floor(rand() * 30);
  const stones = Array.from({ length: n }, () => 1 + Math.floor(rand() * 100));
  assert.strictEqual(knuthK2(stones), optimal(stones, 2));
}
console.log('✓ 07_minimum_cost_to_merge_stones passed');

module.exports = { optimal, bruteForce, knuthK2 };
