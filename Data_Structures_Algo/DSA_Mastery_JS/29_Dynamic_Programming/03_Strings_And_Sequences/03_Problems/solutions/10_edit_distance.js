/**
 * 10. Edit Distance   (LeetCode 72 — Medium, feels Hard)
 *
 * PROBLEM
 * Given two strings word1 and word2, return the minimum number of operations to
 * convert word1 into word2. Allowed operations, each costing 1:
 *   insert a character, delete a character, replace a character.
 *
 * EXAMPLES
 * Input: "horse", "ros"           Output: 3
 *   Explanation: horse -> rorse (replace h) -> rose (delete r) -> ros (delete e)
 * Input: "intention", "execution" Output: 5
 * Input: "", "abc"                Output: 3   Explanation: three inserts
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are all three operations cost 1? (yes; if costs differ the recurrence stays the
 *   same, only the constants change)
 * - Empty strings? (distance = length of the other)
 *
 * APPROACH 1 — Brute force   O(3^(m+n)) time, O(m+n) space
 * Compare the current chars. If equal, free, move both. Otherwise try all three:
 *   replace -> move both, insert -> move j only, delete -> move i only. 1 + min.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = min ops to turn word1[0..i) into word2[0..j)
 * RECURRENCE if word1[i-1] === word2[j-1]: dp[i][j] = dp[i-1][j-1]
 *            else dp[i][j] = 1 + min( dp[i-1][j-1]   replace
 *                                    , dp[i-1][j]     delete word1[i-1]
 *                                    , dp[i][j-1] )   insert word2[j-1]
 * BASE CASES dp[i][0] = i (delete all), dp[0][j] = j (insert all)
 * ANSWER     dp[m][n]
 *
 * Table for "horse" -> "ros":
 *            ""  r  o  s
 *        ""   0  1  2  3
 *        h    1  1  2  3      dp[1][1]: h!=r -> 1 + min(0, 1, 1) = 1 (replace)
 *        o    2  2  1  2      dp[2][2]: o==o -> dp[1][1] = 1
 *        r    3  2  2  2
 *        s    4  3  3  2      dp[4][3]: s==s -> dp[3][2] = 2
 *        e    5  4  4  3      answer 3
 *
 * Reading a cell: "up-left" = replace/match, "up" = delete, "left" = insert.
 *
 * APPROACH 3 — Space optimized   O(m*n) time, O(n) space
 * Two rows; remember to set curr[0] = i for each new row.
 *
 * EDGE CASES
 * - both empty -> 0
 * - identical -> 0
 * - one empty -> length of the other
 * - completely different, same length -> that length (all replaces)
 */

function bruteForce(word1, word2) {
  function distance(i, j) {
    if (i === word1.length) return word2.length - j; // insert the rest
    if (j === word2.length) return word1.length - i; // delete the rest
    if (word1[i] === word2[j]) return distance(i + 1, j + 1);
    const replace = distance(i + 1, j + 1);
    const del = distance(i + 1, j);
    const insert = distance(i, j + 1);
    return 1 + Math.min(replace, del, insert);
  }
  return distance(0, 0);
}

function memo(word1, word2) {
  const cache = new Map();
  function distance(i, j) {
    if (i === word1.length) return word2.length - j;
    if (j === word2.length) return word1.length - i;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (word1[i] === word2[j]) {
      result = distance(i + 1, j + 1);
    } else {
      result = 1 + Math.min(distance(i + 1, j + 1), distance(i + 1, j), distance(i, j + 1));
    }
    cache.set(key, result);
    return result;
  }
  return distance(0, 0);
}

function tabulation(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j - 1], // replace
          dp[i - 1][j], // delete
          dp[i][j - 1] // insert
        );
      }
    }
  }
  return dp[m][n];
}

function optimized(word1, word2) {
  const n = word2.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j); // row 0: j inserts
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= word1.length; i++) {
    curr[0] = i; // turning i chars into "" takes i deletes
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) curr[j] = prev[j - 1];
      else curr[j] = 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('horse', 'ros'), 3);
  assert.strictEqual(solve('intention', 'execution'), 5);
  assert.strictEqual(solve('', 'abc'), 3);
  assert.strictEqual(solve('abc', ''), 3);
  assert.strictEqual(solve('', ''), 0);
  assert.strictEqual(solve('same', 'same'), 0);
  assert.strictEqual(solve('abc', 'xyz'), 3);
  assert.strictEqual(solve('kitten', 'sitting'), 3);
}
console.log('✓ 10-edit-distance passed');

module.exports = { bruteForce, memo, tabulation, optimized };
