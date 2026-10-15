/**
 * 08. Remove Boxes   (LeetCode 546 — Hard)
 *
 * PROBLEM
 * You have boxes in a row, each with a colour (a number). In one move you remove a
 * contiguous group of k boxes of the same colour and score k * k points. After removal
 * the remaining boxes close the gap. Return the maximum total score.
 *
 * EXAMPLES
 * Input: [1, 3, 2, 2, 2, 3, 4, 3, 1]   Output: 23
 *   Explanation: remove [2,2,2] -> 9, then [3,3,3] -> 9 (they became adjacent),
 *                then [1,1] -> 4, then [4] -> 1. Total 23.
 * Input: [1, 1, 1]   Output: 9
 * Input: [1]         Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 100, 1 <= colour <= 100
 * - Must every box be removed? (yes, until the row is empty)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(exponential) time, O(n) space
 * Try every maximal group of equal adjacent boxes as the next removal, build the new
 * array, recurse. Only feasible for n <= 8.
 *
 * APPROACH 2 — Memo / Tabulation (Interval DP with a THIRD dimension)   O(n^4) time, O(n^3) space
 * Why a plain dp[l][r] fails: the best way to handle boxes[r] may be to SAVE it and
 * remove it together with equal boxes that sit to the right of r (which were kept from
 * an outer range). The range alone does not know how many such boxes are waiting.
 * So we add that count to the state.
 *
 *   STATE      dp[l][r][k] = max score for boxes[l..r] given that there are k extra boxes
 *                            of colour boxes[r] immediately to the right of r (already
 *                            attached, not yet scored)
 *   RECURRENCE Option A: remove boxes[r] together with its k attached friends now:
 *                dp[l][r][k] = (k + 1)^2 + dp[l][r-1][0]
 *              Option B: for some m in [l, r-1] with boxes[m] === boxes[r]: first clear
 *                boxes[m+1..r-1] completely, so boxes[m] touches boxes[r] and its k friends.
 *                dp[l][r][k] = max( dp[l][m][k + 1] + dp[m+1][r-1][0] )
 *   BASE CASES dp[l][r][k] = 0 when l > r
 *   ANSWER     dp[0][n-1][0]
 *
 * Dry run on [1, 2, 1]:
 *   f(0,2,0):  option A: 1^2 + f(0,1,0)
 *                 f(0,1,0): A: 1 + f(0,0,0) = 1 + 1 = 2 ; no m with boxes[m]==2 -> 2
 *                 => 1 + 2 = 3
 *              option B: m=0 (boxes[0]==boxes[2]==1): f(0,0,1) + f(1,1,0)
 *                 f(0,0,1): A: (1+1)^2 + f(0,-1,0) = 4 -> 4
 *                 f(1,1,0): 1
 *                 => 5
 *              answer 5  (remove the 2 first, then [1,1] for 4)
 *
 * Small optimization used in all versions: boxes equal to boxes[r] directly left of r
 * can always be merged with it (they are never worth splitting). We leave that out of
 * the brute-force to keep it literal, but the DP stays correct without it too.
 *
 * EDGE CASES
 * - Single box -> 1
 * - All same colour -> n^2
 * - All distinct -> n
 */

function bruteForce(boxes) {
  function best(remaining) {
    if (remaining.length === 0) return 0;
    let max = 0;
    let start = 0;
    while (start < remaining.length) {
      let end = start;
      while (end + 1 < remaining.length && remaining[end + 1] === remaining[start]) end++;
      const groupSize = end - start + 1;
      const rest = remaining.slice(0, start).concat(remaining.slice(end + 1));
      max = Math.max(max, groupSize * groupSize + best(rest));
      start = end + 1;
    }
    return max;
  }
  return best(boxes);
}

function memo(boxes) {
  const n = boxes.length;
  // cache[l][r][k]; k can be at most n
  const cache = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => new Array(n + 1).fill(-1))
  );

  function score(left, right, attached) {
    if (left > right) return 0;
    if (cache[left][right][attached] !== -1) return cache[left][right][attached];

    // option A: remove boxes[right] with its `attached` friends now
    let best = (attached + 1) * (attached + 1) + score(left, right - 1, 0);

    // option B: keep boxes[right] and join it with an equal box at m
    for (let m = left; m < right; m++) {
      if (boxes[m] === boxes[right]) {
        best = Math.max(best, score(left, m, attached + 1) + score(m + 1, right - 1, 0));
      }
    }
    cache[left][right][attached] = best;
    return best;
  }
  return score(0, n - 1, 0);
}

function tabulation(boxes) {
  const n = boxes.length;
  if (n === 0) return 0;
  // dp[l][r][k], filled by increasing range length so every sub-range is ready
  const dp = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => new Array(n + 1).fill(0))
  );

  function get(left, right, attached) {
    return left > right ? 0 : dp[left][right][attached];
  }

  for (let len = 1; len <= n; len++) {
    for (let left = 0; left + len - 1 < n; left++) {
      const right = left + len - 1;
      for (let attached = 0; attached <= n - len; attached++) {
        let best = (attached + 1) * (attached + 1) + get(left, right - 1, 0);
        for (let m = left; m < right; m++) {
          if (boxes[m] === boxes[right]) {
            best = Math.max(best, get(left, m, attached + 1) + get(m + 1, right - 1, 0));
          }
        }
        dp[left][right][attached] = best;
      }
    }
  }
  return dp[0][n - 1][0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([1, 3, 2, 2, 2, 3, 4, 3, 1]), 23);
  assert.strictEqual(solve([1, 1, 1]), 9);           // all same -> n^2
  assert.strictEqual(solve([1]), 1);                 // single box
  assert.strictEqual(solve([1, 2, 1]), 5);
  assert.strictEqual(solve([1, 2, 3, 4]), 4);        // all distinct
  assert.strictEqual(solve([1, 2]), 2);              // two boxes
  assert.strictEqual(solve([3, 8, 8, 5, 5, 3, 9, 2]), 14);  // 4 + 4 + [3,3]=4 + 1 + 1
}
console.log('✓ 08-remove-boxes passed');

module.exports = { bruteForce, memo, tabulation };
