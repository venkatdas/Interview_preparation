/**
 * 18. Candy   (LeetCode 135 — Hard)
 *
 * PROBLEM
 * Children stand in a line with ratings. Each child gets at least 1 candy, and a child with
 * a higher rating than an immediate neighbour must get more candy than that neighbour.
 * Return the minimum total candies.
 *
 * EXAMPLES
 * Input: [1,0,2]     Output: 5   Explanation: candies 2,1,2
 * Input: [1,2,2]     Output: 4   Explanation: candies 1,2,1 (equal ratings need no relation)
 * Input: [1,3,4,5,2] Output: 11  Explanation: 1,2,3,4,1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Equal neighbours: any constraint? (no)
 * - Ratings can be any integers? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * Start everyone at 1. Repeatedly scan: if a child's rating is higher than a neighbour's but
 * candy is not higher, bump their candy to neighbour + 1. Repeat until no change.
 * Each pass fixes at least one child; at most n passes.
 *
 * APPROACH 2 — Optimal (two greedy passes)   O(n) time, O(n) space
 * Pass left-to-right: if rating[i] > rating[i-1], candy[i] = candy[i-1] + 1 (else 1).
 * This satisfies every "left neighbour" rule with the fewest candies.
 * Pass right-to-left: if rating[i] > rating[i+1], candy[i] = max(candy[i], candy[i+1] + 1).
 * The max keeps the left rule true while fixing the right rule.
 *
 * WHY GREEDY WORKS
 * Each pass independently computes the minimum candies forced by one direction: a rising run
 * of length L forces 1,2,...,L and nothing less works. Taking the max of the two minimums is
 * the smallest value satisfying both constraints at once, and raising a value to the max never
 * breaks the other direction (the other direction only required it to be at least something
 * smaller). So the result is feasible and pointwise minimal, hence minimal in total.
 *
 * Dry run on [1,0,2]:
 *   left pass : [1,1,2]   (0 is not > 1 -> 1;  2 > 0 -> 1+1)
 *   right pass: i=1: 0 > 2? no.  i=0: 1 > 0 -> max(1, 1+1)=2  -> [2,1,2] -> 5
 *
 * EDGE CASES
 * - single child -> 1
 * - all equal -> n
 * - strictly decreasing [5,4,3] -> 3+2+1 (right pass does all the work)
 */

function bruteForce(ratings) {
  const n = ratings.length;
  const candy = new Array(n).fill(1);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++) {
      if (i > 0 && ratings[i] > ratings[i - 1] && candy[i] <= candy[i - 1]) {
        candy[i] = candy[i - 1] + 1; changed = true;
      }
      if (i < n - 1 && ratings[i] > ratings[i + 1] && candy[i] <= candy[i + 1]) {
        candy[i] = candy[i + 1] + 1; changed = true;
      }
    }
  }
  return candy.reduce((sum, c) => sum + c, 0);
}

function optimal(ratings) {
  const n = ratings.length;
  if (n === 0) return 0;
  const candy = new Array(n).fill(1);

  // left -> right: satisfy "higher than left neighbour"
  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) candy[i] = candy[i - 1] + 1;
  }
  // right -> left: satisfy "higher than right neighbour" without breaking the left rule
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) candy[i] = Math.max(candy[i], candy[i + 1] + 1);
  }
  return candy.reduce((sum, c) => sum + c, 0);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 0, 2]), 5);
  assert.strictEqual(solve([1, 2, 2]), 4);
  assert.strictEqual(solve([1, 3, 4, 5, 2]), 11);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([3, 3, 3]), 3);
  assert.strictEqual(solve([5, 4, 3]), 6);
  assert.strictEqual(solve([1, 2, 3, 2, 1]), 9);
}
console.log('✓ 18-candy passed');

module.exports = { optimal, bruteForce };
