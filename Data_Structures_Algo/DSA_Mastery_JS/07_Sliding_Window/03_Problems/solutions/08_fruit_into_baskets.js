/**
 * 08. Fruit Into Baskets   (LeetCode 904 — Medium)
 *
 * PROBLEM
 * fruits[i] is the type of fruit on tree i. You have two baskets, each holds one type
 * (unlimited amount). Starting at any tree, pick one fruit from every tree moving right,
 * stopping when you'd need a third type. Return the max number of fruits you can pick.
 * In plain words: longest contiguous subarray with at most 2 distinct values.
 *
 * EXAMPLES
 * Input: [1, 2, 1]            Output: 3
 * Input: [0, 1, 2, 2]         Output: 3   Explanation: [1, 2, 2]
 * Input: [1, 2, 3, 2, 2]      Output: 4   Explanation: [2, 3, 2, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly 2 baskets = at most 2 distinct types? (yes; the code takes k as a parameter)
 * - Contiguous? (yes, you can't skip trees)
 * - Single tree? (1)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start, extend right while the distinct count stays <= 2.
 *
 * APPROACH 2 — Optimal (variable window, at most k distinct via Map)   O(n) time, O(k) space
 *   expand: counts[fruit]++
 *   while counts.size > 2: counts[fruits[left]]--, delete at 0, left++
 *   record right - left + 1
 * The Map's size IS the number of distinct types in the window, so deleting zero-count
 * entries is essential.
 *
 * Dry run on [1, 2, 3, 2, 2]:
 *   r=0 {1:1} len 1 | r=1 {1:1,2:1} len 2
 *   r=2 {1:1,2:1,3:1} size 3 -> drop 1 (left=1) {2:1,3:1} len 2
 *   r=3 {2:2,3:1} len 3 | r=4 {2:3,3:1} len 4
 *   best 4
 *
 * EDGE CASES
 * - All same type -> n
 * - Only 1 or 2 trees
 * - Empty -> 0
 * - Exactly 2 types alternating -> n
 */

function bruteForce(fruits, k = 2) {
  let best = 0;
  for (let start = 0; start < fruits.length; start++) {
    const types = new Set();
    for (let end = start; end < fruits.length; end++) {
      types.add(fruits[end]);
      if (types.size > k) break;
      best = Math.max(best, end - start + 1);
    }
  }
  return best;
}

function optimal(fruits, k = 2) {
  const counts = new Map(); // type -> count inside the window
  let left = 0;
  let best = 0;

  for (let right = 0; right < fruits.length; right++) {
    counts.set(fruits[right], (counts.get(fruits[right]) ?? 0) + 1);

    while (counts.size > k) {
      const leaving = fruits[left];
      counts.set(leaving, counts.get(leaving) - 1);
      if (counts.get(leaving) === 0) counts.delete(leaving); // keep size accurate
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 1]), 3);
  assert.strictEqual(solve([0, 1, 2, 2]), 3);
  assert.strictEqual(solve([1, 2, 3, 2, 2]), 4);
  assert.strictEqual(solve([3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]), 5);
  assert.strictEqual(solve([7, 7, 7]), 3);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([5]), 1);
  assert.strictEqual(solve([1, 2, 3, 4], 3), 3); // generalised k
}
console.log('✓ 08-fruit-into-baskets passed');

module.exports = { optimal, bruteForce };
