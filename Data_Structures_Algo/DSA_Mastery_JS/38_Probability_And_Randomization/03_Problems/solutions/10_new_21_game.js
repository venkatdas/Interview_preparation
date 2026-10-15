/**
 * 10. New 21 Game   (LeetCode 837 — Medium, tricky)
 *
 * PROBLEM
 * Alice starts with 0 points. While her score is below k she draws: each draw
 * adds a uniform random integer from 1..maxPts. She stops as soon as her score
 * is >= k. Return the probability that her final score is <= n.
 *
 * EXAMPLES
 * n = 10, k = 1,  maxPts = 10  -> 1.0      (one draw, always 1..10 <= 10)
 * n = 6,  k = 1,  maxPts = 10  -> 0.6      (one draw, 6 of 10 values are <= 6)
 * n = 21, k = 17, maxPts = 10  -> 0.73278  (blackjack-style)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= k <= n <= 1e4, 1 <= maxPts <= 1e4 -> O(n * maxPts) = 1e8 is too slow; need O(n + maxPts)
 * - k = 0 -> she never draws, score 0 <= n -> 1
 *
 * APPROACH 1 — Brute force (probability DP, inner loop)   O(n * maxPts) time, O(n) space
 * p[x] = probability she ever has EXACTLY score x.
 * p[0] = 1. For x >= 1: p[x] = (1 / maxPts) * sum of p[x - j] for j in 1..maxPts
 * where x - j >= 0 AND x - j < k (she only draws from scores below k).
 * Answer = sum of p[x] for k <= x <= n.
 *
 * APPROACH 2 — Optimal (sliding-window sum)   O(n) time, O(n) space
 * The inner sum is over a WINDOW of previous p values: indices
 * [max(0, x - maxPts), min(x - 1, k - 1)]. Keep its running sum:
 *   p[x] = windowSum / maxPts
 *   if x < k: windowSum += p[x]            (x can still draw, so it feeds future scores)
 *   if x - maxPts >= 0 and x - maxPts < k: windowSum -= p[x - maxPts]   (slides out)
 * Shortcut: if k = 0 or n >= k - 1 + maxPts, the max reachable score is <= n -> 1.
 *
 * Dry run on n = 6, k = 1, maxPts = 10:
 *   p[0] = 1, windowSum = 1 (0 < k so it can draw)
 *   x = 1..6: p[x] = 1/10 each (0 is the only drawing score); windowSum unchanged (x >= k)
 *   answer = p[1] + ... + p[6] = 0.6
 *
 * EDGE CASES
 * - k = 0 -> 1
 * - n >= k + maxPts - 1 -> 1 (every final score is between k and k - 1 + maxPts)
 * - only scores < k feed the window; scores >= k are terminal
 */
const { mulberry32, randInt } = require('../../02_Implementations/randomization');

function bruteForce(n, k, maxPts) {
  if (k === 0) return 1;
  const p = new Array(n + 1).fill(0);
  p[0] = 1;
  let answer = 0;
  for (let x = 1; x <= n; x++) {
    let s = 0;
    for (let j = 1; j <= maxPts; j++) {
      const prev = x - j;
      if (prev >= 0 && prev < k) s += p[prev];
    }
    p[x] = s / maxPts;
    if (x >= k) answer += p[x];
  }
  return answer;
}

function optimal(n, k, maxPts) {
  if (k === 0 || n >= k - 1 + maxPts) return 1;
  const p = new Array(n + 1).fill(0);
  p[0] = 1;
  let windowSum = 1; // sum of p[s] for drawing scores s inside the window
  let answer = 0;
  for (let x = 1; x <= n; x++) {
    p[x] = windowSum / maxPts;
    if (x < k) windowSum += p[x];
    else answer += p[x];
    const out = x - maxPts;
    if (out >= 0 && out < k) windowSum -= p[out];
  }
  return answer;
}

function simulate(n, k, maxPts, trials, rng = Math.random) {
  let wins = 0;
  for (let t = 0; t < trials; t++) {
    let score = 0;
    while (score < k) score += randInt(1, maxPts, rng);
    if (score <= n) wins++;
  }
  return wins / trials;
}

// ---------- tests ----------
const assert = require('assert');
const close = (a, b, eps = 1e-5) => Math.abs(a - b) <= eps;
for (const solve of [bruteForce, optimal]) {
  assert.ok(close(solve(10, 1, 10), 1));
  assert.ok(close(solve(6, 1, 10), 0.6));
  assert.ok(close(solve(21, 17, 10), 0.73278));
  assert.ok(close(solve(0, 0, 1), 1));
  assert.ok(close(solve(5, 5, 1), 1)); // draws only 1s, lands exactly on 5
  assert.ok(close(solve(1, 1, 2), 0.5));
}
const rng = mulberry32(837);
for (let t = 0; t < 300; t++) {
  const k = Math.floor(rng() * 30);
  const n = k + Math.floor(rng() * 30);
  const maxPts = 1 + Math.floor(rng() * 15);
  assert.ok(close(optimal(n, k, maxPts), bruteForce(n, k, maxPts), 1e-9), `n=${n} k=${k} m=${maxPts}`);
}
assert.ok(Math.abs(simulate(21, 17, 10, 100000, rng) - 0.73278) < 0.01);
assert.ok(optimal(10000, 9999, 10000) > 0); // large input runs in O(n)
console.log('✓ 10_new_21_game passed');

module.exports = { optimal, bruteForce, simulate };
