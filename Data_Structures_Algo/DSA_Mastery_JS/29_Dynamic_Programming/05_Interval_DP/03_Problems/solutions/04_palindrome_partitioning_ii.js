/**
 * 04. Palindrome Partitioning II   (LeetCode 132 — Hard)
 *
 * PROBLEM
 * Given a string s, split it into substrings so that every substring is a palindrome.
 * Return the MINIMUM number of cuts needed.
 *
 * EXAMPLES
 * Input: "aab"     Output: 1    Explanation: "aa" | "b"
 * Input: "a"       Output: 0
 * Input: "ab"      Output: 1
 * Input: "abcba"   Output: 0    Explanation: already a palindrome
 * Input: "abccbc"  Output: 2    Explanation: "a" | "bccb" | "c"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= s.length <= 2000, lowercase letters only
 * - Is the empty string possible? (no; but we handle it -> 0)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^n * n) time, O(n) space
 * From position i, try every end j >= i. If s[i..j] is a palindrome (checked by
 * scanning), cut there and recurse from j + 1. Take the minimum. Every position can be
 * a cut or not -> 2^n partitions.
 *
 * APPROACH 2 — Memo / Tabulation (interval table + 1D DP)   O(n^2) time, O(n^2) space
 * Two DPs. The first is a classic INTERVAL table, the second is a 1D prefix DP that
 * reads it.
 *
 *   TABLE 1 (interval)
 *   STATE      isPal[l][r] = true if s[l..r] is a palindrome
 *   RECURRENCE isPal[l][r] = s[l] === s[r] && (r - l < 2 || isPal[l+1][r-1])
 *   BASE CASES isPal[i][i] = true;  length-2: s[l] === s[r]
 *   Fill by increasing length (or l from n-1 down, r from l up) so the inner range is ready.
 *
 *   TABLE 2 (1D)
 *   STATE      cuts[i] = min cuts for the prefix s[0..i-1]  (first i chars)
 *   RECURRENCE cuts[i] = min over j < i with isPal[j][i-1] of:
 *                        (j === 0 ? 0 : cuts[j] + 1)
 *              "the last piece is s[j..i-1]; it must be a palindrome; before it we need
 *               cuts[j] cuts plus one more cut to separate the last piece (unless j = 0)"
 *   BASE CASES cuts[0] = 0
 *   ANSWER     cuts[n]
 *
 * Dry run on "aab":
 *   isPal: [0][0]=T [1][1]=T [2][2]=T [0][1]=T("aa") [1][2]=F [0][2]=F
 *   cuts[1]: j=0 isPal[0][0] -> 0                 => cuts[1] = 0
 *   cuts[2]: j=0 isPal[0][1] -> 0                 => cuts[2] = 0
 *   cuts[3]: j=0 isPal[0][2]? F
 *            j=1 isPal[1][2]? F
 *            j=2 isPal[2][2] T -> cuts[2]+1 = 1   => cuts[3] = 1
 *   answer 1
 *
 * EDGE CASES
 * - length 1 -> 0
 * - whole string palindrome -> 0 (j = 0 branch)
 * - all distinct chars -> n - 1
 */

function isPalindromeScan(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

function bruteForce(s) {
  const n = s.length;
  function minCutsFrom(start) {
    if (start === n) return -1; // the last piece gets "+1" too, cancel it here
    let best = Infinity;
    for (let end = start; end < n; end++) {
      if (isPalindromeScan(s, start, end)) {
        best = Math.min(best, 1 + minCutsFrom(end + 1));
      }
    }
    return best;
  }
  return n === 0 ? 0 : minCutsFrom(0);
}

function memo(s) {
  const n = s.length;
  if (n === 0) return 0;
  const palCache = Array.from({ length: n }, () => new Array(n).fill(null));
  const cutCache = new Array(n + 1).fill(null);

  // interval DP as recursion: isPal(l, r) depends on isPal(l+1, r-1)
  function isPal(left, right) {
    if (left >= right) return true;
    if (palCache[left][right] !== null) return palCache[left][right];
    palCache[left][right] = s[left] === s[right] && isPal(left + 1, right - 1);
    return palCache[left][right];
  }

  function minCutsFrom(start) {
    if (start === n) return -1;
    if (cutCache[start] !== null) return cutCache[start];
    let best = Infinity;
    for (let end = start; end < n; end++) {
      if (isPal(start, end)) best = Math.min(best, 1 + minCutsFrom(end + 1));
    }
    cutCache[start] = best;
    return best;
  }
  return minCutsFrom(0);
}

function tabulation(s) {
  const n = s.length;
  if (n === 0) return 0;

  // ----- table 1: interval palindrome table, filled by increasing length -----
  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let len = 1; len <= n; len++) {
    for (let left = 0; left + len - 1 < n; left++) {
      const right = left + len - 1;
      if (s[left] !== s[right]) continue;
      isPal[left][right] = len <= 2 || isPal[left + 1][right - 1];
    }
  }

  // ----- table 2: 1D prefix DP that reads table 1 -----
  const cuts = new Array(n + 1).fill(Infinity);
  cuts[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (!isPal[j][i - 1]) continue;          // last piece s[j..i-1] must be a palindrome
      cuts[i] = Math.min(cuts[i], j === 0 ? 0 : cuts[j] + 1);
    }
  }
  return cuts[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve('aab'), 1);
  assert.strictEqual(solve('a'), 0);           // single char
  assert.strictEqual(solve('ab'), 1);          // two different chars
  assert.strictEqual(solve('abcba'), 0);       // already a palindrome
  assert.strictEqual(solve('abccbc'), 2);
  assert.strictEqual(solve('abcdef'), 5);      // all distinct
  assert.strictEqual(solve('aaaaaa'), 0);
  assert.strictEqual(solve(''), 0);
}
console.log('✓ 04-palindrome-partitioning-ii passed');

module.exports = { bruteForce, memo, tabulation };
