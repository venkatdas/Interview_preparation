/**
 * 02. Number of Ways to Reach the Target (prefix-sum transition)   (Original — Medium)
 *
 * PROBLEM
 * A robot starts on tile 0 of a corridor and wants to stop exactly on tile `target`.
 * Each move goes forward by any whole distance d with minJump <= d <= maxJump.
 * Some tiles are broken (given as a list); the robot may never land on a broken tile.
 * Count the different move sequences that end on `target`, modulo 1_000_000_007.
 *
 * EXAMPLES
 * target = 4, minJump = 1, maxJump = 2, broken = []   -> 5   (stairs: 1111,112,121,211,22)
 * target = 5, minJump = 2, maxJump = 3, broken = [4]  -> 2   (0-2-5, 0-3-5)
 * target = 6, minJump = 2, maxJump = 2, broken = [4]  -> 0   (must pass through 4)
 * target = 0, any jumps                               -> 1   (already there: empty sequence)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= target <= 1e5, 1 <= minJump <= maxJump <= 1e5.
 * - Is tile 0 ever broken? (if it is, the answer is 0)
 * - Order matters? (yes: 1+2 and 2+1 are different sequences)
 *
 * APPROACH 1 — Brute force DP   O(target · (maxJump - minJump + 1)) time, O(target) space
 * dp[i] = sum of dp[i - d] for d in [minJump, maxJump], 0 if tile i is broken.
 * With a wide jump range this is 1e10 additions.
 *
 * APPROACH 2 — Optimal (prefix sums over dp)   O(target + |broken|) time, O(target) space
 * The terms dp[i-maxJump .. i-minJump] are a CONTIGUOUS RANGE of earlier states.
 * Keep pre[x] = dp[0] + ... + dp[x-1]; then the range sum is pre[i-minJump+1] - pre[left].
 * Build pre while you build dp (pre[i+1] needs dp[i], which is final once computed).
 *
 * Dry run on target = 5, minJump = 2, maxJump = 3, broken = [4]:
 *   i | range of j | dp[i]                 | pre after (pre[0..i+1])
 *   0 | -          | 1                     | [0,1]
 *   1 | none (1-2<0)| 0                    | [0,1,1]
 *   2 | [0,0]      | pre[1]-pre[0] = 1     | [0,1,1,2]
 *   3 | [0,1]      | pre[2]-pre[0] = 1     | [0,1,1,2,3]
 *   4 | broken     | 0                     | [0,1,1,2,3,3]
 *   5 | [2,3]      | pre[4]-pre[2] = 2     | ...
 *   answer 2
 *
 * EDGE CASES
 * - target = 0 -> 1;  tile 0 broken -> 0
 * - target broken -> 0
 * - subtract under a modulus -> add MOD before taking % so the result is not negative
 */

const MOD = 1_000_000_007;

function bruteForce(target, minJump, maxJump, broken = []) {
  const bad = new Set(broken);
  if (bad.has(0)) return 0;
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= target; i++) {
    if (bad.has(i)) continue;
    for (let d = minJump; d <= maxJump && d <= i; d++) dp[i] = (dp[i] + dp[i - d]) % MOD;
  }
  return dp[target];
}

function optimal(target, minJump, maxJump, broken = []) {
  const bad = new Set(broken);
  if (bad.has(0)) return 0;
  const dp = new Array(target + 1).fill(0);
  const pre = new Array(target + 2).fill(0);
  dp[0] = 1;
  pre[1] = 1;
  for (let i = 1; i <= target; i++) {
    const right = i - minJump;
    const left = Math.max(0, i - maxJump);
    if (!bad.has(i) && right >= 0) dp[i] = (pre[right + 1] - pre[left] + MOD) % MOD;
    pre[i + 1] = (pre[i] + dp[i]) % MOD;
  }
  return dp[target];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4, 1, 2), 5);
  assert.strictEqual(solve(5, 2, 3, [4]), 2);
  assert.strictEqual(solve(6, 2, 2, [4]), 0);
  assert.strictEqual(solve(0, 1, 3), 1);
  assert.strictEqual(solve(3, 1, 3, [0]), 0);
  assert.strictEqual(solve(3, 1, 3, [3]), 0);
  assert.strictEqual(solve(10, 1, 1), 1);
}
assert.strictEqual(optimal(1000, 1, 2), bruteForce(1000, 1, 2)); // large -> modulus matters

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
for (let t = 0; t < 300; t++) {
  const target = Math.floor(rand() * 60);
  const lo = 1 + Math.floor(rand() * 5);
  const hi = lo + Math.floor(rand() * 6);
  const broken = Array.from({ length: Math.floor(rand() * 5) }, () => 1 + Math.floor(rand() * 60));
  assert.strictEqual(optimal(target, lo, hi, broken), bruteForce(target, lo, hi, broken));
}
console.log('✓ 02_number_of_ways_prefix_sum passed');

module.exports = { optimal, bruteForce };
