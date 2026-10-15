/**
 * 07. Strange Printer   (LeetCode 664 — Hard)
 *
 * PROBLEM
 * A printer can print a sequence of the SAME character over any contiguous range in one
 * turn, overwriting whatever is there. Starting from an empty page, return the minimum
 * number of turns needed to print the string s.
 *
 * EXAMPLES
 * Input: "aaabbb"   Output: 2    Explanation: print "aaa", then "bbb"
 * Input: "aba"      Output: 2    Explanation: print "aaa", then overwrite the middle with "b"
 * Input: "abcabc"   Output: 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= s.length <= 100, lowercase letters
 * - Can a turn print a single character? (yes)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(exponential) time, O(n) space
 * To print s[l..r], the first turn must print s[l] over some range s[l..k]
 * (it is always optimal to start that turn at l). Then:
 *   - If s[k] === s[l], the characters l and k are "free" (they come from the same turn);
 *     we only need s[l+1..k-1] and s[k+1..r] painted separately... this reasoning leads
 *     straight to the DP below, so the brute force simply tries every split.
 *
 * APPROACH 2 — Memo / Tabulation (Interval DP, merge equal ends)   O(n^3) time, O(n^2) space
 *   STATE      dp[l][r] = min turns to print s[l..r]
 *   RECURRENCE Start with dp[l][r] = 1 + dp[l+1][r]   (print s[l] alone, then the rest).
 *              Then for every k in (l, r] with s[k] === s[l]:
 *                dp[l][r] = min(dp[l][r], dp[l][k-1] + dp[k+1][r])
 *              "The turn that prints s[l] is extended all the way to k, so s[k] costs
 *               nothing extra. The middle s[l+1..k-1] is painted on top (counted in
 *               dp[l][k-1], which includes s[l]'s turn), and s[k+1..r] is independent."
 *   BASE CASES dp[i][i] = 1;  dp[l][r] = 0 when l > r
 *   ANSWER     dp[0][n-1]
 *
 * Dry run on "aba":
 *   len 1: dp[0][0]=1 dp[1][1]=1 dp[2][2]=1
 *   len 2: dp[0][1] = 1 + dp[1][1] = 2 (no k with s[k]=='a')     -> 2
 *          dp[1][2] = 1 + dp[2][2] = 2                             -> 2
 *   len 3: dp[0][2] = 1 + dp[1][2] = 3;  k=2 s[2]=='a' -> dp[0][1] + dp[3][2] = 2 + 0 = 2
 *          -> 2
 *
 *        r=0  r=1  r=2
 *   l=0 [ 1 ][ 2 ][ 2 ]
 *   l=1 [ - ][ 1 ][ 2 ]
 *   l=2 [ - ][ - ][ 1 ]
 *
 * Trick: collapse consecutive duplicates first ("aaabbb" -> "ab"); it never changes
 * the answer and makes the DP smaller.
 *
 * EDGE CASES
 * - single char -> 1
 * - all same char -> 1
 * - all distinct -> n
 */

function collapseRuns(s) {
  let result = '';
  for (const ch of s) if (ch !== result[result.length - 1]) result += ch;
  return result;
}

function bruteForce(input) {
  const s = collapseRuns(input);

  function turns(left, right) {
    if (left > right) return 0;
    if (left === right) return 1;
    let best = 1 + turns(left + 1, right);          // print s[left] by itself
    for (let k = left + 1; k <= right; k++) {
      if (s[k] === s[left]) {
        // extend the turn printing s[left] to cover k as well
        best = Math.min(best, turns(left, k - 1) + turns(k + 1, right));
      }
    }
    return best;
  }
  return turns(0, s.length - 1);
}

function memo(input) {
  const s = collapseRuns(input);
  const n = s.length;
  const cache = Array.from({ length: n }, () => new Array(n).fill(-1));

  function turns(left, right) {
    if (left > right) return 0;
    if (left === right) return 1;
    if (cache[left][right] !== -1) return cache[left][right];
    let best = 1 + turns(left + 1, right);
    for (let k = left + 1; k <= right; k++) {
      if (s[k] === s[left]) best = Math.min(best, turns(left, k - 1) + turns(k + 1, right));
    }
    cache[left][right] = best;
    return best;
  }
  return turns(0, n - 1);
}

function tabulation(input) {
  const s = collapseRuns(input);
  const n = s.length;
  if (n === 0) return 0;
  // one extra row/col so dp[k+1][r] with k === r reads 0 safely
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;

  for (let len = 2; len <= n; len++) {
    for (let left = 0; left + len - 1 < n; left++) {
      const right = left + len - 1;
      dp[left][right] = 1 + dp[left + 1][right];
      for (let k = left + 1; k <= right; k++) {
        if (s[k] === s[left]) {
          const rightPart = k + 1 <= right ? dp[k + 1][right] : 0;
          dp[left][right] = Math.min(dp[left][right], dp[left][k - 1] + rightPart);
        }
      }
    }
  }
  return dp[0][n - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve('aaabbb'), 2);
  assert.strictEqual(solve('aba'), 2);
  assert.strictEqual(solve('abcabc'), 5);
  assert.strictEqual(solve('a'), 1);           // single char
  assert.strictEqual(solve('aaaa'), 1);        // all same
  assert.strictEqual(solve('abcd'), 4);        // all distinct
  assert.strictEqual(solve('abab'), 3);
  assert.strictEqual(solve('tbgtgb'), 4);
}
console.log('✓ 07-strange-printer passed');

module.exports = { bruteForce, memo, tabulation };
