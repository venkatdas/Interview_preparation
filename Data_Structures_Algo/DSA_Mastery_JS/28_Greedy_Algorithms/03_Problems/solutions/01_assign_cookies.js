/**
 * 01. Assign Cookies   (LeetCode 455 — Easy)
 *
 * PROBLEM
 * Each child i has a greed factor g[i] (the smallest cookie that makes them happy).
 * Each cookie j has a size s[j]. A cookie can go to at most one child, and child i is content
 * only if s[j] >= g[i]. Return the maximum number of content children.
 *
 * EXAMPLES
 * Input: g = [1,2,3], s = [1,1]   Output: 1   Explanation: only the child with greed 1 can be fed
 * Input: g = [1,2], s = [1,2,3]   Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can either array be empty? (yes -> 0)
 * - Can one child get two cookies? (no, at most one each)
 * - Are the arrays sorted? (no, we may sort them)
 *
 * APPROACH 1 — Brute force   O(2^n) / O(n!) time
 * Try every way of assigning cookies to children (backtracking) and keep the best count.
 * Only possible for tiny inputs; included to show what we are optimising.
 *
 * APPROACH 2 — Optimal (sort + two pointers greedy)   O(n log n + m log m) time, O(1) extra
 * Sort both arrays. Walk the cookies from smallest to largest. Give the current cookie to the
 * least greedy unfed child if it fits; otherwise this cookie fits nobody left, throw it away.
 *
 * WHY GREEDY WORKS
 * The least greedy child is the easiest to satisfy. Using the smallest cookie that satisfies
 * them "wastes" the least cookie size. Exchange argument: if an optimal answer gives that child
 * a bigger cookie, swap it with the smaller one that also fits - the count is unchanged and
 * the bigger cookie is now free for someone greedier.
 *
 * Dry run on g = [1,2,3], s = [1,1]:
 *   sorted g = [1,2,3], s = [1,1], child = 0
 *   cookie 1 >= g[0]=1 -> feed, child = 1
 *   cookie 1 <  g[1]=2 -> skip cookie
 *   done -> 1
 *
 * EDGE CASES
 * - g = [], or s = []            -> 0
 * - all cookies too small        -> 0
 * - more cookies than children   -> at most g.length
 */

function bruteForce(g, s) {
  let best = 0;
  const usedCookie = new Array(s.length).fill(false);

  function tryChild(childIndex, fed) {
    best = Math.max(best, fed);
    if (childIndex === g.length) return;
    tryChild(childIndex + 1, fed);                       // skip this child
    for (let j = 0; j < s.length; j++) {
      if (!usedCookie[j] && s[j] >= g[childIndex]) {
        usedCookie[j] = true;
        tryChild(childIndex + 1, fed + 1);
        usedCookie[j] = false;
      }
    }
  }
  tryChild(0, 0);
  return best;
}

function optimal(g, s) {
  const greed = [...g].sort((a, b) => a - b);
  const sizes = [...s].sort((a, b) => a - b);

  let child = 0; // index of the least greedy child still hungry
  for (const size of sizes) {
    if (child === greed.length) break;      // everyone is fed
    if (size >= greed[child]) child++;      // this cookie satisfies the easiest child
    // else: this cookie is too small for everyone remaining, discard it
  }
  return child;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3], [1, 1]), 1);
  assert.strictEqual(solve([1, 2], [1, 2, 3]), 2);
  assert.strictEqual(solve([], [1, 2]), 0);
  assert.strictEqual(solve([1, 2], []), 0);
  assert.strictEqual(solve([10, 9, 8, 7], [5, 6, 7, 8]), 2);
  assert.strictEqual(solve([5, 5, 5], [1, 1, 1]), 0);
  assert.strictEqual(solve([2, 2], [3, 3, 3]), 2);
}
console.log('✓ 01-assign-cookies passed');

module.exports = { optimal, bruteForce };
