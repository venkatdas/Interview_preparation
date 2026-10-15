/**
 * 14. Valid Parenthesis String   (LeetCode 678 — Medium)
 *
 * PROBLEM
 * A string contains '(', ')' and '*'. Each '*' may be treated as '(', ')' or an empty string.
 * Return true if the string can be made into a valid parentheses string.
 *
 * EXAMPLES
 * Input: "()"      Output: true
 * Input: "(*)"     Output: true   Explanation: '*' as empty
 * Input: "(*))"    Output: true   Explanation: '*' as '('
 * Input: ")("      Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Empty string valid? (yes)
 * - Only those three characters? (yes)
 *
 * APPROACH 1 — Brute force   O(3^k) time (k = number of '*')
 * Try all three meanings for each '*' and validate each resulting string.
 *
 * APPROACH 2 — Optimal (greedy min/max open count)   O(n) time, O(1) space
 * Instead of tracking one "open count", track the RANGE of possible open counts:
 *   lo = fewest opens possible so far  (treat every '*' as ')')
 *   hi = most opens possible so far    (treat every '*' as '(')
 * '(' : lo++, hi++        ')' : lo--, hi--        '*' : lo--, hi++
 * If hi < 0, even all-'(' interpretation fails -> false.
 * lo can never be useful below 0, so clamp it to 0 (a '*' that would make it negative is
 * just treated as empty instead). At the end, valid iff lo === 0.
 *
 * WHY GREEDY WORKS
 * The set of achievable open counts after each prefix is always a contiguous range [lo, hi]
 * (changing one '*' moves the count by 1, so no gaps). We never commit a '*' to a meaning;
 * we keep the whole range alive and only discard impossible counts (negative). So the final
 * check "0 is in the range" is exact, not a heuristic.
 *
 * Dry run on "(*))":
 *   '(' lo=1 hi=1
 *   '*' lo=0 hi=2
 *   ')' lo=-1->0 hi=1
 *   ')' lo=-1->0 hi=0   -> lo === 0 -> true
 *
 * EDGE CASES
 * - "" -> true
 * - "*" -> true
 * - ")" -> false (hi goes negative)
 * - "(((" -> false (lo stays 3)
 */

function bruteForce(s) {
  function isValid(str) {
    let open = 0;
    for (const ch of str) {
      open += ch === '(' ? 1 : -1;
      if (open < 0) return false;
    }
    return open === 0;
  }
  function go(index, built) {
    if (index === s.length) return isValid(built);
    const ch = s[index];
    if (ch !== '*') return go(index + 1, built + ch);
    return go(index + 1, built + '(') || go(index + 1, built + ')') || go(index + 1, built);
  }
  return go(0, '');
}

function optimal(s) {
  let lo = 0; // minimum possible number of unmatched '('
  let hi = 0; // maximum possible number of unmatched '('
  for (const ch of s) {
    if (ch === '(') {
      lo++; hi++;
    } else if (ch === ')') {
      lo--; hi--;
    } else {
      lo--; hi++;                 // '*' could be ')' (lo) or '(' (hi)
    }
    if (hi < 0) return false;     // too many ')' even in the best case
    if (lo < 0) lo = 0;           // negative opens impossible; treat extra '*' as empty
  }
  return lo === 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('()'), true);
  assert.strictEqual(solve('(*)'), true);
  assert.strictEqual(solve('(*))'), true);
  assert.strictEqual(solve(')('), false);
  assert.strictEqual(solve(''), true);
  assert.strictEqual(solve('*'), true);
  assert.strictEqual(solve('((('), false);
  assert.strictEqual(solve('(((**'), false);
  assert.strictEqual(solve('(((***'), true);
  assert.strictEqual(solve('**))'), true);
}
console.log('✓ 14-valid-parenthesis-string passed');

module.exports = { optimal, bruteForce };
