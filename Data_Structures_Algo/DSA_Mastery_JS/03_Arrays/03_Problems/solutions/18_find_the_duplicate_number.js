/**
 * 18. Find the Duplicate Number   (LeetCode 287 — Medium)
 *
 * PROBLEM
 * Given an array of n + 1 integers where each value is in the range [1, n], there is
 * exactly one value that repeats (it may repeat more than once). Return it.
 * Constraints: do NOT modify the array, use O(1) extra space.
 *
 * EXAMPLES
 * Input: [1, 3, 4, 2, 2]      Output: 2
 * Input: [3, 1, 3, 4, 2]      Output: 3
 * Input: [3, 3, 3, 3, 3]      Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly one duplicated value? (yes, possibly repeated many times)
 * - Values strictly in 1..n with length n + 1? (yes - so index 0 is never pointed to)
 * - Can I modify the array or use extra memory? (no / no - that rules out negation marking and a Set)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Compare every pair of indices and return the first equal pair's value.
 * (A Set gives O(n) time but O(n) space; sorting modifies the input.)
 *
 * APPROACH 2 — Optimal (Floyd's cycle detection / tortoise and hare)   O(n) time, O(1) space
 * Treat each index as a node that points to nums[index]. Starting from 0 we get a path
 * 0 -> nums[0] -> nums[nums[0]] -> ... Since values are in 1..n and there are n + 1
 * slots, two indices point to the same node (the duplicate), which is exactly a cycle
 * entrance in a linked list. This is "Linked List Cycle II" (15_Linked_Lists) in disguise.
 *   Phase 1: slow moves 1 step, fast moves 2 steps, until they meet inside the cycle.
 *   Phase 2: reset slow to 0, move both 1 step; where they meet is the cycle entrance
 *            = the duplicate value.
 *
 * Dry run on [1, 3, 4, 2, 2]:  (index -> value: 0->1, 1->3, 2->4, 3->2, 4->2)
 *   path from 0: 0 -> 1 -> 3 -> 2 -> 4 -> 2 -> 4 ...   (cycle is 2 <-> 4, entrance is 2)
 *   phase 1: slow = nums[0] = 1, fast = nums[nums[0]] = 3
 *            slow = nums[1] = 3, fast = nums[nums[3]] = nums[2] = 4
 *            slow = nums[3] = 2, fast = nums[nums[4]] = nums[2] = 4
 *            slow = nums[2] = 4, fast = nums[nums[4]] = 4      -> meet at 4
 *   phase 2: fromStart = 0, fromMeeting = 4
 *            fromStart = nums[0] = 1, fromMeeting = nums[4] = 2
 *            fromStart = nums[1] = 3, fromMeeting = nums[2] = 4
 *            fromStart = nums[3] = 2, fromMeeting = nums[4] = 2  -> meet at 2 -> answer 2
 *
 * EDGE CASES
 * - Duplicate repeated more than twice: [3, 3, 3, 3, 3] -> 3
 * - Two elements [1, 1] -> 1
 * - Duplicate is n (the largest value) or 1 (the smallest)
 */

function bruteForce(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return nums[i];
    }
  }
  return -1;
}

function optimal(nums) {
  // phase 1: find a meeting point inside the cycle
  let slow = nums[0];
  let fast = nums[nums[0]];
  while (slow !== fast) {
    slow = nums[slow];        // 1 step
    fast = nums[nums[fast]];  // 2 steps
  }

  // phase 2: the distance from the start to the entrance equals the distance from the
  // meeting point to the entrance (classic Floyd proof), so walk both at the same speed
  let fromStart = 0;
  let fromMeeting = slow;
  while (fromStart !== fromMeeting) {
    fromStart = nums[fromStart];
    fromMeeting = nums[fromMeeting];
  }
  return fromStart; // the cycle entrance is the value two indices point to: the duplicate
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3, 4, 2, 2]), 2);
  assert.strictEqual(solve([3, 1, 3, 4, 2]), 3);
  assert.strictEqual(solve([3, 3, 3, 3, 3]), 3);
  assert.strictEqual(solve([1, 1]), 1);
  assert.strictEqual(solve([2, 2, 2]), 2);
  assert.strictEqual(solve([1, 4, 4, 2, 3]), 4);
  assert.strictEqual(solve([2, 1, 1]), 1);
}
const untouched = [1, 3, 4, 2, 2];
optimal(untouched);
assert.deepStrictEqual(untouched, [1, 3, 4, 2, 2]); // input not modified
console.log('✓ 18-find-the-duplicate-number passed');

module.exports = { optimal, bruteForce };
