/**
 * 03. First Bad Version   (LeetCode 278 — Easy)
 *
 * PROBLEM
 * You have n versions [1, 2, ..., n]. At some point a bad version was released and
 * every version after it is also bad. You are given an API isBadVersion(version)
 * that returns a boolean. Find the FIRST bad version using as few API calls as possible.
 *
 * EXAMPLES
 * n = 5, bad = 4:  isBad(3)=false, isBad(5)=true, isBad(4)=true -> 4
 * n = 1, bad = 1:  -> 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is there always at least one bad version? (yes)
 * - n up to 2^31 - 1: (lo + hi) must not overflow in other languages; in JS use lo + ((hi - lo) >> 1)
 *   only if values < 2^31, else Math.floor - we use Math.floor to be safe
 * - Each API call is expensive: minimise calls -> O(log n)
 *
 * APPROACH 1 — Brute force   O(n) API calls
 * Check 1, 2, 3, ... until isBadVersion returns true.
 *
 * APPROACH 2 — Optimal (first true in a monotonic predicate, Template 2)   O(log n) calls, O(1) space
 * The versions look like G G G B B B. We want the boundary (first B). Search [lo, hi]
 * with lo = 1, hi = n: if isBad(mid) the answer is mid or earlier (hi = mid); otherwise
 * it is strictly later (lo = mid + 1). Loop while lo < hi; lo is the answer.
 *
 * Dry run n=5, first bad = 4:
 *   lo=1 hi=5 mid=3 isBad? no  -> lo=4
 *   lo=4 hi=5 mid=4 isBad? yes -> hi=4
 *   lo === hi === 4 -> 4
 *
 * EDGE CASES
 * - first version is bad -> 1
 * - only the last version is bad -> n
 * - n = 1
 */

// LeetCode gives you this API; we build it from the hidden answer.
function makeIsBadVersion(firstBad) {
  return (version) => version >= firstBad;
}

function bruteForce(n, isBadVersion) {
  for (let version = 1; version <= n; version++) {
    if (isBadVersion(version)) return version;
  }
  return -1;
}

function optimal(n, isBadVersion) {
  let lo = 1, hi = n;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (isBadVersion(mid)) hi = mid;     // mid is bad: first bad is mid or earlier
    else lo = mid + 1;                   // mid is good: first bad is after mid
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(5, makeIsBadVersion(4)), 4);
  assert.strictEqual(solve(1, makeIsBadVersion(1)), 1);
  assert.strictEqual(solve(5, makeIsBadVersion(1)), 1);
  assert.strictEqual(solve(5, makeIsBadVersion(5)), 5);
  assert.strictEqual(solve(100, makeIsBadVersion(37)), 37);
}
// optimal makes O(log n) calls even for huge n
let calls = 0;
const counted = (v) => { calls++; return v >= 1702766719; };
assert.strictEqual(optimal(2147483647, counted), 1702766719);
assert.ok(calls <= 32, `too many calls: ${calls}`);
console.log('✓ 03-first-bad-version passed');

module.exports = { optimal, bruteForce, makeIsBadVersion };
