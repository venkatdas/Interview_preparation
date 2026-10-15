/**
 * 09. Number of Music Playlists   (LeetCode 920 — Hard)
 *
 * PROBLEM
 * You have n different songs and want a playlist of exactly `goal` slots such that every song
 * is played at least once, and a song may be played again only after k OTHER songs have been
 * played since its last play. Count the playlists modulo 1e9+7.
 *
 * EXAMPLES
 * Input: n = 3, goal = 3, k = 1   Output: 6   (every ordering of the 3 songs)
 * Input: n = 2, goal = 3, k = 0   Output: 6   ([1,1,2],[1,2,1],[2,1,1],[2,2,1],[2,1,2],[1,2,2])
 * Input: n = 2, goal = 3, k = 1   Output: 2   ([1,2,1],[2,1,2])
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= k < n <= goal <= 100
 * - Songs are distinct -> playlists that differ in any slot are different
 *
 * APPROACH 1 — Brute force   O(n^goal) time, O(goal) space
 * Backtrack slot by slot, only allowing songs not among the last k played; at the end check
 * every song appeared. Only for tiny inputs.
 *
 * APPROACH 2 — Optimal (counting DP)   O(goal * n) time, O(n) space
 * dp[i][j] = playlists of length i that use exactly j distinct songs.
 *   - slot i plays a NEW song: (n - (j-1)) choices          -> dp[i-1][j-1] * (n - j + 1)
 *   - slot i REPLAYS an old song: of the j songs used, the last k played are blocked, and
 *     because j > k those k are all distinct -> (j - k) choices -> dp[i-1][j] * max(j - k, 0)
 * Answer dp[goal][n]. Each product is a residue (~1e9) times a number <= 100, which is
 * < 2^53, but we still use mulMod to make the code safe if the multiplier grows.
 *
 * Dry run, n = 2, goal = 3, k = 1 (rows i, columns j = 0..2):
 *   i=0: [1, 0, 0]
 *   i=1: j=1: dp0[0]*2 = 2                                        -> [0, 2, 0]
 *   i=2: j=1: new 0 + replay 2*(1-1)=0 -> 0; j=2: new 2*1 = 2     -> [0, 0, 2]
 *   i=3: j=2: new 0 + replay 2*(2-1) = 2                          -> answer 2
 *
 * EDGE CASES
 * - goal = n -> n! (no replays possible)
 * - k = n - 1 -> replays must cycle exactly; still counted by the same DP
 * - j <= k -> no replay allowed (max(j - k, 0))
 */

const MOD = 1_000_000_007;

/** (a * b) mod m, exact: split b into 16-bit halves so no partial product passes 2^53. */
function mulMod(a, b, m = MOD) {
  const bHi = Math.floor(b / 65536), bLo = b % 65536;
  return (((a * bHi) % m) * 65536 + a * bLo) % m;
}

function bruteForce(n, goal, k) {
  let count = 0;
  const seq = [];
  (function rec() {
    if (seq.length === goal) {
      if (new Set(seq).size === n) count++;
      return;
    }
    const recent = new Set(seq.slice(Math.max(0, seq.length - k)));
    for (let s = 0; s < n; s++) {
      if (recent.has(s)) continue;
      seq.push(s);
      rec();
      seq.pop();
    }
  })();
  return count % MOD;
}

function optimal(n, goal, k) {
  let dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= goal; i++) {
    const next = new Array(n + 1).fill(0);
    for (let j = 1; j <= Math.min(i, n); j++) {
      const fresh = mulMod(dp[j - 1], n - j + 1);
      const replay = j > k ? mulMod(dp[j], j - k) : 0;
      next[j] = (fresh + replay) % MOD;
    }
    dp = next;
  }
  return dp[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(3, 3, 1), 6);
  assert.strictEqual(solve(2, 3, 0), 6);
  assert.strictEqual(solve(2, 3, 1), 2);
  assert.strictEqual(solve(1, 3, 0), 1);
  assert.strictEqual(solve(4, 4, 2), 24); // goal = n -> n!
}
assert.strictEqual(optimal(16, 16, 4), 789741546); // 16! mod p
assert.ok(optimal(100, 100, 0) > 0);
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(9);
for (let t = 0; t < 60; t++) {
  const n = 1 + Math.floor(rand() * 4);
  const goal = n + Math.floor(rand() * (7 - n));
  const k = Math.floor(rand() * n);
  assert.strictEqual(optimal(n, goal, k), bruteForce(n, goal, k));
}
console.log('✓ 09_number_of_music_playlists passed');

module.exports = { optimal, bruteForce };
