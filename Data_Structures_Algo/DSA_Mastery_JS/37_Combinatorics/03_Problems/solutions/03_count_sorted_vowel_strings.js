/**
 * 03. Count Sorted Vowel Strings   (LeetCode 1641 — Medium)
 *
 * PROBLEM
 * Count the strings of length n built only from the vowels a, e, i, o, u in which every
 * letter is the same as or comes after the previous one (lexicographically sorted).
 *
 * EXAMPLES
 * Input: n = 1    Output: 5     ("a","e","i","o","u")
 * Input: n = 2    Output: 15
 * Input: n = 33   Output: 66045
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 50
 * - Letters may repeat? (yes: "aa" counts)
 *
 * APPROACH 1 — Brute force (DP over last letter)   O(5 * 5 * n) time, O(5) space
 * dp[v] = number of sorted strings so far ending in vowel v. A new letter w can follow any
 * v <= w, so newDp[w] = sum of dp[0..w]. (Pure enumeration of 5^n strings is too slow.)
 *
 * APPROACH 2 — Optimal (stars and bars)   O(1) time, O(1) space
 * A sorted string is decided only by HOW MANY of each vowel it uses: x_a + x_e + x_i + x_o + x_u = n,
 * each x >= 0. That is n identical stars split into 5 bins by 4 bars:
 *   answer = C(n + 4, 4) = (n+1)(n+2)(n+3)(n+4) / 24.
 * The product of 4 consecutive integers is always divisible by 4! = 24.
 *
 * Dry run, n = 2: (3*4*5*6)/24 = 360/24 = 15   (aa ae ai ao au ee ei eo eu ii io iu oo ou uu)
 *
 * EDGE CASES
 * - n = 1 -> 5
 * - n = 50 -> 316251 (still tiny, no overflow)
 */

function bruteForce(n) {
  let dp = [1, 1, 1, 1, 1]; // length 1: one string ending in each vowel
  for (let len = 2; len <= n; len++) {
    const next = [0, 0, 0, 0, 0];
    for (let w = 0; w < 5; w++) for (let v = 0; v <= w; v++) next[w] += dp[v];
    dp = next;
  }
  return dp.reduce((a, b) => a + b, 0);
}

function optimal(n) {
  return ((n + 1) * (n + 2) * (n + 3) * (n + 4)) / 24;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(1), 5);
  assert.strictEqual(solve(2), 15);
  assert.strictEqual(solve(3), 35);
  assert.strictEqual(solve(33), 66045);
  assert.strictEqual(solve(50), 316251);
}
// tiny exhaustive check: enumerate all 5^n strings and keep the sorted ones
function enumerate(n) {
  let count = 0;
  (function rec(len, last) {
    if (len === n) { count++; return; }
    for (let v = last; v < 5; v++) rec(len + 1, v);
  })(0, 0);
  return count;
}
for (let n = 1; n <= 8; n++) assert.strictEqual(optimal(n), enumerate(n));
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3);
for (let t = 0; t < 100; t++) {
  const n = 1 + Math.floor(rand() * 50);
  assert.strictEqual(optimal(n), bruteForce(n));
}
console.log('✓ 03_count_sorted_vowel_strings passed');

module.exports = { optimal, bruteForce };
