/**
 * 17. Word Break   (LeetCode 139 — Medium)
 *
 * PROBLEM
 * Given a string s and a dictionary of words, return true if s can be split
 * into a sequence of one or more dictionary words (words may be reused).
 *
 * EXAMPLES
 * Input: s = "leetcode", dict = ["leet","code"]            Output: true
 * Input: s = "applepenapple", dict = ["apple","pen"]       Output: true
 * Input: s = "catsandog", dict = ["cats","dog","sand","and","cat"]   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= s.length <= 300, dictionary words are unique
 * - Can a word be reused? (yes)
 *
 * DP DEFINITION
 * STATE:       dp[i] = can the prefix s[0..i-1] be fully segmented?
 * RECURRENCE:  dp[i] = OR over j < i of ( dp[j] AND s[j..i-1] is a word )
 * BASE CASES:  dp[0] = true (empty prefix)
 * ANSWER:      dp[n]
 *
 * APPROACH 1 — Brute force   O(2^n) time
 * From each start index, try every dictionary word that matches and recurse.
 *
 * APPROACH 2 — Memoization   O(n^2 * wordLen) time, O(n) space
 * Cache by start index.
 *
 * APPROACH 3 — Tabulation   O(n^2) substring checks, O(n) space
 * Dry run, s = "leetcode", dict = {leet, code}:
 *   i    : 0  1  2  3  4  5  6  7  8
 *   dp   : T  F  F  F  T  F  F  F  T
 *   dp[4]: j=0, dp[0]=T and "leet" in dict -> T
 *   dp[8]: j=4, dp[4]=T and "code" in dict -> T
 *
 * APPROACH 4 — Not applicable for space; dp[i] depends on arbitrary earlier cells.
 * (Optimization: only try j in [i - maxWordLength, i-1].)
 *
 * EDGE CASES
 * - s is exactly one dictionary word
 * - dictionary is empty -> false
 * - "aaaaab" with ["a","aa"] -> false (classic exponential trap without memo)
 */

function bruteForce(s, wordDict) {
  function canBreakFrom(start) {
    if (start === s.length) return true;
    for (const word of wordDict) {
      if (s.startsWith(word, start) && canBreakFrom(start + word.length)) return true;
    }
    return false;
  }
  return canBreakFrom(0);
}

function memo(s, wordDict) {
  const cache = new Map();
  function canBreakFrom(start) {
    if (start === s.length) return true;
    if (cache.has(start)) return cache.get(start);
    let result = false;
    for (const word of wordDict) {
      if (s.startsWith(word, start) && canBreakFrom(start + word.length)) {
        result = true;
        break;
      }
    }
    cache.set(start, result);
    return result;
  }
  return canBreakFrom(0);
}

function tabulation(s, wordDict) {
  const words = new Set(wordDict);
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let end = 1; end <= n; end++) {
    for (let start = 0; start < end; start++) {
      if (dp[start] && words.has(s.slice(start, end))) {
        dp[end] = true;
        break; // one valid split is enough
      }
    }
  }
  return dp[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve('leetcode', ['leet', 'code']), true);
  assert.strictEqual(solve('applepenapple', ['apple', 'pen']), true);
  assert.strictEqual(solve('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']), false);
  assert.strictEqual(solve('a', ['a']), true);
  assert.strictEqual(solve('a', []), false);
  assert.strictEqual(solve('aaaaaaaaaaaaaaab', ['a', 'aa', 'aaa']), false);
  assert.strictEqual(solve('cars', ['car', 'ca', 'rs']), true);
}
console.log('✓ 17-word-break passed');

module.exports = { bruteForce, memo, tabulation };
